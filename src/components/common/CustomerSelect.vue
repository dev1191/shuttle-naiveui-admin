<script setup lang="ts">
import { h, ref, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { NAvatar, NTag, NText } from "naive-ui";
import type { SelectOption } from "naive-ui";
import { customersApi } from "@/services/customer.service";
import type { Customer } from "@/types/customer";

interface Props {
  modelValue?: string | number | Array<string | number> | null;
  multiple?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  placeholder: "Select Customer",
});

const emit = defineEmits(["update:modelValue"]);

const customers = ref<Customer[]>([]);
const isLoading = ref(false);

const searchCustomers = async (search: string) => {
  isLoading.value = true;
  try {
    const { items } = await customersApi.getAll({ search });
    customers.value = items;
  } catch (error) {
    console.error("Failed to fetch customers", error);
  } finally {
    isLoading.value = false;
  }
};

const searchAsync = useDebounceFn(searchCustomers, 350);

const handleUpdateValue = (value: any) => {
  emit("update:modelValue", value);
};

const renderLabel = (option: SelectOption) => {
  const customer = option as unknown as Customer;
  return h("div", { class: "flex items-center gap-2" }, [
    h(NAvatar, { src: customer.picture, size: "small", round: true }),
    h("div", {}, [
      h("div", { class: "font-medium" }, customer.fullname),
      h(NText, { depth: 3, style: { fontSize: "12px" } }, { default: () => `+${customer.country_code} ${customer.phone}` })
    ])
  ]);
};

const renderTag = ({ option, handleClose }: { option: SelectOption, handleClose: () => void }) => {
  const customer = option as unknown as Customer;
  return h(NTag, {
    closable: true,
    onClose: (e: MouseEvent) => {
      e.stopPropagation();
      handleClose();
    },
    type: "default",
    bordered: false,
    round: true
  }, { default: () => customer.fullname });
};

onMounted(() => {
  searchAsync("");
});
</script>

<template>
  <n-select
  size="large"
    :value="modelValue"
    :options="customers"
    :multiple="multiple"
    clearable
    filterable
    remote
    :loading="isLoading"
    label-field="fullname"
    value-field="ids"
    :placeholder="placeholder"
    :render-label="renderLabel"
    :render-tag="renderTag"
    @search="searchAsync"
    @update:value="handleUpdateValue"
  />
</template>
