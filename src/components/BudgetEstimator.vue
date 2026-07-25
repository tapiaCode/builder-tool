<template>
  <v-container class="py-4">
    <!-- Header Banner -->
    <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-accent">
      <v-card-text class="pa-5">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-overline text-accent font-weight-bold tracking-wider">FINANZAS & PRECIOS</div>
            <h2 class="text-h5 font-weight-black text-on-surface mb-1">Estimador de Presupuesto</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">Calcula y desglosa el costo estimado de la obra</p>
          </div>
          <v-avatar color="accent" size="52" class="elevation-4">
            <v-icon :icon="mdiCurrencyUsd" size="28" color="white" />
          </v-avatar>
        </div>
      </v-card-text>
    </v-card>

    <v-row density="comfortable">
      <!-- Form Input Column -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon :icon="mdiCashMultiple" color="primary" class="mr-2" />
              Precios Unitarios Locales
            </h3>
            <v-btn size="x-small" color="primary" variant="text" @click="resetDefaults">
              <v-icon :icon="mdiRefresh" start /> Restablecer
            </v-btn>
          </div>

          <v-row density="compact">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="prices.cement"
                label="Bolsa Cemento (50kg)"
                prefix="$"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="prices.sand"
                label="Arena por m³"
                prefix="$"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="prices.gravel"
                label="Grava por m³"
                prefix="$"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="prices.brick"
                label="Ladrillo (por 1000 un.)"
                prefix="$"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="prices.labor"
                label="Mano de Obra (Global Estimada)"
                prefix="$"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="6">
              <v-btn color="primary" block class="rounded-lg font-weight-bold" @click="calculateTotal">
                <v-icon :icon="mdiCalculator" start /> Actualizar
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="secondary" block variant="tonal" class="rounded-lg font-weight-bold" @click="exportData">
                <v-icon :icon="mdiExportVariant" start /> Exportar
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Chart & Total Column -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4 text-center">
          <div class="text-overline text-medium-emphasis font-weight-bold">PRESUPUESTO TOTAL ESTIMADO</div>
          <div class="text-h3 font-weight-black text-primary my-1">${{ totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          
          <v-divider class="my-4" />

          <h4 class="text-subtitle-2 font-weight-bold text-medium-emphasis mb-3">DESGLOSE DE GASTOS (%)</h4>
          
          <div class="chart-container mx-auto" style="position: relative; height: 220px; width: 100%; max-width: 280px;">
            <Doughnut v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
          </div>

          <div class="d-flex justify-center flex-wrap gap-2 mt-4">
            <v-chip size="small" color="primary" variant="flat" class="ma-1">
              Material Pesado: ${{ breakdown.material.toFixed(0) }}
            </v-chip>
            <v-chip size="small" color="accent" variant="flat" class="ma-1">
              Acabados: ${{ breakdown.finishes.toFixed(0) }}
            </v-chip>
            <v-chip size="small" color="success" variant="flat" class="ma-1">
              Mano de Obra: ${{ breakdown.labor.toFixed(0) }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar / Toast Notification -->
    <v-snackbar v-model="snackbar" :timeout="3000" color="success" rounded="pill" location="bottom center">
      <v-icon :icon="mdiCheckCircle" start /> {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { 
  mdiCurrencyUsd, 
  mdiCashMultiple, 
  mdiExportVariant, 
  mdiRefresh, 
  mdiCalculator,
  mdiCheckCircle 
} from '@mdi/js'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const snackbar = ref(false)
const snackbarText = ref('')

const defaultPrices = {
  cement: 8.50,
  sand: 15.00,
  gravel: 18.00,
  brick: 120.00,
  labor: 500.00
}

const prices = reactive({ ...defaultPrices })
const totalCost = ref(0)
const breakdown = reactive({ material: 0, finishes: 0, labor: 0 })

const chartData = ref<any>({
  labels: ['Material Pesado', 'Acabados', 'Mano de Obra'],
  datasets: [{
    data: [0, 0, 0],
    backgroundColor: ['#FF6B00', '#38BDF8', '#34D399'],
    borderWidth: 0
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#94A3B8',
        font: { family: 'Plus Jakarta Sans', size: 12 }
      }
    }
  },
  cutout: '70%'
}

const calculateTotal = () => {
  const mat = (prices.cement * 40) + (prices.sand * 8) + (prices.gravel * 10) + (prices.brick * 1.5)
  const fin = mat * 0.25
  const lab = prices.labor

  breakdown.material = mat
  breakdown.finishes = fin
  breakdown.labor = lab
  totalCost.value = mat + fin + lab
  
  chartData.value = {
    labels: ['Material Pesado', 'Acabados', 'Mano de Obra'],
    datasets: [{
      data: [mat, fin, lab],
      backgroundColor: ['#FF6B00', '#38BDF8', '#34D399'],
      borderWidth: 0
    }]
  }
}

const resetDefaults = () => {
  Object.assign(prices, defaultPrices)
  calculateTotal()
}

watch(prices, (newPrices) => {
  localStorage.setItem('obrakit_prices', JSON.stringify(newPrices))
  calculateTotal()
}, { deep: true })

const exportData = async () => {
  const text = `🚧 PRESUPUESTO OBRAKIT 🚧\n` +
    `Total Estimado: $${totalCost.value.toFixed(2)}\n\n` +
    `Desglose:\n` +
    `- Cemento: $${prices.cement}/bolsa\n` +
    `- Arena: $${prices.sand}/m³\n` +
    `- Grava: $${prices.gravel}/m³\n` +
    `- Ladrillo: $${prices.brick}/mil\n` +
    `- Mano Obra: $${prices.labor}\n\n` +
    `Generado offline por ObraKit.`;
  
  try {
    await navigator.clipboard.writeText(text)
    snackbarText.value = '¡Resumen copiado al portapapeles!'
    snackbar.value = true
  } catch (err) {
    snackbarText.value = 'Error al copiar'
    snackbar.value = true
  }
}

onMounted(() => {
  const saved = localStorage.getItem('obrakit_prices')
  if (saved) {
    try {
      Object.assign(prices, JSON.parse(saved))
    } catch (e) {}
  }
  calculateTotal()
})
</script>
