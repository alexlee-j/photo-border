import { ExifData } from '../types/exif';

interface WatermarkConfig {
  textColor: string;
  borderSize: number;
  watermarkHeight: number;
}

export const renderWatermark = async (
  ctx: CanvasRenderingContext2D,
  exifData: ExifData | null,
  config: WatermarkConfig,
  imageHeight: number
) => {
  if (!exifData) return;

  const { textColor, borderSize, watermarkHeight } = config;
  const watermarkY = imageHeight + borderSize;

  // 设置文本样式
  ctx.fillStyle = textColor;
  ctx.font = '14px LLBlackMatrix';
  ctx.textBaseline = 'middle';

  // 绘制相机信息
  const leftPadding = 60;
  const textY = watermarkY + watermarkHeight / 2;
  
  // 相机型号
  if (exifData.camera_model) {
    ctx.fillText(exifData.camera_model, leftPadding, textY - 10);
  }

  // 镜头信息
  if (exifData.lens_model) {
    const lensInfo = exifData.lens_model.split(',')[0];
    ctx.fillText(lensInfo, leftPadding, textY + 10);
  }

  // 拍摄参数
  const rightPadding = 60;
  const rightX = ctx.canvas.width - rightPadding;
  
  if (exifData.f_number) {
    ctx.fillText(`F${exifData.f_number}`, rightX - 200, textY);
  }
  
  if (exifData.iso) {
    ctx.fillText(`ISO ${exifData.iso}`, rightX - 140, textY);
  }
  
  if (exifData.focal_length) {
    ctx.fillText(`${exifData.focal_length}mm`, rightX - 80, textY);
  }
  
  if (exifData.exposure_time) {
    ctx.fillText(`${exifData.exposure_time}s`, rightX - 20, textY);
  }
};
