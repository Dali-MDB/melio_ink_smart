import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, User, ThumbsUp, Reply } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SAMPLE_POST = {
  id: '1',
  title: 'The Art of Mindful Writing: Finding Your Voice in a Noisy World',
  content: `In our fast-paced digital age, where notifications ping every few seconds and the constant hum of information threatens to drown out our inner voice, the practice of mindful writing offers a sanctuary for authentic expression.

Writing has always been more than just putting words on paper. It's a conversation with ourselves, a way to process the complexities of human experience, and a bridge to connect with others who share our struggles and triumphs.

## The Noise Around Us

We live in unprecedented times of information overload. Social media feeds scroll endlessly, news cycles spin frantically, and everyone seems to have an opinion about everything. In this cacophony, how do we find our authentic voice?

The answer lies not in adding to the noise, but in cultivating the silence within ourselves.

## Mindful Writing as Practice

Mindful writing is more than a technique—it's a practice of presence. When we write mindfully, we:

- **Listen deeply** to our inner voice
- **Observe** our thoughts without judgment
- **Allow** authentic expression to emerge
- **Trust** the process of discovery

This isn't about perfection or even about creating something others will read. It's about the sacred act of witnessing our own thoughts and giving them form.

## Finding Your Voice

Your voice isn't something you find once and keep forever. It's something you discover again and again, like a friend you meet for coffee who reveals new dimensions of themselves each time.

Sometimes your voice is bold and declarative. Sometimes it whispers. Sometimes it asks questions instead of providing answers. All of these are valid, all of these are you.

The key is to write from a place of honesty rather than a place of performance.

## The Practice

Start small. Set aside ten minutes each morning. No agenda, no pressure to produce anything meaningful. Just you, a blank page, and whatever wants to emerge.

Write about the quality of light in your room. Write about the sound of rain. Write about that conversation you had yesterday that left you feeling unsettled.

Write without editing, without second-guessing, without worrying about grammar or structure. Just let the words flow.

Over time, you'll begin to recognize patterns—themes that emerge, ways of seeing that are uniquely yours, a voice that is unmistakably authentic because it comes from the only place it can: within you.

In a world full of noise, your authentic voice is both a rebellion and a gift. To yourself, and to all of us who are waiting to hear what you have to say.`,
  author: {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    bio: 'Writer, mindfulness teacher, and advocate for authentic expression. Author of "The Quiet Revolution."'
  },
  featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
  tags: ['Writing', 'Mindfulness', 'Creativity'],
  likes: 42,
  comments: 8,
  publishedAt: '2 days ago',
  isLiked: false,
  isBookmarked: true
}

const SAMPLE_COMMENTS = [
  {
    id: '1',
    author: {
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    content: 'This resonates so deeply with me. I\'ve been struggling to find my voice in my writing, and your advice about writing from honesty rather than performance really hits home. Thank you for this beautiful piece.',
    likes: 5,
    publishedAt: '1 day ago',
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
        },
        content: 'Thank you, Alex! It\'s such a common struggle, and I think that\'s what makes writing communities so valuable. We\'re all finding our way together.',
        likes: 2,
        publishedAt: '1 day ago'
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    content: 'The ten-minute morning practice suggestion is gold. I\'ve been doing this for a week now and already notice a difference in how I approach my creative work. Sometimes the simplest advice is the most profound.',
    likes: 8,
    publishedAt: '2 days ago',
    replies: []
  },
  {
    id: '3',
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    content: 'Beautiful writing about beautiful writing. The meta nature of this doesn\'t escape me, and I love how your authentic voice shines through while teaching others to find theirs.',
    likes: 3,
    publishedAt: '2 days ago',
    replies: []
  }
]

export default function PostDetail() {
  const { id } = useParams()
  const [post] = useState(SAMPLE_POST)
  const [comments] = useState(SAMPLE_COMMENTS)
  const [liked, setLiked] = useState(post.isLiked)
  const [bookmarked, setBookmarked] = useState(post.isBookmarked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [newComment, setNewComment] = useState('')

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    setNewComment('')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-blog-gray mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-grow">
              <p className="font-semibold text-blog-gray">{post.author.name}</p>
              <p className="text-blog-gray/60">{post.publishedAt}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-sm font-medium bg-blog-green/10 text-blog-green rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between py-4 border-y border-blog-gray/10">
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  liked ? 'text-red-500' : 'text-blog-gray/60 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-blog-gray/60">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBookmark}
                className={`transition-colors ${
                  bookmarked ? 'text-blog-sage' : 'text-blog-gray/60 hover:text-blog-sage'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="text-blog-gray/60 hover:text-blog-green transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="font-serif text-2xl font-bold text-blog-gray mt-8 mb-4">
                  {paragraph.slice(3)}
                </h2>
              )
            }
            if (paragraph.includes('- **')) {
              return (
                <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                  {paragraph.split('\n').map((item, itemIndex) => {
                    if (item.startsWith('- **')) {
                      const boldText = item.match(/\*\*(.*?)\*\*/)?.[1] || ''
                      const restText = item.replace(/- \*\*(.*?)\*\*/, '').trim()
                      return (
                        <li key={itemIndex} className="text-blog-gray/80">
                          <strong className="text-blog-gray">{boldText}</strong> {restText}
                        </li>
                      )
                    }
                    return null
                  })}
                </ul>
              )
            }
            return (
              <p key={index} className="text-blog-gray/80 leading-relaxed mb-6">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Author Bio */}
        <div className="bg-white/60 rounded-xl p-6 mb-12">
          <div className="flex items-start space-x-4">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-blog-gray mb-2">About {post.author.name}</h3>
              <p className="text-blog-gray/70 leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="border-t border-blog-gray/10 pt-8">
          <h3 className="font-serif text-2xl font-bold text-blog-gray mb-6">
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-blog-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-green/50 focus:border-blog-green bg-white/50 resize-none"
              rows={4}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-blog-green text-white px-6 py-2 rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white/40 rounded-lg p-6">
                {/* Comment Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-blog-gray">{comment.author.name}</p>
                    <p className="text-sm text-blog-gray/60">{comment.publishedAt}</p>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-blog-gray/80 leading-relaxed mb-4">{comment.content}</p>

                {/* Comment Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors">
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="bg-blog-ivory/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src={reply.author.avatar} 
                            alt={reply.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div className="flex-grow">
                            <p className="font-medium text-blog-gray text-sm">{reply.author.name}</p>
                            <p className="text-xs text-blog-gray/60">{reply.publishedAt}</p>
                          </div>
                        </div>
                        <p className="text-blog-gray/80 text-sm leading-relaxed mb-3">{reply.content}</p>
                        <button className="flex items-center space-x-1 text-blog-gray/60 hover:text-blog-green transition-colors text-xs">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}
