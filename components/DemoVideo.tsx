"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

interface DemoVideoProps {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  gradient: string;
}

const DemoVideo: React.FC<DemoVideoProps> = ({ 
  title, 
  description, 
  thumbnail, 
  videoUrl, 
  gradient 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // Ici vous pourriez intégrer une vraie vidéo ou un modal
    setTimeout(() => setIsPlaying(false), 3000); // Simulation
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className={`aspect-video ${gradient} flex items-center justify-center relative`}>
        {!isPlaying ? (
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-blue-100">{description}</p>
          </div>
        ) : (
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Lecture en cours...</h3>
            <p className="text-blue-100">Démonstration {title}</p>
          </div>
        )}
        <div 
          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handlePlay}
        >
          <Button className="bg-white text-black hover:bg-gray-100">
            {isPlaying ? 'En cours...' : 'Regarder la démo'}
          </Button>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-gray-600 text-sm">
          {thumbnail}
        </p>
      </div>
    </div>
  );
};

export default DemoVideo;
