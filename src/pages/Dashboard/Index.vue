<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NGrid, NGridItem, NSpace } from "naive-ui";
import {
  DollarSign,
  Bus,
  Ticket,
  Users,
} from "lucide-vue-next";
import StatCard from "./components/StatCard.vue";
import RevenueChart from "./components/RevenueChart.vue";
import BusStatus from "./components/BusStatus.vue";
import RecentActivity from "./components/RecentActivity.vue";
import UpcomingSchedule from "./components/UpcomingSchedule.vue";

// Loading states
const loadingStats = ref(true);
const loadingChart = ref(true);
const loadingBusStatus = ref(true);
const loadingActivity = ref(true);
const loadingSchedule = ref(true);

// Mock Data for Top Cards
const stats = [
  {
    title: "Total Revenue",
    value: "$12,450",
    icon: DollarSign,
    iconColor: "#18a058",
    trend: "up",
    trendValue: "12%",
    footer: "vs last month",
  },
  {
    title: "Active Trips",
    value: "24",
    icon: Bus,
    iconColor: "#2080f0",
    trend: "up",
    trendValue: "4",
    footer: "currently running",
  },
  {
    title: "Today's Bookings",
    value: "1,205",
    icon: Ticket,
    iconColor: "#f0a020",
    trend: "down",
    trendValue: "5%",
    footer: "vs yesterday",
  },
  {
    title: "Active Users",
    value: "850",
    icon: Users,
    iconColor: "#d03050",
    trend: "up",
    trendValue: "8%",
    footer: "online now",
  },
];

// Simulate data loading
onMounted(() => {
  // Simulate API calls with different loading times
  setTimeout(() => {
    loadingStats.value = false;
  }, 800);

  setTimeout(() => {
    loadingChart.value = false;
  }, 1200);

  setTimeout(() => {
    loadingBusStatus.value = false;
  }, 1000);

  setTimeout(() => {
    loadingActivity.value = false;
  }, 1400);

  setTimeout(() => {
    loadingSchedule.value = false;
  }, 1600);
});
</script>

<template>
  <div class="p-4">
    <NSpace vertical size="large">
      <!-- Top Stats Row -->
      <NGrid x-gap="16" y-gap="16" cols="1 s:2 m:4" responsive="screen">
        <NGridItem v-for="stat in stats" :key="stat.title">
          <StatCard v-bind="stat" :loading="loadingStats" />
        </NGridItem>
      </NGrid>

      <!-- Middle Row: Charts -->
      <NGrid x-gap="16" y-gap="16" cols="1 m:3" responsive="screen">
        <NGridItem span="2">
          <RevenueChart :loading="loadingChart" />
        </NGridItem>
        <NGridItem>
          <BusStatus :loading="loadingBusStatus" />
        </NGridItem>
      </NGrid>

      <!-- Bottom Row: Activity & More -->
      <NGrid x-gap="16" y-gap="16" cols="1 m:3" responsive="screen">
        <NGridItem span="1">
           <RecentActivity :loading="loadingActivity" />
        </NGridItem>
         <NGridItem span="2">
           <UpcomingSchedule :loading="loadingSchedule" />
        </NGridItem>
      </NGrid>
    </NSpace>
  </div>
</template>