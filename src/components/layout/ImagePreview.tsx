import React, { forwardRef } from 'react';
import { IconPhoto } from '@tabler/icons-react';

interface ImagePreviewProps {
  hasImage: boolean;
}

export const ImagePreview = forwardRef<HTMLCanvasElement, ImagePreviewProps>(
  ({ hasImage }, ref) => {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#E5E5E5] overflow-auto">
        {!hasImage ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <IconPhoto className="w-12 h-12 text-gray-400" stroke={1.5} />
            <p className="text-gray-500 text-lg">
              Click the folder icon to open an image
            </p>
          </div>
        ) : (
          <canvas
            ref={ref}
            className="max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] object-contain"
          />
        )}
      </div>
    );
  }
);

ImagePreview.displayName = 'ImagePreview';
