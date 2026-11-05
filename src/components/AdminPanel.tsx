import React, { useState } from 'react';
import { CustomVariable, ModProject } from '../types/mod';
import { ShieldCheck, Plus, Trash2, CheckCircle2, Sliders, Code2, Sparkles, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  mod: ModProject;
  onUpdateGlobalVariables: (vars: CustomVariable[]) => void;
  onAddVariableToNode: (nodeId: string, variable: CustomVariable) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  mod,
  onUpdateGlobalVariables,
  onAddVariableToNode,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'global' | string>('global');

  // New variable form state
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<CustomVariable['type']>('boolean');
  const [newDesc, setNewDesc] = useState('');

  const QUICK_ADMIN_PRESETS: Array<{
    title: string;
    key: string;
    value: string;
    type: CustomVariable['type'];
    desc: string;
  }> = [
    {
      title: 'Luz Suave (paramtype="light")',
      key: 'paramtype',
      value: 'light',
      type: 'string',
      desc: 'Ativa propagação suave de luz no nó',
    },
    {
      title: 'Transparência de Textura (use_texture_alpha=true)',
      key: 'use_texture_alpha',
      value: 'true',
      type: 'boolean',
      desc: 'Habilita canal alpha para recortes ou texturas transparentes',
    },
    {
      title: 'Luz Solar Atravessa (sunlight_propagates=true)',
      key: 'sunlight_propagates',
      value: 'true',
      type: 'boolean',
      desc: 'Permite que a luz do sol passe através do bloco',
    },
    {
      title: 'Caminhável Sólido (walkable=true)',
      key: 'walkable',
      value: 'true',
      type: 'boolean',
      desc: 'Jogadores e entidades colidem com este bloco',
    },
    {
      title: 'Grupos Padrão do Pedido (groups = { ... })',
      key: 'groups',
      value: '{ pickaxey = 1, attached_node = 1, not_in_creative_inventory = 1 }',
      type: 'table',
      desc: 'Quebrável com picareta, cai se bloco de apoio sumir, escondido do criativo',
    },
    {
      title: 'Escalável como Escada (climbable=true)',
      key: 'climbable',
      value: 'true',
      type: 'boolean',
      desc: 'Permite subir no bloco segurando espaço',
    },
    {
      title: 'Substituível (buildable_to=true)',
      key: 'buildable_to',
      value: 'true',
      type: 'boolean',
      desc: 'Outro bloco pode ser colocado por cima (ex: grama alta, flores)',
    },
    {
      title: 'Resistência a Explosões (_mcl_blast_resistance=6000)',
      key: '_mcl_blast_resistance',
      value: '6000',
      type: 'number',
      desc: 'Resiste a TNT e explosões de creepers como Obsidian',
    },
  ];

  const currentVariables = selectedTarget === 'global'
    ? mod.globalVariables
    : mod.nodes.find((n) => n.id === selectedTarget)?.customVariables || [];

  const handleToggle = (id: string) => {
    if (selectedTarget === 'global') {
      const updated = mod.globalVariables.map((v) =>
        v.id === id ? { ...v, enabled: !v.enabled } : v
      );
      onUpdateGlobalVariables(updated);
    } else {
      const targetNode = mod.nodes.find((n) => n.id === selectedTarget);
      if (targetNode) {
        const updated = targetNode.customVariables.map((v) =>
          v.id === id ? { ...v, enabled: !v.enabled } : v
        );
        targetNode.customVariables = updated;
        onAddVariableToNode(selectedTarget, { ...targetNode.customVariables[0] }); // triggers update
      }
    }
  };

  const handleDelete = (id: string) => {
    if (selectedTarget === 'global') {
      const updated = mod.globalVariables.filter((v) => v.id !== id);
      onUpdateGlobalVariables(updated);
    } else {
      const targetNode = mod.nodes.find((n) => n.id === selectedTarget);
      if (targetNode) {
        targetNode.customVariables = targetNode.customVariables.filter((v) => v.id !== id);
        onAddVariableToNode(selectedTarget, { ...targetNode.customVariables[0] });
      }
    }
  };

  const handleAddPreset = (preset: typeof QUICK_ADMIN_PRESETS[0]) => {
    const newVar: CustomVariable = {
      id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      key: preset.key,
      value: preset.value,
      type: preset.type,
      description: preset.desc,
      enabled: true,
    };

    if (selectedTarget === 'global') {
      onUpdateGlobalVariables([...mod.globalVariables, newVar]);
    } else {
      onAddVariableToNode(selectedTarget, newVar);
    }
  };

  const handleAddNewCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    const newVar: CustomVariable = {
      id: `var_${Date.now()}`,
      key: newKey.trim(),
      value: newValue.trim(),
      type: newType,
      description: newDesc.trim() || undefined,
      enabled: true,
    };

    if (selectedTarget === 'global') {
      onUpdateGlobalVariables([...mod.globalVariables, newVar]);
    } else {
      onAddVariableToNode(selectedTarget, newVar);
    }

    setNewKey('');
    setNewValue('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Admin Shield */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-amber-500/30 bg-amber-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Painel de Administrador - Variáveis Customizadas Lua
            </h2>
            <p className="text-xs text-slate-400">
              Injete propriedades especiais, flags de física, grupos e variáveis do Luanti / Mineclonia diretamente no código.
            </p>
          </div>
        </div>

        {/* Target Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Injetar em:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="global">Variáveis Globais do Mod (init.lua)</option>
            {mod.nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Bloco: {node.name} ({node.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Inserter Presets */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Predefinições Rápidas do Luanti / Mineclonia (1 Clique para Injetar)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {QUICK_ADMIN_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => handleAddPreset(preset)}
              className="text-left p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-amber-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {preset.desc}
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <code className="text-emerald-400 truncate max-w-[140px]">{preset.key}</code>
                <span className="text-amber-400 font-medium group-hover:underline">+ Inserir</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Variables Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              Variáveis Ativas em: {selectedTarget === 'global' ? 'Escopo Global do Mod' : `Bloco ${selectedTarget}`}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total: {currentVariables.length}
          </span>
        </div>

        {currentVariables.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">Nenhuma variável customizada injetada neste alvo ainda.</p>
            <p className="text-[11px] text-slate-400">
              Use as predefinições acima ou o formulário abaixo para adicionar <code className="text-slate-300">paramtype = "light"</code>, <code className="text-slate-300">use_texture_alpha = true</code>, etc.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {currentVariables.map((v) => (
              <div key={v.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(v.id)}
                    className={`mt-0.5 sm:mt-0 p-1 rounded-md transition-colors ${
                      v.enabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                    }`}
                    title={v.enabled ? 'Ativo (será exportado no Lua)' : 'Desativado'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-200">{v.key}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                        {v.type}
                      </span>
                      {!v.enabled && (
                        <span className="text-[10px] text-slate-500 italic">(Desativado)</span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-emerald-400 break-all">
                      = {v.type === 'string' ? `"${v.value}"` : v.value}
                    </div>
                    {v.description && (
                      <div className="text-[11px] text-slate-400">{v.description}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir variável"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Variable Creator Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-emerald-400" />
          Adicionar Nova Variável Customizada Manualmente
        </div>

        <form onSubmit={handleAddNewCustom} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nome da Variável / Chave Lua</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Ex: paramtype ou walkable"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tipo de Dado</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as CustomVariable['type'])}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="boolean">Boolean (true / false)</option>
                <option value="string">String ("light", "facedir")</option>
                <option value="number">Number (1, 15, 6000)</option>
                <option value="table">Table Lua ({'{ pickaxey = 1 }'})</option>
                <option value="raw">Raw Lua Code</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Valor</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={newType === 'boolean' ? 'true' : newType === 'string' ? 'light' : '{ key = 1 }'}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Descrição / Anotação (Opcional)</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Ex: Habilita que o bloco propague luz sem sombras escuras"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Injetar Variável no {selectedTarget === 'global' ? 'Global' : 'Bloco'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
