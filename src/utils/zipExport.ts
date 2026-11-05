import JSZip from 'jszip';
import { ModProject } from '../types/mod';
import { generateInitLua, generateLgRegisterLua, generateModConf, generateReadme } from './luaGenerator';
import { generatePngDataUrl } from './textureUtils';

export async function exportModToZip(mod: ModProject): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(mod.name) || zip;

  // 1. Root configuration and scripts
  folder.file('mod.conf', generateModConf(mod));
  folder.file('init.lua', generateInitLua(mod));
  if (mod.biomes && mod.biomes.length > 0) {
    folder.file('lg_register.lua', generateLgRegisterLua(mod));
  }
  folder.file('README.md', generateReadme(mod));

  // 2. Textures folder
  const texturesFolder = folder.folder('textures');
  if (texturesFolder) {
    // Generate/include textures for nodes
    for (const node of mod.nodes) {
      if (node.textures.customImageData) {
        // User uploaded custom image
        const base64Data = node.textures.customImageData.split(',')[1];
        if (base64Data) {
          const fileName = node.textures.customFileName || `${mod.name}_node_${node.id}.png`;
          texturesFolder.file(fileName, base64Data, { base64: true });
        }
      } else {
        // Procedural PNG for preview/export
        const dataUrl = generatePngDataUrl('smooth', node.textures.tintColor || '#ffffff');
        const base64Data = dataUrl.split(',')[1];
        texturesFolder.file(`${mod.name}_node_${node.id}.png`, base64Data, { base64: true });
      }
    }

    // Wood textures
    for (const wood of mod.woodSets) {
      const plankDataUrl = generatePngDataUrl('grain', wood.plankColor || '#ca8a04');
      texturesFolder.file(`${mod.name}_wood_${wood.id}.png`, plankDataUrl.split(',')[1], { base64: true });

      const barkDataUrl = generatePngDataUrl('grain', wood.barkColor || '#78350f');
      texturesFolder.file(`${mod.name}_tree_${wood.id}.png`, barkDataUrl.split(',')[1], { base64: true });

      if (wood.hasLeaves) {
        const leavesDataUrl = generatePngDataUrl('leaves', wood.leavesColor || '#d97706');
        texturesFolder.file(`${mod.name}_leaves_${wood.id}.png`, leavesDataUrl.split(',')[1], { base64: true });
      }
    }

    // Tools
    for (const tool of mod.tools) {
      const toolDataUrl = generatePngDataUrl(
        tool.toolType === 'sword' ? 'tool_sword' : 'tool_pickaxe',
        tool.tintColor || '#e11d48'
      );
      texturesFolder.file(`${mod.name}_tool_${tool.id}.png`, toolDataUrl.split(',')[1], { base64: true });
    }

    // Food
    for (const food of mod.foods) {
      const foodDataUrl = generatePngDataUrl('food', food.tintColor || '#f97316');
      texturesFolder.file(`${mod.name}_food_${food.id}.png`, foodDataUrl.split(',')[1], { base64: true });
    }
  }

  // 3. Schematics folder placeholder for biomes
  if (mod.biomes && mod.biomes.length > 0) {
    const schemFolder = folder.folder('schematics');
    if (schemFolder) {
      schemFolder.file(
        'README_SCHEMATICS.txt',
        `Coloque seus arquivos de árvores ou estruturas em formato .mts nesta pasta schematics/\nExemplo: poplar_tree.mts\nCompatível com WorldEdit e Mineclonia levelgen!`
      );
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
