"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, ThumbsUp, Reply, Flag, Clock } from "lucide-react"

interface ReportCommentsProps {
  reportId: string
}

export function ReportComments({ reportId }: ReportCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const { toast } = useToast()

  // Mock comments data
  const comments = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      content:
        "I've also noticed this pothole getting worse. Had to get my alignment fixed last week because of it. Thanks for reporting!",
      createdAt: "2024-01-15T12:00:00Z",
      likes: 5,
      replies: [
        {
          id: 2,
          author: {
            name: "Mike Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            isVerified: false,
          },
          content: "Same here! Cost me $200 in tire repairs.",
          createdAt: "2024-01-15T13:30:00Z",
          likes: 2,
        },
      ],
    },
    {
      id: 3,
      author: {
        name: "City Maintenance",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
        isOfficial: true,
      },
      content:
        "Thank you for this report. We have added this to our priority repair list and expect to address it within the next 2 weeks. We'll update this thread when work begins.",
      createdAt: "2024-01-15T15:45:00Z",
      likes: 12,
      replies: [],
    },
    {
      id: 4,
      author: {
        name: "Alex Rivera",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      },
      content:
        "Great to see the city responding quickly! This is exactly why we need more community reporting.",
      createdAt: "2024-01-15T16:20:00Z",
      likes: 3,
      replies: [],
    },
  ]

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion",
    })
    setNewComment("")
    setReplyTo(null)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments (
          {comments.length +
            comments.reduce((acc, c) => acc + c.replies.length, 0)}
          )
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Share your thoughts or additional information about this report..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Be respectful and constructive in your comments
            </p>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src={comment.author.avatar || "/placeholder.svg"}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>
                    {comment.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{comment.author.name}</span>
                    {comment.author.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                    {comment.author.isOfficial && (
                      <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        Official
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(comment.createdAt)}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                    >
                      <Flag className="h-3 w-3" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-12 space-y-4 border-l-2 border-muted pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={reply.author.avatar || "/placeholder.svg"}
                          alt={reply.author.name}
                        />
                        <AvatarFallback className="text-xs">
                          {reply.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {reply.author.name}
                          </span>
                          {reply.author.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(reply.createdAt)}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 gap-1 text-xs"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {reply.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 gap-1 text-xs"
                          >
                            <Flag className="h-3 w-3" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="ml-12 space-y-3">
                  <Textarea
                    placeholder={`Reply to ${comment.author.name}...`}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <Send className="h-3 w-3" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
