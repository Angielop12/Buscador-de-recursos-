// Reemplaza con tu API Key y el ID de tu hoja
const apiKey = 'AIzaSyDj3truoLuqlfebewH6uii5iIpSgWtrcBI';
const sheetId = '18dSjJghk91Ap5sNYU9yVc0hQaC12WzKBxvu82m-YCgA';
const sheetRange = 'Hoja1!A:E';  // Ajusta el rango según tu hoja (A:E es solo un ejemplo)

// Función para obtener datos de Google Sheets
async function obtenerDatosDeSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarDatosEnTabla(data.values);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

// Función para mostrar los datos en la tabla del HTML
function mostrarDatosEnTabla(datos) {
    const tabla = document.getElementById('resource-list');
    tabla.innerHTML = ''; // Limpia la tabla antes de mostrar nuevos datos

    datos.forEach((fila, index) => {
        if (index === 0) return; // Ignorar la primera fila (encabezados)

        const nombreRecurso = fila[0];
        const categoria = fila[1];
        const etapa = fila[2];
        const tipoArchivo = fila[3];
        const linkDescarga = fila[4];

        const filaHTML = `
            <div class="recurso">
                <h3>${nombreRecurso}</h3>
                <p><strong>Categoría:</strong> ${categoria}</p>
                <p><strong>Etapa:</strong> ${etapa}</p>
                <p><strong>Tipo de Archivo:</strong> ${tipoArchivo}</p>
                <a href="${linkDescarga}" target="_blank">Descargar</a>
            </div>
        `;

        tabla.innerHTML += filaHTML;
    });
}

// Llamar la función cuando cargue la página
document.addEventListener('DOMContentLoaded', obtenerDatosDeSheet);

