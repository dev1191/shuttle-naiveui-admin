<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  useMessage,
  type FormInst,
  type FormRules,
  type SelectOption,
} from "naive-ui";
import { busSchedulesApi } from "@/services/busSchedule.service";
import { routesApi } from "@/services/route.service";
import { bussApi } from "@/services/buses/bus.service";
import type { StopDTO } from "@/types/busSchedule";
import dayjs from "dayjs";

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);

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
  stops: [] as any[], // UI uses strings, API uses numbers
});

// Rules
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

const searchLoading = ref(false);

const handleBusSearch = async (query: string) => {
  if (!query && busOptions.value.length > 0) return;
  searchLoading.value = true;
  try {
    const busRes = await bussApi.busLists(query);
    busOptions.value = busRes.items.map((b: any) => ({
      label: b.label, // Adjust based on Option type from backend
      value: b.value,
    }));
  } catch (error) {
    console.error("Failed to search buses", error);
  } finally {
    searchLoading.value = false;
  }
};

const fetchOptions = async () => {
  try {
    const routesRes = await routesApi.getAll({
      pageSize: 1000,
      status: "active",
    });
    routeOptions.value = routesRes.items.map((r) => ({
      label: r.title,
      value: r.ids,
    }));
  } catch (e) {
    console.error("Failed to load routes", e);
  }

  // Initial bus load (e.g. first 20 or default list)
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
        id: s.stopId, // Using stopId as the identifier
        stopId: s.stopId,
        stop_name: s.stop_name || `Stop ${s.order}`, // Fallback name
        arrival_time: null,
        departure_time: null,
      }));
    }
  } catch (error) {
    console.error("Failed to load route stops", error);
    message.error("Failed to load stops for selected route");
  }
};

const formatTimeFromData = (time: any): string | null => {
    if (!time) return null;
    // If it's already HH:mm
    if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) return time;
    if (typeof time === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(time)) return time.substring(0, 5);
    // If it is ISO string or timestamp
    return dayjs(time).isValid() ? dayjs(time).format("HH:mm") : null;
}

const timeToTimestamp = (timeVal: string | number | null, dateBaseMs: number | null) => {
    if (!timeVal) return null;
    let h, m;
    
    if (typeof timeVal === 'number') {
        const date = new Date(timeVal);
        h = date.getHours();
        m = date.getMinutes();
    } else if (typeof timeVal === 'string') {
        // Try HH:mm
        if (timeVal.includes(':')) {
            const parts = timeVal.split(':').map(Number);
            h = parts[0];
            m = parts[1];
        } else {
             // Maybe it's a string timestamp or ISO?
             const date = new Date(timeVal);
              if (!isNaN(date.getTime())) {
                  h = date.getHours();
                  m = date.getMinutes();
              } else {
                  return null; 
              }
        }
    } else {
        return null; // Unknown type
    }

    if (h === undefined || m === undefined || isNaN(h) || isNaN(m)) return null;

    const d = dateBaseMs ? new Date(dateBaseMs) : new Date();
    d.setHours(h);
    d.setMinutes(m);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d.getTime();
}

