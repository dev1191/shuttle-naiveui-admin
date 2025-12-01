<script setup lang="ts">
import { NCard, NList, NListItem, NTag, NIcon, NSkeleton } from "naive-ui";
import { Clock, User } from "lucide-vue-next";

defineProps<{
  loading?: boolean;
}>();

const schedules = [
  {
    id: 1,
    route: "Route 101: Downtown -> Tech Park",
    bus: "KA-01-5566",
    driver: "Mike Ross",
    time: "14:30",
    status: "Boarding",
    statusType: "warning",
  },
  {
    id: 2,
    route: "Route 205: Airport -> City Center",
    bus: "KA-05-8899",
    driver: "Harvey Specter",
    time: "15:00",
    status: "Scheduled",
    statusType: "info",
  },
  {
    id: 3,
    route: "Route 303: North Station -> South Mall",
    bus: "KA-02-1122",
    driver: "Rachel Zane",
    time: "15:45",
    status: "Scheduled",
    statusType: "info",
  },
  {
    id: 4,
    route: "Route 101: Tech Park -> Downtown",
    bus: "KA-01-5566",
    driver: "Mike Ross",
    time: "16:30",
    status: "Scheduled",
    statusType: "info",
  },
  {
    id: 5,
    route: "Route 404: East End -> West End",
    bus: "KA-03-3344",
    driver: "Louis Litt",
    time: "17:00",
    status: "Scheduled",
    statusType: "info",
  },
];
</script>

<template>
  <NCard title="Upcoming Schedule" :bordered="false" class="h-full rounded-2xl">
    <div v-if="loading">
      <div v-for="i in 5" :key="i" class="mb-4 p-3">
        <div class="flex items-center gap-3">
          <NSkeleton circle width="60px" height="60px" />
          <div class="flex-1">
            <NSkeleton text :repeat="1" width="70%" class="mb-2" />
            <NSkeleton text :repeat="1" width="50%" />
          </div>
        </div>
      </div>
    </div>
    <NList v-else hoverable clickable>
      <NListItem v-for="trip in schedules" :key="trip.id">
        <div class="flex items-center justify-between">
          <div class="flex items-start gap-3">
            <div class="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2 min-w-[60px]">
              <NIcon :component="Clock" size="16" class="text-gray-400 mb-1" />
              <span class="font-bold text-gray-700">{{ trip.time }}</span>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-800 text-sm flex items-center gap-2">
                {{ trip.route }}
              </h4>
              <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                    <span class="font-semibold">Bus:</span> {{ trip.bus }}
                </span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span class="flex items-center gap-1">
                    <NIcon :component="User" size="12" /> {{ trip.driver }}
                </span>
              </div>
            </div>
          </div>

          <NTag :type="trip.statusType as any" size="small" round>
            {{ trip.status }}
          </NTag>
        </div>
      </NListItem>
    </NList>
  </NCard>
</template>
