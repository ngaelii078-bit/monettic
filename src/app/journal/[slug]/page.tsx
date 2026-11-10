import { notFound } from "next/navigation";
import Link from "next/link";
import { Arrow } from "@/components/ui";
import type { Metadata } from "next";
import { articles } from "@/lib/content";
import { Contact } from "@/components/contact";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbSchema, organizationId, pageMetadata } from "@/lib/seo";

export function generateStaticParams() { return articles.map(article => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  return pageMetadata(article.title, article.description, `/journal/${slug}/`, "article");
}

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  const path = `/journal/${slug}/`;
  return <main id="main"><JsonLd data={{ "@context": "https://schema.org", "@graph": [
    { "@type": "BlogPosting", "@id": `${absoluteUrl(path)}#article`, headline: article.title, description: article.description, mainEntityOfPage: absoluteUrl(path), url: absoluteUrl(path), inLanguage: "en-ZA", articleSection: article.category, author: { "@id": organizationId }, publisher: { "@id": organizationId }, image: absoluteUrl("/social-card.png") },
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: article.title, path }]),
  ] }} /><article className="article-page light-section"><div className="article-container"><Link href="/#journal" className="article-back"><Arrow direction="left" />Back to the journal</Link><div className="eyebrow">{article.category} <span> / </span> {article.readTime}</div><h1>{article.title}</h1><p className="article-standfirst">{article.description}</p><div className="article-byline">Words by monettic · Studio notes</div><div className="article-body">{article.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><Link href="/#journal" className="text-button dark-text">More from the studio <Arrow diagonal /></Link></div></article><Contact /></main>;
}
