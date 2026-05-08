"use client";

import { AuditData, AuditHistory } from "@/types";
import { formatCurrency, formatDiff } from "@/lib/data";

interface AuditPanelProps {
  audit: AuditData | null;
}

const historyTypeColor: Record<AuditHistory["type"], string> = {
  calculo: "bg-blue-500",
  importacao: "bg-gray-400",
  confirmacao: "bg-gray-400",
  erro: "bg-red-500",
};

const historyBadgeStyle: Record<AuditHistory["type"], string> = {
  calculo: "bg-blue-100 text-blue-700",
  importacao: "bg-gray-100 text-gray-600",
  confirmacao: "bg-gray-100 text-gray-600",
  erro: "bg-red-100 text-red-600",
};

export default function AuditPanel({ audit }: AuditPanelProps) {
  if (!audit) {
    return (
      <aside className="w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-center">
        <p className="text-sm text-gray-400 text-center">
          Selecione um processo para ver a auditoria
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800">
        Auditoria da atualização
      </h2>

      {/* Process highlight */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <span className="font-semibold text-blue-700 text-sm">
          Processo: {audit.processo}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3">
        <AuditRow label="Valor atual" value={formatCurrency(audit.valorAtual)} />
        <AuditRow
          label="Valor corrigido"
          value={formatCurrency(audit.valorCorrigido)}
        />
        <AuditRow
          label="Diferença"
          value={formatDiff(audit.diferenca)}
          valueClassName="text-green-600 font-semibold"
        />
        <AuditRow label="Data-base" value={audit.dataBase} />
        <AuditRow label="Data do cálculo" value={audit.dataCalculo} />
        <AuditRow label="Fonte" value={audit.fonte} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* History */}
      <div>
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Histórico</h3>
        <ol className="relative flex flex-col gap-0">
          {audit.historico.map((item, idx) => (
            <li key={item.id} className="flex gap-3">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full mt-1 shrink-0 ${historyTypeColor[item.type]}`}
                />
                {idx < audit.historico.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 my-1" />
                )}
              </div>

              {/* Content */}
              <div className="pb-5">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs text-gray-500">
                    {item.date} {item.time}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${historyBadgeStyle[item.type]}`}
                  >
                    {item.action}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                <p className="text-xs text-gray-400">Usuário: {item.usuario}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function AuditRow({
  label,
  value,
  valueClassName = "text-gray-800",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}
