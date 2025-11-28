<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useMessage, NCard, NForm, NFormItem, NInput, NSwitch, NButton, NCheckbox, NCheckboxGroup, NGrid, NGridItem, NSpin } from 'naive-ui';
import { rolesApi } from "@/services/role.service";
import type { Role } from "@/types/role";

const route = useRoute();
const router = useRouter();
const message = useMessage();
const id = route.params.id as string;

const loading = ref(false);
const submitting = ref(false);
const role = ref<Role | null>(null);
const allPermissions = ref<string[]>([]);

const formModel = ref({
    name: '',
    slug: '',
    permissions: [] as string[]
});

// Group permissions
const groupedPermissions = computed(() => {
    const groups: Record<string, string[]> = {};
    allPermissions.value.forEach(p => {
        const parts = p.split('.');
        let groupName = 'General';
        
        if (parts.length > 1) {
            groupName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        }
        
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(p);
    });
    return groups;
});

// Helper to get permission label (e.g. "customer.view" -> "View")
function getPermissionLabel(permission: string) {
    const parts = permission.split('.');
    return parts.length > 1 ? parts.slice(1).join(' ').replace(/_/g, ' ') : permission.replace(/_/g, ' ');
}

async function fetchData() {
    loading.value = true;
    try {
        const [roleData, permissionsData] = await Promise.all([
            rolesApi.getById(id),
            rolesApi.getPermissions()
        ]);
        
        role.value = roleData;
        allPermissions.value = permissionsData;
        
        // Initialize form
        formModel.value = {
            name: roleData.name,
            slug: roleData.slug,
            permissions: roleData.permissions || []
        };
    } catch (error) {
        message.error("Failed to load data");
        console.error(error);
    } finally {
        loading.value = false;
    }
}

async function handleSubmit() {
    submitting.value = true;
    try {
        await rolesApi.update(id, {
            name: formModel.value.name,
            slug: formModel.value.slug,
            permissions: formModel.value.permissions
        });
        message.success("Role updated successfully");
        router.push({ name: 'roles' });
    } catch (error: any) {
        message.error(error.response?.data?.message || "Failed to update role");
    } finally {
        submitting.value = false;
    }
}

// Select all for a group
function toggleGroup(groupName: string, permissions: string[]) {
    const currentGroupPermissions = permissions.filter(p => formModel.value.permissions.includes(p));
    const allSelected = currentGroupPermissions.length === permissions.length;
    
    if (allSelected) {
        // Unselect all
        formModel.value.permissions = formModel.value.permissions.filter(p => !permissions.includes(p));
    } else {
        // Select all
        const newPermissions = [...formModel.value.permissions];
        permissions.forEach(p => {
            if (!newPermissions.includes(p)) {
                newPermissions.push(p);
            }
        });
        formModel.value.permissions = newPermissions;
    }
}

function isGroupSelected(permissions: string[]) {
    return permissions.every(p => formModel.value.permissions.includes(p));
}

function isGroupIndeterminate(permissions: string[]) {
    const selectedCount = permissions.filter(p => formModel.value.permissions.includes(p)).length;
    return selectedCount > 0 && selectedCount < permissions.length;
}

onMounted(() => {
    fetchData();
});
</script>

<template>
    <div class="page-container">
        <NCard title="Edit Role" :bordered="false" class="mb-4">
            <template #header-extra>
                <NButton @click="router.back()">Back</NButton>
            </template>
            
            <NSpin :show="loading">
                <NForm
                    ref="formRef"
                    :model="formModel"
                    label-placement="top"
                    class="max-w-4xl"
                >
                    <NGrid :x-gap="24" :cols="2">
                        <NGridItem>
                            <NFormItem label="Role Name" path="name" required>
                                <NInput v-model:value="formModel.name" placeholder="Enter role name" />
                            </NFormItem>
                        </NGridItem>
                        <NGridItem>
                            <NFormItem label="Slug" path="slug" required>
                                <NInput v-model:value="formModel.slug" placeholder="e.g. admin" />
                            </NFormItem>
                        </NGridItem>

                    </NGrid>


                    <div class="mt-6">
                        <h3 class="text-lg font-medium mb-4">Permissions</h3>
                        <NGrid :x-gap="24" :y-gap="24" :cols="1" responsive="screen" item-responsive>
                            <NGridItem span="1 m:1 l:1" v-for="(permissions, group) in groupedPermissions" :key="group">
                                <NCard size="small" :title="group">
                                    <template #header-extra>
                                        <NCheckbox
                                            :checked="isGroupSelected(permissions)"
                                            :indeterminate="isGroupIndeterminate(permissions)"
                                            @update:checked="toggleGroup(group as string, permissions)"
                                        >
                                            Select All
                                        </NCheckbox>
                                    </template>
                                    <NCheckboxGroup v-model:value="formModel.permissions">
                                        <NGrid :cols="3" :x-gap="12" :y-gap="8">
                                            <NGridItem v-for="permission in permissions" :key="permission">
                                                <NCheckbox :value="permission" :label="getPermissionLabel(permission)" />
                                            </NGridItem>
                                        </NGrid>
                                    </NCheckboxGroup>
                                </NCard>
                            </NGridItem>
                        </NGrid>
                    </div>

                    <div class="flex justify-end mt-8 gap-4">
                        <NButton @click="router.back()">Cancel</NButton>
                        <NButton type="primary" :loading="submitting" @click="handleSubmit">
                            Save Changes
                        </NButton>
                    </div>
                </NForm>
            </NSpin>
        </NCard>
    </div>
</template>

<style scoped>
.page-container {
    padding: 24px;
}
</style>