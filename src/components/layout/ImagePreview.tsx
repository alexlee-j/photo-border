import React from 'react';
import { IconPhoto } from '@tabler/icons-react';
import { Watermark } from '@/components/Watermark';
import { ExifData } from '@/types/index';
import '@/assets/fonts/fonts.css';

interface ImagePreviewProps {
  hasImage: boolean;
  originalImage: HTMLImageElement | null;
  exifData: ExifData | null;
  borderSize: number;
  borderColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  iconSize: number;
  copyright: string;
  copyrightPosition: 'top' | 'bottom';
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  hasImage,
  originalImage,
  exifData,
  borderSize,
  borderColor,
  textColor,
  fontFamily,
  fontSize,
  iconSize,
  copyright,
  copyrightPosition
}) => {
  if (!hasImage) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <IconPhoto className="w-12 h-12 text-gray-400" stroke={1.5} />
        <p className="text-gray-500 text-lg">
          点击左上角文件夹图标打开图片
        </p>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      style={{
        width: '1080px',
        margin: '0 auto',
      }}
    >
      {originalImage && (
        <>
          <img
            src={originalImage.src}
            alt="preview"
            style={{ 
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
          <Watermark
            exifData={exifData}
            borderColor={borderColor}
            textColor={textColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
            iconSize={iconSize}
            copyright={copyright}
            copyrightPosition={copyrightPosition}
          />
        </>
      )}
    </div>
  );
};
