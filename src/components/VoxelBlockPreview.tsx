import React, { useRef, useEffect } from 'react';
import { BASE_TEXTURES, renderProceduralTexture } from '../utils/textureUtils';
import { Box } from 'lucide-react';

interface VoxelBlockPreviewProps {
  baseTexture: string;
  tintColor: string;
  useMultiplier: boolean;
  customImageData?: string;
  nodeName: string;
  lightSource?: number;
}

export const VoxelBlockPreview: React.FC<VoxelBlockPreviewProps> = ({
  baseTexture,
  tintColor,
  useMultiplier,
  customImageData,
  nodeName,
  lightSource = 0,
}) => {
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const selectedBase = BASE_TEXTURES.find((t) => t.id === baseTexture) || BASE_TEXTURES[0];

  useEffect(() => {
    const color = useMultiplier ? tintColor : '#ffffff';

    if (topCanvasRef.current) {
      renderProceduralTexture(topCanvasRef.current, selectedBase.pattern, color, customImageData);
    }
    if (leftCanvasRef.current) {
      renderProceduralTexture(leftCanvasRef.current, selectedBase.pattern, color, customImageData);
    }
    if (rightCanvasRef.current) {
      renderProceduralTexture(rightCanvasRef.current, selectedBase.pattern, color, customImageData);
    }
  }, [selectedBase, tintColor, useMultiplier, customImageData]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
        <Box className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-medium text-slate-300">Voxel 3D Isometric View</span>
      </div>

      {/* Isometric 3D Cube Container */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        {/* Glow halo if light_source > 0 */}
        {lightSource > 0 && (
          <div
            className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: tintColor || '#f59e0b',
              opacity: Math.min(0.8, lightSource * 0.05),
              transform: 'scale(1.2)',
            }}
          />
        )}

        <div
          className="relative w-20 h-20"
          style={{
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Face */}
          <div
            className="absolute inset-0 border border-black/30 shadow-sm"
            style={{
              transform: 'translateZ(40px)',
              filter: 'brightness(1.15)',
            }}
          >
            <canvas ref={topCanvasRef} width={64} height={64} className="w-full h-full image-pixelated" />
          </div>

          {/* Left Face */}
          <div
            className="absolute inset-0 border border-black/30 shadow-sm"
            style={{
              transformOrigin: 'bottom',
              transform: 'rotateX(-90deg) translateZ(-40px)',
              filter: 'brightness(0.85)',
            }}
          >
            <canvas ref={leftCanvasRef} width={64} height={64} className="w-full h-full image-pixelated" />
          </div>

          {/* Right Face */}
          <div
            className="absolute inset-0 border border-black/30 shadow-sm"
            style={{
              transformOrigin: 'right',
              transform: 'rotateY(90deg) translateZ(40px)',
              filter: 'brightness(0.70)',
            }}
          >
            <canvas ref={rightCanvasRef} width={64} height={64} className="w-full h-full image-pixelated" />
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <div className="text-xs font-semibold text-slate-200">{nodeName || 'Novo Bloco'}</div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          {lightSource > 0 && <span className="text-amber-400 mr-2">✦ Luz: {lightSource}</span>}
          <span>Luanti Voxel</span>
        </div>
      </div>
    </div>
  );
};
