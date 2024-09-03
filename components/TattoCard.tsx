import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface TattooCardProps {
  imageUrl: string;
  title: string;
}

export default function TattooCard({ imageUrl }: TattooCardProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('tattoos').getPublicUrl(path);
    return data.publicUrl;
  };

  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => setIsFullScreen(false);

  const handleDownload = () => {
    const url = getImageUrl(imageUrl);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'tattoo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => console.error('Error downloading image:', error));
  };

  const handleShare = () => {
    const url = getImageUrl(imageUrl);
    if (navigator.share) {
      navigator.share({
        title: 'Tattoo Image',
        text: 'Check out this tattoo image!',
        url: url,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      alert('Share functionality is not supported in your browser.');
    }
  };

  return (
    <>
      <Card className="overflow-hidden group cursor-pointer" onClick={openFullScreen}>
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={getImageUrl(imageUrl)}
              alt="Tattoo"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardContent>
      </Card>

      {isFullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative">
            <Image
              src={getImageUrl(imageUrl)}
              alt="Tattoo"
              width={500}
              height={300}
              className="object-contain"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button size="icon" variant="ghost" className="text-white" onClick={handleDownload}>
                <Download />
              </Button>
              <Button size="icon" variant="ghost" className="text-white" onClick={handleShare}>
                <Share2 className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white" onClick={closeFullScreen}>
                <X />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}