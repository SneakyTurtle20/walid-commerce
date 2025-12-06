import { render, screen } from "@testing-library/react";
import Loading from "../loading";

// Mock BaseSkeleton component
jest.mock("src/components/BaseSkeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="base-skeleton">Loading skeleton</div>,
}));

describe("Loading", () => {
  it("renders BaseSkeleton component", () => {
    render(<Loading />);

    expect(screen.getByTestId("base-skeleton")).toBeInTheDocument();
  });

  it("displays loading skeleton content", () => {
    render(<Loading />);

    expect(screen.getByText("Loading skeleton")).toBeInTheDocument();
  });
});
