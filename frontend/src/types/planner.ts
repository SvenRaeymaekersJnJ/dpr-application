export type Measure = 'VOLUME' | 'VALUE'
export interface Sku { sku: string; description: string }
export interface Brand { brand: string; skus: Sku[] }