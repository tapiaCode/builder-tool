<template>
  <div class="budget-root pb-6" :class="{ 'has-total-bar': subTab === 'newQuote' }">
    <PageHeader eyebrow="Presupuestos" title="Cotizaciones" subtitle="Arma presupuestos con tus precios y envíalos por WhatsApp." />

    <!-- Segmented control -->
    <v-btn-toggle v-model="subTab" mandatory class="segmented mb-4" color="primary">
      <v-btn value="newQuote">Nueva</v-btn>
      <v-btn value="history">
        Historial
        <v-badge v-if="savedQuotes.length" :content="savedQuotes.length" color="primary" inline class="ml-1" />
      </v-btn>
      <v-btn value="catalog">Mis precios</v-btn>
    </v-btn-toggle>

    <v-window v-model="subTab" :touch="false">
      <!-- NUEVA COTIZACIÓN -->
      <v-window-item value="newQuote">
        <v-card class="pa-4 mb-3" flat>
          <div class="section-label mb-3">Cliente y trabajo</div>
          <v-text-field
            v-model="quoteForm.clientName"
            label="Nombre del cliente"
            :prepend-inner-icon="mdiAccountOutline"
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model="quoteForm.clientPhone"
            label="Celular / WhatsApp (opcional)"
            type="tel"
            inputmode="tel"
            :prepend-inner-icon="mdiPhoneOutline"
            prefix="+591"
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model="quoteForm.projectTitle"
            label="Trabajo a realizar"
            :prepend-inner-icon="mdiHammerWrench"
            hide-details="auto"
            class="mb-3"
          />
          <v-textarea
            v-model="quoteForm.notes"
            label="Notas (opcional)"
            rows="2"
            auto-grow
            hide-details="auto"
          />
        </v-card>

        <div class="d-flex align-center justify-space-between mb-2 px-1">
          <div class="section-label">Ítems ({{ quoteForm.items.length }})</div>
          <v-btn
            v-if="quoteForm.items.length || hasFormContent"
            size="small"
            variant="text"
            color="error"
            @click="confirmAction('clearForm')"
          >
            Limpiar
          </v-btn>
        </div>

        <!-- Empty state -->
        <v-card v-if="quoteForm.items.length === 0" class="pa-6 mb-3 text-center" flat>
          <v-avatar color="primary" variant="tonal" size="56" rounded="lg" class="mb-3">
            <v-icon :icon="mdiFileDocumentPlusOutline" size="28" />
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold mb-1">Aún no hay ítems</div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Agrega materiales o mano de obra. Puedes usar los precios que guardaste en «Mis precios».
          </p>
        </v-card>

        <!-- Item cards -->
        <v-card v-for="(item, index) in quoteForm.items" :key="item.id" class="pa-3 mb-3" flat>
          <div class="d-flex align-start ga-2">
            <v-text-field
              v-model="item.description"
              label="Descripción"
              density="comfortable"
              hide-details
              class="flex-grow-1"
            />
            <v-btn
              icon
              variant="text"
              color="error"
              size="48"
              :aria-label="`Quitar ítem ${index + 1}`"
              @click="removeItem(index)"
            >
              <v-icon :icon="mdiDeleteOutline" />
            </v-btn>
          </div>
          <div class="d-flex ga-2 mt-2">
            <v-text-field
              v-model.number="item.quantity"
              label="Cantidad"
              type="number"
              inputmode="decimal"
              min="0"
              density="comfortable"
              :suffix="item.unit || undefined"
              hide-details
              class="qty-field"
            />
            <v-text-field
              v-model.number="item.unitPrice"
              label="Precio unitario"
              type="number"
              inputmode="decimal"
              min="0"
              prefix="Bs."
              density="comfortable"
              hide-details
              class="flex-grow-1"
            />
          </div>
          <div class="d-flex justify-end mt-2 text-body-2">
            <span class="text-medium-emphasis mr-2">Subtotal</span>
            <span class="font-weight-bold">Bs. {{ formatMoney(lineTotal(item)) }}</span>
          </div>
        </v-card>

        <div class="d-flex ga-2 mb-4">
          <v-btn color="primary" variant="flat" size="large" class="flex-grow-1" :prepend-icon="mdiPlus" @click="addItem()">
            Agregar ítem
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            size="large"
            class="flex-grow-1"
            :prepend-icon="mdiTagMultipleOutline"
            @click="catalogSheet = true"
          >
            Mis precios
          </v-btn>
        </div>

        <!-- Sticky total bar -->
        <div class="total-bar">
          <div class="total-bar__inner">
            <div class="min-width-0 flex-grow-1">
              <div class="total-bar__label">Total</div>
              <div class="total-bar__value text-truncate">Bs. {{ formatMoney(calculatedTotal) }}</div>
            </div>
            <v-menu location="top end">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon variant="tonal" size="48" rounded="lg" aria-label="Más acciones">
                  <v-icon :icon="mdiDotsVertical" />
                </v-btn>
              </template>
              <v-list density="comfortable" rounded="lg">
                <v-list-item :prepend-icon="mdiContentSaveOutline" title="Guardar en historial" :disabled="!canSubmit" @click="saveQuote" />
                <v-list-item :prepend-icon="mdiContentCopy" title="Copiar texto" :disabled="!canSubmit" @click="copyTextQuote" />
              </v-list>
            </v-menu>
            <v-btn
              color="success"
              variant="flat"
              size="large"
              rounded="lg"
              :prepend-icon="mdiWhatsapp"
              :disabled="!canSubmit"
              class="ml-2"
              @click="sendWhatsApp"
            >
              Enviar
            </v-btn>
          </div>
        </div>
      </v-window-item>

      <!-- HISTORIAL -->
      <v-window-item value="history">
        <v-card v-if="savedQuotes.length === 0" class="pa-6 text-center" flat>
          <v-avatar color="primary" variant="tonal" size="56" rounded="lg" class="mb-3">
            <v-icon :icon="mdiHistory" size="28" />
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold mb-1">Sin cotizaciones guardadas</div>
          <p class="text-body-2 text-medium-emphasis mb-4">Las cotizaciones que guardes aparecerán aquí.</p>
          <v-btn color="primary" variant="tonal" @click="subTab = 'newQuote'">Crear cotización</v-btn>
        </v-card>

        <template v-else>
          <div class="d-flex align-center justify-space-between mb-2 px-1">
            <div class="section-label">{{ savedQuotes.length }} guardadas</div>
            <v-btn size="small" color="error" variant="text" @click="confirmAction('clearHistory')">Borrar todo</v-btn>
          </div>

          <v-card v-for="quote in savedQuotes" :key="quote.id" class="pa-4 mb-3" flat>
            <div class="d-flex align-start justify-space-between ga-3">
              <div class="min-width-0">
                <div class="text-subtitle-1 font-weight-bold text-truncate">{{ quote.projectTitle || 'Sin título' }}</div>
                <div class="text-body-2 text-medium-emphasis text-truncate">
                  {{ quote.clientName || 'Sin cliente' }}<span v-if="quote.clientPhone"> · {{ quote.clientPhone }}</span>
                </div>
              </div>
              <div class="text-subtitle-1 font-weight-black text-primary text-no-wrap">Bs. {{ formatMoney(quote.total) }}</div>
            </div>

            <div class="d-flex align-center justify-space-between mt-3 pt-3 history-footer">
              <span class="text-caption text-medium-emphasis d-flex align-center">
                <v-icon :icon="mdiClockOutline" size="14" class="mr-1" /> {{ formatDate(quote.createdAt) }}
              </span>
              <div class="d-flex ga-1">
                <v-btn icon variant="text" color="success" size="44" aria-label="Enviar por WhatsApp" @click="openWhatsApp(quote, quote.total)">
                  <v-icon :icon="mdiWhatsapp" />
                </v-btn>
                <v-btn icon variant="text" color="primary" size="44" aria-label="Abrir y editar" @click="loadQuoteIntoForm(quote)">
                  <v-icon :icon="mdiPencilOutline" />
                </v-btn>
                <v-btn icon variant="text" color="error" size="44" aria-label="Eliminar" @click="deleteQuote(quote.id)">
                  <v-icon :icon="mdiDeleteOutline" />
                </v-btn>
              </div>
            </div>
          </v-card>
        </template>
      </v-window-item>

      <!-- MIS PRECIOS -->
      <v-window-item value="catalog">
        <p class="text-body-2 text-medium-emphasis px-1 mb-3">
          Guarda los precios que pagas en tu zona. Se usan para agregar ítems rápido a tus cotizaciones.
        </p>

        <v-card v-if="catalog.length === 0" class="pa-6 mb-3 text-center" flat>
          <v-avatar color="primary" variant="tonal" size="56" rounded="lg" class="mb-3">
            <v-icon :icon="mdiTagMultipleOutline" size="28" />
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold mb-1">Tu lista de precios está vacía</div>
          <p class="text-body-2 text-medium-emphasis mb-0">Agrega materiales o servicios con su precio.</p>
        </v-card>

        <v-card v-else class="mb-3" flat>
          <v-list bg-color="transparent" class="py-1">
            <v-list-item v-for="entry in catalog" :key="entry.id" min-height="60" @click="openCatalogDialog(entry)">
              <v-list-item-title class="font-weight-bold">{{ entry.name }}</v-list-item-title>
              <v-list-item-subtitle>por {{ entry.unit || 'unidad' }}</v-list-item-subtitle>
              <template #append>
                <span class="font-weight-bold text-primary mr-1">Bs. {{ formatMoney(entry.price) }}</span>
                <v-icon :icon="mdiChevronRight" class="text-medium-emphasis" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <v-btn color="primary" variant="flat" size="large" block :prepend-icon="mdiPlus" @click="openCatalogDialog()">
          Agregar precio
        </v-btn>
      </v-window-item>
    </v-window>

    <!-- Bottom sheet: pick from catalog -->
    <v-bottom-sheet v-model="catalogSheet" inset>
      <v-card class="pa-4 sheet-card">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-subtitle-1 font-weight-bold">Agregar desde mis precios</div>
          <v-btn icon variant="text" size="44" aria-label="Cerrar" @click="catalogSheet = false">
            <v-icon :icon="mdiClose" />
          </v-btn>
        </div>
        <div v-if="catalog.length === 0" class="text-center py-6">
          <p class="text-body-2 text-medium-emphasis mb-4">Todavía no guardaste precios.</p>
          <v-btn color="primary" variant="tonal" @click="goToCatalog">Ir a Mis precios</v-btn>
        </div>
        <v-list v-else bg-color="transparent" class="sheet-list">
          <v-list-item v-for="entry in catalog" :key="entry.id" min-height="56" @click="addFromCatalog(entry)">
            <v-list-item-title class="font-weight-bold">{{ entry.name }}</v-list-item-title>
            <v-list-item-subtitle>por {{ entry.unit || 'unidad' }}</v-list-item-subtitle>
            <template #append>
              <span class="font-weight-bold mr-2">Bs. {{ formatMoney(entry.price) }}</span>
              <v-icon :icon="mdiPlusCircleOutline" color="primary" />
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>

    <!-- Dialog: create / edit catalog entry -->
    <v-dialog v-model="catalogDialog" max-width="440">
      <v-card class="pa-5">
        <div class="text-h6 font-weight-bold mb-4">{{ catalogDraft.id ? 'Editar precio' : 'Nuevo precio' }}</div>
        <v-text-field v-model="catalogDraft.name" label="Material o servicio" autofocus hide-details="auto" class="mb-3" />
        <v-text-field v-model="catalogDraft.unit" label="Unidad (bolsa, m³, día…)" hide-details="auto" class="mb-3" />
        <v-text-field
          v-model.number="catalogDraft.price"
          label="Precio"
          type="number"
          inputmode="decimal"
          min="0"
          prefix="Bs."
          hide-details="auto"
          class="mb-5"
        />
        <div class="d-flex ga-2">
          <v-btn v-if="catalogDraft.id" color="error" variant="text" @click="deleteCatalogEntry(catalogDraft.id)">Eliminar</v-btn>
          <v-spacer />
          <v-btn variant="text" @click="catalogDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!catalogDraft.name.trim()" @click="saveCatalogEntry">Guardar</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Confirm dialog -->
    <v-dialog v-model="confirmDialog.open" max-width="400">
      <v-card class="pa-5">
        <div class="text-h6 font-weight-bold mb-2">{{ confirmDialog.title }}</div>
        <p class="text-body-2 text-medium-emphasis mb-5">{{ confirmDialog.text }}</p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="confirmDialog.open = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="runConfirmed">Borrar</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2500" :color="snackbarColor" location="top" class="below-header">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  mdiAccountOutline,
  mdiPhoneOutline,
  mdiHammerWrench,
  mdiPlus,
  mdiPlusCircleOutline,
  mdiDeleteOutline,
  mdiWhatsapp,
  mdiContentCopy,
  mdiContentSaveOutline,
  mdiClockOutline,
  mdiHistory,
  mdiPencilOutline,
  mdiTagMultipleOutline,
  mdiFileDocumentPlusOutline,
  mdiDotsVertical,
  mdiChevronRight,
  mdiClose
} from '@mdi/js'
import PageHeader from '@/components/PageHeader.vue'
import { triggerHaptic } from '@/services/capacitorService'

