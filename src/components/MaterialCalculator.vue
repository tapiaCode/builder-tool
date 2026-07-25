<template>
  <v-container class="py-4">
    <!-- Header Banner -->
    <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-primary">
      <v-card-text class="pa-5">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-overline text-primary font-weight-bold tracking-wider">MOTOR DE CÁLCULO</div>
            <h2 class="text-h5 font-weight-black text-on-surface mb-1">Calculadora de Materiales</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">Dosificación exacta en bolsas, carretillas y volquetas</p>
          </div>
          <v-avatar color="primary" size="52" class="elevation-4 pulse-badge">
            <v-icon :icon="mdiCalculator" size="28" color="white" />
          </v-avatar>
        </div>
      </v-card-text>
    </v-card>

    <!-- Navigation Tabs -->
    <v-card class="rounded-xl border-0 elevation-2 mb-4">
      <v-tabs v-model="tab" color="primary" grow align-tabs="center" class="pa-1">
        <v-tab value="concrete" class="rounded-lg text-none font-weight-bold">
          <v-icon :icon="mdiCubeOutline" class="mr-2" /> Hormigón
        </v-tab>
        <v-tab value="walls" class="rounded-lg text-none font-weight-bold">
          <v-icon :icon="mdiWall" class="mr-2" /> Muros
        </v-tab>
        <v-tab value="tiles" class="rounded-lg text-none font-weight-bold">
          <v-icon :icon="mdiGrid" class="mr-2" /> Pisos
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- Waste Factor Selector -->
    <v-card class="pa-3 rounded-xl border-0 elevation-1 mb-4">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-caption font-weight-bold text-medium-emphasis">FACTOR DE DESPERDICIO</span>
        <v-chip size="x-small" color="primary" variant="flat">{{ (wasteFactor * 100 - 100).toFixed(0) }}% Extra</v-chip>
      </div>
      <v-chip-group v-model="wasteFactor" mandatory color="primary" class="d-flex justify-space-between">
        <v-chip v-for="factor in WASTE_FACTORS" :key="factor.value" :value="factor.value" filter variant="tonal" class="flex-grow-1 text-center justify-center">
          {{ factor.label }}
        </v-chip>
      </v-chip-group>
    </v-card>

    <!-- Main Content Tabs -->
    <v-window v-model="tab">
      <!-- HORMIGÓN -->
      <v-window-item value="concrete">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon :icon="mdiCubeOutline" color="primary" class="mr-2" />
            Dimensiones & Dosificación
          </h3>
          
          <v-row density="compact">
            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 text-medium-emphasis">Volumen total (m³)</span>
                <span class="text-h6 font-weight-bold text-primary">{{ concrete.volume }} m³</span>
              </div>
              <v-slider
                v-model="concrete.volume"
                :min="0.5"
                :max="50"
                :step="0.5"
                color="primary"
                track-color="surface-variant"
                thumb-label
                class="mt-1"
                @update:model-value="calcConcrete"
              />
            </v-col>
          </v-row>

          <div class="text-caption font-weight-bold text-medium-emphasis mb-2">TIPO DE ELEMENTO / PROPORCIÓN</div>
          <v-row density="compact">
            <v-col cols="6">
              <v-card
                class="pa-3 rounded-lg text-center interactive-select-card"
                :class="{ selected: concrete.proportion === '1:2:3' }"
                @click="concrete.proportion = '1:2:3'; calcConcrete()"
              >
                <v-icon :icon="mdiHomeOutline" color="primary" class="mb-1" />
                <div class="font-weight-bold text-body-2">1:2:3 (Estructural)</div>
                <div class="text-caption text-medium-emphasis">Vigas y Columnas</div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card
                class="pa-3 rounded-lg text-center interactive-select-card"
                :class="{ selected: concrete.proportion === '1:2:4' }"
                @click="concrete.proportion = '1:2:4'; calcConcrete()"
              >
                <v-icon :icon="mdiOfficeBuilding" color="accent" class="mb-1" />
                <div class="font-weight-bold text-body-2">1:2:4 (Ciclópeo)</div>
                <div class="text-caption text-medium-emphasis">Zapatas y Cimientos</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Results Concrete -->
        <v-expand-transition>
          <div v-if="results.concrete">
            <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
              <v-icon :icon="mdiCheckCircle" color="success" class="mr-2" />
              Resultado de Dosificación
            </h3>

            <v-row density="compact">
              <v-col cols="6" sm="3">
                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-primary text-center">
                  <v-icon :icon="mdiPackageVariant" size="28" color="primary" class="mb-1" />
                  <div class="text-h5 font-weight-black">{{ results.concrete.cementBags }}</div>
                  <div class="text-caption text-medium-emphasis">Bolsas Cemento</div>
                  <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">50 kg c/u</v-chip>
                </v-card>
              </v-col>

              <v-col cols="6" sm="3">
                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-accent text-center">
                  <v-icon :icon="mdiTruckCargoContainer" size="28" color="accent" class="mb-1" />
                  <div class="text-h5 font-weight-black">{{ results.concrete.sandM3 }} <span class="text-caption">m³</span></div>
                  <div class="text-caption text-medium-emphasis">Arena Fina/Gruesa</div>
                  <v-chip size="x-small" color="accent" variant="tonal" class="mt-1">~{{ results.concrete.sandWheelbarrows }} Carretillas</v-chip>
                </v-card>
              </v-col>

              <v-col cols="6" sm="3">
                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-primary text-center">
                  <v-icon :icon="mdiDotsGrid" size="28" color="warning" class="mb-1" />
                  <div class="text-h5 font-weight-black">{{ results.concrete.gravelM3 }} <span class="text-caption">m³</span></div>
                  <div class="text-caption text-medium-emphasis">Grava / Cascajo</div>
                  <v-chip size="x-small" color="warning" variant="tonal" class="mt-1">~{{ results.concrete.gravelWheelbarrows }} Carretillas</v-chip>
                </v-card>
              </v-col>

              <v-col cols="6" sm="3">
                <v-card class="pa-3 rounded-xl border-0 stat-card-gradient-success text-center">
                  <v-icon :icon="mdiWater" size="28" color="info" class="mb-1" />
                  <div class="text-h5 font-weight-black">{{ results.concrete.waterL }} <span class="text-caption">L</span></div>
                  <div class="text-caption text-medium-emphasis">Agua Limpia</div>
                  <v-chip size="x-small" color="info" variant="tonal" class="mt-1">~{{ Math.ceil(results.concrete.waterL / 20) }} Baldes 20L</v-chip>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-window-item>

      <!-- MUROS -->
      <v-window-item value="walls">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon :icon="mdiWall" color="primary" class="mr-2" />
            Superficie & Tipo de Ladrillo
          </h3>
          
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-body-2 text-medium-emphasis">Área de Muro (m²)</span>
            <span class="text-h6 font-weight-bold text-primary">{{ walls.area }} m²</span>
          </div>
          <v-slider
            v-model="walls.area"
            :min="1"
            :max="200"
            :step="1"
            color="primary"
            thumb-label
            class="mt-1"
            @update:model-value="calcWall"
          />

          <div class="text-caption font-weight-bold text-medium-emphasis mb-2">SELECCIONAR LADRILLO</div>
          <v-row density="compact">
            <v-col v-for="brick in brickOptions" :key="brick.value" cols="6">
              <v-card
                class="pa-3 rounded-lg text-center interactive-select-card"
                :class="{ selected: walls.brickType === brick.value }"
                @click="walls.brickType = brick.value; calcWall()"
              >
                <v-icon :icon="brick.icon" color="primary" class="mb-1" />
                <div class="font-weight-bold text-caption">{{ brick.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ brick.sub }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <v-expand-transition>
          <div v-if="results.walls">
            <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
              <v-icon :icon="mdiCheckCircle" color="success" class="mr-2" />
              Materiales para Muro
            </h3>

            <v-row density="compact">
              <v-col cols="6">
                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-primary text-center">
                  <v-icon :icon="mdiWall" size="32" color="primary" class="mb-1" />
                  <div class="text-h4 font-weight-black text-primary">{{ results.walls.totalBricks }}</div>
                  <div class="text-caption font-weight-bold text-medium-emphasis">Unidades de Ladrillo</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-accent text-center">
                  <v-icon :icon="mdiPackageVariant" size="32" color="accent" class="mb-1" />
                  <div class="text-h4 font-weight-black text-accent">{{ results.walls.cementBags }}</div>
                  <div class="text-caption font-weight-bold text-medium-emphasis">Bolsas Cemento (Mortero)</div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-window-item>

      <!-- PISOS -->
      <v-window-item value="tiles">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon :icon="mdiGrid" color="primary" class="mr-2" />
            Superficie a Revestir
          </h3>
          
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-body-2 text-medium-emphasis">Área total (m²)</span>
            <span class="text-h6 font-weight-bold text-primary">{{ tiles.area }} m²</span>
          </div>
          <v-slider
            v-model="tiles.area"
            :min="1"
            :max="150"
            :step="1"
            color="primary"
            thumb-label
            class="mt-1"
            @update:model-value="calcTiles"
          />
        </v-card>

        <v-expand-transition>
          <div v-if="results.tiles">
            <v-row density="compact">
              <v-col cols="6">
                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-primary text-center">
                  <v-icon :icon="mdiTexture" size="32" color="primary" class="mb-1" />
                  <div class="text-h4 font-weight-black text-primary">{{ results.tiles.glueBags20kg }}</div>
                  <div class="text-caption font-weight-bold text-medium-emphasis">Bolsas Cemento Cola (20kg)</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-4 rounded-xl border-0 stat-card-gradient-success text-center">
                  <v-icon :icon="mdiFormatPaint" size="32" color="success" class="mb-1" />
                  <div class="text-h4 font-weight-black text-success">{{ results.tiles.groutBags1kg }}</div>
                  <div class="text-caption font-weight-bold text-medium-emphasis">Bolsas Fragua / Pastina (1kg)</div>
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
import { ref, reactive, watch, onMounted } from 'vue'
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
  mdiFormatPaint
} from '@mdi/js'
import { calculateConcrete, calculateWall, calculateTiling } from '@/services/calculatorEngine'
import { WASTE_FACTORS } from '@/constants/constructionData'

