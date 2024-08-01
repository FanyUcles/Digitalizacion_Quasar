<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="upload-btn-wrapper">
        <q-btn label="Cargar archivos" @click="selectFiles"></q-btn>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleFiles"
          multiple
        />
      </div>
      <div v-if="fileNames.length > 0" class="file-table-box">
        <h6>Carpetas subidas</h6>
        <table class="file-table">
          <thead>
            <tr>
              <th>N</th>
              <th>Nombre del archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(name, index) in fileNames" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ name }}</td>
            </tr>
          </tbody>
        </table>
        <q-btn label="Mover a permanente" @click="moveFiles"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "FileUploader",
  setup() {
    const fileInput = ref(null);
    const fileNames = ref([]);
    const userName = ref("Kevin"); // Puedes cambiar el nombre de usuario aquí

    const selectFiles = () => {
      fileInput.value.click();
    };

    const handleFiles = async (event) => {
      const files = Array.from(event.target.files);
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("userName", userName.value);

      try {
        await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fileNames.value = [
          ...fileNames.value,
          ...files.map((file) => file.name),
        ];
      } catch (error) {
        console.error("Error uploading files", error);
      }
    };

    const moveFiles = async () => {
      try {
        await axios.post(`http://localhost:3000/move/${userName.value}`);
        fileNames.value = [];
      } catch (error) {
        console.error("Error moving files", error);
      }
    };

    return {
      fileInput,
      fileNames,
      selectFiles,
      handleFiles,
      moveFiles,
    };
  },
};
</script>
