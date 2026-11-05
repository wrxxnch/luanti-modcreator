import { ModProject, CustomNode, WoodSet, BiomeDefinition, ToolDefinition, FoodDefinition, PotionDefinition, EnchantmentDefinition, EntityDefinition, CustomVariable } from '../types/mod';
import { formatLuantiTexture } from './textureUtils';

function renderCustomVariables(vars: CustomVariable[], indent = '\t\t'): string {
  if (!vars || vars.length === 0) return '';
  const lines: string[] = [];
  for (const v of vars) {
    if (!v.enabled) continue;
    if (v.type === 'raw') {
      lines.push(`${indent}${v.value}`);
    } else if (v.type === 'string') {
      lines.push(`${indent}${v.key} = "${v.value}",`);
    } else if (v.type === 'boolean') {
      lines.push(`${indent}${v.key} = ${v.value === 'true' || v.value === '1' ? 'true' : 'false'},`);
    } else if (v.type === 'number') {
      lines.push(`${indent}${v.key} = ${v.value},`);
    } else if (v.type === 'table') {
      lines.push(`${indent}${v.key} = ${v.value},`);
    }
  }
  return lines.length > 0 ? lines.join('\n') + '\n' : '';
}

export function generateModConf(mod: ModProject): string {
  const defaultDeps = ['mcl_core', 'mcl_sounds'];
  if (mod.woodSets.length > 0) {
    defaultDeps.push('mcl_trees', 'mcl_stairs', 'mcl_fences', 'mcl_doors', 'mcl_boats', 'mcl_signs');
  }
  if (mod.biomes.length > 0) {
    defaultDeps.push('mcl_levelgen', 'mcl_biomes');
  }
  if (mod.tools.length > 0) defaultDeps.push('mcl_tools');
  if (mod.foods.length > 0) defaultDeps.push('mcl_farming');
  if (mod.potions.length > 0) defaultDeps.push('mcl_potions');
  if (mod.enchantments.length > 0) defaultDeps.push('mcl_enchanting');
  if (mod.entities.length > 0) defaultDeps.push('mcl_mobs');

  const allDeps = Array.from(new Set([...defaultDeps, ...(mod.dependencies || [])])).filter(Boolean);

  return `# Mod configuration file for Luanti / Mineclonia / BetterCraft
name = ${mod.name}
title = ${mod.title}
description = ${mod.description}
author = ${mod.author || 'BetterCraft Mod Creator'}
version = ${mod.version || '1.0.0'}
depends = ${allDeps.join(', ')}
`;
}

