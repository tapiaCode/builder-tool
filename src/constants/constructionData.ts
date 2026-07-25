// src/constants/constructionData.ts

// Conversiones Base (Volumen)
// 1 m3 = 1000 Litros
export const CONVERSIONS = {
  BUCKET_20L_TO_M3: 0.02, // 1 Balde de 20L = 0.02 m3
  M3_TO_BUCKETS_20L: 50, // 1 m3 = 50 Baldes de 20L
  WHEELBARROW_TO_M3: 0.06, // 1 Carretilla (promedio) = 60L = 0.06 m3
  M3_TO_WHEELBARROWS: 16.67, // 1 m3 = ~16.67 Carretillas
  TRUCK_TO_M3: 12, // 1 Volqueta estándar = 12 m3 (varia por región, promedio 12-14)
  M3_TO_TRUCKS: 1 / 12, // 1 m3 = 0.083 Volquetas
  CEMENT_BAG_KG: 50, // 1 Bolsa de cemento = 50 Kg
  CEMENT_BAG_LITERS: 35, // Volumen suelto de 1 bolsa de 50kg aprox 35L = 0.035 m3
}

// Dosificaciones (Cantidades requeridas por 1 m3 de mezcla producida)
export const DOSIFICATIONS = {
  CONCRETE: {
    // Proporción Cemento:Arena:Grava
    '1:2:3': { // Hormigón Estructural (Columnas, Vigas)
      cementKg: 350,
      sandM3: 0.56,
      gravelM3: 0.84,
      waterL: 180,
    },
    '1:2:4': { // Hormigón Ciclópeo / Zapatas
      cementKg: 300,
      sandM3: 0.45,
      gravelM3: 0.90,
      waterL: 170,
    }
  },
  MORTAR: { // Morteros de Asentado / Revoque
    '1:3': { // Revoque fino / Impermeable
      cementKg: 450,
      sandM3: 1.08,
      waterL: 250,
    },
    '1:4': { // Asentado de Ladrillo
      cementKg: 340,
      sandM3: 1.05,
      waterL: 230,
    },
    '1:5': { // Contrapisos / Asentado menos estructural
      cementKg: 280,
      sandM3: 1.08,
      waterL: 220,
    },
    '1:3:5': { // Falso piso / Hormigón pobre
      cementKg: 210,
      sandM3: 0.48,
      gravelM3: 0.80,
      waterL: 160,
    }
  }
}

// Rendimientos
export const YIELDS = {
  BRICKS: { // Unidades por m2 incluyendo junta de 1.5cm
    '6_holes_soga': 40, // Ladrillo 6 huecos (soga)
    '6_holes_tizón': 70, // Ladrillo 6 huecos (tizón)
    '18_holes': 36, // Ladrillo 18 huecos
    'visto': 60, // Ladrillo visto
    'block': 12.5 // Bloque de hormigón (20x20x40)
  },
  TILES: {
    'cement_glue_kg_m2': 4, // Cemento cola (4 a 5 kg/m2)
    'grout_kg_m2': 0.2 // Fragua (200g/m2 promedio)
  },
  PAINT: {
    'latex_m2_per_gal_2_coats': 30, // 30 m2 por galón a 2 manos
    'latex_m2_per_bucket_2_coats': 150 // 150 m2 por balde (18L/5Gal) a 2 manos
  }
}

// Factores de desperdicio (Opciones)
export const WASTE_FACTORS = [
  { label: '5% (Preciso)', value: 1.05 },
  { label: '10% (Estándar)', value: 1.10 },
  { label: '15% (Complejo)', value: 1.15 }
]
