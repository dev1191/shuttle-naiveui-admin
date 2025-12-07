<script setup lang="ts">
import { NButton, NSpace, NSwitch, NInput, NFormItem, NForm, NIcon, NDrawer, NDrawerContent, NDivider, NText, NCard, NEmpty, NSkeleton, NGrid, NGridItem, NBadge } from "naive-ui";
import { paymentGatewaysApi } from "@/services/paymentGateway.service";
import { useMessage } from "naive-ui";
import { PencilIcon as EditIcon, Trash2Icon, PlusIcon, CreditCardIcon } from "lucide-vue-next";
import type { PaymentGateway, paymentValue } from "@/types/settings/paymentGateway";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const gateways = ref<PaymentGateway[]>([]);
const selectedGateway = ref<PaymentGateway | null>(null);
const fetchLoading = ref(true);

// Form data for the drawer
const formData = ref({
  site_slug: "",
  is_enabled: true,
  name: [] as paymentValue[],
});

const fetchGateways = async () => {
  fetchLoading.value = true;
  try {
    const response = await paymentGatewaysApi.getAll();
    gateways.value = response.data || [];
  } catch (error: any) {
    message.error("Failed to load payment gateways");
    console.error("Fetch error:", error);
  } finally {
    fetchLoading.value = false;
  }
};

const handleAdd = () => {
  selectedGateway.value = null;
  formData.value = {
    site_slug: "",
    is_enabled: true,
    name: [],
  };
  showDrawer.value = true;
};

const handleEdit = (gateway: PaymentGateway) => {
  selectedGateway.value = { ...gateway };
  formData.value = {
    site_slug: gateway.site_slug,
    is_enabled: gateway.is_enabled,
    name: gateway.name ? [...gateway.name] : [],
  };
  showDrawer.value = true;
};

const handleDelete = async (gateway: PaymentGateway) => {
  const dialog = window.confirm(`Are you sure you want to delete ${gateway.site_slug}?`);
  if (!dialog) return;

  try {
    const response = await paymentGatewaysApi.delete(gateway._id);
    message.success(response.message || "Payment gateway deleted successfully");
    fetchGateways();
  } catch (error: any) {
    message.error(error.message || "Failed to delete payment gateway");
    console.error("Delete error:", error);
  }
};

const toggleStatus = async (gateway: PaymentGateway, value: boolean) => {
  try {
    await paymentGatewaysApi.update(gateway._id, { is_enabled: value });
    gateway.is_enabled = value;
    message.success(`${gateway.site_slug} status updated successfully`);
  } catch (error) {
    message.error("Failed to update status");
    console.error("Status update error:", error);
  }
};

const addConfigField = () => {
  formData.value.name.push({
    id: crypto.randomUUID(),
    name: "",
    value: "",
  });
};

const removeConfigField = (index: number) => {
  formData.value.name.splice(index, 1);
};

