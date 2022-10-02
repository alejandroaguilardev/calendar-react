import calendarApi from "../../src/api/calendarApi";

describe("CalendarApi", () => {
	test("debe tener la configuración por defecto", () => {
		expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
	});

	test("debe tener el x-token en el header", async () => {
		const token = "ABC";
		localStorage.setItem("token", token);
		const res = await calendarApi.get("/auth");

		expect(res.config.headers['x-token']).toBe(token);
	});
});
