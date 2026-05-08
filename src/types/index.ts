export type ProcessStatus = "Calculado" | "Com erro" | "Pendente" | "Confirmado";

export interface Process {
  id: string;
  codigo: string;
  dataBase: string | null;
  valorAtual: number;
  valorCorrigido: number | null;
  diferenca: number | null;
  status: ProcessStatus;
}

export interface AuditHistory {
  id: string;
  date: string;
  time: string;
  action: string;
  description: string;
  usuario: string;
  type: "calculo" | "importacao" | "confirmacao" | "erro";
}

export interface AuditData {
  processo: string;
  valorAtual: number;
  valorCorrigido: number;
  diferenca: number;
  dataBase: string;
  dataCalculo: string;
  fonte: string;
  historico: AuditHistory[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
}

export interface SelicCalculationResult {
  codigo: string;
  valorCorrigido: number;
  diferenca: number;
  dataCalculo: string;
  fonte: string;
}
