<script setup lang="ts">
import { ref, watch } from "vue";
import { useMessage } from "naive-ui";
import CustomerSelect from "@/components/common/CustomerSelect.vue";
import { notificationsApi } from "@/services/notification.service";


const message = useMessage();
const isSubmitting = ref(false);

const newNotification = ref({
  ids: "",
  to: "all",
  user_type: "customer",
  message_type: "notification",
  title: "",
  content: "",
  user: [],
  schedule: "immediately",
  time: new Date(),
  days: [] as (number | null)[],
  picture: "",
  status: true,
});

const dayOptions = [
  { text: "All Days ", value: null },
  { text: "Every Sunday", value: 0 },
  { text: "Every Monday", value: 1 },
  { text: "Every Tuesday", value: 2 },
  { text: "Every Wednesday", value: 3 },
  { text: "Every Thursday", value: 4 },
  { text: "Every Friday", value: 5 },
  { text: "Every Saturday", value: 6 },
];

const fileList = ref([]);
const router = useRouter()
const onFileChange = async (options) => {
  const file = options.file?.file;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    newNotification.value.picture = e.target.result as string;
  };
  reader.readAsDataURL(file);
};

watch(
  () => newNotification.value.days,
  (val, oldVal) => {
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    const isAllSelected = allDays.every((day) => val.includes(day));
    const hasNull = val.includes(null);
    const hadNull = oldVal?.includes(null);

    // 1. User checked "All Days"
    if (hasNull && !hadNull) {
      newNotification.value.days = [null, ...allDays];
      return;
    }

    // 2. User unchecked "All Days"
    if (!hasNull && hadNull && isAllSelected) {
      newNotification.value.days = [];
      return;
    }

    // 3. User changed individual days
    if (!hasNull && isAllSelected) {
      // All days selected manually -> Check "All Days"
      newNotification.value.days = [null, ...val];
    } else if (hasNull && !isAllSelected) {
      // "All Days" is checked but a day is missing -> Uncheck "All Days"
      newNotification.value.days = val.filter((v) => v !== null);
    }
  }
);

const onSave = async () => {
  if (!newNotification.value.title) {
    message.error("Title is required");
    return;
  }
  if (!newNotification.value.content) {
    message.error("Content is required");
    return;
  }

  isSubmitting.value = true;
  try {
    // Exclude ids if it's empty to avoid issues with some backends
    const { ids, ...payload } = newNotification.value;
    await notificationsApi.create(payload as any);
    message.success("Message created successfully");
    router.push({ name: "sendMessage" });
  } catch (error) {
    console.error(error);
    message.error("Failed to send message");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="p-4">
    <NGrid x-gap="6" :cols="1">
      <NGi>
        <NCard>
          <NSpace vertical size="large" class="max-w-2xl mx-auto">
            <div class="text-center mb-4">
              <h2 class="text-xl font-semibold">Send Message</h2>
              <p class="text-gray-500">
                Send a message to a customer or group of customers
              </p>
            </div>

            <n-form :model="newNotification" ref="formRef">
              <NGrid :cols="3" x-gap="16" y-gap="8">
                <!-- Send To -->
                <NGi>
                  <n-form-item label="Send To">
                    <n-radio-group
                      size="large"
                      v-model:value="newNotification.to"
                    >
                      <n-radio-button value="all">All</n-radio-button>
                      <n-radio-button value="all_specific"
                        >Specific Users</n-radio-button
                      >
                    </n-radio-group>
                  </n-form-item>
                </NGi>

                <!-- Message Type -->
                <NGi>
                  <n-form-item label="Message Type">
                    <n-radio-group
                      size="large"
                      v-model:value="newNotification.message_type"
                    >
                      <n-radio-button value="notification"
                        >Push Notification</n-radio-button
                      >
                      <n-radio-button value="email">Email</n-radio-button>
                    </n-radio-group>
                  </n-form-item>
                </NGi>

                <!-- Schedule -->
                <NGi>
                  <n-form-item label="Schedule">
                    <n-radio-group
                      size="large"
                      v-model:value="newNotification.schedule"
                    >
                      <n-radio-button value="immediately"
                        >Send Immediately</n-radio-button
                      >
                      <n-radio-button value="date">Time & Days</n-radio-button>
                    </n-radio-group>
                  </n-form-item>
                </NGi>

                <!-- Users (full width) -->
                <NGi v-if="newNotification.to === 'all_specific'" :span="2">
                  <n-form-item label="Customers">
                    <CustomerSelect v-model="newNotification.user" multiple />
                  </n-form-item>
                </NGi>

                <NGi v-if="newNotification.schedule === 'date'">
                  <n-form-item label="Days">
                    <n-checkbox-group
                      size="large"
                      :value="newNotification.days as any"
                      @update:value="(val) => newNotification.days = val as any"
                    >
                      <n-space item-style="display: flex;">
                        <n-checkbox
                          v-for="day in dayOptions"
                          :value="day.value"
                          :label="day.text"
                        />
                      </n-space>
                    </n-checkbox-group>
                  </n-form-item>
                </NGi>

                <!-- Time & Days (shown when schedule = date) -->
                <NGi v-if="newNotification.schedule === 'date'">
                  <n-form-item label="Time">
                    <n-time-picker
                      size="large"
                      v-model:value="newNotification.time"
                      format="hh:mm a"
                    />
                  </n-form-item>
                </NGi>
              </NGrid>
              <NGrid :cols="2" x-gap="16" y-gap="8">
                <!-- Title -->
                <NGi>
                  <FormInput
                    v-model="newNotification.title"
                    label="Title"
                    path="title"
                    placeholder="Enter title"
                    required
                  />
                </NGi>

                <!-- Content (full width) -->
                <NGi :span="2">
                  <FormInput
                    v-model="newNotification.content"
                    label="Content"
                    path="content"
                    placeholder="Enter content"
                    required
                    type="textarea"
                  />
                </NGi>

                <!-- Picture -->
                <NGi>
                  <n-form-item label="Picture">
                    <n-upload
                      v-model:file-list="fileList"
                      :max="1"
                      accept="image/png, image/jpg"
                      @change="onFileChange"
                    />
                  </n-form-item>
                </NGi>
              </NGrid>

              <!-- Buttons full width -->
              <div class="flex justify-end gap-2 mt-4">
                <n-button
                  type="error"
                  size="large"
                  strong
                  secondary
                  @click="router.push({ name: 'sendMessage' })"
                  >Cancel</n-button
                >
                <n-button
                  type="primary"
                  size="large"
                  :loading="isSubmitting"
                  @click="onSave"
                  >Save</n-button
                >
              </div>
            </n-form>
          </NSpace>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped></style>
