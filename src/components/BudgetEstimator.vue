<template>
  <v-container class="py-4">
    <!-- Header Banner -->
    <v-card class="mb-4 overflow-hidden rounded-xl border-0 elevation-4 stat-card-gradient-accent">
      <v-card-text class="pa-5">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-overline text-accent font-weight-bold tracking-wider">COTIZADOR RÁPIDO PARA CLIENTES</div>
            <h2 class="text-h5 font-weight-black text-on-surface mb-1">Cotizaciones & Presupuestos</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">Crea proformas rápidas, envíalas por WhatsApp y guarda tu historial</p>
          </div>
          <v-avatar color="accent" size="52" class="elevation-4">
            <v-icon :icon="mdiCashMultiple" size="28" color="white" />
          </v-avatar>
        </div>
      </v-card-text>
    </v-card>

    <!-- Sub-Navigation Tabs -->
    <v-card class="rounded-xl border-0 elevation-2 mb-4">
      <v-tabs v-model="subTab" color="primary" grow align-tabs="center" class="pa-1">
        <v-tab value="newQuote" class="rounded-lg text-none font-weight-bold">
          <v-icon :icon="mdiFileDocumentEditOutline" class="mr-2" /> Nueva Cotización
        </v-tab>
        <v-tab value="history" class="rounded-lg text-none font-weight-bold">
          <v-icon :icon="mdiHistory" class="mr-2" /> Historial ({{ savedQuotes.length }})
        </v-tab>
        <v-tab value="config" class="rounded-lg text-none font-weight-bold">
          <v-icon :icon="mdiCogOutline" class="mr-2" /> Precios Base
        </v-tab>
      </v-tabs>
    </v-card>

    <v-window v-model="subTab">
      <!-- PESTAÑA 1: NUEVA COTIZACIÓN PARA CLIENTE -->
      <v-window-item value="newQuote">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon :icon="mdiAccount" color="primary" class="mr-2" />
              1. Datos del Cliente y Trabajo
            </h3>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn size="x-small" color="primary" variant="tonal" v-bind="props">
                  <v-icon :icon="mdiLightningBolt" start /> Cargar Plantilla
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item title="Cocina (3×3m con Mesón)" @click="loadPreset('cocina')" />
                <v-list-item title="Baño Completo (2×2m)" @click="loadPreset('bano')" />
                <v-list-item title="Cuarto Estándar (4×4m)" @click="loadPreset('cuarto')" />
                <v-list-item title="Revoque de Fachada" @click="loadPreset('revoque')" />
              </v-list>
            </v-menu>
          </div>

          <v-row density="compact">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="quoteForm.clientName"
                label="Nombre del Cliente"
                placeholder="Ej. Don Juan Pérez"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="quoteForm.clientPhone"
                label="Celular / WhatsApp (Opcional)"
                placeholder="Ej. 71234567"
                type="tel"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="quoteForm.projectTitle"
                label="Nombre del Proyecto / Trabajo"
                placeholder="Ej. Construcción de Cocina 3×3m con Mesón de Hormigón"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="quoteForm.notes"
                label="Detalles o Especificaciones del Cliente"
                placeholder="Ej. Incluye mesón de hormigón, cerámica en paredes hasta 1.80m y punto de agua"
                rows="2"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Detalle de Ítems -->
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon :icon="mdiFormatListNumbered" color="primary" class="mr-2" />
              2. Ítems y Cobros de la Cotización
            </h3>
            <v-btn size="x-small" color="primary" variant="text" @click="addItem">
              <v-icon :icon="mdiPlus" start /> Agregar Ítem
            </v-btn>
          </div>

          <v-row v-for="(item, index) in quoteForm.items" :key="index" density="compact" class="align-center mb-2">
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="item.description"
                label="Descripción del trabajo / material"
                placeholder="Ej. Mano de Obra"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="4" sm="2">
              <v-text-field
                v-model.number="item.quantity"
                label="Cant."
                type="number"
                min="1"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="6" sm="4">
              <v-text-field
                v-model.number="item.unitPrice"
                label="Precio (Bs.)"
                prefix="Bs."
                type="number"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="2" sm="1" class="text-right">
              <v-btn icon size="x-small" color="error" variant="text" @click="removeItem(index)">
                <v-icon :icon="mdiDelete" />
              </v-btn>
            </v-col>
          </v-row>

          <!-- Total Cotización Card -->
          <v-card class="pa-4 rounded-xl stat-card-gradient-primary border-0 mt-4 text-center">
            <div class="text-caption font-weight-bold text-medium-emphasis">TOTAL DE LA COTIZACIÓN</div>
            <div class="text-h3 font-weight-black text-primary my-1">
              Bs. {{ calculatedTotal.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} BOB
            </div>
          </v-card>

          <!-- Action Buttons -->
          <v-row class="mt-4">
            <v-col cols="12" sm="6">
              <v-btn
                color="success"
                size="large"
                block
                class="rounded-lg font-weight-bold"
                @click="sendWhatsApp"
              >
                <v-icon :icon="mdiWhatsapp" start size="22" /> Enviar por WhatsApp
              </v-btn>
            </v-col>
            <v-col cols="6" sm="3">
              <v-btn
                color="primary"
                size="large"
                block
                variant="tonal"
                class="rounded-lg font-weight-bold"
                @click="saveQuote"
              >
                <v-icon :icon="mdiContentSave" start /> Guardar
              </v-btn>
            </v-col>
            <v-col cols="6" sm="3">
              <v-btn
                color="secondary"
                size="large"
                block
                variant="outlined"
                class="rounded-lg font-weight-bold"
                @click="copyTextQuote"
              >
                <v-icon :icon="mdiContentCopy" start /> Copiar
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>

      <!-- PESTAÑA 2: HISTORIAL DE COTIZACIONES -->
      <v-window-item value="history">
        <div v-if="savedQuotes.length === 0" class="text-center py-8">
          <v-icon :icon="mdiHistory" size="64" color="medium-emphasis" class="mb-3" />
          <h3 class="text-h6 font-weight-bold text-medium-emphasis">No tienes cotizaciones guardadas</h3>
          <p class="text-caption text-medium-emphasis">Crea una cotización en la primera pestaña y guárdala aquí para ver tu historial.</p>
        </div>

        <div v-else>
          <div class="d-flex align-center justify-space-between mb-3 px-1">
            <span class="text-caption font-weight-bold text-medium-emphasis">COTIZACIONES REGISTRADAS</span>
            <v-btn size="x-small" color="error" variant="text" @click="clearHistory">
              <v-icon :icon="mdiDelete" start /> Borrar Historial
            </v-btn>
          </div>

          <v-card
            v-for="quote in savedQuotes"
            :key="quote.id"
            class="rounded-xl border-0 elevation-2 pa-4 mb-3"
          >
            <div class="d-flex align-center justify-space-between mb-2">
              <div>
                <span class="text-subtitle-1 font-weight-black text-primary">{{ quote.clientName || 'Cliente sin nombre' }}</span>
                <span v-if="quote.clientPhone" class="text-caption text-medium-emphasis ml-2">({{ quote.clientPhone }})</span>
              </div>
              <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
                Bs. {{ quote.total.toLocaleString('es-BO', { minimumFractionDigits: 2 }) }}
              </v-chip>
            </div>

            <div class="text-body-2 font-weight-bold mb-1">{{ quote.projectTitle }}</div>
            <div v-if="quote.notes" class="text-caption text-medium-emphasis mb-2">{{ quote.notes }}</div>

            <div class="d-flex align-center justify-space-between border-t pt-3 mt-2">
              <span class="text-caption text-medium-emphasis">
                <v-icon :icon="mdiClockOutline" size="14" start /> {{ quote.date }}
              </span>

              <div>
                <v-btn icon size="x-small" color="success" class="mr-1" @click="sendSavedWhatsApp(quote)" title="Enviar por WhatsApp">
                  <v-icon :icon="mdiWhatsapp" />
                </v-btn>
                <v-btn icon size="x-small" color="primary" variant="tonal" class="mr-1" @click="loadQuoteIntoForm(quote)" title="Ver / Editar">
                  <v-icon :icon="mdiFileDocumentEditOutline" />
                </v-btn>
                <v-btn icon size="x-small" color="error" variant="text" @click="deleteQuote(quote.id)" title="Eliminar">
                  <v-icon :icon="mdiDelete" />
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>
      </v-window-item>

      <!-- PESTAÑA 3: PRECIOS BASE DE REFERENCIA -->
      <v-window-item value="config">
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon :icon="mdiCogOutline" color="primary" class="mr-2" />
              Precios Unitarios de Referencia (Comarapa)
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
                label="Ripio (por m³)"
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
                label="Mano de Obra Estimada (Base)"
                prefix="Bs."
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Toast Notification -->
    <v-snackbar v-model="snackbar" :timeout="3000" color="success" rounded="pill" location="bottom center">
      <v-icon :icon="mdiCheckCircle" start /> {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { 
  mdiCashMultiple, 
  mdiRefresh, 
  mdiCheckCircle,
  mdiFileDocumentEditOutline,
  mdiHistory,
  mdiCogOutline,
  mdiAccount,
  mdiPlus,
  mdiDelete,
  mdiWhatsapp,
  mdiContentCopy,
  mdiContentSave,
  mdiClockOutline,
  mdiLightningBolt,
  mdiFormatListNumbered
} from '@mdi/js'

const subTab = ref('newQuote')
const snackbar = ref(false)
const snackbarText = ref('')

// Formulario de Cotización Rápida
const quoteForm = reactive({
  clientName: '',
  clientPhone: '',
  projectTitle: 'Construcción de Cocina (3×3m)',
  notes: 'Incluye mesón de hormigón, azulejos en pared y punto de agua.',
  items: [
    { description: 'Materiales Pesados (Cemento, Arena, Ripio)', quantity: 1, unitPrice: 3500 },
    { description: 'Mano de Obra Maestro y Ayudante', quantity: 1, unitPrice: 2800 },
    { description: 'Cerámica y Mesón de Hormigón', quantity: 1, unitPrice: 1200 }
  ]
})

const calculatedTotal = computed(() => {
  return quoteForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
})

const addItem = () => {
  quoteForm.items.push({ description: '', quantity: 1, unitPrice: 0 })
}

const removeItem = (index: number) => {
  if (quoteForm.items.length > 1) {
    quoteForm.items.splice(index, 1)
  }
}

// Plantillas Rápidas
const loadPreset = (type: string) => {
  if (type === 'cocina') {
    quoteForm.projectTitle = 'Construcción de Cocina (3×3m con Mesón)'
    quoteForm.notes = 'Incluye mesón de hormigón reforzado, cerámica en pared hasta 1.80m y punto de agua.'
    quoteForm.items = [
      { description: 'Materiales (Cemento, Arena, Ripio, Ladrillo)', quantity: 1, unitPrice: 3800 },
      { description: 'Mano de Obra de Construcción', quantity: 1, unitPrice: 3000 },
      { description: 'Acabados de Mesón y Cerámica', quantity: 1, unitPrice: 1400 }
    ]
  } else if (type === 'bano') {
    quoteForm.projectTitle = 'Construcción / Remodelación de Baño (2×2m)'
    quoteForm.notes = 'Incluye revestimiento completo con cerámica, instalación sanitaria y grifería.'
    quoteForm.items = [
      { description: 'Materiales (Cemento, Arena, Ladrillo)', quantity: 1, unitPrice: 2200 },
      { description: 'Cerámica, Cemento Cola y Pastina', quantity: 1, unitPrice: 1500 },
      { description: 'Mano de Obra Sanitaria y Albañilería', quantity: 1, unitPrice: 2500 }
    ]
  } else if (type === 'cuarto') {
    quoteForm.projectTitle = 'Construcción de Cuarto Completo (4×4m)'
    quoteForm.notes = 'Paredes con Ladrillo 6 Huecos, contrapiso y colocación de piso cerámico.'
    quoteForm.items = [
      { description: 'Ladrillos 6 Huecos (~1,060 un.)', quantity: 1, unitPrice: 3200 },
      { description: 'Cemento, Arena y Ripio', quantity: 1, unitPrice: 2800 },
      { description: 'Mano de Obra Global de Obra', quantity: 1, unitPrice: 4500 }
    ]
  } else if (type === 'revoque') {
    quoteForm.projectTitle = 'Revoque de Fachada / Muros'
    quoteForm.notes = 'Revoque exterior con cal/cemento impermeabilizado.'
    quoteForm.items = [
      { description: 'Cemento y Cal de Revoque', quantity: 1, unitPrice: 1200 },
      { description: 'Arena Fina de Río', quantity: 1, unitPrice: 800 },
      { description: 'Mano de Obra por m²', quantity: 1, unitPrice: 2000 }
    ]
  }
}

// WhatsApp Generator
const formatWhatsAppMessage = (form: typeof quoteForm, total: number) => {
  let msg = `🚧 *COTIZACIÓN DE OBRA - OBRAFÁCIL COMARAPA* 🚧\n\n`
  if (form.clientName) msg += `👤 *Cliente:* ${form.clientName}\n`
  msg += `📌 *Proyecto:* ${form.projectTitle}\n\n`
  msg += `📋 *DETALLE DE COTIZACIÓN:*\n`

  form.items.forEach((item, index) => {
    if (item.description) {
      msg += `${index + 1}. ${item.description}: ${item.quantity} x Bs. ${item.unitPrice.toLocaleString('es-BO')} = *Bs. ${(item.quantity * item.unitPrice).toLocaleString('es-BO')}*\n`
    }
  })

  msg += `\n----------------------------------\n`
  msg += `💰 *TOTAL COTIZADO:* Bs. ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })} BOB\n`
  msg += `----------------------------------\n`

  if (form.notes) {
    msg += `\n📝 *Notas:* ${form.notes}\n`
  }

  msg += `\n_Cotización generada para Comarapa por Maestro de Obra con Obrafácil Comarapa_`
  return msg
}

const sendWhatsApp = () => {
  const text = formatWhatsAppMessage(quoteForm, calculatedTotal.value)
  const phone = quoteForm.clientPhone.replace(/\D/g, '')
  const encoded = encodeURIComponent(text)

  let url = `https://api.whatsapp.com/send?text=${encoded}`
  if (phone) {
    url = `https://api.whatsapp.com/send?phone=591${phone}&text=${encoded}`
  }

  window.open(url, '_blank')
}

const copyTextQuote = async () => {
  const text = formatWhatsAppMessage(quoteForm, calculatedTotal.value)
  try {
    await navigator.clipboard.writeText(text)
    snackbarText.value = '¡Cotización copiada para enviar!'
    snackbar.value = true
  } catch (e) {
    snackbarText.value = 'Error al copiar'
    snackbar.value = true
  }
}

// Historial en localStorage
interface SavedQuote {
  id: string
  date: string
  clientName: string
  clientPhone: string
  projectTitle: string
  notes: string
  items: { description: string; quantity: number; unitPrice: number }[]
  total: number
}

const savedQuotes = ref<SavedQuote[]>([])

const saveQuote = () => {
  const newQuote: SavedQuote = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    clientName: quoteForm.clientName || 'Cliente',
    clientPhone: quoteForm.clientPhone,
    projectTitle: quoteForm.projectTitle || 'Trabajo de Construcción',
    notes: quoteForm.notes,
    items: JSON.parse(JSON.stringify(quoteForm.items)),
    total: calculatedTotal.value
  }

  savedQuotes.value.unshift(newQuote)
  localStorage.setItem('obrafacil_quotes', JSON.stringify(savedQuotes.value))
  
  snackbarText.value = '¡Cotización guardada en el Historial!'
  snackbar.value = true
}

const loadSavedQuotes = () => {
  const saved = localStorage.getItem('obrafacil_quotes')
  if (saved) {
    try {
      savedQuotes.value = JSON.parse(saved)
    } catch (e) {}
  }
}

const sendSavedWhatsApp = (quote: SavedQuote) => {
  const text = formatWhatsAppMessage(quote, quote.total)
  const phone = quote.clientPhone.replace(/\D/g, '')
  const encoded = encodeURIComponent(text)

  let url = `https://api.whatsapp.com/send?text=${encoded}`
  if (phone) {
    url = `https://api.whatsapp.com/send?phone=591${phone}&text=${encoded}`
  }
  window.open(url, '_blank')
}

const loadQuoteIntoForm = (quote: SavedQuote) => {
  quoteForm.clientName = quote.clientName
  quoteForm.clientPhone = quote.clientPhone
  quoteForm.projectTitle = quote.projectTitle
  quoteForm.notes = quote.notes
  quoteForm.items = JSON.parse(JSON.stringify(quote.items))
  subTab.value = 'newQuote'
}

const deleteQuote = (id: string) => {
  savedQuotes.value = savedQuotes.value.filter(q => q.id !== id)
  localStorage.setItem('obrafacil_quotes', JSON.stringify(savedQuotes.value))
}

const clearHistory = () => {
  if (confirm('¿Deseas borrar todo el historial de cotizaciones?')) {
    savedQuotes.value = []
    localStorage.removeItem('obrafacil_quotes')
  }
}

// Precios de referencia base en Bolivia (BOB)
const defaultPrices = {
  cement: 55.00,
  sand: 120.00,
  gravel: 130.00,
  brick: 1750.00,
  labor: 3500.00
}

const prices = reactive({ ...defaultPrices })

const resetDefaults = () => {
  Object.assign(prices, defaultPrices)
}

watch(prices, (newPrices) => {
  localStorage.setItem('obrakit_prices', JSON.stringify(newPrices))
}, { deep: true })

onMounted(() => {
  loadSavedQuotes()
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
})
</script>
