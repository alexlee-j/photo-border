import React, { useState, useRef, useEffect, useCallback } from 'react';
import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { Navbar } from '@/components/layout/Navbar';
import { ImagePreview } from '@/components/layout/ImagePreview';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ExifData } from '@/types/index';
import html2canvas from 'html2canvas';
import { AdjustmentPanel } from '@/components/layout/AdjustmentPanel';

function App() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [borderSize, setBorderSize] = useState(0);
  const [borderColor, setBorderColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#999999');
  const [fontFamily, setFontFamily] = useState('LLBlackMatrix');
  const [fontSize, setFontSize] = useState(14);
  const [iconSize, setIconSize] = useState(32);
  const [copyright, setCopyright] = useState('');
  const [copyrightPosition, setCopyrightPosition] = useState<'top' | 'bottom'>('bottom');
  const [watermark, setWatermark] = useState(''); // 新增水印状态
  const [watermarkPosition, setWatermarkPosition] = useState<'top' | 'bottom'>('bottom'); // 新增水印位置状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);

  const loadImage = (url: string) => {
    const img = document.createElement('img');
    img.onload = () => {
      setOriginalImage(img);
      renderToCanvas();
    };
    img.src = url;
  };

  const renderToCanvas = useCallback(async () => {
    if (!canvasRef.current || !originalImage) return;

    const previewContainer = document.getElementById('preview-container');
    if (!previewContainer) return;

    // 临时显示预览容器以便 html2canvas 可以捕获
    previewContainer.style.display = 'block';
    
    const canvas = await html2canvas(previewContainer, {
      scale: 2, // 提高渲染质量
      useCORS: true,
      backgroundColor: borderColor,
      logging: false,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // 确保克隆的预览容器是可见的
        const clonedPreview = clonedDoc.getElementById('preview-container');
        if (clonedPreview) {
          clonedPreview.style.display = 'block';
        }
      }
    });

    // 隐藏预览容器
    previewContainer.style.display = 'none';

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸为预览容器的实际尺寸
    canvasRef.current.width = canvas.width;
    canvasRef.current.height = canvas.height;
    
    // 清除之前的内容
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制新内容
    ctx.drawImage(canvas, 0, 0);
  }, [borderColor, originalImage]);

  useEffect(() => {
    if (originalImage) {
      renderToCanvas();
    }
  }, [originalImage, renderToCanvas]);

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
        outputPath: savePath,
        watermark, // 新增水印参数
        watermarkPosition, // 新增水印位置参数
      });

      toast({
        title: "保存成功",
        description: "图片已成功保存。",
      });
    } catch (e) {
      console.error('Failed to save image:', e);
      toast({
        title: "保存失败",
        description: "图片保存过程中出现错误。",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar 
        onOpenFile={handleFileOpen} 
        onSaveFile={handleSave}
        hasImage={!!imagePath}
        saving={saving}
        borderSize={borderSize}
        onBorderSizeChange={setBorderSize}
        borderColor={borderColor}
        onBorderColorChange={setBorderColor}
        textColor={textColor}
        onTextColorChange={setTextColor}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        iconSize={iconSize}
        onIconSizeChange={setIconSize}
        copyright={copyright}
        onCopyrightChange={setCopyright}
        copyrightPosition={copyrightPosition}
        onCopyrightPositionChange={setCopyrightPosition}
        watermark={watermark} // 新增水印状态传递
        onWatermarkChange={setWatermark} // 新增水印处理函数
        watermarkPosition={watermarkPosition} // 新增水印位置状态传递
        onWatermarkPositionChange={setWatermarkPosition} // 新增水印位置处理函数
      />
      <div className="flex-1 relative">
        <ImagePreview
          ref={previewRef}
          hasImage={!!imagePath}
          originalImage={originalImage}
          exifData={exifData}
          borderSize={borderSize}
          borderColor={borderColor}
          textColor={textColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          iconSize={iconSize}
          copyright={copyright}
          copyrightPosition={copyrightPosition}
          watermark={watermark} // 新增水印状态传递
          watermarkPosition={watermarkPosition} // 新增水印位置状态传递
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
