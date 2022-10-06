import { IS_PRODUCTION } from '@/config/constants'
import { ContentSecurityPolicy, StrictTransportSecurity } from '@/config/securityHeaders'
import palette from '@/styles/colors'
import darkPalette from '@/styles/colors-dark'

const MetaTags = ({ prefetchUrl }: { prefetchUrl: string }) => (
  <>
    <meta
      name="description"
      content="Safe is the most trusted platform to manage digital assets on Ethereum (formerly known as the Gnosis Safe multisig)."
    />

    {/* CSP */}
    <meta httpEquiv="Content-Security-Policy" content={ContentSecurityPolicy} />
    {IS_PRODUCTION && <meta httpEquiv="Strict-Transport-Security" content={StrictTransportSecurity} />}

    {/* Prefetch the backend domain */}
    <link rel="dns-prefetch" href={prefetchUrl} />
    <link rel="preconnect" href={prefetchUrl} crossOrigin="" />

    {/* Mobile tags */}
    <meta name="viewport" content="width=device-width" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    {/* PWA primary color and manifest */}
    <meta name="theme-color" content={palette.background.main} media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content={darkPalette.background.main} media="(prefers-color-scheme: dark)" />
    <link rel="manifest" href="/manifest.json" />

    {/* Favicons */}
    <link rel="shortcut icon" href="/favicons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000" />
  </>
)

export default MetaTags