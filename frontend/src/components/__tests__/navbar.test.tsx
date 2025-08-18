import * as React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/navbar";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

test("renders brand", () => {
  render(<Navbar />);
  expect(screen.getByText(/aMORA/i)).toBeInTheDocument();
});
