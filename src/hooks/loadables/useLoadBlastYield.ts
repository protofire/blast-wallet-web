import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '../useAsync'
import { Errors, logError } from '@/services/exceptions'
import { BLAST_YIELD_SUPPORTED_TOKENS, type BlastYieldResponse } from '@/config/yieldTokens'
import { encodeGetYieldMode, encodeGetClaimableYield } from '@/features/recovery/services/blast-yield'
import useSafeAddress from '../useSafeAddress'
import { useWeb3ReadOnly } from '../wallets/web3'

export const useLoadBlastYield = (): AsyncResult<BlastYieldResponse> => {
  const web3ReadOnly = useWeb3ReadOnly()
  const safeAddress = useSafeAddress()

  const [data, error, loading] = useAsync<BlastYieldResponse>(() => {
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
      return { items }
    })
  }, [safeAddress, web3ReadOnly])

  // Log errors
  useEffect(() => {
    if (error) {
      logError(Errors._634, error.message)
    }
  }, [error])

  return [data, error, loading]
}
export default useLoadBlastYield
