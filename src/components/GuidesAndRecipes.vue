<template>
    <v-container class="py-4">
        <!-- Header Banner -->
        <v-card class="mb-4 overflow-hidden rounded-xl stat-card-gradient-success border-0 elevation-4">
            <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between">
                    <div>
                        <div class="text-overline text-success font-weight-bold tracking-wider">MANUAL DEL ALBAÑIL — BOLIVIA</div>
                        <h2 class="text-h5 font-weight-black text-on-surface mb-1">Guías & Recetario Técnico</h2>
                        <p class="text-body-2 text-medium-emphasis mb-0">Medidas prácticas de obra: baldes, carretillas, fierros y ladrillos locales</p>
                    </div>
                    <v-avatar color="success" size="52" class="elevation-4 pulse-badge flex-shrink-0 ml-2">
                        <v-icon :icon="mdiBookOpenPageVariant" size="28" color="white" />
                    </v-avatar>
                </div>
            </v-card-text>
        </v-card>

        <!-- Interactive Quick Mixer Calculator -->
        <v-card class="rounded-xl border-0 elevation-2 pa-4 mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
                <h3 class="text-subtitle-1 font-weight-bold d-flex align-center">
                    <v-icon :icon="mdiFilterVariant" color="primary" class="mr-2" />
                    Calculadora Rápida de Mezclas
                </h3>
                <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold">
                    Baldes de 20L
                </v-chip>
            </div>
            
            <p class="text-caption text-medium-emphasis mb-3">
                Selecciona la cantidad de bolsas de cemento (50 kg) y el tipo de trabajo para ver las proporciones exactas en baldes y carretillas:
            </p>

            <!-- Number of Bags Selection -->
            <v-row density="compact" align="center" class="mb-2">
                <v-col cols="12" sm="4">
                    <v-text-field
                        v-model.number="bagsCount"
                        label="Bolsas de Cemento (50 kg)"
                        type="number"
                        min="1"
                        max="100"
                        variant="outlined"
                        density="compact"
                        hide-details
                    />
                </v-col>
                <v-col cols="12" sm="8">
                    <v-chip-group v-model="bagsCount" mandatory color="primary" class="py-0">
                        <v-chip :value="1" filter size="small">1 Bolsa</v-chip>
                        <v-chip :value="2" filter size="small">2 Bolsas</v-chip>
                        <v-chip :value="3" filter size="small">3 Bolsas</v-chip>
                        <v-chip :value="5" filter size="small">5 Bolsas</v-chip>
                        <v-chip :value="10" filter size="small">10 Bolsas</v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>

            <!-- Mix Type Chips -->
            <div class="text-caption font-weight-bold text-medium-emphasis mb-1">Tipo de trabajo o estructura:</div>
            <v-chip-group v-model="mixType" mandatory color="primary" class="mb-3">
                <v-chip value="structural" filter size="small" variant="elevated">
                    1:2:3 Hormigón Estructural
                </v-chip>
                <v-chip value="subfloor" filter size="small" variant="elevated">
                    1:2:4 Contrapisos / Aceras
                </v-chip>
                <v-chip value="mortar_wall" filter size="small" variant="elevated">
                    1:4 Asentado de Ladrillo
                </v-chip>
                <v-chip value="plaster" filter size="small" variant="elevated">
                    1:3 Revoque Fino
                </v-chip>
            </v-chip-group>

            <!-- Mix Description Alert -->
            <v-alert density="compact" variant="tonal" :color="currentMix.color" class="mb-4 text-caption rounded-lg">
                <strong>{{ currentMix.name }}:</strong> {{ currentMix.desc }}
            </v-alert>

            <!-- Calculated Equivalents -->
            <v-row density="compact">
                <!-- Arena -->
                <v-col cols="6" sm="3">
                    <v-card class="pa-3 rounded-lg stat-card-gradient-primary text-center h-100 d-flex flex-column justify-center align-center">
                        <v-icon :icon="mdiBucketOutline" color="primary" class="mb-1" />
                        <div class="text-h6 font-weight-bold">{{ totalSand }}</div>
                        <div class="text-caption text-medium-emphasis">Baldes Arena (20L)</div>
                        <v-chip size="x-small" color="primary" class="mt-1">~{{ sandBarrows }} Carretillas</v-chip>
                    </v-card>
                </v-col>

                <!-- Ripio -->
                <v-col cols="6" sm="3">
                    <v-card class="pa-3 rounded-lg stat-card-gradient-accent text-center h-100 d-flex flex-column justify-center align-center">
                        <v-icon :icon="mdiDotsGrid" color="accent" class="mb-1" />
                        <template v-if="currentMix.gravelBuckets > 0">
                            <div class="text-h6 font-weight-bold">{{ totalGravel }}</div>
                            <div class="text-caption text-medium-emphasis">Baldes Ripio (20L)</div>
                            <v-chip size="x-small" color="accent" class="mt-1">~{{ gravelBarrows }} Carretillas</v-chip>
                        </template>
                        <template v-else>
                            <div class="text-h6 font-weight-bold text-medium-emphasis">0</div>
                            <div class="text-caption text-medium-emphasis">Sin Ripio</div>
                            <v-chip size="x-small" color="grey" variant="tonal" class="mt-1">Solo mortero</v-chip>
                        </template>
                    </v-card>
                </v-col>

                <!-- Agua -->
                <v-col cols="6" sm="3">
                    <v-card class="pa-3 rounded-lg stat-card-gradient-success text-center h-100 d-flex flex-column justify-center align-center">
                        <v-icon :icon="mdiWater" color="info" class="mb-1" />
                        <div class="text-h6 font-weight-bold">{{ totalWater }}</div>
                        <div class="text-caption text-medium-emphasis">Baldes Agua (~20L)</div>
                        <v-chip size="x-small" color="info" class="mt-1">~{{ totalWaterLiters }} Litros</v-chip>
                    </v-card>
                </v-col>

                <!-- Resumen / Resistencia -->
                <v-col cols="6" sm="3">
                    <v-card class="pa-3 rounded-lg border-0 bg-surface-variant text-center h-100 d-flex flex-column justify-center align-center">
                        <v-icon :icon="mdiCheckDecagram" :color="currentMix.color" class="mb-1" />
                        <div class="text-subtitle-2 font-weight-bold">{{ currentMix.ratioLabel }}</div>
                        <div class="text-caption text-medium-emphasis">Dosificación</div>
                        <v-chip size="x-small" :color="currentMix.color" class="mt-1">{{ currentMix.badge }}</v-chip>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>

        <!-- Technical Accordion Cards -->
        <v-expansion-panels variant="popout" class="rounded-xl">
            <!-- PANEL 1: Equivalencias en Bolivia -->
            <v-expansion-panel class="rounded-xl mb-2">
                <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
                    <v-icon :icon="mdiScaleBalance" color="primary" class="mr-3" />
                    1. Medidas y Equivalencias Populares en Bolivia
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <p class="text-caption text-medium-emphasis mb-3">
                        En las ferreterías y obras de Comarapa y Bolivia se usan medidas de volumen prácticas. Estas son las equivalencias reales:
                    </p>

                    <v-row density="compact">
                        <v-col cols="12" sm="6">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2">
                                <div class="d-flex align-center mb-1">
                                    <v-avatar color="primary" variant="tonal" size="28" class="mr-2">
                                        <v-icon :icon="mdiBucketOutline" size="16" />
                                    </v-avatar>
                                    <strong class="text-body-2">1 Balde de Albañil</strong>
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                    Equivale al balde común de pintura de <strong>18 a 20 Litros</strong>. Es la medida estándar de dosificación en obra.
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2">
                                <div class="d-flex align-center mb-1">
                                    <v-avatar color="accent" variant="tonal" size="28" class="mr-2">
                                        <v-icon :icon="mdiLayersOutline" size="16" />
                                    </v-avatar>
                                    <strong class="text-body-2">1 Carretilla Estándar</strong>
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                    Equivale a <strong>2 a 2.5 baldes colmados</strong> (aprox. 50 a 60 Litros / 2 pies cúbicos de material).
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2">
                                <div class="d-flex align-center mb-1">
                                    <v-avatar color="warning" variant="tonal" size="28" class="mr-2">
                                        <v-icon :icon="mdiCubeOutline" size="16" />
                                    </v-avatar>
                                    <strong class="text-body-2">1 Metro Cúbico (1 m³)</strong>
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                    Equivale a <strong>50 baldes de 20L</strong> o unas <strong>20 a 22 carretillas</strong> de arena o ripio.
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2">
                                <div class="d-flex align-center mb-1">
                                    <v-avatar color="success" variant="tonal" size="28" class="mr-2">
                                        <v-icon :icon="mdiCheckDecagram" size="16" />
                                    </v-avatar>
                                    <strong class="text-body-2">1 Bolsa de Cemento (50 kg)</strong>
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                    Marcas nacionales (Warnes, Fancesa, Viacha, Coboce). Su volumen en polvo suelto equivale a unos <strong>2.5 baldes</strong>.
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-alert density="compact" variant="tonal" color="info" class="mt-2 text-caption">
                        <strong>Camionadas de Áridos:</strong> Una volqueta chica de río suele transportar <strong>4 m³</strong> (~80 carretillas), y una volqueta grande transporta entre <strong>6 y 8 m³</strong>.
                    </v-alert>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- PANEL 2: Fierro de Construcción en Bolivia -->
            <v-expansion-panel class="rounded-xl mb-2">
                <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
                    <v-icon :icon="mdiHammerWrench" color="accent" class="mr-3" />
                    2. Fierro Corrugado y Armaduras (Barras de 12 Metros)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <p class="text-caption text-medium-emphasis mb-3">
                        En Bolivia, el acero corrugado se comercializa en barras estándar de <strong>12 metros</strong> de longitud. Esta tabla te ayuda a calcular el peso y uso de cada diámetro:
                    </p>

                    <v-table density="compact" class="border rounded-lg mb-3">
                        <thead>
                            <tr class="bg-surface-variant">
                                <th class="text-left font-weight-bold">Diámetro</th>
                                <th class="text-left font-weight-bold">Peso / Metro</th>
                                <th class="text-left font-weight-bold">Peso Barra (12m)</th>
                                <th class="text-left font-weight-bold">Uso Común en Obra</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>6 mm</strong> (1/4")</td>
                                <td>0.222 kg/m</td>
                                <td>~2.66 kg</td>
                                <td>Estribos ("chanchitas") en columnas y vigas</td>
                            </tr>
                            <tr>
                                <td><strong>8 mm</strong> (5/16")</td>
                                <td>0.395 kg/m</td>
                                <td>~4.74 kg</td>
                                <td>Refuerzo secundario, dinteles, losas livianas</td>
                            </tr>
                            <tr>
                                <td><strong>10 mm</strong> (3/8")</td>
                                <td>0.617 kg/m</td>
                                <td>~7.40 kg</td>
                                <td>Fierro principal en columnas y vigas de viviendas (1 planta)</td>
                            </tr>
                            <tr>
                                <td><strong>12 mm</strong> (1/2")</td>
                                <td>0.888 kg/m</td>
                                <td>~10.66 kg</td>
                                <td>Columnas principales, vigas portantes y zapatas (2 plantas)</td>
                            </tr>
                            <tr>
                                <td><strong>16 mm</strong> (5/8")</td>
                                <td>1.578 kg/m</td>
                                <td>~18.94 kg</td>
                                <td>Estructuras de alta carga, zapatas aisladas pesadas</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-card class="pa-3 rounded-lg border bg-surface mb-2">
                        <div class="font-weight-bold text-subtitle-2 text-primary mb-1">Reglas de Oro para Armaduras:</div>
                        <ul class="text-caption text-medium-emphasis pl-4">
                            <li class="mb-1"><strong>Doblado de Estribos:</strong> Los ganchos deben cerrarse a <strong>135°</strong> con patilla de mínimo 6 a 8 cm (nunca a 90°, porque se abren bajo carga).</li>
                            <li class="mb-1"><strong>Separación de Estribos:</strong> Colocar cada 15 a 20 cm en el medio de la columna, y más pegados (cada 10 cm) en la unión con zapatas y vigas.</li>
                            <li class="mb-1"><strong>Recubrimiento Mínimo:</strong> Usar "galletas" de mortero de <strong>2.5 a 3 cm</strong> para que el fierro no toque la madera y quede protegido del óxido.</li>
                            <li><strong>Alambre de Amarre:</strong> Se utiliza Alambre Negro Recocido N° 16. Rinde aprox. 1 kg de alambre por cada 80-100 kg de fierro armado.</li>
                        </ul>
                    </v-card>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- PANEL 3: Ladrillos en Comarapa -->
            <v-expansion-panel class="rounded-xl mb-2">
                <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
                    <v-icon :icon="mdiWall" color="primary" class="mr-3" />
                    3. Guía de Ladrillos Locales (Adobito vs 6 Huecos)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <p class="text-caption text-medium-emphasis mb-3">
                        En los valles cruceños y Comarapa se utilizan principalmente dos tipos de ladrillos. Conoce sus diferencias y rendimiento:
                    </p>

                    <v-row density="compact">
                        <v-col cols="12" sm="6">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2 h-100">
                                <div class="d-flex align-center justify-space-between mb-2">
                                    <div class="font-weight-bold text-body-2 text-primary">Ladrillo Adobito Comarapa</div>
                                    <v-chip size="x-small" color="primary">10 × 5 × 21 cm</v-chip>
                                </div>
                                <ul class="text-caption text-medium-emphasis pl-4 mb-2">
                                    <li><strong>Muro de Soga (10 cm ancho):</strong> ~65 a 70 ladrillos por m².</li>
                                    <li><strong>Muro de Tizón (21 cm ancho):</strong> ~120 a 130 ladrillos por m² (gran firmeza y muro portante).</li>
                                    <li><strong>Ventajas:</strong> Muy resistente, excelente para muros a la vista o fachadas rústicas.</li>
                                    <li><strong>Recomendación Vital:</strong> <em>Remojar abundantemente</em> antes de asentar para que no absorba el agua del mortero.</li>
                                </ul>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2 h-100">
                                <div class="d-flex align-center justify-space-between mb-2">
                                    <div class="font-weight-bold text-body-2 text-accent">Ladrillo Cerámico 6 Huecos</div>
                                    <v-chip size="x-small" color="accent">10 × 15 × 24 cm</v-chip>
                                </div>
                                <ul class="text-caption text-medium-emphasis pl-4 mb-2">
                                    <li><strong>De Canto / Panderete (10 cm ancho):</strong> ~25 a 27 piezas por m².</li>
                                    <li><strong>De Soga (15 cm ancho):</strong> ~33 piezas por m².</li>
                                    <li><strong>Ventajas:</strong> Construcción muy rápida, muro liviano, gran aislamiento térmico contra el calor y el frío.</li>
                                    <li><strong>Ahorro:</strong> Consume menos bolsas de cemento y arena por m² de pared en comparación al adobito.</li>
                                </ul>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-alert density="compact" variant="tonal" color="warning" class="mt-2 text-caption">
                        <strong>Traba de Paredes:</strong> Nunca alinear las juntas verticales de los ladrillos. El traslape mínimo entre hiladas debe ser de al menos 1/3 o 1/2 del largo del ladrillo para garantizar solidez estructural.
                    </v-alert>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- PANEL 4: Tiempos de Desencofrado y Curado -->
            <v-expansion-panel class="rounded-xl mb-2">
                <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
                    <v-icon :icon="mdiTimerSand" color="warning" class="mr-3" />
                    4. Tiempos de Desencofrado y Curado en Comarapa
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <p class="text-caption text-medium-emphasis mb-3">
                        En Comarapa, el sol radiante y el viento seco pueden evaporar el agua antes de tiempo. No apresures el retiro de maderas:
                    </p>

                    <v-timeline density="compact" align="start" class="mb-3">
                        <v-timeline-item dot-color="warning" size="x-small">
                            <div class="font-weight-bold text-body-2">24 a 48 Horas — Costados Laterales</div>
                            <div class="text-caption text-medium-emphasis">Laterales de columnas, vigas y sobrecimientos que no soportan peso vertical directo.</div>
                        </v-timeline-item>
                        <v-timeline-item dot-color="primary" size="x-small">
                            <div class="font-weight-bold text-body-2">14 a 21 Días — Fondos de Losas</div>
                            <div class="text-caption text-medium-emphasis">Tableros de fondo de losas alivianadas y puntales intermedios de seguridad.</div>
                        </v-timeline-item>
                        <v-timeline-item dot-color="success" size="x-small">
                            <div class="font-weight-bold text-body-2">21 a 28 Días — Vigas Portantes Mayores</div>
                            <div class="text-caption text-medium-emphasis">Fondos de vigas principales y elementos de luces mayores a 4 metros. El hormigón alcanza su 100% de resistencia a los 28 días.</div>
                        </v-timeline-item>
                    </v-timeline>

                    <v-card class="pa-3 rounded-lg border-start-primary border bg-surface">
                        <div class="d-flex align-center mb-1">
                            <v-icon :icon="mdiWaterOutline" color="info" class="mr-2" />
                            <strong class="text-subtitle-2 text-info">Regla de Oro del Curado (Mínimo 7 días)</strong>
                        </div>
                        <p class="text-caption text-medium-emphasis mb-0">
                            El cemento no se "seca", se <strong>hidrata químicamente</strong>. Si se seca por el sol, se "quema" y se desmorona.
                            Riega el vaciado <strong>3 veces al día durante al menos 7 días seguidos</strong>. En losas, crea pequeños diques de arena y mantén 2 cm de agua encharcada ("arrocerío").
                        </p>
                    </v-card>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- PANEL 5: Pisos y Revestimientos -->
            <v-expansion-panel class="rounded-xl mb-2">
                <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
                    <v-icon :icon="mdiGrid" color="teal" class="mr-3" />
                    5. Colocación de Pisos y Cerámicas (Pegamento y Pastina)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <p class="text-caption text-medium-emphasis mb-3">
                        Para que el piso no se sople, no suene hueco y dure toda la vida, sigue estos pasos:
                    </p>

                    <v-row density="compact">
                        <v-col cols="12" sm="4">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2 h-100">
                                <strong class="text-body-2 text-primary d-block mb-1">1. Base y Carpeta</strong>
                                <div class="text-caption text-medium-emphasis">
                                    El contrapiso debe tener 5-7 cm de grosor. Encima, la carpeta de nivelación (2-3 cm) debe estar limpia, firme y sin desniveles.
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2 h-100">
                                <strong class="text-body-2 text-accent d-block mb-1">2. Cemento Cola (Pegamento)</strong>
                                <div class="text-caption text-medium-emphasis">
                                    Usa llana dentada de 8 o 10 mm. Una bolsa de <strong>20 a 25 kg</strong> rinde entre <strong>4 a 5 m²</strong> de piso. Para patios o porcelanatos, usa pegamento especial flexible.
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-card class="pa-3 rounded-lg border bg-surface mb-2 h-100">
                                <strong class="text-body-2 text-success d-block mb-1">3. Pastina (Fragua)</strong>
                                <div class="text-caption text-medium-emphasis">
                                    Aplicar 24 a 48 horas después del pegado. 1 kg de pastina rinde <strong>3 a 5 m²</strong>. Limpiar con esponja húmeda a los 30 minutos antes del endurecimiento final.
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- PANEL 6: Los 5 Errores Fatales -->
            <v-expansion-panel class="rounded-xl mb-2">
                <v-expansion-panel-title class="font-weight-bold text-subtitle-1 text-error">
                    <v-icon :icon="mdiAlertOctagonOutline" color="error" class="mr-3" />
                    6. Los 5 Errores Más Graves a Evitar en Obra
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-list density="compact" lines="two">
                        <v-list-item class="px-0">
                            <template #prepend>
                                <v-icon :icon="mdiCloseCircle" color="error" class="mr-3" />
                            </template>
                            <v-list-item-title class="font-weight-bold text-error">1. Echar exceso de agua a la mezcla</v-list-item-title>
                            <v-list-item-subtitle>
                                Aunque "corra más fácil", el exceso de agua disminuye drásticamente la resistencia del hormigón y causa grietas y fisuras.
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                            <template #prepend>
                                <v-icon :icon="mdiCloseCircle" color="error" class="mr-3" />
                            </template>
                            <v-list-item-title class="font-weight-bold text-error">2. Asentar ladrillos completamente secos</v-list-item-title>
                            <v-list-item-subtitle>
                                El ladrillo seco succiona el agua del mortero al instante; la mezcla no fragua, se vuelve polvillo y la pared queda débil.
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                            <template #prepend>
                                <v-icon :icon="mdiCloseCircle" color="error" class="mr-3" />
                            </template>
                            <v-list-item-title class="font-weight-bold text-error">3. Dejar los fierros pegados a la madera (encofrado)</v-list-item-title>
                            <v-list-item-subtitle>
                                Sin recubrimiento de hormigón (mínimo 2.5 cm), el fierro queda expuesto al aire, la lluvia lo oxida y la columna se fisura.
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                            <template #prepend>
                                <v-icon :icon="mdiCloseCircle" color="error" class="mr-3" />
                            </template>
                            <v-list-item-title class="font-weight-bold text-error">4. Doblar los ganchos de estribos a 90°</v-list-item-title>
                            <v-list-item-subtitle>
                                Los estribos deben cerrarse a <strong>135°</strong> hacia el interior de la columna para evitar que se abran en caso de sobrecarga o temblor.
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item class="px-0">
                            <template #prepend>
                                <v-icon :icon="mdiCloseCircle" color="error" class="mr-3" />
                            </template>
                            <v-list-item-title class="font-weight-bold text-error">5. Usar arena sucia con tierra o barro</v-list-item-title>
                            <v-list-item-subtitle>
                                La arena de río debe estar limpia y lavada. La presencia de tierra o greda impide que el cemento se pegue firmemente con la piedra.
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    mdiBookOpenPageVariant,
    mdiFilterVariant,
    mdiBucketOutline,
    mdiDotsGrid,
    mdiWater,
    mdiCheckDecagram,
    mdiTimerSand,
    mdiWaterOutline,
    mdiWall,
    mdiCubeOutline,
    mdiGrid,
    mdiScaleBalance,
    mdiAlertOctagonOutline,
    mdiHammerWrench,
    mdiLayersOutline,
    mdiCloseCircle,
} from '@mdi/js'

const bagsCount = ref(1)
const mixType = ref('structural')

const mixConfigs = {
    structural: {
        name: 'Hormigón Estructural',
        ratioLabel: '1 : 2 : 3',
        desc: 'Ideal para zapatas, columnas, vigas portantes y losas de hormigón armado.',
        sandBuckets: 4,
        gravelBuckets: 6,
        waterBuckets: 1.2,
        waterLiters: 24,
        badge: 'Firmeza Estructural',
        color: 'primary',
    },
    subfloor: {
        name: 'Hormigón Simple / Contrapiso',
        ratioLabel: '1 : 2 : 4',
        desc: 'Para contrapisos sobre tierra, aceras, veredas y soleras de apoyo.',
        sandBuckets: 4,
        gravelBuckets: 8,
        waterBuckets: 1.3,
        waterLiters: 26,
        badge: 'Base de Piso',
        color: 'warning',
    },
    mortar_wall: {
        name: 'Mortero Asentado de Ladrillo',
        ratioLabel: '1 : 4 (Sin ripio)',
        desc: 'Para pegar ladrillo adobito o cerámico 6 huecos con junta uniforme de 1.5 a 2 cm.',
        sandBuckets: 8,
        gravelBuckets: 0,
        waterBuckets: 1.5,
        waterLiters: 30,
        badge: 'Mampostería Firme',
        color: 'accent',
    },
    plaster: {
        name: 'Mortero de Revoque Fino',
        ratioLabel: '1 : 3 (Arena cernida)',
        desc: 'Para revoques y enlucidos lisos con arena fina cernida en paredes interiores y exteriores.',
        sandBuckets: 6,
        gravelBuckets: 0,
        waterBuckets: 1.4,
        waterLiters: 28,
        badge: 'Enlucido Fino',
        color: 'success',
    },
}

const currentMix = computed(() => mixConfigs[mixType.value as keyof typeof mixConfigs])

const totalSand = computed(() => Math.round(bagsCount.value * currentMix.value.sandBuckets * 10) / 10)
const sandBarrows = computed(() => (totalSand.value / 2).toFixed(1))

const totalGravel = computed(() => Math.round(bagsCount.value * currentMix.value.gravelBuckets * 10) / 10)
const gravelBarrows = computed(() => (totalGravel.value / 2).toFixed(1))

const totalWater = computed(() => (bagsCount.value * currentMix.value.waterBuckets).toFixed(1))
const totalWaterLiters = computed(() => Math.round(bagsCount.value * currentMix.value.waterLiters))
</script>

<style scoped>
.border-start-primary {
    border-left: 5px solid rgb(var(--v-theme-primary)) !important;
}
</style>
