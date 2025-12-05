<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  useMessage,
  type FormInst,
  type FormRules,
  type SelectOption,
} from "naive-ui";
import { routesApi } from "@/services/route.service";
import { stopsApi } from "@/services/stop.service";
import FormInput from "@/components/common/FormInput.vue";
import type { CreateStopDTO } from "@/types/route";
import type { Stop } from "@/types/stop";

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const stopOptions = ref<SelectOption[]>([]);
const stopMap = new Map<string, Stop>();

const formData = reactive({
  title: "",
  stops: [] as CreateStopDTO[],
  status: true,
});

const rules: FormRules = {
  title: [{ required: true, message: "Please enter title", trigger: "blur" }],
  stops: [
    {
      required: true,
      type: "array",
      min: 2,
      message: "Please select at least 2 stops",
      trigger: "change",
    },
  ],
};

const fetchStops = async () => {
  try {
    const response = await stopsApi.getAll({ pageSize: 1000 });
    stopOptions.value = response.items.map((stop) => {
      stopMap.set(stop.ids, stop);
      return {
        label: stop.title,
        value: stop.ids,
        disabled: !stop.status,
      };
    });
  } catch (error) {
    console.error("Failed to fetch stops", error);
    message.error("Failed to load stops");
  }
};

const handleStopChange = (index: number, stopId: string) => {
  const stop = stopMap.get(stopId);
  if (stop) {
    formData.stops[index] = {
      ...formData.stops[index],
      stopId: stopId,
      stop_name: stop.title,
      coordinates: [stop.lat, stop.lng],
      // Maintain existing values if any, else default
      minimum_fare_pickup: formData.stops[index].minimum_fare_pickup || 0,
      minimum_fare_drop: formData.stops[index].minimum_fare_drop || 0,
      price_per_km_drop: formData.stops[index].price_per_km_drop || 0,
      price_per_km_pickup: formData.stops[index].price_per_km_pickup || 0,
    };
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    await fetchStops();

    if (props.id) {
      const response = await routesApi.getById(props.id);
      const data = response as any;
      console.log("data", data);
      formData.title = data.title;
      formData.status = data.status;

      if (Array.isArray(data.stops)) {
        formData.stops = data.stops.map((s: any) => ({
          ...s,
          // Ensure structure matches DTO just in case
        }));
      }
    }
  } catch (error) {
    console.error("Failed to fetch route:", error);
    message.error("Failed to load route details");
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    // Update orders based on current index
    const stopsWithOrder = formData.stops.map((stop, index) => ({
      ...stop,
      order: index + 1,
    }));

    const submitData = {
      title: formData.title,
      stops: stopsWithOrder,
      status: formData.status,
    };

    if (props.id) {
      await routesApi.update(props.id, submitData as any);
      message.success("Route updated successfully");
    } else {
      await routesApi.create(submitData as any);
      message.success("Route created successfully");
    }

    router.push("/manage-routes/routes/route-list");
  } catch (error: any) {
    console.error("Submit error:", error);
    message.error(error.message || "Operation failed");
  } finally {
    loading.value = false;
  }
};

const onCreateStop = (): CreateStopDTO => {
  return {
    stopId: "",
    id: "",
    order: 0,
    stop_name: "",
    address: "",
    coordinates: [0, 0],
    minimum_fare_pickup: 0,
    minimum_fare_drop: 0,
    price_per_km_drop: 0,
    price_per_km_pickup: 0,
  };
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <n-card :title="id ? 'Edit Route' : 'Create Route'">
    <template #header-extra>
      <n-space>
        <n-button type="error" secondary @click="router.back()">Cancel</n-button>
        <n-button type="primary" :loading="loading" @click="onSubmit">
          {{ id ? "Update" : "Create" }}
        </n-button>
      </n-space>
    </template>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <div class="max-w-full">
        <n-grid :cols="1" :y-gap="24" :x-gap="24">
          <n-gi>
            <n-grid :cols="2" :x-gap="12" :y-gap="12">
              <n-gi>
                <FormInput
                  v-model="formData.title"
                  label="Title"
                  path="title"
                  placeholder="Enter route title"
                />
              </n-gi>
              <n-gi>
                <n-form-item label="Status" path="status">
                  <n-switch v-model:value="formData.status" />
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-gi>

          <n-gi>
            <n-form-item label="Stops Sequence" path="stops">
              <div class="w-full">
                <n-dynamic-input
                  v-model:value="formData.stops"
                  :on-create="onCreateStop"
                  :min="2"
                  show-sort-button
                  size="large"
                >
                  <template #default="{ index, value }">
                    <n-card embedded class="mb-2 w-full">
                      <n-grid :cols="2" :x-gap="12" :y-gap="12">
                        <n-gi :span="2">
                          <n-form-item
                            label="Stop"
                            :show-label="true"
                            :path="`stops[${index}].stopId`"
                            :rule="{
                              required: true,
                              message: 'Select a stop',
                              trigger: ['blur', 'change'],
                            }"
                          >
                            <n-select
                              v-model:value="value.stopId"
                              :options="stopOptions"
                              placeholder="Select Stop"
                              filterable
                              clearable
                              size="large"
                              @update:value="
                                (val) => handleStopChange(index, val)
                              "
                            />
                          </n-form-item>
                        </n-gi>

                        <n-gi>
                          <n-form-item
                            label="Min Fare Pickup"
                            :path="`stops[${index}].minimum_fare_pickup`"
                          >
                            <n-input-number
                              size="large"
                              v-model:value="value.minimum_fare_pickup"
                              :min="0"
                              style="width: 100%"
                            />
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item
                            label="Min Fare Drop"
                            :path="`stops[${index}].minimum_fare_drop`"
                          >
                            <n-input-number
                              size="large"
                              v-model:value="value.minimum_fare_drop"
                              :min="0"
                              style="width: 100%"
                            />
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item
                            label="Price/KM Pickup"
                            :path="`stops[${index}].price_per_km_pickup`"
                          >
                            <n-input-number
                              size="large"
                              v-model:value="value.price_per_km_pickup"
                              :min="0"
                              style="width: 100%"
                            />
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item
                            label="Price/KM Drop"
                            :path="`stops[${index}].price_per_km_drop`"
                          >
                            <n-input-number
                              size="large"
                              v-model:value="value.price_per_km_drop"
                              :min="0"
                              style="width: 100%"
                            />
                          </n-form-item>
                        </n-gi>
                      </n-grid>
                    </n-card>
                  </template>
                </n-dynamic-input>
                <div class="text-gray-400 text-xs mt-2">
                  Add stops in the order they will be visited. Minimum 2 stops
                  required.
                </div>
              </div>
            </n-form-item>
          </n-gi>
        </n-grid>
      </div>
    </n-form>
  </n-card>
</template>
