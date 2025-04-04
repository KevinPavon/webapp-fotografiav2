// next-seo.config.js

const siteUrl = 'https://irinawetzel.com'; // Reemplazar luego por tu dominio real

const SEO = {
  title: "Irina Wetzel - Fotografía Profesional",
  description: "Portfolio de fotografía artística y profesional de Irina Wetzel. Sesiones, retratos, naturaleza y más.",
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteUrl,
    siteName: 'Irina Wetzel',
    title: "Irina Wetzel - Fotografía Profesional",
    description: "Descubrí las mejores capturas de Irina Wetzel, fotógrafa especializada en arte visual.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`, // Una imagen destacada para cuando compartas en redes
        width: 1200,
        height: 630,
        alt: "Irina Wetzel Fotografía",
      },
    ],
  },
  twitter: {
    handle: '@irinawetzel', // Podés cambiarlo o dejarlo vacío
    site: '@irinawetzel',
    cardType: 'summary_large_image',
  },
};

export default SEO;
