import React from 'react';
import {
  IconFolderOpen,
  IconDownload,
  IconAdjustments,
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

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
}

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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Border Size</label>
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
                    <label className="text-sm font-medium">Text Color</label>
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
                    <label className="text-sm font-medium">Border Color</label>
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
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <div className="text-sm font-medium">Photo Border</div>
    </div>
  );
}
