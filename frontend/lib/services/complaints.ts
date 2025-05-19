import api from "../api";
import { Complaint, StatusCount } from "../types";

interface CreateComplaintData {
  subject: string;
  category: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
}

interface UpdateComplaintData {
  status?: "pending" | "in-progress" | "resolved";
  response?: string;
}

export const complaintsService = {
  async createComplaint(data: CreateComplaintData): Promise<Complaint> {
    const response = await api.post<Complaint>("/complaints", data);
    return response.data;
  },

  async getComplaints(): Promise<Complaint[]> {
    const response = await api.get<Complaint[]>("/complaints");
    return response.data;
  },

  async getComplaint(id: string): Promise<Complaint> {
    const response = await api.get<Complaint>(`/complaints/${id}`);
    return response.data;
  },

  async updateComplaint(
    id: string,
    data: UpdateComplaintData
  ): Promise<Complaint> {
    const response = await api.patch<Complaint>(`/complaints/${id}`, data);
    return response.data;
  },

  async getStatusCounts(): Promise<StatusCount> {
    const response = await api.get<StatusCount>("/complaints/status-counts");
    return response.data;
  },

  async getMyComplaints(): Promise<Complaint[]> {
    const response = await api.get<Complaint[]>("/complaints/my-complaints");
    return response.data;
  },
};
