import TxLayout from '@/components/tx-flow/common/TxLayout'
import useTxStepper from '../../useTxStepper'
import CreateClaimYield from './CreateClaimYield'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'
import { TokenAmountFields } from '@/components/common/TokenAmountInput'
import ReviewClaimYield from './ReviewClaimYield'

enum Fields {
  recipient = 'recipient',
  type = 'type',
}

export const ClaimYieldFields = { ...Fields, ...TokenAmountFields }

export type ClaimYieldParams = {
  [ClaimYieldFields.recipient]: string
  [ClaimYieldFields.tokenAddress]: string
  [ClaimYieldFields.amount]: string
}

type ClaimYieldFlowProps = Partial<ClaimYieldParams> & {
  txNonce?: number
}

const defaultParams: ClaimYieldParams = {
  recipient: '',
  tokenAddress: ZERO_ADDRESS,
  amount: '',
}

const ClaimYieldFlow = ({ txNonce, ...params }: ClaimYieldFlowProps) => {
  const { data, step, nextStep, prevStep } = useTxStepper<ClaimYieldParams>({
    ...defaultParams,
    ...params,
  })

  const steps = [
    <CreateClaimYield
      key={0}
      params={data}
      txNonce={txNonce}
      onSubmit={(formData) => nextStep({ ...data, ...formData })}
    />,

    <ReviewClaimYield key={1} params={data} txNonce={txNonce} onSubmit={() => null} />,
  ]

  return (
    <TxLayout
      title={step === 0 ? 'New transaction' : 'Confirm transaction'}
      subtitle="Claim Blast Yield"
      icon={AssetsIcon}
      step={step}
      onBack={prevStep}
    >
      {steps}
    </TxLayout>
  )
}

export default ClaimYieldFlow
