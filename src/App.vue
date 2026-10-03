<template>
  <v-app>
    <v-app-bar class="glass-header px-4" flat density="comfortable">
      <div class="d-flex align-center flex-grow-1 min-width-0 mr-2">
        <v-avatar color="primary" size="36" rounded="lg" class="mr-3 flex-shrink-0">
          <v-icon :icon="mdiHomeCity" size="20" class="brand-icon" />
        </v-avatar>
        <div class="min-width-0">
          <div class="app-brand-eyebrow text-medium-emphasis">ObraFácil</div>
          <div class="app-brand-title text-no-wrap">{{ activeTabLabel }}</div>
        </div>
      </div>

      <v-btn
        icon
        variant="tonal"
        color="primary"
        rounded="lg"
        size="44"
        class="flex-shrink-0"
        :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
        @click="toggleTheme"
      >
        <v-icon :icon="isDark ? mdiWeatherSunny : mdiWeatherNight" />
      </v-btn>
    </v-app-bar>

    <v-main class="bg-background">
      <v-container class="px-4 py-0 max-width-container" fluid>
        <v-fade-transition mode="out-in">
          <component :is="currentComponent" />
        </v-fade-transition>
      </v-container>
    </v-main>

    <nav class="dock" aria-label="Navegación principal">
      <div class="dock__inner">
        <button
          v-for="t in tabs"
          :key="t.value"
          type="button"
          class="dock__item"
          :class="{ 'dock__item--active': activeTab === t.value }"
          :aria-current="activeTab === t.value ? 'page' : undefined"
          @click="selectTab(t.value)"
        >
          <span class="dock__icon">
            <v-icon :icon="t.icon" size="22" />
          </span>
          <span class="dock__label">{{ t.label }}</span>
        </button>
      </div>
    </nav>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import {
  mdiHomeCity,
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiCalculatorVariantOutline,
  mdiFileDocumentOutline,
  mdiBookOpenPageVariantOutline,
  mdiInformationOutline
} from '@mdi/js'

import MaterialCalculator from '@/components/MaterialCalculator.vue'
import BudgetEstimator from '@/components/BudgetEstimator.vue'
import GuidesAndRecipes from '@/components/GuidesAndRecipes.vue'
import AboutUs from '@/components/AboutUs.vue'
import { initCapacitor, updateStatusBarStyle, triggerHaptic } from '@/services/capacitorService'

const THEME_KEY = 'obrafacil_theme'

const theme = useTheme()
const activeTab = ref('calculator')

const tabs = [
  { value: 'calculator', label: 'Cálculos', icon: mdiCalculatorVariantOutline, component: MaterialCalculator },
  { value: 'budget', label: 'Presupuestos', icon: mdiFileDocumentOutline, component: BudgetEstimator },
  { value: 'guides', label: 'Guías', icon: mdiBookOpenPageVariantOutline, component: GuidesAndRecipes },
  { value: 'about', label: 'Acerca de', icon: mdiInformationOutline, component: AboutUs },
]

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'obrakitTheme' : 'obrakitThemeDark'
  try {
    localStorage.setItem(THEME_KEY, theme.global.name.value)
  } catch {
    // Storage may be unavailable
  }
  triggerHaptic()
}

// Keep Android status bar icons synchronized with theme
watch(isDark, (dark) => {
  updateStatusBarStyle(dark)
})

// Initialize native Capacitor integrations on app mount
onMounted(async () => {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'obrakitTheme' || saved === 'obrakitThemeDark') {
      theme.global.name.value = saved
    }
  } catch {
    // Storage may be unavailable
  }
  await initCapacitor(isDark, activeTab)
})

const selectTab = (value: string) => {
  if (activeTab.value === value) return
  activeTab.value = value
  window.scrollTo({ top: 0 })
  triggerHaptic()
}

const activeEntry = computed(() => tabs.find(t => t.value === activeTab.value) ?? tabs[0]!)
const activeTabLabel = computed(() => activeEntry.value.label)
const currentComponent = computed(() => activeEntry.value.component)
</script>

<style>
.max-width-container {
  max-width: 720px;
  margin: 0 auto;
}
.min-width-0 {
  min-width: 0;
}
.brand-icon {
  color: rgb(var(--v-theme-background)) !important;
}
.app-brand-eyebrow {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.1;
}
.app-brand-title {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.25;
}
</style>
