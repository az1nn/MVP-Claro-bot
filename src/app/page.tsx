"use client";

import { useState, useMemo } from "react";
import ProcessTable from "@/components/ProcessTable";
import AuditPanel from "@/components/AuditPanel";
import Pagination from "@/components/Pagination";
import { Process, AuditData } from "@/types";
import { MOCK_PROCESSES, MOCK_AUDIT } from "@/lib/data";

const PER_PAGE = 8;
const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Calculado", value: "Calculado" },
  { label: "Pendente", value: "Pendente" },
  { label: "Com erro", value: "Com erro" },
  { label: "Confirmado", value: "Confirmado" },
];

export default function Home() {
  const [processes, setProcesses] = useState<Process[]>(MOCK_PROCESSES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeProcess, setActiveProcess] = useState<Process | null>(
    MOCK_PROCESSES[0]
  );
  const [audit, setAudit] = useState<AuditData | null>(MOCK_AUDIT);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<"selic" | "confirmar" | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const filtered = useMemo(() => {
    return processes.filter((p) => {
      const matchSearch =
        search === "" ||
        p.codigo.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [processes, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll(checked: boolean) {
    if (checked) setSelectedIds(new Set(paginated.map((p) => p.id)));
    else setSelectedIds(new Set());
  }

  function handleSelectProcess(process: Process) {
    setActiveProcess(process);
    if (process.status === "Calculado" && process.valorCorrigido !== null) {
      const now = new Date(2026, 4, 8);
      const dataCalculo = now.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setAudit({
        processo: process.codigo,
        valorAtual: process.valorAtual,
        valorCorrigido: process.valorCorrigido!,
        diferenca: process.diferenca!,
        dataBase: process.dataBase ?? "—",
        dataCalculo,
        fonte: "Banco Central / SGS",
        historico: MOCK_AUDIT.historico,
      });
    } else {
      setAudit(null);
    }
  }

  async function handleCalcular() {
    const ids =
      selectedIds.size > 0
        ? Array.from(selectedIds)
        : paginated.map((p) => p.id);

    setLoading("selic");
    try {
      const res = await fetch("/api/selic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        setProcesses(data.processes);
        if (activeProcess && ids.includes(activeProcess.id)) {
          const updated = data.processes.find(
            (p: Process) => p.id === activeProcess.id
          );
          if (updated) handleSelectProcess(updated);
        }
        showToast("Cálculo SELIC realizado com sucesso.", "success");
        setSelectedIds(new Set());
      }
    } catch {
      showToast("Erro ao calcular atualização SELIC.", "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleConfirmar() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      showToast("Selecione ao menos um processo para confirmar.", "error");
      return;
    }
    setLoading("confirmar");
    try {
      const res = await fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        setProcesses(data.processes);
        showToast("Atualizações confirmadas com sucesso.", "success");
        setSelectedIds(new Set());
      }
    } catch {
      showToast("Erro ao confirmar atualizações.", "error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">
          {/* Main panel */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Atualização de Valores pela SELIC
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Calcule e atualize os valores dos processos com base nos índices
                oficiais do Banco Central.
              </p>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-48">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por código/processo"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-500 font-medium">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleCalcular}
                  disabled={loading !== null}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading === "selic" ? (
                    <Spinner />
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  Calcular atualização SELIC
                </button>

                <button
                  onClick={handleConfirmar}
                  disabled={loading !== null || selectedIds.size === 0}
                  className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-white"
                >
                  {loading === "confirmar" ? (
                    <Spinner className="text-gray-500" />
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  Confirmar atualizações
                  {selectedIds.size > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      {selectedIds.size}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <ProcessTable
                processes={paginated}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onSelectProcess={handleSelectProcess}
                activeProcessId={activeProcess?.id ?? null}
              />
              <Pagination
                pagination={{
                  currentPage,
                  totalPages,
                  totalRecords: filtered.length,
                  perPage: PER_PAGE,
                }}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          {/* Audit sidebar */}
          <AuditPanel audit={audit} />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Spinner({ className = "text-white" }: { className?: string }) {
  return (
    <svg className={`animate-spin w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  );
}
