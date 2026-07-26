<template>
  <v-container class="py-4">
    <!-- Header Banner -->
    <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-accent">
      <v-card-text class="pa-5">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-overline text-accent font-weight-bold tracking-wider">PRESUPUESTO DE OBRA — BOLIVIA (BOB)</div>
            <h2 class="text-h5 font-weight-black text-on-surface mb-1">Estimador de Presupuesto</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">Precios referenciales de materiales y mano de obra en Bolivianos (Bs.)</p>
          </div>
          <v-avatar color="accent" size="52" class="elevation-4">
            <v-icon :icon="mdiCashMultiple" size="28" color="white" />
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
              Precios por Material (Mercado Boliviano)
            </h3>
            <v-btn size="x-small" color="primary" variant="text" @click="resetDefaults">
              <v-icon :icon="mdiRefresh" start /> Restablecer
            </v-btn>
          </div>

          <v-row density="compact">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="prices.cement"
                label="Bolsa Cemento IP-30/40 (50kg)"
                prefix="Bs."
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
                label="Arena Corriente / Fina (por m³)"
                prefix="Bs."
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
                label="Grava / Chispa de Río (por m³)"
                prefix="Bs."
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
                label="Ladrillo Gambote 6H (Mil un.)"
                prefix="Bs."
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
                label="Mano de Obra (Contrato o Trabajo Global)"
                prefix="Bs."
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
          <div class="text-overline text-medium-emphasis font-weight-bold">COSTO TOTAL ESTIMADO DE LA OBRA</div>
          <div class="text-h3 font-weight-black text-primary my-1">Bs. {{ totalCost.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} BOB</div>
          
          <v-divider class="my-4" />

          <h4 class="text-subtitle-2 font-weight-bold text-medium-emphasis mb-3">DESGLOSE DEL GASTO (%)</h4>
          
          <div class="chart-container mx-auto" style="position: relative; height: 220px; width: 100%; max-width: 280px;">
            <Doughnut v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
          </div>

          <div class="d-flex justify-center flex-wrap gap-2 mt-4">
            <v-chip size="small" color="primary" variant="flat" class="ma-1">
              Material Brutal/Pesado: Bs. {{ breakdown.material.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </v-chip>
            <v-chip size="small" color="accent" variant="flat" class="ma-1">
              Acabados: Bs. {{ breakdown.finishes.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </v-chip>
            <v-chip size="small" color="success" variant="flat" class="ma-1">
              Mano de Obra: Bs. {{ breakdown.labor.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
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

// Precios de referencia reales en Bolivia (BOB)
const defaultPrices = {
  cement: 55.00,   // Bolsa de 50kg (IP-30 / Viacha / Fancesa / Warnes / Coboce)
  sand: 120.00,    // Arena por m³
  gravel: 130.00,  // Grava / Chispa por m³
  brick: 1750.00,  // Ladrillo gambote 6 huecos (Mil unidades)
  labor: 3500.00   // Mano de obra global estimada
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
  const text = `🚧 PRESUPUESTO OBRAKIT (BOLIVIA - BOB) 🚧\n` +
    `Total Estimado: Bs. ${totalCost.value.toFixed(2)} BOB\n\n` +
    `Desglose de Materiales y Costos:\n` +
    `- Cemento IP-30/40: Bs. ${prices.cement}/bolsa (50kg)\n` +
    `- Arena Corriente/Fina: Bs. ${prices.sand}/m³\n` +
    `- Grava / Chispa: Bs. ${prices.gravel}/m³\n` +
    `- Ladrillo Gambote 6H: Bs. ${prices.brick}/mil unidades\n` +
    `- Mano de Obra: Bs. ${prices.labor}\n\n` +
    `Generado con términos y unidades reales de obra en Bolivia por ObraKit.`;
  
  try {
    await navigator.clipboard.writeText(text)
    snackbarText.value = '¡Resumen de obra copiado al portapapeles!'
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
      const parsed = JSON.parse(saved)
      if (parsed.cement && parsed.cement < 20) {
        Object.assign(prices, defaultPrices)
      } else {
        Object.assign(prices, parsed)
      }
    } catch (e) {}
  }
  calculateTotal()
})
</script>
