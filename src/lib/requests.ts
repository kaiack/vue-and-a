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

export const fetchThreads = async (start: number, token: string): Promise<Thread[]> => {
  const response = await ForumClient.get<ThreadIds>('/threads', {
    params: { start: start },
    headers: { Authorization: `Bearer ${token}` },
  })
  const threads = await Promise.all(
    response.data.map((id) =>
      ForumClient.get<Thread>('/thread', {
        params: { id: id },
        headers: { Authorization: `Bearer ${token}` },
      }),
    ),
  )
  return threads.map((thread) => thread.data)
}
