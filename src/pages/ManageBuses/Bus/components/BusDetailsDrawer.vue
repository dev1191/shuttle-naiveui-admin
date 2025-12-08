<script setup lang="ts">
import { computed } from 'vue';
import { NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem, NTag, NImage, NSpace, NEmpty, NCard } from 'naive-ui';
import type { Bus } from '@/types/buses/index';

const props = defineProps<{
    show: boolean;
    bus: Bus | null;
}>();

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
}>();

const showDrawer = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value),
});

const getStatusType = (status: Bus['status']) => {
    const statusMap = {
        Active: 'success',
        OnRoute: 'info',
        Idle: 'warning',
        Maintance: 'error',
        Breakdown: 'error',
        Inactive: 'default',
    };
    return statusMap[status] || 'default';
};
</script>

<template>
    <NDrawer v-model:show="showDrawer" :width="600" placement="right">
        <NDrawerContent :title="bus?.name || 'Bus Details'" closable>
            <div v-if="bus">
                <NSpace vertical :size="24">
                    <!-- Basic Information -->
                    <NCard title="Basic Information" :bordered="false" size="small">
                        <NDescriptions :column="1" label-placement="left" bordered>
                            <NDescriptionsItem label="Bus Name">
                                {{ bus.name }}
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Registration No">
                                {{ bus.reg_no }}
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Brand">
                                {{ bus.brand }}
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Model Number">
                                {{ bus.model_no }}
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Chassis Number">
                                {{ bus.chassis_no }}
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Max Seats">
                                {{ bus.max_seats || 'N/A' }}
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Status">
                                <NTag :type="getStatusType(bus.status)">
                                    {{ bus.status }}
                                </NTag>
                            </NDescriptionsItem>
                        </NDescriptions>
                    </NCard>

                    <!-- Amenities -->
                    <NCard title="Amenities" :bordered="false" size="small">
                        <NSpace v-if="bus.amenities && bus.amenities.length > 0">
                            <NTag v-for="amenity in bus.amenities" :key="amenity" type="info">
                                {{ amenity }}
                            </NTag>
                        </NSpace>
                        <NEmpty v-else description="No amenities listed" size="small" />
                    </NCard>

                    <!-- Bus Pictures -->
                    <NCard title="Bus Pictures" :bordered="false" size="small">
                        <NSpace v-if="bus.picture && bus.picture.length > 0">
                            <NImage v-for="(pic, index) in bus.picture" :key="index" :src="pic" width="150" height="100"
                                object-fit="cover" style="border-radius: 8px" />
                        </NSpace>
                        <NEmpty v-else description="No pictures available" size="small" />
                    </NCard>

                    <!-- Certificates -->
                    <NCard title="Certificates" :bordered="false" size="small">
                        <NDescriptions :column="1" label-placement="left" bordered>
                            <NDescriptionsItem label="Registration Certificate">
                                <NImage 
                                    v-if="bus.certificate_registration"
                                    :src="bus.certificate_registration" 
                                    width="150"
                                    height="150"
                                    object-fit="cover"
                                    style="border-radius: 4px"
                                />
                                <span v-else class="text-gray-400">Not uploaded</span>
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Pollution Certificate">
                                <NImage 
                                    v-if="bus.certificate_pollution"
                                    :src="bus.certificate_pollution" 
                                    width="150"
                                     height="150"
                                    object-fit="cover"
                                    style="border-radius: 4px"
                                />
                                <span v-else class="text-gray-400">Not uploaded</span>
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Insurance Certificate">
                                <NImage 
                                    v-if="bus.certificate_insurance"
                                    :src="bus.certificate_insurance" 
                                    width="150"
                                     height="150"
                                    object-fit="cover"
                                    style="border-radius: 4px"
                                />
                                <span v-else class="text-gray-400">Not uploaded</span>
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Fitness Certificate">
                                <NImage 
                                    v-if="bus.certificate_fitness"
                                    :src="bus.certificate_fitness" 
                                    width="150"
                                     height="150"
                                    object-fit="cover"
                                    style="border-radius: 4px"
                                />
                                <span v-else class="text-gray-400">Not uploaded</span>
                            </NDescriptionsItem>
                            <NDescriptionsItem label="Permit Certificate">
                                <NImage 
                                    v-if="bus.certificate_permit"
                                    :src="bus.certificate_permit" 
                                    width="150"
                                     height="150"
                                    object-fit="cover"
                                    style="border-radius: 4px"
                                />
                                <span v-else class="text-gray-400">Not uploaded</span>
                            </NDescriptionsItem>
                        </NDescriptions>
                    </NCard>
                </NSpace>
            </div>
            <NEmpty v-else description="No bus data available" />
        </NDrawerContent>
    </NDrawer>
</template>

<style scoped>
.text-primary {
    color: var(--n-color-target);
    text-decoration: none;
}

.text-primary:hover {
    text-decoration: underline;
}

.text-gray-400 {
    color: #9ca3af;
}
</style>