interface QuoteItem {
  id: string
  description: string
  unit: string
  quantity: number | null
  unitPrice: number | null
}

interface QuoteForm {
  clientName: string
  clientPhone: string
  projectTitle: string
  notes: string
  items: QuoteItem[]
}

interface SavedQuote extends QuoteForm {
  id: string
  createdAt: string
  total: number
}

interface CatalogEntry {
  id: string
  name: string
  unit: string
  price: number
}

const STORAGE = {
  quotes: 'obrafacil_quotes_v2',
  draft: 'obrafacil_quote_draft',
  catalog: 'obrafacil_price_catalog'
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage may be full or unavailable
  }
}

const emptyForm = (): QuoteForm => ({
  clientName: '',
  clientPhone: '',
  projectTitle: '',
  notes: '',
  items: []
})

const subTab = ref('newQuote')
const quoteForm = reactive<QuoteForm>(emptyForm())
const savedQuotes = ref<SavedQuote[]>([])
const catalog = ref<CatalogEntry[]>([])

// ---------- Formatting ----------
const moneyFormatter = new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatMoney = (value: number) => moneyFormatter.format(Number.isFinite(value) ? value : 0)
const formatDate = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ---------- Quote form ----------
const lineTotal = (item: QuoteItem) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
const calculatedTotal = computed(() => quoteForm.items.reduce((sum, item) => sum + lineTotal(item), 0))
const hasFormContent = computed(() => Boolean(quoteForm.clientName || quoteForm.clientPhone || quoteForm.projectTitle || quoteForm.notes))
const canSubmit = computed(() => quoteForm.items.some(i => i.description.trim() && lineTotal(i) > 0))

