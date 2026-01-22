import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import {
  qrCodeApi,
  type QRCode,
  type QRCodeInput,
  type Stats,
  type ScanEvent,
} from "@/services/api";

export const useQRCodeStore = defineStore("qrCodes", () => {
  const qrCodes = ref<QRCode[]>([]);
  const currentQRCode = ref<QRCode | null>(null);
  const currentStats = ref<Stats | null>(null);
  const recentScans = ref<ScanEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function extractApiMessage(data: unknown): string | null {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (typeof data === "object") {
      const body = data as {
        error?: string;
        message?: string;
        detail?: string;
        errors?: string[] | Record<string, string | string[]>;
      };

      if (body.error) return body.error;
      if (body.message) return body.message;
      if (body.detail) return body.detail;

      if (Array.isArray(body.errors)) {
        return body.errors.filter(Boolean).join("; ");
      }

      if (body.errors && typeof body.errors === "object") {
        const parts = Object.entries(body.errors)
          .flatMap(([field, value]) =>
            Array.isArray(value)
              ? value.map((msg) => `${field}: ${msg}`)
              : [`${field}: ${value}`],
          )
          .filter(Boolean);
        return parts.length ? parts.join("; ") : null;
      }
    }
    return null;
  }

  function formatAxiosError(
    err: unknown,
    fallback: string,
    context?: string,
  ): string {
    if (!axios.isAxiosError(err)) {
      return fallback;
    }

    const status = err.response?.status;
    const data = err.response?.data as unknown;
    const apiMessage = extractApiMessage(data);

    if (!err.response) {
      return "Network error: unable to reach the QR service. Check your connection or API URL.";
    }

    if (status === 400) {
      return (
        apiMessage ||
        `Validation failed${
          context ? ` while ${context}` : ""
        }. Check the destination URL and parameters.`
      );
    }

    if (status === 401 || status === 403) {
      return "Authorization failed. Please sign in or verify access to the QR service.";
    }

    if (status === 404) {
      return "QR API endpoint not found. Verify VITE_API_URL or the backend route.";
    }

    if (status && status >= 500) {
      return "Server error while processing the request. Please try again later.";
    }

    return apiMessage || fallback;
  }

  function logAxiosError(action: string, err: unknown, payload?: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(`[QR API] ${action} failed`, {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        method: err.config?.method,
        payload,
      });
      return;
    }

    console.error(`[QR API] ${action} failed`, { error: err, payload });
  }

  async function createQRCode(data: QRCodeInput): Promise<QRCode | null> {
    loading.value = true;
    error.value = null;
    try {
      const qrCode = await qrCodeApi.create(data);
      qrCodes.value.unshift(qrCode);
      return qrCode;
    } catch (err: unknown) {
      logAxiosError("create QR code", err, data);
      error.value = formatAxiosError(
        err,
        "Failed to create QR code",
        "creating a QR code",
      );
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function fetchQRCodes() {
    loading.value = true;
    error.value = null;
    try {
      qrCodes.value = await qrCodeApi.getAll();
    } catch (err: unknown) {
      logAxiosError("fetch QR codes", err);
      error.value = formatAxiosError(err, "Failed to fetch QR codes");
    } finally {
      loading.value = false;
    }
  }

  async function fetchQRCode(id: number) {
    loading.value = true;
    error.value = null;
    try {
      currentQRCode.value = await qrCodeApi.getById(id);
    } catch (err: unknown) {
      logAxiosError("fetch QR code", err, { id });
      error.value = formatAxiosError(err, "Failed to fetch QR code");
    } finally {
      loading.value = false;
    }
  }

  async function updateQRCode(id: number, data: Partial<QRCodeInput>) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await qrCodeApi.update(id, data);
      const index = qrCodes.value.findIndex((qr) => qr.id === id);
      if (index !== -1) {
        qrCodes.value[index] = updated;
      }
      if (currentQRCode.value?.id === id) {
        currentQRCode.value = updated;
      }
      return updated;
    } catch (err: unknown) {
      logAxiosError("update QR code", err, { id, data });
      error.value = formatAxiosError(err, "Failed to update QR code");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteQRCode(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await qrCodeApi.delete(id);
      qrCodes.value = qrCodes.value.filter((qr) => qr.id !== id);
    } catch (err: unknown) {
      logAxiosError("delete QR code", err, { id });
      error.value = formatAxiosError(err, "Failed to delete QR code");
    } finally {
      loading.value = false;
    }
  }

  async function fetchStats(id: number, startDate?: string, endDate?: string) {
    loading.value = true;
    error.value = null;
    try {
      currentStats.value = await qrCodeApi.getStats(id, startDate, endDate);
    } catch (err: unknown) {
      logAxiosError("fetch QR stats", err, { id, startDate, endDate });
      error.value = formatAxiosError(err, "Failed to fetch stats");
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecentScans(id: number, limit?: number) {
    loading.value = true;
    error.value = null;
    try {
      recentScans.value = await qrCodeApi.getRecentScans(id, limit);
    } catch (err: unknown) {
      logAxiosError("fetch recent scans", err, { id, limit });
      error.value = formatAxiosError(err, "Failed to fetch recent scans");
    } finally {
      loading.value = false;
    }
  }

  return {
    qrCodes,
    currentQRCode,
    currentStats,
    recentScans,
    loading,
    error,
    createQRCode,
    fetchQRCodes,
    fetchQRCode,
    updateQRCode,
    deleteQRCode,
    fetchStats,
    fetchRecentScans,
  };
});
