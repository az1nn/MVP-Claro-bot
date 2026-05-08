import { render, screen } from "@testing-library/react";
import AuditPanel from "@/components/AuditPanel";
import { AuditData } from "@/types";

const mockAudit: AuditData = {
  processo: "000123",
  valorAtual: 10000,
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
  ],
};

describe("AuditPanel", () => {
  describe("when audit is null", () => {
    it("renders a prompt to select a process", () => {
      render(<AuditPanel audit={null} />);
      expect(
        screen.getByText(/Selecione um processo para ver a auditoria/i)
      ).toBeInTheDocument();
    });

    it("does not render audit details", () => {
      render(<AuditPanel audit={null} />);
      expect(screen.queryByText(/Processo:/)).not.toBeInTheDocument();
    });
  });

  describe("when audit data is provided", () => {
    it("renders the process code", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("Processo: 000123")).toBeInTheDocument();
    });

    it("renders the current value", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("R$ 10.000,00")).toBeInTheDocument();
    });

    it("renders the corrected value", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("R$ 12.845,90")).toBeInTheDocument();
    });

    it("renders the diferenca with a + prefix", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("+R$ 2.845,90")).toBeInTheDocument();
    });

    it("renders the base date", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("15/03/2022")).toBeInTheDocument();
    });

    it("renders the fonte", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("Banco Central / SGS")).toBeInTheDocument();
    });

    it("renders the Histórico section heading", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("Histórico")).toBeInTheDocument();
    });

    it("renders all history entries", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("Cálculo realizado")).toBeInTheDocument();
      expect(screen.getByText("Dados importados")).toBeInTheDocument();
    });

    it("renders history entry descriptions", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(
        screen.getByText(
          "Cálculo da atualização pela SELIC realizado com sucesso."
        )
      ).toBeInTheDocument();
    });

    it("renders history entry users", () => {
      render(<AuditPanel audit={mockAudit} />);
      expect(screen.getByText("Usuário: Ana Martins")).toBeInTheDocument();
      expect(screen.getByText("Usuário: Sistema")).toBeInTheDocument();
    });
  });
});
