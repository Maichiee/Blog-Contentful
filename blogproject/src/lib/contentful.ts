import { createClient } from "contentful"

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
})

// Types for Contentful responses
export interface Author {
  sys: {
    id: string
  }
  fields: {
    name: string
    bio?: string
    picture?: {
      fields: {
        file: {
          url: string
        }
        title: string
      }
    }
  }
}

export interface Category {
  sys: {
    id: string
  }
  fields: {
    name: string
    slug: string
  }
}

export interface BlogPost {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    slug: string
    excerpt?: string
    content: any // Rich text content
    featuredImage?: {
      fields: {
        file: {
          url: string
          details: {
            image: {
              width: number
              height: number
            }
          }
        }
        title: string
      }
    }
    author?: Author
    categories?: Category[]
    tags?: string[]
  }
}

interface FetchBlogPostsParams {
  page?: number
  limit?: number
  search?: string
  category?: string
}

export async function fetchBlogPosts({ page = 1, limit = 6, search = "", category = "" }: FetchBlogPostsParams) {
  const skip = (page - 1) * limit

  const query: any = {
    content_type: "blogPost",
    order: "-sys.createdAt",
    skip,
    limit,
    include: 2, // Include linked entries (author, categories)
  }

  // Add search query if provided
  if (search) {
    query["query"] = search
  }

  // Add category filter if provided
  if (category) {
    query["fields.categories.sys.id"] = category
  }

  try {
    const response = await client.getEntries<BlogPost>(query)

    return {
      posts: response.items as BlogPost[],
      total: response.total,
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return {
      posts: [],
      total: 0,
    }
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  try {
    const response = await client.getEntries<BlogPost>({
      content_type: "blogPost",
      "fields.slug": slug,
      include: 2, // Include linked entries (author, categories)
    })

    return (response.items[0] as BlogPost) || null
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }
}

export async function fetchCategories() {
  try {
    const response = await client.getEntries<Category>({
      content_type: "category",
      order: "fields.name",
    })

    return response.items as Category[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function fetchRelatedPosts(post: BlogPost, limit = 3) {
  // If the post has categories, fetch posts with the same category
  if (post.fields.categories && post.fields.categories.length > 0) {
    const categoryId = post.fields.categories[0].sys.id

    try {
      const response = await client.getEntries<BlogPost>({
        content_type: "blogPost",
        "fields.categories.sys.id": categoryId,
        "sys.id[ne]": post.sys.id, // Exclude current post
        limit,
        include: 1,
      })

      return response.items as BlogPost[]
    } catch (error) {
      console.error("Error fetching related posts:", error)
    }
  }

  // Fallback: fetch recent posts
  try {
    const response = await client.getEntries<BlogPost>({
      content_type: "blogPost",
      "sys.id[ne]": post.sys.id, // Exclude current post
      order: "-sys.createdAt",
      limit,
      include: 1,
    })

    return response.items as BlogPost[]
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    return []
  }
}

