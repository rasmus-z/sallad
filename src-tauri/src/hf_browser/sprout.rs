use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SproutGpu {
    #[serde(default)]
    memory_free: u64,
    #[serde(default)]
    device_type: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SproutSpecs {
    #[serde(default)]
    available_memory_bytes: u64,
    #[serde(default)]
    unified_memory: bool,
    #[serde(default)]
    gpus: Vec<SproutGpu>,
}

pub(super) struct SproutHardware {
    pub available_ram: u64,
    pub available_vram: Option<u64>,
    pub supports_gpu_offload: bool,
    pub unified: bool,
}

pub(super) async fn fetch_sprout_hardware(
    url: &str,
    api_key: Option<&str>,
) -> Result<SproutHardware, String> {
    let endpoint = format!("{}/specs", url.trim_end_matches('/'));
    let client = super::build_client()?;
    let mut request = client.get(&endpoint);
    if let Some(key) = api_key {
        if !key.trim().is_empty() {
            request = request.bearer_auth(key);
        }
    }

    let response = request
        .send()
        .await
        .map_err(|e| format!("Failed to reach Sprout at {endpoint}: {e}"))?;
    if !response.status().is_success() {
        return Err(format!(
            "Sprout at {endpoint} returned {}",
            response.status()
        ));
    }

    let specs: SproutSpecs = response
        .json()
        .await
        .map_err(|e| format!("Invalid Sprout response from {endpoint}: {e}"))?;

    Ok(derive_hardware(&specs))
}

fn derive_hardware(specs: &SproutSpecs) -> SproutHardware {
    let discrete_vram = specs
        .gpus
        .iter()
        .filter(|gpu| gpu.device_type != "IntegratedGpu")
        .map(|gpu| gpu.memory_free)
        .max();
    let all_integrated = !specs.gpus.is_empty() && discrete_vram.is_none();

    let (available_vram, supports_gpu_offload) = match discrete_vram {
        Some(vram) => (Some(vram), true),
        None if all_integrated => (specs.gpus.iter().map(|gpu| gpu.memory_free).max(), true),
        None => (None, false),
    };

    SproutHardware {
        available_ram: specs.available_memory_bytes,
        available_vram,
        supports_gpu_offload,
        unified: specs.unified_memory || all_integrated,
    }
}
