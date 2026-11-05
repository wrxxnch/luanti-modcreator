import React, { useState } from 'react';
import {
  ToolDefinition,
  FoodDefinition,
  PotionDefinition,
  EnchantmentDefinition,
  EntityDefinition,
} from '../types/mod';
import {
  Sword,
  Apple,
  FlaskConical,
  Sparkles,
  Cat,
  Plus,
  Trash2,
  Heart,
  Zap,
} from 'lucide-react';
import { TextureColorPicker } from './TextureColorPicker';

interface ItemEditorProps {
  tools: ToolDefinition[];
  foods: FoodDefinition[];
  potions: PotionDefinition[];
  enchantments: EnchantmentDefinition[];
  entities: EntityDefinition[];
  onUpdateTools: (tools: ToolDefinition[]) => void;
  onUpdateFoods: (foods: FoodDefinition[]) => void;
  onUpdatePotions: (potions: PotionDefinition[]) => void;
  onUpdateEnchantments: (enchantments: EnchantmentDefinition[]) => void;
  onUpdateEntities: (entities: EntityDefinition[]) => void;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({
  tools,
  foods,
  potions,
  enchantments,
  entities,
  onUpdateTools,
  onUpdateFoods,
  onUpdatePotions,
  onUpdateEnchantments,
  onUpdateEntities,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'foods' | 'potions' | 'enchantments' | 'entities'>('tools');

  // Tool Handlers
  const handleAddTool = () => {
    const num = tools.length + 1;
    const newTool: ToolDefinition = {
      id: `custom_tool_${num}`,
      name: `Espada de Rubi ${num}`,
      toolType: 'sword',
      materialTier: 'diamond',
      durability: 1200,
      digSpeed: 8.0,
      attackDamage: 8,
      attackSpeed: 1.6,
      tintColor: '#e11d48',
      baseTexture: 'mcl_tools_sword_iron.png',
      customVariables: [],
    };
    onUpdateTools([...tools, newTool]);
  };

  // Food Handlers
  const handleAddFood = () => {
    const num = foods.length + 1;
    const newFood: FoodDefinition = {
      id: `custom_food_${num}`,
      name: `Fruta Encantada ${num}`,
      hungerPoints: 4,
      saturation: 0.6,
      healingPoints: 2,
      alwaysEdible: false,
      eatSound: 'mcl_farming_eat',
      tintColor: '#f59e0b',
      baseTexture: 'mcl_farming_apple.png',
      effects: [{ effect: 'regeneration', duration: 10, amplifier: 1 }],
    };
    onUpdateFoods([...foods, newFood]);
  };

  // Potion Handlers
  const handleAddPotion = () => {
    const num = potions.length + 1;
    const newPotion: PotionDefinition = {
      id: `potion_custom_${num}`,
      name: `Poção de Agilidade ${num}`,
      potionType: 'normal',
      liquidColor: '#38bdf8',
      baseIngredient: 'mcl_potions:awkward',
      brewingIngredient: 'mcl_core:apple',
      effects: [{ effect: 'speed', duration: 180, amplifier: 1 }],
    };
    onUpdatePotions([...potions, newPotion]);
  };

  // Enchantment Handlers
  const handleAddEnchantment = () => {
    const num = enchantments.length + 1;
    const newEnch: EnchantmentDefinition = {
      id: `enchant_custom_${num}`,
      name: `Golpe Flamejante ${num}`,
      description: 'Adiciona dano de fogo e queima os alvos atacados.',
      maxLevel: 3,
      rarity: 'rare',
      itemTargets: ['sword', 'axe'],
      primaryPower: 12,
      hookCode: `if target and target.punch then\n\t\t\t\ttarget:punch(user, 1.0, { damage_groups = { fire = 4 } })\n\t\t\tend`,
    };
    onUpdateEnchantments([...enchantments, newEnch]);
  };

  // Entity Handlers
  const handleAddEntity = () => {
    const num = entities.length + 1;
    const newMob: EntityDefinition = {
      id: `custom_entity_${num}`,
      name: `Criatura Mística ${num}`,
      type: 'passive',
      hp: 20,
      attackDamage: 3,
      walkSpeed: 2.0,
      runSpeed: 3.8,
      model: 'mobs_mc_pig.b3d',
      tintColor: '#8b5cf6',
      drops: [{ item: 'mcl_core:stick', min: 1, max: 2, chance: 1 }],
      spawnBiomes: ['dappled_forest'],
    };
    onUpdateEntities([...entities, newMob]);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'tools'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sword className="w-4 h-4" />
          Ferramentas (mcl_tools) [{tools.length}]
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('foods')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'foods'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Apple className="w-4 h-4" />
          Comidas (mcl_farming) [{foods.length}]
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('potions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'potions'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Poções (mcl_potions) [{potions.length}]
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('enchantments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'enchantments'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Encantamentos (mcl_enchanting) [{enchantments.length}]
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('entities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'entities'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cat className="w-4 h-4" />
          Mobs & Entidades (ENTITIES) [{entities.length}]
        </button>
      </div>

      {/* 1. TOOLS TAB */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Ferramentas & Armas (mcl_tools)</h3>
              <p className="text-xs text-slate-400">
                Gere espadas, picaretas, machados e pás com velocidades de quebra e durabilidade configuradas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTool}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              Nova Ferramenta
            </button>
          </div>

          <div className="space-y-4">
            {tools.map((tool, idx) => (
              <div key={tool.id || idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: tool.tintColor }} />
                    <span className="text-xs font-bold text-slate-200">{tool.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">({tool.id})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateTools(tools.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Nome de Exibição</label>
                    <input
                      type="text"
                      value={tool.name}
                      onChange={(e) => {
                        const updated = [...tools];
                        updated[idx] = { ...tool, name: e.target.value };
                        onUpdateTools(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Tipo de Ferramenta</label>
                    <select
                      value={tool.toolType}
                      onChange={(e) => {
                        const updated = [...tools];
                        updated[idx] = { ...tool, toolType: e.target.value as ToolDefinition['toolType'] };
                        onUpdateTools(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      <option value="sword">Espada (swordy)</option>
                      <option value="pickaxe">Picareta (pickaxey)</option>
                      <option value="axe">Machado (axey)</option>
                      <option value="shovel">Pá (shovely)</option>
                      <option value="hoe">Enxada</option>
                      <option value="shears">Tesoura (shearsy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Durabilidade (Usos)</label>
                    <input
                      type="number"
                      value={tool.durability}
                      onChange={(e) => {
                        const updated = [...tools];
                        updated[idx] = { ...tool, durability: Number(e.target.value) };
                        onUpdateTools(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Dano de Ataque</label>
                    <input
                      type="number"
                      value={tool.attackDamage}
                      onChange={(e) => {
                        const updated = [...tools];
                        updated[idx] = { ...tool, attackDamage: Number(e.target.value) };
                        onUpdateTools(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>

                {/* Color Multiplier for Tool */}
                <TextureColorPicker
                  baseTexture={tool.baseTexture || 'mcl_tools_sword_iron.png'}
                  tintColor={tool.tintColor}
                  useMultiplier={true}
                  onChangeBaseTexture={(tex) => {
                    const updated = [...tools];
                    updated[idx] = { ...tool, baseTexture: tex };
                    onUpdateTools(updated);
                  }}
                  onChangeTintColor={(tint) => {
                    const updated = [...tools];
                    updated[idx] = { ...tool, tintColor: tint };
                    onUpdateTools(updated);
                  }}
                  onChangeUseMultiplier={() => {}}
                  onUploadCustomImage={() => {}}
                  onClearCustomImage={() => {}}
                  label="Cor da Lâmina / Cabeça da Ferramenta"
                  categoryFilter="tool"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FOODS TAB */}
      {activeTab === 'foods' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Comidas & Consumíveis (mcl_farming)</h3>
              <p className="text-xs text-slate-400">
                Configure saturação, recuperação de fome, pontos de cura e efeitos ao ingerir.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFood}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              Nova Comida
            </button>
          </div>

          <div className="space-y-4">
            {foods.map((food, idx) => (
              <div key={food.id || idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: food.tintColor }} />
                    <span className="text-xs font-bold text-slate-200">{food.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">({food.id})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateFoods(foods.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Nome do Alimento</label>
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => {
                        const updated = [...foods];
                        updated[idx] = { ...food, name: e.target.value };
                        onUpdateFoods(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Pontos de Fome (Hunger)</label>
                    <input
                      type="number"
                      value={food.hungerPoints}
                      onChange={(e) => {
                        const updated = [...foods];
                        updated[idx] = { ...food, hungerPoints: Number(e.target.value) };
                        onUpdateFoods(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Cura de Vida (Hearts)</label>
                    <input
                      type="number"
                      value={food.healingPoints}
                      onChange={(e) => {
                        const updated = [...foods];
                        updated[idx] = { ...food, healingPoints: Number(e.target.value) };
                        onUpdateFoods(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>

                <TextureColorPicker
                  baseTexture={food.baseTexture || 'mcl_farming_apple.png'}
                  tintColor={food.tintColor}
                  useMultiplier={true}
                  onChangeBaseTexture={(tex) => {
                    const updated = [...foods];
                    updated[idx] = { ...food, baseTexture: tex };
                    onUpdateFoods(updated);
                  }}
                  onChangeTintColor={(tint) => {
                    const updated = [...foods];
                    updated[idx] = { ...food, tintColor: tint };
                    onUpdateFoods(updated);
                  }}
                  onChangeUseMultiplier={() => {}}
                  onUploadCustomImage={() => {}}
                  onClearCustomImage={() => {}}
                  label="Cor do Alimento / Fruta"
                  categoryFilter="food"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. POTIONS TAB */}
      {activeTab === 'potions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Poções & Efeitos (mcl_potions)</h3>
              <p className="text-xs text-slate-400">
                Gere poções normais ou arremessáveis com receitas no suporte de poções (brewing stand).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPotion}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              Nova Poção
            </button>
          </div>

          <div className="space-y-4">
            {potions.map((potion, idx) => (
              <div key={potion.id || idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: potion.liquidColor }} />
                    <span className="text-xs font-bold text-slate-200">{potion.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">({potion.id})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdatePotions(potions.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Nome da Poção</label>
                    <input
                      type="text"
                      value={potion.name}
                      onChange={(e) => {
                        const updated = [...potions];
                        updated[idx] = { ...potion, name: e.target.value };
                        onUpdatePotions(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Cor do Líquido</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={potion.liquidColor}
                        onChange={(e) => {
                          const updated = [...potions];
                          updated[idx] = { ...potion, liquidColor: e.target.value };
                          onUpdatePotions(updated);
                        }}
                        className="w-6 h-6 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={potion.liquidColor}
                        onChange={(e) => {
                          const updated = [...potions];
                          updated[idx] = { ...potion, liquidColor: e.target.value };
                          onUpdatePotions(updated);
                        }}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Ingrediente de Alquimia</label>
                    <input
                      type="text"
                      value={potion.brewingIngredient}
                      onChange={(e) => {
                        const updated = [...potions];
                        updated[idx] = { ...potion, brewingIngredient: e.target.value };
                        onUpdatePotions(updated);
                      }}
                      placeholder="mcl_core:apple"
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ENCHANTMENTS TAB */}
      {activeTab === 'enchantments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Encantamentos (mcl_enchanting)</h3>
              <p className="text-xs text-slate-400">
                Crie novos encantamentos compatíveis com a mesa de encantamento e bigorna do Mineclonia.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEnchantment}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              Novo Encantamento
            </button>
          </div>

          <div className="space-y-4">
            {enchantments.map((ench, idx) => (
              <div key={ench.id || idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-slate-200">{ench.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">({ench.id})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateEnchantments(enchantments.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Nome do Encantamento</label>
                    <input
                      type="text"
                      value={ench.name}
                      onChange={(e) => {
                        const updated = [...enchantments];
                        updated[idx] = { ...ench, name: e.target.value };
                        onUpdateEnchantments(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Nível Máximo</label>
                    <select
                      value={ench.maxLevel}
                      onChange={(e) => {
                        const updated = [...enchantments];
                        updated[idx] = { ...ench, maxLevel: Number(e.target.value) };
                        onUpdateEnchantments(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      <option value="1">I (1)</option>
                      <option value="2">II (2)</option>
                      <option value="3">III (3)</option>
                      <option value="4">IV (4)</option>
                      <option value="5">V (5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Raridade</label>
                    <select
                      value={ench.rarity}
                      onChange={(e) => {
                        const updated = [...enchantments];
                        updated[idx] = { ...ench, rarity: e.target.value as EnchantmentDefinition['rarity'] };
                        onUpdateEnchantments(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      <option value="common">Comum</option>
                      <option value="uncommon">Incomum</option>
                      <option value="rare">Raro</option>
                      <option value="very_rare">Muito Raro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Hook Lua ao Atacar / Minerar</label>
                  <textarea
                    rows={2}
                    value={ench.hookCode}
                    onChange={(e) => {
                      const updated = [...enchantments];
                      updated[idx] = { ...ench, hookCode: e.target.value };
                      onUpdateEnchantments(updated);
                    }}
                    className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ENTITIES TAB */}
      {activeTab === 'entities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Mobs & Entidades (ENTITIES / mcl_mobs)</h3>
              <p className="text-xs text-slate-400">
                Cadastre criaturas passivas ou hostis com pontos de vida, dano, velocidade e modelos 3D.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEntity}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              Novo Mob
            </button>
          </div>

          <div className="space-y-4">
            {entities.map((mob, idx) => (
              <div key={mob.id || idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: mob.tintColor }} />
                    <span className="text-xs font-bold text-slate-200">{mob.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">({mob.id})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateEntities(entities.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Nome do Mob</label>
                    <input
                      type="text"
                      value={mob.name}
                      onChange={(e) => {
                        const updated = [...entities];
                        updated[idx] = { ...mob, name: e.target.value };
                        onUpdateEntities(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Comportamento</label>
                    <select
                      value={mob.type}
                      onChange={(e) => {
                        const updated = [...entities];
                        updated[idx] = { ...mob, type: e.target.value as EntityDefinition['type'] };
                        onUpdateEntities(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      <option value="passive">Passivo (Animal)</option>
                      <option value="neutral">Neutro (Ataca se provocado)</option>
                      <option value="hostile">Hostil (Monstro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Vida (HP)</label>
                    <input
                      type="number"
                      value={mob.hp}
                      onChange={(e) => {
                        const updated = [...entities];
                        updated[idx] = { ...mob, hp: Number(e.target.value) };
                        onUpdateEntities(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Dano de Ataque</label>
                    <input
                      type="number"
                      value={mob.attackDamage}
                      onChange={(e) => {
                        const updated = [...entities];
                        updated[idx] = { ...mob, attackDamage: Number(e.target.value) };
                        onUpdateEntities(updated);
                      }}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
