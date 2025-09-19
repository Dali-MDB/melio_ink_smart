const API_BASE_URL = 'http://localhost:8000'
export { API_BASE_URL }

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      console.log(`Making request to: ${url}`)
      console.log('Request config:', config)
      
      const response = await fetch(url, config)
      
      console.log(`Response status: ${response.status}`)
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Response not ok:', errorData)
        throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      console.log('Content-Type:', contentType)
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log('Response data:', data)
        return data
      } else {
        // Handle non-JSON responses
        const text = await response.text()
        console.log('Response text:', text)
        throw new Error('Expected JSON response but got: ' + contentType)
      }
      
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/users/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    return this.request('/users/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async refreshToken(refreshToken) {
    return this.request('/users/auth/access_token/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    })
  }

  async getCurrentUser() {
    return this.request('/users/current/', {
      method: 'GET',
    })
  }

  async getCurrentUserProfile() {
    return this.request('/users/profile/me/', {
      method: 'GET',
    })
  }

  async updateProfile(profileData) {
    return this.request('/users/profile/me/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Profile picture methods
  async uploadProfilePicture(file) {
    console.log('API: Uploading profile picture to:', `${this.baseURL}/users/profile/upload_pfp/`)
    console.log('API: File:', file)
    
    const formData = new FormData()
    formData.append('pfp', file)
    
    const url = `${this.baseURL}/users/profile/upload_pfp/`
    const token = localStorage.getItem('access_token')
    
    console.log('API: Token exists:', !!token)
    console.log('API: FormData contents:', Array.from(formData.entries()))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    })
    
    console.log('API: Response status:', response.status)
    console.log('API: Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API: Upload error:', errorData)
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('API: Upload success:', result)
    return result
  }

  async removeProfilePicture() {
    return this.request('/users/profile/remove_pfp/', {
      method: 'DELETE',
    })
  }

  // Posts methods
  async getPosts(params = {}) {
    const queryParams = new URLSearchParams()
    
    // Add filter parameters
    if (params.tags) {
      if (Array.isArray(params.tags)) {
        params.tags.forEach(tag => queryParams.append('tags', tag))
      } else {
        queryParams.append('tags', params.tags)
      }
    }
    
    if (params.search) {
      queryParams.append('search', params.search)
    }
    
    if (params.created_after) {
      queryParams.append('created_after', params.created_after)
    }
    
    if (params.created_before) {
      queryParams.append('created_before', params.created_before)
    }

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/posts/?${queryString}` : '/posts/'
    
    console.log('Getting posts with params:', params)
    console.log('Endpoint:', endpoint)
    
    return this.request(endpoint, {
      method: 'GET',
    })
  }

  async getPost(postId) {
    return this.request(`/posts/${postId}/`, {
      method: 'GET',
    })
  }

  async createPost(postData) {
    return this.request('/posts/', {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  }

  async updatePost(postId, postData) {
    return this.request(`/posts/${postId}/`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    })
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}/`, {
      method: 'DELETE',
    })
  }

  async publishDraft(postId) {
    return this.request(`/posts/${postId}/publish/`, {
      method: 'POST',
    })
  }

  // Likes methods
  async likePost(postId) {
    return this.request(`/posts/${postId}/like/`, {
      method: 'POST',
    })
  }

  async getPostLikes(postId) {
    return this.request(`/posts/${postId}/all_likes/`, {
      method: 'GET',
    })
  }

  // Bookmarks methods
  async savePost(postId) {
    return this.request(`/posts/save_post/?post_id=${postId}`, {
      method: 'POST',
    })
  }

  async getSavedPosts() {
    return this.request('/posts/saved_posts/', {
      method: 'GET',
    })
  }

  // Tags methods
  async getTags() {
    return this.request('/posts/tags/', {
      method: 'GET',
    })
  }

  async createTag(tagData) {
    return this.request('/posts/tags/', {
      method: 'POST',
      body: JSON.stringify(tagData),
    })
  }

  // Comments methods
  async getPostComments(postId) {
    return this.request(`/posts/${postId}/comments/`, {
      method: 'GET',
    })
  }

  async getComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}/`, {
      method: 'GET',
    })
  }

  async createComment(postId, commentData, parentCommentId = null) {
    const url = parentCommentId 
      ? `/posts/${postId}/comments/?parent_comment_id=${parentCommentId}`
      : `/posts/${postId}/comments/`
    
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(commentData),
    })
  }

  async updateComment(postId, commentId, commentData) {
    return this.request(`/posts/${postId}/comments/${commentId}/`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    })
  }

  async deleteComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}/`, {
      method: 'DELETE',
    })
  }

  // Comment likes methods
  async likeComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}/like/`, {
      method: 'POST',
    })
  }

  // Get user comments
  async getUserComments() {
    return this.request('/posts/user_comments/', {
      method: 'GET',
    })
  }
}

export const apiClient = new ApiClient()
