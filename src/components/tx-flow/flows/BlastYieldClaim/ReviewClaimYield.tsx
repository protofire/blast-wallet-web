import { useContext, useEffect } from 'react'
import useBalances from '@/hooks/useBalances'
import SignOrExecuteForm, { type SubmitCallback } from '@/components/tx/SignOrExecuteForm'
import SendAmountBlock from '@/components/tx-flow/flows/TokenTransfer/SendAmountBlock'
import SendToBlock from '@/components/tx/SendToBlock'
import { createTokenTransferParams } from '@/services/tx/tokenTransferParams'
import { createTx } from '@/services/tx/tx-sender'
import type { ClaimYieldParams } from '.'
import { SafeTxContext } from '../../SafeTxProvider'

const ReviewClaimYield = ({
  params,
  onSubmit,
  txNonce,
}: {
  params: ClaimYieldParams
  onSubmit: SubmitCallback
  txNonce?: number
}) => {
  const { setSafeTx, setSafeTxError, setNonce } = useContext(SafeTxContext)
  const { balances } = useBalances()
  const token = balances.items.find((item) => item.tokenInfo.address === params.tokenAddress)

  useEffect(() => {
    if (txNonce !== undefined) {
      setNonce(txNonce)
    }

    if (!token) return

    const txParams = createTokenTransferParams(
      params.recipient,
      params.amount,
      token.tokenInfo.decimals,
      token.tokenInfo.address,
    )

    createTx(txParams, txNonce).then(setSafeTx).catch(setSafeTxError)
  }, [params, txNonce, token, setNonce, setSafeTx, setSafeTxError])

  return (
    <SignOrExecuteForm onSubmit={onSubmit}>
      {token && <SendAmountBlock amount={params.amount} tokenInfo={token.tokenInfo} />}

      <SendToBlock address={params.recipient} />
    </SignOrExecuteForm>
  )
}

export default ReviewClaimYield
