import axios from 'axios'

export const ForumClient = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 1000,
})

type UserInfo = {
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
