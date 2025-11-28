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

    <NDescriptionsItem label="Customer Phone Number">
      {{ viewingHelper.phone }}
    </NDescriptionsItem>
    <NDescriptionsItem label="Description" :span="2">
      {{ viewingHelper.description }}
    </NDescriptionsItem>
  </NDescriptions>


       <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-2">
        <NButton @click="emit('close')"> Close </NButton>
      </div>
</template>
