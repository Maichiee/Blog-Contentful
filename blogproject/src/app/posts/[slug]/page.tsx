import { fetchBlogPostBySlug, fetchRelatedPosts } from "@/lib/contentful"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import RichTextRenderer from "@/components/rich-text-renderer"
import ShareButtons from "@/components/share-buttons"
import RelatedPosts from "@/components/related-posts"
import type { Metadata } from "next"
import AuthorInfo from "@/components/author-info"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found",
    }
  }

  return {
    title: post.fields.title,
    description: post.fields.excerpt || "",
    openGraph: {
      title: post.fields.title,
      description: post.fields.excerpt || "",
      images: post.fields.featuredImage?.fields.file.url
        ? [{ url: `https:${post.fields.featuredImage.fields.file.url}` }]
        : [],
      type: "article",
      publishedTime: post.sys.createdAt,
      modifiedTime: post.sys.updatedAt,
      authors: post.fields.author?.fields.name ? [post.fields.author.fields.name] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await fetchRelatedPosts(post)
  const postUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          {post.fields.featuredImage && (
            <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
              <Image
                src={`https:${post.fields.featuredImage.fields.file.url}`}
                alt={post.fields.featuredImage.fields.title || post.fields.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.fields.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={post.sys.createdAt}>{formatDate(post.sys.createdAt)}</time>

            {post.fields.categories && post.fields.categories.length > 0 && (
              <div className="flex gap-2">
                {post.fields.categories.map((category) => (
                  <span key={category.sys.id} className="bg-muted px-2 py-1 rounded-md text-sm">
                    {category.fields.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.fields.excerpt && <p className="text-xl text-muted-foreground mb-6">{post.fields.excerpt}</p>}

          <ShareButtons url={postUrl} title={post.fields.title} />
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <RichTextRenderer content={post.fields.content} />
        </div>

        {post.fields.author && <AuthorInfo author={post.fields.author} />}
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <RelatedPosts posts={relatedPosts} />
        </section>
      )}
    </main>
  )
}

