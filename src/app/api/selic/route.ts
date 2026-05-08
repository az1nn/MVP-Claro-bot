import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROCESSES, calcularSelicMock } from "@/lib/data";
import { Process } from "@/types";

// Mock SELIC calculation endpoint
// In production this would fetch accumulated rates from Banco Central do Brasil SGS API
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ids }: { ids: string[] } = body;

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date(2026, 4, 8);
  const dataCalculo = now.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updated: Process[] = MOCK_PROCESSES.map((p) => {
    if (!ids.includes(p.id)) return p;

    // Only calculate processes that have a base date
    if (!p.dataBase) {
      return { ...p, status: "Com erro" };
    }

    const { valorCorrigido, diferenca } = calcularSelicMock(
      p.valorAtual,
      p.dataBase
    );

    return {
      ...p,
      valorCorrigido,
      diferenca,
      status: "Calculado",
    };
  });

  return NextResponse.json({
    success: true,
    dataCalculo,
    fonte: "Banco Central / SGS",
    processes: updated,
  });
}
