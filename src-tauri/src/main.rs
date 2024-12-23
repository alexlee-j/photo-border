// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod image_processor;

use tauri_plugin_fs::FsExt;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // 配置权限
            app.try_fs_scope().unwrap().allow_directory("/", true)?;
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::get_exif_data, commands::process_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
