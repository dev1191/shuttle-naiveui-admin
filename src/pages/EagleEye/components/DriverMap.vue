<script setup lang="ts">
import type { Driver } from "@/types/driver";

interface Props {
  drivers: Driver[];
  center: [number, number];
  zoom: number;
  projection: string;
}

const props = defineProps<Props>();

// Filter drivers with valid location
const validDrivers = computed(() => {
  return props.drivers.filter(
    (d) => d.location && Array.isArray(d.location) && d.location.length === 2
  );
});

const getDriverColor = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "#10b981"; // Green
    case "TRACK":
      return "#3b82f6"; // Blue
    case "OFFLINE":
      return "#6b7280"; // Gray
    default:
      return "#ef4444"; // Red
  }
};
</script>

<template>
  <div
    class="flex-1 min-h-[600px] relative border rounded-lg overflow-hidden shadow-sm"
  >
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 100%; width: 100%"
    >
      <ol-view
        ref="view"
        :center="center"
        :zoom="zoom"
        :projection="projection"
      />

      <!-- Tile Layer (Standard OSM) -->
      <ol-tile-layer>
        <ol-source-xyz
          url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png"
        />
      </ol-tile-layer>

      <!-- Driver Markers Layer -->
      <ol-vector-layer
        :updateWhileAnimating="true"
        :updateWhileInteracting="true"
      >
        <ol-source-vector>
          <ol-animation-fade :revers="true" :duration="5000" :repeat="10" >
            <ol-feature v-for="driver in validDrivers" :key="driver._id">
              <ol-geom-point :coordinates="driver.location" />
              <ol-style>
                <!-- Marker Circle -->
                <ol-style-circle :radius="10">
                  <ol-style-fill :color="getDriverColor(driver.duty_status)" />
                  <ol-style-stroke color="white" :width="3" />
                </ol-style-circle>

                <!-- Driver Name Label -->
                <ol-style-text
                  :text="driver.fullname"
                  :offset-y="-20"
                  :scale="1.1"
                >
                  <ol-style-fill color="#1f2937" />
                  <ol-style-stroke color="#ffffff" :width="3" />
                </ol-style-text>
              </ol-style>
            </ol-feature>
          </ol-animation-fade>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>

    <!-- Map Legend -->
    <div
      class="absolute top-3 left-3 bg-white rounded-lg shadow-lg p-2 space-y-2"
    >
      <div class="text-xs font-semibold text-gray-700 mb-2">Driver Status</div>
      <div class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          style="background-color: #10b981"
        ></div>
        <span class="text-xs text-gray-600">Online</span>
      </div>
      <div class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          style="background-color: #3b82f6"
        ></div>
        <span class="text-xs text-gray-600">Tracking</span>
      </div>
      <div class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          style="background-color: #6b7280"
        ></div>
        <span class="text-xs text-gray-600">Offline</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure map container has height */
:deep(.ol-viewport) {
  height: 100% !important;
}

/* Customize OpenLayers controls */
:deep(.ol-zoom) {
  top: 0.5rem;
  left: auto;
  right: 0.5rem;
}

:deep(.ol-zoom button) {
  background-color: white;
  color: #374151;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

:deep(.ol-zoom button:hover) {
  background-color: #f3f4f6;
}
</style>
