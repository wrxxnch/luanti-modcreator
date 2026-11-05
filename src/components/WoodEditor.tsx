import React, { useState } from 'react';
import { WoodSet } from '../types/mod';
import { TreePine, Plus, Trash2, CheckCircle2, Palette, Shield, Navigation } from 'lucide-react';
import { COLOR_PRESETS } from '../utils/textureUtils';

interface WoodEditorProps {
  woodSets: WoodSet[];
  onAddWoodSet: (wood: WoodSet) => void;
  onUpdateWoodSet: (index: number, wood: WoodSet) => void;
  onDeleteWoodSet: (index: number) => void;
}

export const WoodEditor: React.FC<WoodEditorProps> = ({
  woodSets,
  onAddWoodSet,
  onUpdateWoodSet,
  onDeleteWoodSet,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleCreateNewWood = () => {
    const num = woodSets.length + 1;
    const newWood: WoodSet = {
      id: `wood_type_${num}`,
      name: `Madeira Nova ${num}`,
      plankColor: '#ca8a04',
      barkColor: '#78350f',
      leavesColor: '#d97706',
      hasLeaves: true,
      hasSapling: true,
      hasSlabAndStairs: true,
      hasFenceAndGate: true,
      hasDoorAndTrapdoor: true,
      hasBoat: true,
      hasSign: true,
      hasPressurePlateAndButton: true,
      baseBarkTexture: 'mcl_trees_tree_oak.png',
      basePlankTexture: 'mcl_trees_wood_oak.png',
      baseLeavesTexture: 'mcl_trees_leaves_oak.png',
      customVariables: [],
    };
    onAddWoodSet(newWood);
    setSelectedIndex(woodSets.length);
  };

  const activeWood = woodSets[selectedIndex];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400" />
            Gerador de Tipos de Madeira (dappled_forest/init.lua & mcl_trees)
          </h2>
          <p className="text-xs text-slate-400">
            Gera o conjunto completo: troncos, tábuas, folhas, mudas, escadas, cercas, portas, barcos (<code className="text-emerald-400">mcl_boats</code>) e receitas.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNewWood}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Tipo de Madeira
        </button>
      </div>

      {woodSets.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
          <TreePine className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-300">Nenhum tipo de madeira configurado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Crie um novo conjunto de madeira como Álamo (Poplar), Jacarandá, Cerejeira ou Ébano.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wood Set Selector */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Madeiras Cadastradas ({woodSets.length})
            </span>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {woodSets.map((wood, idx) => (
                <button
                  key={wood.id || idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedIndex === idx
                      ? 'border-emerald-500 bg-emerald-950/20 text-slate-100 shadow-sm'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded shrink-0 border border-black/30"
                      style={{ backgroundColor: wood.plankColor }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{wood.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{wood.id}</div>
                    </div>
                  </div>
                  {woodSets.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWoodSet(idx);
                        if (selectedIndex >= idx && selectedIndex > 0) {
                          setSelectedIndex(selectedIndex - 1);
                        }
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Wood Details */}
          {activeWood && (
            <div className="lg:col-span-9 space-y-6">
              {/* Basic Details */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Nome do Conjunto de Madeira</label>
                    <input
                      type="text"
                      value={activeWood.name}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, name: e.target.value })
                      }
                      placeholder="Ex: Poplar (Álamo)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Identificador Técnico (ID)</label>
                    <input
                      type="text"
                      value={activeWood.id}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, {
                          ...activeWood,
                          id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                        })
                      }
                      placeholder="Ex: poplar"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Color Multipliers Configuration for Wood, Bark and Leaves */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-400" />
                    Modificadores de Cor (<code className="text-emerald-400">^[multiply:#HEX</code>)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Plank Color */}
                    <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">Tábuas (Planks)</span>
                        <input
                          type="color"
                          value={activeWood.plankColor}
                          onChange={(e) =>
                            onUpdateWoodSet(selectedIndex, { ...activeWood, plankColor: e.target.value })
                          }
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={activeWood.plankColor}
                        onChange={(e) =>
                          onUpdateWoodSet(selectedIndex, { ...activeWood, plankColor: e.target.value })
                        }
                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-mono text-slate-200"
                      />
                      <div className="w-full h-8 rounded border border-black/40 shadow-inner" style={{ backgroundColor: activeWood.plankColor }} />
                    </div>

                    {/* Bark Color */}
                    <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">Casca do Tronco (Bark)</span>
                        <input
                          type="color"
                          value={activeWood.barkColor}
                          onChange={(e) =>
                            onUpdateWoodSet(selectedIndex, { ...activeWood, barkColor: e.target.value })
                          }
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={activeWood.barkColor}
                        onChange={(e) =>
                          onUpdateWoodSet(selectedIndex, { ...activeWood, barkColor: e.target.value })
                        }
                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-mono text-slate-200"
                      />
                      <div className="w-full h-8 rounded border border-black/40 shadow-inner" style={{ backgroundColor: activeWood.barkColor }} />
                    </div>

                    {/* Leaves Color */}
                    <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">Folhas (Leaves)</span>
                        <input
                          type="color"
                          value={activeWood.leavesColor}
                          onChange={(e) =>
                            onUpdateWoodSet(selectedIndex, { ...activeWood, leavesColor: e.target.value })
                          }
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={activeWood.leavesColor}
                        onChange={(e) =>
                          onUpdateWoodSet(selectedIndex, { ...activeWood, leavesColor: e.target.value })
                        }
                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-mono text-slate-200"
                      />
                      <div className="w-full h-8 rounded border border-black/40 shadow-inner" style={{ backgroundColor: activeWood.leavesColor }} />
                    </div>
                  </div>

                  {/* Quick Palette Tints */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-500 mr-2 flex items-center">Predefinições:</span>
                    {COLOR_PRESETS.slice(0, 6).map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          onUpdateWoodSet(selectedIndex, {
                            ...activeWood,
                            plankColor: preset.hex,
                            leavesColor: preset.hex,
                          })
                        }
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 flex items-center gap-1.5"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-Components Checklist */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Módulos de Itens e Blocos a Serem Registrados
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeWood.hasLeaves}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, hasLeaves: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <span className="text-xs text-slate-200 font-medium">Folhas (leaves_{activeWood.id})</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeWood.hasSapling}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, hasSapling: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <span className="text-xs text-slate-200 font-medium">Muda de Árvore (sapling)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeWood.hasSlabAndStairs}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, hasSlabAndStairs: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <span className="text-xs text-slate-200 font-medium">Degraus & Lajes (mcl_stairs)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeWood.hasFenceAndGate}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, hasFenceAndGate: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <span className="text-xs text-slate-200 font-medium">Cercas & Portões (mcl_fences)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeWood.hasDoorAndTrapdoor}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, hasDoorAndTrapdoor: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <span className="text-xs text-slate-200 font-medium">Portas & Alçapões (mcl_doors)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeWood.hasBoat}
                      onChange={(e) =>
                        onUpdateWoodSet(selectedIndex, { ...activeWood, hasBoat: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <span className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-400" />
                      Barco (mcl_boats)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
