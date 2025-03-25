import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import NokTrendPage from 'src/sections/results/nok-trend-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`NOK Trend - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Relatorio de tendencia NOK"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <NokTrendPage />
    </>
  );
}
