import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { CopyPlus, Plus, Upload } from 'lucide-react';

export function UploadDialog({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | any>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInput = () => {
    if (!file) {
      setError('Please select a file to upload.');
      return false;
    }
    if (!title.trim()) {
      setError('Please enter a title for the tattoo.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleUpload = async () => {
    if (!validateInput()) return;
    setUploading(true);
    try {
      const fileName = file ? `${Date.now()}-${file.name}` : '';
      const { data, error } = await supabase.storage
        .from('tattoos')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      console.log('File uploaded successfully:', data);

      // Store only the path, not the full URL
      const { data: tattoo, error: insertError } = await supabase
        .from('tattoos')
        .insert({ title, image_url: data.path })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting tattoo:', insertError);
        throw insertError;
      }

      console.log('Tattoo inserted successfully:', tattoo);
      onUploadComplete();
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
      setFile(null);
      setTitle('');
      
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>Upload <Upload className='w-4 h-4' /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a New Tattoo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
          />
          <Input
            placeholder="Tattoo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}