import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase";

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

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const isFr = locale === "fr";

  const { data: articles } = await supabase
    .from("seo_articles")
    .select(
      "id, slug, article_type, title_fr, title_en, meta_description_fr, meta_description_en, target_keyword, word_count, published_at"
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(30);

  const typeLabels: Record<string, { fr: string; en: string; color: string }> = {
    preview: { fr: "Pronostic", en: "Preview", color: "bg-emerald-100 text-emerald-800" },
    recap: { fr: "Résultats", en: "Recap", color: "bg-blue-100 text-blue-800" },
    guide: { fr: "Guide", en: "Guide", color: "bg-purple-100 text-purple-800" },
    league: { fr: "Ligue", en: "League", color: "bg-amber-100 text-amber-800" },
    weekly: { fr: "Hebdo", en: "Weekly", color: "bg-rose-100 text-rose-800" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isFr ? "Blog Football" : "Football Blog"}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {isFr
            ? "Analyses, pronostics et récapitulatifs par notre IA"
            : "Analysis, predictions, and recaps by our AI"}
        </p>
      </div>

      {/* Articles Grid */}
      {(!articles || articles.length === 0) ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {isFr
              ? "Aucun article pour le moment. Les premiers articles arrivent bientôt !"
              : "No articles yet. First articles coming soon!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(articles as Article[]).map((article) => {
            const title = isFr ? article.title_fr : (article.title_en || article.title_fr);
            const desc = isFr
              ? article.meta_description_fr
              : (article.meta_description_en || article.meta_description_fr);
            const typeMeta = typeLabels[article.article_type] || typeLabels.preview;
            const typeLabel = isFr ? typeMeta.fr : typeMeta.en;
            const date = new Date(article.published_at).toLocaleDateString(
              isFr ? "fr-FR" : "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            );

            return (
              <Link
                key={article.id}
                href={`/${locale}/blog/${article.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${typeMeta.color}`}
                      >
                        {typeLabel}
                      </span>
                      <span className="flex items-center text-xs text-gray-400 gap-1">
                        <Calendar className="w-3 h-3" />
                        {date}
                      </span>
                      {article.word_count > 0 && (
                        <span className="text-xs text-gray-400">
                          {article.word_count} {isFr ? "mots" : "words"}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {desc}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* JSON-LD */}
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
    </div>
  );
}
