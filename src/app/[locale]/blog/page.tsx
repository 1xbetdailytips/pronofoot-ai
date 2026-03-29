import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase";

/* ───────────────────────── metadata ───────────────────────── */

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "Blog Football - Analyses, Pronostics & Actualités"
      : "Football Blog - Analysis, Predictions & News",
    description: isFr
      ? "Articles d'analyse football, pronostics détaillés, récapitulatifs des résultats et guides de paris. Contenu expert par IA."
      : "Football analysis articles, detailed predictions, results recaps, and betting guides. Expert AI-powered content.",
    alternates: {
      canonical: `/${params.locale}/blog`,
      languages: {
        fr: "/fr/blog",
        en: "/en/blog",
        "x-default": "/fr/blog",
      },
    },
  };
}

/* ───────────────────────── types ───────────────────────── */

interface Article {
  id: string;
  slug: string;
  article_type: string;
  title_fr: string;
  title_en: string;
  meta_description_fr: string;
  meta_description_en: string;
  target_keyword: string;
  word_count: number;
  published_at: string;
}

/* ───────────────────────── constants ───────────────────────── */

const ARTICLES_PER_PAGE = 12;

const heroImages: Record<string, string> = {
  "comment-parier-football-cameroun-guide-2026": "/images/blog/art1-hero.jpeg",
  "pronostics-football-gratuits-guide-debutant-2026":
    "/images/blog/art2-hero.jpeg",
  "intelligence-artificielle-paris-sportifs-predictions-football":
    "/images/blog/art3-hero.jpeg",
};

