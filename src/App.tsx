import React, { useState, useRef, useEffect, useCallback } from 'react';
import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { Navbar } from '@/components/layout/Navbar';
import { ImagePreview } from '@/components/layout/ImagePreview';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ExifData } from '@/types/index';

function App() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [borderSize, setBorderSize] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const { toast } = useToast();

  const loadImage = (url: string) => {
    const img = document.createElement('img');
    img.onload = () => {
      setOriginalImage(img);
      renderPreview(img);
    };
    img.src = url;
  };

  const renderPreview = useCallback((img: HTMLImageElement) => {
    if (!canvasRef.current || !img) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = img;
    const watermarkHeight = 300;
    const newWidth = width + 2 * borderSize;
    const newHeight = height + 2 * borderSize + watermarkHeight;

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Fill entire canvas with border color
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, newHeight);

    // Draw white background for image area
    ctx.fillStyle = 'white';
    ctx.fillRect(borderSize, borderSize, width, height);

    // Draw the image
    ctx.drawImage(img, borderSize, borderSize, width, height);

    // Watermark area already has border color as background
    if (exifData) {
      const text = `${exifData.camera_make?.replace(/"/g, '')} ${exifData.camera_model?.replace(/"/g, '')} | ${exifData.lens_make?.split(',')[0].replace(/"/g, '')} ${exifData.lens_model?.split(',')[0].replace(/"/g, '')} | ${exifData.focal_length}mm f/${exifData.f_number} ${exifData.exposure_time}s ISO${exifData.iso}`;
      
      const fontSize = 48;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = newWidth / 2;
      const textY = height + borderSize + watermarkHeight / 2;
      ctx.fillText(text, textX, textY);
    }
  }, [borderSize, borderColor, textColor, exifData]);

  useEffect(() => {
    if (originalImage) {
      renderPreview(originalImage);
    }
  }, [originalImage, renderPreview]);

  const handleFileOpen = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg', 'jpeg']
        }]
      });

      if (selected) {
        setImagePath(selected);
        const url = convertFileSrc(selected);
        loadImage(url);

        const exifResult: ExifData = await invoke('get_exif_data', { path: selected });
        console.log(exifResult, 'exifResult');
        localStorage.setItem('exifData', JSON.stringify(exifResult));
        setExifData(exifResult);
      }
    } catch (e) {
      console.error('Failed to open file:', e);
    }
  };

  const convertHexToRgba = (hex: string): [number, number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const handleSave = async () => {
    if (!imagePath) return;

    try {
      setSaving(true);
      const originalName = imagePath.split('/').pop() || 'image';
      const nameWithoutExt = originalName.split('.')[0];
      
      const savePath = await save({
        filters: [{
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png']
        }],
        defaultPath: `${nameWithoutExt}_with_border.jpg`
      });

      if (!savePath) {
        setSaving(false);
        return;
      }

      await invoke('process_image', {
        path: imagePath,
        borderSize,
        textColor: convertHexToRgba(textColor),
        borderColor: convertHexToRgba(borderColor),
        outputPath: savePath
      });

      toast({
        title: "Image Saved",
        description: "Your image has been saved successfully.",
      });
    } catch (e) {
      console.error('Failed to save image:', e);
      toast({
        title: "Error",
        description: "Failed to save image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden overscroll-none">
      <Navbar
        onOpenFile={handleFileOpen}
        borderSize={borderSize}
        onBorderSizeChange={setBorderSize}
        borderColor={borderColor}
        onBorderColorChange={setBorderColor}
        textColor={textColor}
        onTextColorChange={setTextColor}
        hasImage={!!imagePath}
        onSaveFile={handleSave}
        saving={saving}
      />
      <ImagePreview ref={canvasRef} hasImage={!!imagePath} />
      <Toaster />
    </div>
  );
}

export default App;
