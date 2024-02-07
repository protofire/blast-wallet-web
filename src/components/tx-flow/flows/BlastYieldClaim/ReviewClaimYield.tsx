import { useContext, useEffect } from 'react'
import SignOrExecuteForm, { type SubmitCallback } from '@/components/tx/SignOrExecuteForm'
import SendAmountBlock from '@/components/tx-flow/flows/TokenTransfer/SendAmountBlock'
import SendToBlock from '@/components/tx/SendToBlock'
import { createTx } from '@/services/tx/tx-sender'
import type { ClaimYieldParams } from '.'
import { SafeTxContext } from '../../SafeTxProvider'
import { encodeClaimYield } from '@/features/recovery/services/blast-yield'
import useBlastYield from '@/hooks/useBlastYield'
import useSafeAddress from '@/hooks/useSafeAddress'

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
  const { balances } = useBlastYield()
  const safeAddress = useSafeAddress()
  const token = balances.items.find((item) => item.tokenInfo.address === params.tokenAddress)

  useEffect(() => {
    if (txNonce !== undefined) {
      setNonce(txNonce)
    }

    if (!token) return

    const txParams = encodeClaimYield(safeAddress, params.recipient, token.tokenInfo, params.amount)

    createTx(txParams, txNonce).then(setSafeTx).catch(setSafeTxError)
  }, [params.amount, params.recipient, safeAddress, setNonce, setSafeTx, setSafeTxError, token, txNonce])

  return (
    <SignOrExecuteForm onSubmit={onSubmit}>
      {token && <SendAmountBlock amount={params.amount} tokenInfo={token.tokenInfo} />}

      <SendToBlock address={params.recipient} />
    </SignOrExecuteForm>
  )
}

export default ReviewClaimYield
