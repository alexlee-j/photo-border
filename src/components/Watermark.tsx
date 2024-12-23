import React from 'react';
import styles from './Watermark.module.css';
import { ExifData } from '@/types/index';
import { getBrandIconClass } from '@/utils/brandIcons';

interface WatermarkProps {
  exifData: ExifData | null;
  textColor?: string;
  borderColor: string;
}

export const Watermark: React.FC<WatermarkProps> = ({ exifData, textColor = '#999999', borderColor }) => {
  if (!exifData) return null;

  const brandIconClass = getBrandIconClass(exifData.camera_make ?? '');
  
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
      // 其他可能的格式...
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
  
  return (
    <div className="flex justify-between h-16 text-sm" style={{ color: textColor, backgroundColor: borderColor }}>
      <div className={styles.leftSection}>
        <p className={styles.cameraModel}>{cameraModel}</p>
        <p className={styles.cameraMake}>{lensModel}</p>
      </div>
      
      <div className={styles.rightSection}>
        {brandIconClass && (
          <div className={styles.brandIconContainer}>
            <svg className={styles.brandIcon} viewBox="0 0 1024 1024">
              <use xlinkHref={`#${brandIconClass}`} />
            </svg>
          </div>
        )}
        <div className={styles.divider} style={{ backgroundColor: textColor }} />
        <div className={styles.infoContainer}>
          <div className={styles.shootingInfo}>
            <span>F{exifData.f_number}</span>
            <span>ISO{exifData.iso}</span>
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
};
