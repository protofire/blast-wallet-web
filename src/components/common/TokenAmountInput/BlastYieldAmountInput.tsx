import { formatVisualAmount, safeFormatUnits } from '@/utils/formatters'
import { Button, Divider, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from '@mui/material'
import css from './styles.module.css'
import NumberField from '@/components/common/NumberField'
import { validateDecimalLength, validateLimitedAmount } from '@/utils/validation'
import { useFormContext } from 'react-hook-form'
import classNames from 'classnames'
import { useCallback } from 'react'
import { ClaimYieldFields } from '@/components/tx-flow/flows/BlastYield'
import type { BlastYieldResponse } from '@/config/yieldTokens'
import TokenIcon from '../TokenIcon'

const BlastYieldAmountInput = ({
  balances,
  selectedToken,
  maxAmount,
  validate,
}: {
  balances: BlastYieldResponse['items']
  selectedToken: BlastYieldResponse['items'][number] | undefined
  maxAmount?: bigint
  validate?: (value: string) => string | undefined
}) => {
  const {
    formState: { errors },
    register,
    resetField,
    watch,
    setValue,
  } = useFormContext<{ [ClaimYieldFields.tokenAddress]: string; [ClaimYieldFields.amount]: string }>()

  const tokenAddress = watch(ClaimYieldFields.tokenAddress)
  const isAmountError = !!errors[ClaimYieldFields.tokenAddress] || !!errors[ClaimYieldFields.amount]

  const validateAmount = useCallback(
    (value: string) => {
      const decimals = selectedToken?.tokenInfo.decimals
      return validateLimitedAmount(value, decimals, maxAmount?.toString()) || validateDecimalLength(value, decimals)
    },
    [maxAmount, selectedToken?.tokenInfo.decimals],
  )

  const onMaxAmountClick = useCallback(() => {
    if (!selectedToken || !maxAmount) return

    setValue(ClaimYieldFields.amount, safeFormatUnits(maxAmount.toString(), selectedToken.tokenInfo.decimals), {
      shouldValidate: true,
    })
  }, [maxAmount, selectedToken, setValue])

  return (
    <FormControl
      data-testid="token-amount-section"
      className={classNames(css.outline, { [css.error]: isAmountError })}
      fullWidth
    >
      <InputLabel shrink required className={css.label}>
        {errors[ClaimYieldFields.tokenAddress]?.message || errors[ClaimYieldFields.amount]?.message || 'Amount'}
      </InputLabel>
      <div className={css.inputs}>
        <NumberField
          data-testid="token-amount-field"
          variant="standard"
          InputProps={{
            disableUnderline: true,
            endAdornment: maxAmount !== undefined && (
              <Button data-testid="max-btn" className={css.max} onClick={onMaxAmountClick}>
                Max
              </Button>
            ),
          }}
          className={css.amount}
          required
          placeholder="0"
          {...register(ClaimYieldFields.amount, {
            required: true,
            validate: validate ?? validateAmount,
          })}
        />
        <Divider orientation="vertical" flexItem />
        <TextField
          data-testid="token-balance"
          select
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          className={css.select}
          {...register(ClaimYieldFields.tokenAddress, {
            required: true,
            onChange: () => {
              resetField(ClaimYieldFields.amount, { defaultValue: '' })
            },
          })}
          value={tokenAddress}
          required
        >
          {balances.map((item) => (
            //TODO add autocomplete
            <MenuItem data-testid="token-item" key={item.tokenInfo.address} value={item.tokenInfo.address}>
              <Grid container alignItems="center" gap={1}>
                <TokenIcon logoUri={item.tokenInfo.logoUri} tokenSymbol={item.tokenInfo.symbol} />

                <Grid item xs>
                  <Typography variant="body2">{item.tokenInfo.name}</Typography>

                  <Typography variant="caption" component="p">
                    {formatVisualAmount(item.claimableYield, item.tokenInfo.decimals)} {item.tokenInfo.symbol}
                  </Typography>
                </Grid>
              </Grid>
            </MenuItem>
          ))}
        </TextField>
      </div>
    </FormControl>
  )
}

export default BlastYieldAmountInput
