import React, { useState, useRef, useEffect, useCallback } from 'react';
import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { IconPhoto } from '@tabler/icons-react';
import { Navbar } from '@/components/layout/Navbar';
import { ImagePreview } from '@/components/layout/ImagePreview';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ExifData } from '@/types/index';
import { Watermark } from '@/components/Watermark';

const App: React.FC = () => {
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
  const [watermark, setWatermark] = useState(''); 
  const [watermarkPosition, setWatermarkPosition] = useState<'top' | 'bottom'>('bottom'); 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);
  const [exportQuality, setExportQuality] = useState<'lossless' | 'lossy'>('lossless');

  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const hiddenPreview = document.getElementById('hidden-preview');
    if (!hiddenPreview) return;

    // 清除之前的延时渲染
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // 使用延时来防止频繁渲染
    renderTimeoutRef.current = setTimeout(async () => {
      try {
        // 计算最终图片的尺寸
        const containerWidth = 1080;
        const imgAspectRatio = originalImage.naturalHeight / originalImage.naturalWidth;
        const containerHeight = containerWidth * imgAspectRatio;

        // 设置隐藏预览区域的尺寸
        hiddenPreview.style.width = `${containerWidth}px`;
        
        // 临时将隐藏区域移到可视区域以确保完整渲染
        const originalStyles = {
          position: hiddenPreview.style.position,
          left: hiddenPreview.style.left,
          top: hiddenPreview.style.top,
          visibility: hiddenPreview.style.visibility
        };

        hiddenPreview.style.position = 'fixed';
        hiddenPreview.style.left = '0';
        hiddenPreview.style.top = '0';
        hiddenPreview.style.visibility = 'hidden';
        hiddenPreview.style.zIndex = '-1';
        hiddenPreview.style.pointerEvents = 'none';
        hiddenPreview.style.overflow = 'visible';

        // 处理SVG图标
        const uses = hiddenPreview.querySelectorAll('use');
        for (const use of uses) {
          const href = use.getAttribute('xlink:href') || use.getAttribute('href');
          if (!href) continue;

          const iconId = href.split('#')[1];
          const symbol = document.querySelector(`#${iconId}`);
          if (symbol) {
            const parentSvg = use.closest('svg');
            if (parentSvg) {
              parentSvg.innerHTML = symbol.innerHTML;
              // 设置SVG的颜色
              parentSvg.setAttribute('fill', textColor);
            }
          }
        }

        // 等待一帧以确保样式更新
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // 动态导入 html2canvas
        const { default: html2canvas } = await import('html2canvas');
        
        // 计算水印区域的高度
        const watermarkHeight = watermarkRef.current?.offsetHeight || 0;
        
        // 等待一帧以确保水印区域渲染完成
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        const totalHeight = Math.ceil(containerHeight + borderSize * 2 + watermarkHeight);
        
        const canvas = await html2canvas(hiddenPreview, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0,
          width: containerWidth,
          height: totalHeight,
          onclone: (clonedDoc) => {
            const clonedPreview = clonedDoc.getElementById('hidden-preview');
            if (clonedPreview) {
              clonedPreview.style.visibility = 'visible';
              clonedPreview.style.position = 'static';
              clonedPreview.style.transform = 'none';
              clonedPreview.style.width = `${containerWidth}px`;
              clonedPreview.style.height = `${totalHeight}px`;
              
              // 确保水印区域可见
              const watermarkContainer = clonedPreview.querySelector('[class*="watermark"]');
              if (watermarkContainer) {
                (watermarkContainer as HTMLElement).style.position = 'relative';
                (watermarkContainer as HTMLElement).style.visibility = 'visible';
                (watermarkContainer as HTMLElement).style.height = `${watermarkHeight}px`;
              }
            }
          }
        });

        // 创建一个新的画布来绘制带边框的图像
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height;
        
        const finalCtx = finalCanvas.getContext('2d');
        if (!finalCtx) return;

        // 绘制背景色（边框颜色）
        finalCtx.fillStyle = borderColor;
        finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // 绘制转换后的图像
        finalCtx.drawImage(canvas, 0, 0);

        // 将最终结果绘制到显示用的画布上
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !canvasRef.current) return;

        canvasRef.current.width = finalCanvas.width;
        canvasRef.current.height = finalCanvas.height;
        ctx.drawImage(finalCanvas, 0, 0);
      } catch (error) {
        console.error('Error rendering canvas:', error);
        toast({
          title: '渲染失败',
          description: '图片渲染时发生错误，请重试',
          variant: 'destructive',
        });
      }
    }, 100);
  }, [borderSize, borderColor, originalImage, copyrightPosition, textColor, toast]);

  useEffect(() => {
    if (originalImage) {
      renderToCanvas();
    }
  }, [
    originalImage,
    borderSize,
    borderColor,
    textColor,
    fontFamily,
    fontSize,
    iconSize,
    copyright,
    copyrightPosition,
    renderToCanvas
  ]);

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
    if (!canvasRef.current || !imagePath) return;

    try {
      setSaving(true);
      const originalName = imagePath.split('/').pop() || 'image';
      const nameWithoutExt = originalName.split('.')[0];
      
      const savePath = await save({
        filters: [{
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png']
        }],
        defaultPath: `${nameWithoutExt}_with_border${exportQuality === 'lossless' ? '.png' : '.jpg'}`
      });

      if (!savePath) {
        setSaving(false);
        return;
      }

      // 获取canvas的数据URL
      const dataUrl = canvasRef.current.toDataURL(
        exportQuality === 'lossless' ? 'image/png' : 'image/jpeg',
        exportQuality === 'lossless' ? undefined : 0.92
      );
      
      // 将base64转换为二进制
      const base64Data = dataUrl.split(',')[1];
      
      // 调用后端保存图片
      await invoke('save_base64_image', {
        base64Data,
        outputPath: savePath
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
    <div className="h-screen w-screen flex flex-col overflow-hidden">
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
        exportQuality={exportQuality}
        onExportQualityChange={setExportQuality}
      />
      
      {/* 隐藏的预览区域 */}
      <div 
        id="hidden-preview"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          visibility: 'hidden',
          padding: `${borderSize}px`,
          backgroundColor: borderColor,
        }}
      >
        {originalImage && (
          <>
            <img
              src={originalImage.src}
              alt="hidden preview"
              style={{ 
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            <Watermark
              ref={watermarkRef}
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

      {/* 实际预览区域 */}
      <div className="flex-1 flex items-center justify-center bg-[#E5E5E5] overflow-auto">
        {!imagePath ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <IconPhoto className="w-12 h-12 text-gray-400" stroke={1.5} />
            <p className="text-gray-500 text-lg">点击左上角文件夹图标打开图片</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{
              backgroundColor: borderColor,
            }}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default App;
