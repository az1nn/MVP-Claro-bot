import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "@/components/Pagination";
import { PaginationInfo } from "@/types";

function makePagination(overrides: Partial<PaginationInfo> = {}): PaginationInfo {
  return {
    currentPage: 1,
    totalPages: 16,
    totalRecords: 128,
    perPage: 8,
    ...overrides,
  };
}

describe("Pagination", () => {
  it("displays the correct record range for page 1", () => {
    render(<Pagination pagination={makePagination()} onPageChange={jest.fn()} />);
    expect(screen.getByText("Mostrando 1 a 8 de 128 registros")).toBeInTheDocument();
  });

  it("displays the correct record range for a middle page", () => {
    render(
      <Pagination
        pagination={makePagination({ currentPage: 3 })}
        onPageChange={jest.fn()}
      />
    );
    expect(screen.getByText("Mostrando 17 a 24 de 128 registros")).toBeInTheDocument();
  });

  it("displays the correct record range for the last page", () => {
    render(
      <Pagination
        pagination={makePagination({ currentPage: 16, totalRecords: 128 })}
        onPageChange={jest.fn()}
      />
    );
    expect(screen.getByText("Mostrando 121 a 128 de 128 registros")).toBeInTheDocument();
  });

  it("calls onPageChange with the next page when next button is clicked", async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination pagination={makePagination({ currentPage: 2 })} onPageChange={onPageChange} />
    );
    await userEvent.click(screen.getByLabelText("Próxima página"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the previous page when prev button is clicked", async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination pagination={makePagination({ currentPage: 3 })} onPageChange={onPageChange} />
    );
    await userEvent.click(screen.getByLabelText("Página anterior"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with the correct page when a page number is clicked", async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        pagination={makePagination({ currentPage: 1, totalPages: 3, totalRecords: 24 })}
        onPageChange={onPageChange}
      />
    );
    await userEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables the previous button on the first page", () => {
    render(<Pagination pagination={makePagination({ currentPage: 1 })} onPageChange={jest.fn()} />);
    expect(screen.getByLabelText("Página anterior")).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    render(
      <Pagination
        pagination={makePagination({ currentPage: 16, totalPages: 16 })}
        onPageChange={jest.fn()}
      />
    );
    expect(screen.getByLabelText("Próxima página")).toBeDisabled();
  });

  it("highlights the current page button", () => {
    render(<Pagination pagination={makePagination({ currentPage: 1, totalPages: 3, totalRecords: 24 })} onPageChange={jest.fn()} />);
    const activePage = screen.getByText("1");
    expect(activePage.className).toContain("bg-blue-600");
  });
});