export function generateInitLua(mod: ModProject): string {
  const modname = mod.name;
  let code = `--[[
    Mod: ${mod.title} (${modname})
    Description: ${mod.description}
    Target Game: BetterCraft / Mineclonia (Luanti / Minetest)
    Generated automatically by BetterCraft Mod Studio
--]]

local modname = minetest.get_current_modname()
local modpath = minetest.get_modpath(modname)
local S = minetest.get_translator(modname)

`;

  // Global variables / configs
  if (mod.globalVariables && mod.globalVariables.length > 0) {
    code += `-- Global configurations and admin variables\n`;
    for (const gv of mod.globalVariables) {
      if (!gv.enabled) continue;
      code += `${gv.key} = ${gv.type === 'string' ? `"${gv.value}"` : gv.value}\n`;
    }
    code += `\n`;
  }

  // 1. Custom Nodes / Blocks
  if (mod.nodes.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 1. CUSTOM NODES & BLOCKS\n`;
    code += `-- ========================================================\n\n`;

    for (const node of mod.nodes) {
      code += generateSingleNodeLua(modname, node);
    }
  }

  // 2. Wood Sets (based on dappled_forest/init.lua and mcl_trees)
  if (mod.woodSets.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 2. WOOD SETS & TREES (Pattern from dappled_forest & mcl_trees)\n`;
    code += `-- ========================================================\n\n`;

    for (const wood of mod.woodSets) {
      code += generateWoodSetLua(modname, wood);
    }
  }

  // 3. Tools (mcl_tools)
  if (mod.tools.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 3. TOOLS & WEAPONS (mcl_tools)\n`;
    code += `-- ========================================================\n\n`;

    for (const tool of mod.tools) {
      code += generateToolLua(modname, tool);
    }
  }

  // 4. Food items (mcl_farming)
  if (mod.foods.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 4. FOOD & CONSUMABLES (mcl_farming)\n`;
    code += `-- ========================================================\n\n`;

    for (const food of mod.foods) {
      code += generateFoodLua(modname, food);
    }
  }

  // 5. Potions (mcl_potions)
  if (mod.potions.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 5. POTIONS (mcl_potions)\n`;
    code += `-- ========================================================\n\n`;

    for (const potion of mod.potions) {
      code += generatePotionLua(modname, potion);
    }
  }

  // 6. Enchantments (mcl_enchanting)
  if (mod.enchantments.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 6. ENCHANTMENTS (mcl_enchanting)\n`;
    code += `-- ========================================================\n\n`;

    for (const ench of mod.enchantments) {
      code += generateEnchantmentLua(modname, ench);
    }
  }

  // 7. Entities / Mobs (mcl_mobs)
  if (mod.entities.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 7. ENTITIES & MOBS (ENTITIES / mcl_mobs)\n`;
    code += `-- ========================================================\n\n`;

    for (const mob of mod.entities) {
      code += generateMobLua(modname, mob);
    }
  }

  // 8. Load lg_register.lua if biomes are configured
  if (mod.biomes.length > 0) {
    code += `-- ========================================================\n`;
    code += `-- 8. LEVELGEN & BIOME REGISTRATIONS\n`;
    code += `-- ========================================================\n`;
    code += `dofile(modpath .. "/lg_register.lua")\n\n`;
  }

  return code;
}

function generateSingleNodeLua(modname: string, node: CustomNode): string {
  // Tile textures
  let tilesString = '';
  if (node.textures.mode === 'uniform') {
    const tex = formatLuantiTexture(node.textures.baseTexture, node.textures.tintColor, node.textures.useMultiplier);
    tilesString = `"${tex}"`;
  } else {
    const top = formatLuantiTexture(node.textures.topTexture || node.textures.baseTexture, node.textures.topTint, node.textures.useMultiplier);
    const bottom = formatLuantiTexture(node.textures.bottomTexture || node.textures.baseTexture, node.textures.bottomTint, node.textures.useMultiplier);
    const side = formatLuantiTexture(node.textures.sideTexture || node.textures.baseTexture, node.textures.sideTint, node.textures.useMultiplier);
    tilesString = `{\n\t\t"${top}",\n\t\t"${bottom}",\n\t\t"${side}"\n\t}`;
  }

  // Groups
  const groupEntries: string[] = [];
  if (node.groups.pickaxey > 0) groupEntries.push(`pickaxey = ${node.groups.pickaxey}`);
  if (node.groups.axey > 0) groupEntries.push(`axey = ${node.groups.axey}`);
  if (node.groups.shovely > 0) groupEntries.push(`shovely = ${node.groups.shovely}`);
  if (node.groups.handy > 0) groupEntries.push(`handy = ${node.groups.handy}`);
  if (node.groups.swordy > 0) groupEntries.push(`swordy = ${node.groups.swordy}`);
  if (node.groups.shearsy > 0) groupEntries.push(`shearsy = ${node.groups.shearsy}`);
  if (node.groups.attached_node > 0) groupEntries.push(`attached_node = ${node.groups.attached_node}`);
  if (node.groups.not_in_creative_inventory > 0) groupEntries.push(`not_in_creative_inventory = ${node.groups.not_in_creative_inventory}`);
  if (node.groups.building_block > 0) groupEntries.push(`building_block = ${node.groups.building_block}`);
  if (node.groups.dig_immediate > 0) groupEntries.push(`dig_immediate = ${node.groups.dig_immediate}`);
  if (node.falling_node) groupEntries.push(`falling_node = 1`);
  if (node.flammable > 0) groupEntries.push(`flammable = ${node.flammable}`);
  if (node.bouncy > 0) groupEntries.push(`bouncy = ${node.bouncy}`);
  if (node.is_container) groupEntries.push(`container = 2`);

  // Extra groups
  for (const [k, v] of Object.entries(node.groups)) {
    if (['pickaxey', 'axey', 'shovely', 'handy', 'swordy', 'shearsy', 'attached_node', 'not_in_creative_inventory', 'building_block', 'dig_immediate'].includes(k)) continue;
    if (typeof v === 'number' && v > 0) {
      groupEntries.push(`${k} = ${v}`);
    }
  }

  // Sound table
  let soundsLua = 'mcl_sounds.node_sound_stone_defaults()';
  if (node.sound_type === 'wood') soundsLua = 'mcl_sounds.node_sound_wood_defaults()';
  else if (node.sound_type === 'dirt') soundsLua = 'mcl_sounds.node_sound_dirt_defaults()';
  else if (node.sound_type === 'sand') soundsLua = 'mcl_sounds.node_sound_sand_defaults()';
  else if (node.sound_type === 'glass') soundsLua = 'mcl_sounds.node_sound_glass_defaults()';
  else if (node.sound_type === 'metal') soundsLua = 'mcl_sounds.node_sound_metal_defaults()';
  else if (node.sound_type === 'leaves') soundsLua = 'mcl_sounds.node_sound_leaves_defaults()';
  else if (node.sound_type === 'none') soundsLua = 'nil';

  // Drop
  let dropProp = '';
  if (node.drop_type === 'custom' && node.custom_drop_item) {
    dropProp = `\n\tdrop = "${node.custom_drop_item}",`;
  }

  // Container formspec callbacks
  let containerMethods = '';
  if (node.is_container) {
    const size = node.container_size || 27;
    containerMethods = `\ton_construct = function(pos)
\t\tlocal meta = minetest.get_meta(pos)
\t\tmeta:set_string("formspec", "size[9,8.75]" ..
\t\t\t"label[0,0;" .. minetest.formspec_escape("${node.name}") .. "]" ..
\t\t\t"list[current_name;main;0,0.5;9,3;]" ..
\t\t\t"list[current_player;main;0,4.5;9,3;9]" ..
\t\t\t"list[current_player;main;0,7.74;9,1;0]" ..
\t\t\t"listring[current_name;main]" ..
\t\t\t"listring[current_player;main]")
\t\tlocal inv = meta:get_inventory()
\t\tinv:set_size("main", ${size})
\tend,
\tcan_dig = function(pos, player)
\t\tlocal meta = minetest.get_meta(pos)
\t\tlocal inv = meta:get_inventory()
\t\treturn inv:is_empty("main")
\tend,
`;
  }

  const customVarsCode = renderCustomVariables(node.customVariables, '\t');

  return `minetest.register_node("${modname}:${node.id}", {
\tdescription = S("${node.name}"),
\ttiles = ${tilesString},
\tdrawtype = "${node.drawtype}",
\tparamtype = "${node.paramtype}",
\tparamtype2 = "${node.paramtype2}",
\tsunlight_propagates = ${node.sunlight_propagates ? 'true' : 'false'},
\tuse_texture_alpha = ${node.use_texture_alpha === 'false' ? 'false' : node.use_texture_alpha === 'true' ? 'true' : `"${node.use_texture_alpha}"`},
\twalkable = ${node.walkable ? 'true' : 'false'},
\tpointable = ${node.pointable ? 'true' : 'false'},
\tdiggable = ${node.diggable ? 'true' : 'false'},
\tclimbable = ${node.climbable ? 'true' : 'false'},
\tlight_source = ${node.light_source},
\tdamage_per_second = ${node.damage_per_second},${dropProp}
\tgroups = { ${groupEntries.join(', ')} },
\tsounds = ${soundsLua},
${customVarsCode}${containerMethods}})

`;
}

function generateWoodSetLua(modname: string, wood: WoodSet): string {
  const id = wood.id;
  const name = wood.name;

  const plankTexture = formatLuantiTexture(wood.basePlankTexture || 'mcl_trees_wood_oak.png', wood.plankColor);
  const barkTexture = formatLuantiTexture(wood.baseBarkTexture || 'mcl_trees_tree_oak.png', wood.barkColor);
  const leavesTexture = formatLuantiTexture(wood.baseLeavesTexture || 'mcl_trees_leaves_oak.png', wood.leavesColor);

  let out = `-- ----------------------------------------------------
-- Wood Type: ${name} (${id})
-- ----------------------------------------------------\n\n`;

  // 1. Planks
  out += `-- ${name} Planks
minetest.register_node("${modname}:wood_${id}", {
\tdescription = S("${name} Wood Planks"),
\ttiles = { "${plankTexture}" },
\tis_ground_content = false,
\tgroups = { handy = 1, axey = 1, flammable = 3, building_block = 1, material_wood = 1 },
\tsounds = mcl_sounds.node_sound_wood_defaults(),
\t_mcl_blast_resistance = 3,
\t_mcl_hardness = 2,
})

`;

  // 2. Tree Trunk / Log
  out += `-- ${name} Tree Trunk / Log
minetest.register_node("${modname}:tree_${id}", {
\tdescription = S("${name} Tree Trunk"),
\ttiles = {
\t\t"${plankTexture}",
\t\t"${plankTexture}",
\t\t"${barkTexture}"
\t},
\tparamtype2 = "facedir",
\tis_ground_content = true,
\tgroups = { handy = 1, axey = 1, flammable = 2, building_block = 1, tree = 1, material_wood = 1 },
\tsounds = mcl_sounds.node_sound_wood_defaults(),
\ton_place = mcl_util and mcl_util.rotate_axis or nil,
\t_mcl_blast_resistance = 2,
\t_mcl_hardness = 2,
})

-- Stripped ${name} Trunk
minetest.register_node("${modname}:stripped_tree_${id}", {
\tdescription = S("Stripped ${name} Trunk"),
\ttiles = {
\t\t"${plankTexture}",
\t\t"${plankTexture}",
\t\t"${plankTexture}"
\t},
\tparamtype2 = "facedir",
\tis_ground_content = false,
\tgroups = { handy = 1, axey = 1, flammable = 2, building_block = 1, tree = 1, material_wood = 1 },
\tsounds = mcl_sounds.node_sound_wood_defaults(),
\ton_place = mcl_util and mcl_util.rotate_axis or nil,
})

`;

  // Stripping interaction hook
  out += `-- Strip trunk on right-click with axe
if mcl_trees and mcl_trees.register_stripped_trunk then
\tmcl_trees.register_stripped_trunk("${modname}:tree_${id}", "${modname}:stripped_tree_${id}")
end

`;

  // 3. Leaves
  if (wood.hasLeaves) {
    out += `-- ${name} Leaves
minetest.register_node("${modname}:leaves_${id}", {
\tdescription = S("${name} Leaves"),
\tdrawtype = "allfaces_optional",
\twalkable = true,
\ttiles = { "${leavesTexture}" },
\tparamtype = "light",
\tis_ground_content = false,
\tgroups = { handy = 1, shearsy = 1, swordy = 1, flammable = 2, leaves = 1, deco_block = 1 },
\tdrop = {
\t\tmax_items = 1,
\t\titems = {
\t\t\t{ items = { "${modname}:sapling_${id}" }, rarity = 20 },
\t\t\t{ items = { "mcl_core:stick" }, rarity = 50 },
\t\t}
\t},
\tsounds = mcl_sounds.node_sound_leaves_defaults(),
})

`;
  }

  // 4. Sapling
  if (wood.hasSapling) {
    out += `-- ${name} Sapling
minetest.register_node("${modname}:sapling_${id}", {
\tdescription = S("${name} Sapling"),
\tdrawtype = "plantlike",
\tparamtype = "light",
\tsunlight_propagates = true,
\twalkable = false,
\tselection_box = {
\t\ttype = "fixed",
\t\tfixed = { -0.3, -0.5, -0.3, 0.3, 0.35, 0.3 }
\t},
\ttiles = { "${plankTexture}" },
\tinventory_image = "${plankTexture}",
\twield_image = "${plankTexture}",
\tgroups = { handy = 1, attached_node = 1, sapling = 1, flammable = 2, dig_immediate = 3 },
\tsounds = mcl_sounds.node_sound_leaves_defaults(),
})

`;
  }

  // 5. Stairs and Slabs
  if (wood.hasSlabAndStairs) {
    out += `-- Stairs & Slabs for ${name}
if mcl_stairs and mcl_stairs.register_stair_and_slab then
\tmcl_stairs.register_stair_and_slab(
\t\t"${id}",
\t\t"${modname}:wood_${id}",
\t\t{ handy = 1, axey = 1, flammable = 3, building_block = 1, material_wood = 1 },
\t\t{ "${plankTexture}" },
\t\tS("${name} Wood Stair"),
\t\tS("${name} Wood Slab"),
\t\tmcl_sounds.node_sound_wood_defaults()
\t)
end

`;
  }

  // 6. Fence and Gate
  if (wood.hasFenceAndGate) {
    out += `-- Fence and Gate for ${name}
if mcl_fences and mcl_fences.register_fence_and_gate then
\tmcl_fences.register_fence_and_gate(
\t\t"${id}",
\t\tS("${name} Fence"),
\t\t"${plankTexture}",
\t\t{ handy = 1, axey = 1, flammable = 3, building_block = 1, material_wood = 1 },
\t\tmcl_sounds.node_sound_wood_defaults()
\t)
end

`;
  }

  // 7. Doors and Trapdoors
  if (wood.hasDoorAndTrapdoor) {
    out += `-- Door and Trapdoor for ${name}
if mcl_doors and mcl_doors.register_door then
\tmcl_doors.register_door("${modname}:door_${id}", {
\t\tdescription = S("${name} Door"),
\t\tinventory_image = "${plankTexture}",
\t\tgroups = { handy = 1, axey = 1, door = 1, flammable = 3, material_wood = 1 },
\t\tsounds = mcl_sounds.node_sound_wood_defaults(),
\t})
\tmcl_doors.register_trapdoor("${modname}:trapdoor_${id}", {
\t\tdescription = S("${name} Trapdoor"),
\t\ttile_front = "${plankTexture}",
\t\ttile_side = "${plankTexture}",
\t\tgroups = { handy = 1, axey = 1, trapdoor = 1, flammable = 3, material_wood = 1 },
\t\tsounds = mcl_sounds.node_sound_wood_defaults(),
\t})
end

`;
  }

  // 8. Boat
  if (wood.hasBoat) {
    out += `-- Boat for ${name}
if mcl_boats and mcl_boats.register_boat then
\tmcl_boats.register_boat("${id}", {
\t\tdescription = S("${name} Boat"),
\t\tcolor = "${wood.plankColor}",
\t\twood = "${modname}:wood_${id}",
\t})
end

`;
  }

  // 9. Crafting Recipes
  out += `-- Crafting recipes for ${name}
minetest.register_craft({
\toutput = "${modname}:wood_${id} 4",
\trecipe = { { "${modname}:tree_${id}" } }
})

minetest.register_craft({
\ttype = "fuel",
\trecipe = "${modname}:wood_${id}",
\tburntime = 15,
})

minetest.register_craft({
\ttype = "fuel",
\trecipe = "${modname}:tree_${id}",
\tburntime = 30,
})

`;

  return out;
}

function generateToolLua(modname: string, tool: ToolDefinition): string {
  const id = tool.id;
  const name = tool.name;
  const tex = formatLuantiTexture(tool.baseTexture || 'mcl_tools_sword_iron.png', tool.tintColor);

  let groupcapsLua = '';
  if (tool.toolType === 'sword') {
    groupcapsLua = `\t\tgroupcaps = {
\t\t\tswordy = { times = { [1] = 0.8 / ${tool.digSpeed}, [2] = 0.4 / ${tool.digSpeed} }, uses = ${tool.durability}, maxlevel = 2 },
\t\t\tshearsy = { times = { [1] = 0.3 / ${tool.digSpeed} }, uses = ${tool.durability}, maxlevel = 1 }
\t\t},
\t\tdamage_groups = { fleshy = ${tool.attackDamage} },
\t\tfull_punch_interval = ${tool.attackSpeed}`;
  } else if (tool.toolType === 'pickaxe') {
    groupcapsLua = `\t\tgroupcaps = {
\t\t\tpickaxey = { times = { [1] = 1.0 / ${tool.digSpeed}, [2] = 0.5 / ${tool.digSpeed}, [3] = 0.3 / ${tool.digSpeed} }, uses = ${tool.durability}, maxlevel = 3 }
\t\t},
\t\tdamage_groups = { fleshy = ${Math.max(1, tool.attackDamage - 2)} },
\t\tfull_punch_interval = ${tool.attackSpeed}`;
  } else if (tool.toolType === 'axe') {
    groupcapsLua = `\t\tgroupcaps = {
\t\t\taxey = { times = { [1] = 1.2 / ${tool.digSpeed}, [2] = 0.6 / ${tool.digSpeed}, [3] = 0.4 / ${tool.digSpeed} }, uses = ${tool.durability}, maxlevel = 3 }
\t\t},
\t\tdamage_groups = { fleshy = ${tool.attackDamage} },
\t\tfull_punch_interval = ${tool.attackSpeed}`;
  } else if (tool.toolType === 'shovel') {
    groupcapsLua = `\t\tgroupcaps = {
\t\t\tshovely = { times = { [1] = 1.0 / ${tool.digSpeed}, [2] = 0.5 / ${tool.digSpeed}, [3] = 0.25 / ${tool.digSpeed} }, uses = ${tool.durability}, maxlevel = 3 }
\t\t},
\t\tdamage_groups = { fleshy = ${Math.max(1, tool.attackDamage - 3)} },
\t\tfull_punch_interval = ${tool.attackSpeed}`;
  } else {
    groupcapsLua = `\t\tgroupcaps = {
\t\t\thandy = { times = { [1] = 0.5 / ${tool.digSpeed} }, uses = ${tool.durability}, maxlevel = 1 }
\t\t},
\t\tdamage_groups = { fleshy = ${tool.attackDamage} },
\t\tfull_punch_interval = ${tool.attackSpeed}`;
  }

  const customVarsCode = renderCustomVariables(tool.customVariables, '\t');

  return `minetest.register_tool("${modname}:${id}", {
\tdescription = S("${name}"),
\tinventory_image = "${tex}",
\twield_image = "${tex}",
\tgroups = { tool = 1, ${tool.toolType} = 1 },
\ttool_capabilities = {
\t\tmax_drop_level = 3,
${groupcapsLua}
\t},
\t_mcl_durability = ${tool.durability},
${customVarsCode}})

`;
}

function generateFoodLua(modname: string, food: FoodDefinition): string {
  const id = food.id;
  const name = food.name;
  const tex = formatLuantiTexture(food.baseTexture || 'mcl_farming_apple.png', food.tintColor);

  let effectCallback = '';
  if (food.effects && food.effects.length > 0) {
    const effectCalls = food.effects.map(e => `\t\t\tif mcl_potions and mcl_potions.give_effect then
\t\t\t\tmcl_potions.give_effect(user, "${e.effect}", ${e.duration}, ${e.amplifier})
\t\t\tend`).join('\n');

    effectCallback = `\t\t${effectCalls}\n`;
  }

  return `minetest.register_craftitem("${modname}:${id}", {
\tdescription = S("${name}"),
\tinventory_image = "${tex}",
\twield_image = "${tex}",
\tgroups = { food = 2, eatable = ${food.hungerPoints} },
\t_mcl_saturation = ${food.saturation},
\ton_use = function(itemstack, user, pointed_thing)
\t\tlocal hp_change = ${food.healingPoints}
\t\tlocal replace_with_item = nil
\t\tlocal item = minetest.item_eat(hp_change, replace_with_item)(itemstack, user, pointed_thing)
${effectCallback}\t\treturn item
\tend,
})

`;
}

function generatePotionLua(modname: string, potion: PotionDefinition): string {
  const id = potion.id;
  const name = potion.name;

  return `-- Potion: ${name}
if mcl_potions and mcl_potions.register_potion then
\tmcl_potions.register_potion("${id}", {
\t\tname = "${name}",
\t\tdescription = S("${name}"),
\t\ttype = "${potion.potionType}",
\t\tcolor = "${potion.liquidColor}",
\t\teffects = {
${potion.effects.map(e => `\t\t\t{ name = "${e.effect}", duration = ${e.duration}, amplifier = ${e.amplifier} },`).join('\n')}
\t\t},
\t})

\t-- Brewing Recipe
\tif mcl_potions.register_brewing_recipe then
\t\tmcl_potions.register_brewing_recipe("${potion.baseIngredient || 'mcl_potions:awkward'}", "${potion.brewingIngredient || 'mcl_core:apple'}", "${modname}:${id}")
\tend
end

`;
}

function generateEnchantmentLua(modname: string, ench: EnchantmentDefinition): string {
  const id = ench.id;
  const name = ench.name;

  return `-- Enchantment: ${name}
if mcl_enchanting and mcl_enchanting.register_enchantment then
\tmcl_enchanting.register_enchantment("${id}", {
\t\tname = "${name}",
\t\tdescription = S("${ench.description}"),
\t\tmax_level = ${ench.maxLevel},
\t\trarity = "${ench.rarity}",
\t\tprimary = { ${ench.itemTargets.map(t => `"${t}"`).join(', ')} },
\t\tpower = function(level)
\t\t\treturn 1 + (level - 1) * ${ench.primaryPower}
\t\tend,
\t\ton_hit = function(itemstack, user, target, level)
\t\t\t-- Custom logic hook
${ench.hookCode ? '\t\t\t' + ench.hookCode.replace(/\n/g, '\n\t\t\t') : '\t\t\tminetest.chat_send_player(user:get_player_name(), "Enchantment triggered!")'}
\t\tend,
\t})
end

`;
}

function generateMobLua(modname: string, mob: EntityDefinition): string {
  const id = mob.id;
  const name = mob.name;

  return `-- Entity / Mob: ${name}
if mcl_mobs and mcl_mobs.register_mob then
\tmcl_mobs.register_mob("${modname}:${id}", {
\t\ttype = "${mob.type}",
\t\thp_min = ${mob.hp},
\t\thp_max = ${mob.hp},
\t\tcollisionbox = { -0.4, -0.01, -0.4, 0.4, 0.9, 0.4 },
\t\tvisual = "mesh",
\t\tmesh = "${mob.model}",
\t\ttextures = {
\t\t\t{ "${modname}_mob_${id}.png^[multiply:${mob.tintColor}" }
\t\t},
\t\tdamage = ${mob.attackDamage},
\t\twalk_velocity = ${mob.walkSpeed},
\t\trun_velocity = ${mob.runSpeed},
\t\tdrops = {
${mob.drops.map(d => `\t\t\t{ name = "${d.item}", chance = ${d.chance}, min = ${d.min}, max = ${d.max} },`).join('\n')}
\t\t},
\t})
end

`;
}

export function generateLgRegisterLua(mod: ModProject): string {
  const modname = mod.name;
  let code = `--[[
    Level Generation and Biome Registrations for ${mod.title}
    Registered using the exact logic from BetterCraft dappled_forest/lg_register.lua
--]]

local modname = minetest.get_current_modname()
local modpath = minetest.get_modpath(modname)

`;

  for (const biome of mod.biomes) {
    code += `-- ========================================================\n`;
    code += `-- Biome: ${biome.name} (${biome.id})\n`;
    code += `-- ========================================================\n\n`;

    // 1. Biome Registration
    code += `minetest.register_biome({
\tname = "${modname}:${biome.id}",
\tnode_top = "${biome.node_top}",
\tdepth_top = ${biome.depth_top},
\tnode_filler = "${biome.node_filler}",
\tdepth_filler = ${biome.depth_filler},
\tnode_stone = "${biome.node_stone}",
\tnode_water = "${biome.node_water}",
\ty_min = ${biome.y_min},
\ty_max = ${biome.y_max},
\theat_point = ${biome.heat_point},
\thumidity_point = ${biome.humidity_point},
\t_mcl_biome_type = "medium",
\t_mcl_palette_index = 0,
\t_mcl_vegetation_color = "${biome.vegetation_color}",
\t_mcl_water_color = "${biome.water_color}",
\t_mcl_sky_color = "${biome.sky_color}",
\t_mcl_fog_color = "${biome.fog_color}",
})

`;

    // 2. Decorations (MTS Schematics or Nodes on Ground)
    if (biome.decorations && biome.decorations.length > 0) {
      code += `-- Decorations for ${biome.name}\n`;
      for (const [idx, deco] of biome.decorations.entries()) {
        const decoName = `${modname}_${biome.id}_deco_${idx + 1}`;
        if (deco.type === 'schematic') {
          code += `minetest.register_decoration({
\tname = "${decoName}",
\tdeco_type = "schematic",
\tplace_on = { "${deco.place_on || biome.node_top}" },
\tsidelen = 16,
\tfill_ratio = ${deco.fill_ratio || 0.02},
\tbiomes = { "${modname}:${biome.id}" },
\ty_min = ${deco.y_min || biome.y_min},
\ty_max = ${deco.y_max || biome.y_max},
\tschematic = modpath .. "/schematics/${deco.target.replace('schematics/', '')}",
\tflags = "place_center_x, place_center_z",
\trotation = "random",
})

`;
        } else {
          // Node on ground (plant / flower / mushroom)
          code += `minetest.register_decoration({
\tname = "${decoName}",
\tdeco_type = "simple",
\tplace_on = { "${deco.place_on || biome.node_top}" },
\tsidelen = 16,
\tfill_ratio = ${deco.fill_ratio || 0.05},
\tbiomes = { "${modname}:${biome.id}" },
\ty_min = ${deco.y_min || biome.y_min},
\ty_max = ${deco.y_max || biome.y_max},
\tdecoration = "${deco.target}",
})

`;
        }
      }
    }

    // 3. Spawning Mobs in Biome
    if (biome.mobs && biome.mobs.length > 0) {
      code += `-- Mob Spawns for ${biome.name}\n`;
      for (const mob of biome.mobs) {
        code += `if mcl_mobs and mcl_mobs.register_spawn then
\tmcl_mobs.register_spawn("${mob.mobName}", { "${modname}:${biome.id}" }, ${mob.light_min}, ${mob.light_max}, ${mob.weight}, 10, ${mob.min_group}, ${mob.max_group})
end\n`;
      }
      code += `\n`;
    }
  }

  return code;
}

export function generateReadme(mod: ModProject): string {
  return `# ${mod.title}

${mod.description}

## Instalação no Luanti / BetterCraft / Mineclonia

1. Baixe o arquivo ZIP gerado pelo BetterCraft Mod Studio.
2. Extraia a pasta \`${mod.name}\` para o diretório de mods:
   - **Linux / Android**: \`~/.minetest/mods/\` ou \`games/bettercraft/mods/\`
   - **Windows**: \`%APPDATA%\\.minetest\\mods\\\` ou na pasta do jogo \`bettercraft\\mods\\\`
   - **macOS**: \`~/Library/Application Support/minetest/mods/\`
3. Ative o mod nas configurações do seu mundo no BetterCraft / Mineclonia.
4. Divirta-se!

## Conteúdo do Mod
- **Blocos**: ${mod.nodes.length}
- **Madeiras / Árvores**: ${mod.woodSets.length}
- **Biomas Customizados**: ${mod.biomes.length}
- **Ferramentas**: ${mod.tools.length}
- **Comidas**: ${mod.foods.length}
- **Poções**: ${mod.potions.length}
- **Encantamentos**: ${mod.enchantments.length}
- **Mobs**: ${mod.entities.length}
`;
}
