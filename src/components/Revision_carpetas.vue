<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="column items-center justify-center q-gutter-md">
      <div class="text-center">
        <p class="welcome-text">Bienvenido, {{ loggedOwner }}</p>
        <p class="description-text">
          Listado de carpetas digitalizadas para aprobación
        </p>
      </div>
      <div class="col-12">
        <q-table
          :rows="folders"
          :columns="columns"
          row-key="name"
          @row-click="selectFolder"
          class="q-table"
        >
          <template v-slot:body-cell="props">
            <q-td
              :props="props"
              :class="{
                'selected-row': selectedFolder === props.row.name,
                'font-weight-bold': selectedFolder === props.row.name,
              }"
              @click.stop="selectFolder(props.row)"
            >
              <template v-if="props.col.name === 'view'">
                <q-icon
                  class="icon-hover"
                  name="visibility"
                  @click="viewContent(props.row.name)"
                />
              </template>
              <template v-else>
                {{ props.row[props.col.field] }}
              </template>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col-12 text-center">
        <q-btn
          icon="refresh"
          @click="refreshData"
          round
          color="primary"
          aria-label="Refrescar"
        >
          <q-tooltip>Actualizar datos</q-tooltip>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const loggedOwner = "Fany Uclés"; // Aquí puedes obtener dinámicamente el nombre del usuario logueado

    const folders = reactive([
      {
        owner: "Luis Reyes",
        name: "E8F7C8",
        createdAt: new Date().toLocaleDateString(),
      },
      {
        owner: "Jose Perez",
        name: "E8F7C9",
        createdAt: new Date().toLocaleDateString(),
      },
      {
        owner: "Fany Ucles",
        name: "E8F7C10",
        createdAt: new Date().toLocaleDateString(),
      },
      {
        owner: "Adam Sanchez",
        name: "E8F7C11",
        createdAt: new Date().toLocaleDateString(),
      },
    ]);

    const selectedFolder = ref("");

    const columns = [
      {
        name: "owner",
        required: true,
        label: "Digitalizador",
        align: "left",
        field: "owner",
      },
      {
        name: "name",
        required: true,
        label: "Código",
        align: "left",
        field: "name",
      },
      {
        name: "createdAt",
        required: true,
        label: "Fecha de Creación",
        align: "left",
        field: "createdAt",
      },
      {
        name: "view",
        required: true,
        label: "",
        align: "center",
        field: "view",
      },
    ];

    function selectFolder(row) {
      selectedFolder.value = row.name;
    }

    function viewContent(folderName) {
      router.push("/contenido");
    }

    function refreshData() {
      //Lógica para refrescar los datos
      console.log("Datos refrescados");
    }

    return {
      folders,
      columns,
      selectedFolder,
      selectFolder,
      viewContent,
      refreshData,
      loggedOwner,
    };
  },
};
</script>

<style scoped>
.welcome-text {
  font-weight: bold;
  font-size: 1.5em;
}

.description-text {
  margin-bottom: 20px;
}

.selected-row {
  background-color: #a5d6a7; /* Light green */
  font-weight: bold; /* Bold text */
}

.icon-hover {
  transition: transform 0.2s;
}

.icon-hover:hover {
  transform: scale(1.2); /* Increase size to 120% */
}

.q-table .q-td {
  font-size: 1.1em; /* Increase font size for table text */
}
</style>
