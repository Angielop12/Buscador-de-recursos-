// API Key y Spreadsheet ID
const API_KEY = 'AIzaSyBG6f0rxa7b3yhRJsTpK_K4ZAIDRNPFD_E';
const SPREADSHEET_ID = '18dSjJghk91Ap5sNYU9yVc0hQaC12WzKBxvu82m-YCgA';
const RANGE = 'Sheet1!A1:E100'; // Rango de datos de tu Google Sheet

// Función para obtener los datos del Google Sheets
function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Verifica que los datos se reciban correctamente
        const values = data.values;
        if (values && values.length > 1) {
            renderData(values);
        } else {
            alert('No se encontraron datos en la hoja de cálculo.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
        alert('Hubo un error al obtener los datos.');
    });
}

// Función para renderizar los datos en el HTML
function renderData(values) {
    const resourceContainer = document.getElementById('resource-list');
    resourceContainer.innerHTML = ''; // Limpiar el contenedor

    // Iterar sobre las filas (excluyendo la primera fila de encabezado)
    for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const resourceElement = document.createElement('div');
        resourceElement.classList.add('resource-item');
        
        resourceElement.innerHTML = `
            <h3>${row[0]}</h3> <!-- Nombre del recurso -->
            <p><strong>Objetivo terapéutico:</strong> ${row[1]}</p>
            <p><strong>Etapa:</strong> ${row[2]}</p>
            <p><strong>Tipo de Recurso:</strong> ${row[3]}</p>
            <a href="${row[4]}" target="_blank">Ver recurso</a>
        `;

        resourceContainer.appendChild(resourceElement);
    }
}

// Llamar a la función para obtener los datos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});
