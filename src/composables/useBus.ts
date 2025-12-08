import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { bussApi } from '@/services/buses/bus.service';
import type { Bus } from '@/types/buses/index';

export function useBus() {
    const message = useMessage();
    const router = useRouter();
    const loading = ref(false);

    /**
     * Navigate to create bus page
     */
    const navigateToCreate = () => {
        router.push({ name: 'createBus' });
    };

    /**
     * Navigate to edit bus page
     */
    const navigateToEdit = (busId: string) => {
        router.push({ name: 'editBus', params: { id: busId } });
    };

    /**
     * Update bus status
     */
    const updateStatus = async (busId: string, status: Bus['status'], onSuccess?: () => void) => {
        loading.value = true;
        try {
            await bussApi.update(busId, { status });
            message.success('Bus status updated successfully');
            if (onSuccess) {
                onSuccess();
            }
            return true;
        } catch (error: any) {
            message.error(error.message || 'Failed to update bus status');
            console.error('Status update error:', error);
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete a bus
     */
    const deleteBus = async (busId: string, onSuccess?: () => void) => {
        loading.value = true;
        try {
            const response = await bussApi.delete(busId);
            message.success(response.message || 'Bus deleted successfully');
            if (response.status && onSuccess) {
                onSuccess();
            }
            return true;
        } catch (error: any) {
            message.error(error.message || 'Failed to delete bus');
            console.error('Delete error:', error);
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch all buses with pagination
     */
    const fetchBuses = async (params: Record<string, any>) => {
        loading.value = true;
        try {
            const response = await bussApi.getAll(params);
            return {
                items: response.items,
                totalRecords: response.totalRecords,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages,
            };
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch buses');
            console.error('Fetch buses error:', error);
            return {
                items: [],
                totalRecords: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch a single bus by ID
     */
    const fetchBusById = async (busId: string) => {
        loading.value = true;
        try {
            const response = await bussApi.getById(busId);
            return response.data;
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch bus details');
            console.error('Fetch bus error:', error);
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        navigateToCreate,
        navigateToEdit,
        updateStatus,
        deleteBus,
        fetchBuses,
        fetchBusById,
    };
}