const tab = ref('concrete')
const wasteFactor = ref(1.05)

const concrete = reactive({ volume: 5, proportion: '1:2:3' as const })
const walls = reactive({ area: 25, brickType: '6_holes_soga' as const })
const tiles = reactive({ area: 30 })

const results = reactive({
  concrete: null as any,
  walls: null as any,
  tiles: null as any
})

const brickOptions = [
  { title: '6 Huecos Soga', sub: '~40 un/m²', value: '6_holes_soga', icon: mdiWall },
  { title: '6 Huecos Tizón', sub: '~70 un/m²', value: '6_holes_tizón', icon: mdiWall },
  { title: '18 Huecos Visto', sub: '~36 un/m²', value: '18_holes', icon: mdiDotsGrid },
  { title: 'Bloque Hormigón', sub: '~12.5 un/m²', value: 'block', icon: mdiCubeOutline }
]

const calcConcrete = () => {
  results.concrete = calculateConcrete(concrete.volume, concrete.proportion as any, wasteFactor.value)
}

const calcWall = () => {
  results.walls = calculateWall(walls.area, walls.brickType as any, '1:4', wasteFactor.value)
}

const calcTiles = () => {
  results.tiles = calculateTiling(tiles.area, wasteFactor.value)
}

watch([wasteFactor], () => {
  calcConcrete()
  calcWall()
  calcTiles()
})

onMounted(() => {
  calcConcrete()
  calcWall()
  calcTiles()
})
</script>
