use crate::image_processor::{add_border_with_exif, read_exif, ExifData};
use image::Rgba;
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn get_exif_data(path: String) -> Result<ExifData, String> {
    read_exif(&PathBuf::from(path)).map_err(|e| e.to_string())
}

#[command]
pub fn process_image(
    path: String,
    border_size: u32,
    text_color: Vec<u8>,
    background_color: Vec<u8>,
    output_path: String,
) -> Result<(), String> {
    let text_color = Rgba([text_color[0], text_color[1], text_color[2], text_color[3]]);
    let background_color = Rgba([
        background_color[0],
        background_color[1],
        background_color[2],
        background_color[3],
    ]);

    let result = add_border_with_exif(
        &PathBuf::from(path),
        border_size,
        text_color,
        background_color,
    )
    .map_err(|e| e.to_string())?;

    result
        .save(output_path)
        .map_err(|e| format!("Failed to save image: {}", e))?;

    Ok(())
}
