import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/lib/contentful"
import { formatDate } from "@/lib/utils"

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.sys.id}
          href={`/posts/${post.fields.slug}`}
          className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow"
        >
          <div className="relative h-40 w-full overflow-hidden">
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

          <div className="flex flex-col p-4">
            <div className="mb-1 text-xs text-muted-foreground">{formatDate(post.sys.createdAt)}</div>

            <h3 className="line-clamp-2 text-base font-semibold transition-colors group-hover:text-primary">
              {post.fields.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

