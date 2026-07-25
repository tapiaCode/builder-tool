<template>
  <v-container>
    <v-card class="mb-4" elevation="2">
      <v-card-title class="text-primary font-weight-bold">
        <v-icon :icon="mdiCalculator" start />
        Calculadora de Materiales
      </v-card-title>
      
      <v-tabs v-model="tab" bg-color="primary" dark>
        <v-tab value="concrete">Hormigón</v-tab>
        <v-tab value="walls">Muros</v-tab>
        <v-tab value="tiles">Pisos</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <!-- HORMIGÓN -->
          <v-window-item value="concrete">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="concrete.volume"
                  label="Volumen a vaciar (m³)"
                  type="number"
                  variant="outlined"
                  suffix="m³"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="concrete.proportion"
                  :items="['1:2:3', '1:2:4']"
                  label="Dosificación (C:A:G)"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-btn color="primary" block @click="calcConcrete" class="mt-2">Calcular Hormigón</v-btn>

            <v-expand-transition>
              <div v-if="results.concrete" class="mt-4">
                <h3 class="text-secondary mb-2">Material Requerido:</h3>
                <v-chip color="secondary" class="ma-1">Cemento: {{ results.concrete.cementBags }} bolsas (50kg)</v-chip>
                <v-chip color="secondary" class="ma-1">Arena: {{ results.concrete.sandM3 }} m³ ({{ results.concrete.sandWheelbarrows }} carretillas)</v-chip>
                <v-chip color="secondary" class="ma-1">Grava: {{ results.concrete.gravelM3 }} m³ ({{ results.concrete.gravelWheelbarrows }} carretillas)</v-chip>
                <v-chip color="info" class="ma-1">Agua: {{ results.concrete.waterL }} Litros</v-chip>
              </div>
            </v-expand-transition>
          </v-window-item>

          <!-- MUROS -->
          <v-window-item value="walls">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="walls.area"
                  label="Área del Muro (m²)"
                  type="number"
                  variant="outlined"
                  suffix="m²"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="walls.brickType"
                  :items="brickOptions"
                  item-title="title"
                  item-value="value"
                  label="Tipo de Ladrillo"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-btn color="primary" block @click="calcWall" class="mt-2">Calcular Muro</v-btn>

            <v-expand-transition>
              <div v-if="results.walls" class="mt-4">
                <h3 class="text-secondary mb-2">Material Requerido:</h3>
                <v-chip color="accent" class="ma-1">Ladrillos: {{ results.walls.totalBricks }} un.</v-chip>
                <v-chip color="secondary" class="ma-1">Cemento: {{ results.walls.cementBags }} bolsas</v-chip>
                <v-chip color="secondary" class="ma-1">Arena: {{ results.walls.sandM3 }} m³</v-chip>
                <v-chip color="info" class="ma-1">Agua: {{ results.walls.waterL }} Litros</v-chip>
              </div>
            </v-expand-transition>
          </v-window-item>

          <!-- PISOS -->
          <v-window-item value="tiles">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="tiles.area"
                  label="Área del Piso (m²)"
                  type="number"
                  variant="outlined"
                  suffix="m²"
                />
              </v-col>
            </v-row>
            <v-btn color="primary" block @click="calcTiles" class="mt-2">Calcular Cerámica</v-btn>

            <v-expand-transition>
              <div v-if="results.tiles" class="mt-4">
                <h3 class="text-secondary mb-2">Material Requerido:</h3>
                <v-chip color="accent" class="ma-1">Cemento Cola: {{ results.tiles.glueBags20kg }} bolsas (20kg)</v-chip>
                <v-chip color="secondary" class="ma-1">Fragua/Pastina: {{ results.tiles.groutBags1kg }} bolsas (1kg)</v-chip>
              </div>
            </v-expand-transition>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { mdiCalculator } from '@mdi/js'
import { calculateConcrete, calculateWall, calculateTiling } from '@/services/calculatorEngine'

const tab = ref('concrete')

const concrete = reactive({ volume: 1, proportion: '1:2:3' as const })
const walls = reactive({ area: 10, brickType: '6_holes_soga' as const })
const tiles = reactive({ area: 10 })

const results = reactive({
  concrete: null as any,
  walls: null as any,
  tiles: null as any
})

const brickOptions = [
  { title: 'Ladrillo 6 huecos (Soga)', value: '6_holes_soga' },
  { title: 'Ladrillo 18 huecos', value: '18_holes' },
  { title: 'Bloque Hormigón', value: 'block' }
]

const calcConcrete = () => {
  results.concrete = calculateConcrete(concrete.volume, concrete.proportion as any)
}

const calcWall = () => {
  results.walls = calculateWall(walls.area, walls.brickType as any)
}

const calcTiles = () => {
  results.tiles = calculateTiling(tiles.area)
}
</script>
