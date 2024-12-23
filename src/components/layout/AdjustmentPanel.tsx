import { IconPhoto, IconBrush } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Slider } from '../ui/slider';

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
}

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
}: AdjustmentPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Image Adjustments</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust">
              <IconPhoto className="mr-2 h-4 w-4" />
              Adjust
            </TabsTrigger>
            <TabsTrigger value="border">
              <IconBrush className="mr-2 h-4 w-4" />
              Border
            </TabsTrigger>
          </TabsList>
          <TabsContent value="adjust" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Border Size</label>
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
                <label className="text-sm font-medium">Border Color</label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => onBorderColorChange(e.target.value)}
                  className="w-full h-10 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => onTextColorChange(e.target.value)}
                  className="w-full h-10 rounded-md"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
