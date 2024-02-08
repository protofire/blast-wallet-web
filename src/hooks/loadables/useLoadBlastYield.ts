import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '../useAsync'
import { Errors, logError } from '@/services/exceptions'
import { BLAST_YIELD_SUPPORTED_TOKENS, type BlastYieldResponse } from '@/config/yieldTokens'
import { encodeGetYieldMode, encodeGetClaimableYield } from '@/features/recovery/services/blast-yield'
import useSafeAddress from '../useSafeAddress'
import { useWeb3ReadOnly } from '../wallets/web3'
import { POLLING_INTERVAL } from '@/config/constants'
import useIntervalCounter from '../useIntervalCounter'

export const useLoadBlastYield = (): AsyncResult<BlastYieldResponse> => {
  const [pollCount, resetPolling] = useIntervalCounter(POLLING_INTERVAL)
  const web3ReadOnly = useWeb3ReadOnly()
  const safeAddress = useSafeAddress()

  const [data, error, loading] = useAsync<BlastYieldResponse>(
    () => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeAddress, web3ReadOnly, pollCount],
    false, // don't clear data between polls
  )

  // Reset the counter when safe address changes
  useEffect(() => {
    resetPolling()
  }, [resetPolling, safeAddress])

  // Log errors
  useEffect(() => {
    if (error) {
      logError(Errors._634, error.message)
    }
  }, [error])

  return [data, error, loading]
}
export default useLoadBlastYield
