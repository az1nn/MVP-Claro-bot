/**
 * @jest-environment node
 */
import { POST } from "@/app/api/selic/route";
import { NextRequest } from "next/server";

function makeRequest(body: object): NextRequest {
  return new NextRequest("http://localhost:3000/api/selic", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// Speed up tests by mocking setTimeout inside the route
jest.spyOn(global, "setTimeout").mockImplementation((fn) => {
  (fn as () => void)();
  return 0 as unknown as ReturnType<typeof setTimeout>;
});

describe("POST /api/selic", () => {
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

  it("calculates valorCorrigido for a process with a valid dataBase", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    const process = data.processes.find((p: { id: string }) => p.id === "1");
    expect(process.status).toBe("Calculado");
    expect(process.valorCorrigido).toBeGreaterThan(process.valorAtual);
  });

  it("sets status to 'Com erro' for processes with null dataBase", async () => {
    // id "3" = 000125 which has null dataBase
    const res = await POST(makeRequest({ ids: ["3"] }));
    const data = await res.json();
    const process = data.processes.find((p: { id: string }) => p.id === "3");
    expect(process.status).toBe("Com erro");
  });

  it("does not modify processes not in the ids list", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    const unchanged = data.processes.find((p: { id: string }) => p.id === "4");
    // id "4" = 000126, Pendente — should remain unchanged
    expect(unchanged.status).toBe("Pendente");
  });

  it("returns a dataCalculo timestamp", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    expect(typeof data.dataCalculo).toBe("string");
    expect(data.dataCalculo.length).toBeGreaterThan(0);
  });

  it("returns fonte as 'Banco Central / SGS'", async () => {
    const res = await POST(makeRequest({ ids: ["1"] }));
    const data = await res.json();
    expect(data.fonte).toBe("Banco Central / SGS");
  });

  it("can calculate multiple processes at once", async () => {
    const res = await POST(makeRequest({ ids: ["1", "2", "5"] }));
    const data = await res.json();
    const calculated = data.processes.filter(
      (p: { id: string; status: string }) =>
        ["1", "2", "5"].includes(p.id) && p.status === "Calculado"
    );
    expect(calculated).toHaveLength(3);
  });
});
