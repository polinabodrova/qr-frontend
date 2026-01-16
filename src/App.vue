<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <router-link to="/" class="text-2xl font-bold text-blue-600">
            QR Generator
          </router-link>
          <div class="flex gap-6">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600"
              active-class="text-blue-600 font-medium"
            >
              Create
            </router-link>
            <router-link
              to="/codes"
              class="text-gray-700 hover:text-blue-600"
              active-class="text-blue-600 font-medium"
            >
              My Codes
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pb-12">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
      <div
        class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm"
      >
        <p>QR Code Generator with Analytics © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App component
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
