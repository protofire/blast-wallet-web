import { YieldMode } from '@/config/yieldTokens'
import type { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { Interface } from 'ethers'

//TODO: fetch ABI from gateway
export const getChangeYieldModeFunctionData = (
  yieldMode: YieldMode,
  tokenAddress: string,
): SafeTransactionDataPartial => {
  let functionName
  switch (yieldMode) {
    case YieldMode.VOID:
      functionName = 'configureVoidYield'
      break
    case YieldMode.AUTOMATIC:
      functionName = 'configureAutomaticYield'
      break
    default:
      functionName = 'configureClaimableYield'
      break
  }

  const yieldModeInterface = new Interface([`function ${functionName}() external`])

  const yieldTxData = {
    to: tokenAddress,
    value: '0',
    data: yieldModeInterface.encodeFunctionData(functionName, []),
  }

  return yieldTxData
}
