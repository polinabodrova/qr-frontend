import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface QRCodeInput {
  name?: string;
  destination_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  dcm_impression_tag?: string;
}

export interface QRCode {
  id: number;
  slug: string;
  name?: string;
  destination_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  dcm_impression_tag?: string;
  created_at: string;
  redirectUrl: string;
  qrCodeImage?: string;
  totalScans?: number;
}

export interface Stats {
  totalScans: number;
  uniqueScans: number;
  dailySeries: Array<{ date: string; scans: number; unique_scans: number }>;
  topCountries: Array<{ country: string; scans: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
}

export interface ScanEvent {
  id: number;
  scanned_at: string;
  device_type: string;
  browser: string;
  referrer?: string;
}

export const qrCodeApi = {
  create: async (data: QRCodeInput): Promise<QRCode> => {
    const response = await api.post<QRCode>("/api/qrcodes", data);
    return response.data;
  },

  getAll: async (): Promise<QRCode[]> => {
    const response = await api.get<QRCode[]>("/api/qrcodes");
    return response.data;
  },

  getById: async (id: number): Promise<QRCode> => {
    const response = await api.get<QRCode>(`/api/qrcodes/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<QRCodeInput>): Promise<QRCode> => {
    const response = await api.put<QRCode>(`/api/qrcodes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/qrcodes/${id}`);
  },

  getStats: async (
    id: number,
    startDate?: string,
    endDate?: string,
  ): Promise<Stats> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get<Stats>(`/api/qrcodes/${id}/stats`, {
      params,
    });
    return response.data;
  },

  getRecentScans: async (id: number, limit?: number): Promise<ScanEvent[]> => {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();

    const response = await api.get<ScanEvent[]>(`/api/qrcodes/${id}/scans`, {
      params,
    });
    return response.data;
  },
};

export default api;