const handleSubmit = async () => {
  // Validation
  if (!formData.value.site_slug.trim()) {
    message.error("Gateway name is required");
    return;
  }

  // Validate config fields
  for (const field of formData.value.name) {
    if (!field.name.trim() || !field.value.trim()) {
      message.error("All configuration fields must have both name and value");
      return;
    }
  }

  loading.value = true;

  try {
    const payload = {
      site_slug: formData.value.site_slug,
      is_enabled: formData.value.is_enabled,
      name: formData.value.name,
    };

    if (selectedGateway.value?._id) {
      // Update existing
      await paymentGatewaysApi.update(selectedGateway.value._id, payload);
      message.success("Payment gateway updated successfully");
    } else {
      // Add new
      await paymentGatewaysApi.create(payload);
      message.success("Payment gateway added successfully");
    }

    showDrawer.value = false;
    fetchGateways();
  } catch (error: any) {
    if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
      message.error("This payment gateway already exists.");
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save payment gateway. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  showDrawer.value = false;
  selectedGateway.value = null;
  formData.value = {
    site_slug: "",
    is_enabled: true,
    name: [],
  };
};

const formatGatewayName = (slug: string) => {
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getGatewayImage = (slug: string) => {
  try {
    return new URL(`/src/assets/images/gateways/${slug}.png`, import.meta.url).href;
  } catch {
    return null;
  }
};

onMounted(() => {
  fetchGateways();
});
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <NSpace vertical :size="24">
      <NSpace justify="space-between" align="center">
        <div>
          <h2 style="margin: 0; font-size: 24px; font-weight: 600">Payment Gateways</h2>
          <NText depth="3" style="font-size: 14px">
            Manage payment gateway integrations and configurations
          </NText>
        </div>
      </NSpace>

      <!-- Gateway Cards Grid -->
      <NGrid x-gap="6" y-gap="6" cols="1 s:2 m:3 l:3" responsive="screen">
        <!-- Skeleton Loading -->
        <template v-if="fetchLoading">
          <NGridItem v-for="i in 4" :key="i">
            <NCard :bordered="true" size="small">
              <NSpace vertical :size="6">
                <NSkeleton height="24px" width="60%" />
                <NSkeleton height="16px" width="40%" />
                <NSkeleton height="16px" width="80%" />
                <NSpace justify="space-between">
                  <NSkeleton height="28px" width="80px" />
                  <NSkeleton height="28px" width="60px" />
                </NSpace>
              </NSpace>
            </NCard>
          </NGridItem>
        </template>

        <!-- Gateway Cards -->
        <template v-else>
          <NGridItem v-for="gateway in gateways" :key="gateway._id">
            <NCard 
              :bordered="true" 
              size="large"
              hoverable
              :style="{
                borderColor: gateway.is_enabled ? 'var(--n-border-color)' : 'var(--n-border-color)',
                opacity: gateway.is_enabled ? 1 : 0.6
              }"
            >
              <NSpace vertical :size="4">
                <!-- Gateway Header -->
                <NSpace justify="space-between" align="center">
                  <NSpace align="center" :size="4">
                    <img 
                      v-if="getGatewayImage(gateway.site_slug)"
                      :src="getGatewayImage(gateway.site_slug)" 
                      :alt="gateway.site_slug"
                      style="width: 150px; height: 150px; object-fit: contain; border-radius: 4px"
                    />
                    <NIcon v-else :component="CreditCardIcon" :size="24" />
                
                  </NSpace>
                  <NBadge 
                    :value="gateway.is_enabled ? 'Active' : 'Inactive'" 
                    :type="gateway.is_enabled ? 'success' : 'default'"
                  />
                </NSpace>

                <!-- Configuration Count -->
                <NText depth="3" style="font-size: 12px">
                  {{ gateway.name?.length || 0 }} configuration field{{ gateway.name?.length !== 1 ? 's' : '' }}
                </NText>

                <!-- Config Fields Preview -->
                <div v-if="gateway.name && gateway.name.length > 0" style="font-size: 12px">
                  <NText depth="3">
                    {{ gateway.name.slice(0, 2).map(f => f.name).join(', ') }}
                    <span v-if="gateway.name.length > 2">...</span>
                  </NText>
                </div>

                <NDivider style="margin: 4px 0" />

                <!-- Actions -->
                <NSpace justify="space-between" align="center">
                  <NSwitch 
                    :value="gateway.is_enabled"
                    @update:value="(val) => toggleStatus(gateway, val)"
                    size="small"
                  >
                    <template #checked>On</template>
                    <template #unchecked>Off</template>
                  </NSwitch>
                  
                  <NButton 
                    size="small" 
                    @click="handleEdit(gateway)"
                    quaternary
                  >
                    <template #icon>
                      <NIcon :component="EditIcon" />
                    </template>
                  </NButton>
                </NSpace>
              </NSpace>
            </NCard>
          </NGridItem>
        </template>

        <!-- Empty State -->
        <NGridItem v-if="!fetchLoading && gateways.length === 0" span="1 s:2 m:3 l:4">
          <NCard :bordered="true">
            <NEmpty 
              description="No payment gateways configured yet"
              size="large"
            >
            </NEmpty>
          </NCard>
        </NGridItem>
      </NGrid>
    </NSpace>

    <!-- Configuration Drawer -->
    <NDrawer
      v-model:show="showDrawer"
      :width="600"
      placement="right"
    >
      <NDrawerContent
        :title="selectedGateway ? 'Edit Payment Gateway' : 'Add Payment Gateway'"
        closable
      >
        <NForm :model="formData" label-placement="top">
          <NFormItem label="Gateway Name" required>
            <NInput
              v-model:value="formData.site_slug"
              placeholder="e.g., stripe, paypal, razorpay"
              :disabled="!!selectedGateway"
            />
          </NFormItem>

          <NFormItem label="Status">
            <NSwitch v-model:value="formData.is_enabled">
              <template #checked>Enabled</template>
              <template #unchecked>Disabled</template>
            </NSwitch>
          </NFormItem>

          <NDivider />

          <NSpace vertical :size="12">
            <NSpace justify="space-between" align="center">
              <h4 style="margin: 0">Configuration Fields</h4>
              <NButton size="small" @click="addConfigField">
                <template #icon>
                  <NIcon :component="PlusIcon" />
                </template>
                Add Field
              </NButton>
            </NSpace>

            <NText depth="3" style="font-size: 12px">
              Add configuration fields like API keys, secrets, webhook URLs, etc.
            </NText>

            <NSpace vertical :size="12" style="width: 100%">
              <NCard
                v-for="(field, index) in formData.name"
                :key="field.id"
                size="small"
                :bordered="true"
              >
                <NSpace vertical :size="8" style="width: 100%">
                  <NFormItem label="Field Name" :show-feedback="false">
                    <NInput
                      v-model:value="field.name"
                      placeholder="e.g., api_key, secret_key, webhook_url"
                    />
                  </NFormItem>
                  <NFormItem label="Field Value" :show-feedback="false">
                    <NInput
                      v-model:value="field.value"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      placeholder="Enter the value"
                    />
                  </NFormItem>
                  <NSpace justify="end">
                    <NButton
                      size="small"
                      type="error"
                      quaternary
                      @click="removeConfigField(index)"
                    >
                      <template #icon>
                        <NIcon :component="Trash2Icon" />
                      </template>
                      Remove
                    </NButton>
                  </NSpace>
                </NSpace>
              </NCard>

              <NEmpty
                v-if="formData.name.length === 0"
                description="No configuration fields added yet"
                size="small"
              />
            </NSpace>
          </NSpace>
        </NForm>

        <template #footer>
          <NSpace justify="end">
            <NButton @click="handleCancel">Cancel</NButton>
            <NButton type="primary" :loading="loading" @click="handleSubmit">
              {{ selectedGateway ? 'Update' : 'Create' }}
            </NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>