const addItem = (partial: Partial<QuoteItem> = {}) => {
  quoteForm.items.push({ id: uid(), description: '', unit: '', quantity: 1, unitPrice: null, ...partial })
  triggerHaptic()
}

const removeItem = (index: number) => {
  quoteForm.items.splice(index, 1)
}

const resetForm = () => {
  Object.assign(quoteForm, emptyForm())
}

watch(quoteForm, (val) => writeStorage(STORAGE.draft, val), { deep: true })

// ---------- Messaging ----------
const buildMessage = (form: QuoteForm, total: number) => {
  const lines: string[] = ['*COTIZACIÓN DE OBRA*', '']
  if (form.clientName) lines.push(`*Cliente:* ${form.clientName}`)
  if (form.projectTitle) lines.push(`*Trabajo:* ${form.projectTitle}`)
  lines.push('', '*Detalle:*')
  form.items
    .filter(i => i.description.trim())
    .forEach((item, index) => {
      const unit = item.unit ? ` ${item.unit}` : ''
      lines.push(`${index + 1}. ${item.description}: ${item.quantity ?? 0}${unit} × Bs. ${formatMoney(Number(item.unitPrice) || 0)} = *Bs. ${formatMoney(lineTotal(item))}*`)
    })
  lines.push('', `*TOTAL: Bs. ${formatMoney(total)}*`)
  if (form.notes) lines.push('', `*Notas:* ${form.notes}`)
  lines.push('', '_Generado con ObraFácil_')
  return lines.join('\n')
}

