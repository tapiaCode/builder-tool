// src/services/calculatorEngine.ts
import { DOSIFICATIONS, YIELDS, CONVERSIONS } from '@/constants/constructionData'

export interface CalculationResult {
  cementBags: number
  sandM3: number
  ripioM3: number
  waterL: number
  sandWheelbarrows: number
  ripioWheelbarrows: number
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
  wasteFactor = 1.0
): CalculationResult {
  const dosif = DOSIFICATIONS.CONCRETE[proportion]
  const totalVolume = volumeM3 * wasteFactor
  
  const cementKg = totalVolume * dosif.cementKg
  const sandM3 = totalVolume * dosif.sandM3
  const ripioM3 = totalVolume * dosif.gravelM3
  const waterL = totalVolume * dosif.waterL

  return {
    cementBags: kgToBags(cementKg),
    sandM3: Number(sandM3.toFixed(2)),
    ripioM3: Number(ripioM3.toFixed(2)),
    waterL: Math.ceil(waterL),
    sandWheelbarrows: m3ToWheelbarrows(sandM3),
    ripioWheelbarrows: m3ToWheelbarrows(ripioM3)
  }
}

/**
 * Calcula materiales para muros de ladrillo (incluye mortero)
 */
export function calculateWall(
  areaM2: number, 
  brickType: keyof typeof YIELDS.BRICKS = '6_holes',
  mortarProportion: keyof typeof DOSIFICATIONS.MORTAR = '1:4',
  wasteFactor = 1.0
) {
  // 1. Cantidad de ladrillos (sin desperdicio por defecto)
  const baseBricks = areaM2 * YIELDS.BRICKS[brickType]
  const totalBricks = Math.ceil(baseBricks * wasteFactor)

  // 2. Volumen de mortero en m3 por m2 para muro de soga (10 cm de espesor)
  // Ladrillo 6 Huecos (10×15×24 cm): ~0.022 m3/m2
  // Ladrillo Adobito (10×5×21 cm): ~0.028 m3/m2
  let mortarM3PerM2 = 0.022
  if (brickType === 'adobito') mortarM3PerM2 = 0.028

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
    ripioM3: 0,
    ripioWheelbarrows: 0
  }
}

/**
 * Calcula materiales para pisos/revestimientos y cantidad de piezas de cerámica
 */
export function calculateTiling(
  areaM2: number, 
  wasteFactor = 1.0, 
  tileWidthCm = 40, 
  tileHeightCm = 40
) {
  const totalArea = areaM2 * wasteFactor
  const glueKg = totalArea * YIELDS.TILES.cement_glue_kg_m2
  const groutKg = totalArea * YIELDS.TILES.grout_kg_m2
  
  // Área por pieza de cerámica en m²
  const tileAreaM2 = (tileWidthCm / 100) * (tileHeightCm / 100)
  const totalTiles = tileAreaM2 > 0 ? Math.ceil(totalArea / tileAreaM2) : 0

  return {
    areaM2: Number(totalArea.toFixed(2)),
    glueBags20kg: Math.ceil(glueKg / 20),
    groutBags1kg: Math.ceil(groutKg),
    totalTiles,
    tileWidthCm,
    tileHeightCm
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

/**
 * Calcula todos los materiales requeridos para una habitación completa (Cuarto)
 */
export function calculateRoom(
  lengthM: number,
  widthM: number,
  heightM: number,
  brickType: keyof typeof YIELDS.BRICKS = '6_holes',
  doorWindowOpeningsM2 = 4,
  includeFloorTile = true,
  includeConcreteSlab = true,
  wasteFactor = 1.0
) {
  const perimeter = 2 * (lengthM + widthM)
  const grossWallArea = perimeter * heightM
  const netWallArea = Math.max(0, grossWallArea - doorWindowOpeningsM2)
  const wallRes = calculateWall(netWallArea, brickType, '1:4', wasteFactor)

  const floorArea = lengthM * widthM
  const tileRes = includeFloorTile ? calculateTiling(floorArea, wasteFactor, 40, 40) : null

  const slabVolumeM3 = floorArea * 0.10
  const concreteRes = includeConcreteSlab ? calculateConcrete(slabVolumeM3, '1:2:3', wasteFactor) : null

  const totalCementBags = wallRes.cementBags + (concreteRes ? concreteRes.cementBags : 0)
  const totalSandM3 = Number((wallRes.sandM3 + (concreteRes ? concreteRes.sandM3 : 0)).toFixed(2))
  const totalRipioM3 = concreteRes ? concreteRes.ripioM3 : 0
  const totalWaterL = wallRes.waterL + (concreteRes ? concreteRes.waterL : 0)

  return {
    lengthM,
    widthM,
    heightM,
    perimeter,
    grossWallArea: Number(grossWallArea.toFixed(2)),
    netWallArea: Number(netWallArea.toFixed(2)),
    floorArea: Number(floorArea.toFixed(2)),
    
    totalBricks: wallRes.totalBricks,
    
    totalTiles: tileRes ? tileRes.totalTiles : 0,
    glueBags20kg: tileRes ? tileRes.glueBags20kg : 0,
    groutBags1kg: tileRes ? tileRes.groutBags1kg : 0,

    totalCementBags,
    totalSandM3,
    totalRipioM3,
    totalWaterL,

    sandWheelbarrows: m3ToWheelbarrows(totalSandM3),
    ripioWheelbarrows: m3ToWheelbarrows(totalRipioM3)
  }
}
