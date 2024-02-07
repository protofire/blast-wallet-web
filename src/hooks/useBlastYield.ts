import { useMemo } from 'react'
import type { BlastYieldResponse } from '@/config/yieldTokens'
import { BLAST_YIELD_SUPPORTED_TOKENS } from '@/config/yieldTokens'
import useAsync from './useAsync'
import { useWeb3ReadOnly } from './wallets/web3'
import useSafeAddress from './useSafeAddress'
import { encodeGetClaimableYield, encodeGetYieldMode } from '@/features/recovery/services/blast-yield'

const useBlastYield = (): {
  balances: BlastYieldResponse
  loading: boolean
  error?: string
} => {
  const web3ReadOnly = useWeb3ReadOnly()
  const safeAddress = useSafeAddress()

  const [yieldResponse, error, loading] = useAsync(() => {
    if (!safeAddress || !web3ReadOnly) return

    const calls = BLAST_YIELD_SUPPORTED_TOKENS.map(async (token) => {
      return [
        await web3ReadOnly.call(encodeGetYieldMode(safeAddress, token)),
        await web3ReadOnly.call(encodeGetClaimableYield(safeAddress, token)).catch(() => {
          return '0'
        }),
      ]
    })

    return Promise.all(calls).then((result) => {
      const items = result.map((value, idx) => {
        return {
          tokenInfo: BLAST_YIELD_SUPPORTED_TOKENS[idx],
          mode: parseInt(value[0]),
          claimableYield: value[1],
        }
      })
      return items
    })
  }, [safeAddress, web3ReadOnly])

  return useMemo(
    () => ({
      balances: {
        items: yieldResponse ?? [],
      },
      error: error?.toString(),
      loading: loading,
    }),
    [yieldResponse, error, loading],
  )
}

export default useBlastYield
