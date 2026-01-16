import { defineStore } from "pinia";
import { ref } from "vue";
import {
  qrCodeApi,
  type QRCode,
  type QRCodeInput,
  type Stats,
} from "@/services/api";

export const useQRCodeStore = defineStore("qrCodes", () => {
  const qrCodes = ref<QRCode[]>([]);
  const currentQRCode = ref<QRCode | null>(null);
  const currentStats = ref<Stats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function createQRCode(data: QRCodeInput): Promise<QRCode | null> {
    loading.value = true;
    error.value = null;
    try {
      const qrCode = await qrCodeApi.create(data);
      qrCodes.value.unshift(qrCode);
      return qrCode;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      error.value =
        axiosError.response?.data?.error || "Failed to create QR code";
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
      const axiosError = err as { response?: { data?: { error?: string } } };
      error.value =
        axiosError.response?.data?.error || "Failed to fetch QR codes";
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
      const axiosError = err as { response?: { data?: { error?: string } } };
      error.value =
        axiosError.response?.data?.error || "Failed to fetch QR code";
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
      const axiosError = err as { response?: { data?: { error?: string } } };
      error.value =
        axiosError.response?.data?.error || "Failed to update QR code";
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
      const axiosError = err as { response?: { data?: { error?: string } } };
      error.value =
        axiosError.response?.data?.error || "Failed to delete QR code";
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
      const axiosError = err as { response?: { data?: { error?: string } } };
      error.value = axiosError.response?.data?.error || "Failed to fetch stats";
    } finally {
      loading.value = false;
    }
  }

  return {
    qrCodes,
    currentQRCode,
    currentStats,
    loading,
    error,
    createQRCode,
    fetchQRCodes,
    fetchQRCode,
    updateQRCode,
    deleteQRCode,
    fetchStats,
  };
});
