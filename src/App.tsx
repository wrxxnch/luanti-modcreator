import React, { useState } from 'react';
import { ModProject, CustomVariable, CustomNode, WoodSet, BiomeDefinition, ToolDefinition, FoodDefinition, PotionDefinition, EnchantmentDefinition, EntityDefinition } from './types/mod';
import { DAPPLED_FOREST_PRESET, BLANK_PRESET } from './utils/presets';
import { exportModToZip, downloadBlob } from './utils/zipExport';
import { Navbar } from './components/Navbar';
import { NodeEditor } from './components/NodeEditor';
import { WoodEditor } from './components/WoodEditor';
import { BiomeEditor } from './components/BiomeEditor';
import { ItemEditor } from './components/ItemEditor';
import { AdminPanel } from './components/AdminPanel';
import { CodeViewer } from './components/CodeViewer';
import {
  Box,
  TreePine,
  Compass,
  Sword,
  ShieldCheck,
  FileCode,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function App() {
  const [mod, setMod] = useState<ModProject>(DAPPLED_FOREST_PRESET);
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'woods' | 'biomes' | 'items' | 'admin' | 'code'>('overview');
  const [isExporting, setIsExporting] = useState(false);

  // Export ZIP
  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const blob = await exportModToZip(mod);
      downloadBlob(blob, `${mod.name}.zip`);
    } catch (err) {
      console.error('Failed to export ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.name) {
            setMod(parsed);
          }
        } catch (err) {
          console.error('Invalid mod JSON:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mod, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${mod.name}_project.json`);
    dlAnchorElem.click();
  };

  // Node Handlers
  const handleAddNode = (newNode: CustomNode) => {
    setMod((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
  };
  const handleUpdateNode = (index: number, updatedNode: CustomNode) => {
    setMod((prev) => {
      const newNodes = [...prev.nodes];
      newNodes[index] = updatedNode;
      return { ...prev, nodes: newNodes };
    });
  };
  const handleDeleteNode = (index: number) => {
    setMod((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((_, i) => i !== index),
    }));
  };

  // Wood Handlers
  const handleAddWoodSet = (newWood: WoodSet) => {
    setMod((prev) => ({ ...prev, woodSets: [...prev.woodSets, newWood] }));
  };
  const handleUpdateWoodSet = (index: number, updatedWood: WoodSet) => {
    setMod((prev) => {
      const newWoods = [...prev.woodSets];
      newWoods[index] = updatedWood;
      return { ...prev, woodSets: newWoods };
    });
  };
  const handleDeleteWoodSet = (index: number) => {
    setMod((prev) => ({
      ...prev,
      woodSets: prev.woodSets.filter((_, i) => i !== index),
    }));
  };

  // Biome Handlers
  const handleAddBiome = (newBiome: BiomeDefinition) => {
    setMod((prev) => ({ ...prev, biomes: [...prev.biomes, newBiome] }));
  };
  const handleUpdateBiome = (index: number, updatedBiome: BiomeDefinition) => {
    setMod((prev) => {
      const newBiomes = [...prev.biomes];
      newBiomes[index] = updatedBiome;
      return { ...prev, biomes: newBiomes };
    });
  };
  const handleDeleteBiome = (index: number) => {
    setMod((prev) => ({
      ...prev,
      biomes: prev.biomes.filter((_, i) => i !== index),
    }));
  };

  // Admin / Variable Handlers
  const handleUpdateGlobalVariables = (vars: CustomVariable[]) => {
    setMod((prev) => ({ ...prev, globalVariables: vars }));
  };
  const handleAddVariableToNode = (nodeId: string, variable: CustomVariable) => {
    setMod((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => {
        if (node.id === nodeId) {
          const exists = node.customVariables.some((v) => v.id === variable.id);
          const customVariables = exists
            ? node.customVariables.map((v) => (v.id === variable.id ? variable : v))
            : [...node.customVariables, variable];
          return { ...node, customVariables };
        }
        return node;
      }),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onExportZip={handleExportZip}
        isExporting={isExporting}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero / Mod Metadata Header */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Mineclonia / Luanti · BetterCraft Mod Studio
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {mod.title}
                </h1>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {mod.description}
                </p>

                {/* Quick Preset Buttons & GitHub Source Citation */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMod(DAPPLED_FOREST_PRESET)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-xs font-medium text-emerald-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Carregar Exemplo: Dappled Forest & Poplar
                  </button>

                  <button
                    type="button"
                    onClick={() => setMod(BLANK_PRESET)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                  >
                    Novo Mod em Branco
                  </button>

                  <a
                    href="https://github.com/wrxxnch/luanti-bettercraft"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors ml-auto"
                  >
                    <span>Repositório BetterCraft</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Metrics KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('nodes')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <Box className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    {mod.nodes.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                  Blocos (Nodes)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('woods')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <TreePine className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    {mod.woodSets.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                  Madeiras (Trees)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('biomes')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    {mod.biomes.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                  Biomas (Mapgen)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('items')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <Sword className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    {mod.tools.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                  Ferramentas
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('items')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    {mod.foods.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                  Comidas & Poções
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                    {mod.globalVariables.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                  Admin & Variáveis
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    ZIP
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                  Código & Export
                </div>
              </button>
            </div>

            {/* Mod Configuration Card (mod.conf fields) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Configurações Gerais do Mod (mod.conf)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nome Técnico (Pasta do Mod)</label>
                  <input
                    type="text"
                    value={mod.name}
                    onChange={(e) =>
                      setMod({
                        ...mod,
                        name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Título de Exibição</label>
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) => setMod({ ...mod, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Autor do Mod</label>
                  <input
                    type="text"
                    value={mod.author}
                    onChange={(e) => setMod({ ...mod, author: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Versão</label>
                  <input
                    type="text"
                    value={mod.version}
                    onChange={(e) => setMod({ ...mod, version: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Descrição do Mod</label>
                <textarea
                  rows={2}
                  value={mod.description}
                  onChange={(e) => setMod({ ...mod, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Save & Load JSON Project Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Salvar Projeto (.json)
                  </button>

                  <label className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    Carregar Projeto (.json)
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>

                <span className="text-[11px] text-slate-500">
                  Compatível com Mineclonia / Luanti 5.x+
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NODES & BLOCKS */}
        {activeTab === 'nodes' && (
          <NodeEditor
            nodes={mod.nodes}
            onAddNode={handleAddNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
          />
        )}

        {/* TAB 3: WOODS & TREES */}
        {activeTab === 'woods' && (
          <WoodEditor
            woodSets={mod.woodSets}
            onAddWoodSet={handleAddWoodSet}
            onUpdateWoodSet={handleUpdateWoodSet}
            onDeleteWoodSet={handleDeleteWoodSet}
          />
        )}

        {/* TAB 4: BIOMES & MAPGEN */}
        {activeTab === 'biomes' && (
          <BiomeEditor
            biomes={mod.biomes}
            onAddBiome={handleAddBiome}
            onUpdateBiome={handleUpdateBiome}
            onDeleteBiome={handleDeleteBiome}
          />
        )}

        {/* TAB 5: ITEMS & TOOLS */}
        {activeTab === 'items' && (
          <ItemEditor
            tools={mod.tools}
            foods={mod.foods}
            potions={mod.potions}
            enchantments={mod.enchantments}
            entities={mod.entities}
            onUpdateTools={(tools) => setMod((prev) => ({ ...prev, tools }))}
            onUpdateFoods={(foods) => setMod((prev) => ({ ...prev, foods }))}
            onUpdatePotions={(potions) => setMod((prev) => ({ ...prev, potions }))}
            onUpdateEnchantments={(enchantments) => setMod((prev) => ({ ...prev, enchantments }))}
            onUpdateEntities={(entities) => setMod((prev) => ({ ...prev, entities }))}
          />
        )}

        {/* TAB 6: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel
            mod={mod}
            onUpdateGlobalVariables={handleUpdateGlobalVariables}
            onAddVariableToNode={handleAddVariableToNode}
          />
        )}

        {/* TAB 7: CODE VIEWER & EXPORT */}
        {activeTab === 'code' && <CodeViewer mod={mod} />}
      </main>

      {/* Subtle, clean footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        BetterCraft Mod Studio · Compatível com Luanti (Minetest) e Mineclonia · Gerador Lua de Alta Fidelidade
      </footer>
    </div>
  );
}
