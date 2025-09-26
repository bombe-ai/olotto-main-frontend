import React from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { useLocation } from "react-router-dom";
import { defaultMeta, pageMeta, SiteMeta } from "@/app/config/meta";

const MetaTags: React.FC<{ override?: Partial<SiteMeta> }> = ({ override }) => {
  const { pathname } = useLocation();
  const routeMeta = (pageMeta[pathname] || {}) as Partial<SiteMeta>;

  // Only use title/description if explicitly set for this route or override
  const hasRouteTitle = routeMeta.title || override?.title;
  const hasRouteDescription = routeMeta.description || override?.description;

  // Generic fallback title for UX (not for SEO)
  const fallbackTitle = "Olotto";

  // Merge meta: start with defaults, then route-specific, then override
  const meta: SiteMeta = { ...defaultMeta, ...routeMeta, ...(override || {}) };

  // Build canonical URL
  const baseUrl = meta.url || defaultMeta.url || "https://olotto.co";
  const canonical = baseUrl.replace(/\/$/, "") + pathname;

  return (
    <Helmet>
      {/* Use specific title for routes with meta, fallback for others */}
      <title>{hasRouteTitle ? meta.title : fallbackTitle}</title>

      {/* Only render description for routes that explicitly have it */}
      {hasRouteDescription && (
        <meta name="description" content={meta.description} />
      )}

      {/* Always render canonical and robots */}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={meta.robots || defaultMeta.robots} />

      {/* Open Graph - only for routes with explicit meta */}
      {hasRouteTitle && (
        <>
          <meta property="og:type" content="website" />
          <meta property="og:title" content={meta.title} />
          <meta property="og:url" content={canonical} />
          {meta.image && <meta property="og:image" content={meta.image} />}
        </>
      )}
      {hasRouteDescription && (
        <meta property="og:description" content={meta.description} />
      )}

      {/* Twitter - only for routes with explicit meta */}
      {hasRouteTitle && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.title} />
          {meta.image && <meta name="twitter:image" content={meta.image} />}
        </>
      )}
      {hasRouteDescription && (
        <meta name="twitter:description" content={meta.description} />
      )}
    </Helmet>
  );
};

export default MetaTags;
