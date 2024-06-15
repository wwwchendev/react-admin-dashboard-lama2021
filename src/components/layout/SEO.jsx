import { Helmet } from 'react-helmet';

export const SEO = ({
  title = '測試標題',
  description = '測試content',
  url,
  children,
}) => (
  <Helmet>
    <meta charSet='utf-8' />
    <title>{title}</title>
    <meta name='description' content={description} />
    {children}
    {url ? <link rel='canonical' href={url} /> : ''}
    <link rel="icon" href="/favicon/favicon.ico" sizes="32x32" />
  </Helmet>
);
