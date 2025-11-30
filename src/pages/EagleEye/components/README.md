# EagleEye Components

This directory contains the components for the EagleEye Fleet Monitoring feature.

## Component Structure

### `DriverListPanel.vue`

**Purpose**: Displays the driver list with tabs for different driver statuses.

**Props**:

- `drivers: Driver[]` - Array of all drivers
- `loading: boolean` - Loading state for skeleton display
- `activeTab: string` - Currently active tab (ONLINE, TRACKING, OFFLINE)

**Emits**:

- `update:activeTab` - Emitted when user switches tabs

**Features**:

- Tabbed interface for ONLINE, TRACKING, and OFFLINE drivers
- Skeleton loading states
- Empty state messages
- Driver list with avatars and status badges
- Color-coded avatars based on driver status

### `DriverMap.vue`

**Purpose**: Displays drivers on an interactive OpenLayers map.

**Props**:

- `drivers: Driver[]` - Array of drivers to display on map
- `center: [number, number]` - Map center coordinates [longitude, latitude]
- `zoom: number` - Map zoom level
- `projection: string` - Map projection (e.g., "EPSG:4326")

**Features**:

- Interactive OpenLayers map
- Color-coded markers for each driver
- Driver names displayed on map
- Responsive map container

## Usage Example

```vue
<script setup lang="ts">
import DriverListPanel from "./components/DriverListPanel.vue";
import DriverMap from "./components/DriverMap.vue";

const drivers = ref<Driver[]>([]);
const activeTab = ref("ONLINE");
const center = ref([85.324, 27.7172]);
</script>

<template>
  <div class="flex gap-4">
    <DriverListPanel
      :drivers="drivers"
      :loading="loading"
      :active-tab="activeTab"
      @update:active-tab="activeTab = $event"
    />

    <DriverMap
      :drivers="filteredDrivers"
      :center="center"
      :zoom="14"
      projection="EPSG:4326"
    />
  </div>
</template>
```

## Color Coding

Driver statuses are color-coded as follows:

- **ONLINE**: Green
- **TRACKING**: Blue
- **OFFLINE**: Gray
- **Unknown**: Red (fallback)
