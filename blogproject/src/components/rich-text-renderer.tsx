import type React from "react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types"
import Image from "next/image"
import Link from "next/link"

interface RichTextRendererProps {
  content: any
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) {
    return null
  }

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{text}</code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="text-2xl font-bold mt-6 mb-4">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className="text-xl font-bold mt-6 mb-4">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
        <h5 className="text-lg font-bold mt-4 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
        <h6 className="text-base font-bold mt-4 mb-2">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal pl-6 mb-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => <li className="mb-1">{children}</li>,
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { title, description, file } = node.data.target.fields
        const { url, details } = file

        if (file.contentType.includes("image")) {
          return (
            <div className="my-8">
              <div
                className="relative w-full"
                style={{
                  height: `${Math.min(600, details.image.height)}px`,
                }}
              >
                <Image
                  src={`https:${url}`}
                  alt={description || title || "Embedded image"}
                  fill
                  className="object-contain"
                />
              </div>
              {title && <p className="text-center text-sm text-muted-foreground mt-2">{title}</p>}
            </div>
          )
        }

        return (
          <div className="my-4">
            <p>Embedded asset: {title}</p>
          </div>
        )
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { uri } = node.data

        return (
          <Link
            href={uri}
            className="text-primary underline hover:text-primary/80"
            target={uri.startsWith("http") ? "_blank" : undefined}
            rel={uri.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </Link>
        )
      },
      [INLINES.ENTRY_HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { slug } = node.data.target.fields

        return (
          <Link href={`/posts/${slug}`} className="text-primary underline hover:text-primary/80">
            {children}
          </Link>
        )
      },
    },
  }

  return <>{documentToReactComponents(content, options)}</>
}

