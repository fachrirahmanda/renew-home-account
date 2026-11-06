export interface User {
  id: string
  email: string
  gmailEmail?: string
  gmailPassword?: string
  createdAt: string
  updatedAt: string
}

export interface Email {
  id: string
  userId: string
  subject: string
  fromEmail: string
  toEmail: string
  body?: string
  htmlBody?: string
  receivedAt: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GmailConnectRequest {
  gmailEmail: string
  gmailPassword: string
}

export interface EmailListResponse {
  emails: Email[]
  total: number
  page: number
  pageSize: number
}
