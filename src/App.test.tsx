import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the app Component", () => {
  render(<App />);
  const startButton = screen.getByText("START");
  expect(startButton).toBeInTheDocument();
});
