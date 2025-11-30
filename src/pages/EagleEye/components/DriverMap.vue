<script setup lang="ts">
import type { Driver } from "@/types/driver";

interface Props {
  drivers: Driver[];
  center: [number, number];
  zoom: number;
  projection: string;
}

const props = defineProps<Props>();

const getDriverColor = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "green";
    case "TRACKING":
      return "blue";
    case "OFFLINE":
      return "gray";
    default:
      return "red";
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

      <ol-tile-layer>
        <ol-source-xyz
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
        />
      </ol-tile-layer>

      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature v-for="driver in drivers" :key="driver.id">
            <ol-geom-point :coordinates="driver.location" />
            <ol-style>
              <ol-style-circle :radius="8">
                <ol-style-fill :color="getDriverColor(driver.status)" />
                <ol-style-stroke color="white" :width="2" />
              </ol-style-circle>
              <ol-style-text
                :text="driver.fullname"
                :offset-y="-15"
                scale="1.2"
              >
                <ol-style-fill color="#000" />
                <ol-style-stroke color="#fff" :width="3" />
              </ol-style-text>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>
  </div>
</template>

<style scoped>
/* Ensure map container has height */
:deep(.ol-viewport) {
  height: 100% !important;
}
</style>
