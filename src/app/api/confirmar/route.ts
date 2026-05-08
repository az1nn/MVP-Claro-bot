import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROCESSES } from "@/lib/data";
import { Process } from "@/types";

// Mock confirm endpoint
// In production this would persist confirmations to the database
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ids }: { ids: string[] } = body;

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Only Calculado processes can be confirmed
  const updated: Process[] = MOCK_PROCESSES.map((p) => {
    if (!ids.includes(p.id)) return p;
    if (p.status !== "Calculado") return p;
    return { ...p, status: "Confirmado" };
  });

  return NextResponse.json({ success: true, processes: updated });
}
