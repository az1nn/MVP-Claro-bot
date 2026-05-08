/**
 * @jest-environment node
 */
import { POST } from "@/app/api/confirmar/route";
import { NextRequest } from "next/server";

function makeRequest(body: object): NextRequest {
  return new NextRequest("http://localhost:3000/api/confirmar", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

jest.spyOn(global, "setTimeout").mockImplementation((fn) => {
  (fn as () => void)();
  return 0 as unknown as ReturnType<typeof setTimeout>;
});

describe("POST /api/confirmar", () => {
  it("returns success: true", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns the full processes array", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    expect(Array.isArray(data.processes)).toBe(true);
    expect(data.processes).toHaveLength(8);
  });

  it("sets Calculado processes to Confirmado", async () => {
    // id "1" = 000123, Calculado
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    const process = data.processes.find((p: { id: string }) => p.id === "1");
    expect(process.status).toBe("Confirmado");
  });

  it("does not confirm Pendente processes", async () => {
    // id "4" = 000126, Pendente
    const res = await POST(makeRequest({ ids: ["4"] }));
    const data = await res.json();
    const process = data.processes.find((p: { id: string }) => p.id === "4");
    expect(process.status).toBe("Pendente");
  });

  it("does not confirm Com erro processes", async () => {
    // id "3" = 000125, Com erro
    const res = await POST(makeRequest({ ids: ["3"] }));
    const data = await res.json();
    const process = data.processes.find((p: { id: string }) => p.id === "3");
    expect(process.status).toBe("Com erro");
  });

  it("does not modify processes not in the ids list", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    const unchanged = data.processes.find((p: { id: string }) => p.id === "2");
    expect(unchanged.status).toBe("Calculado");
  });

  it("can confirm multiple Calculado processes at once", async () => {
    // ids 1, 2, 5, 6 are all Calculado
    const res = await POST(makeRequest({ ids: ["1", "2", "5", "6"] }));
    const data = await res.json();
    const confirmed = data.processes.filter(
      (p: { id: string; status: string }) =>
        ["1", "2", "5", "6"].includes(p.id) && p.status === "Confirmado"
    );
    expect(confirmed).toHaveLength(4);
  });
});
