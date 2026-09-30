import { apiGet } from './client'
import type { Brand } from '../types/planner'

export const getBrands = () => apiGet<Brand[]>('/brands')
export const getCycles = () => apiGet<string[]>('/cycles')