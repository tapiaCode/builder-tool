<template>
    <header class="page-header d-flex align-center justify-space-between pt-2 pb-4 px-1">
        <div class="min-width-0">
            <div class="page-eyebrow text-primary">{{ eyebrow }}</div>
            <h1 class="page-title">{{ title }}</h1>
            <p v-if="subtitle" class="text-body-2 text-medium-emphasis mb-0 mt-1">{{ subtitle }}</p>
        </div>
        <v-avatar v-if="icon" color="primary" variant="tonal" size="48" rounded="lg" class="flex-shrink-0 ml-3">
            <v-icon :icon="icon" size="26" />
        </v-avatar>
    </header>
</template>

<script setup lang="ts">
    defineProps<{eyebrow: string; title: string; subtitle?: string; icon?: string}>();
</script>

<style scoped>
    .page-eyebrow {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .page-title {
        font-size: 1.65rem;
        font-weight: 800;
        letter-spacing: -0.025em;
        line-height: 1.15;
    }
    .min-width-0 {
        min-width: 0;
    }
</style>
