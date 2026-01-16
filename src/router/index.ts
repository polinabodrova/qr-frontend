import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CodesListView from "@/views/CodesListView.vue";
import CodeDetailView from "@/views/CodeDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/codes",
      name: "codes-list",
      component: CodesListView,
    },
    {
      path: "/codes/:id",
      name: "code-detail",
      component: CodeDetailView,
    },
  ],
});

export default router;
