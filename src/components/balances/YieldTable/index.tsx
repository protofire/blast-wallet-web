import { type ReactElement, useContext } from 'react'
import { Button, Typography, Skeleton, Box, IconButton, Tooltip } from '@mui/material'
import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { TokenType } from '@safe-global/safe-gateway-typescript-sdk'
import css from './styles.module.css'
import TokenAmount from '@/components/common/TokenAmount'
import TokenIcon from '@/components/common/TokenIcon'
import EnhancedTable, { type EnhancedTableProps } from '@/components/common/EnhancedTable'
import TokenExplorerLink from '@/components/common/TokenExplorerLink'
import Track from '@/components/common/Track'
import { ASSETS_EVENTS } from '@/services/analytics/events/assets'
import CheckWallet from '@/components/common/CheckWallet'
import { TxModalContext } from '@/components/tx-flow'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import useBlastYield from '@/hooks/useBlastYield'
import ClaimYieldFlow from '@/components/tx-flow/flows/BlastYieldClaim'
import YieldModeChangeFlow from '@/components/tx-flow/flows/BlastYieldModeChange'
import { YIELD_DESCRIPTION, YIELD_LABELS, YieldMode } from '@/config/yieldTokens'

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  asset: {
    rawValue: '0x0',
    content: (
      <div className={css.token}>
        <Skeleton variant="rounded" width="26px" height="26px" />
        <Typography>
          <Skeleton width="80px" />
        </Typography>
      </div>
    ),
  },
  yieldMode: {
    rawValue: '0',
    content: (
      <Typography>
        <Skeleton width="32px" />
      </Typography>
    ),
  },
  value: {
    rawValue: '0',
    content: (
      <Typography>
        <Skeleton width="32px" />
      </Typography>
    ),
  },
  actions: {
    rawValue: '',
    sticky: true,
    content: <div></div>,
  },
}

const skeletonRows: EnhancedTableProps['rows'] = Array(3).fill({ cells: skeletonCells })

const isNativeToken = (tokenInfo: TokenInfo) => {
  return tokenInfo.type === TokenType.NATIVE_TOKEN
}

const headCells = [
  {
    id: 'asset',
    label: 'Asset',
  },
  {
    id: 'yieldMode',
    label: 'Yield Mode',
  },
  {
    id: 'yield',
    label: 'Claimable Yield',
  },
  {
    id: 'actions',
    label: '',
    sticky: true,
  },
]

const ClaimButton = ({
  tokenInfo,
  mode,
  onClick,
}: {
  tokenInfo: TokenInfo
  mode: YieldMode
  onClick: (tokenAddress: string) => void
}): ReactElement => {
  const claimableMode = mode === YieldMode.CLAIMABLE
  return (
    <CheckWallet>
      {(isOk) => (
        <>
          <Track {...ASSETS_EVENTS.CLAIM_YIELD}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => onClick(tokenInfo.address)}
              disabled={mode !== YieldMode.CLAIMABLE || !isOk}
            >
              Claim
            </Button>
          </Track>
          {!claimableMode && isOk && (
            <Tooltip title={'Yield mode is not claimable.'}>
              <IconButton size="medium">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </CheckWallet>
  )
}

const EditYieldModeButton = ({
  tokenInfo,
  onClick,
}: {
  tokenInfo: TokenInfo
  onClick: (tokenAddress: string) => void
}): ReactElement => {
  return (
    <CheckWallet>
      {(isOk) => (
        <Track {...ASSETS_EVENTS.CHANGE_YIELD_MODE}>
          <IconButton size="medium" onClick={() => onClick(tokenInfo.address)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Track>
      )}
    </CheckWallet>
  )
}

const YieldTable = (): ReactElement => {
  const { balances, loading } = useBlastYield()

  const { setTxFlow } = useContext(TxModalContext)

  const onClaimClick = (tokenAddress: string) => {
    setTxFlow(<ClaimYieldFlow tokenAddress={tokenAddress} />)
  }

  const onChangeYieldModeClick = (token: TokenInfo, newMode: YieldMode) => {
    setTxFlow(<YieldModeChangeFlow token={token} newMode={newMode} />)
  }

  const rows = loading
    ? skeletonRows
    : (balances.items || []).map((item) => {
        const isNative = isNativeToken(item.tokenInfo)

        return {
          key: item.tokenInfo.address,
          cells: {
            asset: {
              rawValue: item.tokenInfo.name,
              content: (
                <div className={css.token}>
                  <TokenIcon logoUri={item.tokenInfo.logoUri} tokenSymbol={item.tokenInfo.symbol} />

                  <Typography>{item.tokenInfo.name}</Typography>

                  {!isNative && <TokenExplorerLink address={item.tokenInfo.address} />}
                </div>
              ),
            },
            yieldMode: {
              rawValue: item.mode,
              content: (
                <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                  <Typography sx={{ minWidth: '100px' }}>{YIELD_LABELS[item.mode]}</Typography>
                  <Tooltip title={YIELD_DESCRIPTION[item.mode]}>
                    <IconButton size="medium">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <EditYieldModeButton
                    tokenInfo={item.tokenInfo}
                    onClick={() => onChangeYieldModeClick(item.tokenInfo, item.mode)}
                  />
                </Box>
              ),
            },
            yield: {
              rawValue: item.claimableYield,
              content: (
                <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                  <TokenAmount
                    value={item.claimableYield}
                    decimals={item.tokenInfo.decimals}
                    tokenSymbol={item.tokenInfo.symbol}
                  />
                </Box>
              ),
            },
            actions: {
              rawValue: '',
              sticky: true,
              content: (
                <ClaimButton
                  tokenInfo={item.tokenInfo}
                  mode={item.mode}
                  onClick={() => onClaimClick(item.tokenInfo.address)}
                />
              ),
            },
          },
        }
      })

  return (
    <>
      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={headCells} />
      </div>
    </>
  )
}

export default YieldTable
