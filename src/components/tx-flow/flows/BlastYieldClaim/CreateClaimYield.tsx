import madProps from '@/utils/mad-props'
import { type ReactElement, useContext, useEffect } from 'react'
import { type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { useSafeTokenAddress } from '@/components/common/SafeTokenWidget'
import useIsSafeTokenPaused from '@/hooks/useIsSafeTokenPaused'
import { FormProvider, useForm } from 'react-hook-form'
import { sameAddress } from '@/utils/addresses'
import { Button, CardActions, Divider, FormControl, Grid, Typography } from '@mui/material'
import TokenIcon from '@/components/common/TokenIcon'
import AddressBookInput from '@/components/common/AddressBookInput'
import { ClaimYieldFields, type ClaimYieldParams } from '.'
import TxCard from '../../common/TxCard'
import { formatVisualAmount } from '@/utils/formatters'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { BLAST_YIELD_SUPPORTED_TOKENS } from '@/config/yieldTokens'
import useBlastYield from '@/hooks/useBlastYield'
import BlastYieldAmountInput from '@/components/common/TokenAmountInput/BlastYieldAmountInput'

export const AutocompleteItem = (item: { tokenInfo: TokenInfo; balance: string }): ReactElement => (
  <Grid container alignItems="center" gap={1}>
    <TokenIcon logoUri={item.tokenInfo.logoUri} tokenSymbol={item.tokenInfo.symbol} />

    <Grid item xs>
      <Typography variant="body2">{item.tokenInfo.name}</Typography>

      <Typography variant="caption" component="p">
        {formatVisualAmount(item.balance, item.tokenInfo.decimals)} {item.tokenInfo.symbol}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateClaimYield = ({
  params,
  onSubmit,
  isSafeTokenPaused,
  safeTokenAddress,
  txNonce,
}: {
  params: ClaimYieldParams
  onSubmit: (data: ClaimYieldParams) => void
  isSafeTokenPaused: ReturnType<typeof useIsSafeTokenPaused>
  safeTokenAddress?: ReturnType<typeof useSafeTokenAddress>
  txNonce?: number
}): ReactElement => {
  //   const balancesItems = useVisibleTokens()

  const { balances, loading } = useBlastYield()

  //TODO: check this
  const { setNonce, setNonceNeeded } = useContext(SafeTxContext)

  useEffect(() => {
    if (txNonce) {
      setNonce(txNonce)
    }
  }, [setNonce, txNonce])

  const formMethods = useForm<ClaimYieldParams>({
    defaultValues: {
      ...params,
      [ClaimYieldFields.tokenAddress]: params.tokenAddress,
    },
    mode: 'onChange',
    delayError: 500,
  })

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods

  const recipient = watch(ClaimYieldFields.recipient)
  const tokenAddress = watch(ClaimYieldFields.tokenAddress)

  const selectedToken = BLAST_YIELD_SUPPORTED_TOKENS.find((item) => item.address === tokenAddress)
  //   TODO: implement hook for token amount
  //   const { totalAmount } = useTokenAmount(selectedToken)

  const maxAmount = 51656454654

  const isSafeTokenSelected = sameAddress(safeTokenAddress, tokenAddress)
  const isDisabled = isSafeTokenSelected && isSafeTokenPaused
  const isAddressValid = !!recipient && !errors[ClaimYieldFields.recipient]

  //TODO: check this
  useEffect(() => {
    setNonceNeeded(true)
  }, [setNonceNeeded])

  return (
    <TxCard>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className={commonCss.form}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <AddressBookInput
              name={ClaimYieldFields.recipient}
              label="Recipient address or ENS"
              canAdd={isAddressValid}
            />
          </FormControl>

          <BlastYieldAmountInput balances={balances.items} maxAmount={BigInt(maxAmount)} selectedToken={undefined} />

          <Divider className={commonCss.nestedDivider} />

          <CardActions>
            <Button variant="contained" type="submit" disabled={isDisabled}>
              Next
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </TxCard>
  )
}

export default madProps(CreateClaimYield, {
  safeTokenAddress: useSafeTokenAddress,
  isSafeTokenPaused: useIsSafeTokenPaused,
})
