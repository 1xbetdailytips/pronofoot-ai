import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase";

interface ArticleRow {
  id: string;
  slug: string;
  article_type: string;
  fixture_id: string | null;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  meta_description_fr: string;
  meta_description_en: string;
  target_keyword: string;
  secondary_keywords: string[];
  word_count: number;
  published_at: string;
  image_url: string | null;
}

async function getArticle(slug: string): Promise<ArticleRow | null> {
  const { data } = await supabase
    .from("seo_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data as ArticleRow | null;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Article not found" };

  const isFr = params.locale === "fr";
  const title = isFr ? article.title_fr : (article.title_en || article.title_fr);
  const description = isFr
    ? article.meta_description_fr
    : (article.meta_description_en || article.meta_description_fr);

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/blog/${article.slug}`,
      languages: {
        fr: `/fr/blog/${article.slug}`,
        en: `/en/blog/${article.slug}`,
        "x-default": `/fr/blog/${article.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.published_at,
      url: `${siteConfig.url}/${params.locale}/blog/${article.slug}`,
      images: article.image_url
        ? [{ url: article.image_url, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const locale = params.locale;
  const isFr = locale === "fr";
  const title = isFr ? article.title_fr : (article.title_en || article.title_fr);
  const content = isFr ? article.content_fr : (article.content_en || article.content_fr);
  const date = new Date(article.published_at).toLocaleDateString(
    isFr ? "fr-FR" : "en-US",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );
  const readTime = Math.max(1, Math.ceil(article.word_count / 200));

  const typeLabels: Record<string, { fr: string; en: string }> = {
    preview: { fr: "Pronostic", en: "Match Preview" },
    recap: { fr: "Résultats du Jour", en: "Daily Recap" },
    guide: { fr: "Guide", en: "Guide" },
    league: { fr: "Analyse Ligue", en: "League Analysis" },
    weekly: { fr: "Récap Hebdo", en: "Weekly Roundup" },
  };
  const typeMeta = typeLabels[article.article_type] || typeLabels.preview;

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: isFr ? article.meta_description_fr : article.meta_description_en,
        datePublished: article.published_at,
        dateModified: article.published_at,
        author: {
          "@type": "Person",
          name: "PronoFoot AI Team",
          url: `${siteConfig.url}/${locale}/about`,
          jobTitle: isFr ? "Analyste IA Football" : "AI Football Analyst",
          worksFor: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/images/logo.png`,
            width: 512,
            height: 512,
          },
        },
        mainEntityOfPage: `${siteConfig.url}/${locale}/blog/${article.slug}`,
        ...(article.image_url ? { image: article.image_url } : {}),
        wordCount: article.word_count,
        keywords: [article.target_keyword, ...(article.secondary_keywords || [])].join(", "),
        inLanguage: isFr ? "fr" : "en",
        articleSection: isFr ? typeMeta.fr : typeMeta.en,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isFr ? "Accueil" : "Home",
            item: `${siteConfig.url}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${siteConfig.url}/${locale}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
          },
        ],
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {isFr ? "Retour au blog" : "Back to blog"}
      </Link>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-500">
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            {isFr ? typeMeta.fr : typeMeta.en}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min {isFr ? "de lecture" : "read"}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {title}
        </h1>
      </header>

      {/* Hero image */}
      {article.image_url && (
        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
          <Image
            src={article.image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-emerald-600 prose-strong:text-gray-900 dark:prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Keywords / Tags */}
      {article.secondary_keywords && article.secondary_keywords.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            {article.secondary_keywords.map((kw: string) => (
              <span
                key={kw}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 text-center">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {isFr
            ? "Recevez nos pronostics quotidiens"
            : "Get our daily predictions"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {isFr
            ? "Rejoignez notre communauté pour des analyses football IA gratuites chaque jour."
            : "Join our community for free AI football analysis every day."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/predictions`}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            {isFr ? "Voir les pronostics" : "View predictions"}
          </Link>
          <Link
            href={`/${locale}/vip`}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-emerald-600 border border-emerald-200 dark:border-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            {isFr ? "Offres VIP" : "VIP Plans"}
          </Link>
        </div>
      </div>

      {/* Internal links — SEO link equity distribution */}
      <nav className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {isFr ? "A decouvrir aussi" : "Also discover"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/predictions`} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors font-medium">
            {isFr ? "Pronostics du Jour" : "Today's Predictions"}
          </Link>
          <Link href={`/${locale}/stats`} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium">
            {isFr ? "Performance IA" : "AI Performance"}
          </Link>
          <Link href={`/${locale}/ai-lab`} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium">
            {isFr ? "Labo IA" : "AI Lab"}
          </Link>
          <Link href={`/${locale}/about`} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors font-medium">
            {isFr ? "Comment ca marche" : "How it works"}
          </Link>
          <Link href={`/${locale}/bet-builder`} className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium">
            {isFr ? "Combo Builder" : "Combo Builder"}
          </Link>
        </div>
      </nav>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
