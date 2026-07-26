<template>
  <v-container class="py-4">
    <!-- Header Banner -->
    <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-success">
      <v-card-text class="pa-5">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-overline text-success font-weight-bold tracking-wider">MANUAL DEL ALBAÑIL</div>
            <h2 class="text-h5 font-weight-black text-on-surface mb-1">Guías & Recetario Técnico</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">Reglas prácticas en baldes y carretillas por bolsa de cemento</p>
          </div>
          <v-avatar color="success" size="52" class="elevation-4">
            <v-icon :icon="mdiBookOpenPageVariant" size="28" color="white" />
          </v-avatar>
        </div>
      </v-card-text>
    </v-card>

    <!-- Interactive Quick Mixer Calculator -->
    <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
      <h3 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
        <v-icon :icon="mdiFilterVariant" color="primary" class="mr-2" />
        Calculadora Rápida por Bolsa de Cemento
      </h3>
      <p class="text-caption text-medium-emphasis mb-3">Calcula cuántas carretillas y baldes necesitas según las bolsas que vayas a mezclar:</p>

      <v-row density="compact" align="center">
        <v-col cols="6" sm="4">
          <v-text-field
            v-model.number="bagsCount"
            label="Bolsas de Cemento"
            type="number"
            min="1"
            max="100"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-2"
          />
        </v-col>
        <v-col cols="6" sm="8">
          <v-chip-group v-model="bagsCount" mandatory color="primary">
            <v-chip :value="1" filter size="small">1 Bolsa</v-chip>
            <v-chip :value="2" filter size="small">2 Bolsas</v-chip>
            <v-chip :value="5" filter size="small">5 Bolsas</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-divider class="my-3" />

      <!-- Calculated Equivalents -->
      <v-row density="compact">
        <v-col cols="6" sm="3">
          <v-card class="pa-3 rounded-lg stat-card-gradient-primary text-center">
            <v-icon :icon="mdiBucketOutline" color="primary" class="mb-1" />
            <div class="text-h6 font-weight-bold">{{ bagsCount * 4 }}</div>
            <div class="text-caption text-medium-emphasis">Latas Arena (20L)</div>
            <v-chip size="x-small" color="primary" class="mt-1">~{{ (bagsCount * 2).toFixed(1) }} Carretillas</v-chip>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="pa-3 rounded-lg stat-card-gradient-accent text-center">
            <v-icon :icon="mdiDotsGrid" color="accent" class="mb-1" />
            <div class="text-h6 font-weight-bold">{{ bagsCount * 6 }}</div>
            <div class="text-caption text-medium-emphasis">Latas Ripio (20L)</div>
            <v-chip size="x-small" color="accent" class="mt-1">~{{ (bagsCount * 3).toFixed(1) }} Carretillas</v-chip>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="pa-3 rounded-lg stat-card-gradient-success text-center">
            <v-icon :icon="mdiWater" color="info" class="mb-1" />
            <div class="text-h6 font-weight-bold">{{ bagsCount * 1.2 }}</div>
            <div class="text-caption text-medium-emphasis">Latas Agua (20L)</div>
            <v-chip size="x-small" color="info" class="mt-1">~{{ bagsCount * 24 }} Litros</v-chip>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="pa-3 rounded-lg border-0 bg-surface-variant text-center">
            <v-icon :icon="mdiCheckDecagram" color="success" class="mb-1" />
            <div class="text-h6 font-weight-bold text-success">1:2:3</div>
            <div class="text-caption text-medium-emphasis">Proporción Fuerte</div>
            <v-chip size="x-small" color="success" class="mt-1">Estructural</v-chip>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Accordion Technical Cards -->
    <v-expansion-panels variant="popout" class="rounded-xl">
      <!-- PANEL 1 -->
      <v-expansion-panel class="rounded-xl mb-2">
        <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
          <v-icon :icon="mdiFormatPaint" color="primary" class="mr-3" />
          Reglas de Mezcla por Bolsa de 50kg
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" lines="two">
            <v-list-item>
              <template #prepend>
                <v-avatar color="primary" variant="tonal" size="36">
                  <span class="font-weight-bold">1</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">Hormigón Estructural (1 : 2 : 3)</v-list-item-title>
              <v-list-item-subtitle>1 bolsa cemento + 4 latas arena + 6 latas ripio + 1.2 latas agua.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-avatar color="accent" variant="tonal" size="36">
                  <span class="font-weight-bold">2</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">Mortero Asentado Muro (1 : 4)</v-list-item-title>
              <v-list-item-subtitle>1 bolsa cemento + 6 latas arena fina/corriente + 1.5 latas agua.</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- PANEL 2 -->
      <v-expansion-panel class="rounded-xl mb-2">
        <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
          <v-icon :icon="mdiTimerSand" color="warning" class="mr-3" />
          Tiempos Mínimos de Desencofrado
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-timeline density="compact" align="start">
            <v-timeline-item dot-color="warning" size="x-small">
              <div class="font-weight-bold">24 a 48 Horas</div>
              <div class="text-caption text-medium-emphasis">Costados de vigas, columnas y muros sin carga.</div>
            </v-timeline-item>
            <v-timeline-item dot-color="primary" size="x-small">
              <div class="font-weight-bold">14 Días</div>
              <div class="text-caption text-medium-emphasis">Fondos de losas y puntales secundarios.</div>
            </v-timeline-item>
            <v-timeline-item dot-color="success" size="x-small">
              <div class="font-weight-bold">21 a 28 Días</div>
              <div class="text-caption text-medium-emphasis">Fondos de vigas principales y elementos estructurales pesados.</div>
            </v-timeline-item>
          </v-timeline>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- PANEL 3 -->
      <v-expansion-panel class="rounded-xl mb-2">
        <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
          <v-icon :icon="mdiWaterOutline" color="info" class="mr-3" />
          Buenas Prácticas de Curado e Hidratación
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-alert type="info" variant="tonal" border="start" class="mb-3">
            <strong>¡Atención!</strong> El hormigón no se "seca", se <strong>hidrata</strong> químicamente para ganar firmeza.
          </v-alert>
          <ul class="text-body-2 pl-4">
            <li class="mb-1">Regar abundantemente durante al menos <strong>7 días continuos</strong>.</li>
            <li class="mb-1">En días soleados o con viento, regar 3 a 4 veces al día o cubrir con yute/plástico.</li>
            <li>Un curado deficiente reduce la resistencia hasta en un <strong>50%</strong>.</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  mdiBookOpenPageVariant, 
  mdiFilterVariant, 
  mdiBucketOutline, 
  mdiDotsGrid, 
  mdiWater, 
  mdiCheckDecagram,
  mdiFormatPaint,
  mdiTimerSand,
  mdiWaterOutline
} from '@mdi/js'

const bagsCount = ref(1)
</script>
