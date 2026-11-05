import React, { useState } from 'react';
import { BiomeDefinition, BiomeDecoration, BiomeMobSpawn } from '../types/mod';
import { Compass, Plus, Trash2, Trees, Flower2, Skull, Sun, Droplets, Layers, Eye } from 'lucide-react';

interface BiomeEditorProps {
  biomes: BiomeDefinition[];
  onAddBiome: (biome: BiomeDefinition) => void;
  onUpdateBiome: (index: number, biome: BiomeDefinition) => void;
  onDeleteBiome: (index: number) => void;
}

export const BiomeEditor: React.FC<BiomeEditorProps> = ({
  biomes,
  onAddBiome,
  onUpdateBiome,
  onDeleteBiome,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleCreateBiome = () => {
    const num = biomes.length + 1;
    const newBiome: BiomeDefinition = {
      id: `custom_biome_${num}`,
      name: `Bioma Customizado ${num}`,
      heat_point: 50,
      humidity_point: 50,
      rarity: 50,
      y_min: 1,
      y_max: 120,
      node_top: 'mcl_core:dirt_with_grass',
      depth_top: 1,
      node_filler: 'mcl_core:dirt',
      depth_filler: 3,
      node_stone: 'mcl_core:stone',
      node_water: 'mcl_core:water_source',
      vegetation_color: '#4ade80',
      water_color: '#38bdf8',
      sky_color: '#93c5fd',
      fog_color: '#c4b5fd',
      decorations: [
        {
          id: `deco_${Date.now()}_1`,
          name: 'Árvores Estruturais (.mts)',
          type: 'schematic',
          target: 'schematics/custom_tree.mts',
          fill_ratio: 0.02,
          num_per_chunk: 3,
          y_min: 1,
          y_max: 90,
          place_on: 'mcl_core:dirt_with_grass',
        },
        {
          id: `deco_${Date.now()}_2`,
          name: 'Flores no Solo',
          type: 'node_on_ground',
          target: 'mcl_flowers:poppy',
          fill_ratio: 0.04,
          num_per_chunk: 8,
          y_min: 1,
          y_max: 90,
          place_on: 'mcl_core:dirt_with_grass',
        },
      ],
      mobs: [
        {
          id: `mob_${Date.now()}`,
          mobName: 'mcl_mobs:fox',
          weight: 60,
          min_group: 1,
          max_group: 3,
          light_min: 7,
          light_max: 15,
        },
      ],
    };
    onAddBiome(newBiome);
    setSelectedIndex(biomes.length);
  };

  const activeBiome = biomes[selectedIndex];

  // Add decoration
  const handleAddDecoration = () => {
    if (!activeBiome) return;
    const newDeco: BiomeDecoration = {
      id: `deco_${Date.now()}`,
      name: 'Nova Decoração',
      type: 'node_on_ground',
      target: 'mcl_flowers:dandelion',
      fill_ratio: 0.03,
      num_per_chunk: 5,
      y_min: activeBiome.y_min,
      y_max: activeBiome.y_max,
      place_on: activeBiome.node_top,
    };
    onUpdateBiome(selectedIndex, {
      ...activeBiome,
      decorations: [...activeBiome.decorations, newDeco],
    });
  };

  // Add mob spawn
  const handleAddMobSpawn = () => {
    if (!activeBiome) return;
    const newMob: BiomeMobSpawn = {
      id: `mob_${Date.now()}`,
      mobName: 'mcl_mobs:cow',
      weight: 50,
      min_group: 2,
      max_group: 4,
      light_min: 7,
      light_max: 15,
    };
    onUpdateBiome(selectedIndex, {
      ...activeBiome,
      mobs: [...activeBiome.mobs, newMob],
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            Gerador de Biomas & Mapgen (dappled_forest/lg_register.lua)
          </h2>
          <p className="text-xs text-slate-400">
            Configure biomas com calor, umidade, raridade, decorações MTS, vegetação colorida e spawn de mobs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateBiome}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Bioma
        </button>
      </div>

      {biomes.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
          <Compass className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-300">Nenhum bioma cadastrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Adicione um bioma para gerar o script <code className="text-emerald-400">lg_register.lua</code> do BetterCraft.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Biome List */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Biomas Cadastrados ({biomes.length})
            </span>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {biomes.map((biome, idx) => (
                <button
                  key={biome.id || idx}
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
                      className="w-4 h-4 rounded-full shrink-0 border border-black/30"
                      style={{ backgroundColor: biome.vegetation_color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{biome.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{biome.id}</div>
                    </div>
                  </div>
                  {biomes.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBiome(idx);
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

          {/* Active Biome Details */}
          {activeBiome && (
            <div className="lg:col-span-9 space-y-6">
              {/* Climate & Identification */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Nome do Bioma</label>
                    <input
                      type="text"
                      value={activeBiome.name}
                      onChange={(e) =>
                        onUpdateBiome(selectedIndex, { ...activeBiome, name: e.target.value })
                      }
                      placeholder="Ex: Dappled Forest"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Identificador Técnico (ID)</label>
                    <input
                      type="text"
                      value={activeBiome.id}
                      onChange={(e) =>
                        onUpdateBiome(selectedIndex, {
                          ...activeBiome,
                          id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                        })
                      }
                      placeholder="Ex: dappled_forest"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Heat, Humidity & Rarity Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Heat */}
                  <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Calor (heat_point)
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">{activeBiome.heat_point}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeBiome.heat_point}
                      onChange={(e) =>
                        onUpdateBiome(selectedIndex, { ...activeBiome, heat_point: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 block">0 = Neve/Gelo | 50 = Temperado | 100 = Deserto</span>
                  </div>

                  {/* Humidity */}
                  <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        Umidade (humidity_point)
                      </span>
                      <span className="text-xs font-mono text-blue-400 font-bold">{activeBiome.humidity_point}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeBiome.humidity_point}
                      onChange={(e) =>
                        onUpdateBiome(selectedIndex, { ...activeBiome, humidity_point: Number(e.target.value) })
                      }
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 block">0 = Árido | 50 = Florestal | 100 = Selva/Pântano</span>
                  </div>

                  {/* Rarity */}
                  <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        Raridade / Frequência
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{activeBiome.rarity}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={activeBiome.rarity}
                      onChange={(e) =>
                        onUpdateBiome(selectedIndex, { ...activeBiome, rarity: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 block">Peso de geração no mapa</span>
                  </div>
                </div>

                {/* Atmosphere & Vegetation Colors */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Cores Ambientais do Bioma (Luanti BetterCraft Palette)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Vegetação / Grama</span>
                        <input
                          type="color"
                          value={activeBiome.vegetation_color}
                          onChange={(e) =>
                            onUpdateBiome(selectedIndex, { ...activeBiome, vegetation_color: e.target.value })
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 block">{activeBiome.vegetation_color}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Água (_mcl_water)</span>
                        <input
                          type="color"
                          value={activeBiome.water_color}
                          onChange={(e) =>
                            onUpdateBiome(selectedIndex, { ...activeBiome, water_color: e.target.value })
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-blue-400 block">{activeBiome.water_color}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Céu (_mcl_sky)</span>
                        <input
                          type="color"
                          value={activeBiome.sky_color}
                          onChange={(e) =>
                            onUpdateBiome(selectedIndex, { ...activeBiome, sky_color: e.target.value })
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-sky-400 block">{activeBiome.sky_color}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Neblina (_mcl_fog)</span>
                        <input
                          type="color"
                          value={activeBiome.fog_color}
                          onChange={(e) =>
                            onUpdateBiome(selectedIndex, { ...activeBiome, fog_color: e.target.value })
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-purple-400 block">{activeBiome.fog_color}</span>
                    </div>
                  </div>
                </div>

                {/* Ground Layers */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Camadas de Solo (Surface & Filler)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Superfície (node_top)</label>
                      <input
                        type="text"
                        value={activeBiome.node_top}
                        onChange={(e) =>
                          onUpdateBiome(selectedIndex, { ...activeBiome, node_top: e.target.value })
                        }
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Subsolo (node_filler)</label>
                      <input
                        type="text"
                        value={activeBiome.node_filler}
                        onChange={(e) =>
                          onUpdateBiome(selectedIndex, { ...activeBiome, node_filler: e.target.value })
                        }
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Profundo (node_stone)</label>
                      <input
                        type="text"
                        value={activeBiome.node_stone}
                        onChange={(e) =>
                          onUpdateBiome(selectedIndex, { ...activeBiome, node_stone: e.target.value })
                        }
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorations Section (MTS or Ground Nodes) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Trees className="w-4 h-4 text-emerald-400" />
                    Decorações do Bioma (MTS Schematics e Nós no Chão)
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDecoration}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Decoração
                  </button>
                </div>

                <div className="space-y-3">
                  {activeBiome.decorations.map((deco, dIdx) => (
                    <div
                      key={deco.id || dIdx}
                      className="p-3.5 rounded-lg border border-slate-800 bg-slate-850 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {deco.type === 'schematic' ? (
                            <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-500/20">
                              <Trees className="w-3 h-3" />
                              Estrutura .MTS
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                              <Flower2 className="w-3 h-3" />
                              Nó no Chão (Planta/Flor)
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-200">{deco.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = activeBiome.decorations.filter((_, i) => i !== dIdx);
                            onUpdateBiome(selectedIndex, { ...activeBiome, decorations: updated });
                          }}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 mb-1 block">Tipo de Decoração</label>
                          <select
                            value={deco.type}
                            onChange={(e) => {
                              const updated = [...activeBiome.decorations];
                              updated[dIdx] = {
                                ...deco,
                                type: e.target.value as BiomeDecoration['type'],
                                target:
                                  e.target.value === 'schematic'
                                    ? 'schematics/poplar_tree.mts'
                                    : 'mcl_flowers:poppy',
                              };
                              onUpdateBiome(selectedIndex, { ...activeBiome, decorations: updated });
                            }}
                            className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                          >
                            <option value="schematic">Esquemático MTS (Árvores/Construções)</option>
                            <option value="node_on_ground">Nó no Chão (Flores/Cogumelos)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 mb-1 block">
                            {deco.type === 'schematic' ? 'Caminho do Arquivo .mts' : 'Nó / Item a Espalhar'}
                          </label>
                          <input
                            type="text"
                            value={deco.target}
                            onChange={(e) => {
                              const updated = [...activeBiome.decorations];
                              updated[dIdx] = { ...deco, target: e.target.value };
                              onUpdateBiome(selectedIndex, { ...activeBiome, decorations: updated });
                            }}
                            placeholder={
                              deco.type === 'schematic'
                                ? 'schematics/tree.mts'
                                : 'mcl_flowers:poppy'
                            }
                            className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 mb-1 block">
                            Fill Ratio (Densidade: 0.01 a 0.1)
                          </label>
                          <input
                            type="number"
                            step="0.005"
                            value={deco.fill_ratio}
                            onChange={(e) => {
                              const updated = [...activeBiome.decorations];
                              updated[dIdx] = { ...deco, fill_ratio: Number(e.target.value) };
                              onUpdateBiome(selectedIndex, { ...activeBiome, decorations: updated });
                            }}
                            className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mob Spawning Section */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Skull className="w-4 h-4 text-emerald-400" />
                    Mobs que Spawnam neste Bioma (mcl_mobs.register_spawn)
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMobSpawn}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Mob
                  </button>
                </div>

                <div className="space-y-2">
                  {activeBiome.mobs.map((mob, mIdx) => (
                    <div
                      key={mob.id || mIdx}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Identificador do Mob</label>
                          <input
                            type="text"
                            value={mob.mobName}
                            onChange={(e) => {
                              const updated = [...activeBiome.mobs];
                              updated[mIdx] = { ...mob, mobName: e.target.value };
                              onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                            }}
                            placeholder="mcl_mobs:fox"
                            className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Peso (Chance)</label>
                          <input
                            type="number"
                            value={mob.weight}
                            onChange={(e) => {
                              const updated = [...activeBiome.mobs];
                              updated[mIdx] = { ...mob, weight: Number(e.target.value) };
                              onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                            }}
                            className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Tamanho do Bando (Min / Max)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={mob.min_group}
                              onChange={(e) => {
                                const updated = [...activeBiome.mobs];
                                updated[mIdx] = { ...mob, min_group: Number(e.target.value) };
                                onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                              }}
                              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                            />
                            <span className="text-slate-500">-</span>
                            <input
                              type="number"
                              value={mob.max_group}
                              onChange={(e) => {
                                const updated = [...activeBiome.mobs];
                                updated[mIdx] = { ...mob, max_group: Number(e.target.value) };
                                onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                              }}
                              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Luz (Min / Max)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={mob.light_min}
                              onChange={(e) => {
                                const updated = [...activeBiome.mobs];
                                updated[mIdx] = { ...mob, light_min: Number(e.target.value) };
                                onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                              }}
                              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                            />
                            <span className="text-slate-500">-</span>
                            <input
                              type="number"
                              value={mob.light_max}
                              onChange={(e) => {
                                const updated = [...activeBiome.mobs];
                                updated[mIdx] = { ...mob, light_max: Number(e.target.value) };
                                onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                              }}
                              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = activeBiome.mobs.filter((_, i) => i !== mIdx);
                          onUpdateBiome(selectedIndex, { ...activeBiome, mobs: updated });
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 self-end sm:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
