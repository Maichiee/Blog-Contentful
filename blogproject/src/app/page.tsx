import { fetchBlogPosts } from "@/lib/contentful"
import BlogCard from "@/components/blog-card"
import Pagination from "@/components/pagination"
import SearchBar from "@/components/search-bar"
import NewsletterSignup from "@/components/newsletter-signup"
import { Suspense } from "react"
import { Search } from "lucide-react"

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const searchQuery = searchParams.search || ""
  const postsPerPage = 6

  const { posts, total } = await fetchBlogPosts({
    page: currentPage,
    limit: postsPerPage,
    search: searchQuery,
  })

  const totalPages = Math.ceil(total / postsPerPage)

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the latest insights, tutorials, and stories from our team of experts.
        </p>
      </section>

      <div className="mb-8">
        <SearchBar defaultValue={searchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Suspense fallback={<p>Loading blog posts...</p>}>
          {posts.length > 0 ? (
            posts.map((post) => <BlogCard key={post.sys.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
              <p className="text-muted-foreground">
                {searchQuery ? `No posts matching "${searchQuery}"` : "No blog posts available yet. Check back soon!"}
              </p>
            </div>
          )}
        </Suspense>
      </div>

      {posts.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} searchQuery={searchQuery} />}

      <div className="mt-16 mb-8">
        <NewsletterSignup />
      </div>
    </main>
  )
}

