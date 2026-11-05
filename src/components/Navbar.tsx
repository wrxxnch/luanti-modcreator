import React from 'react';
import { Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'nodes' | 'woods' | 'biomes' | 'items' | 'admin' | 'code';
  onChangeTab: (tab: 'overview' | 'nodes' | 'woods' | 'biomes' | 'items' | 'admin' | 'code') => void;
  onExportZip: () => void;
  isExporting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  onExportZip,
  isExporting = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur px-6 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onChangeTab('overview');
          }}
          className="text-base font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
        >
          BetterCraft Mod Studio
        </a>
      </div>

      {/* Zone 2: 4-5 single-line clean text links / tabs */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => onChangeTab('overview')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Visão Geral
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('nodes')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'nodes' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Blocos & Nós
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('woods')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'woods' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Madeiras & Árvores
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('biomes')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'biomes' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Biomas & Geração
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('items')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'items' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Itens & Ferramentas
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('admin')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Painel Admin
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('code')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'code' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Código Lua
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onExportZip}
          disabled={isExporting}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExporting ? 'Exportando...' : 'Exportar Mod (.ZIP)'}</span>
        </button>
      </div>
    </header>
  );
};
