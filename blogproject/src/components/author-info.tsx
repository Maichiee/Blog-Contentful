import Image from "next/image"
import type { Author } from "@/lib/contentful"

export default function AuthorInfo({ author }: { author: Author }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 border rounded-lg bg-card">
      {author.fields.picture && (
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={`https:${author.fields.picture.fields.file.url}`}
            alt={author.fields.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold mb-1">{author.fields.name}</h3>

        {author.fields.bio && <p className="text-muted-foreground">{author.fields.bio}</p>}
      </div>
    </div>
  )
}

