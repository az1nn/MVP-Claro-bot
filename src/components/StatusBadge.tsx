import { ProcessStatus } from "@/types";

interface StatusBadgeProps {
  status: ProcessStatus;
}

const statusConfig: Record<
  ProcessStatus,
  { label: string; className: string }
> = {
  Calculado: {
    label: "Calculado",
    className: "bg-green-100 text-green-700 border border-green-200",
  },
  "Com erro": {
    label: "Com erro",
    className: "bg-red-100 text-red-600 border border-red-200",
  },
  Pendente: {
    label: "Pendente",
    className: "bg-orange-100 text-orange-600 border border-orange-200",
  },
  Confirmado: {
    label: "Confirmado",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
