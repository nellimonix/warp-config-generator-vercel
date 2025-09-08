"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RiGithubLine } from "react-icons/ri"

interface GitHubStarsBadgeProps {
  repository: string
  href: string
  className?: string
  children: React.ReactNode
}

export function GitHubStarsBadge({ 
  repository, 
  href, 
  className = "w-full", 
  children 
}: GitHubStarsBadgeProps) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repository}`)
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)
        }
      } catch (error) {
        console.error('Ошибка при получении количества звезд:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [repository])

  return (
    <Button asChild variant="secondary" className={`${className} relative`}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        <RiGithubLine />
        {children}
        {!loading && starCount !== null && (
          <div className="absolute -top-1 -right-1 bg-white text-black text-xs px-1.5 py-0.5 rounded-[5px] min-w-[20px] text-center font-medium">
            ★ {starCount}
          </div>
        )}
      </a>
    </Button>
  )
}