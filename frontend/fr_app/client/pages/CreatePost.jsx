import { useState } from 'react'
import { PenTool, Save, Eye, X, Plus, Hash } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SUGGESTED_TAGS = [
  'Writing', 'Technology', 'Life Lessons', 'Productivity', 'Mental Health',
  'Creativity', 'Career', 'Philosophy', 'Travel', 'Science', 'Psychology',
  'Mindfulness', 'Leadership', 'Design', 'Personal Growth'
]

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isDraft, setIsDraft] = useState(true)
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setNewTag('')
      setShowTagSuggestions(false)
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      handleAddTag(newTag.trim())
    }
  }

  const handleSave = (saveAsDraft = true) => {
    console.log('Saving post:', { title, content, summary, tags, isDraft: saveAsDraft })
  }

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and content before publishing.')
      return
    }
    handleSave(false)
  }

  const suggestedTags = SUGGESTED_TAGS.filter(tag => 
    tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-blog-green/20 rounded-full flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blog-green" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-blog-gray">
                Write Your Story
              </h1>
              <p className="text-blog-gray/60">Share your thoughts with the ThoughtThread community</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPreview 
                  ? 'bg-blog-gray text-white' 
                  : 'border border-blog-gray/20 text-blog-gray hover:bg-blog-gray/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreview ? 'Edit' : 'Preview'}</span>
            </button>
            
            <button
              onClick={() => handleSave(true)}
              className="flex items-center space-x-2 border border-blog-green text-blog-green px-4 py-2 rounded-lg hover:bg-blog-green/5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            
            <button
              onClick={handlePublish}
              className="bg-blog-green text-white px-6 py-2 rounded-lg hover:bg-blog-green/90 transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        {!isPreview ? (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl md:text-3xl font-serif font-bold bg-transparent border-none outline-none text-blog-gray placeholder-blog-gray/40 resize-none"
                style={{ lineHeight: '1.2' }}
              />
              <div className="border-b border-blog-gray/20 mt-2"></div>
            </div>

            {/* Summary */}
            <div className="bg-white/40 rounded-lg p-4 border border-blog-gray/10">
              <label className="block text-sm font-medium text-blog-gray mb-2">
                Summary (Optional)
              </label>
              <textarea
                placeholder="A brief summary of your post to help readers understand what it's about..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-none outline-none text-blog-gray/80 placeholder-blog-gray/40 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="bg-white/40 rounded-lg p-4 border border-blog-gray/10">
              <label className="block text-sm font-medium text-blog-gray mb-3">
                Tags (up to 5)
              </label>
              
              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center space-x-1 bg-blog-green/10 text-blog-green px-3 py-1 rounded-full text-sm"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blog-green/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Tag Input */}
              {tags.length < 5 && (
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => {
                        setNewTag(e.target.value)
                        setShowTagSuggestions(true)
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowTagSuggestions(true)}
                      className="flex-1 bg-white/50 border border-blog-gray/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blog-green/50"
                    />
                    <button
                      onClick={() => handleAddTag(newTag.trim())}
                      disabled={!newTag.trim()}
                      className="p-2 bg-blog-green text-white rounded-lg hover:bg-blog-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tag Suggestions */}
                  {showTagSuggestions && suggestedTags.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-blog-gray/20 rounded-lg mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
                      {suggestedTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          className="w-full text-left px-3 py-2 hover:bg-blog-green/5 text-sm text-blog-gray border-b border-blog-gray/10 last:border-b-0"
                        >
                          <Hash className="w-3 h-3 inline mr-1 text-blog-gray/40" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-white/40 rounded-lg p-6 border border-blog-gray/10 min-h-[400px]">
              <textarea
                placeholder={`Start writing your story...

You can use simple formatting:
- **bold text**
- *italic text*
- ## Headings
- Lists and more

Share your thoughts, experiences, and insights. What story do you want to tell?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[350px] bg-transparent border-none outline-none text-blog-gray/80 placeholder-blog-gray/40 resize-none leading-relaxed"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Publishing Options */}
            <div className="bg-white/40 rounded-lg p-4 border border-blog-gray/10">
              <h3 className="font-medium text-blog-gray mb-3">Publishing Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="publishType"
                    checked={isDraft}
                    onChange={() => setIsDraft(true)}
                    className="w-4 h-4 text-blog-green focus:ring-blog-green/50"
                  />
                  <div>
                    <div className="font-medium text-blog-gray">Save as Draft</div>
                    <div className="text-sm text-blog-gray/60">Keep working on this post privately</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="publishType"
                    checked={!isDraft}
                    onChange={() => setIsDraft(false)}
                    className="w-4 h-4 text-blog-green focus:ring-blog-green/50"
                  />
                  <div>
                    <div className="font-medium text-blog-gray">Publish Now</div>
                    <div className="text-sm text-blog-gray/60">Make this post visible to everyone</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-blog-gray/10">
            <div className="max-w-none">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-blog-gray mb-6">
                {title || 'Your Post Title'}
              </h1>
              
              {summary && (
                <div className="bg-blog-green/5 border-l-4 border-blog-green p-4 mb-6">
                  <p className="text-blog-gray/80 italic">{summary}</p>
                </div>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-sm bg-blog-green/10 text-blog-green rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {content ? (
                  content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className="font-serif text-2xl font-bold text-blog-gray mt-8 mb-4">
                          {paragraph.slice(3)}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h1 key={index} className="font-serif text-3xl font-bold text-blog-gray mt-8 mb-4">
                          {paragraph.slice(2)}
                        </h1>
                      )
                    }
                    return (
                      <p key={index} className="text-blog-gray/80 leading-relaxed mb-6">
                        {paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, partIndex) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={partIndex} className="text-blog-gray">{part.slice(2, -2)}</strong>
                          }
                          if (part.startsWith('*') && part.endsWith('*')) {
                            return <em key={partIndex}>{part.slice(1, -1)}</em>
                          }
                          return part
                        })}
                      </p>
                    )
                  })
                ) : (
                  <p className="text-blog-gray/40 italic">Start writing to see your preview...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Word Count */}
        <div className="flex justify-between items-center text-sm text-blog-gray/60 mt-6 pt-6 border-t border-blog-gray/10">
          <div>
            {content.trim().split(/\s+/).filter(word => word.length > 0).length} words
            {content.trim() && ` • ${Math.ceil(content.trim().split(/\s+/).length / 200)} min read`}
          </div>
          <div>
            Last saved: Never
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
