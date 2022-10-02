import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CheckingAuth, LoginPage } from "../auth";
import { CalendarPages } from "../calendar";
import { useAuthStore } from "../hooks";

export const AppRouter = () => {
	const { status, checkAuthToken } = useAuthStore();

	useEffect(() => {
		checkAuthToken();
	}, []);

	if (status === "checking") return <CheckingAuth />;

	return (
		<Routes>
			{status === "not-authenticated" ? (
				<>
					<Route path="/auth/*" element={<LoginPage />} />
					<Route path="/*" element={<Navigate to="/auth/Login" />} />
				</>
			) : (
				<>
					<Route path="/" element={<CalendarPages />} />
					<Route path="/*" element={<Navigate to="/" />} />
				</>
			)}
		</Routes>
	);
};
