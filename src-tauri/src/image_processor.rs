use anyhow::Result;
use exif::{In, Reader, Tag};
use image::{DynamicImage, GenericImageView, ImageBuffer, Rgba};
use serde::Serialize;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

#[derive(Debug, Serialize)]
pub struct ExifData {
    pub camera_make: Option<String>,
    pub camera_model: Option<String>,
    pub exposure_time: Option<String>,
    pub f_number: Option<String>,
    pub iso: Option<String>,
    pub focal_length: Option<String>,
    pub date_time: Option<String>,
}

pub fn read_exif(path: &Path) -> Result<ExifData> {
    let file = File::open(path)?;
    let reader = BufReader::new(&file);
    let exif = Reader::new().read_from_container(&mut BufReader::new(reader))?;

    Ok(ExifData {
        camera_make: exif
            .get_field(Tag::Make, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        camera_model: exif
            .get_field(Tag::Model, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        exposure_time: exif
            .get_field(Tag::ExposureTime, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        f_number: exif
            .get_field(Tag::FNumber, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        iso: exif
            .get_field(Tag::PhotographicSensitivity, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        focal_length: exif
            .get_field(Tag::FocalLength, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        date_time: exif
            .get_field(Tag::DateTime, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
    })
}

pub fn add_border_with_exif(
    image_path: &Path,
    border_size: u32,
    _text_color: Rgba<u8>,
    background_color: Rgba<u8>,
) -> Result<DynamicImage> {
    let img = image::open(image_path)?;
    let _exif_data = read_exif(image_path)?;

    let (width, height) = img.dimensions();
    let new_width = width + 2 * border_size;
    let new_height = height + 2 * border_size;

    let mut new_image = ImageBuffer::new(new_width, new_height);

    // Fill background
    for pixel in new_image.pixels_mut() {
        *pixel = background_color;
    }

    // Copy original image
    image::imageops::replace(&mut new_image, &img, border_size as i64, border_size as i64);

    Ok(DynamicImage::ImageRgba8(new_image))
}