const openWhatsApp = (form: QuoteForm, total: number) => {
  const encoded = encodeURIComponent(buildMessage(form, total))
  const phone = form.clientPhone.replace(/\D/g, '')
  const url = phone
    ? `https://api.whatsapp.com/send?phone=591${phone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`
  window.open(url, '_blank')
}

const sendWhatsApp = () => openWhatsApp(quoteForm, calculatedTotal.value)

const copyTextQuote = async () => {
  try {
    await navigator.clipboard.writeText(buildMessage(quoteForm, calculatedTotal.value))
    notify('Cotización copiada')
  } catch {
    notify('No se pudo copiar', 'error')
  }
}

// ---------- History ----------
const persistQuotes = () => writeStorage(STORAGE.quotes, savedQuotes.value)

const saveQuote = () => {
  const quote: SavedQuote = {
    ...JSON.parse(JSON.stringify(quoteForm)),
    id: uid(),
    createdAt: new Date().toISOString(),
    total: calculatedTotal.value
  }
  savedQuotes.value.unshift(quote)
  persistQuotes()
  notify('Guardada en el historial')
}

const loadQuoteIntoForm = (quote: SavedQuote) => {
  Object.assign(quoteForm, {
    clientName: quote.clientName,
    clientPhone: quote.clientPhone,
    projectTitle: quote.projectTitle,
    notes: quote.notes,
    items: JSON.parse(JSON.stringify(quote.items))
  })
  subTab.value = 'newQuote'
}

