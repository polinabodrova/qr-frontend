<template>
  <div class="stats-summary grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <p class="text-sm text-gray-600 mb-1">Total Scans</p>
      <p class="text-3xl font-bold text-gray-900">
        {{ stats?.totalScans || 0 }}
      </p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <p class="text-sm text-gray-600 mb-1">Unique Visitors</p>
      <p class="text-3xl font-bold text-blue-600">
        {{ stats?.uniqueScans || 0 }}
      </p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <p class="text-sm text-gray-600 mb-1">Conversion Rate</p>
      <p class="text-3xl font-bold text-green-600">{{ conversionRate }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Stats } from "@/services/api";

const props = defineProps<{
  stats: Stats | null;
}>();

const conversionRate = computed(() => {
  if (!props.stats || props.stats.totalScans === 0) return "0.0";
  return ((props.stats.uniqueScans / props.stats.totalScans) * 100).toFixed(1);
});
</script>
