<template>
  <div class="utm-builder bg-gray-50 p-4 rounded-lg">
    <button
      @click="expanded = !expanded"
      class="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
    >
      <span>UTM Parameters (Optional)</span>
      <span>{{ expanded ? "▼" : "▶" }}</span>
    </button>

    <div v-if="expanded" class="space-y-3 mt-3">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Source (utm_source)
        </label>
        <input
          type="text"
          v-model="params.utm_source"
          placeholder="e.g., newsletter, twitter"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Medium (utm_medium)
        </label>
        <input
          type="text"
          v-model="params.utm_medium"
          placeholder="e.g., email, social, qr"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Campaign (utm_campaign)
        </label>
        <input
          type="text"
          v-model="params.utm_campaign"
          placeholder="e.g., spring_sale_2026"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Term (utm_term)
        </label>
        <input
          type="text"
          v-model="params.utm_term"
          placeholder="e.g., keyword (optional)"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Content (utm_content)
        </label>
        <input
          type="text"
          v-model="params.utm_content"
          placeholder="e.g., button_cta (optional)"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div v-if="previewUrl" class="mt-4 p-3 bg-blue-50 rounded-md">
        <p class="text-xs font-medium text-gray-700 mb-1">Final URL Preview:</p>
        <p class="text-xs text-gray-600 break-all">{{ previewUrl }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";

const props = defineProps<{
  baseUrl: string;
}>();

const emit = defineEmits<{
  "update:params": [params: Record<string, string>];
}>();

const expanded = ref(false);
const params = reactive({
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
});

const previewUrl = computed(() => {
  if (!props.baseUrl) return "";

  try {
    const url = new URL(props.baseUrl);
    if (params.utm_source)
      url.searchParams.set("utm_source", params.utm_source);
    if (params.utm_medium)
      url.searchParams.set("utm_medium", params.utm_medium);
    if (params.utm_campaign)
      url.searchParams.set("utm_campaign", params.utm_campaign);
    if (params.utm_term) url.searchParams.set("utm_term", params.utm_term);
    if (params.utm_content)
      url.searchParams.set("utm_content", params.utm_content);
    return url.toString();
  } catch {
    return "";
  }
});

watch(
  params,
  () => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "")
    );
    emit("update:params", filtered);
  },
  { deep: true }
);
</script>
