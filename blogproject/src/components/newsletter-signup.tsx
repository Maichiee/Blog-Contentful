'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import { toast } from "sonner" // Perubahan di sini

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return
    
    setIsLoading(true)
    
    try {
      // Here you would integrate with your newsletter service
      // For example, using a server action to call the API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("You've been subscribed to our newsletter.") // Perubahan di sini
      
      setEmail('')
    } catch (error) {
      toast.error("Something went wrong. Please try again later.") // Perubahan di sini
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="rounded-lg border bg-card p-8 shadow">
      <div className="flex flex-col items-center text-center">
        <Mail className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Stay updated with our latest articles, tips, and insights delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  )
}