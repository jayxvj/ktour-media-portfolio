"use client";

import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

interface Viewer360Props {
  imageUrl: string;
  containerClass?: string;
}

export default function Viewer360({ imageUrl, containerClass = 'h-[500px]' }: Viewer360Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const psvInstance = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!viewerRef.current || !imageUrl) return;

    try {
      // Initialize PhotoSphereViewer with new v5 API
      psvInstance.current = new Viewer({
        container: viewerRef.current,
        panorama: imageUrl,
        navbar: [
          'zoom',
          'move',
          'fullscreen',
        ],
        defaultZoomLvl: 50,
        mousewheel: true,
        mousemove: true,
        loadingTxt: 'Loading 360° image...',
        touchmoveTwoFingers: true,
      });
    } catch (error) {
      console.error('Error initializing 360° viewer:', error);
    }

    return () => {
      psvInstance.current?.destroy();
      psvInstance.current = null;
    };
  }, [imageUrl]);

  return <div ref={viewerRef} className={`w-full rounded-lg overflow-hidden ${containerClass}`} />;
}