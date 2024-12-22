use crate::image_processor::{add_border_with_exif, read_exif, ExifData};
use image::Rgba;
use std::path::{Path, PathBuf};
use tauri::command;

#[command]
pub fn get_exif_data(path: String) -> Result<ExifData, String> {
    read_exif(&PathBuf::from(path)).map_err(|e| e.to_string())
}

#[command]
pub fn process_image(
    path: &str,
    border_size: u32,
    text_color: [u8; 4],
    border_color: [u8; 4],
    output_path: &str,
) -> Result<(), String> {
    let text_color = Rgba(text_color);
    let border_color = Rgba(border_color);

    let result = add_border_with_exif(
        Path::new(path),
        border_size,
        text_color,
        border_color,
    )
    .and_then(|img| img.save(output_path).map_err(Into::into));

    result.map_err(|e| e.to_string())
}
