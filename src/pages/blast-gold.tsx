import type { NextPage } from 'next'
import Head from 'next/head'
import { Typography, Box } from '@mui/material'
import { IS_OFFICIAL_HOST } from '@/config/constants'

const BlastGold = () => (
  <Box sx={{ padding: 4, backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: 2, margin: '0 auto' }}>
    <Typography variant="h1" mb={2} sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
      Blast Gold Contract & Operator
    </Typography>
    <Typography mb={2}>Our Blast Gold contract & operator are as follows:</Typography>
    <Box mb={1}>
      <Typography component="span" sx={{ fontWeight: 'bold' }}>
        Blast Points API Contract:
      </Typography>
      <Typography
        component="code"
        sx={{
          display: 'inline-block',
          backgroundColor: '#333',
          padding: '2px',
          borderRadius: '4px',
          marginTop: '4px',
          fontFamily: 'monospace',
        }}
      >
        0x8469509fE7dcE446aB9d3fe16aA7A6697aBe08DB
      </Typography>
    </Box>
    <Box>
      <Typography component="span" sx={{ fontWeight: 'bold' }}>
        Points Operator:
      </Typography>
      <Typography
        component="code"
        sx={{
          display: 'inline-block',
          backgroundColor: '#333',
          padding: '2px',
          borderRadius: '4px',
          marginTop: '4px',
          fontFamily: 'monospace',
        }}
      >
        0xE23C70168847bB00F89983BAb5c9983c8E86cA86
      </Typography>
    </Box>
  </Box>
)

const Gold: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Blast Safe – Blast Gold'}</title>
      </Head>

      <main>{IS_OFFICIAL_HOST && <BlastGold />}</main>
    </>
  )
}

export default Gold
