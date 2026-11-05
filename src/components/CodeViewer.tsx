import React, { useState } from 'react';
import { ModProject } from '../types/mod';
import { generateInitLua, generateLgRegisterLua, generateModConf, generateReadme } from '../utils/luaGenerator';
import { exportModToZip, downloadBlob } from '../utils/zipExport';
import { FileCode, Copy, Check, Download, FolderArchive, Sparkles } from 'lucide-react';

interface CodeViewerProps {
  mod: ModProject;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ mod }) => {
  const [activeFile, setActiveFile] = useState<'init.lua' | 'lg_register.lua' | 'mod.conf' | 'README.md'>('init.lua');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const initCode = generateInitLua(mod);
  const lgCode = generateLgRegisterLua(mod);
  const confCode = generateModConf(mod);
  const readmeCode = generateReadme(mod);

  const getCode = () => {
    switch (activeFile) {
      case 'init.lua':
        return initCode;
      case 'lg_register.lua':
        return lgCode;
      case 'mod.conf':
        return confCode;
      case 'README.md':
        return readmeCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([getCode()], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, activeFile);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await exportModToZip(mod);
      downloadBlob(zipBlob, `${mod.name}.zip`);
    } catch (err) {
      console.error('Failed to export zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const codeContent = getCode();
  const lineCount = codeContent.split('\n').length;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            Código Lua & Exportação para o Luanti / Mineclonia
          </h2>
          <p className="text-xs text-slate-400">
            Arquivos gerados com a sintaxe oficial do BetterCraft e Mineclonia. Pronto para colocar na pasta <code className="text-emerald-400">mods/</code>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-colors disabled:opacity-50"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{isExporting ? 'Compactando...' : 'Baixar Mod Completo (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Mockup */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Tab Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/80 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveFile('init.lua')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeFile === 'init.lua'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              init.lua
            </button>

            {mod.biomes.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveFile('lg_register.lua')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  activeFile === 'lg_register.lua'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                lg_register.lua
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveFile('mod.conf')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeFile === 'mod.conf'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              mod.conf
            </button>

            <button
              type="button"
              onClick={() => setActiveFile('README.md')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeFile === 'README.md'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              README.md
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              {lineCount} linhas · UTF-8
            </span>
            <button
              type="button"
              onClick={handleDownloadSingle}
              className="text-slate-400 hover:text-slate-200 p-1 text-xs"
              title="Baixar este arquivo"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-200 leading-relaxed flex">
          <div className="select-none text-slate-600 pr-4 text-right shrink-0 border-r border-slate-800/80 mr-4 font-mono">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="text-slate-200 overflow-x-auto flex-1 whitespace-pre font-mono">
            <code>{codeContent}</code>
          </pre>
        </div>
      </div>

      {/* Directory Structure Helper */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FolderArchive className="w-4 h-4 text-emerald-400" />
          Estrutura Gerada no Arquivo .ZIP do Mod
        </div>
        <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-400 space-y-1">
          <div>📁 {mod.name}/</div>
          <div className="pl-4">├── 📄 mod.conf <span className="text-slate-600">-- Nome e dependências</span></div>
          <div className="pl-4">├── 📄 init.lua <span className="text-slate-600">-- Registro de blocos, madeiras, ferramentas e admin</span></div>
          {mod.biomes.length > 0 && (
            <div className="pl-4">├── 📄 lg_register.lua <span className="text-slate-600">-- Biomas, vegetação, decorações MTS e mobs</span></div>
          )}
          <div className="pl-4">├── 📄 README.md <span className="text-slate-600">-- Instruções de instalação</span></div>
          <div className="pl-4">├── 📁 textures/ <span className="text-slate-600">-- Texturas PNG com cores aplicadas</span></div>
          {mod.biomes.length > 0 && (
            <div className="pl-4">└── 📁 schematics/ <span className="text-slate-600">-- Estruturas .MTS de árvores e biomas</span></div>
          )}
        </div>
      </div>
    </div>
  );
};
