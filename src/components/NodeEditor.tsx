import React, { useState } from 'react';
import { CustomNode } from '../types/mod';
import { TextureColorPicker } from './TextureColorPicker';
import { VoxelBlockPreview } from './VoxelBlockPreview';
import { Plus, Trash2, Box, Flame, ArrowDown, Package, Sparkles, Shield, Wrench, Volume2 } from 'lucide-react';

interface NodeEditorProps {
  nodes: CustomNode[];
  onAddNode: (node: CustomNode) => void;
  onUpdateNode: (index: number, node: CustomNode) => void;
  onDeleteNode: (index: number) => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({
  nodes,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleCreateNewNode = () => {
    const idNum = nodes.length + 1;
    const newNode: CustomNode = {
      id: `custom_block_${idNum}`,
      name: `Bloco Customizado ${idNum}`,
      description: 'Novo bloco customizado para o BetterCraft / Mineclonia.',
      drawtype: 'normal',
      paramtype: 'none',
      paramtype2: 'none',
      sunlight_propagates: false,
      use_texture_alpha: 'false',
      walkable: true,
      pointable: true,
      diggable: true,
      climbable: false,
      bouncy: 0,
      damage_per_second: 0,
      light_source: 0,
      falling_node: false,
      flammable: 0,
      is_container: false,
      container_size: 27,
      sound_type: 'stone',
      drop_type: 'self',
      custom_drop_item: '',
      groups: {
        pickaxey: 1,
        axey: 0,
        shovely: 0,
        handy: 1,
        swordy: 0,
        shearsy: 0,
        attached_node: 0,
        not_in_creative_inventory: 0,
        building_block: 1,
        dig_immediate: 0,
      },
      textures: {
        mode: 'uniform',
        baseTexture: 'mcl_core_stone.png',
        tintColor: '#38bdf8',
        useMultiplier: false,
      },
      customVariables: [],
    };
    onAddNode(newNode);
    setSelectedIndex(nodes.length);
  };

  const activeNode = nodes[selectedIndex];

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Box className="w-5 h-5 text-emerald-400" />
            Registro de Blocos & Nós (minetest.register_node)
          </h2>
          <p className="text-xs text-slate-400">
            Configure propriedades físicas, texturas com <code className="text-emerald-400">^[multiply</code>, grupos de mineração e iluminação.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNewNode}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Novo Bloco
        </button>
      </div>

      {nodes.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 space-y-3">
          <Box className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-300">Nenhum bloco cadastrado ainda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Clique no botão acima para adicionar seu primeiro bloco customizado com suporte a texturas e física completa do Mineclonia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Node List Column */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Blocos do Mod ({nodes.length})
            </span>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {nodes.map((node, idx) => (
                <button
                  key={node.id || idx}
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
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/30"
                      style={{
                        backgroundColor: node.textures.useMultiplier ? node.textures.tintColor : '#64748b',
                      }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{node.name || 'Sem nome'}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{node.id}</div>
                    </div>
                  </div>
                  {nodes.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(idx);
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

          {/* Right: Active Node Detail Editor */}
          {activeNode && (
            <div className="lg:col-span-9 space-y-6">
              {/* Row 1: General Info & 3D Voxel Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    Identificação do Bloco
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Nome de Exibição</label>
                      <input
                        type="text"
                        value={activeNode.name}
                        onChange={(e) =>
                          onUpdateNode(selectedIndex, { ...activeNode, name: e.target.value })
                        }
                        placeholder="Ex: Minério de Rubi"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Identificador Técnico (ID)</label>
                      <input
                        type="text"
                        value={activeNode.id}
                        onChange={(e) =>
                          onUpdateNode(selectedIndex, {
                            ...activeNode,
                            id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                          })
                        }
                        placeholder="Ex: ruby_ore"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Descrição / Dica</label>
                    <input
                      type="text"
                      value={activeNode.description}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, description: e.target.value })
                      }
                      placeholder="Descrição que aparece no inventário ou tooltip"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Drawtype</label>
                      <select
                        value={activeNode.drawtype}
                        onChange={(e) =>
                          onUpdateNode(selectedIndex, {
                            ...activeNode,
                            drawtype: e.target.value as CustomNode['drawtype'],
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                      >
                        <option value="normal">Normal (Cubo Sólido)</option>
                        <option value="plantlike">Plantlike (Cruzeta)</option>
                        <option value="glasslike">Glasslike (Vidro)</option>
                        <option value="allfaces">Allfaces</option>
                        <option value="nodebox">Nodebox</option>
                        <option value="torchlike">Torchlike (Tocha)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Som ao Quebrar / Andar</label>
                      <select
                        value={activeNode.sound_type}
                        onChange={(e) =>
                          onUpdateNode(selectedIndex, {
                            ...activeNode,
                            sound_type: e.target.value as CustomNode['sound_type'],
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                      >
                        <option value="stone">Pedra (mcl_sounds stone)</option>
                        <option value="wood">Madeira (wood)</option>
                        <option value="dirt">Terra (dirt)</option>
                        <option value="sand">Areia / Cascalho (sand)</option>
                        <option value="glass">Vidro (glass)</option>
                        <option value="metal">Metal (metal)</option>
                        <option value="leaves">Folhas / Grama (leaves)</option>
                        <option value="none">Silencioso (none)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Paramtype2 (Rotação)</label>
                      <select
                        value={activeNode.paramtype2}
                        onChange={(e) =>
                          onUpdateNode(selectedIndex, {
                            ...activeNode,
                            paramtype2: e.target.value as CustomNode['paramtype2'],
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                      >
                        <option value="none">Nenhum</option>
                        <option value="facedir">Facedir (Tronco/Fornos)</option>
                        <option value="wallmounted">Wallmounted (Tochas/Paredes)</option>
                        <option value="color">Color</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <VoxelBlockPreview
                    baseTexture={activeNode.textures.baseTexture}
                    tintColor={activeNode.textures.tintColor}
                    useMultiplier={activeNode.textures.useMultiplier}
                    customImageData={activeNode.textures.customImageData}
                    nodeName={activeNode.name}
                    lightSource={activeNode.light_source}
                  />
                </div>
              </div>

              {/* Row 2: Texture Modifier Component */}
              <TextureColorPicker
                baseTexture={activeNode.textures.baseTexture}
                tintColor={activeNode.textures.tintColor}
                useMultiplier={activeNode.textures.useMultiplier}
                customImageData={activeNode.textures.customImageData}
                customFileName={activeNode.textures.customFileName}
                onChangeBaseTexture={(tex) =>
                  onUpdateNode(selectedIndex, {
                    ...activeNode,
                    textures: { ...activeNode.textures, baseTexture: tex },
                  })
                }
                onChangeTintColor={(tint) =>
                  onUpdateNode(selectedIndex, {
                    ...activeNode,
                    textures: { ...activeNode.textures, tintColor: tint },
                  })
                }
                onChangeUseMultiplier={(use) =>
                  onUpdateNode(selectedIndex, {
                    ...activeNode,
                    textures: { ...activeNode.textures, useMultiplier: use },
                  })
                }
                onUploadCustomImage={(dataUrl, fileName) =>
                  onUpdateNode(selectedIndex, {
                    ...activeNode,
                    textures: {
                      ...activeNode.textures,
                      customImageData: dataUrl,
                      customFileName: fileName,
                    },
                  })
                }
                onClearCustomImage={() =>
                  onUpdateNode(selectedIndex, {
                    ...activeNode,
                    textures: {
                      ...activeNode.textures,
                      customImageData: undefined,
                      customFileName: undefined,
                    },
                  })
                }
                label="Textura do Bloco & Color Multiplier"
              />

              {/* Row 3: Physical & Behavioral Properties */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Propriedades Físicas e Comportamento no Luanti
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Diggable / Quebrável */}
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNode.diggable}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, diggable: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Quebrável (diggable)</span>
                      <span className="text-[11px] text-slate-400">Pode ser minerado pelo jogador</span>
                    </div>
                  </label>

                  {/* Walkable / Sólido */}
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNode.walkable}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, walkable: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Sólido (walkable)</span>
                      <span className="text-[11px] text-slate-400">Jogadores e entidades colidem</span>
                    </div>
                  </label>

                  {/* Falling Node / Gravidade */}
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNode.falling_node}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, falling_node: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                        Falling Node (Cai)
                      </span>
                      <span className="text-[11px] text-slate-400">Sujeito à gravidade (como areia/cascalho)</span>
                    </div>
                  </label>

                  {/* Flammable / Se Queima */}
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      Inflamável (Se Queima)
                    </span>
                    <select
                      value={activeNode.flammable}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, flammable: Number(e.target.value) })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="0">Não queima (flammable = 0)</option>
                      <option value="1">Queima devagar (flammable = 1)</option>
                      <option value="2">Tronco de madeira (flammable = 2)</option>
                      <option value="3">Altamente inflamável (flammable = 3)</option>
                    </select>
                  </div>

                  {/* Light Source / Brilha */}
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Brilho (light_source)
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">{activeNode.light_source}/14</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="14"
                      value={activeNode.light_source}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, light_source: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Bouncy / Elasticidade */}
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">Bouncy (Pula/Trampolim)</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{activeNode.bouncy}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={activeNode.bouncy}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, bouncy: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Container / Baú */}
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNode.is_container}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, { ...activeNode, is_container: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-blue-400" />
                        É Container (Armazena Itens)
                      </span>
                      <span className="text-[11px] text-slate-400">Gera interface de baú (formspec e 27 slots)</span>
                    </div>
                  </label>

                  {/* Sunlight Propagates */}
                  <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNode.sunlight_propagates}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          sunlight_propagates: e.target.checked,
                          paramtype: e.target.checked ? 'light' : activeNode.paramtype,
                        })
                      }
                      className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Luz Solar Atravessa</span>
                      <span className="text-[11px] text-slate-400">sunlight_propagates = true</span>
                    </div>
                  </label>

