import { Process, AuditData } from "@/types";

export const MOCK_PROCESSES: Process[] = [
  {
    id: "1",
    codigo: "000123",
    dataBase: "15/03/2022",
    valorAtual: 10000.0,
    valorCorrigido: 12845.9,
    diferenca: 2845.9,
    status: "Calculado",
  },
  {
    id: "2",
    codigo: "000124",
    dataBase: "22/08/2021",
    valorAtual: 8500.0,
    valorCorrigido: 11032.2,
    diferenca: 2532.2,
    status: "Calculado",
  },
  {
    id: "3",
    codigo: "000125",
    dataBase: null,
    valorAtual: 6200.0,
    valorCorrigido: null,
    diferenca: null,
    status: "Com erro",
  },
  {
    id: "4",
    codigo: "000126",
    dataBase: "10/01/2023",
    valorAtual: 15000.0,
    valorCorrigido: null,
    diferenca: null,
    status: "Pendente",
  },
  {
    id: "5",
    codigo: "000127",
    dataBase: "05/11/2022",
    valorAtual: 9750.0,
    valorCorrigido: 12569.15,
    diferenca: 2819.15,
    status: "Calculado",
  },
  {
    id: "6",
    codigo: "000128",
    dataBase: "18/07/2021",
    valorAtual: 7300.0,
    valorCorrigido: 9622.11,
    diferenca: 2322.11,
    status: "Calculado",
  },
  {
    id: "7",
    codigo: "000129",
    dataBase: null,
    valorAtual: 4100.0,
    valorCorrigido: null,
    diferenca: null,
    status: "Com erro",
  },
  {
    id: "8",
    codigo: "000130",
    dataBase: "12/02/2023",
    valorAtual: 13200.0,
    valorCorrigido: null,
    diferenca: null,
    status: "Pendente",
  },
];

export const MOCK_AUDIT: AuditData = {
  processo: "000123",
  valorAtual: 10000.0,
  valorCorrigido: 12845.9,
  diferenca: 2845.9,
  dataBase: "15/03/2022",
  dataCalculo: "08/05/2026 10:42",
  fonte: "Banco Central / SGS",
  historico: [
    {
      id: "h1",
      date: "08/05/2026",
      time: "10:42",
      action: "Cálculo realizado",
      description: "Cálculo da atualização pela SELIC realizado com sucesso.",
      usuario: "Ana Martins",
      type: "calculo",
    },
    {
      id: "h2",
      date: "07/05/2026",
      time: "16:15",
      action: "Dados importados",
      description: "Dados do processo importados do sistema de origem.",
      usuario: "Sistema",
      type: "importacao",
    },
    {
      id: "h3",
      date: "07/05/2026",
      time: "16:00",
      action: "Atualização confirmada",
      description: "Atualização confirmada por Ana Martins.",
      usuario: "Ana Martins",
      type: "confirmacao",
    },
  ],
};

export function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDiff(value: number | null): string {
  if (value === null) return "—";
  const formatted = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value >= 0 ? `+${formatted}` : formatted;
}

// Simulated SELIC rate calculation
// In production this would call Banco Central do Brasil API (SGS system)
export function calcularSelicMock(
  valorAtual: number,
  dataBase: string
): { valorCorrigido: number; diferenca: number } {
  // Parse date dd/mm/yyyy
  const [day, month, year] = dataBase.split("/").map(Number);
  const base = new Date(year, month - 1, day);
  const now = new Date(2026, 4, 8); // current date in demo
  const diffMs = now.getTime() - base.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

  // Approximate accumulated SELIC (avg ~11% per year in recent years)
  const taxaAcumulada = Math.pow(1 + 0.11, diffYears);
  const valorCorrigido = parseFloat((valorAtual * taxaAcumulada).toFixed(2));
  const diferenca = parseFloat((valorCorrigido - valorAtual).toFixed(2));

  return { valorCorrigido, diferenca };
}
