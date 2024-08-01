const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "pdf-uploader",
        component: () => import("components/PdfUploader.vue"),
      },
      {
        path: "carpetas-pendientes",
        component: () => import("components/Revision_carpetas.vue"),
      },
      {
        path: "contenido",
        component: () => import("components/Revision_archivos.vue"),
      },
      {
        path: "GuardarCarpetas",
        component: () => import("components/GuardarCarpeta.vue"),
      },

    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
