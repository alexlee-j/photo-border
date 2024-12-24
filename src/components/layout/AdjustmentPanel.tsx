import { IconPhoto, IconBrush, IconTypography } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface AdjustmentPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'system-ui'
];

export function AdjustmentPanel({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
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
}: AdjustmentPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>图片调整</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="adjust">
              <IconPhoto className="mr-2 h-4 w-4" />
              调整
            </TabsTrigger>
            <TabsTrigger value="border">
              <IconBrush className="mr-2 h-4 w-4" />
              边框
            </TabsTrigger>
            <TabsTrigger value="watermark">
              <IconTypography className="mr-2 h-4 w-4" />
              水印
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>边框大小</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[borderSize]}
                  onValueChange={([value]) => onBorderSizeChange(value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="border" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>边框颜色</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => onBorderColorChange(e.target.value)}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="watermark" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>文字颜色</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => onTextColorChange(e.target.value)}
                    className="w-8 h-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>字体</Label>
                <Select value={fontFamily} onValueChange={onFontFamilyChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>字体大小</Label>
                <Slider
                  min={10}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={([value]) => onFontSizeChange(value)}
                />
              </div>

              <div className="space-y-2">
                <Label>图标大小</Label>
                <Slider
                  min={16}
                  max={48}
                  step={1}
                  value={[iconSize]}
                  onValueChange={([value]) => onIconSizeChange(value)}
                />
              </div>

              <div className="space-y-2">
                <Label>版权信息</Label>
                <Input
                  value={copyright}
                  onChange={(e) => onCopyrightChange(e.target.value)}
                  placeholder="输入版权信息"
                />
              </div>

              <div className="space-y-2">
                <Label>版权位置</Label>
                <Select value={copyrightPosition} onValueChange={onCopyrightPositionChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">水印区上方</SelectItem>
                    <SelectItem value="bottom">水印区下方</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
