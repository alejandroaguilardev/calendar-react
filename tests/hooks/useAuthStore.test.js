import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { calendarApi } from "../../src/api";
import { useAuthStore } from "../../src/hooks";
import { authSlice } from "../../src/store";
import {
	authenticatedState,
	initialState,
	notAuthenticatedState,
} from "../__fixtures/__authStates";
import { testUserCredentials } from "../__fixtures/__testUser";


const getMockStore = (initialState) => {
	return configureStore({
		reducer: {
			auth: authSlice.reducer,
		},
		preloadedState: {
			auth: { ...initialState },
		},
	});
};

beforeEach(() => localStorage.clear());

describe("useAuthStore", () => {
	test("debe regresar los valores por defecto", () => {
		const mockStore = getMockStore({ ...initialState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		expect(result.current).toEqual({
			status: "checking",
			user: {},
			errorMessage: undefined,
			startLogin: expect.any(Function),
			startRegister: expect.any(Function),
			checkAuthToken: expect.any(Function),
			startLogout: expect.any(Function),
		});
	});

	test("startLogin debe de realizar el login correctamente", async () => {
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		await act(async () => {
			await result.current.startLogin({
				email: testUserCredentials.email,
				password: testUserCredentials.password,
			});
		});

		const { errorMessage, status, user } = result.current;

		expect({ errorMessage, status, user }).toEqual({
			...authenticatedState,
			user: testUserCredentials.user,
		});

		expect(localStorage.getItem("token")).toEqual(expect.any(String));
		expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));
	});

	test("startLogin debe fallar la authenticacion", async () => {
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		await act(async () => {
			await result.current.startLogin({
				email: "1",
				password: "1",
			});
		});

		const { errorMessage, status, user } = result.current;

		expect({ errorMessage, status, user }).toEqual({
			...notAuthenticatedState,
			errorMessage: expect.any(String),
		});

		await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
	});

	test("startRegister debe crear un registro", async () => {
		const newUser = {
			email: "test@google.com",
			password: "123456",
			name: "Test",
		};

		const response = {
			ok: true,
			uid: "6336ffca9567b9170cfe5d66",
			name: "Test",
			token: "token",
		};

		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
			data: response,
		});

		await act(async () => {
			await result.current.startRegister(newUser);
		});

		const { errorMessage, status, user } = result.current;

		expect({ errorMessage, status, user }).toEqual({
			...authenticatedState,
			user: { name: response.name, uid: response.uid },
		});

		spy.mockRestore();
	});

	test("startRegister debe fallar la creación", async () => {
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		await act(async () => {
			await result.current.startRegister({
				email: testUserCredentials.email,
				password: testUserCredentials.password,
			});
		});

		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			...notAuthenticatedState,
			errorMessage: expect.any(String),
		});
	});

	test("checkAuthToken debe fallar si no hay un token", async () => {
		const mockStore = getMockStore({ ...initialState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		await act(async () => {
			await result.current.checkAuthToken();
		});

		const { errorMessage, status, user } = result.current;

		expect({ errorMessage, status, user }).toEqual({
			...notAuthenticatedState,
		});
	});

	test("checkAuthToken debe de authenticar el usuario si  hay un token", async () => {
		const { data } = await calendarApi.post("/auth", testUserCredentials);
		localStorage.setItem("token", data.token);

		const mockStore = getMockStore({ ...initialState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => (
				<Provider store={mockStore}>{children}</Provider>
			),
		});

		await act(async () => {
			await result.current.checkAuthToken();
		});

		const { errorMessage, status, user } = result.current;

		expect({ errorMessage, status, user }).toEqual({
			...authenticatedState,
			user: testUserCredentials.user,
		});
	});
});
