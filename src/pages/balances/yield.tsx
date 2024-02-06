import type { NextPage } from 'next'
import Head from 'next/head'

import AssetsHeader from '@/components/balances/AssetsHeader'
import YieldTable from '@/components/balances/YieldTable'

const Yield: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Blast Safe – Yield'}</title>
      </Head>

      <AssetsHeader />

      <main>
        <YieldTable />
      </main>
    </>
  )
}

export default Yield
