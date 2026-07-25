// src/services/calculatorEngine.ts
import { DOSIFICATIONS, YIELDS, CONVERSIONS } from '@/constants/constructionData'

export interface CalculationResult {
  cementBags: number
  sandM3: number
  gravelM3: number
  waterL: number
  sandWheelbarrows: number
  gravelWheelbarrows: number
  [key: string]: number
}

// Helpers
export const m3ToWheelbarrows = (m3: number) => Math.ceil(m3 * CONVERSIONS.M3_TO_WHEELBARROWS)
export const kgToBags = (kg: number) => Math.ceil(kg / CONVERSIONS.CEMENT_BAG_KG)
export const m3ToTrucks = (m3: number) => Number((m3 * CONVERSIONS.M3_TO_TRUCKS).toFixed(2))

/**
 * Calcula materiales para elementos de hormigón
 */
export function calculateConcrete(
  volumeM3: number, 
  proportion: keyof typeof DOSIFICATIONS.CONCRETE = '1:2:3', 
  wasteFactor = 1.05
): CalculationResult {
  const dosif = DOSIFICATIONS.CONCRETE[proportion]
  const totalVolume = volumeM3 * wasteFactor
  
  const cementKg = totalVolume * dosif.cementKg
  const sandM3 = totalVolume * dosif.sandM3
  const gravelM3 = totalVolume * dosif.gravelM3
  const waterL = totalVolume * dosif.waterL

  return {
    cementBags: kgToBags(cementKg),
    sandM3: Number(sandM3.toFixed(2)),
    gravelM3: Number(gravelM3.toFixed(2)),
    waterL: Math.ceil(waterL),
    sandWheelbarrows: m3ToWheelbarrows(sandM3),
    gravelWheelbarrows: m3ToWheelbarrows(gravelM3)
  }
}

/**
 * Calcula materiales para muros de ladrillo (incluye mortero)
 */
export function calculateWall(
  areaM2: number, 
  brickType: keyof typeof YIELDS.BRICKS = '6_holes_soga',
  mortarProportion: keyof typeof DOSIFICATIONS.MORTAR = '1:4',
  wasteFactor = 1.10
) {
  // 1. Cantidad de ladrillos
  const baseBricks = areaM2 * YIELDS.BRICKS[brickType]
  const totalBricks = Math.ceil(baseBricks * wasteFactor)

  // 2. Volumen de mortero (aprox 0.025 m3 por m2 para muros de soga)
  // Dependerá del espesor del muro, asumimos soga estándar (0.15m) -> 0.025 m3/m2
  let mortarM3PerM2 = 0.025
  if (brickType === '6_holes_tizón') mortarM3PerM2 = 0.05
  if (brickType === 'block') mortarM3PerM2 = 0.015

  const totalMortarM3 = areaM2 * mortarM3PerM2 * wasteFactor
  const dosif = DOSIFICATIONS.MORTAR[mortarProportion]

  const cementKg = totalMortarM3 * dosif.cementKg
  const sandM3 = totalMortarM3 * dosif.sandM3
  const waterL = totalMortarM3 * dosif.waterL

  return {
    totalBricks,
    cementBags: kgToBags(cementKg),
    sandM3: Number(sandM3.toFixed(2)),
    waterL: Math.ceil(waterL),
    sandWheelbarrows: m3ToWheelbarrows(sandM3),
    gravelM3: 0,
    gravelWheelbarrows: 0
  }
}

/**
 * Calcula materiales para pisos/revestimientos
 */
export function calculateTiling(areaM2: number, wasteFactor = 1.05) {
  const totalArea = areaM2 * wasteFactor
  const glueKg = totalArea * YIELDS.TILES.cement_glue_kg_m2
  const groutKg = totalArea * YIELDS.TILES.grout_kg_m2
  
  return {
    areaM2: Number(totalArea.toFixed(2)),
    glueBags20kg: Math.ceil(glueKg / 20),
    groutBags1kg: Math.ceil(groutKg)
  }
}

/**
 * Calcula cantidad de pintura
 */
export function calculatePaint(areaM2: number) {
  const gallons = areaM2 / YIELDS.PAINT.latex_m2_per_gal_2_coats
  const buckets = areaM2 / YIELDS.PAINT.latex_m2_per_bucket_2_coats
  
  return {
    gallons: Number(gallons.toFixed(1)),
    buckets: Number(buckets.toFixed(1))
  }
}
