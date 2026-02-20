<template>
  <div class="code-detail-view max-w-6xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading...</p>
    </div>

    <div v-else-if="!qrCode" class="text-center py-12">
      <p class="text-gray-600">QR code not found</p>
      <router-link
        to="/codes"
        class="text-blue-600 hover:underline mt-4 inline-block"
      >
        ← Back to list
      </router-link>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <router-link
            to="/codes"
            class="text-blue-600 hover:underline mb-2 inline-block"
          >
            ← Back to list
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 mt-2">
            {{ qrCode.name || "QR Code Details" }}
          </h1>
          <p class="text-gray-600 mt-2 break-all">
            {{ qrCode.destination_url }}
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="openEditModal"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Edit
          </button>
          <button
            @click="handleDelete"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- QR Code and Stats Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-1">
          <QrPreview
            :qr-code-image="qrCode.qrCodeImage"
            :redirect-url="qrCode.redirectUrl"
          />

          <div class="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">UTM Parameters</h3>
            <div class="space-y-1 text-sm">
              <div v-if="qrCode.utm_source">
                <span class="text-gray-600">Source:</span>
                <span class="ml-2 font-medium">{{ qrCode.utm_source }}</span>
              </div>
              <div v-if="qrCode.utm_medium">
                <span class="text-gray-600">Medium:</span>
                <span class="ml-2 font-medium">{{ qrCode.utm_medium }}</span>
              </div>
              <div v-if="qrCode.utm_campaign">
                <span class="text-gray-600">Campaign:</span>
                <span class="ml-2 font-medium">{{ qrCode.utm_campaign }}</span>
              </div>
              <div
                v-if="
                  !qrCode.utm_source &&
                  !qrCode.utm_medium &&
                  !qrCode.utm_campaign
                "
              >
                <span class="text-gray-400">No UTM parameters</span>
              </div>
            </div>
          </div>

          <div class="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">DCM Tracking</h3>
            <div class="text-sm">
              <div v-if="qrCode.dcm_impression_tag">
                <span class="text-green-600 font-medium">✓ Enabled</span>
                <p
                  class="mt-1 text-xs text-gray-500 break-all font-mono truncate"
                  :title="qrCode.dcm_impression_tag"
                >
                  {{ qrCode.dcm_impression_tag.substring(0, 80)
                  }}{{ qrCode.dcm_impression_tag.length > 80 ? "..." : "" }}
                </p>
              </div>
              <div v-else>
                <span class="text-gray-400">No DCM tracking configured</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <StatsSummary :stats="stats" />

          <!-- Date Range Picker -->
          <div class="mb-6 flex gap-4">
            <input
              v-model="startDate"
              type="date"
              class="px-4 py-2 border rounded-lg"
            />
            <input
              v-model="endDate"
              type="date"
              class="px-4 py-2 border rounded-lg"
            />
            <button
              @click="loadStats"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>

          <!-- Charts -->
          <div class="space-y-6">
            <StatsChart
              v-if="stats && stats.dailySeries.length > 0"
              title="Scans Over Time"
              type="line"
              :data="scanTimeData"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsChart
                v-if="stats && Object.keys(stats.deviceBreakdown).length > 0"
                title="Device Breakdown"
                type="doughnut"
                :data="deviceData"
              />

              <StatsChart
                v-if="stats && Object.keys(stats.browserBreakdown).length > 0"
                title="Browser Breakdown"
                type="bar"
                :data="browserData"
              />
            </div>

            <!-- Recent Scans -->
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-semibold mb-4">Recent Scans</h3>
              <div v-if="recentScans && recentScans.length > 0">
                <div class="overflow-x-auto">
                  <table class="min-w-max w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          Date & Time
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          Device
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          Browser
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          App
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          Domain
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          Referrer
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="scan in recentScans" :key="scan.id">
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {{ formatScanDate(scan.scanned_at) }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                        >
                          {{ scan.device_type }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                        >
                          {{ scan.browser }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                        >
                          {{ scan.scan_app || "-" }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                        >
                          {{ scan.scan_domain || "-" }}
                        </td>
                        <td
                          class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                        >
                          {{ scan.referrer || "-" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="text-gray-500 text-center py-4">
                No scans recorded yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeEditModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full" @click.stop>
        <h2 class="text-2xl font-bold mb-4">Edit QR Code</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              QR Code Name (Optional)
            </label>
            <input
              v-model="editForm.name"
              type="text"
              placeholder="e.g., Winter Campaign 2026"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <UrlInput
            v-model="editForm.destination_url"
            @validation="isEditValid = $event"
          />

          <UtmBuilder
            :base-url="editForm.destination_url"
            @update:params="editUtmParams = $event"
          />

          <DcmBuilder v-model="editForm.dcm_impression_tag" />
        </div>

        <div
          v-if="editStatusMessage"
          :class="[
            'mt-4 px-4 py-2 rounded-lg text-sm',
            editStatusType === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700',
          ]"
        >
          {{ editStatusMessage }}
        </div>

        <div class="flex gap-4 mt-6">
          <button
            @click="saveEdit"
            :disabled="!isEditValid || saving"
            class="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
          <button
            @click="closeEditModal"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQRCodeStore } from "@/stores/qrCodes";
import QrPreview from "@/components/QrPreview.vue";
import StatsSummary from "@/components/StatsSummary.vue";
import StatsChart from "@/components/StatsChart.vue";
import UrlInput from "@/components/UrlInput.vue";
import UtmBuilder from "@/components/UtmBuilder.vue";
import DcmBuilder from "@/components/DcmBuilder.vue";

const route = useRoute();
const router = useRouter();
const store = useQRCodeStore();

const qrCode = computed(() => store.currentQRCode);
const stats = computed(() => store.currentStats);
const recentScans = computed(() => store.recentScans);
const loading = computed(() => store.loading);

const startDate = ref("");
const endDate = ref("");
const showEditModal = ref(false);
const isEditValid = ref(true);
const saving = ref(false);
const editStatusMessage = ref("");
const editStatusType = ref<"success" | "error">("success");
const editForm = reactive({
  name: "",
  destination_url: "",
  dcm_impression_tag: "",
});
const editUtmParams = ref<Record<string, string>>({});

function closeEditModal() {
  showEditModal.value = false;
  editStatusMessage.value = "";
}

function openEditModal() {
  if (qrCode.value) {
    editForm.name = qrCode.value.name || "";
    editForm.destination_url = qrCode.value.destination_url;
    editForm.dcm_impression_tag = qrCode.value.dcm_impression_tag || "";
    editUtmParams.value = {
      ...(qrCode.value.utm_source
        ? { utm_source: qrCode.value.utm_source }
        : {}),
      ...(qrCode.value.utm_medium
        ? { utm_medium: qrCode.value.utm_medium }
        : {}),
      ...(qrCode.value.utm_campaign
        ? { utm_campaign: qrCode.value.utm_campaign }
        : {}),
      ...(qrCode.value.utm_term ? { utm_term: qrCode.value.utm_term } : {}),
      ...(qrCode.value.utm_content
        ? { utm_content: qrCode.value.utm_content }
        : {}),
    };
  }

  editStatusMessage.value = "";
  showEditModal.value = true;
}

const scanTimeData = computed(() => {
  if (!stats.value) return {};

  return {
    labels: stats.value.dailySeries.map((d) => d.date),
    datasets: [
      {
        label: "Total Scans",
        data: stats.value.dailySeries.map((d) => d.scans),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        label: "Unique Scans",
        data: stats.value.dailySeries.map((d) => d.unique_scans),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
      },
    ],
  };
});

const deviceData = computed(() => {
  if (!stats.value) return {};

  return {
    labels: Object.keys(stats.value.deviceBreakdown),
    datasets: [
      {
        data: Object.values(stats.value.deviceBreakdown),
        backgroundColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
        ],
      },
    ],
  };
});

const browserData = computed(() => {
  if (!stats.value) return {};

  return {
    labels: Object.keys(stats.value.browserBreakdown),
    datasets: [
      {
        label: "Scans",
        data: Object.values(stats.value.browserBreakdown),
        backgroundColor: "rgb(59, 130, 246)",
      },
    ],
  };
});

async function loadStats() {
  const id = parseInt(route.params.id as string);
  await store.fetchStats(id, startDate.value, endDate.value);
}

function formatScanDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const datePart = isToday
    ? "Today"
    : date.toLocaleDateString(undefined, dateOptions);
  const timePart = date.toLocaleTimeString(undefined, timeOptions);

  return `${datePart} ${timePart}`;
}

async function saveEdit() {
  const id = parseInt(route.params.id as string);
  editStatusMessage.value = "";
  saving.value = true;

  const updated = await store.updateQRCode(id, {
    name: editForm.name || undefined,
    destination_url: editForm.destination_url,
    ...editUtmParams.value,
    dcm_impression_tag: editForm.dcm_impression_tag || undefined,
  });

  saving.value = false;

  if (!updated) {
    editStatusType.value = "error";
    editStatusMessage.value = store.error || "Failed to save changes";
    return;
  }

  editStatusType.value = "success";
  editStatusMessage.value = "Changes saved successfully.";

  // Reload QR code data
  await store.fetchQRCode(id);

  setTimeout(() => {
    closeEditModal();
  }, 800);
}

async function handleDelete() {
  if (
    confirm(
      "Are you sure you want to delete this QR code? This action cannot be undone.",
    )
  ) {
    const id = parseInt(route.params.id as string);
    await store.deleteQRCode(id);

    if (store.error) {
      alert(`Error: ${store.error}`);
    } else {
      // Navigate back to list after successful delete
      router.push("/codes");
    }
  }
}

onMounted(async () => {
  const id = parseInt(route.params.id as string);
  await store.fetchQRCode(id);
  await store.fetchStats(id);
  await store.fetchRecentScans(id, 20);

  if (qrCode.value) {
    editForm.name = qrCode.value.name || "";
    editForm.destination_url = qrCode.value.destination_url;
    editForm.dcm_impression_tag = qrCode.value.dcm_impression_tag || "";
  }
});
</script>
