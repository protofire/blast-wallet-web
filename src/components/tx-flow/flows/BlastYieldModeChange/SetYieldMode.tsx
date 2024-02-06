import { useState } from 'react'
import {
  Button,
  Box,
  CardActions,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
  SvgIcon,
  Tooltip,
  Link,
} from '@mui/material'
import type { ReactElement, SyntheticEvent } from 'react'
import type { SelectChangeEvent } from '@mui/material'

import TxCard from '../../common/TxCard'
import InfoIcon from '@/public/images/notifications/info.svg'

import commonCss from '@/components/tx-flow/common/styles.module.css'
import type { YieldModeChangeProps } from '.'
import { YieldMode } from '@/config/yieldTokens'

const helperText = {
  [YieldMode.VOID]: 'ETH balance never changes; no yield is earned.',
  [YieldMode.AUTOMATIC]: 'Native ETH balance rebases (increasing only).',
  [YieldMode.CLAIMABLE]: 'ETH balance never changes; yield accumulates separately.',
}

export const SetYieldMode = ({
  params,
  onSubmit,
}: {
  params: YieldModeChangeProps
  onSubmit: (data: YieldModeChangeProps) => void
}): ReactElement => {
  // const { safe } = useSafeInfo()

  console.log(params)
  const [selectedMode, setSelectedMode] = useState<YieldMode>((params.newMode as YieldMode) || YieldMode.VOID)

  const handleChange = (event: SelectChangeEvent<YieldMode>) => {
    setSelectedMode(event.target.value as YieldMode)
  }

  const onSubmitHandler = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit({ ...params, newMode: selectedMode })
  }

  return (
    <TxCard>
      <form onSubmit={onSubmitHandler}>
        <Box my={3}>
          <Typography variant="h4" fontWeight={700}>
            Yield Modes
            <Tooltip
              title={'Smart contract accounts have three Yield Modes which can be changed on demand.'}
              arrow
              placement="top"
            >
              <span>
                <SvgIcon
                  component={InfoIcon}
                  inheritViewBox
                  color="border"
                  fontSize="small"
                  sx={{
                    verticalAlign: 'middle',
                    ml: 0.5,
                  }}
                />
              </span>
            </Tooltip>
          </Typography>
          <Grid container direction="row" alignItems="center" gap={1} mt={2}>
            <Grid item>
              <Select sx={{ minWidth: '150px' }} value={selectedMode} onChange={handleChange} fullWidth>
                {Object.keys(YieldMode).map((value, idx) => (
                  <MenuItem key={idx} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Typography>
                {helperText[selectedMode]}{' '}
                <Link color="primary" target="_blank" href={'https://docs.blast.io/building/guides/eth-yield'}>
                  Read more
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider className={commonCss.nestedDivider} />

        <CardActions>
          <Button data-testid="next-btn" variant="contained" type="submit">
            Next
          </Button>
        </CardActions>
      </form>
    </TxCard>
  )
}
