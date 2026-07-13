import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <meta name="description" content="A magical, deeply romantic birthday wish website for the most wonderful girl, Akshu." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>" />
      </Head>
      <body className="bg-velvet-dark antialiased selection:bg-rose-500 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
