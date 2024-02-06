import { useMemo } from 'react'
import type { BlastYieldResponse } from '@/config/yieldTokens'
import { BLAST_YIELD_SUPPORTED_TOKENS, YieldMode } from '@/config/yieldTokens'

const useBlastYield = (): {
  balances: BlastYieldResponse
  loading: boolean
  error?: string
} => {
  // TODO: remove temp layout with real data
  const data = {}
  const error = undefined
  const loading = false

  return useMemo(
    () => ({
      balances: {
        items: BLAST_YIELD_SUPPORTED_TOKENS.map((item, index) => ({
          tokenInfo: item,
          claimableYield: '895461223456456456',
          mode: index === 0 ? YieldMode.VOID : index === 1 ? YieldMode.AUTOMATIC : YieldMode.CLAIMABLE,
        })),
      },
      error,
      loading: loading,
    }),
    [error, loading],
  )
}

export default useBlastYield
