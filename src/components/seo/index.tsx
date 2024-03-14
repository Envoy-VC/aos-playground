import { Helmet } from 'react-helmet-async';

interface Props {
  type?: string;
  title?: string;
  description?: string;
  ogImage?: string;
}

const SEO = ({ type, title, description, ogImage }: Props) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      {/* OG TAGS */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={ogImage} />

      {/* TWITTER TAGS */}
      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:site' />
      <meta property='twitter:creator' content='@Envoy_1084' />
    </Helmet>
  );
};

export default SEO;
