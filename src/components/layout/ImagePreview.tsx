import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { IconPhoto } from '@tabler/icons-react';
import { Watermark } from '@/components/Watermark';
import { ExifData } from '@/types/index';

interface ImagePreviewProps {
  hasImage: boolean;
  originalImage: HTMLImageElement | null;
  exifData: ExifData | null;
  borderSize: number;
  borderColor: string;
  textColor: string;
}

export const ImagePreview = forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ hasImage, originalImage, exifData, borderSize, borderColor, textColor }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgWidth, setImgWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(window.innerHeight -64 - 48);

    // 更新容器高度
    const updateContainerHeight = () => {
      const vh = window.innerHeight;
      const margin = 48+64;
      setContainerHeight(vh - margin);
    };

    // 监听窗口大小变化
    useEffect(() => {
      updateContainerHeight();
      window.addEventListener('resize', updateContainerHeight);
      return () => window.removeEventListener('resize', updateContainerHeight);
    }, []);

    // 监听 borderSize 变化
    useEffect(() => {
      updateContainerHeight();
    }, [borderSize]);

    // 监听图片加载和大小变化
    useEffect(() => {
      if (imgRef.current) {
        const updateWidth = () => {
          if (imgRef.current) {
            setImgWidth(imgRef.current.offsetWidth);
            updateContainerHeight(); // 图片加载完成后重新计算高度
          }
        };

        const resizeObserver = new ResizeObserver(updateWidth);
        resizeObserver.observe(imgRef.current);
        
        // 图片加载完成时更新
        imgRef.current.onload = updateWidth;
        
        // 初始状态也要更新一次
        updateWidth();

        return () => {
          resizeObserver.disconnect();
          if (imgRef.current) {
            imgRef.current.onload = null;
          }
        };
      }
    }, [originalImage]); // 当图片对象变化时重新设置监听

    // 计算图片最大高度
    const maxImageHeight = Math.max(0, containerHeight - 100 - (borderSize * 2));

    return (
      <div className="flex-1 flex items-center justify-center bg-[#E5E5E5] overflow-auto pointer-events-none">
        {!hasImage ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <IconPhoto className="w-12 h-12 text-gray-400" stroke={1.5} />
            <p className="text-gray-500 text-lg">
              Click the folder icon to open an image
            </p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="preview-container flex flex-col"
            style={{
              backgroundColor: borderColor,
              padding: borderSize,
              maxWidth: 'calc(100% - 3rem)',
              maxHeight: 'calc(100% - 3rem)',
            }}
          >
            {originalImage && (
              <>
                <img
                  ref={imgRef}
                  src={originalImage.src}
                  alt="Preview"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: `${maxImageHeight}px`,
                    width: 'auto',
                    height: 'auto'
                  }}
                />
                <div style={{ width: imgWidth || '100%' }}>
                  <Watermark 
                    exifData={exifData} 
                    textColor={textColor}
                    borderColor={borderColor}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

ImagePreview.displayName = 'ImagePreview';