const fetchData = async () => {
  if (!props.id) return;
  loading.value = true;
  try {
    const data: any = await busSchedulesApi.getById(props.id);
    formData.routeId = data.routeId;
    formData.busId = data.busId;
    formData.every = data.every || [];
    formData.status = data.status;

    // Map existing stops. Ensure existing times are preserved.
    if (data.stops) {
      formData.stops = data.stops.map((s: any) => ({
        id: s.stopId || s.id, 
        stopId: s.stopId || s.id,
        stop_name: s.stop_name,
        arrival_time: formatTimeFromData(s.arrival_time),
        departure_time: formatTimeFromData(s.departure_time),
      }));
    }

    formData.start_date = data.start_date
      ? new Date(data.start_date).getTime()
      : null;
    formData.end_date = data.end_date
      ? new Date(data.end_date).getTime()
      : null;
      
    formData.departure_time = formatTimeFromData(data.departure_time);
    formData.arrival_time = formatTimeFromData(data.arrival_time);
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    message.error("Failed to load schedule details");
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    loading.value = true;

    // Determine Logic:
    // If top level departure/arrival are hidden/empty, try to derive from stops.
    // Departure = First Stop Departure
    // Arrival = Last Stop Arrival
    
    let finalDepartureTimeStr = formData.departure_time;
    let finalArrivalTimeStr = formData.arrival_time;

    if (formData.stops && formData.stops.length > 0) {
        if (!finalDepartureTimeStr) {
            // Use first stop departure
             /* Assuming stop's departure is the "start" of the journey from that stop 
                Actually, usually Route Start = First Stop Departure.
             */
             const firstStop = formData.stops[0];
             // IF first stop has departure time
             if(firstStop.departure_time) finalDepartureTimeStr = firstStop.departure_time;
        }
        if (!finalArrivalTimeStr) {
             const lastStop = formData.stops[formData.stops.length - 1];
             if(lastStop.arrival_time) finalArrivalTimeStr = lastStop.arrival_time;
             // Fallback to departure if arrival not set (e.g. last stop) - actually last stop usually has arrival.
             else if (lastStop.departure_time) finalArrivalTimeStr = lastStop.departure_time;
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
      
      // Top level times
      departure_time: finalDepartureTimeStr ? new Date(timeToTimestamp(finalDepartureTimeStr, formData.start_date)!).toISOString() : "",
      arrival_time: finalArrivalTimeStr ? new Date(timeToTimestamp(finalArrivalTimeStr, formData.start_date)!).toISOString() : "",

      stops: formData.stops.map((s) => ({
        ...s,
        // Convert stop times to Timestamps (Numbers)
        arrival_time: timeToTimestamp(s.arrival_time, formData.start_date),
        departure_time: timeToTimestamp(s.departure_time, formData.start_date),
      })),
    };

    if (props.id) {
      await busSchedulesApi.update(props.id, payload as any);
      message.success("Schedule updated successfully");
    } else {
      await busSchedulesApi.create(payload as any);
      message.success("Schedule created successfully");
    }
    router.push("/manage-routes/bus-schedules/lists");
  } catch (error: any) {
    console.error("Submit error:", error);
    message.error(error.message || "Operation failed");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOptions();
  fetchData();
});
</script>

<template>
  <n-card :title="id ? 'Edit Schedule' : 'Create Schedule'">
    <template #header-extra>
      <n-space>
        <n-button type="error" secondary @click="router.back()"
          >Cancel</n-button
        >
        <n-button type="primary" :loading="loading" @click="onSubmit">
          {{ id ? "Update" : "Create" }}
        </n-button>
      </n-space>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <n-grid :cols="24" :x-gap="24">
        <!-- Left Side: Form Details -->
        <n-gi :span="formData.stops.length > 0 ? 12 : 24">
          <n-grid :cols="2" :x-gap="24" :y-gap="12">
            <n-gi :span="2">
              <n-divider title-placement="left" style="margin-top: 0"
                >Route & Bus Details</n-divider
              >
            </n-gi>
            <n-gi>
              <n-form-item label="Route" path="routeId">
                <n-select
                  size="large"
                  v-model:value="formData.routeId"
                  :options="routeOptions"
                  placeholder="Select Route"
                  filterable
                  clearable
                  @update:value="handleRouteChange"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Bus" path="busId">
                <n-select
                  size="large"
                  v-model:value="formData.busId"
                  :options="busOptions"
                  placeholder="Select Bus"
                  filterable
                  clearable
                  remote
                  :loading="searchLoading"
                  @search="handleBusSearch"
                />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-divider title-placement="left"
                >Schedule Configuration</n-divider
              >
            </n-gi>
            <n-gi>
              <n-form-item label="Start Date" path="start_date">
                <n-date-picker
                  v-model:value="formData.start_date"
                  type="date"
                  style="width: 100%"
                  clearable
                  size="large"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="End Date" path="end_date">
                <n-date-picker
                  v-model:value="formData.end_date"
                  type="date"
                  style="width: 100%"
                  clearable
                  size="large"
                />
              </n-form-item>
            </n-gi>

   
            <n-gi :span="2">
              <n-form-item label="Frequency (Runs Every)" path="every">
                <n-checkbox-group size="large" v-model:value="formData.every">
                  <n-space>
                    <n-checkbox
                      v-for="day in daysOptions"
                      :key="day.value"
                      :value="day.value"
                      :label="day.label"
                    />
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Status" path="status">
                <n-switch v-model:value="formData.status" />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-gi>

        <!-- Right Side: Stop Timings -->
        <n-gi :span="12" v-if="formData.stops.length > 0">
          <n-divider title-placement="left" style="margin-top: 0"
            >Stop Timings</n-divider
          >
          <n-table :single-line="false" size="small" bordered>
            <thead>
              <tr>
                <th>Stop Name</th>
                <th>Arrival Time</th>
                <th>Departure Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stop, index) in formData.stops" :key="index">
                <td>{{ stop.stop_name }}</td>

                <td>
                  <n-time-picker
                    v-if="index !== 0"
                    v-model:value="stop.arrival_time"
                    format="hh:mm a"
                    value-format="HH:mm"
                    use-12-hours
                    placeholder="Arrival"
                    size="large"
                  />
                </td>

            
                <td>
                  <n-time-picker
                    v-if="index !== formData.stops.length - 1"
                    use-12-hours
                    v-model:value="stop.departure_time"
                    format="hh:mm a"
                    value-format="HH:mm"
                    placeholder="Departure"
                    size="large"
                  />
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-gi>
      </n-grid>
    </n-form>
  </n-card>
</template>
