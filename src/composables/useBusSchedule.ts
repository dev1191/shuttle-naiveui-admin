import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage, type SelectOption, type FormInst, type FormRules } from "naive-ui";
import { busSchedulesApi } from "@/services/busSchedule.service";
import { routesApi } from "@/services/route.service";
import { bussApi } from "@/services/buses/bus.service";
import dayjs from "dayjs";

export function useBusSchedule(propsId?: string) {
    const router = useRouter();
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);

    const loading = ref(false);
    const initLoading = ref(false);
    const searchLoading = ref(false);
    const routeSearchLoading = ref(false);

    const routeOptions = ref<SelectOption[]>([]);
    const busOptions = ref<SelectOption[]>([]);

    const daysOptions = [
        { label: "Sunday", value: "sunday" },
        { label: "Monday", value: "monday" },
        { label: "Tuesday", value: "tuesday" },
        { label: "Wednesday", value: "wednesday" },
        { label: "Thursday", value: "thursday" },
        { label: "Friday", value: "friday" },
        { label: "Saturday", value: "saturday" },
    ];

    const formData = reactive({
        routeId: null as string | null,
        busId: null as string | null,
        every: [] as string[],
        start_date: null as number | null,
        end_date: null as number | null,
        departure_time: null as string | null,
        arrival_time: null as string | null,
        status: true,
        stops: [] as any[],
    });

    const rules: FormRules = {
        routeId: [
            { required: true, message: "Please select a route", trigger: "blur" },
        ],
        busId: [{ required: true, message: "Please select a bus", trigger: "blur" }],
        every: [
            {
                type: "array",
                required: true,
                message: "Please select frequency",
                trigger: "change",
            },
        ],
        start_date: [
            {
                type: "number",
                required: true,
                message: "Start date is required",
                trigger: "blur",
            },
        ],
        end_date: [
            {
                type: "number",
                required: true,
                message: "End date is required",
                trigger: "blur",
            },
        ],
    };

    const handleBusSearch = async (query: string) => {
        if (!query && busOptions.value.length > 0) return;
        searchLoading.value = true;
        try {
            const busRes = await bussApi.busLists(query);
            busOptions.value = busRes.items.map((b: any) => ({
                label: b.label,
                value: b.value,
            }));
        } catch (error) {
            console.error("Failed to search buses", error);
        } finally {
            searchLoading.value = false;
        }
    };

    const handleRouteSearch = async (query: string) => {
        routeSearchLoading.value = true;
        try {
            const routesRes = await routesApi.routeLists(query);
            routeOptions.value = routesRes.items.map((r: any) => ({
                label: r.label + " :  (" + r.totalStops + " stops)",
                value: r.value,
            }));
        } catch (e) {
            console.error("Failed to search routes", e);
        } finally {
            routeSearchLoading.value = false;
        }
    };

    const fetchOptions = async () => {
        await handleRouteSearch("");
        await handleBusSearch("");
    };

    const handleRouteChange = async (value: string) => {
        if (!value) {
            formData.stops = [];
            return;
        }
        try {
            const route: any = await routesApi.getById(value);
            if (route && route.stops) {
                formData.stops = route.stops.map((s: any) => ({
                    id: s.stopId || s.id,
                    stopId: s.stopId || s.id,
                    stop_name: s.stop_name || s.name || `Stop ${s.order}`,
                    arrival_time: null,
                    departure_time: null,
                    order: s.order
                }));
            }
        } catch (error) {
            console.error("Failed to load route stops", error);
            message.error("Failed to load stops for selected route");
        }
    };

    const formatTimeFromData = (time: any): string | null => {
        if (!time) return null;
        if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) return time;
        if (typeof time === "string" && /^\d{2}:\d{2}:\d{2}$/.test(time))
            return time.substring(0, 5);
        return dayjs(time).isValid() ? dayjs(time).format("HH:mm") : null;
    };

    const timeToTimestamp = (
        timeVal: string | number | null,
        dateBaseMs: number | null
    ) => {
        if (!timeVal) return null;
        let h, m;

        if (typeof timeVal === "number") {
            const date = new Date(timeVal);
            h = date.getHours();
            m = date.getMinutes();
        } else if (typeof timeVal === "string") {
            if (timeVal.includes(":")) {
                const parts = timeVal.split(":").map(Number);
                h = parts[0];
                m = parts[1];
            } else {
                const date = new Date(timeVal);
                if (!isNaN(date.getTime())) {
                    h = date.getHours();
                    m = date.getMinutes();
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }

        if (h === undefined || m === undefined || isNaN(h) || isNaN(m)) return null;

        const d = dateBaseMs ? new Date(dateBaseMs) : new Date();
        d.setHours(h);
        d.setMinutes(m);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime();
    };

    const fetchData = async () => {
        if (!propsId) return;
        initLoading.value = true;
        try {
            const data: any = await busSchedulesApi.getById(propsId);
            formData.routeId = data.routeId;
            formData.busId = data.busId;
            formData.every = data.every || [];
            formData.status = data.status;

            if (data.routeId) {
                try {
                    const routeDetails: any = await routesApi.getById(data.routeId);
                    if (!routeOptions.value.find((r) => r.value === data.routeId)) {
                        routeOptions.value.push({
                            label: routeDetails.title,
                            value: routeDetails.ids,
                        });
                    }
                } catch (e) {
                    console.error("Failed to load saved route details", e);
                }
            }



            if (data.stops) {
                formData.stops = data.stops.map((s: any) => ({
                    id: s.stopId || s.id,
                    stopId: s.stopId || s.id,
                    stop_name: s.stop_name || s.name || `Stop ${s.order}`,
                    arrival_time: formatTimeFromData(s.arrival_time),
                    departure_time: formatTimeFromData(s.departure_time),
                    order: s.order,
                }));
            }

            formData.start_date = data.start_date
                ? new Date(data.start_date).getTime()
                : null;
            formData.end_date = data.end_date
                ? new Date(data.end_date).getTime()
                : null;

        } catch (error) {
            console.error("Failed to fetch schedule:", error);
            message.error("Failed to load schedule details");
        } finally {
            initLoading.value = false;
        }
    };

    const onSubmit = async () => {
        if (!formRef.value) return;
        try {
            await formRef.value.validate();
            loading.value = true;

            let finalDepartureTimeStr = formData.departure_time;
            let finalArrivalTimeStr = formData.arrival_time;

            if (formData.stops && formData.stops.length > 0) {
                if (!finalDepartureTimeStr) {
                    const firstStop = formData.stops[0];
                    if (firstStop.departure_time)
                        finalDepartureTimeStr = firstStop.departure_time;
                }
                if (!finalArrivalTimeStr) {
                    const lastStop = formData.stops[formData.stops.length - 1];
                    if (lastStop.arrival_time) finalArrivalTimeStr = lastStop.arrival_time;
                    else if (lastStop.departure_time)
                        finalArrivalTimeStr = lastStop.departure_time;
                }
            }

            const payload = {
                ...formData,
                start_date: formData.start_date
                    ? new Date(formData.start_date).toISOString()
                    : "",
                end_date: formData.end_date
                    ? new Date(formData.end_date).toISOString()
                    : "",

                departure_time: finalDepartureTimeStr
                    ? new Date(
                        timeToTimestamp(finalDepartureTimeStr, formData.start_date)!
                    ).toISOString()
                    : "",
                arrival_time: finalArrivalTimeStr
                    ? new Date(
                        timeToTimestamp(finalArrivalTimeStr, formData.start_date)!
                    ).toISOString()
                    : "",

                stops: formData.stops.map((s) => ({
                    ...s,
                })),
            };

            if (propsId) {
                await busSchedulesApi.update(propsId, payload as any);
                message.success("Bus Schedule updated successfully");
            } else {
                await busSchedulesApi.create(payload as any);
                message.success("Bus Schedule created successfully");
            }
            router.push("/manage-routes/bus-schedules/lists");
        } catch (error: any) {
            console.error("Submit error:", error);
            message.error(error.message || "Operation failed");
        } finally {
            loading.value = false;
        }
    };

    const updateBusScheduleStatus = async (id: string, status: boolean, onSuccess?: () => void) => {
        try {
            await busSchedulesApi.toggleStatus(id, status);
            message.success("Bus Schedule status updated successfully");
            if (onSuccess) {
                onSuccess();
            } else {
                fetchData();
            }
        } catch (error: any) {
            console.error("Update status error:", error);
            message.error(error.message || "Operation failed");
        }
    };

    onMounted(() => {
        fetchOptions();
        fetchData();
    });

    return {
        formRef,
        loading,
        initLoading,
        searchLoading,
        routeSearchLoading,
        routeOptions,
        busOptions,
        daysOptions,
        formData,
        rules,
        handleBusSearch,
        handleRouteSearch,
        handleRouteChange,
        onSubmit,
        updateBusScheduleStatus
    };
}