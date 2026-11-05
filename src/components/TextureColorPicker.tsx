import React, { useRef, useEffect } from 'react';
import { BASE_TEXTURES, COLOR_PRESETS, renderProceduralTexture, formatLuantiTexture, BaseTextureOption } from '../utils/textureUtils';
import { Palette, Upload, Image as ImageIcon } from 'lucide-react';

interface TextureColorPickerProps {
  baseTexture: string;
  tintColor: string;
  useMultiplier: boolean;
  customImageData?: string;
  customFileName?: string;
  onChangeBaseTexture: (texture: string) => void;
  onChangeTintColor: (color: string) => void;
  onChangeUseMultiplier: (use: boolean) => void;
  onUploadCustomImage: (dataUrl: string, fileName: string) => void;
  onClearCustomImage: () => void;
  label?: string;
  categoryFilter?: BaseTextureOption['category'];
}

export const TextureColorPicker: React.FC<TextureColorPickerProps> = ({
  baseTexture,
  tintColor,
  useMultiplier,
  customImageData,
  customFileName,
  onChangeBaseTexture,
  onChangeTintColor,
  onChangeUseMultiplier,
  onUploadCustomImage,
  onClearCustomImage,
  label = 'Textura e Modificador de Cor',
  categoryFilter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBase = BASE_TEXTURES.find((t) => t.id === baseTexture) || BASE_TEXTURES[0];
  const filteredTextures = categoryFilter
    ? BASE_TEXTURES.filter((t) => t.category === categoryFilter || t.category === 'misc')
    : BASE_TEXTURES;

  useEffect(() => {
    if (canvasRef.current) {
      renderProceduralTexture(
        canvasRef.current,
        selectedBase.pattern,
        useMultiplier ? tintColor : '#ffffff',
        customImageData
      );
    }
  }, [selectedBase, tintColor, useMultiplier, customImageData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomImage(result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const formattedLuanti = customImageData
    ? customFileName || 'custom_texture.png'
    : formatLuantiTexture(baseTexture, tintColor, useMultiplier);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-emerald-400" />
          {label}
        </label>
        <span className="text-xs text-slate-400 font-mono">
          Luanti Mod: <code className="text-emerald-400">{formattedLuanti}</code>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Live Canvas Preview */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shadow-inner flex items-center justify-center p-1">
            <canvas
              ref={canvasRef}
              width={64}
              height={64}
              className="w-full h-full image-pixelated rounded"
            />
          </div>
          <span className="text-[11px] text-slate-400">16x16 Preview</span>
        </div>

        {/* Texture Selection & Color Multiplier Controls */}
        <div className="flex-1 space-y-3 w-full">
          {!customImageData ? (
            <>
              {/* Base Texture Dropdown */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Textura Base do Mineclonia / Luanti</label>
                <select
                  value={baseTexture}
                  onChange={(e) => onChangeBaseTexture(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {filteredTextures.map((tex) => (
                    <option key={tex.id} value={tex.id}>
                      {tex.name} ({tex.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tint / Color Multiplier Toggle & Color Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useMultiplier}
                      onChange={(e) => onChangeUseMultiplier(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-800 w-3.5 h-3.5"
                    />
                    <span>Ativar Modificador <code className="text-emerald-400 font-mono">^[multiply:#HEX</code></span>
                  </label>
                  {useMultiplier && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tintColor}
                        onChange={(e) => onChangeTintColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={tintColor}
                        onChange={(e) => onChangeTintColor(e.target.value)}
                        placeholder="#d97706"
                        className="w-24 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-200"
                      />
                    </div>
                  )}
                </div>

                {/* Preset Chips */}
                {useMultiplier && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => onChangeTintColor(preset.hex)}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  Imagem Customizada Carregada ({customFileName || 'arquivo.png'})
                </span>
                <button
                  type="button"
                  onClick={onClearCustomImage}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Remover e usar textura padrão
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Esta imagem será salva automaticamente na pasta <code className="text-emerald-400">textures/</code> do mod no download ZIP.
              </p>
            </div>
          )}

          {/* Custom Upload Trigger */}
          <div className="pt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{customImageData ? 'Trocar arquivo de imagem PNG...' : 'Ou enviar imagem customizada (PNG 16x16 / 32x32)...'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
