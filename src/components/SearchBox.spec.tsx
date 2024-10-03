// SearchBox.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBox from "./SearchBox";

describe("SearchBox Component", () => {
  describe("Render SearchBox Component", () => {
    test("RENDER_SEARCH_BOX", () => {
      render(<SearchBox />);
      const searchBoxElement = screen.getByPlaceholderText("Search...");
      expect(searchBoxElement).toBeInTheDocument();
    });
  });

  describe("Renders with 5 countries", () => {
    test("RENDERS_WITH_5_COUNTRIES", () => {
      render(<SearchBox />);
      const countryItems = screen.getAllByRole("listitem");
      expect(countryItems).toHaveLength(5);
    });
  });

  describe("Ctrl + K opens up search", () => {
    test("CMD+K_OPENS_SEARCH_BOX", () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true });
      expect(searchInput).toHaveFocus();
    });
  });

  describe("Clicking out closes the search box", () => {
    test("CLICKING_OUT_CLOSE_SEARCH_BOX", () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      expect(searchInput).toHaveFocus();
      fireEvent.mouseDown(document.body); // Simulate clicking outside
      expect(searchInput).not.toHaveFocus();
    });
  });

  describe("Clicking close button closes the search box", () => {
    test("CLOSE_BUTTON_CLOSE_SEARCH_BOX", () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      expect(searchInput).toHaveFocus();
      const closeButton = screen.getByRole("button", { name: "X" }); // Select the close button by its text content
      fireEvent.click(closeButton); // Simulate clicking the close button
      expect(searchInput).not.toHaveFocus();
    });
  });

  describe("Open search box and press escape key should close the search box", () => {
    test("ESCAPE_CLOSE_SEARCH_BOX", () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      expect(searchInput).toHaveFocus();
      fireEvent.keyDown(searchInput, { key: "Escape" });
      expect(searchInput).not.toHaveFocus();
    });
  });

  describe("Open search box and search for a country returns 5 suggestions after debounce (250 ms)", () => {
    test("DEBOUNCE_SEARCH_AFTER_250MS", async () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      fireEvent.change(searchInput, { target: { value: "Gh" } });
      const searchResults1 = screen.getAllByRole("listitem");
      expect(searchResults1).toHaveLength(5);
      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 300));
      const searchResults2 = screen.getAllByRole("listitem");
      expect(searchResults2).toHaveLength(2);
    });
  });
});

describe("ComboBox Navigation", () => {
  describe("Down arrow key should move focus from input down then back to input", () => {
    test("ARROW_DOWN_MOVES_FOCUS_AROUND", async () => {
      render(<SearchBox />);
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      const searchInput = screen.getByPlaceholderText("Search...");
      expect(searchInput).toHaveFocus();
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      await waitFor(() => {
        const item = screen.queryByTestId("1");
        return expect(item).toHaveFocus();
      });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      await waitFor(() => {
        const item = screen.queryByTestId("3");
        return expect(item).toHaveFocus();
      });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      await waitFor(() => {
        const item = screen.queryByTestId("0");
        return expect(item).toHaveFocus();
      });
    });
  });

  describe("Open search box and search for a country should navigate down in a cycle", () => {
    test("SEARCH_VIEW_NAVIGATE_DOWN_IN_CYCLE", async () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      fireEvent.change(searchInput, { target: { value: "A" } });
      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 300));

      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      await waitFor(() => {
        const item = screen.queryByTestId("2");
        return expect(item).toHaveFocus();
      });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      await waitFor(() => {
        const item = screen.queryByTestId("0");
        return expect(item).toHaveFocus();
      });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      await waitFor(() => {
        const item = screen.queryByTestId("1");
        return expect(item).toHaveFocus();
      });
    });
  });

  describe("Open search box and search for a country should navigate up in a cycle", () => {
    test("SEARCHED_VIEW_NAVIAGTES_IN_CYCLE", async () => {
      render(<SearchBox />);
      const searchInput = screen.getByPlaceholderText("Search...");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true }); // Open the search box
      fireEvent.change(searchInput, { target: { value: "U" } });
      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 300));
      const searchResults = screen.getAllByRole("listitem");
      expect(searchResults).toHaveLength(5);
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      await waitFor(() => {
        const item = screen.queryByTestId("6");
        return expect(item).toHaveFocus();
      });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
      await waitFor(() => {
        const item = screen.queryByTestId("1");
        return expect(item).toHaveFocus();
      });
    });
  });
});
