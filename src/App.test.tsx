// App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App renders without crashing", () => {
  test("APP_RENDER", () => {
    render(<App />);
    const linkElements = screen.getAllByRole("link");
    expect(linkElements).toHaveLength(7); // Vite and React logos + 5 links
  });
});
