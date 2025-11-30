<script setup lang="ts">
import { NTabs, NTabPane, NCard, useMessage, NTag, NSpace } from "naive-ui";
import  { mapsApi } from "@/services/map.service"
const zoom = ref(14);
const center = ref([85.324, 27.7172]); // Default center (Kathmandu approx)
const projection = ref("EPSG:4326"); // Use Lat/Lon projection
const message = useMessage();

// Mock Drivers Data
const drivers = ref([
  {
    id: 1,
    fullname: "Driver A",
    status: "online",
    location: [85.324, 27.7172],
  },
  {
    id: 2,
    fullname: "Driver B",
    status: "tracking",
    location: [85.33, 27.72],
  },
  {
    id: 3,
    fullname: "Driver C",
    status: "offline",
    location: [85.31, 27.71],
  },
  {
    id: 4,
    name: "Driver D",
    status: "online",
    location: [85.325, 27.718],
  },
]);

const activeTab = ref("ONLINE");
const search = ref("")

const filteredDrivers = computed(() => {
  if (activeTab.value === "all") return drivers.value;
  return drivers.value.filter((d) => d.status === activeTab.value);
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
        message.warning(
          "Could not get your location. Using default center."
        );
      }
    );
  } else {
    message.error("Geolocation is not supported by this browser.");
  }
};

const fetchDrivers = async () =>{
   const response  = await mapsApi.getDriverData(activeTab.value,search.value);
    console.log("response",response)

}

onMounted(() => {
  getUserLocation();
  fetchDrivers()
});

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
 <div class="h-full flex gap-4">
  <!-- Left side: Tabs + Stats -->
  <div class="w-120 flex flex-col gap-4">
    <NCard title="Eagle Eye - Fleet Monitoring">
      <template #header-extra>
        <NSpace>
          <NTag type="success">Online: {{ drivers.filter(d => d.status === 'ONLINE').length }}</NTag>
          <NTag type="info">Tracking: {{ drivers.filter(d => d.status === 'TRACKING').length }}</NTag>
          <NTag type="default">Offline: {{ drivers.filter(d => d.status === 'OFFLINE').length }}</NTag>
        </NSpace>
      </template>

      <NTabs type="segment"   v-model:value="activeTab" animated vertical>
        <NTabPane name="ONLINE" tab="Online Drivers">
         
            </NTabPane>
        <NTabPane name="TRACKING" tab="Tracking Drivers" />
        <NTabPane name="OFFLINE" tab="Offline Drivers" />
      </NTabs>
    </NCard>
  </div>

  <!-- Right side: Map -->
  <div class="flex-1 min-h-[600px] relative border rounded-lg overflow-hidden shadow-sm">
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
          <ol-feature v-for="driver in filteredDrivers" :key="driver.id">
            <ol-geom-point :coordinates="driver.location" />
            <ol-style>
              <ol-style-circle :radius="8">
                <ol-style-fill :color="getDriverColor(driver.status)" />
                <ol-style-stroke color="white" :width="2" />
              </ol-style-circle>
              <ol-style-text :text="driver.name" :offset-y="-15" scale="1.2">
                <ol-style-fill color="#000" />
                <ol-style-stroke color="#fff" :width="3" />
              </ol-style-text>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>
  </div>
</div>

</template>

<style scoped>
/* Ensure map container has height */
:deep(.ol-viewport) {
  height: 100% !important;
}
</style>