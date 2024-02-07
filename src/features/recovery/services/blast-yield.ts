import { YieldMode } from '@/config/yieldTokens'
import type { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { TokenType, type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { Interface } from 'ethers'

//TODO: fetch ABI from gateway
export const getChangeYieldModeFunctionData = (yieldMode: YieldMode, token: TokenInfo): SafeTransactionDataPartial => {
  let functionName
  let functionABI
  let args
  if (token.type === TokenType.NATIVE_TOKEN) {
    switch (yieldMode) {
      case YieldMode.CLAIMABLE:
        functionName = 'configureClaimableYield'
        break
      case YieldMode.AUTOMATIC:
        functionName = 'configureAutomaticYield'
        break
      default:
        functionName = 'configureVoidYield'
        break
    }
    functionABI = `function ${functionName}() external`
  } else {
    functionName = 'configure'
    functionABI = `function ${functionName}(uint8 yieldMode) external`
    args = [yieldMode]
  }

  const yieldModeInterface = new Interface([functionABI])

  const yieldTxData = {
    to: token.address,
    value: '0',
    data: yieldModeInterface.encodeFunctionData(functionName, args ?? []),
  }

  return yieldTxData
}
