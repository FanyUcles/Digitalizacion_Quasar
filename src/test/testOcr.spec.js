const { Builder, By, until } = require("selenium-webdriver");
const path = require("path");

(async function testSimulate() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:8080/#/pdf-uploader");

    // Asegúrate de que el botón esté visible
    await driver.wait(until.elementLocated(By.css(".q-btn--standard")), 10000);

    // Localiza el botón y simula el clic
    let uploadButton = await driver.findElement(By.css(".q-btn--standard"));
    await uploadButton.click();

    // Espera y localiza el campo de entrada de archivos
    let fileInput = await driver.wait(
      until.elementLocated(By.css('input[type="file"]')),
      10000
    );

    // Define la ruta del archivo PDF
    const filePath = path.resolve(
      "C:/Users/fany.ucles/Desktop/PDF_de_prueba/Expediente_2009.pdf"
    );

    // Envía la ruta del archivo al campo de entrada de archivos
    await fileInput.sendKeys(filePath);

    console.log("Archivo PDF cargado y enviado.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.quit();
  }
})();
