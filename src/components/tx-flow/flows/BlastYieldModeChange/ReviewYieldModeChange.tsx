import { useContext, useEffect } from 'react'
import { Typography, Divider } from '@mui/material'
import type { ReactElement } from 'react'

import SignOrExecuteForm from '@/components/tx/SignOrExecuteForm'
import { trackEvent, ASSETS_EVENTS } from '@/services/analytics'
import { SafeTxContext } from '../../SafeTxProvider'

import commonCss from '@/components/tx-flow/common/styles.module.css'
import type { YieldModeChangeProps } from '.'
import { createTx } from '@/services/tx/tx-sender'
import { encodeChangeYieldMode } from '@/features/recovery/services/blast-yield'
import { YIELD_LABELS } from '@/config/yieldTokens'

export const ReviewYieldModeChange = ({ params }: { params: YieldModeChangeProps }): ReactElement => {
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const { newMode, token } = params

  const onFormSubmit = () => {
    trackEvent({ ...ASSETS_EVENTS.CHANGE_YIELD_MODE, label: newMode })
  }

  useEffect(() => {
    const txData = encodeChangeYieldMode(newMode, token)

    createTx(txData).then(setSafeTx).catch(setSafeTxError)
  }, [newMode, setSafeTx, setSafeTxError, token])

  return (
    <SignOrExecuteForm onSubmit={onFormSubmit}>
      <Typography color="text.primary" display="flex" alignItems="center">
        {`Selected Yield: ${YIELD_LABELS[params.newMode]}`}
      </Typography>
      <Typography color="text.secondary" mb={2} display="flex" alignItems="center">
        {`Token: ${params.token.name}`}
      </Typography>
      <Divider className={commonCss.nestedDivider} />
    </SignOrExecuteForm>
  )
}
