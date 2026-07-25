<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title class="font-weight-bold">
        <v-icon :icon="mdiTools" start /> ObraKit Off-Line
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon :icon="mdiThemeLightDark" />
      </v-btn>
    </v-app-bar>

    <v-main class="bg-background">
      <v-fade-transition mode="out-in">
        <component :is="currentComponent" />
      </v-fade-transition>
    </v-main>

    <v-bottom-navigation v-model="activeTab" color="primary" grow shift>
      <v-btn value="calculator">
        <v-icon :icon="mdiCalculator" />
        <span>Cálculos</span>
      </v-btn>
      <v-btn value="budget">
        <v-icon :icon="mdiCurrencyUsd" />
        <span>Presupuesto</span>
      </v-btn>
      <v-btn value="guides">
        <v-icon :icon="mdiBookOpenPageVariant" />
        <span>Guías</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { 
  mdiTools, 
  mdiThemeLightDark,
  mdiCalculator,
  mdiCurrencyUsd,
  mdiBookOpenPageVariant
} from '@mdi/js'

import MaterialCalculator from '@/components/MaterialCalculator.vue'
import BudgetEstimator from '@/components/BudgetEstimator.vue'
import GuidesAndRecipes from '@/components/GuidesAndRecipes.vue'

const theme = useTheme()
const activeTab = ref('calculator')

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'obrakitTheme' : 'obrakitThemeDark'
}

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'calculator': return MaterialCalculator
    case 'budget': return BudgetEstimator
    case 'guides': return GuidesAndRecipes
    default: return MaterialCalculator
  }
})
</script>

<style>
/* Global adjustments for mobile */
html, body {
  overflow-x: hidden;
}
</style>
