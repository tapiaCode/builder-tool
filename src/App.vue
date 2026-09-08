<template>
  <v-app>
    <v-app-bar class="glass-header border-b px-3" flat density="comfortable">
      <div class="d-flex align-center flex-grow-1 min-width-0 mr-2">
        <v-avatar color="primary" size="34" class="elevation-2 mr-2 flex-shrink-0">
          <v-icon :icon="mdiHomeCity" size="20" color="white" />
        </v-avatar>
        <div class="app-brand-title font-weight-black tracking-tight text-no-wrap">
          OBRAFÁCIL <span class="text-primary">COMARAPA</span>
        </div>
      </div>

      <v-btn icon size="small" variant="tonal" color="primary" class="flex-shrink-0" @click="toggleTheme" aria-label="Cambiar tema">
        <v-icon :icon="isDark ? mdiWeatherSunny : mdiWeatherNight" />
      </v-btn>
    </v-app-bar>

    <v-main class="bg-background pb-16">
      <v-container class="pa-2 max-width-container">
        <v-fade-transition mode="out-in">
          <component :is="currentComponent" />
        </v-fade-transition>
      </v-container>
    </v-main>

    <v-bottom-navigation v-model="activeTab" color="primary" active grow class="border-t" @update:model-value="onTabChange">
      <v-btn value="calculator">
        <v-icon :icon="mdiCalculator" />
        <span class="font-weight-bold">Cálculos</span>
      </v-btn>
      
      <!-- <v-btn value="budget">
        <v-icon :icon="mdiCashMultiple" />
        <span class="font-weight-bold">Presupuesto</span>
      </v-btn> -->
      
      <v-btn value="guides">
        <v-icon :icon="mdiBookOpenPageVariant" />
        <span class="font-weight-bold">Guías</span>
      </v-btn>
      <v-btn value="about">
        <v-icon :icon="mdiInformation" />
        <span class="font-weight-bold">Acerca de</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { 
  mdiHomeCity, 
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiCalculator,
  mdiCashMultiple,
  mdiBookOpenPageVariant,
  mdiInformation
} from '@mdi/js'

import MaterialCalculator from '@/components/MaterialCalculator.vue'
import BudgetEstimator from '@/components/BudgetEstimator.vue'
import GuidesAndRecipes from '@/components/GuidesAndRecipes.vue'
import AboutUs from '@/components/AboutUs.vue'
import { initCapacitor, updateStatusBarStyle, triggerHaptic } from '@/services/capacitorService'

const theme = useTheme()
const activeTab = ref('calculator')

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'obrakitTheme' : 'obrakitThemeDark'
  triggerHaptic()
}

// Keep Android status bar icons synchronized with theme
watch(isDark, (dark) => {
  updateStatusBarStyle(dark)
})

// Initialize native Capacitor integrations on app mount
onMounted(async () => {
  await initCapacitor(isDark, activeTab)
})

const onTabChange = () => {
  triggerHaptic()
}

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'calculator': return MaterialCalculator
    case 'budget': return BudgetEstimator
    case 'guides': return GuidesAndRecipes
    case 'about': return AboutUs
    default: return MaterialCalculator
  }
})
</script>

<style>
.max-width-container {
  max-width: 900px;
  margin: 0 auto;
}
.glass-header {
  backdrop-filter: blur(10px);
}
.app-brand-title {
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

@media (max-width: 440px) {
  .app-brand-title {
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .app-brand-title {
    font-size: 0.9rem;
  }
}
</style>
