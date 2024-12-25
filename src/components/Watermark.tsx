import React, { useState, useEffect } from 'react';
import styles from './Watermark.module.css';
import { ExifData } from '@/types/index';
import { getBrandIconClass } from '@/utils/brandIcons';

interface WatermarkProps {
  exifData: ExifData | null;
  textColor?: string;
  borderColor: string;
  fontFamily?: string;
  fontSize?: number;
  iconSize?: number;
  copyright?: string;
  copyrightPosition?: 'top' | 'bottom';
}

export const Watermark: React.FC<WatermarkProps> = ({
  exifData,
  textColor = '#999999',
  borderColor,
  fontFamily = 'LLBlackMatrix',
  fontSize = 14,
  iconSize = 32,
  copyright,
  copyrightPosition = 'bottom'
}) => {
  const [brandIconUrl, setBrandIconUrl] = useState<string>('');

  useEffect(() => {
    if (!exifData) return;

    const brandIconClass = getBrandIconClass(exifData.camera_make ?? '');
    if (!brandIconClass) return;

    // 获取SVG图标的实际内容
    const iconElement = document.querySelector(`#${brandIconClass}`);
    if (!iconElement) return;

    // 获取symbol中的path内容
    const pathContent = iconElement.querySelector('path')?.outerHTML || '';
    if (!pathContent) return;

    // 获取原始symbol的viewBox
    const symbolViewBox = iconElement.getAttribute('viewBox') || '0 0 1820 1024';

    // 创建新的SVG元素，直接包含路径内容
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', symbolViewBox);
    svg.setAttribute('width', `${iconSize}`);
    svg.setAttribute('height', `${Math.floor(iconSize * (1024/1820))}`); // 保持宽高比
    svg.setAttribute('fill', textColor);
    svg.innerHTML = pathContent;

    // 将SVG转换为base64
    const svgString = new XMLSerializer().serializeToString(svg);
    const base64 = btoa(unescape(encodeURIComponent(svgString)));
    const url = `data:image/svg+xml;base64,${base64}`;

    setBrandIconUrl(url);
  }, [exifData, iconSize, textColor]);

  if (!exifData) return null;

  // 移除相机品牌和型号中的引号
  const cameraMake = (exifData.camera_make ?? '').replace(/['"]/g, '');
  const cameraModel = (exifData.camera_model ?? '').replace(/['"]/g, '');
  const lensModel = (exifData.lens_model ?? '').split(',')[0].replace(/['"]/g, '');

  // 格式化时间
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';

    // 处理不同格式的日期字符串
    const formats = [
      // 标准ISO格式
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      // YYYY:MM:DD HH:MM:SS 格式
      /^\d{4}:\d{2}:\d{2}\s\d{2}:\d{2}:\d{2}/,
    ];

    let date: Date | null = null;

    // 尝试不同的格式解析
    for (const format of formats) {
      if (format.test(dateStr)) {
        const normalized = dateStr.replace(/:/g, '-').replace(/\s/, 'T');
        date = new Date(normalized);
        break;
      }
    }

    // 如果所有格式都失败，尝试直接解析
    if (!date || isNaN(date.getTime())) {
      date = new Date(dateStr);
    }

    // 如果仍然无效，返回空字符串
    if (!date || isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateStr);
      return '';
    }

    // 格式化日期
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  const WatermarkContent = () => (
    <div className={styles.exif}>
      <div
        className={styles.leftSection}
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
        }}
      >
        <p className={styles.cameraModel}>{cameraModel}</p>
        <p className={styles.cameraMake}>{lensModel}</p>
      </div>

      <div className={styles.rightSection}>
        {brandIconUrl && (
          <div
            className={styles.brandIconContainer}
            style={{
              width: `${iconSize}px`,
              height: `${Math.floor(iconSize * (1024/1820))}px` // 保持宽高比
            }}
          >
            <img
              src={brandIconUrl}
              alt="Brand Icon"
              className={styles.brandIcon}
              style={{
                width: '100%',
                height: '100%',
                color: textColor
              }}
            />
          </div>
        )}
        <div className={styles.divider} style={{ backgroundColor: textColor }} />
        <div
          className={styles.infoContainer}
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
          }}
        >
          <div className={styles.shootingInfo}>
            <span>F{exifData.f_number}</span>
            <span>ISO {exifData.iso}</span>
            <span>{exifData.focal_length}mm</span>
            <span>{exifData.exposure_time}s</span>
          </div>
          <div className={styles.timestamp}>
            {formatDate(exifData.date_time ?? undefined)}
          </div>
        </div>
      </div>
    </div>
  );

  const Copyright = () => copyright ? (
    <div
      className={styles.copyright}
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
      }}
    >
      {copyright}
    </div>
  ) : null;

  return (
    <div
      className={styles.watermark}
      style={{
        color: textColor,
        backgroundColor: borderColor,
        flexDirection: copyrightPosition === 'top' ? 'column' : 'column-reverse'
      }}
    >
      <Copyright />
      <WatermarkContent />
    </div>
  );
};
