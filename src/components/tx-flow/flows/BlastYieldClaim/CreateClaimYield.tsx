import { type ReactElement, useContext, useEffect } from 'react'
import { type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, CardActions, Divider, FormControl, Grid, Typography } from '@mui/material'
import TokenIcon from '@/components/common/TokenIcon'
import AddressBookInput from '@/components/common/AddressBookInput'
import { ClaimYieldFields, type ClaimYieldParams } from '.'
import TxCard from '../../common/TxCard'
import { formatVisualAmount } from '@/utils/formatters'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import useBlastYield from '@/hooks/useBlastYield'
import BlastYieldAmountInput from '@/components/common/TokenAmountInput/BlastYieldAmountInput'
import { YieldMode } from '@/config/yieldTokens'
import useSafeAddress from '@/hooks/useSafeAddress'

export const AutocompleteItem = (item: { tokenInfo: TokenInfo; claimableField: string }): ReactElement => (
  <Grid container alignItems="center" gap={1}>
    <TokenIcon logoUri={item.tokenInfo.logoUri} tokenSymbol={item.tokenInfo.symbol} />

    <Grid item xs>
      <Typography variant="body2">{item.tokenInfo.name}</Typography>

      <Typography variant="caption" component="p">
        {formatVisualAmount(item.claimableField, item.tokenInfo.decimals)} {item.tokenInfo.symbol}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateClaimYield = ({
  params,
  onSubmit,
  txNonce,
}: {
  params: ClaimYieldParams
  onSubmit: (data: ClaimYieldParams) => void
  txNonce?: number
}): ReactElement => {
  const { balances } = useBlastYield()
  const { setNonce, setNonceNeeded } = useContext(SafeTxContext)
  const safeAddress = useSafeAddress()

  useEffect(() => {
    if (txNonce) {
      setNonce(txNonce)
    }
  }, [setNonce, txNonce])

  const formMethods = useForm<ClaimYieldParams>({
    defaultValues: {
      ...params,
      [ClaimYieldFields.tokenAddress]: params.tokenAddress,
      [ClaimYieldFields.recipient]: safeAddress,
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

  const selectedToken = balances.items.find((item) => item.tokenInfo.address === tokenAddress)
  const maxAmount = selectedToken?.claimableYield

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

          <BlastYieldAmountInput
            balances={balances.items}
            maxAmount={BigInt(maxAmount ?? '0')}
            selectedToken={selectedToken}
          />

          <Divider className={commonCss.nestedDivider} />

          <CardActions>
            <Button variant="contained" type="submit" disabled={selectedToken?.mode !== YieldMode.CLAIMABLE}>
              Next
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </TxCard>
  )
}

export default CreateClaimYield
