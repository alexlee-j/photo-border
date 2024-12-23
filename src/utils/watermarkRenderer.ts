import { ExifData } from '../types/exif';
import { getBrandIconClass } from './brandIcons';
import { svgToBase64 } from './svgUtils';

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

  // 右下角品牌和参数信息
  const rightInfo = () => {
    // 绘制尼康Logo
    const brandIconClass = getBrandIconClass('nikon');
    if (brandIconClass) {
      const iconElement = document.querySelector(`#${brandIconClass}`);
      if (iconElement) {
        const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // 使用更大的尺寸
        const iconSize = 200;
        svgElem.setAttribute('width', `${iconSize}`);
        svgElem.setAttribute('height', `${iconSize}`);
        svgElem.setAttribute('viewBox', '0 0 1024 1024');
        
        const iconContent = iconElement.innerHTML;
        svgElem.innerHTML = iconContent;
        
        const pathElement = svgElem.querySelector('path');
        // if (pathElement) {
        //   pathElement.setAttribute('fill', '#FFD700'); // 使用金色
        // }

        return svgToBase64(svgElem, iconSize, iconSize).then(base64Data => {
          const iconImage = new Image();
          return new Promise<void>((resolve) => {
            iconImage.onload = () => {
              const rightPadding = 60;
              const iconX = ctx.canvas.width - rightPadding - iconSize;
              // 将logo放在水印区域的中间偏下位置
              const iconY = watermarkY + (watermarkHeight - iconSize) / 2 + 20;
              ctx.drawImage(iconImage, iconX, iconY, iconSize, iconSize);
              resolve();
            };
            iconImage.src = base64Data;
          });
        });
      }
    }
    return Promise.resolve();
  };

  // 绘制拍摄参数
  const drawShootingInfo = () => {
    ctx.save();
    
    // 使用更大的字体
    ctx.font = 'normal 60px system-ui';
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // 拍摄参数
    const shootingInfo = `${exifData?.focal_length || '0'}mm F${exifData?.f_number || ''} ${exifData?.exposure_time || ''}s ISO${exifData?.iso || ''}`;
    
    // 绘制文本
    const rightPadding = 200; // 考虑到更大的尼康logo的位置
    // 将文字放在水印区域的中间偏下位置
    const textY = watermarkY + watermarkHeight * 0.6;
    ctx.fillText(shootingInfo, ctx.canvas.width - rightPadding, textY);
    
    ctx.restore();
  };

  // 执行渲染
  try {
    await rightInfo();
    drawShootingInfo();
  } catch (error) {
    console.error('Error rendering watermark:', error);
  }
};
