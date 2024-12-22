use anyhow::Result;
use exif::{In, Reader, Tag};
use image::{DynamicImage, GenericImageView, ImageBuffer, Rgba, RgbaImage};
use imageproc::drawing::{draw_text_mut, text_size};
use rusttype::{Font, Scale};
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
    pub lens_make: Option<String>,
    pub lens_model: Option<String>,
    pub focal_length_35mm: Option<String>,
    pub exposure_program: Option<String>,
    pub exposure_mode: Option<String>,
    pub metering_mode: Option<String>,
    pub flash: Option<String>,
    pub white_balance: Option<String>,
    pub exposure_bias: Option<String>,
    pub software: Option<String>,
    pub artist: Option<String>,
    pub copyright: Option<String>,
    pub gps_latitude: Option<String>,
    pub gps_longitude: Option<String>,
    pub image_width: Option<String>,
    pub image_height: Option<String>,
    pub orientation: Option<String>,
    pub scene_type: Option<String>,
    pub color_space: Option<String>,
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
        lens_make: exif
            .get_field(Tag::LensMake, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        lens_model: exif
            .get_field(Tag::LensModel, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        focal_length_35mm: exif
            .get_field(Tag::FocalLengthIn35mmFilm, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        exposure_program: exif
            .get_field(Tag::ExposureProgram, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        exposure_mode: exif
            .get_field(Tag::ExposureMode, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        metering_mode: exif
            .get_field(Tag::MeteringMode, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        flash: exif
            .get_field(Tag::Flash, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        white_balance: exif
            .get_field(Tag::WhiteBalance, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        exposure_bias: exif
            .get_field(Tag::ExposureBiasValue, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        software: exif
            .get_field(Tag::Software, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        artist: exif
            .get_field(Tag::Artist, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        copyright: exif
            .get_field(Tag::Copyright, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        gps_latitude: exif
            .get_field(Tag::GPSLatitude, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        gps_longitude: exif
            .get_field(Tag::GPSLongitude, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        image_width: exif
            .get_field(Tag::ImageWidth, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        image_height: exif
            .get_field(Tag::ImageLength, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        orientation: exif
            .get_field(Tag::Orientation, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        scene_type: exif
            .get_field(Tag::SceneCaptureType, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
        color_space: exif
            .get_field(Tag::ColorSpace, In::PRIMARY)
            .and_then(|f| f.display_value().to_string().into()),
    })
}

pub fn add_border_with_exif(
    image_path: &Path,
    border_size: u32,
    text_color: Rgba<u8>,
    border_color: Rgba<u8>,
) -> Result<DynamicImage> {
    let img = image::open(image_path)?;
    let exif_data = read_exif(image_path)?;

    let (width, height) = img.dimensions();
    let watermark_height = 300; // 增加水印区高度到300px
    let new_width = width + 2 * border_size;
    let new_height = height + 2 * border_size + watermark_height;

    let mut new_image: RgbaImage = ImageBuffer::new(new_width, new_height);

    // Fill border color
    for pixel in new_image.pixels_mut() {
        *pixel = border_color;
    }

    // Create white background for the image
    let white = Rgba([255, 255, 255, 255]);
    for y in border_size..height + border_size {
        for x in border_size..width + border_size {
            new_image.put_pixel(x, y, white);
        }
    }

    // Create white background for watermark area
    for y in (height + border_size)..(height + border_size + watermark_height) {
        for x in border_size..(width + border_size) {
            new_image.put_pixel(x, y, white);
        }
    }

    // Copy original image
    image::imageops::replace(&mut new_image, &img, border_size as i64, border_size as i64);

    // Load system font
    let font_paths = vec![
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/SFNSText.ttf",
        "/System/Library/Fonts/SFNSDisplay.ttf",
    ];

    let font_data = font_paths.iter()
        .find_map(|path| std::fs::read(path).ok())
        .expect("Could not find system font");

    let font = Font::try_from_vec(font_data)
        .expect("Could not load system font");

    // Prepare EXIF text
    let camera_info = format!(
        "{} {} | {} {} | {}mm f/{} {}s ISO{}",
        exif_data.camera_make.unwrap_or_default(),
        exif_data.camera_model.unwrap_or_default(),
        exif_data.lens_make.unwrap_or_default(),
        exif_data.lens_model.unwrap_or_default(),
        exif_data.focal_length.unwrap_or_default(),
        exif_data.f_number.unwrap_or_default(),
        exif_data.exposure_time.unwrap_or_default(),
        exif_data.iso.unwrap_or_default()
    )
    .replace("\"", "");

    // Fixed larger font size
    let scale = Scale::uniform(48.0);
    let (text_width, text_height) = text_size(scale, &font, &camera_info);
    
    let text_x = ((new_width as i32 - text_width) / 2).max(0);
    let text_y = height as i32 + border_size as i32 + ((watermark_height as i32 - text_height) / 2);

    // Draw text
    draw_text_mut(
        &mut new_image,
        text_color,
        text_x,
        text_y,
        scale,
        &font,
        &camera_info,
    );

    Ok(DynamicImage::ImageRgba8(new_image))
}
