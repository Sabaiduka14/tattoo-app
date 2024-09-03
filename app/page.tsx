"use client";

import { useEffect, useState } from 'react';
import { UploadDialog } from '@/components/UploadDialog';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TattooCard from '@/components/TattoCard';

export default function Home() {
  const [tattoos, setTattoos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTattoos = async (query: string) => {
    const { data, error } = await supabase
      .from('tattoos')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tattoos:', error);
    } else {
      setTattoos(data);
    }
  };

  useEffect(() => {
    fetchTattoos(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 md:flex-row justify-between">
        <div className='relative flex items-center gap-1 md:mb-0'>
          <Search className='text-neutral-500 absolute left-3 w-5 h-5 md:left-3 z-10' />
          <Input
            type="text"
            placeholder="Search tattoos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs w-full pl-10"
          />
        </div>
        <UploadDialog onUploadComplete={() => fetchTattoos(searchQuery)} />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tattoos.map((tattoo: any) => (
          <TattooCard key={tattoo.id} imageUrl={tattoo.image_url} title={tattoo.title} />
        ))}
      </div>
    </div>
  );
}
