'use client';

import Script from 'next/script';

const GA_TRACKING_ID = 'G-MTPSDN78B0';

export const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => {
          // @ts-expect-error: dataLayer is dynamically created by Google Analytics script
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            // @ts-expect-error: gtag is a global function created by the Google Analytics script
            // eslint-disable-next-line
            dataLayer.push(arguments);
          }

          // @ts-expect-error: gtag function is dynamically available after GA script loads
          gtag('js', new Date());

          // @ts-expect-error: gtag configuration uses a global function provided by the GA script
          gtag('config', GA_TRACKING_ID);
        }}
      />
    </>
  );
};
