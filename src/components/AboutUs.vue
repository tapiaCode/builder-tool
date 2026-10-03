<template>
    <div class="about-root pb-6">
        <PageHeader eyebrow="Acerca de" title="ObraFácil Comarapa" subtitle="Herramienta de cálculo y presupuestos para la obra." />

        <!-- Creator -->
        <v-card class="creator-card pa-6 mb-4 text-center" flat>
            <v-avatar color="primary" size="88" rounded="xl" class="mb-4 creator-avatar">
                <span class="creator-initials">TC</span>
            </v-avatar>
            <div class="creator-eyebrow text-primary mb-1">Creado por</div>
            <h2 class="creator-name mb-1">{{ creator.name }}</h2>
            <div class="text-body-1 text-medium-emphasis mb-5">{{ creator.role }}</div>

            <div class="d-flex flex-wrap justify-center ga-2">
                <v-btn
                    :href="creator.githubUrl"
                    target="_blank"
                    rel="noopener"
                    variant="flat"
                    size="large"
                    :prepend-icon="mdiGithub"
                    class="creator-btn github-btn"
                >
                    GitHub
                </v-btn>
                <v-btn
                    :href="repoUrl"
                    target="_blank"
                    rel="noopener"
                    variant="tonal"
                    color="primary"
                    size="large"
                    :prepend-icon="mdiSourceBranch"
                    class="creator-btn"
                >
                    Código fuente
                </v-btn>
            </div>
        </v-card>

        <!-- App info -->
        <div class="section-label px-1 mb-2">Información de la app</div>
        <v-card class="mb-4" flat>
            <v-list lines="one" bg-color="transparent" class="py-1">
                <v-list-item v-for="row in infoRows" :key="row.label" :prepend-icon="row.icon" min-height="56">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">{{ row.label }}</v-list-item-title>
                    <template #append>
                        <span class="text-body-2 font-weight-bold">{{ row.value }}</span>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>

        <!-- Features -->
        <div class="section-label px-1 mb-2">Qué puedes hacer</div>
        <v-card class="mb-4" flat>
            <v-list lines="two" bg-color="transparent" class="py-1">
                <v-list-item v-for="f in features" :key="f.title" min-height="64">
                    <template #prepend>
                        <v-avatar :color="f.color" variant="tonal" rounded="lg" size="40" class="mr-1">
                            <v-icon :icon="f.icon" size="22" />
                        </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-bold">{{ f.title }}</v-list-item-title>
                    <v-list-item-subtitle class="feature-sub">{{ f.text }}</v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-card>

        <p class="text-center text-caption text-medium-emphasis mt-6 mb-0">
            © {{ currentYear }} {{ creator.name }} · Hecho en Comarapa, Bolivia
        </p>
    </div>
</template>

<script setup lang="ts">
    import {computed} from 'vue';
    import {
        mdiGithub,
        mdiSourceBranch,
        mdiTagOutline,
        mdiCellphone,
        mdiWifiOff,
        mdiHomeCity,
        mdiFileDocumentOutline,
        mdiBookOpenPageVariantOutline,
        mdiAccountHardHat,
    } from '@mdi/js';
    import PageHeader from '@/components/PageHeader.vue';
    import {isNative} from '@/services/capacitorService';

    const creator = {
        name: 'tapiaCode',
        role: 'Software Engineer',
        githubUrl: 'https://github.com/tapiacode',
    };

    const repoUrl = 'https://github.com/tapiacode/builder-tool';

    const currentYear = new Date().getFullYear();

    const infoRows = computed(() => [
        {label: 'Versión', value: __APP_VERSION__, icon: mdiTagOutline},
        {label: 'Plataforma', value: isNative ? 'App Android' : 'Web', icon: mdiCellphone},
        {label: 'Funciona sin internet', value: 'Sí', icon: mdiWifiOff},
        {label: 'Desarrollador', value: creator.name, icon: mdiAccountHardHat},
    ]);

    const features = [
        {
            title: 'Cálculo de materiales',
            text: 'Cuartos, paredes, vaciados y pisos: ladrillos, cemento, arena y ripio.',
            icon: mdiHomeCity,
            color: 'primary',
        },
        {
            title: 'Presupuestos',
            text: 'Arma cotizaciones con tus propios precios y envíalas por WhatsApp.',
            icon: mdiFileDocumentOutline,
            color: 'success',
        },
        {
            title: 'Guías prácticas',
            text: 'Proporciones de mezcla en baldes y carretillas para la obra.',
            icon: mdiBookOpenPageVariantOutline,
            color: 'accent',
        },
    ];
</script>

<style scoped>
    .creator-card {
        background: rgba(var(--v-theme-primary), 0.07) !important;
        border-color: rgba(var(--v-theme-primary), 0.22) !important;
    }
    .creator-avatar {
        color: rgb(var(--v-theme-background));
    }
    .creator-eyebrow,
    .section-label {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .section-label {
        color: rgba(var(--v-theme-on-surface), 0.6);
    }
    .creator-name {
        font-size: 1.9rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.1;
    }
    .creator-initials {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.02em;
    }
    .github-btn {
        background: rgb(var(--v-theme-on-surface)) !important;
        color: rgb(var(--v-theme-surface)) !important;
    }
    .creator-btn {
        min-width: 150px;
    }
    .feature-sub {
        -webkit-line-clamp: 3 !important;
        line-clamp: 3;
    }
</style>
