import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProcessTable from "@/components/ProcessTable";
import { Process } from "@/types";

const mockProcesses: Process[] = [
  {
    id: "1",
    codigo: "000123",
    dataBase: "15/03/2022",
    valorAtual: 10000,
    valorCorrigido: 12845.9,
    diferenca: 2845.9,
    status: "Calculado",
  },
  {
    id: "2",
    codigo: "000124",
    dataBase: null,
    valorAtual: 6200,
    valorCorrigido: null,
    diferenca: null,
    status: "Com erro",
  },
  {
    id: "3",
    codigo: "000125",
    dataBase: "10/01/2023",
    valorAtual: 15000,
    valorCorrigido: null,
    diferenca: null,
    status: "Pendente",
  },
];

function renderTable(overrides: Partial<React.ComponentProps<typeof ProcessTable>> = {}) {
  const defaults = {
    processes: mockProcesses,
    selectedIds: new Set<string>(),
    onToggleSelect: jest.fn(),
    onSelectAll: jest.fn(),
    onSelectProcess: jest.fn(),
    activeProcessId: null,
  };
  return render(<ProcessTable {...defaults} {...overrides} />);
}

describe("ProcessTable", () => {
  it("renders all process codes", () => {
    renderTable();
    expect(screen.getByText("000123")).toBeInTheDocument();
    expect(screen.getByText("000124")).toBeInTheDocument();
    expect(screen.getByText("000125")).toBeInTheDocument();
  });

  it("renders '—' for null dataBase", () => {
    renderTable();
    // Row 2 has null dataBase
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders status badges for each process", () => {
    renderTable();
    expect(screen.getByText("Calculado")).toBeInTheDocument();
    expect(screen.getByText("Com erro")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });

  it("calls onSelectProcess when a row is clicked", async () => {
    const onSelectProcess = jest.fn();
    renderTable({ onSelectProcess });
    await userEvent.click(screen.getByText("000123"));
    expect(onSelectProcess).toHaveBeenCalledWith(mockProcesses[0]);
  });

  it("calls onToggleSelect when a row checkbox is clicked", async () => {
    const onToggleSelect = jest.fn();
    renderTable({ onToggleSelect });
    const checkboxes = screen.getAllByRole("checkbox");
    // First checkbox is "select all"; row checkboxes start at index 1
    await userEvent.click(checkboxes[1]);
    expect(onToggleSelect).toHaveBeenCalledWith("1");
  });

  it("calls onSelectAll(true) when select-all checkbox is checked", async () => {
    const onSelectAll = jest.fn();
    renderTable({ onSelectAll });
    await userEvent.click(screen.getByLabelText("Selecionar todos"));
    expect(onSelectAll).toHaveBeenCalledWith(true);
  });

  it("calls onSelectAll(false) when select-all checkbox is unchecked", async () => {
    const onSelectAll = jest.fn();
    // All selected → unchecking should call with false
    renderTable({
      onSelectAll,
      selectedIds: new Set(["1", "2", "3"]),
    });
    await userEvent.click(screen.getByLabelText("Selecionar todos"));
    expect(onSelectAll).toHaveBeenCalledWith(false);
  });

  it("renders a checked checkbox for a selected process", () => {
    renderTable({ selectedIds: new Set(["1"]) });
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("applies active row styling when activeProcessId matches", () => {
    renderTable({ activeProcessId: "1" });
    // The active row should have bg-blue-50
    const row = screen.getByText("000123").closest("tr");
    expect(row?.className).toContain("bg-blue-50");
  });

  it("renders positive diferenca values in green", () => {
    renderTable();
    const diffCell = screen.getByText("+R$ 2.845,90");
    expect(diffCell.className).toContain("text-green-600");
  });
});
