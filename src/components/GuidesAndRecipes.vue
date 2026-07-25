<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title class="text-primary font-weight-bold">
        <v-icon :icon="mdiBookOpenPageVariant" start />
        Manual Técnico y Recetario
      </v-card-title>
      
      <v-expansion-panels variant="accordion" class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-title class="text-secondary font-weight-bold">
            <v-icon :icon="mdiFormatPaint" start /> Hormigón 1:2:3 (Regla Práctica)
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Por cada bolsa de cemento (50kg), usar:</p>
            <ul>
              <li><strong>Arena:</strong> 3.5 a 4 baldes (20L) o 2 carretillas.</li>
              <li><strong>Grava/Cascajo:</strong> 5.5 a 6 baldes o 3 carretillas.</li>
              <li><strong>Agua:</strong> 1 a 1.2 baldes (aprox 20-25 Litros).</li>
            </ul>
            <v-alert type="info" variant="tonal" class="mt-3">
              Usar poca agua garantiza mayor resistencia. El hormigón no debe "escurrir" como sopa.
            </v-alert>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title class="text-secondary font-weight-bold">
            <v-icon :icon="mdiTimerSand" start /> Tiempos de Desencofrado
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <ul>
              <li><strong>Columnas y muros:</strong> 24 a 48 horas.</li>
              <li><strong>Vigas (costados):</strong> 24 a 48 horas.</li>
              <li><strong>Vigas (fondo) y Losas:</strong> 21 a 28 días (o 14 días con aditivos acelerantes).</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title class="text-secondary font-weight-bold">
            <v-icon :icon="mdiWaterOutline" start /> Curado e Hidratación
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>El hormigón requiere agua para alcanzar su resistencia de diseño.</p>
            <ul>
              <li>Debe mojarse abundantemente por al menos <strong>7 días consecutivos</strong>.</li>
              <li>En climas muy cálidos, mojar 2 a 3 veces al día o usar membranas de curado.</li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { 
  mdiBookOpenPageVariant, 
  mdiFormatPaint, 
  mdiTimerSand, 
  mdiWaterOutline 
} from '@mdi/js'
</script>
