import React from 'react';
import {
  IconFolderOpen,
  IconDownload,
  IconAdjustments,
  IconTypography,
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Label } from '../ui/label';

interface NavbarProps {
  onOpenFile: () => void;
  onSaveFile: () => void;
  hasImage: boolean;
  saving: boolean;
  borderSize: number;
  onBorderSizeChange: (size: number) => void;
  borderColor: string;
  onBorderColorChange: (color: string) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  iconSize: number;
  onIconSizeChange: (size: number) => void;
  copyright: string;
  onCopyrightChange: (text: string) => void;
  copyrightPosition: 'top' | 'bottom';
  onCopyrightPositionChange: (position: 'top' | 'bottom') => void;
}

const fontFamilies = [
  'ZCOOL Addict',
  'LLBlackMatrix',
  'Montserrat',
  'VonwaonBitmap',
  'Sacramento'
];

export function Navbar({
  onOpenFile,
  onSaveFile,
  hasImage,
  saving,
  borderSize,
  onBorderSizeChange,
  borderColor,
  onBorderColorChange,
  textColor,
  onTextColorChange,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  iconSize,
  onIconSizeChange,
  copyright,
  onCopyrightChange,
  copyrightPosition,
  onCopyrightPositionChange,
}: NavbarProps) {
  return (
    <div className="h-16 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenFile}
          className="h-9 w-9"
        >
          <IconFolderOpen className="h-5 w-5" />
        </Button>

        {hasImage && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSaveFile}
              disabled={saving}
              className="h-9 w-9"
            >
              <IconDownload className="h-5 w-5" />
            </Button>

            <div className="h-4 w-px bg-border mx-2" />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                >
                  <IconAdjustments className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <Tabs defaultValue="adjust" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="adjust">边框</TabsTrigger>
                    <TabsTrigger value="watermark">水印</TabsTrigger>
                  </TabsList>

                  <TabsContent value="adjust" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>边框大小</Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderSize}
                          onChange={(e) => onBorderSizeChange(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0px</span>
                          <span>50px</span>
                          <span>100px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>边框颜色</Label>
                        <div className="relative">
                          <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => onBorderColorChange(e.target.value)}
                            className="w-full h-9 rounded-md border-2 border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="watermark" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>文字颜色</Label>
                        <div className="relative">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => onTextColorChange(e.target.value)}
                            className="w-full h-9 rounded-md border-2 border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>字体</Label>
                        <select
                          value={fontFamily}
                          onChange={(e) => onFontFamilyChange(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {fontFamilies.map((font) => (
                            <option key={font} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>字体大小</Label>
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={fontSize}
                          onChange={(e) => onFontSizeChange(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>10px</span>
                          <span>17px</span>
                          <span>24px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>图标大小</Label>
                        <input
                          type="range"
                          min="16"
                          max="48"
                          value={iconSize}
                          onChange={(e) => onIconSizeChange(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>16px</span>
                          <span>32px</span>
                          <span>48px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>版权信息</Label>
                        <input
                          type="text"
                          value={copyright}
                          onChange={(e) => onCopyrightChange(e.target.value)}
                          placeholder="输入版权信息"
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>版权位置</Label>
                        <select
                          value={copyrightPosition}
                          onChange={(e) => onCopyrightPositionChange(e.target.value as 'top' | 'bottom')}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="top">水印区上方</option>
                          <option value="bottom">水印区下方</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <div className="text-sm font-medium">Photo Border</div>
    </div>
  );
}
