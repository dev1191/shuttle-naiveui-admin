// src/composables/useSSE.ts
import { ref, onUnmounted } from 'vue';
import type { Driver } from '@/types/driver';

export function useSSE() {
    const eventSource = ref<EventSource | null>(null);
    const isConnected = ref(false);
    const error = ref<string | null>(null);

    const connect = (
        url: string,
        onMessage: (data: { type: string; drivers: Driver[] }) => void
    ) => {
        // Close existing connection
        if (eventSource.value) {
            eventSource.value.close();
        }

        try {
            eventSource.value = new EventSource(url);

            eventSource.value.onopen = () => {
                console.log('SSE Connected');
                isConnected.value = true;
                error.value = null;
            };

            eventSource.value.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessage(data);
                } catch (err) {
                    console.error('Error parsing SSE message:', err);
                }
            };

            eventSource.value.onerror = (err) => {
                console.error('SSE Error:', err);
                isConnected.value = false;
                error.value = 'Connection lost';
                // EventSource will auto-reconnect
            };
        } catch (err) {
            console.error('Error creating EventSource:', err);
            error.value = 'Failed to connect';
        }
    };

    const disconnect = () => {
        if (eventSource.value) {
            eventSource.value.close();
            eventSource.value = null;
            isConnected.value = false;
        }
    };

    // Auto cleanup
    onUnmounted(() => {
        disconnect();
    });

    return {
        connect,
        disconnect,
        isConnected,
        error,
    };
}