                  {/* Use Texture Alpha */}
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-200 block">use_texture_alpha</span>
                    <select
                      value={activeNode.use_texture_alpha}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          use_texture_alpha: e.target.value as CustomNode['use_texture_alpha'],
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="false">Opaco (false)</option>
                      <option value="clip">Recorte / Vidro (clip)</option>
                      <option value="blend">Translúcido (blend)</option>
                      <option value="true">Verdadeiro (true)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Mineclonia Mining Groups (pickaxey, axey, etc.) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    Grupos de Ferramentas & Mineração (Mineclonia Mining Groups)
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    0 = Não minera | 1 = Madeira | 2 = Ferro | 3 = Diamante
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {/* Pickaxe */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-200 block mb-1">pickaxey</span>
                    <select
                      value={activeNode.groups.pickaxey}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          groups: { ...activeNode.groups, pickaxey: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-center text-slate-200 font-bold"
                    >
                      <option value="0">0 (Nenhum)</option>
                      <option value="1">1 (Madeira)</option>
                      <option value="2">2 (Ferro)</option>
                      <option value="3">3 (Diamante)</option>
                    </select>
                  </div>

                  {/* Axe */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-200 block mb-1">axey</span>
                    <select
                      value={activeNode.groups.axey}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          groups: { ...activeNode.groups, axey: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-center text-slate-200 font-bold"
                    >
                      <option value="0">0 (Nenhum)</option>
                      <option value="1">1 (Madeira)</option>
                      <option value="2">2 (Ferro)</option>
                      <option value="3">3 (Diamante)</option>
                    </select>
                  </div>

                  {/* Shovel */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-200 block mb-1">shovely</span>
                    <select
                      value={activeNode.groups.shovely}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          groups: { ...activeNode.groups, shovely: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-center text-slate-200 font-bold"
                    >
                      <option value="0">0 (Nenhum)</option>
                      <option value="1">1 (Pá)</option>
                      <option value="2">2 (Ferro)</option>
                      <option value="3">3 (Diamante)</option>
                    </select>
                  </div>

                  {/* Hand */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-200 block mb-1">handy</span>
                    <select
                      value={activeNode.groups.handy}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          groups: { ...activeNode.groups, handy: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-center text-slate-200 font-bold"
                    >
                      <option value="0">0 (Não)</option>
                      <option value="1">1 (Com a Mão)</option>
                    </select>
                  </div>

                  {/* Sword */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-200 block mb-1">swordy</span>
                    <select
                      value={activeNode.groups.swordy}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          groups: { ...activeNode.groups, swordy: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-center text-slate-200 font-bold"
                    >
                      <option value="0">0 (Não)</option>
                      <option value="1">1 (Com Espada)</option>
                    </select>
                  </div>

                  {/* Attached Node */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-200 block mb-1">attached_node</span>
                    <select
                      value={activeNode.groups.attached_node}
                      onChange={(e) =>
                        onUpdateNode(selectedIndex, {
                          ...activeNode,
                          groups: { ...activeNode.groups, attached_node: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-center text-slate-200 font-bold"
                    >
                      <option value="0">0 (Não)</option>
                      <option value="1">1 (Apoiado)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
