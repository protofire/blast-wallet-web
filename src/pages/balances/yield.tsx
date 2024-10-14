import type { NextPage } from 'next'
import Head from 'next/head'

import AssetsHeader from '@/components/balances/AssetsHeader'
import MuiLink from '@mui/material/Link'
import Link from 'next/link'

const Yield: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Blast Safe – Yield'}</title>
      </Head>

      <AssetsHeader />

      <main>
        <div>
          Yield control functionality is now moved into separate safe app. You can find it in the list of Safe apps or
          by following this{' '}
          <Link href="https://blast-safe.io/share/safe-app?appUrl=https%3A%2F%2Fyield.blast-safe.io" legacyBehavior>
            <MuiLink>link</MuiLink>
          </Link>
          .
        </div>
      </main>
    </>
  )
}

export default Yield
