import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { WeatherSearch } from "./WeatherSearch";

// Мок для matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const renderWithMantine = (ui: React.ReactElement) => {
  return render(
    <MantineProvider defaultColorScheme="light">{ui}</MantineProvider>,
  );
};

describe("WeatherSearch", () => {
  it("рендерит поле ввода и кнопку", () => {
    renderWithMantine(<WeatherSearch onSearch={() => {}} />);

    const input = screen.getAllByTestId("city-search-input")[0];
    const button = screen.getAllByRole("button", { name: /поиск/i })[0];

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("кнопка поиска disabled когда поле пустое", () => {
    renderWithMantine(<WeatherSearch onSearch={() => {}} />);

    const button = screen.getAllByRole("button", { name: /поиск/i })[0];
    expect(button).toBeDisabled();
  });

  it("кнопка поиска enabled когда поле заполнено", async () => {
    const user = userEvent.setup();
    renderWithMantine(<WeatherSearch onSearch={() => {}} />);

    const input = screen.getAllByTestId("city-search-input")[0];
    const button = screen.getAllByRole("button", { name: /поиск/i })[0];
    await user.clear(input);
    await user.type(input, "Moscow");

    expect(button).not.toBeDisabled();
  });

  it("позволяет очистить поле", async () => {
    const user = userEvent.setup();
    renderWithMantine(<WeatherSearch onSearch={() => {}} />);

    const input = screen.getAllByTestId(
      "city-search-input",
    )[0] as HTMLInputElement;

    // Очищаем перед вводом
    await user.clear(input);
    await user.type(input, "Moscow");
    expect(input.value).toBe("Moscow");

    await user.clear(input);
    expect(input.value).toBe("");
  });

});
