<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="upload-btn-wrapper">
        <q-btn label="Cargar un archivo" @click="selectFile"></q-btn>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="showPreview"
        />
      </div>
      <div class="preview" ref="preview"></div>
      <canvas id="pdfCanvas" ref="pdfCanvas" style="display: none"></canvas>
      <div id="ocrResult" ref="ocrResult"></div>
      <div v-if="manualEntryVisible">
        <p>
          No se encontró el numero de declaración. Por favor, ingrese el valor:
        </p>
        <q-input v-model="manualNumber" label="Número de declaración" />
        <q-btn label="Confirmar" @click="confirmManualNumber"></q-btn>
      </div>
      <q-dialog v-model="loadingDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Realizando OCR...</div>
            <q-linear-progress
              :value="progress"
              size="sm"
              color="primary"
            ></q-linear-progress>
            <p>{{ progressText }}</p>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Tesseract from "tesseract.js";

// Establecer la ruta del trabajador
pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

export default {
  name: "PdfUploader",
  setup() {
    const fileInput = ref(null);
    const preview = ref(null);
    const pdfCanvas = ref(null);
    const ocrResult = ref(null);
    const loadingDialog = ref(false);
    const progress = ref(0);
    const progressText = ref("");
    const manualNumber = ref("");
    const manualEntryVisible = ref(false);
    let globalPdfData = null;
    let ocrAttempts = 0;
    let downloadPromptShown = false; // Nueva variable de estado

    onMounted(() => {
      fileInput.value.addEventListener("change", showPreview);
    });

    const selectFile = () => {
      fileInput.value.click();
    };

    const showPreview = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (file) {
        if (file.type === "application/pdf") {
          reader.onload = function (e) {
            globalPdfData = new Uint8Array(e.target.result);
            renderPDF(globalPdfData, 1.7);
          };
          reader.readAsArrayBuffer(file);
        } else {
          preview.value.innerHTML =
            "Tipo de archivo no soportado para previsualización";
        }
      }
    };

    const renderPDF = async (pdfData, scale) => {
      if (!pdfCanvas.value || !pdfCanvas.value.getContext) {
        console.error("El canvas no está inicializado correctamente.");
        return;
      }

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: scale });
      const context = pdfCanvas.value.getContext("2d");
      pdfCanvas.value.height = viewport.height;
      pdfCanvas.value.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      const imgData = pdfCanvas.value.toDataURL();
      displayImage(imgData);
      performOCR(pdfCanvas.value);
    };

    const displayImage = (imgData) => {
      const img = document.createElement("img");
      img.src = imgData;
      img.style.width = "100%";
      img.style.height = "auto";
      preview.value.innerHTML = "";
      preview.value.appendChild(img);
    };

    const performOCR = async (canvas) => {
      try {
        loadingDialog.value = true;
        const {
          data: { text },
        } = await Tesseract.recognize(canvas, "eng", {
          tessedit_char_whitelist: "0123456789",
          psm: 6,
          logger: (m) => {
            if (m.status === "recognizing text") {
              progress.value = m.progress;
              progressText.value = `Progreso: ${(m.progress * 100).toFixed(
                2
              )}%`;
            }
          },
        });

        const numbers = text.match(/\d+/g);
        let elevenDigitNumber = "";
        if (numbers) {
          for (let number of numbers) {
            if (number.length === 11) {
              elevenDigitNumber = number;
              break;
            }
          }
        }

        if (elevenDigitNumber) {
          if (!downloadPromptShown && ocrResult.value) {
            ocrResult.value.innerText = elevenDigitNumber;
            ocrResult.value.style.display = "block";
            savePDFWithNumber(globalPdfData, elevenDigitNumber);
            downloadPromptShown = true; // Marcar como mostrado
          }
        } else {
          if (ocrResult.value) {
            ocrResult.value.style.display = "none";
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));

          if (ocrAttempts === 0) {
            ocrAttempts++;
            renderPDF(globalPdfData, 1.796);
          } else if (ocrAttempts === 1) {
            ocrAttempts++;
            renderPDF(globalPdfData, 1.77);
          } else {
            manualEntryVisible.value = true; // Mostrar entrada manual
          }
        }
      } catch (error) {
        console.error("Error en OCR:", error);
      } finally {
        loadingDialog.value = false;
      }
    };

    const confirmManualNumber = () => {
      const number = manualNumber.value;
      if (number.length === 11 && !isNaN(number)) {
        savePDFWithNumber(globalPdfData, number);
        manualEntryVisible.value = false; // Ocultar entrada manual después de confirmar
      } else {
        alert("Por favor, ingrese un número válido de 11 dígitos.");
      }
    };

    const savePDFWithNumber = (pdfData, number) => {
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const confirmDownload = confirm(`¿Deseas descargar el PDF ${number}?`);

      if (confirmDownload) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `declaración_No. ${number}.pdf`;
        a.style.display = "none";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
      }

      URL.revokeObjectURL(url);
      ocrAttempts = 0; // Reiniciar los intentos después de la descarga
      downloadPromptShown = false; // Restablecer estado de la solicitud de descarga
    };

    return {
      fileInput,
      preview,
      pdfCanvas,
      ocrResult,
      loadingDialog,
      progress,
      progressText,
      manualNumber,
      manualEntryVisible,
      selectFile,
      showPreview,
      confirmManualNumber,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin-bottom: 20px;
}

.upload-btn-wrapper {
  border: 1px solid #ffffff;
  color: white;
  background-color: #0d2844;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
}

.upload-btn-wrapper input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.preview img {
  margin-top: 20px; /* Espacio encima de la imagen del PDF */
}

.manual-entry {
  margin-top: 20px;
  text-align: center;
}

.manual-entry p {
  font-size: 16px;
}

.manual-entry input {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
}

.manual-entry button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0d2844;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.manual-entry button:hover {
  background-color: #0b233a;
}
</style>
