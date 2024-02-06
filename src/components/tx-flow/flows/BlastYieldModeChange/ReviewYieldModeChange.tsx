import { useContext, useEffect } from 'react'
import { Typography, Divider } from '@mui/material'
import type { ReactElement } from 'react'

import SignOrExecuteForm from '@/components/tx/SignOrExecuteForm'
import { trackEvent, ASSETS_EVENTS } from '@/services/analytics'
import { SafeTxContext } from '../../SafeTxProvider'

import commonCss from '@/components/tx-flow/common/styles.module.css'
import type { YieldModeChangeProps } from '.'
import { createTx } from '@/services/tx/tx-sender'
import { getChangeYieldModeFunctionData } from '@/features/recovery/services/blast-yield'

export const ReviewYieldModeChange = ({ params }: { params: YieldModeChangeProps }): ReactElement => {
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const { newMode, tokenAddress } = params

  const onFormSubmit = () => {
    trackEvent({ ...ASSETS_EVENTS.CHANGE_YIELD_MODE, label: newMode })
  }

  useEffect(() => {
    const txData = getChangeYieldModeFunctionData(newMode, tokenAddress)

    createTx(txData).then(setSafeTx).catch(setSafeTxError)
  }, [newMode, params.tokenAddress, setSafeTx, setSafeTxError, tokenAddress])

  return (
    <SignOrExecuteForm onSubmit={onFormSubmit}>
      <Typography color="text.secondary" mb={2} display="flex" alignItems="center">
        {`Selected Yield: ${params.newMode}`}
      </Typography>
      <Divider className={commonCss.nestedDivider} />
    </SignOrExecuteForm>
  )
}
