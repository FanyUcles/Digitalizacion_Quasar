<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="row q-gutter-md justify-center items-center">
      <div class="col-12 col-md-7 same-height">
        <q-card class="q-pa-md full-width">
          <q-card-section>
            <div>
              <div class="text-h6">{{ folder.name }}</div>
              <div class="text-subtitle2">
                El código EFC es: {{ folder.name }}
              </div>
              <div class="text-subtitle2">
                Realizado por el usuario: {{ folder.owner }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-7 same-height">
        <q-table
          :rows="pdfFiles"
          :columns="columns"
          row-key="name"
          @row-click="previewPdf"
          class="q-table"
        >
          <template v-slot:body-cell="props">
            <q-td
              :props="props"
              :class="{ previewed: props.row.isPreviewed }"
              align="center"
            >
              {{ props.row.name }}
            </q-td>
          </template>
        </q-table>
        <div class="text-center q-mt-md">
          <q-btn label="Correcto" color="green" @click="markAsCorrect" />
          <q-btn
            label="Incorrecto"
            color="red"
            class="q-ml-md"
            @click="markAsIncorrect"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="pdfPreviewVisible">
      <q-card>
        <q-card-section>
          <q-toolbar>
            <q-toolbar-title>Vista previa</q-toolbar-title>
            <q-btn icon="close" flat round dense @click="closePreview" />
          </q-toolbar>
        </q-card-section>
        <q-card-section>
          <iframe :src="pdfPreviewUrl" width="100%" height="500px" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const folder = reactive({
      owner: "",
      name: "",
      createdAt: "",
    });

    const pdfFiles = reactive([
      { name: "document1.pdf", isPreviewed: false },
      { name: "document2.pdf", isPreviewed: false },
      { name: "document3.pdf", isPreviewed: false },
      { name: "document4.pdf", isPreviewed: false },
      { name: "document5.pdf", isPreviewed: false },
      { name: "document6.pdf", isPreviewed: false },
      { name: "document7.pdf", isPreviewed: false },
      { name: "document8.pdf", isPreviewed: false },
      { name: "document9.pdf", isPreviewed: false },
      { name: "document10.pdf", isPreviewed: false },
    ]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "ARCHIVOS",
        align: "center",
        field: "name",
      },
    ];

    const pdfPreviewVisible = ref(false);
    const pdfPreviewUrl = ref("");

    onMounted(() => {
      const folderName = route.query.folder;
      // Aquí hacer una llamada a una API para obtener los detalles de la carpeta
      // Ejemplo:
      if (folderName === "E8F7C8") {
        folder.owner = "Luis Reyes";
        folder.name = "E8F7C8";
        folder.createdAt = "01/01/2024";
      } else if (folderName === "E8F7C9") {
        folder.owner = "Jose Perez";
        folder.name = "E8F7C9";
        folder.createdAt = "02/01/2024";
      } else if (folderName === "E8F7C10") {
        folder.owner = "Fany Ucles";
        folder.name = "E8F7C10";
        folder.createdAt = "03/01/2024";
      } else if (folderName === "E8F7C11") {
        folder.owner = "Adam Sanchez";
        folder.name = "E8F7C11";
        folder.createdAt = "04/01/2024";
      }
    });

    function previewPdf(row) {
      pdfPreviewUrl.value = `/path/to/pdf/${row.name}`;
      pdfPreviewVisible.value = true;
      row.isPreviewed = true;
    }

    function closePreview() {
      pdfPreviewVisible.value = false;
    }

    function markAsCorrect() {
      console.log("Archivos correctos");
    }

    function markAsIncorrect() {
      console.log("Archivos incorrectos");
    }

    return {
      folder,
      pdfFiles,
      columns,
      pdfPreviewVisible,
      pdfPreviewUrl,
      previewPdf,
      closePreview,
      markAsCorrect,
      markAsIncorrect,
    };
  },
};
</script>

<style scoped>
.q-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.q-table .q-td {
  font-size: 1.1em; /* Increase font size for table text */
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-mt-md {
  margin-top: 20px;
}

.q-ml-md {
  margin-left: 20px;
}

.q-card-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.same-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

iframe {
  border: black;
}

.previewed {
  background-color: greenyellow !important; /* !important to ensure the style is applied */
}
</style>
