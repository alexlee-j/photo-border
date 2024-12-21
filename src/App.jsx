import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { MantineProvider, Container, Button, Group, Image, Paper, ColorInput, NumberInput, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

function App() {
  const [imagePath, setImagePath] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [borderSize, setBorderSize] = useState(100);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const handleSelectFile = async () => {
    try {
      const selected = await open({
        directory: false,
        multiple: false,
        filters: [{
          name: 'Images',
          extensions: ['jpg', 'jpeg', 'png']
        }]
      });
      
      if (selected !== null) {
        const path = selected;
        setImagePath(path);
        try {
          const exif = await invoke('get_exif_data', { path });
          setExifData(exif);
        } catch (e) {
          console.error('Failed to read EXIF:', e);
        }
      }
    } catch (e) {
      console.error('Failed to open file dialog:', e);
    }
  };

  const handleProcessImage = async () => {
    if (!imagePath) return;

    try {
      const outputPath = imagePath.replace(/\.[^/.]+$/, "") + "_with_border.jpg";
      await invoke('process_image', {
        path: imagePath,
        borderSize,
        textColor: hexToRgba(textColor),
        backgroundColor: hexToRgba(backgroundColor),
        outputPath
      });
      alert('Image processed successfully!');
    } catch (e) {
      console.error('Failed to process image:', e);
      alert('Failed to process image: ' + e);
    }
  };

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  return (
    <MantineProvider>
      <Container size="lg" py="xl">
        <Paper
          p="xl"
          onClick={handleSelectFile}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <IconUpload size={48} stroke={1.5} />
          <Text size="xl" mt="md">
            Click to select an image
          </Text>
        </Paper>

        {imagePath && (
          <>
            <Image
              src={`asset:///${imagePath}`}
              mt="xl"
              style={{ maxWidth: '100%', height: 'auto' }}
            />

            <Group grow mt="xl">
              <NumberInput
                label="Border Size"
                value={borderSize}
                onChange={(val) => setBorderSize(val)}
                min={50}
                max={500}
              />
              <ColorInput
                label="Text Color"
                value={textColor}
                onChange={setTextColor}
              />
              <ColorInput
                label="Background Color"
                value={backgroundColor}
                onChange={setBackgroundColor}
              />
            </Group>

            {exifData && (
              <Paper mt="xl" p="md">
                <Text size="lg" weight={500}>EXIF Data</Text>
                <Text>Camera: {exifData.camera_make} {exifData.camera_model}</Text>
                <Text>Exposure: {exifData.exposure_time}</Text>
                <Text>Aperture: {exifData.f_number}</Text>
                <Text>ISO: {exifData.iso}</Text>
                <Text>Focal Length: {exifData.focal_length}</Text>
                <Text>Date: {exifData.date_time}</Text>
              </Paper>
            )}

            <Group position="center" mt="xl">
              <Button onClick={handleProcessImage} size="lg">
                Process Image
              </Button>
            </Group>
          </>
        )}
      </Container>
    </MantineProvider>
  );
}

export default App;
