import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { TokenType } from '@safe-global/safe-gateway-typescript-sdk'

export type BlastYieldResponse = {
  items: Array<{
    tokenInfo: TokenInfo
    claimableYield: string
    mode: YieldMode
  }>
}

// TODO: remove temporary token configuration
export const BLAST_ETH: TokenInfo = {
  type: TokenType.NATIVE_TOKEN,
  address: '0x4300000000000000000000000000000000000002',
  decimals: 18,
  symbol: 'ETH',
  name: 'Sepolia Ether',
  logoUri: 'https://assets.blast-safe.protofire.io/contracts/logos/0x4300000000000000000000000000000000000002.png',
}

export const WETH: TokenInfo = {
  type: TokenType.ERC20,
  address: '0x4200000000000000000000000000000000000023',
  decimals: 18,
  symbol: 'WETH',
  name: 'Wrapped Ether',
  logoUri: 'https://assets.blast-safe.protofire.io/contracts/logos/0x4200000000000000000000000000000000000023.png',
}

export const USDB: TokenInfo = {
  type: TokenType.ERC20,
  address: '0x4200000000000000000000000000000000000022',
  decimals: 18,
  symbol: 'USDB',
  name: 'Rebased USD',
  logoUri: 'https://assets.blast-safe.protofire.io/contracts/logos/0x4200000000000000000000000000000000000022.png',
}

export enum YieldMode {
  VOID = 'VOID',
  AUTOMATIC = 'AUTOMATIC',
  CLAIMABLE = 'CLAIMABLE',
}

export const BLAST_YIELD_SUPPORTED_TOKENS = [BLAST_ETH, WETH, USDB]
