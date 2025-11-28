<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NAvatar, NButton } from "naive-ui";
import type { Helper } from "@/types/helper";

const props = defineProps<{
  viewingHelper: Helper;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <NDescriptions bordered :column="2">
    <NDescriptionsItem label="Ticket No">
      {{ viewingHelper.ticket_no }}
    </NDescriptionsItem>
    <NDescriptionsItem label="Customer First Name">
      {{ viewingHelper.firstname }}
    </NDescriptionsItem>
    <NDescriptionsItem label="Customer Last Name">
      {{ viewingHelper.lastname }}
    </NDescriptionsItem>
  </NDescriptions>
</template>
