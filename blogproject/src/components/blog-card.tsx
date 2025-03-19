import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/lib/contentful"

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col h-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md">
      <Link href={`/posts/${post.fields.slug}`} className="group">
        <div className="relative h-48 w-full overflow-hidden">
          {post.fields.featuredImage ? (
            <Image
              src={`https:${post.fields.featuredImage.fields.file.url}`}
              alt={post.fields.featuredImage.fields.title || post.fields.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-5">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.sys.createdAt}>{formatDate(post.sys.createdAt)}</time>

            {post.fields.categories && post.fields.categories.length > 0 && (
              <>
                <span>•</span>
                <span>{post.fields.categories[0].fields.name}</span>
              </>
            )}
          </div>

          <h2 className="mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
            {post.fields.title}
          </h2>

          {post.fields.excerpt && (
            <p className="mb-4 line-clamp-3 flex-grow text-muted-foreground">{post.fields.excerpt}</p>
          )}

          <div className="mt-auto flex items-center">
            {post.fields.author && post.fields.author.fields.picture ? (
              <div className="flex items-center">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={`https:${post.fields.author.fields.picture.fields.file.url}`}
                    alt={post.fields.author.fields.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="ml-2 text-sm font-medium">{post.fields.author.fields.name}</span>
              </div>
            ) : (
              <span className="text-sm font-medium">{post.fields.author?.fields.name || "Anonymous"}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

