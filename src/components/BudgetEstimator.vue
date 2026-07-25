<template>
  <v-container>
    <v-card elevation="2" class="mb-4">
      <v-card-title class="text-primary font-weight-bold">
        <v-icon :icon="mdiCurrencyUsd" start />
        Estimador de Presupuesto
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-secondary mb-3">Precios Unitarios Locales</h3>
            <v-text-field v-model.number="prices.cement" label="Bolsa Cemento (50kg)" prefix="$" variant="outlined" density="compact" />
            <v-text-field v-model.number="prices.sand" label="Arena (m³)" prefix="$" variant="outlined" density="compact" />
            <v-text-field v-model.number="prices.gravel" label="Grava (m³)" prefix="$" variant="outlined" density="compact" />
            <v-text-field v-model.number="prices.brick" label="Ladrillo (1000 un.)" prefix="$" variant="outlined" density="compact" />
            <v-text-field v-model.number="prices.labor" label="Mano de Obra (Global)" prefix="$" variant="outlined" density="compact" />
            <v-row class="mt-2">
              <v-col cols="6">
                <v-btn color="primary" block @click="calculateTotal">Actualizar</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="secondary" block @click="exportData" variant="outlined">
                  <v-icon :icon="mdiExportVariant" start /> Exportar
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" class="d-flex flex-column align-center justify-center">
            <h3 class="text-secondary mb-3">Distribución (Total: ${{ totalCost.toFixed(2) }})</h3>
            <div style="width: 100%; max-width: 300px;">
              <Doughnut v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { mdiCurrencyUsd, mdiExportVariant } from '@mdi/js'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const prices = reactive({
  cement: 8.50,
  sand: 15.00,
  gravel: 18.00,
  brick: 120.00,
  labor: 500.00
})

const totalCost = ref(0)
const chartData = ref<any>({
  labels: ['Material Pesado', 'Acabados', 'Mano de Obra'],
  datasets: [{
    data: [0, 0, 0],
    backgroundColor: ['#455A64', '#FF6F00', '#1976D2']
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

const calculateTotal = () => {
  // Simulación de cálculo basado en precios locales
  const materialPesado = (prices.cement * 50) + (prices.sand * 10) + (prices.gravel * 12) + (prices.brick * 2)
  const acabados = materialPesado * 0.3 // Asumimos 30% del costo material para acabados
  const manoDeObra = prices.labor

  totalCost.value = materialPesado + acabados + manoDeObra
  
  chartData.value = {
    labels: ['Material Pesado', 'Acabados', 'Mano de Obra'],
    datasets: [{
      data: [materialPesado, acabados, manoDeObra],
      backgroundColor: ['#455A64', '#FF6F00', '#1976D2']
    }]
  }
}

// Persistencia Offline (FASE 4)
watch(prices, (newPrices) => {
  localStorage.setItem('obrakit_prices', JSON.stringify(newPrices))
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
    await navigator.clipboard.writeText(text);
    alert('¡Resumen copiado al portapapeles!');
  } catch (err) {
    alert('Error al copiar. Puede que tu navegador requiera HTTPS para esta función.');
  }
}

onMounted(() => {
  const saved = localStorage.getItem('obrakit_prices')
  if (saved) {
    Object.assign(prices, JSON.parse(saved))
  }
  calculateTotal()
})
</script>
