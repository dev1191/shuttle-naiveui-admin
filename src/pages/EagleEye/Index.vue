<script setup lang="ts">
import { NTag, useMessage } from "naive-ui";
import { mapsApi } from "@/services/map.service";
import type { Driver } from "@/types/driver";
import DriverListPanel from "./components/DriverListPanel.vue";
import DriverMap from "./components/DriverMap.vue";
import { useSSE } from "@/composables";

const zoom = ref(14);
const center = ref<[number, number]>([85.324, 27.7172]); // Default center (Kathmandu approx)
const projection = ref("EPSG:4326"); // Use Lat/Lon projection
const message = useMessage();

// Store drivers grouped by status
const onlineDrivers = ref<Driver[]>([]);
const trackingDrivers = ref<Driver[]>([]);
const offlineDrivers = ref<Driver[]>([]);
const loading = ref(false);
const activeTab = ref("ONLINE");
const search = ref("");

const { connect, isConnected, error } = useSSE();

// Feature flag: set to false to use REST API instead of SSE
const USE_SSE = ref(true);

// Get all drivers combined
const allDrivers = computed<Driver[]>(() => {
  return [
    ...onlineDrivers.value,
    ...trackingDrivers.value,
    ...offlineDrivers.value
  ];
});

// Get drivers for current tab
const filteredDrivers = computed<Driver[]>(() => {
  switch (activeTab.value) {
    case "ONLINE":
      return onlineDrivers.value;
    case "TRACKING":
      return trackingDrivers.value;
    case "OFFLINE":
      return offlineDrivers.value;
    default:
      return [];
  }
});

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.longitude, position.coords.latitude];
        message.success("Location updated");
      },
      (error) => {
        console.error("Error getting location:", error);
        message.warning("Could not get your location. Using default center.");
      }
    );
  } else {
    message.error("Geolocation is not supported by this browser.");
  }
};

// SSE Live Tracking
const connectLiveTracking = () => {
  const url = mapsApi.getStreamUrl(search.value);
  
  connect(url, (data) => {
    if (data.type === 'initial' || data.type === 'update') {
      // Update grouped drivers from backend
      if (data.groups) {
        onlineDrivers.value = data.groups.ONLINE || [];
        trackingDrivers.value = data.groups.TRACKING || [];
        offlineDrivers.value = data.groups.OFFLINE || [];
      }
      loading.value = false;
    }
  });
};

// Fallback: REST API polling
const fetchDrivers = async () => {
  loading.value = true;
  try {
    const response = await mapsApi.getDriverData(activeTab.value, search.value);

    if (response.data && Array.isArray(response.data)) {
      // For REST API fallback, update the appropriate group
      switch (activeTab.value) {
        case "ONLINE":
          onlineDrivers.value = response.data;
          break;
        case "TRACKING":
          trackingDrivers.value = response.data;
          break;
        case "OFFLINE":
          offlineDrivers.value = response.data;
          break;
      }
    }
  } catch (error) {
    message.error("Failed to fetch drivers");
  } finally {
    loading.value = false;
  }
};

// Start live tracking (SSE or polling)
const startTracking = () => {
  if (USE_SSE.value && typeof EventSource !== 'undefined') {
    loading.value = true;
    connectLiveTracking();
  } else {
    // Fallback to REST API
    fetchDrivers();
  }
};

onMounted(() => {
  getUserLocation();
  startTracking();
});

// No need to reconnect when tab changes with grouped data!
// Data is already loaded for all tabs

// Watch connection status
watch(isConnected, (connected) => {
  if (connected) {
    message.success("Live tracking connected");
  }
});

// Watch for errors
watch(error, (err) => {
  if (err) {
    message.error(`Live tracking: ${err}`);
  }
});
</script>

<template>
  <div class="h-full flex gap-4 relative">
    <!-- Connection Status Indicator -->
    <div class="absolute top-4 right-4 z-10">
      <NTag :type="isConnected ? 'success' : 'error'" size="small" round>
        <template #icon>
          <span>{{ isConnected ? '🟢' : '🔴' }}</span>
        </template>
        {{ isConnected ? 'Live' : 'Disconnected' }}
      </NTag>
    </div>

    <!-- Left side: Driver List Panel -->
    <div class="w-120 flex flex-col gap-4">
      <DriverListPanel
        :drivers="allDrivers"
        :loading="loading"
        :active-tab="activeTab"
        @update:active-tab="activeTab = $event"
      />
    </div>

    <!-- Right side: Map -->
    <DriverMap
      :drivers="filteredDrivers"
      :center="center"
      :zoom="zoom"
      :projection="projection"
    />
  </div>
</template>
