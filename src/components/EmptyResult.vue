<template>
    <div class="empty-result d-flex align-center pa-4 mt-3 rounded-xl">
        <v-avatar color="primary" variant="tonal" size="40" rounded="lg" class="mr-3 flex-shrink-0">
            <v-icon :icon="mdiRuler" size="22" />
        </v-avatar>
        <div>
            <div class="text-body-2 font-weight-bold">{{ title }}</div>
            <div class="text-caption text-medium-emphasis">{{ subtitle }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {mdiRuler} from '@mdi/js';

    withDefaults(defineProps<{title?: string; subtitle?: string}>(), {
        title: 'Ingresa tus medidas',
        subtitle: 'Los resultados aparecerán aquí al completar los campos.',
    });
</script>

<style scoped>
    .empty-result {
        border: 1.5px dashed rgba(var(--v-theme-on-surface), 0.16);
    }
</style>
