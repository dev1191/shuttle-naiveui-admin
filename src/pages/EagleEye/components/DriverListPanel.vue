<script setup lang="ts">
import {
  NTabs,
  NTabPane,
  NCard,
  NTag,
  NSpace,
  NSkeleton,
  NList,
  NListItem,
  NAvatar,
  NText,
} from "naive-ui";
import type { Driver } from "@/types/driver";

interface Props {
  drivers: Driver[]; // All drivers combined
  loading: boolean;
  activeTab: string;
}

interface Emits {
  (e: "update:activeTab", value: string): void;
  (e: "select-driver", driver: Driver): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Filter drivers by active tab
const filteredDrivers = computed<Driver[]>(() => {
  return props.drivers.filter((d) => d.duty_status === props.activeTab);
});

// Get counts for each status
const onlineCount = computed(() => 
  props.drivers.filter((d) => d.duty_status === "ONLINE").length
);

const trackingCount = computed(() => 
  props.drivers.filter((d) => d.duty_status === "TRACK").length
);

const offlineCount = computed(() => 
  props.drivers.filter((d) => d.duty_status === "OFFLINE").length
);

const getDriverColor = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "green";
    case "TRACK":
      return "blue";
    case "OFFLINE":
      return "gray";
    default:
      return "red";
  }
};

const handleTabChange = (value: string) => {
  emit("update:activeTab", value);
};

const handleDriverClick = (driver: Driver) => {
  emit("select-driver", driver);
};
</script>

<template>
  <NCard title="Fleet Monitoring" class="font-bold">
    <template #header-extra>
      <NSpace>
        <NTag type="success">
          Online: {{ onlineCount }}
        </NTag>
        <NTag type="info">
          Tracking: {{ trackingCount }}
        </NTag>
        <NTag type="default">
          Offline: {{ offlineCount }}
        </NTag>
      </NSpace>
    </template>

    <NTabs
      :value="activeTab"
      @update:value="handleTabChange"
      type="segment"
      animated
      vertical
    >
      <NTabPane name="ONLINE" tab="Online Drivers">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-3">
            <NSkeleton circle :width="40" :height="40" />
            <div class="flex-1">
              <NSkeleton text :width="80" class="mb-2" />
              <NSkeleton text :width="80" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredDrivers.length === 0"
          class="text-center py-8 text-gray-500"
        >
          No online drivers found
        </div>

        <!-- Driver List -->
        <div v-else class="max-h-[500px] overflow-y-auto">
          <NList hoverable clickable>
            <NListItem 
              v-for="driver in filteredDrivers" 
              :key="driver._id"
              @click="handleDriverClick(driver)"
            >
              <template #prefix>
                <NAvatar
                  round
                  :style="{ backgroundColor: getDriverColor(driver.duty_status) }"
                >
                  {{ driver.fullname?.charAt(0) || "D" }}
                </NAvatar>
              </template>
              <div>
                <NText strong>{{ driver.fullname }}</NText>
                <div class="mt-1">
                  <NTag
                    :type="driver.duty_status === 'ONLINE' ? 'success' : 'default'"
                    size="small"
                  >
                    {{ driver.duty_status }}
                  </NTag>
                </div>
              </div>
            </NListItem>
          </NList>
        </div>
      </NTabPane>

      <NTabPane name="TRACK" tab="Tracking Drivers">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-3">
            <NSkeleton circle :width="40" :height="40" />
            <div class="flex-1">
              <NSkeleton text :width="80" class="mb-2" />
              <NSkeleton text :width="80" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredDrivers.length === 0"
          class="text-center py-8 text-gray-500"
        >
          No tracking drivers found
        </div>

        <!-- Driver List -->
        <div v-else class="max-h-[500px] overflow-y-auto">
          <NList hoverable clickable>
            <NListItem 
              v-for="driver in filteredDrivers" 
              :key="driver._id"
              @click="handleDriverClick(driver)"
            >
              <template #prefix>
                <NAvatar
                  round
                  :style="{ backgroundColor: getDriverColor(driver.duty_status) }"
                >
                  {{ driver.fullname?.charAt(0) || "D" }}
                </NAvatar>
              </template>
              <div>
                <NText strong>{{ driver.fullname }}</NText>
                <div class="mt-1">
                  <NTag
                    :type="driver.duty_status === 'TRACK' ? 'info' : 'default'"
                    size="small"
                  >
                    {{ driver.duty_status }}
                  </NTag>
                </div>
              </div>
            </NListItem>
          </NList>
        </div>
      </NTabPane>

      <NTabPane name="OFFLINE" tab="Offline Drivers">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-3">
            <NSkeleton circle :width="40" :height="40" />
            <div class="flex-1">
              <NSkeleton text :width="80" class="mb-2" />
              <NSkeleton text :width="80" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredDrivers.length === 0"
          class="text-center py-8 text-gray-500"
        >
          No offline drivers found
        </div>

        <!-- Driver List -->
        <div v-else class="max-h-[500px] overflow-y-auto">
          <NList hoverable clickable>
            <NListItem 
              v-for="driver in filteredDrivers" 
              :key="driver._id"
              @click="handleDriverClick(driver)"
            >
              <template #prefix>
                <NAvatar
                  round
                  :style="{ backgroundColor: getDriverColor(driver.duty_status) }"
                >
                  {{ driver.fullname?.charAt(0) || "D" }}
                </NAvatar>
              </template>
              <div>
                <NText strong>{{ driver.fullname }}</NText>
                <div class="mt-1">
                  <NText>{{ driver.phone }}</NText>
                </div>
              </div>
            </NListItem>
          </NList>
        </div>
      </NTabPane>
    </NTabs>
  </NCard>
</template>
