import type { BusSchedule } from "@/types/busSchedule";
import { busSchedulesApi } from "@/services/busSchedule.service";
import { useMessage } from "naive-ui";

export function useBusSchedule() {

    const message = useMessage()

    const updateBusScheduleStatus = async (row: BusSchedule, value: boolean) => {
        try {
            await busSchedulesApi.toggleStatus(row.ids, value);
            row.status = value;
            message.success(`BusSchedule : ${row.route_name} status updated successfully`);
        } catch (error) {
            message.error("Failed to update status");
            console.error("Status update error:", error);
        }
    };

    return {
        updateBusScheduleStatus
    }

}