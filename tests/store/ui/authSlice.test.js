import {
	authSlice,
	clearErrorMessage,
	onLogin,
	onLogout,
} from "../../../src/store/auth/authSlice";
import {
	authenticatedState,
	initialState,
	notAuthenticatedState,
} from "../../__fixtures/__authStates";
import { testUserCredentials } from "../../__fixtures/__testUser";

describe("authSlice", () => {
	test("getInitial", () => {
		expect(authSlice.getInitialState()).toEqual(initialState);
	});

	test("debe de realizar un login", () => {
		const state = authSlice.reducer(initialState, onLogin(testUserCredentials));

		expect(state).toEqual({
			...authenticatedState,
			user: testUserCredentials,
		});
	});

	test("debe de realizar el logout", () => {
		const state = authSlice.reducer(authenticatedState, onLogout());

		expect(state).toEqual(notAuthenticatedState);
	});

	test("debe de realizar el logout", () => {
		const state = authSlice.reducer(authenticatedState, onLogout());

		expect(state).toEqual(notAuthenticatedState);
	});

	test("debe de realizar el logout con MSG", () => {
		const errorMessage = "Incorrecto";
		const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
		expect(state).toEqual({ ...notAuthenticatedState, errorMessage });
	});

    test("debe limpiar el Erro msg", () => {
		const errorMessage = "Incorrecto";
		const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        const newState =  authSlice.reducer(state, clearErrorMessage());
		expect(state).toEqual({ ...notAuthenticatedState, errorMessage });
        expect(newState).toEqual(notAuthenticatedState);
	});
});
