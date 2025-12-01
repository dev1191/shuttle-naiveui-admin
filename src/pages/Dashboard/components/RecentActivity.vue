<script setup lang="ts">
import { NCard, NTimeline, NTimelineItem, NSkeleton } from "naive-ui";

defineProps<{
  loading?: boolean;
}>();

const activities = [
  {
    type: "info",
    title: "New Booking",
    content: "John Doe booked a seat on Route 5 (Downtown -> Airport)",
    time: "2 mins ago",
  },
  {
    type: "success",
    title: "Trip Started",
    content: "Bus KA-01-1234 started trip on Route 8",
    time: "15 mins ago",
  },
  {
    type: "warning",
    title: "Maintenance Alert",
    content: "Bus KA-05-9999 reported engine check required",
    time: "1 hour ago",
  },
  {
    type: "info",
    title: "New User Registration",
    content: "Sarah Smith created a new account",
    time: "2 hours ago",
  },
  {
    type: "error",
    title: "Trip Cancelled",
    content: "Route 3 trip cancelled due to heavy rain",
    time: "5 hours ago",
  },
];
</script>

<template>
  <NCard title="Recent Activity" :bordered="false" class="h-full rounded-2xl">
    <div v-if="loading">
      <div v-for="i in 5" :key="i" class="mb-4">
        <NSkeleton text :repeat="1" width="40%" class="mb-1" />
        <NSkeleton text :repeat="2" />
      </div>
    </div>
    <NTimeline v-else>
      <NTimelineItem
        v-for="(activity, index) in activities"
        :key="index"
        :type="activity.type as any"
        :title="activity.title"
        :content="activity.content"
        :time="activity.time"
      />
    </NTimeline>
  </NCard>
</template>
