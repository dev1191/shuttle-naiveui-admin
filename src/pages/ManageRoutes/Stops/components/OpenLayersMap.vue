<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useMessage } from "naive-ui";
import type { View } from "ol";
import { Translate } from "ol/interaction";
import { Collection } from "ol";
import StopImage from "@/assets/images/stops/stop.svg";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  autoDetectLocation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lat: 0,
  lng: 0,
  zoom: 18,
  autoDetectLocation: false,
});

const emit = defineEmits<{
  (e: "update:lat", value: number): void;
  (e: "update:lng", value: number): void;
}>();

const message = useMessage();
const view = ref<View | null>(null);
const mapRef = ref<any>(null);
const markerKey = ref(0);
const translateInteraction = ref<Translate | null>(null);
const isLoadingLocation = ref(false);

const center = computed(() => [props.lng, props.lat]);

// Get user's current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    message.error("Geolocation is not supported by your browser");
    return;
  }

  isLoadingLocation.value = true;
  message.loading("Getting your current location...", { duration: 0 });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      emit("update:lat", latitude);
      emit("update:lng", longitude);
      message.destroyAll();
      message.success("Location detected successfully");
      isLoadingLocation.value = false;
    },
    (error) => {
      message.destroyAll();
      let errorMessage = "Unable to get your location";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Please enable location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out";
          break;
      }
      
      message.error(errorMessage);
      isLoadingLocation.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

// Watch for external changes to update view center
watch(
  () => [props.lat, props.lng],
  ([newLat, newLng]) => {
    if (view.value && newLat !== 0 && newLng !== 0) {
      view.value.animate({
        center: [newLng, newLat],
        duration: 1000,
      });
      // Force marker re-render
      markerKey.value++;
    }
  }
);

const handleMapClick = (event: any) => {
  const [lng, lat] = event.coordinate;
  emit("update:lat", lat);
  emit("update:lng", lng);
  
  // Zoom in when clicking on the map
  if (view.value) {
    const currentZoom = view.value.getZoom() || props.zoom;
    view.value.animate({
      zoom: Math.min(currentZoom + 5, 40), // Max zoom is 25
      duration: 500
    });
  }
};

onMounted(() => {
  // Request location on mount only if autoDetectLocation is true and coordinates are not set
  if (props.autoDetectLocation && props.lat === 0 && props.lng === 0) {
    getCurrentLocation();
  }

  // Wait for map to be ready, then add translate interaction
  setTimeout(() => {
    if (mapRef.value?.map) {
      const map = mapRef.value.map;
      
      // Create translate interaction
      const translate = new Translate({
        layers: (layer: any) => {
          // Only allow translation on our vector layer
          return layer.get('name') === 'markerLayer';
        }
      });
      
      // Listen to translate end event
      translate.on('translateend', (event: any) => {
        const features = event.features.getArray();
        if (features.length > 0) {
          const coordinates = features[0].getGeometry().getCoordinates();
          const [lng, lat] = coordinates;
          emit("update:lat", lat);
          emit("update:lng", lng);
        }
      });
      
      map.addInteraction(translate);
      translateInteraction.value = translate;
    }
  }, 500);
});

onUnmounted(() => {
  if (translateInteraction.value && mapRef.value?.map) {
    mapRef.value.map.removeInteraction(translateInteraction.value);
  }
});

// Expose getCurrentLocation for parent component
defineExpose({
  getCurrentLocation
});
</script>

<template>
  <div class="map-wrapper">
    <!-- User Instructions Alert -->
    <n-alert title="How to Set Location" type="info" class="map-alert">
      <ul class="instruction-list">
        <li><strong>Click</strong> anywhere on the map to place the marker</li>
        <li><strong>Drag</strong> the marker icon to fine-tune the position</li>
        <li>Coordinates will update automatically</li>
      </ul>
    </n-alert>
    
    <div class="map-container">
      <ol-map
        ref="mapRef"
        :loadTilesWhileAnimating="true"
        :loadTilesWhileInteracting="true"
        style="height: 400px; width: 100%"
        @click="handleMapClick"
      >
        <ol-view
          ref="view"
          :center="center"
          :zoom="zoom"
          projection="EPSG:4326"
        />

        <ol-tile-layer>
          <ol-source-xyz
            url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png"
          />
        </ol-tile-layer>

        <!-- Marker Layer -->
        <ol-vector-layer
          :updateWhileAnimating="true"
          :updateWhileInteracting="true"
          :properties="{ name: 'markerLayer' }"
        >
          <ol-source-vector>
            <ol-animation-shake :duration="6000" :repeat="10">
              <ol-feature :key="markerKey">
                <ol-geom-point :coordinates="center" />
                <ol-style>
                  <ol-style-icon :src="StopImage" :scale="0.6" :anchor="[0.5, 1]">
                  </ol-style-icon>
                </ol-style>
              </ol-feature>
            </ol-animation-shake>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
    </div>
  </div>
</template>

<style scoped>
.map-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.map-alert {
  width: 100%;
}

.instruction-list {
  margin: 0;
  padding-left: 20px;
  list-style: disc;
}

.instruction-list li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.5;
}

.instruction-list li:last-child {
  margin-bottom: 0;
}

/* Add cursor hint when hovering over map */
:deep(.ol-viewport) {
  cursor: crosshair !important;
}

/* Change cursor when hovering over marker */
:deep(.ol-viewport):hover {
  cursor: pointer;
}
</style>
