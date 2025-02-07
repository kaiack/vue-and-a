import axios from 'axios'

export const ForumClient = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 1000,
})

export type UserInfo = {
  id: number
  email: string
  name: string
  password: string
  image: string
  admin: boolean
}

export const fetchUser = async (userId: number, token: string): Promise<UserInfo> => {
  const response = await ForumClient.get<UserInfo>('/user', {
    params: {
      userId: userId,
    },
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

type ThreadIds = number[]

export type Thread = {
  id: number
  content: string
  title: string
  isPublic: boolean
  creatorId: number
  createdAt: string
  lock: boolean
  likes: number[]
  watchees: number[]
}
// ID              int64   `json:"id"`
// Content         string  `json:"content"`
// CreatorId       int64   `json:"creatorId"` // Foreign Key
// ThreadId        int64   `json:"threadId"`  // Foreign Key
// ParentCommentId *int64  `json:"parentCommentId"`
// CreatedAt       string  `json:"createdAt"`
// Likes           []int64 `json:"likes"`
export type Comment = {
  id: number
  content: string
  creatorId: number
  threadId: number
  parentCommentId: number
  createdAt: string
  likes: number[]
}

export const fetchThreads = async (start: number, token: string): Promise<Thread[]> => {
  const threadIds = await ForumClient.get<ThreadIds>('/threads', {
    params: { start: start },
    headers: { Authorization: `Bearer ${token}` },
  })
  const threads = await Promise.all(
    threadIds.data.map((id) =>
      ForumClient.get<Thread>('/thread', {
        params: { id: id },
        headers: { Authorization: `Bearer ${token}` },
      }),
    ),
  )
  return threads.map((thread) => thread.data)
}

export const fetchThread = async (threadId: number, token: string): Promise<Thread> => {
  const thread = await ForumClient.get<Thread>('/thread', {
    params: { id: threadId },
    headers: { Authorization: `Bearer ${token}` },
  })
  return thread.data
}

export const fetchComments = async (threadId: number, token: string): Promise<Comment[]> => {
  const comments = await ForumClient.get<Comment[]>('/comments', {
    params: { threadId },
    headers: { Authorization: `Bearer ${token}` },
  })

  return comments.data
}
