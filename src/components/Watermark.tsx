import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import styles from './Watermark.module.css';
import { ExifData } from '@/types/index';
import { getBrandIconClass } from '@/utils/brandIcons';
import debounce from 'lodash/debounce';

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

export const Watermark = forwardRef<HTMLDivElement, WatermarkProps>(({
  exifData,
  textColor = '#999999',
  borderColor,
  fontFamily = 'LLBlackMatrix',
  fontSize = 14,
  iconSize = 32,
  copyright,
  copyrightPosition = 'bottom',
}, ref) => {
  const [brandIconUrl, setBrandIconUrl] = useState<string>('');
  const [debouncedCopyright, setDebouncedCopyright] = useState(copyright);

  const updateCopyright = useCallback(
    debounce((value: string | undefined) => {
      setDebouncedCopyright(value);
    }, 100),
    []
  );

  useEffect(() => {
    updateCopyright(copyright);
  }, [copyright, updateCopyright]);

  useEffect(() => {
    if (!exifData?.camera_make) return;

    const brandIconName = getBrandIconClass(exifData.camera_make);
    if (brandIconName) {
      setBrandIconUrl(brandIconName);
    }
  }, [exifData]);

  if (!exifData) return null;

  // 格式化 EXIF 数据字段
  const formatExifField = (field: string | undefined) =>
    field?.replace(/['"]/g, '') ?? '';
  if(!exifData.camera_make || !exifData.camera_model) return null

  const cameraMake = formatExifField(exifData.camera_make);
  const cameraModel = formatExifField(exifData.camera_model);
  const lensModel = formatExifField(exifData.lens_model?.split(',')[0]);

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
            <img
              src={new URL(`../assets/img/${brandIconUrl}.png`, import.meta.url).href}
              alt="Brand Icon"
              className={styles.brandIcon}
              style={{
                height: `${iconSize}px`,
              }}
            />
        )}
        <div
          className={styles.divider}
          style={{ backgroundColor: textColor }}
        />
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
            {exifData.date_time}
          </div>
        </div>
      </div>
    </div>
  );

  const Copyright = () =>
    debouncedCopyright ? (
      <div
        className={styles.copyright}
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
        }}
      >
        {debouncedCopyright}
      </div>
    ) : null;

  return (
    <div
      ref={ref}
      className={styles.watermark}
      style={{
        color: textColor,
        backgroundColor: borderColor,
        flexDirection: copyrightPosition === 'top' ? 'column' : 'column-reverse',
      }}
    >
      <Copyright />
      <WatermarkContent />
    </div>
  );
});