<template>
  <div class="home-view max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Generate QR Code</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left side: Form -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            QR Code Name (Optional)
          </label>
          <input
            v-model="qrName"
            type="text"
            placeholder="e.g., Winter Campaign 2026, Product Launch"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <UrlInput v-model="destinationUrl" @validation="isUrlValid = $event" />

        <UtmBuilder
          :base-url="destinationUrl"
          @update:params="utmParams = $event"
        />

        <DcmBuilder v-model="dcmImpressionTag" />

        <button
          @click="generateQR"
          :disabled="!isUrlValid || loading"
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? "Generating..." : "Generate QR Code" }}
        </button>

        <div
          v-if="error"
          class="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-700">{{ error }}</p>
        </div>

        <div
          v-if="generatedQR"
          class="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-green-700 font-medium mb-2">
            QR Code generated successfully!
          </p>
          <router-link
            :to="`/codes/${generatedQR.id}`"
            class="text-blue-600 hover:underline"
          >
            View details and stats →
          </router-link>
        </div>
      </div>

      <!-- Right side: Preview -->
      <div>
        <QrPreview
          :qr-code-image="generatedQR?.qrCodeImage"
          :redirect-url="generatedQR?.redirectUrl"
        />
      </div>
    </div>

    <!-- Recent QR Codes -->
    <div v-if="recentQRCodes.length > 0" class="mt-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Recent QR Codes</h2>
        <router-link to="/codes" class="text-blue-600 hover:underline">
          View all →
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="qr in recentQRCodes.slice(0, 3)"
          :key="qr.id"
          class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          @click="$router.push(`/codes/${qr.id}`)"
        >
          <p class="font-semibold text-gray-900 mb-1">
            {{ qr.name || "Unnamed QR Code" }}
          </p>
          <p class="text-sm text-gray-600 mb-2 truncate">
            {{ qr.destination_url }}
          </p>
          <p class="text-lg font-semibold text-gray-900">
            {{ qr.totalScans || 0 }} scans
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQRCodeStore } from "@/stores/qrCodes";
import UrlInput from "@/components/UrlInput.vue";
import UtmBuilder from "@/components/UtmBuilder.vue";
import DcmBuilder from "@/components/DcmBuilder.vue";
import QrPreview from "@/components/QrPreview.vue";
import type { QRCode } from "@/services/api";

const store = useQRCodeStore();

const qrName = ref("");
const destinationUrl = ref("");
const isUrlValid = ref(false);
const utmParams = ref<Record<string, string>>({});
const dcmImpressionTag = ref("");
const generatedQR = ref<QRCode | null>(null);
const recentQRCodes = ref<QRCode[]>([]);

const loading = ref(false);
const error = ref<string | null>(null);

async function generateQR() {
  if (!isUrlValid.value) return;

  loading.value = true;
  error.value = null;

  const result = await store.createQRCode({
    name: qrName.value || undefined,
    destination_url: destinationUrl.value,
    ...utmParams.value,
    dcm_impression_tag: dcmImpressionTag.value || undefined,
  });

  loading.value = false;

  if (result) {
    generatedQR.value = result;
    await loadRecentQRCodes();
  } else {
    error.value = store.error || "Failed to generate QR code";
  }
}

async function loadRecentQRCodes() {
  await store.fetchQRCodes();
  recentQRCodes.value = store.qrCodes;
}

onMounted(() => {
  loadRecentQRCodes();
});
</script>
