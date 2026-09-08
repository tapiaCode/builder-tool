<template>
    <div class="about-root pb-6">
        <!-- Header Banner -->
        <v-card class="mb-3 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-primary">
            <v-card-text class="pa-4 pa-sm-5">
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
                        <div class="font-weight-bold text-body-1">Cuarto Completo (Habitación)</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Calcula en un solo paso los materiales para muros, contrapiso y colocación de piso. Deduce aberturas de puertas y ventanas,
                        entregando el total de ladrillos, bolsas de cemento, arena, ripio, cajas de piso, pegamento y pastina.
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
                        Dosificación exacta con fotografías reales para Ladrillo Adobito Comarapa (10×5×21 cm) y Ladrillo Cerámico de 6 Huecos
                        (10×15×24 cm), calculando piezas, juntas y mortero en baldes y bolsas.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 3: Vaciados de Hormigón -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="warning" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiCubeOutline" color="warning" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Vaciados de Hormigón</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Cálculo para cimientos, zapatas, columnas, vigas, contrapisos y losas con medidas simples. Incluye proporciones prácticas
                        1:2:3 (estructural) y 1:2:4 (pisos) en baldes de 20L, carretillas y bolsas de cemento.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 4: Pisos y Revestimientos -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="teal" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiGrid" color="teal" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Pisos y Cerámicas</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Cálculo de superficie de colocación, número exacto de cajas a comprar según el formato y m² por caja, porcentaje de
                        merma por recortes, bolsas de cemento cola y kilos de pastina para juntas.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 5: Guías y Recetario -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="success" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiBookOpenPageVariant" color="success" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">Guías & Manual del Albañil</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Calculadora rápida interactiva por bolsa de cemento (conversión directa a baldes y carretillas), tablas de dosificación
                        y recomendaciones constructivas para la zona de Comarapa.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 6: Off-Line -->
            <v-col cols="12" sm="6">
                <v-card class="pa-4 rounded-xl border-0 elevation-2 h-100">
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="info" variant="tonal" size="36" class="mr-3">
                            <v-icon :icon="mdiWifiOff" color="info" size="20" />
                        </v-avatar>
                        <div class="font-weight-bold text-body-1">100% Off-Line (Sin Internet)</div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                        Funciona de forma autónoma sin depender de conexión a internet ni datos móviles, lista para usarse en el lugar de la
                        construcción o en áreas rurales.
                    </p>
                </v-card>
            </v-col>

            <!-- Feature 7: Presupuesto en Bs. (Comentado temporalmente) -->
            <!-- <v-col cols="12" sm="6">
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
            </v-col> -->
        </v-row>
    </div>
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
        mdiGrid,
        mdiBookOpenPageVariant,
        mdiWifiOff,
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
