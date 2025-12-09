<template>
  <div class="bus-layout-form">
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <n-grid cols="2 m:12" :x-gap="12" :y-gap="12" item-responsive>
        <!-- Left Column: Controls -->
        <n-grid-item span="1 m:4">
          <n-card title="Layout Details" size="small">
            <n-space vertical size="large">
              <FormInput
                v-model="formValue.name"
                label="Layout Name"
                path="name"
                placeholder="Enter layout name"
              />

              <n-form-item label="Status" path="status">
                <n-switch v-model:value="formValue.status">
                  <template #checked>Active</template>
                  <template #unchecked>Inactive</template>
                </n-switch>
              </n-form-item>
              
              <n-divider />

              <n-grid cols="2" :x-gap="12">
                <n-form-item-gi label="Rows" path="rows">
                  <n-input-number v-model:value="formValue.rows" :min="1" :max="20" style="width: 100%" />
                </n-form-item-gi>

                <n-form-item-gi label="Columns" path="columns">
                  <n-input-number v-model:value="formValue.columns" :min="1" :max="10" style="width: 100%" />
                </n-form-item-gi>
              </n-grid>

              <n-form-item label="Structure" path="hasUpperDeck">
                <n-switch v-model:value="hasUpperDeck" size="large">
                   <template #checked>Double Decker</template>
                   <template #unchecked>Single Deck</template>
                </n-switch>
              </n-form-item>

              <n-form-item label="Driver Position"> 
                   <n-radio-group v-model:value="formValue.steering" name="steeringGroup" style="width: 100%">
                      <n-radio-button value="left" style="width: 50%; text-align: center">Left</n-radio-button>
                      <n-radio-button value="right" style="width: 50%; text-align: center">Right</n-radio-button>
                   </n-radio-group>
              </n-form-item>
            </n-space>
          </n-card>
        </n-grid-item>

        <!-- Right Column: Visualizer -->
        <n-grid-item span="1 m:4">
            <n-card title="Seat Configuration" size="small">
                <template #header-extra>
                    <n-tag type="info">Total Seats: {{ formValue.max_seats }}</n-tag>
                </template>
                <SeatLayoutConfigurator
                    ref="layoutConfigRef"
                    :rows="formValue.rows"
                    :columns="formValue.columns"
                    :steering="formValue.steering"
                    :has-upper-deck="hasUpperDeck"

                    :initial-seats="initialSeats"
                    @update:max-seats="handleMaxSeatsUpdate"
                />
            </n-card>
        </n-grid-item>


      </n-grid>

      <!-- Preview Modal -->
      <n-modal v-model:show="showPreview" preset="card" title="Booking Preview" style="width: 600px;">
          <BusLayoutViewer 
            v-if="previewData" 
            :seat-lists="previewData.seatLists" 
            :steering="previewData.steering"
          />
      </n-modal>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import type { BusLayout, CreateBusLayoutDTO, UpdateBusLayoutDTO, SeatList } from '@/types/buses/busLayout';
import SeatLayoutConfigurator from './SeatLayoutConfigurator.vue';
import BusLayoutViewer from './BusLayoutViewer.vue';
import FormInput from "@/components/common/FormInput.vue";

interface Props {
  initialData?: BusLayout | null;
  loading?: boolean;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  loading: false,
  isEdit: false
});

const emit = defineEmits<{
  (e: 'submit', data: CreateBusLayoutDTO | UpdateBusLayoutDTO): void;
  (e: 'cancel'): void;
}>();

const formRef = ref<FormInst | null>(null);
const layoutConfigRef = ref<InstanceType<typeof SeatLayoutConfigurator> | null>(null);
const message = useMessage();

// Form State
const formValue = ref({
  name: '',
  status: true,
  rows: 10,
  columns: 4,
  steering: 'right', // 'left' or 'right'
  max_seats: '0',
});

const hasUpperDeck = ref(false);

const initialSeats = ref<SeatList[]>([]);

// Preview State
const showPreview = ref(false);
const previewData = ref<{ seatLists: SeatList[], steering: string } | null>(null);

// Rules
const rules: FormRules = {
  name: [{ required: true, message: 'Please enter layout name', trigger: 'blur' }],
  rows: [{ required: true, type: 'number', min: 1, message: 'Rows required', trigger: 'blur' }],
  columns: [{ required: true, type: 'number', min: 1, message: 'Columns required', trigger: 'blur' }]
};

// Methods
const handleMaxSeatsUpdate = (count: number) => {
    formValue.value.max_seats = count.toString();
};

const handlePreview = () => {
    if (!layoutConfigRef.value) return;
    
    // Extract current state from configurator
    const layoutData = layoutConfigRef.value.getLayoutData();
    
    previewData.value = {
        seatLists: layoutData.seatLists,
        steering: formValue.value.steering
    };
    showPreview.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    
    // Get data from child
    if (!layoutConfigRef.value) return;
    const layoutData = layoutConfigRef.value.getLayoutData();

    const payload: CreateBusLayoutDTO | UpdateBusLayoutDTO = {
        ...formValue.value,
        seat_lists: layoutData.seatLists
    };

    emit('submit', payload);

  } catch (errors) {
    console.error(errors);
    message.error('Please verify the layout configuration');
  }
};

// Initialize
onMounted(() => {
    if (props.initialData) {
        formValue.value = {
            name: props.initialData.name,
            status: props.initialData.status,
            rows: props.initialData.rows,
            columns: props.initialData.columns,
            steering: props.initialData.steering,
            max_seats: props.initialData.max_seats,

        };
        
        if (props.initialData.seat_lists && props.initialData.seat_lists.length > 0) {

            initialSeats.value = props.initialData.seat_lists;
            
            hasUpperDeck.value = props.initialData.seat_lists.some(s => s.deck === 2);
        }
    }
});

defineExpose({
    handleSubmit,
    handlePreview
});
</script>

<style scoped>

</style>
