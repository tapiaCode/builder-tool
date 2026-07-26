<template>
  <v-app>
    <v-app-bar class="glass-header border-b" flat density="comfortable">
      <template #prepend>
        <v-avatar color="primary" size="38" class="ml-2 elevation-2">
          <v-icon :icon="mdiHomeCity" size="22" color="white" />
        </v-avatar>
      </template>

      <v-app-bar-title class="font-weight-black text-subtitle-1 tracking-tight">
        OBRAFÁCIL <span class="text-primary">COMARAPA</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn icon size="small" variant="tonal" color="primary" class="mr-2" @click="toggleTheme" aria-label="Cambiar tema">
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

    <v-bottom-navigation v-model="activeTab" color="primary" active grow class="border-t">
      <v-btn value="calculator">
        <v-icon :icon="mdiCalculator" />
        <span class="font-weight-bold">Cálculos</span>
      </v-btn>
      <v-btn value="budget">
        <v-icon :icon="mdiCashMultiple" />
        <span class="font-weight-bold">Presupuesto</span>
      </v-btn>
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
import { ref, computed } from 'vue'
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

const theme = useTheme()
const activeTab = ref('calculator')

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'obrakitTheme' : 'obrakitThemeDark'
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
</style>
