import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
	Navbar,
	CalendarEvent,
	CalendarModal,
	FabAddNew,
	FabDelete,
} from "../";
import { getMessages, localizer } from "../../helpers";
import { useEffect, useState } from "react";
import { useUiStore } from "../../hooks/useUiStore";
import { useAuthStore, useCalendarStore } from "../../hooks";

export const CalendarPages = () => {
	const { user } = useAuthStore();
	const { openDateModal } = useUiStore();
	const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
	const [lastView, setState] = useState(
		localStorage.getItem("lastView") || "week"
	);

	const eventStyleGetter = (event, start, end, isSelected) => {
		const isMyEvent =
			user.uid === event.user._id || user.uid === event.user.uid;
		const style = {
			backgroundColor: isMyEvent ? "#347CF7" : "#465660",
			borderRadius: 0,
			opacity: 0.8,
			color: "white",
		};
		return {
			style,
		};
	};

	const onDoubleClick = (event) => {
		openDateModal();
	};

	const onSelect = (event) => {
		setActiveEvent(event);
	};

	const onViewChanged = (event) => {
		localStorage.setItem("lastView", event);
	};

	useEffect(() => {
		startLoadingEvents();
	}, []);

	return (
		<>
			<Navbar />

			<Calendar
				culture="es"
				// defaultView={lastView}
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				style={{ height: "calc(100vh - 80px)" }}
				messages={getMessages()}
				eventPropGetter={eventStyleGetter}
				components={{
					event: CalendarEvent,
				}}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelect}
				onView={onViewChanged}
			/>

			<CalendarModal />
			<FabAddNew />
			<FabDelete />
		</>
	);
};
