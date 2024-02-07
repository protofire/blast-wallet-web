import { useMemo } from 'react'
import type { BlastYieldResponse } from '@/config/yieldTokens'
import { useAppSelector } from '@/store'
import { selectYieldTokens, initialYieldState } from '@/store/blastYieldSlice'

const useBlastYield = (): {
  balances: BlastYieldResponse
  loading: boolean
  error?: string
} => {
  const state = useAppSelector(selectYieldTokens)
  const { data, error, loading } = state

  return useMemo(
    () => ({
      balances: data,
      error,
      loading: loading || initialYieldState === data,
    }),
    [data, error, loading],
  )
}

export default useBlastYield
