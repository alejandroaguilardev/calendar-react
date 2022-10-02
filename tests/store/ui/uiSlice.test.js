import {
	onCloseDateModal,
	onOpenDateModal,
	uiSlice,
} from "../../../src/store/ui/uiSlice";

describe("uiSlice", () => {
	test("debe de regresar el estado por defecto", () => {
		expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false });
	});

	test("debe de regresar el estado por defecto", () => {
		let state = uiSlice.getInitialState();
		state = uiSlice.reducer(state, onOpenDateModal());
		expect(state.isDateModalOpen).toBeTruthy();

		state = uiSlice.reducer(state, onCloseDateModal());
		expect(state.isDateModalOpen).toBeFalsy();
	});
});
