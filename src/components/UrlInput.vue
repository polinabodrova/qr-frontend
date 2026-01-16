<template>
  <div class="url-input">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Destination URL *
    </label>
    <input
      type="url"
      :value="modelValue"
      @input="handleInput"
      @blur="validate"
      placeholder="https://example.com"
      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :class="{ 'border-red-500': error }"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else class="mt-1 text-sm text-gray-500">
      Enter the URL where users will be redirected
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  validation: [isValid: boolean];
}>();

const error = ref<string | null>(null);

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
  if (error.value) {
    validate();
  }
}

function validate() {
  if (!props.modelValue) {
    error.value = "URL is required";
    emit("validation", false);
    return;
  }

  try {
    const url = new URL(props.modelValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      error.value = "Only http:// and https:// protocols are allowed";
      emit("validation", false);
      return;
    }
    error.value = null;
    emit("validation", true);
  } catch {
    error.value = "Please enter a valid URL";
    emit("validation", false);
  }
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      validate();
    }
  }
);
</script>
