<template>
  <div class="codes-list-view max-w-6xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My QR Codes</h1>
      <router-link
        to="/"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        + Create New
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, URL, or campaign..."
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredQRCodes.length === 0" class="text-center py-12">
      <svg
        class="w-24 h-24 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-gray-600 mb-4">No QR codes found</p>
      <router-link to="/" class="text-blue-600 hover:underline">
        Create your first QR code →
      </router-link>
    </div>

    <!-- QR Codes Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Destination
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Campaign
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Scans
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="qr in filteredQRCodes"
            :key="qr.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="$router.push(`/codes/${qr.id}`)"
          >
            <td class="px-6 py-4">
              <p class="text-sm font-medium text-gray-900">
                {{ qr.name || "Unnamed" }}
              </p>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900 truncate max-w-xs">
                {{ qr.destination_url }}
              </p>
              <p class="text-xs text-gray-500">{{ qr.redirectUrl }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ qr.utm_campaign || "-" }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDate(qr.created_at) }}
            </td>
            <td class="px-6 py-4">
              <span class="text-sm font-semibold text-blue-600">
                {{ qr.totalScans || 0 }}
              </span>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                @click.stop="deleteQR(qr.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQRCodeStore } from "@/stores/qrCodes";

const store = useQRCodeStore();
const searchQuery = ref("");

const loading = computed(() => store.loading);

const filteredQRCodes = computed(() => {
  if (!searchQuery.value) return store.qrCodes;

  const query = searchQuery.value.toLowerCase();
  return store.qrCodes.filter(
    (qr) =>
      qr.name?.toLowerCase().includes(query) ||
      qr.destination_url.toLowerCase().includes(query) ||
      qr.utm_campaign?.toLowerCase().includes(query)
  );
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function deleteQR(id: number) {
  if (confirm("Are you sure you want to delete this QR code?")) {
    await store.deleteQRCode(id);
    if (store.error) {
      alert(`Error: ${store.error}`);
    }
  }
}

onMounted(() => {
  store.fetchQRCodes();
});
</script>
