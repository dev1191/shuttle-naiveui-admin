<script setup lang="ts">
import { ref } from "vue";
import {
  NLayout,
  NLayoutContent,
  NModal,
  useMessage,
} from "naive-ui";
import DataTableWrapper from "@/components/common/DataTableWrapper.vue";
import FormDrawer from "@/components/common/FormDrawer.vue";
import CustomerViewModel from '@/components/customers/CustomerViewModel.vue';
import { customersApi } from "@/services/customer.service";
import {
  CustomerStatus,
  type Customer,
  type UpdateCustomerDTO,
} from "@/types/customer";
import { useRender } from "@/composables/useRender";
import { discrete } from "@/composables";
import { useRouter } from "vue-router";
import { Eye, Edit2, Wallet, List, Trash2 } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const {
  renderUserAvatar,
  renderDate,
  renderTag,
  renderDropdownMenu,
  renderIcon,
} = useRender();
const message = useMessage();
const router = useRouter();
const { t } = useI18n();

// State for Edit Drawer
const showEditDrawer = ref(false);
const editingCustomer = ref<Customer | null>(null);
const isSubmitting = ref(false);

// State for View Modal
const showViewModal = ref(false);
const viewingCustomer = ref<Customer | null>(null);

// State for table refresh
const tableRef = ref<any>(null);

const editFormFields = [
  {
    key: "firstname",
    label: "First Name",
    type: "text" as const,
    required: true,
  },
  {
    key: "lastname",
    label: "Last Name",
    type: "text" as const,
    required: true,
  },
  { key: "email", label: "Email", type: "text" as const, required: true },
  { key: "phone", label: "Phone", type: "text" as const, required: true },
  {
    key: "gender",
    label: "Gender",
    type: "radio-group" as const,
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "radio-group" as const,
    options: [
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ],
  },
];

function getActionOptions(row: Customer) {
  return [
    { key: "view", label: "View", icon: renderIcon(Eye) },
    { key: "edit", label: "Edit", icon: renderIcon(Edit2) },
    { key: "wallet", label: "Wallet Histories", icon: renderIcon(Wallet) },
    { key: "bookings", label: "Booking Histories", icon: renderIcon(List) },
    { key: "delete", label: "Delete", icon: renderIcon(Trash2) },
  ];
}

function handleAction(key: string | number, row: Customer) {
  const actionKey = String(key);
  switch (actionKey) {
    case "view":
      openViewModal(row);
      break;
    case "edit":
      openEditDrawer(row);
      break;
    case "wallet":
      router.push({ name: "walletHistory", params: { id: row.ids } });
      break;
    case "bookings":
      router.push({ name: "bookingHistory", params: { id: row.ids } });
      break;
    case "delete":
      if (discrete.dialog) {
        discrete.dialog.warning({
          title: t("common.confirm"),
          content: t("common.deleteConfirm"),
          positiveText: t("common.delete"),
          negativeText: t("common.cancel"),
          onPositiveClick: () => {
            handleDelete(row);
          },
        });
      } else {
        console.error('Discrete dialog API not available');
        // Fallback
        if (confirm(t("common.deleteConfirm"))) {
             handleDelete(row);
        }
      }
      break;
  }
}

function openViewModal(customer: Customer) {
  viewingCustomer.value = { ...customer };
  showViewModal.value = true;
}

function openEditDrawer(customer: Customer) {
  editingCustomer.value = customer;
  showEditDrawer.value = true;
}

async function handleEditSubmit(formData: UpdateCustomerDTO) {
  if (!editingCustomer.value) return;

  isSubmitting.value = true;
  try {
    await customersApi.update(editingCustomer.value.ids, formData);
    message.success("Customer updated successfully");
    showEditDrawer.value = false;
    editingCustomer.value = null;

    // Refresh table
    if (tableRef.value?.loadData) {
      tableRef.value.loadData();
    }
  } catch (error) {
    message.error("Failed to update customer");
    console.error("Update error:", error);
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(customer: Customer) {
  try {
    await customersApi.delete(customer.ids);
    message.success("Customer deleted successfully");

    // Refresh table
    if (tableRef.value?.loadData) {
      tableRef.value.loadData();
    }
  } catch (error) {
    message.error("Failed to delete customer");
    console.error("Delete error:", error);
  }
}

function getStatusColor(status: any) {
  return status ? "success" : "error";
}

const columns = [
  {
    title: "Full Name",
    key: "fullname",
    render: (row: Customer) =>
      renderUserAvatar(row.picture, `${row.fullname}`, `${row.email}`),
  },
  { title: "Gender", key: "gender" },
  {
    title: "Phone",
    key: "phone",
    render: (row: Customer) => `+${row.country_code} ${row.phone}`,
  },
  { title: "Wallet Balance", key: "wallet_balance" },
  {
    title: "Status",
    key: "status",
    render: (row: Customer) =>
      renderTag(
        row.status ? 'Active' : 'Inactive',
        getStatusColor(row.status),
        CustomerStatus,
        "CustomerStatus"
      ),
  },
  {
    title: "Created Date",
    key: "createdAt",
    sorter: true, // Enable sorting
    render: (row: Customer) => renderDate(row.createdAt || ''),
  },
  {
    title: "Action",
    key: "actions",
    render: (row: Customer) =>
      renderDropdownMenu(getActionOptions(row), (key) =>
        handleAction(key, row)
      ),
  },
];

async function fetchCustomers(params: Record<string, any>) {
  const response = await customersApi.getAll(params);
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
    sortBy: params.sortBy || 'createdAt',
    sortDesc: params.sortDesc || false,
  };
}

const extraFilters = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ],
  },
  {
    key: "createdAt",
    label: "Created Date",
    type: "date-range" as const,
  },
];
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <DataTableWrapper
          ref="tableRef"
          :fetchData="fetchCustomers"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[3, 5, 7]"
          :scrollX="1000"
        />
      </div>
    </NLayoutContent>
  </NLayout>

  <!-- Edit Customer Drawer -->
  <FormDrawer
    v-model:show="showEditDrawer"
    title="Edit Customer"
    :fields="editFormFields"
    :modelValue="editingCustomer"
    :loading="isSubmitting"
    @submit="handleEditSubmit"
    @cancel="editingCustomer = null"
  />

  <!-- View Customer Modal -->
  <NModal
    v-model:show="showViewModal"
    preset="card"
    title="Customer Details"
    :style="{ width: '600px' }"
  >
    <div v-if="viewingCustomer">
      <CustomerViewModel 
        :viewingCustomer="viewingCustomer" 
        @close="showViewModal = false"
        @edit="(customer) => { openEditDrawer(customer); showViewModal = false; }"
      />
    </div>
  </NModal>
</template>
