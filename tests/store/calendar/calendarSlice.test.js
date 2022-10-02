import {
	calendarSlice,
	onAddNewEvent,
	onAddUpdateEvent,
	onDeleteEvent,
	onLoadEvents,
	onLogoutCalendar,
	onSetActiveEvent,
} from "../../../src/store/calendar/calendarSlice";
import {
	calendarWithEventsState,
	events,
	initialState,
} from "../../__fixtures/__calendarStates";

describe("CalendarSlice", () => {
	test("InitialState", () => {
		const state = calendarSlice.getInitialState();
		expect(state).toEqual(initialState);
	});

	test("onSetActiveEvent debe activar el evento", () => {
		const state = calendarSlice.reducer(
			calendarWithEventsState,
			onSetActiveEvent(events[0])
		);

		expect(state.activeEvent).toEqual(events[0]);
	});

	test("onAddNewEvent debe agregar event", () => {
		const newEvent = {
			id: "3",
			start: new Date("2022-12-09 13:00:00"),
			end: new Date("2022-12-09 15:00:00"),
			title: "Cumpleaños del otra persona",
			notes: "Alguna nota secundaria",
		};
		const state = calendarSlice.reducer(
			calendarWithEventsState,
			onAddNewEvent(newEvent)
		);

		expect(state.events).toEqual([...events, newEvent]);
	});

	test("onAddUpdateEvent debe agregar event", () => {
		const updateEvent = {
			id: "1",
			start: new Date("2022-12-09 13:00:00"),
			end: new Date("2022-12-09 15:00:00"),
			title: "Cumpleaños del otra persona",
			notes: "Alguna nota secundaria",
		};
		const state = calendarSlice.reducer(
			calendarWithEventsState,
			onAddUpdateEvent(updateEvent)
		);

		expect(state.events).toContain(updateEvent);
	});

	test("onDeleteEvent Debe borrar Evento Activo", () => {
		const state = calendarSlice.reducer(
			{ ...calendarWithEventsState, activeEvent: events[0] },
			onDeleteEvent()
		);
		events.shift();
		expect(state.events).toEqual(events);
	});

	test("onLoadEvents Debe Cargar los eventos", () => {
		const state = calendarSlice.reducer(initialState, onLoadEvents(events));
		expect(state.isLoadingEvents).toBeFalsy();
		expect(state.events).toEqual(events);
		expect(state.events.length).toBe(events.length);
	});

	test("onLogoutCalendar clear events", () => {
		const state = calendarSlice.reducer(
			calendarWithEventsState,
			onLogoutCalendar()
		);
		expect(state).toEqual(initialState);
	});
});
