import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '../useAsync'
import { Errors, logError } from '@/services/exceptions'
import { getBlastYieldTokens, type BlastYieldResponse } from '@/config/yieldTokens'
import { encodeGetYieldMode, encodeGetClaimableYield } from '@/features/recovery/services/blast-yield'
import useSafeAddress from '../useSafeAddress'
import { useWeb3ReadOnly } from '../wallets/web3'
import { POLLING_INTERVAL } from '@/config/constants'
import useIntervalCounter from '../useIntervalCounter'
import useChainId from '../useChainId'

export const useLoadBlastYield = (): AsyncResult<BlastYieldResponse> => {
  const [pollCount, resetPolling] = useIntervalCounter(POLLING_INTERVAL)
  const web3ReadOnly = useWeb3ReadOnly()
  const safeAddress = useSafeAddress()
  const currentChainId = useChainId()

  const [data, error, loading] = useAsync<BlastYieldResponse>(
    () => {
      if (!safeAddress || !web3ReadOnly) return

      const yieldTokenArray = getBlastYieldTokens(+currentChainId)
      const calls = yieldTokenArray.map(async (token) => {
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
            tokenInfo: yieldTokenArray[idx],
            mode: parseInt(value[0]),
            claimableYield: value[1],
          }
        })
        return { items }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeAddress, web3ReadOnly, pollCount, currentChainId],
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
