import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

/**
 * SEO component for managing Open Graph Protocol and other meta tags
 * Provides rich previews when the app is shared on social media platforms
 */
const SEO: React.FC<React.PropsWithChildren<SEOProps>> = ({
  title = 'Who Owe Me Money - Split bills with friends',
  description = 'Easily split bills and track expenses with friends, family, and roommates. See who owes you money at a glance.',
  image = '/og-image.svg', // Default OG image path
  url = window.location.href, 
  type = 'website',
  twitterCard = 'summary_large_image',
  children
}) => {
  // Make sure the title includes the app name
  const formattedTitle = title.includes('Who Owe Me Money') 
    ? title 
    : `${title} | Who Owe Me Money`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph Protocol - Facebook, LinkedIn, etc. */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${window.location.origin}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Who Owe Me Money" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${window.location.origin}${image}`} />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="Who Owe Me Money" />
      <meta name="apple-mobile-web-app-title" content="Who Owe Me Money" />
      <meta name="theme-color" content="#FF7043" />
      
      {/* Allow for additional custom head elements */}
      {children}
    </Helmet>
  );
};

export default SEO; 