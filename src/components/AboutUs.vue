<template>
    <v-container class="py-4">
        <!-- Header Banner -->
        <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-primary">
            <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between">
                    <div>
                        <div class="text-overline text-primary font-weight-bold tracking-wider">COMARAPA — SANTA CRUZ</div>
                        <h2 class="text-h5 font-weight-black text-on-surface mb-1">Acerca de Obrafácil</h2>
                        <p class="text-body-2 text-medium-emphasis mb-0">Información del proyecto y guía rápida de uso</p>
                    </div>
                    <v-avatar color="primary" size="52" class="elevation-4 pulse-badge">
                        <v-icon :icon="mdiInformation" size="28" color="white" />
                    </v-avatar>
                </div>
            </v-card-text>
        </v-card>

        <!-- Project Purpose & Credits -->
        <v-card class="rounded-xl border-0 elevation-2 pa-5 mb-4 border-start-primary">
            <div class="d-flex align-center mb-3">
                <v-avatar color="red-accent-3" size="44" class="mr-3 elevation-2">
                    <v-icon :icon="mdiHeart" color="white" size="24" />
                </v-avatar>
                <div>
                    <h3 class="text-h6 font-weight-black">Hecho para la Comunidad de Comarapa</h3>
                    <div class="text-caption text-medium-emphasis">Proyecto escolar de impacto comunitario</div>
                </div>
            </div>

            <p class="text-body-2 text-high-emphasis mb-3 line-height-relaxed">
                <strong>Obrafácil Comarapa</strong> es un proyecto creado con mucho cariño para apoyar a los maestros de obra, albañiles,
                constructores y familias de nuestra querida comunidad de <strong>Comarapa</strong> (Santa Cruz, Bolivia). Nuestro objetivo es brindar
                una herramienta fácil, entendible y práctica para calcular materiales y estimar costos de construcción de forma rápida.
            </p>

            <v-divider class="my-4" />

            <!-- Team Members -->
            <div class="d-flex align-center mb-3">
                <v-icon :icon="mdiSchool" color="primary" class="mr-2" />
                <h4 class="text-subtitle-1 font-weight-bold">Desarrollado por Estudiantes de 6to de Secundaria:</h4>
            </div>

            <v-row density="compact" class="mt-1">
                <v-col cols="12" sm="6">
                    <v-card class="pa-3 rounded-lg border-0 bg-surface-variant d-flex align-center">
                        <v-avatar color="primary" size="40" class="mr-3 font-weight-bold text-white"> FT </v-avatar>
                        <div>
                            <div class="font-weight-bold text-subtitle-2">Fiorella Tapia Berbetti</div>
                            <div class="text-caption text-medium-emphasis">Estudiante de 6to de Secundaria</div>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-card class="pa-3 rounded-lg border-0 bg-surface-variant d-flex align-center">
                        <v-avatar color="accent" size="40" class="mr-3 font-weight-bold text-white"> MT </v-avatar>
                        <div>
                            <div class="font-weight-bold text-subtitle-2">Mishell Abigail Toledo Flores</div>
                            <div class="text-caption text-medium-emphasis">Estudiante de 6to de Secundaria</div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <div class="d-flex align-center justify-end mt-4 text-caption text-medium-emphasis">
                <v-icon :icon="mdiMapMarker" color="primary" size="16" class="mr-1" /> Comarapa, Bolivia
            </div>
        </v-card>

        <!-- Guide: What can be calculated? -->
        <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center ml-1">
            <v-icon :icon="mdiHelpCircleOutline" color="primary" class="mr-2" />
            ¿Qué puedes calcular en Obrafácil Comarapa?
        </h3>

        <v-row density="comfortable">
            <!-- Feature 1: Cuarto Completo -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="primary" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiHomeCity" color="primary" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Cuarto Completo (4×4m)</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Calcula en un solo paso la cantidad total de ladrillos, bolsas de cemento, arena, ripio, cerámica de piso y agua para
                        construir una habitación completa.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 2: Paredes y Ladrillos -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="accent" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiWall" color="accent" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Paredes con Fotos de Ladrillos</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Dosificación exacta para Ladrillo de 6 Huecos, Ladrillo Adobito, Ladrillo Visto (18H), Bloques de Hormigón y Ladrillos para
                        Losa.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 3: Vaciados -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="warning" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiCubeOutline" color="warning" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Vaciados de Hormigón</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Calcula cimientos, zapatas, columnas, vigas y contrapisos con medidas simples (Largo × Ancho × Grosor) y mezclas 1:2:3 y 1:2:4
                        en latas y carretillas.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 4: Presupuesto en Bs. -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="success" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiCashMultiple" color="success" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Presupuesto en Bolivianos (BOB)</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Obtén el desglose financiero estimado de tu obra en Bolivianos (Bs.) con precios unitarios de mercado editables y opción de
                        exportar el resumen.
                    </p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import {
        mdiInformation,
        mdiHeart,
        mdiSchool,
        mdiMapMarker,
        mdiHelpCircleOutline,
        mdiHomeCity,
        mdiWall,
        mdiCubeOutline,
        mdiCashMultiple,
    } from '@mdi/js';
</script>

<style scoped>
    .border-start-primary {
        border-left: 5px solid rgb(var(--v-theme-primary)) !important;
    }
    .line-height-relaxed {
        line-height: 1.6;
    }
</style>
