import type { EmailListResponse, GmailConnectRequest, LoginRequest, User } from '../shared/types'

const API_BASE = ''

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export const api = {
  auth: {
    login: (data: LoginRequest) => request<{ user: User; token: string }>('POST', '/auth/login', data),
    register: (data: LoginRequest) => request<{ user: User; token: string }>('POST', '/auth/register', data),
    logout: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
  gmail: {
    connect: (data: GmailConnectRequest) => request<{ message: string }>('POST', '/gmail/connect', data),
    sync: () => request<{ emailsCount: number }>('POST', '/gmail/sync'),
  },
  emails: {
    list: (page = 1, pageSize = 20) =>
      request<EmailListResponse>('GET', `/emails?page=${page}&pageSize=${pageSize}`),
    getNetflixEmails: (page = 1, pageSize = 20) =>
      request<EmailListResponse>('GET', `/emails/netflix?page=${page}&pageSize=${pageSize}`),
  },
}
