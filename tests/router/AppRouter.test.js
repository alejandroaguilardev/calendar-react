import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CalendarPages } from "";
import { useAuthStore } from "../../src/hooks";
import { AppRouter } from "../../src/router/AppRouter";

jest.mock("../../src/hooks/useAuthStore");

jest.mock("../../src/calendar", () => ({
	CalendarPages: () => <h1>CalendarPages</h1>,
}));

describe("AppRouter", () => {
	const mockCheckAuthToken = jest.fn();
	beforeEach(() => jest.clearAllMocks());

	test("debe de mostrar la pantalla de carga  checkAuthToken", () => {
		useAuthStore.mockReturnValue({
			status: "checking",
			checkAuthToken: mockCheckAuthToken,
		});

		render(<AppRouter />);
		expect(screen.getByText("Cargando...")).toBeTruthy();
		expect(mockCheckAuthToken).toHaveBeenCalled();
	});

	test("debe de mostrar  el login en caso de no estar autenticado", () => {
		useAuthStore.mockReturnValue({
			status: "not-authenticated",
			checkAuthToken: mockCheckAuthToken,
		});

		const { container } = render(
			<MemoryRouter initialEntries={["/index"]}>
				<AppRouter />
			</MemoryRouter>
		);
		expect(screen.getByText("Ingreso")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("debe de mostrar  el calendario si estamos autenticados", () => {
		useAuthStore.mockReturnValue({
			status: "authenticated",
			checkAuthToken: mockCheckAuthToken,
		});

		const { container } = render(
			<MemoryRouter>
				<AppRouter />
			</MemoryRouter>
		);
		expect(screen.getByText).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

    test("debe de mostrar  el calendario si estamos autenticados", () => {
        
    });

});
