import TxLayout from '@/components/tx-flow/common/TxLayout'
import useSafeInfo from '@/hooks/useSafeInfo'
import useTxStepper from '../../useTxStepper'
import { ReviewYieldModeChange } from './ReviewYieldModeChange'
import SaveAddressIcon from '@/public/images/common/save-address.svg'
import { SetYieldMode } from './SetYieldMode'
import type { YieldMode } from '@/config/yieldTokens'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'

export type YieldModeChangeProps = {
  newMode: YieldMode
  tokenAddress: string
}

const YieldModeChangeFlow = (props: YieldModeChangeProps) => {
  const { safe } = useSafeInfo()

  const defaultValues: YieldModeChangeProps = {
    newMode: props.newMode,
    tokenAddress: ZERO_ADDRESS,
  }

  const { data, step, nextStep, prevStep } = useTxStepper<YieldModeChangeProps>(defaultValues)

  const steps = [
    <SetYieldMode key={0} params={data} onSubmit={(formData: any) => nextStep({ ...data, ...formData })} />,
    <ReviewYieldModeChange key={1} params={data} />,
  ]

  return (
    <TxLayout
      title={step === 0 ? 'New transaction' : 'Confirm transaction'}
      subtitle="Change Yield Mode"
      icon={SaveAddressIcon}
      step={step}
      onBack={prevStep}
    >
      {steps}
    </TxLayout>
  )
}

export default YieldModeChangeFlow