const deleteQuote = (id: string) => {
  savedQuotes.value = savedQuotes.value.filter(q => q.id !== id)
  persistQuotes()
}

// ---------- Catalog ----------
const catalogSheet = ref(false)
const catalogDialog = ref(false)
const catalogDraft = reactive<{ id: string; name: string; unit: string; price: number | null }>({ id: '', name: '', unit: '', price: null })

const persistCatalog = () => writeStorage(STORAGE.catalog, catalog.value)

const openCatalogDialog = (entry?: CatalogEntry) => {
  Object.assign(catalogDraft, entry ? { ...entry } : { id: '', name: '', unit: '', price: null })
  catalogDialog.value = true
}

const saveCatalogEntry = () => {
  const entry: CatalogEntry = {
    id: catalogDraft.id || uid(),
    name: catalogDraft.name.trim(),
    unit: catalogDraft.unit.trim(),
    price: Number(catalogDraft.price) || 0
  }
  const index = catalog.value.findIndex(e => e.id === entry.id)
  if (index >= 0) catalog.value.splice(index, 1, entry)
  else catalog.value.push(entry)
  catalog.value.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  persistCatalog()
  catalogDialog.value = false
}

const deleteCatalogEntry = (id: string) => {
  catalog.value = catalog.value.filter(e => e.id !== id)
  persistCatalog()
  catalogDialog.value = false
}

const addFromCatalog = (entry: CatalogEntry) => {
  addItem({ description: entry.name, unit: entry.unit, unitPrice: entry.price })
  catalogSheet.value = false
  notify(`${entry.name} agregado`)
}

const goToCatalog = () => {
  catalogSheet.value = false
  subTab.value = 'catalog'
}

// ---------- Confirm & feedback ----------
type ConfirmKind = 'clearForm' | 'clearHistory'
const confirmDialog = reactive<{ open: boolean; kind: ConfirmKind | null; title: string; text: string }>({
  open: false,
  kind: null,
  title: '',
  text: ''
})

const confirmAction = (kind: ConfirmKind) => {
  Object.assign(confirmDialog, kind === 'clearForm'
    ? { kind, title: '¿Limpiar la cotización?', text: 'Se borrarán los datos del cliente y todos los ítems.' }
    : { kind, title: '¿Borrar el historial?', text: 'Se eliminarán todas las cotizaciones guardadas.' })
  confirmDialog.open = true
}

const runConfirmed = () => {
  if (confirmDialog.kind === 'clearForm') resetForm()
  if (confirmDialog.kind === 'clearHistory') {
    savedQuotes.value = []
    persistQuotes()
  }
  confirmDialog.open = false
}

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const notify = (text: string, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  savedQuotes.value = readStorage<SavedQuote[]>(STORAGE.quotes, [])
  catalog.value = readStorage<CatalogEntry[]>(STORAGE.catalog, [])
  const draft = readStorage<QuoteForm | null>(STORAGE.draft, null)
  if (draft && Array.isArray(draft.items)) Object.assign(quoteForm, draft)
})
</script>

<style scoped>
.section-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.segmented {
  width: 100%;
  height: 48px !important;
  padding: 4px;
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--card-border);
}

.segmented :deep(.v-btn) {
  flex: 1 1 0;
  height: 40px !important;
  border-radius: 12px !important;
  border: 0 !important;
}

.qty-field {
  flex: 0 0 38%;
}

.history-footer {
  border-top: 1px solid var(--card-border);
}

.has-total-bar {
  padding-bottom: 96px !important;
}

.total-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--dock-h) + var(--dock-gap) * 2 + env(safe-area-inset-bottom, 0px));
  z-index: 1005;
  padding: 0 var(--dock-gap);
  pointer-events: none;
}

.total-bar__inner {
  pointer-events: auto;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 18px;
  border-radius: 20px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.35);
}

.total-bar__label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
}

.total-bar__value {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.sheet-card {
  border-radius: 24px 24px 0 0 !important;
}

.sheet-list {
  max-height: 55vh;
  overflow-y: auto;
}

.min-width-0 {
  min-width: 0;
}
</style>
