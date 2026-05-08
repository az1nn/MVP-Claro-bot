import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/StatusBadge";
import { ProcessStatus } from "@/types";

const cases: { status: ProcessStatus; expectedText: string; colorPart: string }[] = [
  { status: "Calculado", expectedText: "Calculado", colorPart: "green" },
  { status: "Com erro", expectedText: "Com erro", colorPart: "red" },
  { status: "Pendente", expectedText: "Pendente", colorPart: "orange" },
  { status: "Confirmado", expectedText: "Confirmado", colorPart: "blue" },
];

describe("StatusBadge", () => {
  cases.forEach(({ status, expectedText, colorPart }) => {
    it(`renders "${expectedText}" label for status "${status}"`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it(`applies ${colorPart} colour class for status "${status}"`, () => {
      render(<StatusBadge status={status} />);
      const badge = screen.getByText(expectedText);
      expect(badge.className).toContain(colorPart);
    });
  });

  it("renders as a <span>", () => {
    render(<StatusBadge status="Calculado" />);
    const badge = screen.getByText("Calculado");
    expect(badge.tagName).toBe("SPAN");
  });
});
