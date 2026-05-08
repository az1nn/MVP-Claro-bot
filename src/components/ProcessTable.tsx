"use client";

import { Process } from "@/types";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDiff } from "@/lib/data";

interface ProcessTableProps {
  processes: Process[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectProcess: (process: Process) => void;
  activeProcessId: string | null;
}

export default function ProcessTable({
  processes,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onSelectProcess,
  activeProcessId,
}: ProcessTableProps) {
  const allSelected =
    processes.length > 0 && processes.every((p) => selectedIds.has(p.id));
  const someSelected = processes.some((p) => selectedIds.has(p.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-10 px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                aria-label="Selecionar todos"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Processo
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Data-base
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Valor atual
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Valor corrigido
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Diferença
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Status
            </th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => {
            const isSelected = selectedIds.has(process.id);
            const isActive = activeProcessId === process.id;
            return (
              <tr
                key={process.id}
                onClick={() => onSelectProcess(process)}
                className={`border-b border-gray-50 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-blue-50"
                    : isSelected
                      ? "bg-blue-50/50"
                      : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onToggleSelect(process.id)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    aria-label={`Selecionar processo ${process.codigo}`}
                  />
                </td>
                <td className="px-4 py-4 font-medium text-gray-800">
                  {process.codigo}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {process.dataBase ?? "—"}
                </td>
                <td className="px-4 py-4 text-gray-800">
                  {formatCurrency(process.valorAtual)}
                </td>
                <td className="px-4 py-4 text-gray-800">
                  {formatCurrency(process.valorCorrigido)}
                </td>
                <td
                  className={`px-4 py-4 font-medium ${
                    process.diferenca !== null && process.diferenca > 0
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {formatDiff(process.diferenca)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={process.status} />
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400"
                    aria-label={`Mais opções para ${process.codigo}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
