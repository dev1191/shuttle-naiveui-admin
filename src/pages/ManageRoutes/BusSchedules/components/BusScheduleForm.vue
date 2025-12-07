<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { useBusSchedule } from "@/composables/useBusSchedule";
import { useRouter } from "vue-router";

const props = defineProps<{
  id?: string;
}>();

const { generalSettings } = useAuthStore();
const router = useRouter();

const {
  formRef,
  loading,
  initLoading,
  searchLoading,
  routeSearchLoading,
  routeOptions,
  busOptions,
  daysOptions,
  formData,
  rules,
  handleBusSearch,
  handleRouteSearch,
  handleRouteChange,
  onSubmit
} = useBusSchedule(props.id);
</script>

<template>
  <n-card :title="id ? 'Edit Schedule' : 'Create Schedule'">
    <template #header-extra>
      <n-space>
        <n-button type="error" secondary @click="router.back()"
          >Cancel</n-button
        >
        <n-button type="primary" :loading="loading" @click="onSubmit">
          {{ id ? "Update" : "Create" }}
        </n-button>
      </n-space>
    </template>

    <div v-if="initLoading">
      <n-space vertical>
        <n-grid :cols="2" :x-gap="24" :y-gap="24">
           <n-gi :span="2">
             <n-skeleton text width="200px" style="margin-bottom: 12px" />
           </n-gi>
           <n-gi>
             <n-skeleton height="40px" width="100%" />
           </n-gi>
           <n-gi>
              <n-skeleton height="40px" width="100%" /> 
           </n-gi>
           <n-gi :span="2">
             <n-skeleton text width="200px" style="margin-bottom: 12px; margin-top: 12px" />
           </n-gi>
           <n-gi>
              <n-skeleton height="40px" width="100%" />
           </n-gi>
            <n-gi>
              <n-skeleton height="40px" width="100%" />
           </n-gi>
        </n-grid>
        <n-skeleton text :repeat="2" style="margin-top: 24px" />
      </n-space>
    </div>

    <n-form
      v-else
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <n-grid :cols="24" :x-gap="24">
        <!-- Left Side: Form Details -->
        <n-gi :span="formData.stops.length > 0 ? 12 : 24">
          <n-grid :cols="2" :x-gap="24" :y-gap="12">
            <n-gi :span="2">
              <n-divider title-placement="left" style="margin-top: 0"
                >Route & Bus Details</n-divider
              >
            </n-gi>
            <n-gi>
              <n-form-item label="Route" path="routeId">
                <n-select
                  size="large"
                  v-model:value="formData.routeId"
                  :options="routeOptions"
                  placeholder="Select Route"
                  filterable
                  clearable
                  remote
                  :loading="routeSearchLoading"
                  @search="handleRouteSearch"
                  @update:value="handleRouteChange"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Bus" path="busId">
                <n-select
                  size="large"
                  v-model:value="formData.busId"
                  :options="busOptions"
                  placeholder="Select Bus"
                  filterable
                  clearable
                  remote
                  :loading="searchLoading"
                  @search="handleBusSearch"
                />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-divider title-placement="left"
                >Schedule Configuration</n-divider
              >
            </n-gi>
            <n-gi>
              <n-form-item label="Start Date" path="start_date">
                <n-date-picker
                  v-model:value="formData.start_date"
                  type="date"
                  style="width: 100%"
                  clearable
                  size="large"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="End Date" path="end_date">
                <n-date-picker
                  v-model:value="formData.end_date"
                  type="date"
                  style="width: 100%"
                  clearable
                  size="large"
                />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Frequency (Runs Every)" path="every">
                <n-checkbox-group size="large" v-model:value="formData.every">
                  <n-space>
                    <n-checkbox
                      v-for="day in daysOptions"
                      :key="day.value"
                      :value="day.value"
                      :label="day.label"
                    />
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Status" path="status">
                <n-switch v-model:value="formData.status" />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-gi>

        <!-- Right Side: Stop Timings -->
        <n-gi :span="12" v-if="formData.stops.length > 0">
          <n-divider class="font-extrabold mt-0" title-placement="left"
            >Stop Timings : Total {{ formData.stops.length }} stops</n-divider
          >
          <n-table :single-line="false" size="small" bordered>
            <thead>
              <tr>
                <th>Stop Name</th>
                <th>Arrival Time</th>
                <th>Departure Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stop, index) in formData.stops" :key="index">
                <td>{{ stop.stop_name }}</td>

                <td>
                  <n-time-picker
                    v-if="index !== 0"
                    v-model:formatted-value="stop.arrival_time"
                    value-format="HH:mm"
                    use-12-hours
                    placeholder="Arrival"
                    size="large"
                    format="HH:mm a"
                  />
                </td>

                <td>
                  <n-time-picker
                    v-if="index !== formData.stops.length - 1"
                    use-12-hours
                    v-model:formatted-value="stop.departure_time"
                    value-format="HH:mm"
                    placeholder="Departure"
                    size="large"
                    format="HH:mm a"
                  />
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-gi>
      </n-grid>
    </n-form>
  </n-card>
</template>
