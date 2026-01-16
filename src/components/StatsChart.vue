<template>
  <div class="stats-chart bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface ChartData {
  labels?: string[];
  datasets?: Array<{
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
  }>;
}

const props = defineProps<{
  title: string;
  type: "line" | "bar" | "pie" | "doughnut";
  data: ChartData;
  options?: Record<string, unknown>;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function createChart() {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: props.type,
    data: props.data as any,
    options: props.options || {
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}

onMounted(() => {
  createChart();
});

watch(
  () => props.data,
  () => {
    createChart();
  },
  { deep: true }
);
</script>