const typeLabels: Record<string, { fr: string; en: string; color: string }> = {
  preview: {
    fr: "Pronostic",
    en: "Preview",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  recap: {
    fr: "Résultats",
    en: "Recap",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  guide: {
    fr: "Guide",
    en: "Guide",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  },
  league: {
    fr: "Ligue",
    en: "League",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  weekly: {
    fr: "Hebdo",
    en: "Weekly",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  },
};

const filterTabs: { key: string; fr: string; en: string }[] = [
  { key: "all", fr: "Tous", en: "All" },
  { key: "guide", fr: "Guide", en: "Guide" },
  { key: "preview", fr: "Pronostic", en: "Preview" },
  { key: "recap", fr: "Résultats", en: "Recap" },
  { key: "league", fr: "Ligue", en: "League" },
  { key: "weekly", fr: "Hebdo", en: "Weekly" },
];

/* ───────────────────────── helpers ───────────────────────── */

function readTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

function buildHref(
  locale: string,
  params: { type?: string; q?: string; page?: number }
) {
  const sp = new URLSearchParams();
  if (params.type && params.type !== "all") sp.set("type", params.type);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return `/${locale}/blog${qs ? `?${qs}` : ""}`;
}

/* ───────────────────────── page ───────────────────────── */

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { type?: string; q?: string; page?: string };
}) {
  const locale = params.locale;
  const isFr = locale === "fr";

  const activeType = searchParams.type || "all";
  const searchQuery = (searchParams.q || "").trim();
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  /* ── fetch featured guides (always, for the hero section) ── */
  const { data: featuredRaw } = await supabase
    .from("seo_articles")
    .select(
      "id, slug, article_type, title_fr, title_en, meta_description_fr, meta_description_en, target_keyword, word_count, published_at"
    )
    .eq("published", true)
    .eq("article_type", "guide")
    .order("published_at", { ascending: false })
    .limit(3);

  const featured = (featuredRaw as Article[] | null) || [];
  const featuredIds = new Set(featured.map((a) => a.id));

  /* ── build main query ── */
  let query = supabase
    .from("seo_articles")
    .select(
      "id, slug, article_type, title_fr, title_en, meta_description_fr, meta_description_en, target_keyword, word_count, published_at",
      { count: "exact" }
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (activeType !== "all") {
    query = query.eq("article_type", activeType);
  }

  if (searchQuery) {
    const col = isFr ? "title_fr" : "title_en";
    query = query.ilike(col, `%${searchQuery}%`);
  }

  const { data: allArticles, count: totalCount } = await query;

  /* ── filter out featured from first page of unfiltered view ── */
  let articles = (allArticles as Article[] | null) || [];
  const showFeatured =
    activeType === "all" && !searchQuery && currentPage === 1;

  if (showFeatured) {
    articles = articles.filter((a) => !featuredIds.has(a.id));
  }

  const total = totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(startIdx, startIdx + ARTICLES_PER_PAGE);

  /* ── pagination range ── */
  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let startPage = Math.max(1, safePage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-7 h-7 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isFr ? "Blog Football" : "Football Blog"}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {isFr
            ? "Analyses, pronostics et récapitulatifs par notre IA"
            : "Analysis, predictions, and recaps by our AI"}
        </p>
      </div>

      {/* ── Search & Filters ── */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <form action={`/${locale}/blog`} method="GET">
          {activeType !== "all" && (
            <input type="hidden" name="type" value={activeType} />
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder={
                isFr
                  ? "Rechercher un article..."
                  : "Search articles..."
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </form>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {filterTabs.map((tab) => {
            const isActive = activeType === tab.key;
            return (
              <Link
                key={tab.key}
                href={buildHref(locale, {
                  type: tab.key,
                  q: searchQuery || undefined,
                })}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {isFr ? tab.fr : tab.en}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Featured Guides (hero section) ── */}
      {showFeatured && featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            {isFr ? "Guides essentiels" : "Essential Guides"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((article) => {
              const title = isFr
                ? article.title_fr
                : article.title_en || article.title_fr;
              const desc = isFr
                ? article.meta_description_fr
                : article.meta_description_en || article.meta_description_fr;
              const img = heroImages[article.slug];
              const mins = readTime(article.word_count);

              return (
                <Link
                  key={article.id}
                  href={`/${locale}/blog/${article.slug}`}
                  className="group relative flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-emerald-500">
                    {img && (
                      <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 inline-block text-xs font-semibold px-2.5 py-1 rounded bg-purple-600 text-white">
                      Guide
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                      {desc}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mins} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.published_at).toLocaleDateString(
                          isFr ? "fr-FR" : "en-US",
                          { day: "numeric", month: "short" }
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Active filter / search indicator ── */}
      {(searchQuery || activeType !== "all") && (
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {total} {isFr ? "article(s) trouvé(s)" : "article(s) found"}
          </span>
          {searchQuery && (
            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
              &ldquo;{searchQuery}&rdquo;
            </span>
          )}
          <Link
            href={`/${locale}/blog`}
            className="ml-auto text-emerald-600 hover:underline text-xs"
          >
            {isFr ? "Effacer les filtres" : "Clear filters"}
          </Link>
        </div>
      )}

      {/* ── Articles Grid ── */}
      {paginatedArticles.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {isFr
              ? "Aucun article trouvé. Essayez une autre recherche."
              : "No articles found. Try a different search."}
          </p>
          <Link
            href={`/${locale}/blog`}
            className="inline-block mt-4 text-emerald-600 hover:underline text-sm"
          >
            {isFr ? "Voir tous les articles" : "View all articles"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => {
            const title = isFr
              ? article.title_fr
              : article.title_en || article.title_fr;
            const desc = isFr
              ? article.meta_description_fr
              : article.meta_description_en || article.meta_description_fr;
            const typeMeta =
              typeLabels[article.article_type] || typeLabels.preview;
            const typeLabel = isFr ? typeMeta.fr : typeMeta.en;
            const date = new Date(article.published_at).toLocaleDateString(
              isFr ? "fr-FR" : "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            );
            const mins = readTime(article.word_count);
            const img = heroImages[article.slug];

            return (
              <Link
                key={article.id}
                href={`/${locale}/blog/${article.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200"
              >
                {/* Optional hero image */}
                {img && (
                  <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${typeMeta.color}`}
                    >
                      {typeLabel}
                    </span>
                    <span className="flex items-center text-xs text-gray-400 gap-1">
                      <Clock className="w-3 h-3" />
                      {mins} min
                    </span>
                  </div>

                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                    {desc}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {date}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-10 flex items-center justify-center gap-1"
        >
          {/* Previous */}
          {safePage > 1 ? (
            <Link
              href={buildHref(locale, {
                type: activeType,
                q: searchQuery || undefined,
                page: safePage - 1,
              })}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isFr ? "Précédent" : "Previous"}
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" />
              {isFr ? "Précédent" : "Previous"}
            </span>
          )}

          {/* Page numbers */}
          {startPage > 1 && (
            <>
              <Link
                href={buildHref(locale, {
                  type: activeType,
                  q: searchQuery || undefined,
                  page: 1,
                })}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                1
              </Link>
              {startPage > 2 && (
                <span className="w-9 h-9 flex items-center justify-center text-gray-400">
                  ...
                </span>
              )}
            </>
          )}

          {pageNumbers.map((p) => (
            <Link
              key={p}
              href={buildHref(locale, {
                type: activeType,
                q: searchQuery || undefined,
                page: p,
              })}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === safePage
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {p}
            </Link>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="w-9 h-9 flex items-center justify-center text-gray-400">
                  ...
                </span>
              )}
              <Link
                href={buildHref(locale, {
                  type: activeType,
                  q: searchQuery || undefined,
                  page: totalPages,
                })}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {totalPages}
              </Link>
            </>
          )}

          {/* Next */}
          {safePage < totalPages ? (
            <Link
              href={buildHref(locale, {
                type: activeType,
                q: searchQuery || undefined,
                page: safePage + 1,
              })}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isFr ? "Suivant" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed">
              {isFr ? "Suivant" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </nav>
      )}

      {/* ── JSON-LD: Blog ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: isFr ? "Blog PronoFoot AI" : "PronoFoot AI Blog",
            description: isFr
              ? "Analyses football, pronostics et récapitulatifs par intelligence artificielle"
              : "Football analysis, predictions, and recaps powered by AI",
            url: `${siteConfig.url}/${locale}/blog`,
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          }),
        }}
      />

      {/* ── JSON-LD: CollectionPage ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: isFr
              ? "Archive du Blog Football"
              : "Football Blog Archive",
            description: isFr
              ? "Parcourez tous les articles de PronoFoot AI par catégorie"
              : "Browse all PronoFoot AI articles by category",
            url: `${siteConfig.url}/${locale}/blog`,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
            },
            numberOfItems: total,
          }),
        }}
      />
    </div>
  );
}
