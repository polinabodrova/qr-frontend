<template>
  <div class="dcm-builder bg-gray-50 p-4 rounded-lg">
    <button
      @click="expanded = !expanded"
      class="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
    >
      <span>DCM Impression Tracking (Optional)</span>
      <span>{{ expanded ? "▼" : "▶" }}</span>
    </button>

    <div v-if="expanded" class="space-y-3 mt-3">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          DCM Impression Tag
        </label>
        <textarea
          v-model="dcmTag"
          placeholder="Paste your DCM impression tag here (IMG, IFRAME, or SCRIPT tag, or just the URL)"
          rows="4"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-xs"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500">
          Supports IMG, IFRAME, and SCRIPT tag formats from Google Campaign
          Manager. The [timestamp] placeholder will be automatically replaced.
        </p>
      </div>

      <div v-if="extractedUrl" class="p-3 bg-blue-50 rounded-md">
        <p class="text-xs font-medium text-gray-700 mb-1">
          Extracted Tracking URL:
        </p>
        <p class="text-xs text-gray-600 break-all font-mono">
          {{ extractedUrl }}
        </p>
      </div>

      <div v-if="dcmTag && !extractedUrl" class="p-3 bg-yellow-50 rounded-md">
        <p class="text-xs text-yellow-700">
          ⚠️ Could not extract URL from the provided tag. Please ensure it
          contains a valid SRC attribute or is a direct URL.
        </p>
      </div>

      <div class="p-3 bg-gray-100 rounded-md">
        <p class="text-xs font-medium text-gray-700 mb-2">Example formats:</p>
        <div class="space-y-2 text-xs text-gray-600 font-mono">
          <p class="truncate">
            &lt;IMG SRC="https://ad.doubleclick.net/ddm/trackimp/..."&gt;
          </p>
          <p class="truncate">
            &lt;IFRAME SRC="https://ad.doubleclick.net/ddm/trackimpi/..."&gt;
          </p>
          <p class="truncate">
            &lt;SCRIPT SRC="https://ad.doubleclick.net/ddm/trackimpj/..."&gt;
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const expanded = ref(false);
const dcmTag = ref(props.modelValue || "");

// Extract URL from DCM tag
const extractedUrl = computed(() => {
  if (!dcmTag.value) return "";

  // Try to extract URL from SRC attribute
  const srcMatch = dcmTag.value.match(/SRC\s*=\s*["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }

  // If the tag is just a URL, return it directly
  if (
    dcmTag.value.trim().startsWith("http://") ||
    dcmTag.value.trim().startsWith("https://")
  ) {
    return dcmTag.value.trim();
  }

  return "";
});

// Auto-expand if there's initial value
if (props.modelValue) {
  expanded.value = true;
}

// Watch for external changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== dcmTag.value) {
      dcmTag.value = newVal || "";
      if (newVal) {
        expanded.value = true;
      }
    }
  }
);

// Emit changes
watch(dcmTag, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>
