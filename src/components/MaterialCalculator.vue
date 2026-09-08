<template>
    <v-container class="pt-4 pb-12">
        <!-- Header Banner -->
        <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-primary">
            <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between">
                    <div>
                        <div class="text-overline text-primary font-weight-bold tracking-wider">CÁLCULO FÁCIL Y PRÁCTICO</div>
                        <h2 class="text-h5 font-weight-black text-on-surface mb-1">Calculadora de Materiales</h2>
                        <p class="text-body-2 text-medium-emphasis mb-0">
                            Ladrillos locales con foto, bolsas de cemento, ripio y piezas en medidas simples
                        </p>
                    </div>
                    <v-avatar color="primary" size="52" class="elevation-4 pulse-badge">
                        <v-icon :icon="mdiHomeCity" size="28" color="white" />
                    </v-avatar>
                </div>
            </v-card-text>
        </v-card>

        <!-- Navigation Tabs -->
        <v-card class="rounded-xl border-0 elevation-2 mb-4">
            <v-tabs v-model="tab" color="primary" grow align-tabs="center" class="pa-1" show-arrows>
                <v-tab value="room" class="rounded-lg text-none font-weight-bold px-2 px-sm-4">
                    <v-icon :icon="mdiHomeOutline" class="mr-1" /> Cuarto<span class="d-none d-sm-inline">&nbsp;Completo</span>
                </v-tab>
                <v-tab value="walls" class="rounded-lg text-none font-weight-bold px-2 px-sm-4"> <v-icon :icon="mdiWall" class="mr-1" /> Paredes </v-tab>
                <v-tab value="concrete" class="rounded-lg text-none font-weight-bold px-2 px-sm-4"> <v-icon :icon="mdiCubeOutline" class="mr-1" /> Vaciado </v-tab>
                <v-tab value="tiles" class="rounded-lg text-none font-weight-bold px-2 px-sm-4"> <v-icon :icon="mdiGrid" class="mr-1" /> Pisos </v-tab>
            </v-tabs>
        </v-card>

        <!-- Main Content Tabs -->
        <v-window v-model="tab" class="pa-1">
            <!-- CUARTO COMPLETO -->
            <v-window-item value="room">
                <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                        <v-icon :icon="mdiHomeCity" color="primary" class="mr-2" />
                        1. Medidas de la Habitación / Cuarto
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-3">
                        Ingresa el tamaño del cuarto (ej. 4×4m con 3m de alto). Se calcularán los ladrillos, cemento, arena, ripio y piso necesarios:
                    </p>

                    <v-row density="compact">
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model.number="roomData.lengthM"
                                label="Largo del cuarto (m)"
                                type="number"
                                step="0.5"
                                min="1"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="calcRoom"
                            />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model.number="roomData.widthM"
                                label="Ancho del cuarto (m)"
                                type="number"
                                step="0.5"
                                min="1"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="calcRoom"
                            />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model.number="roomData.heightM"
                                label="Alto de paredes (m)"
                                type="number"
                                step="0.1"
                                min="1"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="calcRoom"
                            />
                        </v-col>
                    </v-row>

                    <v-row density="compact" class="mt-1">
                        <v-col cols="12">
                            <v-text-field
                                v-model.number="roomData.openingsM2"
                                label="Descuento Puertas / Ventanas (m²)"
                                type="number"
                                step="0.5"
                                min="0"
                                hint="Ej. 1 puerta (2m²) + 1 ventana (2m²) = 4m²"
                                persistent-hint
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                @input="calcRoom"
                            />
                        </v-col>
                    </v-row>

                    <div class="text-caption font-weight-bold text-medium-emphasis mb-2 mt-2">SELECCIONAR TIPO DE LADRILLO CON FOTO</div>
                    <v-row density="compact">
                        <v-col v-for="brick in brickOptions" :key="brick.value" cols="6" sm="6">
                            <v-card
                                class="pa-2 rounded-lg text-center interactive-select-card h-100 d-flex flex-column align-center justify-space-between"
                                :class="{selected: roomData.brickType === brick.value}"
                                @click="
                                    roomData.brickType = brick.value;
                                    calcRoom();
                                "
                            >
                                <div class="w-100" style="height: 75px; overflow: hidden; border-radius: 6px">
                                    <img
                                        v-if="brick.image"
                                        :src="brick.image"
                                        :alt="brick.title"
                                        style="width: 100%; height: 100%; object-fit: cover"
                                    />
                                    <div v-else class="d-flex align-center justify-center h-100 bg-surface-variant">
                                        <v-icon :icon="brick.icon" size="36" color="primary" />
                                    </div>
                                </div>
                                <div class="font-weight-bold text-caption mt-2 text-truncate w-100">{{ brick.title }}</div>
                                <div class="text-caption text-medium-emphasis mb-1" style="font-size: 10px !important">{{ brick.sub }}</div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" border="start" class="my-3 py-2">
                        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
                            <span class="text-body-2">
                                <strong>Cuarto:</strong> {{ roomData.lengthM }}m × {{ roomData.widthM }}m ({{ results.room?.floorArea }} m² de piso) |
                                <strong>Paredes netas:</strong> {{ results.room?.netWallArea }} m²
                            </span>
                        </div>
                    </v-alert>
                </v-card>

                <!-- Room Results -->
                <v-expand-transition>
                    <div v-if="results.room">
                        <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                            <v-icon :icon="mdiCheckCircle" color="success" class="mr-2" />
                            Total Materiales para el Cuarto Completo
                        </h3>

                        <v-row density="compact">
                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-primary text-center">
                                    <v-icon :icon="mdiWall" size="28" color="primary" class="mb-1" />
                                    <div class="text-h5 font-weight-black text-primary">{{ results.room.totalBricks }}</div>
                                    <div class="text-caption text-medium-emphasis">Ladrillos</div>
                                    <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">{{ selectedBrickTitle }}</v-chip>
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-accent text-center">
                                    <v-icon :icon="mdiPackageVariant" size="28" color="accent" class="mb-1" />
                                    <div class="text-h5 font-weight-black text-accent">{{ results.room.totalCementBags }}</div>
                                    <div class="text-caption text-medium-emphasis">Bolsas Cemento</div>
                                    <v-chip size="x-small" color="accent" variant="tonal" class="mt-1">50 kg c/u ({{ results.room.totalCementKg }} kg total)</v-chip>
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-warning text-center">
                                    <v-icon :icon="mdiTruckCargoContainer" size="28" color="warning" class="mb-1" />
                                    <div class="text-h5 font-weight-black">{{ results.room.totalSandM3 }} <span class="text-caption">m³</span></div>
                                    <div class="text-caption text-medium-emphasis">Arena Corriente</div>
                                    <v-chip size="x-small" color="warning" variant="tonal" class="mt-1"
                                        >~{{ results.room.sandWheelbarrows }} Carretillas</v-chip
                                    >
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-success text-center">
                                    <v-icon :icon="mdiDotsGrid" size="28" color="info" class="mb-1" />
                                    <div class="text-h5 font-weight-black">{{ results.room.totalRipioM3 }} <span class="text-caption">m³</span></div>
                                    <div class="text-caption text-medium-emphasis">Ripio</div>
                                    <v-chip size="x-small" color="info" variant="tonal" class="mt-1"
                                        >~{{ results.room.ripioWheelbarrows }} Carretillas</v-chip
                                    >
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-row density="compact" class="mt-2">
                            <v-col cols="6" sm="4">
                                <v-card class="pa-3 rounded-xl border-0 bg-surface-variant text-center">
                                    <v-icon :icon="mdiGrid" color="primary" class="mb-1" />
                                    <div class="text-h6 font-weight-bold">{{ results.room.totalTiles }}</div>
                                    <div class="text-caption text-medium-emphasis">Piezas Cerámica (40x40)</div>
                                </v-card>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <v-card class="pa-3 rounded-xl border-0 bg-surface-variant text-center">
                                    <v-icon :icon="mdiTexture" color="accent" class="mb-1" />
                                    <div class="text-h6 font-weight-bold">{{ results.room.glueBags20kg }}</div>
                                    <div class="text-caption text-medium-emphasis">Bolsas Cemento Cola</div>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-card class="pa-3 rounded-xl border-0 bg-surface-variant text-center">
                                    <v-icon :icon="mdiWater" color="info" class="mb-1" />
                                    <div class="text-h6 font-weight-bold">{{ results.room.totalWaterL }} <span class="text-caption">L</span></div>
                                    <div class="text-caption text-medium-emphasis">Agua (~{{ Math.ceil(results.room.totalWaterL / 20) }} Baldes)</div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-expand-transition>
            </v-window-item>

            <!-- VACIADO / HORMIGÓN -->
            <v-window-item value="concrete">
                <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                        <v-icon :icon="mdiRuler" color="primary" class="mr-2" />
                        1. Medidas del Vaciado (Zapatas, Cimientos, Columnas o Losas)
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-3">
                        Sirve para calcular cualquier vaciado de mezcla con ripio (cimientos, zapatas, losas, contrapisos o columnas):
                    </p>

                    <v-row density="compact">
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model.number="concreteDimensions.length"
                                label="Largo (metros)"
                                type="number"
                                step="0.1"
                                min="0.1"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateConcreteVolumeFromDimensions"
                            />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model.number="concreteDimensions.width"
                                label="Ancho (metros)"
                                type="number"
                                step="0.1"
                                min="0.1"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateConcreteVolumeFromDimensions"
                            />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model.number="concreteDimensions.thickness"
                                label="Grosor / Espesor (cm)"
                                type="number"
                                step="1"
                                min="1"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateConcreteVolumeFromDimensions"
                            />
                        </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" border="start" class="my-3 py-2">
                        <div class="d-flex align-center justify-space-between flex-wrap">
                            <span class="text-body-2">
                                <strong>Espacio calculado:</strong> {{ concreteDimensions.length }}m × {{ concreteDimensions.width }}m ×
                                {{ concreteDimensions.thickness }}cm
                            </span>
                            <span class="text-subtitle-1 font-weight-black text-primary"> = {{ concrete.volume }} m³ </span>
                        </div>
                    </v-alert>

                    <div class="text-caption font-weight-bold text-medium-emphasis mb-2 mt-4">2. MEZCLA Y PROPORCIÓN DE MATERIAL</div>
                    <v-row density="compact">
                        <v-col cols="12" sm="6">
                            <v-card
                                class="pa-3 rounded-lg text-left interactive-select-card h-100"
                                :class="{selected: concrete.proportion === '1:2:3'}"
                                @click="
                                    concrete.proportion = '1:2:3';
                                    calcConcrete();
                                "
                            >
                                <div class="d-flex align-center mb-1">
                                    <v-icon :icon="mdiHomeOutline" color="primary" class="mr-2" />
                                    <div class="font-weight-bold text-body-2">Mezcla Fuerte (1 : 2 : 3)</div>
                                </div>
                                <div class="text-caption font-weight-bold text-primary mb-1">1 Cemento : 2 Arena : 3 Ripio</div>
                                <div class="text-caption text-medium-emphasis">
                                    • Para 1 bolsa de cemento: 4 baldes de arena + 6 baldes de ripio.<br />
                                    • Ideal para: <strong>Vigas, Columnas y Losas</strong>.
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-card
                                class="pa-3 rounded-lg text-left interactive-select-card h-100"
                                :class="{selected: concrete.proportion === '1:2:4'}"
                                @click="
                                    concrete.proportion = '1:2:4';
                                    calcConcrete();
                                "
                            >
                                <div class="d-flex align-center mb-1">
                                    <v-icon :icon="mdiOfficeBuilding" color="accent" class="mr-2" />
                                    <div class="font-weight-bold text-body-2">Mezcla Estándar (1 : 2 : 4)</div>
                                </div>
                                <div class="text-caption font-weight-bold text-accent mb-1">1 Cemento : 2 Arena : 4 Ripio</div>
                                <div class="text-caption text-medium-emphasis">
                                    • Para 1 bolsa de cemento: 4 baldes de arena + 8 baldes de ripio.<br />
                                    • Ideal para: <strong>Zapatas, Cimientos y Contrapisos</strong>.
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>

                <!-- Results Concrete -->
                <v-expand-transition>
                    <div v-if="results.concrete">
                        <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                            <v-icon :icon="mdiCheckCircle" color="success" class="mr-2" />
                            Materiales Necesarios para el Vaciado
                        </h3>

                        <v-row density="compact">
                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-primary text-center">
                                    <v-icon :icon="mdiPackageVariant" size="28" color="primary" class="mb-1" />
                                    <template v-if="results.concrete.cementKg < 50">
                                        <div class="text-h5 font-weight-black">{{ results.concrete.cementKg }} <span class="text-caption font-weight-bold">kg</span></div>
                                        <div class="text-caption text-medium-emphasis">Cemento (Consumo)</div>
                                        <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">~{{ results.concrete.cementBagsExact }} bolsa (Comprar 1)</v-chip>
                                    </template>
                                    <template v-else>
                                        <div class="text-h5 font-weight-black">{{ results.concrete.cementBags }}</div>
                                        <div class="text-caption text-medium-emphasis">Bolsas de Cemento</div>
                                        <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">50 kg c/u ({{ results.concrete.cementKg }} kg)</v-chip>
                                    </template>
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-accent text-center">
                                    <v-icon :icon="mdiTruckCargoContainer" size="28" color="accent" class="mb-1" />
                                    <div class="text-h5 font-weight-black">{{ results.concrete.sandM3 }} <span class="text-caption">m³</span></div>
                                    <div class="text-caption text-medium-emphasis">Arena Corriente</div>
                                    <v-chip size="x-small" color="accent" variant="tonal" class="mt-1"
                                        >~{{ results.concrete.sandWheelbarrows }} Carretillas</v-chip
                                    >
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-warning text-center">
                                    <v-icon :icon="mdiDotsGrid" size="28" color="warning" class="mb-1" />
                                    <div class="text-h5 font-weight-black">{{ results.concrete.ripioM3 }} <span class="text-caption">m³</span></div>
                                    <div class="text-caption text-medium-emphasis">Ripio</div>
                                    <v-chip size="x-small" color="warning" variant="tonal" class="mt-1"
                                        >~{{ results.concrete.ripioWheelbarrows }} Carretillas</v-chip
                                    >
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-success text-center">
                                    <v-icon :icon="mdiWater" size="28" color="info" class="mb-1" />
                                    <div class="text-h5 font-weight-black">{{ results.concrete.waterL }} <span class="text-caption">L</span></div>
                                    <div class="text-caption text-medium-emphasis">Agua Limpia</div>
                                    <v-chip size="x-small" color="info" variant="tonal" class="mt-1"
                                        >~{{ Math.ceil(results.concrete.waterL / 20) }} Baldes 20L</v-chip
                                    >
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-expand-transition>
            </v-window-item>

            <!-- MUROS / PAREDES -->
            <v-window-item value="walls">
                <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                        <v-icon :icon="mdiWall" color="primary" class="mr-2" />
                        1. Medidas de la Pared
                    </h3>

                    <v-row density="compact">
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model.number="wallDimensions.length"
                                label="Largo de la pared (metros)"
                                type="number"
                                step="0.5"
                                min="0.5"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateWallAreaFromDimensions"
                            />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model.number="wallDimensions.height"
                                label="Alto de la pared (metros)"
                                type="number"
                                step="0.1"
                                min="0.5"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateWallAreaFromDimensions"
                            />
                        </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" border="start" class="my-3 py-2">
                        <div class="d-flex align-center justify-space-between flex-wrap">
                            <span class="text-body-2">
                                <strong>Pared a construir:</strong> {{ wallDimensions.length }}m de Largo × {{ wallDimensions.height }}m de Alto
                            </span>
                            <span class="text-subtitle-1 font-weight-black text-primary"> = {{ walls.area }} m² </span>
                        </div>
                    </v-alert>

                    <div class="text-caption font-weight-bold text-medium-emphasis mb-2 mt-4">2. SELECCIONAR TIPO DE LADRILLO CON FOTO</div>
                    <v-row density="compact">
                        <v-col v-for="brick in brickOptions" :key="brick.value" cols="6" sm="6">
                            <v-card
                                class="pa-2 rounded-lg text-center interactive-select-card h-100 d-flex flex-column align-center justify-space-between"
                                :class="{selected: walls.brickType === brick.value}"
                                @click="
                                    walls.brickType = brick.value;
                                    calcWall();
                                "
                            >
                                <div class="w-100" style="height: 75px; overflow: hidden; border-radius: 6px">
                                    <img
                                        v-if="brick.image"
                                        :src="brick.image"
                                        :alt="brick.title"
                                        style="width: 100%; height: 100%; object-fit: cover"
                                    />
                                    <div v-else class="d-flex align-center justify-center h-100 bg-surface-variant">
                                        <v-icon :icon="brick.icon" size="36" color="primary" />
                                    </div>
                                </div>
                                <div class="font-weight-bold text-caption mt-2 text-truncate w-100">{{ brick.title }}</div>
                                <div class="text-caption text-medium-emphasis mb-1" style="font-size: 10px !important">{{ brick.sub }}</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>

                <v-expand-transition>
                    <div v-if="results.walls">
                        <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                            <v-icon :icon="mdiCheckCircle" color="success" class="mr-2" />
                            Materiales Necesarios para Pared ({{ walls.area }} m²)
                        </h3>

                        <v-row density="compact">
                            <!-- 1. Ladrillos -->
                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-primary text-center h-100 d-flex flex-column justify-space-between align-center">
                                    <div>
                                        <v-icon :icon="mdiWall" size="28" color="primary" class="mb-1" />
                                        <div class="text-h5 font-weight-black text-primary">{{ results.walls.totalBricks }}</div>
                                        <div class="text-caption font-weight-bold text-medium-emphasis">Ladrillos (Unidades)</div>
                                    </div>
                                    <v-chip size="x-small" color="primary" variant="tonal" class="mt-2">
                                        {{ selectedWallBrickTitle }}
                                    </v-chip>
                                </v-card>
                            </v-col>

                            <!-- 2. Cemento -->
                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-accent text-center h-100 d-flex flex-column justify-space-between align-center">
                                    <div>
                                        <v-icon :icon="mdiPackageVariant" size="28" color="accent" class="mb-1" />
                                        <template v-if="results.walls.cementKg < 50">
                                            <div class="text-h5 font-weight-black text-accent">{{ results.walls.cementKg }} <span class="text-caption font-weight-bold">kg</span></div>
                                            <div class="text-caption font-weight-bold text-medium-emphasis">Cemento (Consumo real)</div>
                                        </template>
                                        <template v-else>
                                            <div class="text-h5 font-weight-black text-accent">{{ results.walls.cementBags }} <span class="text-caption font-weight-bold">bolsas</span></div>
                                            <div class="text-caption font-weight-bold text-medium-emphasis">Bolsas Cemento (50kg)</div>
                                        </template>
                                    </div>
                                    <v-chip size="x-small" color="accent" variant="tonal" class="mt-2">
                                        <template v-if="results.walls.cementKg < 50">
                                            ~{{ results.walls.cementBagsExact }} bolsa (Comprar 1)
                                        </template>
                                        <template v-else>
                                            {{ results.walls.cementKg }} kg (~{{ results.walls.cementBagsExact }} bol)
                                        </template>
                                    </v-chip>
                                </v-card>
                            </v-col>

                            <!-- 3. Arena Corriente -->
                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-warning text-center h-100 d-flex flex-column justify-space-between align-center">
                                    <div>
                                        <v-icon :icon="mdiTruckCargoContainer" size="28" color="warning" class="mb-1" />
                                        <div class="text-h5 font-weight-black">
                                            {{ results.walls.sandM3 < 0.05 ? results.walls.sandBuckets20L : results.walls.sandM3 }}
                                            <span class="text-caption font-weight-bold">{{ results.walls.sandM3 < 0.05 ? 'Baldes' : 'm³' }}</span>
                                        </div>
                                        <div class="text-caption font-weight-bold text-medium-emphasis">Arena de Asentado</div>
                                    </div>
                                    <v-chip size="x-small" color="warning" variant="tonal" class="mt-2">
                                        {{ results.walls.sandBuckets20L }} baldes (~{{ results.walls.sandM3 }} m³)
                                    </v-chip>
                                </v-card>
                            </v-col>

                            <!-- 4. Agua -->
                            <v-col cols="6" sm="3">
                                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-success text-center h-100 d-flex flex-column justify-space-between align-center">
                                    <div>
                                        <v-icon :icon="mdiWater" size="28" color="info" class="mb-1" />
                                        <div class="text-h5 font-weight-black text-info">{{ results.walls.waterL }} <span class="text-caption font-weight-bold">L</span></div>
                                        <div class="text-caption font-weight-bold text-medium-emphasis">Agua para Mezcla</div>
                                    </div>
                                    <v-chip size="x-small" color="info" variant="tonal" class="mt-2">
                                        ~{{ results.walls.waterBuckets20L }} Baldes (20L)
                                    </v-chip>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Aclaración didáctica cuando es menos de 1 bolsa -->
                        <v-alert v-if="results.walls.cementKg < 50" type="info" variant="tonal" border="start" density="compact" class="mt-3 py-2 text-caption">
                            <strong>💡 Aclaración sobre el Cemento:</strong> Para construir esta pared de <strong>{{ walls.area }} m²</strong> se consumen exactamente <strong>{{ results.walls.cementKg }} kg de cemento</strong> (~{{ results.walls.cementBagsExact }} bolsa de 50 kg). En la ferretería compras como mínimo 1 bolsa entera, la cual te alcanza para asentar hasta <strong>~{{ walls.brickType === '6_holes' ? '6.7' : '5.3' }} m²</strong> de pared.
                        </v-alert>
                    </div>
                </v-expand-transition>
            </v-window-item>

            <!-- PISOS / CERÁMICA -->
            <v-window-item value="tiles">
                <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                        <v-icon :icon="mdiGrid" color="primary" class="mr-2" />
                        1. Medidas del Piso a Revestir
                    </h3>

                    <v-row density="compact">
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model.number="tileDimensions.length"
                                label="Largo del piso (metros)"
                                type="number"
                                step="0.5"
                                min="0.5"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateTileAreaFromDimensions"
                            />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model.number="tileDimensions.width"
                                label="Ancho del piso (metros)"
                                type="number"
                                step="0.5"
                                min="0.5"
                                variant="outlined"
                                density="compact"
                                hide-details="auto"
                                class="mb-2"
                                @input="updateTileAreaFromDimensions"
                            />
                        </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" border="start" class="my-3 py-2">
                        <div class="d-flex align-center justify-space-between flex-wrap">
                            <span class="text-body-2">
                                <strong>Superficie total del piso:</strong> {{ tileDimensions.length }}m × {{ tileDimensions.width }}m
                            </span>
                            <span class="text-subtitle-1 font-weight-black text-primary"> = {{ tiles.area }} m² </span>
                        </div>
                    </v-alert>

                    <div class="text-caption font-weight-bold text-medium-emphasis mb-2 mt-4">2. TAMAÑO DE LA CERÁMICA / PORCELANATO</div>
                    <p class="text-caption text-medium-emphasis mb-2">Selecciona la medida de cada pieza de cerámica:</p>

                    <v-row density="compact" class="mb-2">
                        <v-col v-for="preset in TILE_PRESETS" :key="preset.label" cols="4" sm="2">
                            <v-btn
                                block
                                size="small"
                                :color="selectedTilePreset === preset.label ? 'primary' : 'surface-variant'"
                                :variant="selectedTilePreset === preset.label ? 'flat' : 'tonal'"
                                class="font-weight-bold text-none"
                                @click="selectTilePreset(preset)"
                            >
                                {{ preset.label }}
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-expand-transition>
                        <v-row v-if="selectedTilePreset === 'Otro'" density="compact" class="mt-2">
                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="tiles.tileWidthCm"
                                    label="Ancho Pieza (cm)"
                                    type="number"
                                    variant="outlined"
                                    density="compact"
                                    hide-details="auto"
                                    @input="calcTiles"
                                />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="tiles.tileHeightCm"
                                    label="Largo Pieza (cm)"
                                    type="number"
                                    variant="outlined"
                                    density="compact"
                                    hide-details="auto"
                                    @input="calcTiles"
                                />
                            </v-col>
                        </v-row>
                    </v-expand-transition>
                </v-card>

                <v-expand-transition>
                    <div v-if="results.tiles">
                        <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                            <v-icon :icon="mdiCheckCircle" color="success" class="mr-2" />
                            Materiales Necesarios para Piso
                        </h3>

                        <v-row density="compact">
                            <v-col cols="12" sm="4">
                                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-primary text-center">
                                    <v-icon :icon="mdiGrid" size="32" color="primary" class="mb-1" />
                                    <div class="text-h4 font-weight-black text-primary">{{ results.tiles.totalTiles }}</div>
                                    <div class="text-caption font-weight-bold text-medium-emphasis">Piezas / Placas de Cerámica</div>
                                    <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">
                                        {{ tiles.tileWidthCm }}×{{ tiles.tileHeightCm }} cm
                                    </v-chip>
                                </v-card>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-accent text-center">
                                    <v-icon :icon="mdiTexture" size="32" color="accent" class="mb-1" />
                                    <div class="text-h4 font-weight-black text-accent">{{ results.tiles.glueBags20kg }}</div>
                                    <div class="text-caption font-weight-bold text-medium-emphasis">Bolsas Cemento Cola (20kg)</div>
                                </v-card>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-success text-center">
                                    <v-icon :icon="mdiFormatPaint" size="32" color="success" class="mb-1" />
                                    <div class="text-h4 font-weight-black text-success">{{ results.tiles.groutBags1kg }}</div>
                                    <div class="text-caption font-weight-bold text-medium-emphasis">Bolsas Pastina / Fragua (1kg)</div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-expand-transition>
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script setup lang="ts">
    import {ref, reactive, watch, onMounted, computed} from 'vue';
    import {
        mdiCalculator,
        mdiCubeOutline,
        mdiWall,
        mdiGrid,
        mdiHomeOutline,
        mdiOfficeBuilding,
        mdiPackageVariant,
        mdiTruckCargoContainer,
        mdiDotsGrid,
        mdiWater,
        mdiCheckCircle,
        mdiTexture,
        mdiFormatPaint,
        mdiRuler,
        mdiHomeCity,
    } from '@mdi/js';
    import {calculateConcrete, calculateWall, calculateTiling, calculateRoom} from '@/services/calculatorEngine';

    const tab = ref('room');

    type BrickKey = 'adobito' | '6_holes';

    const brickOptions = [
        {
            title: 'Ladrillo Adobito',
            sub: '10×5×21 cm (~68 un/m²)',
            value: 'adobito' as BrickKey,
            image: '/images/ladrillo_adobito.png',
            icon: mdiWall,
        },
        {
            title: 'Ladrillo 6 Huecos',
            sub: '10×15×24 cm (~24 un/m²)',
            value: '6_holes' as BrickKey,
            image: '/images/ladrillo_6_huecos.png',
            icon: mdiWall,
        },
    ];

    // Datos para Cuarto Completo
    const roomData = reactive<{
        lengthM: number;
        widthM: number;
        heightM: number;
        openingsM2: number;
        brickType: BrickKey;
    }>({
        lengthM: 4,
        widthM: 4,
        heightM: 3,
        openingsM2: 4,
        brickType: '6_holes',
    });

    const selectedBrickTitle = computed(() => {
        const item = brickOptions.find((b) => b.value === roomData.brickType);
        return item ? item.title : 'Ladrillo';
    });

    const selectedWallBrickTitle = computed(() => {
        const item = brickOptions.find((b) => b.value === walls.brickType);
        return item ? item.title : 'Ladrillo';
    });

    // Dimensiones de hormigón en metros/cm
    const concreteDimensions = reactive({
        length: 5,
        width: 4,
        thickness: 10,
    });

    const concrete = reactive<{volume: number; proportion: '1:2:3' | '1:2:4'}>({
        volume: 2.0,
        proportion: '1:2:3',
    });

    const updateConcreteVolumeFromDimensions = () => {
        const vol = (concreteDimensions.length || 0) * (concreteDimensions.width || 0) * ((concreteDimensions.thickness || 0) / 100);
        concrete.volume = Number(vol.toFixed(2));
        calcConcrete();
    };

    // Dimensiones de paredes en metros
    const wallDimensions = reactive({
        length: 10,
        height: 2.5,
    });

    const walls = reactive<{area: number; brickType: BrickKey}>({
        area: 25,
        brickType: '6_holes',
    });

    const updateWallAreaFromDimensions = () => {
        const area = (wallDimensions.length || 0) * (wallDimensions.height || 0);
        walls.area = Number(area.toFixed(2));
        calcWall();
    };

    // Dimensiones de pisos en metros y cerámica en cm
    const tileDimensions = reactive({
        length: 6,
        width: 5,
    });

    const tiles = reactive({
        area: 30,
        tileWidthCm: 40,
        tileHeightCm: 40,
    });

    const updateTileAreaFromDimensions = () => {
        const area = (tileDimensions.length || 0) * (tileDimensions.width || 0);
        tiles.area = Number(area.toFixed(2));
        calcTiles();
    };

    const TILE_PRESETS = [
        {label: '30x30', w: 30, h: 30},
        {label: '40x40', w: 40, h: 40},
        {label: '50x50', w: 50, h: 50},
        {label: '60x60', w: 60, h: 60},
        {label: '60x120', w: 60, h: 120},
        {label: 'Otro', w: 40, h: 40},
    ];

    const selectedTilePreset = ref('40x40');

    const selectTilePreset = (preset: {label: string; w: number; h: number}) => {
        selectedTilePreset.value = preset.label;
        if (preset.label !== 'Otro') {
            tiles.tileWidthCm = preset.w;
            tiles.tileHeightCm = preset.h;
        }
        calcTiles();
    };

    const results = reactive({
        room: null as any,
        concrete: null as any,
        walls: null as any,
        tiles: null as any,
    });

    const calcRoom = () => {
        results.room = calculateRoom(
            roomData.lengthM,
            roomData.widthM,
            roomData.heightM,
            roomData.brickType as any,
            roomData.openingsM2,
            true,
            true,
            1.0,
        );
    };

    const calcConcrete = () => {
        results.concrete = calculateConcrete(concrete.volume, concrete.proportion as any, 1.0);
    };

    const calcWall = () => {
        results.walls = calculateWall(walls.area, walls.brickType as any, '1:4', 1.0);
    };

    const calcTiles = () => {
        results.tiles = calculateTiling(tiles.area, 1.0, tiles.tileWidthCm, tiles.tileHeightCm);
    };

    onMounted(() => {
        calcRoom();
        updateConcreteVolumeFromDimensions();
        updateWallAreaFromDimensions();
        updateTileAreaFromDimensions();
    });
</script>
