'use client'

import { Facebook, Linkedin, Twitter, LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from "sonner" // Perubahan di sini

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ]
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("The article link has been copied to your clipboard.") // Perubahan di sini
      },
      () => {
        toast.error("Could not copy the link to your clipboard.") // Perubahan di sini
      }
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.open(link.shareUrl, '_blank', 'noopener,noreferrer')}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}