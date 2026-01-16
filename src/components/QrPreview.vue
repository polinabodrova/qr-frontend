<template>
  <div class="qr-preview bg-white p-6 rounded-lg border">
    <div v-if="qrCodeImage" class="text-center">
      <img :src="qrCodeImage" alt="QR Code" class="mx-auto mb-4 w-64 h-64" />

      <div class="space-y-2">
        <button
          @click="downloadQR"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Download QR Code
        </button>

        <button
          @click="copyLink"
          class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          {{ copied ? "Copied!" : "Copy Short Link" }}
        </button>

        <div class="mt-4 p-3 bg-gray-50 rounded-md">
          <p class="text-xs font-medium text-gray-700 mb-1">Short URL:</p>
          <p class="text-sm text-blue-600 break-all">{{ redirectUrl }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 py-12">
      <svg
        class="w-32 h-32 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        />
      </svg>
      <p>QR Code will appear here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  qrCodeImage?: string;
  redirectUrl?: string;
}>();

const copied = ref(false);

function downloadQR() {
  if (!props.qrCodeImage) return;

  const link = document.createElement("a");
  link.href = props.qrCodeImage;
  link.download = `qr-code-${Date.now()}.png`;
  link.click();
}

function copyLink() {
  if (!props.redirectUrl) return;

  navigator.clipboard.writeText(props.redirectUrl);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>
