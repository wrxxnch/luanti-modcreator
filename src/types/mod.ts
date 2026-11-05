export interface CustomVariable {
  id: string;
  key: string;
  value: string;
  type: 'boolean' | 'string' | 'number' | 'table' | 'raw';
  description?: string;
  enabled: boolean;
}

export interface TextureConfig {
  mode: 'uniform' | 'sides'; // all sides or per-face
  baseTexture: string; // e.g. 'mcl_core_stone.png'
  tintColor: string; // e.g. '#9c4b28'
  useMultiplier: boolean;
  customImageData?: string; // base64 / dataUrl if user uploaded custom image
  customFileName?: string;
  // Per face if mode === 'sides'
  topTexture?: string;
  topTint?: string;
  bottomTexture?: string;
  bottomTint?: string;
  frontTexture?: string;
  frontTint?: string;
  sideTexture?: string;
  sideTint?: string;
}

export interface CustomNode {
  id: string;
  name: string;
  description: string;
  drawtype: 'normal' | 'plantlike' | 'glasslike' | 'allfaces' | 'nodebox' | 'liquid' | 'torchlike';
  paramtype: 'none' | 'light';
  paramtype2: 'none' | 'facedir' | 'wallmounted' | 'color' | 'mesh';
  sunlight_propagates: boolean;
  use_texture_alpha: 'false' | 'true' | 'clip' | 'blend';
  walkable: boolean;
  pointable: boolean;
  diggable: boolean;
  climbable: boolean;
  bouncy: number; // 0 to 100
  damage_per_second: number; // 0 to 20
  light_source: number; // 0 to 15 (se brilha)
  falling_node: boolean; // se é falling node (areia/cascalho)
  flammable: number; // 0 = false, 1-3 = queima
  is_container: boolean; // se é container (bau)
  container_size: number;
  sound_type: 'stone' | 'wood' | 'dirt' | 'sand' | 'glass' | 'metal' | 'leaves' | 'none';
  drop_type: 'self' | 'custom';
  custom_drop_item: string;
  groups: {
    pickaxey: number; // 0, 1, 2, 3
    axey: number; // 0, 1, 2, 3
    shovely: number; // 0, 1, 2, 3
    handy: number; // 0, 1
    swordy: number; // 0, 1
    shearsy: number; // 0, 1
    attached_node: number; // 0, 1
    not_in_creative_inventory: number; // 0, 1
    building_block: number; // 0, 1
    dig_immediate: number; // 0, 1, 2, 3
    [key: string]: number;
  };
  textures: TextureConfig;
  customVariables: CustomVariable[];
}

export interface WoodSet {
  id: string; // e.g. 'poplar'
  name: string; // 'Poplar'
  plankColor: string; // hex for ^[multiply
  barkColor: string;
  leavesColor: string;
  hasLeaves: boolean;
  hasSapling: boolean;
  hasSlabAndStairs: boolean;
  hasFenceAndGate: boolean;
  hasDoorAndTrapdoor: boolean;
  hasBoat: boolean;
  hasSign: boolean;
  hasPressurePlateAndButton: boolean;
  baseBarkTexture: string;
  basePlankTexture: string;
  baseLeavesTexture: string;
  customVariables: CustomVariable[];
}

export interface BiomeDecoration {
  id: string;
  name: string;
  type: 'schematic' | 'node_on_ground' | 'plant';
  target: string; // e.g. "schematics/poplar_tree.mts" or "mcl_flowers:poppy"
  fill_ratio: number;
  num_per_chunk: number;
  y_min: number;
  y_max: number;
  place_on: string; // e.g. "mcl_core:dirt_with_grass"
}

export interface BiomeMobSpawn {
  id: string;
  mobName: string; // e.g. "mcl_mobs:fox"
  weight: number;
  min_group: number;
  max_group: number;
  light_min: number;
  light_max: number;
}

export interface BiomeDefinition {
  id: string; // e.g. 'dappled_forest'
  name: string; // 'Dappled Forest'
  heat_point: number; // 0-100
  humidity_point: number; // 0-100
  rarity: number; // weight
  y_min: number;
  y_max: number;
  node_top: string; // 'mcl_core:dirt_with_grass'
  depth_top: number;
  node_filler: string; // 'mcl_core:dirt'
  depth_filler: number;
  node_stone: string; // 'mcl_core:stone'
  node_water: string; // 'mcl_core:water_source'
  vegetation_color: string; // Hex color for grass/foliage tint
  water_color: string;
  sky_color: string;
  fog_color: string;
  decorations: BiomeDecoration[];
  mobs: BiomeMobSpawn[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  toolType: 'sword' | 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'shears' | 'bow';
  materialTier: 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'custom';
  durability: number;
  digSpeed: number;
  attackDamage: number;
  attackSpeed: number;
  tintColor: string;
  baseTexture: string;
  customVariables: CustomVariable[];
}

export interface FoodDefinition {
  id: string;
  name: string;
  hungerPoints: number; // food value (e.g. 4)
  saturation: number; // e.g. 0.6
  healingPoints: number; // health points
  alwaysEdible: boolean;
  eatSound: string;
  tintColor: string;
  baseTexture: string;
  effects: Array<{
    effect: 'speed' | 'regeneration' | 'poison' | 'night_vision' | 'strength' | 'jump_boost' | 'absorption';
    duration: number; // seconds
    amplifier: number; // 1 or 2
  }>;
}

export interface PotionDefinition {
  id: string;
  name: string;
  potionType: 'normal' | 'splash' | 'lingering';
  liquidColor: string; // hex
  effects: Array<{
    effect: 'speed' | 'slowness' | 'strength' | 'healing' | 'harming' | 'regeneration' | 'fire_resistance' | 'night_vision' | 'invisibility';
    duration: number;
    amplifier: number;
  }>;
  baseIngredient: string; // e.g. 'mcl_potions:awkward'
  brewingIngredient: string; // e.g. 'mod:ruby'
}

export interface EnchantmentDefinition {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare';
  itemTargets: Array<'sword' | 'axe' | 'pickaxe' | 'shovel' | 'bow' | 'armor'>;
  primaryPower: number;
  hookCode: string;
}

export interface EntityDefinition {
  id: string;
  name: string;
  type: 'passive' | 'neutral' | 'hostile';
  hp: number;
  attackDamage: number;
  walkSpeed: number;
  runSpeed: number;
  model: 'mobs_mc_pig.b3d' | 'character.b3d' | 'mobs_mc_wolf.b3d' | 'mobs_mc_cow.b3d' | 'custom';
  tintColor: string;
  drops: Array<{
    item: string;
    min: number;
    max: number;
    chance: number;
  }>;
  spawnBiomes: string[];
}

export interface ModProject {
  id: string;
  name: string; // technical name e.g. 'bettercraft_expanded'
  title: string; // display name e.g. 'BetterCraft Expanded Mod'
  description: string;
  author: string;
  version: string;
  dependencies: string[];
  nodes: CustomNode[];
  woodSets: WoodSet[];
  biomes: BiomeDefinition[];
  tools: ToolDefinition[];
  foods: FoodDefinition[];
  potions: PotionDefinition[];
  enchantments: EnchantmentDefinition[];
  entities: EntityDefinition[];
  globalVariables: CustomVariable[];
}
