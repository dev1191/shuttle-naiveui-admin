import { routesApi } from "@/services/route.service";
import type { MessageApi } from "naive-ui";
import type { Route } from "@/types/route";

export function useRouteActions(message: MessageApi, onSuccess?: () => void) {
    const replicateRoute = async (id: string) => {
        try {
            const originalRoute = (await routesApi.getById(id)) as unknown as Route;

            const payload = {
                title: `${originalRoute.title} (Copy)`,
                status: false, // Default to inactive for copied route
                stops: originalRoute.stops.map((s: any) => ({
                    stopId: s.stopId,
                    order: s.order,
                    minimum_fare_pickup: Number(
                        s.minimum_fare_pickup ?? s.minimumFarePickup ?? 0
                    ),
                    minimum_fare_drop: Number(
                        s.minimum_fare_drop ?? s.minimumFareDrop ?? 0
                    ),
                    price_per_km_pickup: Number(
                        s.price_per_km_pickup ?? s.pricePerKmPickup ?? 0
                    ),
                    price_per_km_drop: Number(
                        s.price_per_km_drop ?? s.pricePerKmDrop ?? 0
                    ),
                })),
            };

            await routesApi.create(payload as any);
            message.success("Route replicated successfully");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to replicate route:", error);
            message.error("Failed to replicate route");
        }
    };

    const reverseRoute = async (id: string) => {
        try {
            const originalRoute = (await routesApi.getById(id)) as unknown as Route;

            // Create new reversed stops array
            const reversedStops = [...originalRoute.stops]
                .reverse()
                .map((s: any, index: number) => ({
                    stopId: s.stopId,
                    order: index + 1, // Re-assign order based on new position
                    // For a reverse route, typically pickup/drop logic might need adjustment but
                    // for a simple reverse, we just carry over the pricing settings attached to the stop-route relation
                    minimum_fare_pickup: Number(
                        s.minimum_fare_pickup ?? s.minimumFarePickup ?? 0
                    ),
                    minimum_fare_drop: Number(
                        s.minimum_fare_drop ?? s.minimumFareDrop ?? 0
                    ),
                    price_per_km_pickup: Number(
                        s.price_per_km_pickup ?? s.pricePerKmPickup ?? 0
                    ),
                    price_per_km_drop: Number(
                        s.price_per_km_drop ?? s.pricePerKmDrop ?? 0
                    ),
                }));

            const payload = {
                title: `${originalRoute.title} (Reverse)`,
                status: false,
                stops: reversedStops,
            };

            await routesApi.create(payload as any);
            message.success("Route reversed successfully");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to reverse route:", error);
            message.error("Failed to reverse route");
        }
    };

    const updateRouteStatus = async (row: Route, value: boolean) => {
        try {
            await routesApi.toggleStatus(row.ids, value);
            row.status = value;
            message.success(`Route : ${row.title} status updated successfully`);
        } catch (error) {
            message.error("Failed to update status");
            console.error("Status update error:", error);
        }
    };

    return {
        replicateRoute,
        reverseRoute,
        updateRouteStatus,
    };
}
