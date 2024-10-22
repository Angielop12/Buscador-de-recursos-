// Accede a la variable de entorno (Netlify reemplazará esta variable en tiempo de ejecución)
const apiKey = process.env.CONX_SHEETS;  // CONX_SHEETS es la variable de entorno que configuraste en Netlify

// ID de la hoja de Google Sheets
const sheetId = '18dSjJghk91Ap5sNYU9yVc0hQaC12WzKBxvu82m-YCgA'; // Tu ID de hoja

// URL para obtener los datos de la hoja de Google Sheets
const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z100?key=${apiKey}`;

// Función para obtener los datos de Google Sheets
function fetchResources() {
  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Verifica si los datos están llegando aquí
      const resources = data.values; // Asegúrate de que estás manejando los datos correctamente
      renderResourceList(resources);
    })
    .catch(error => {
      console.error("Error al obtener los datos de Google Sheets: ", error);
    });
}

// Función para renderizar la lista de recursos en el DOM
function renderResourceList(resources) {
  const resourceList = document.getElementById("resource-list");
  resourceList.innerHTML = ""; // Limpiar la lista actual

  resources.forEach(resource => {
    const li = document.createElement("li");
    li.textContent = `${resource[0]} - ${resource[1]} - ${resource[2]}`; // Aquí asumes que las columnas son [Nombre, Descripción, URL]
    
    const downloadLink = document.createElement("a");
    downloadLink.href = resource[2]; // URL para descargar el recurso
    downloadLink.textContent = "Descargar";
    downloadLink.target = "_blank"; // Abrir en una nueva pestaña

    li.appendChild(downloadLink);
    resourceList.appendChild(li);
  });
}

// Función para filtrar los recursos
function filterResources(event) {
  const filterValue = event.target.value.toLowerCase();
  const allResources = document.querySelectorAll("#resource-list li");

  allResources.forEach(resource => {
    const text = resource.textContent.toLowerCase();
    if (text.includes(filterValue)) {
      resource.style.display = "";
    } else {
      resource.style.display = "none";
    }
  });
}

// Escucha el evento del input de filtro
const filterInput = document.getElementById("filter");
filterInput.addEventListener("input", filterResources);

// Llama a la función para obtener los recursos cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", fetchResources);

