export interface ExifData {
  camera_make?: string | null; // 相机品牌
  camera_model?: string | null; // 相机型号
  exposure_time?: string | null; // 曝光时间
  f_number?: string | null; // 光圈值
  iso?: string | null; // ISO
  focal_length?: string | null; // 焦距
  date_time?: string | null; // 拍摄时间
  lens_make?: string | null; // 镜头品牌
  lens_model?: string | null; // 镜头型号
  focal_length_35mm?: string | null; // 35mm 等效焦距
  exposure_program?: string | null; // 曝光模式
  exposure_mode?: string | null; // 曝光方式
  metering_mode?: string | null; // 测光模式
  flash?: string | null; // 闪光灯信息
  white_balance?: string | null; // 白平衡模式
  exposure_bias?: string | null; // 曝光补偿
  software?: string | null; // 处理软件
  artist?: string | null; // 作者信息
  copyright?: string | null; // 版权信息
  gps_latitude?: number | null; // GPS 纬度
  gps_longitude?: number | null; // GPS 经度
  image_width?: number | null; // 图像宽度
  image_height?: number | null; // 图像高度
  orientation?: string | null; // 图片方向
  scene_type?: string | null; // 场景类型
  color_space?: string | null; // 色彩空间
}
