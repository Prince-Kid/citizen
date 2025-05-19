export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface Complaint {
  id: string
  subject: string
  category: string
  description: string
  status: "pending" | "in-progress" | "resolved"
  date: string
  email: string
  phone?: string
  location?: string
  responses: Response[]
}

export interface Response {
  id: string
  complaintId: string
  date: string
  message: string
  author: string
}

export interface StatusCount {
  pending: number
  inProgress: number
  resolved: number
}
