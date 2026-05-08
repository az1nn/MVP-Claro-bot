/**
 * @jest-environment node
 */
import {
  formatCurrency,
  formatDiff,
  calcularSelicMock,
  MOCK_PROCESSES,
  MOCK_AUDIT,
} from "@/lib/data";

// pt-BR locale may use a non-breaking space (\u00a0) between "R$" and the
// amount depending on the runtime. Normalising makes assertions portable.
const norm = (s: string) => s.replace(/\u00a0/g, " ");

describe("formatCurrency", () => {
  it("formats a positive number as BRL currency", () => {
    expect(norm(formatCurrency(10000))).toBe("R$ 10.000,00");
  });

  it("formats a decimal value correctly", () => {
    expect(norm(formatCurrency(12845.9))).toBe("R$ 12.845,90");
  });

  it("returns '—' for null", () => {
    expect(formatCurrency(null)).toBe("—");
  });

  it("formats zero correctly", () => {
    expect(norm(formatCurrency(0))).toBe("R$ 0,00");
  });
});

describe("formatDiff", () => {
  it("returns '—' for null", () => {
    expect(formatDiff(null)).toBe("—");
  });

  it("prefixes positive values with '+'", () => {
    const result = norm(formatDiff(2845.9));
    expect(result).toMatch(/^\+R\$/);
    expect(result).toContain("2.845,90");
  });

  it("does not prefix negative values with '+'", () => {
    const result = norm(formatDiff(-500));
    expect(result).not.toMatch(/^\+/);
    expect(result).toContain("500,00");
  });

  it("prefixes zero with '+'", () => {
    const result = norm(formatDiff(0));
    expect(result).toMatch(/^\+/);
  });
});

describe("calcularSelicMock", () => {
  it("returns a higher corrected value than the original", () => {
    const { valorCorrigido, diferenca } = calcularSelicMock(
      10000,
      "15/03/2022"
    );
    expect(valorCorrigido).toBeGreaterThan(10000);
    expect(diferenca).toBeGreaterThan(0);
  });

  it("diferenca equals valorCorrigido minus valorAtual", () => {
    const { valorCorrigido, diferenca } = calcularSelicMock(
      8500,
      "22/08/2021"
    );
    expect(diferenca).toBeCloseTo(valorCorrigido - 8500, 1);
  });

  it("returns values rounded to 2 decimal places", () => {
    const { valorCorrigido, diferenca } = calcularSelicMock(
      1000,
      "01/01/2023"
    );
    expect(valorCorrigido.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    expect(diferenca.toString()).toMatch(/^-?\d+(\.\d{1,2})?$/);
  });

  it("older dates produce larger corrections", () => {
    const older = calcularSelicMock(10000, "01/01/2020");
    const newer = calcularSelicMock(10000, "01/01/2025");
    expect(older.diferenca).toBeGreaterThan(newer.diferenca);
  });
});

describe("MOCK_PROCESSES", () => {
  it("contains 8 processes", () => {
    expect(MOCK_PROCESSES).toHaveLength(8);
  });

  it("all processes have required fields", () => {
    MOCK_PROCESSES.forEach((p) => {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("codigo");
      expect(p).toHaveProperty("valorAtual");
      expect(p).toHaveProperty("status");
    });
  });

  it("codes are zero-padded 6-digit strings", () => {
    MOCK_PROCESSES.forEach((p) => {
      expect(p.codigo).toMatch(/^\d{6}$/);
    });
  });

  it("processes with null dataBase have Com erro or Pendente status", () => {
    const withoutDate = MOCK_PROCESSES.filter((p) => p.dataBase === null);
    withoutDate.forEach((p) => {
      expect(["Com erro", "Pendente"]).toContain(p.status);
    });
  });

  it("Calculado processes have non-null valorCorrigido and diferenca", () => {
    const calculados = MOCK_PROCESSES.filter((p) => p.status === "Calculado");
    calculados.forEach((p) => {
      expect(p.valorCorrigido).not.toBeNull();
      expect(p.diferenca).not.toBeNull();
    });
  });
});

describe("MOCK_AUDIT", () => {
  it("has the correct processo code", () => {
    expect(MOCK_AUDIT.processo).toBe("000123");
  });

  it("has at least one historico entry", () => {
    expect(MOCK_AUDIT.historico.length).toBeGreaterThan(0);
  });

  it("each historico entry has required fields", () => {
    MOCK_AUDIT.historico.forEach((h) => {
      expect(h).toHaveProperty("id");
      expect(h).toHaveProperty("date");
      expect(h).toHaveProperty("action");
      expect(h).toHaveProperty("usuario");
      expect(h).toHaveProperty("type");
    });
  });

  it("diferenca matches valorCorrigido minus valorAtual", () => {
    expect(MOCK_AUDIT.diferenca).toBeCloseTo(
      MOCK_AUDIT.valorCorrigido - MOCK_AUDIT.valorAtual,
      1
    );
  });
});
