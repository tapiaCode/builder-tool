<template>
  <v-app>
    <v-app-bar class="glass-header" flat density="comfortable">
      <template #prepend>
        <v-avatar color="primary" size="36" class="ml-2">
          <v-icon :icon="mdiTools" size="20" color="white" />
        </v-avatar>
      </template>

      <v-app-bar-title class="font-weight-black text-subtitle-1 tracking-tight">
        OBRAKIT <span class="text-primary">OFF-LINE</span>
      </v-app-bar-title>

      <v-spacer />

      <v-chip size="x-small" color="success" variant="flat" class="mr-2 font-weight-bold">
        <v-icon :icon="mdiWifiOff" start size="12" /> OFF-LINE
      </v-chip>

      <v-btn icon size="small" variant="text" @click="toggleTheme">
        <v-icon :icon="mdiThemeLightDark" color="primary" />
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
  mdiCashMultiple,
  mdiBookOpenPageVariant,
  mdiWifiOff
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
.max-width-container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
