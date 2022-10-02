import { createSlice } from "@reduxjs/toolkit";

export const calendarSlice = createSlice({
	name: "calendar",
	initialState: {
		isLoadingEvents: true,
		events: [],
		activeEvent: null,
	},
	reducers: {
		onSetActiveEvent: (state, { payload }) => {
			state.activeEvent = payload;
		},
		onAddNewEvent: (state, { payload }) => {
			state.events.push(payload);
			state.activeEvent = null;
		},
		onAddUpdateEvent: (state, { payload }) => {
			state.events = state.events.map((event) =>
				event.id === payload.id ? payload : event
			);
			state.activeEvent = null;
		},
		onDeleteEvent: (state) => {
			if (state.activeEvent) {
				state.events = state.events.filter(
					(event) => event.id !== state.activeEvent.id
				);
				state.activeEvent = null;
			}
		},
		onLoadEvents: (state, { payload = [] }) => {
			state.isLoadingEvents = false;
			payload.forEach((event) => {
				const exists = state.events.some((dbEvent) => dbEvent.id === event.id);
				if (!exists) {
					state.events.push(event);
				}
			});
		},
		onLogoutCalendar: (state) => {
			state.isLoadingEvents = true;
			state.events = [];
			state.activeEvent = null;
		},
	},
});
export const {
	onSetActiveEvent,
	onAddNewEvent,
	onAddUpdateEvent,
	onDeleteEvent,
	onLoadEvents,
	onLogoutCalendar,
} = calendarSlice.actions;
