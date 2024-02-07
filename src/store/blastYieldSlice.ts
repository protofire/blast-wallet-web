import { makeLoadableSlice } from './common'
import type { BlastYieldResponse } from '@/config/yieldTokens'

export const initialYieldState: BlastYieldResponse = {
  items: [],
}

const { slice, selector } = makeLoadableSlice('blastYield', initialYieldState)

export const blastYieldSlice = slice
export const selectYieldTokens = selector

export const { set: setYieldData } = slice.actions
