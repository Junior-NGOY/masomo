import { Metadata } from 'next'

export interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  siteName?: string
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/images/og-image.jpg',
  url = 'https://masomo-pro.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Masomo Pro',
  siteName = 'Masomo Pro'
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${siteName}`
  const keywordString = keywords.join(', ')

  return {
    title: fullTitle,
    description,
    keywords: keywordString,
    authors: [{ name: author }],
    creator: author,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_FR',
      type: type as any,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@masomopro',
      images: [image],
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'theme-color': '#2563eb',
    },
  }
}

// Données structurées pour les moteurs de recherche
export function generateSchemaMarkup(type: 'WebSite' | 'Organization' | 'SoftwareApplication', data: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'WebSite':
      return {
        ...baseSchema,
        name: 'Masomo Pro',
        url: 'https://masomo-pro.com',
        description: 'Plateforme de gestion scolaire moderne et intuitive',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://masomo-pro.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }

    case 'Organization':
      return {
        ...baseSchema,
        name: 'Masomo Pro',
        url: 'https://masomo-pro.com',
        logo: 'https://masomo-pro.com/images/logo.png',
        description: 'Plateforme de gestion scolaire moderne et intuitive',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+243-XXX-XXX-XXX',
          contactType: 'customer service',
          areaServed: 'RDC',
          availableLanguage: 'French',
        },
        sameAs: [
          'https://facebook.com/masomopro',
          'https://twitter.com/masomopro',
          'https://linkedin.com/company/masomopro',
        ],
      }

    case 'SoftwareApplication':
      return {
        ...baseSchema,
        name: 'Masomo Pro',
        applicationCategory: 'Educational Software',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '25000',
          priceCurrency: 'CDF',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150',
        },
        ...data,
      }

    default:
      return baseSchema
  }
}

// Composant pour injecter les données structurées
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
