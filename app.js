// Importa la función registrarBusqueda desde analytics.js
import { registrarBusqueda } from './analytics.js';

let recursos = [];

// Elementos del DOM
const lineaTerapeuticaSelect = document.getElementById('linea_terapeutica');
const objetivoTerapeuticoSelect = document.getElementById('objetivo_terapeutico');
const etapaSelect = document.getElementById('etapa');
const tipoSelect = document.getElementById('tipo');
const resultadosDiv = document.getElementById('resultados');
const loginBtn = document.getElementById('login-btn'); // Botón de inicio de sesión

// Función para cargar el archivo JSON
async function cargarDatos() {
    try {
        const response = await fetch('resources.json');
        const data = await response.json();
        recursos = data.recursos;
        console.log("Datos cargados:", recursos); // Verifica los datos cargados
        cargarLineasTerapeuticas();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Cargar filtros en cascada
function cargarLineasTerapeuticas() {
    lineaTerapeuticaSelect.innerHTML = '<option value="">Línea terapéutica</option>';
    const lineasTerapeuticas = [...new Set(recursos.map(item => item.linea_terapeutica))];
    lineasTerapeuticas.forEach(linea => {
        const option = document.createElement('option');
        option.value = linea;
        option.textContent = linea;
        lineaTerapeuticaSelect.appendChild(option);
    });
}

// Funciones para actualizar filtros
function actualizarObjetivos() {
    objetivoTerapeuticoSelect.innerHTML = '<option value="">Objetivo terapéutico</option>';
    etapaSelect.innerHTML = '<option value="">Etapa</option>';
    tipoSelect.innerHTML = '<option value="">Tipo de recurso</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivos = [...new Set(recursos
        .filter(item => item.linea_terapeutica === lineaSeleccionada)
        .map(item => item.objetivo_terapeutico))];
    objetivos.forEach(objetivo => {
        const option = document.createElement('option');
        option.value = objetivo;
        option.textContent = objetivo;
        objetivoTerapeuticoSelect.appendChild(option);
    });
}

function actualizarEtapas() {
    etapaSelect.innerHTML = '<option value="">Etapa</option>';
    tipoSelect.innerHTML = '<option value="">Tipo de recurso</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapas = [...new Set(recursos
        .filter(item => item.linea_terapeutica === lineaSeleccionada && item.objetivo_terapeutico === objetivoSeleccionado)
        .map(item => item.etapa))];
    etapas.forEach(etapa => {
        const option = document.createElement('option');
        option.value = etapa;
        option.textContent = etapa;
        etapaSelect.appendChild(option);
    });
}

function actualizarTipos() {
    tipoSelect.innerHTML = '<option value="">Tipo de recurso</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapaSeleccionada = etapaSelect.value;
    const tipos = [...new Set(recursos
        .filter(item => item.linea_terapeutica === lineaSeleccionada && item.objetivo_terapeutico === objetivoSeleccionado && item.etapa === etapaSeleccionada)
        .map(item => item.tipo))];
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        tipoSelect.appendChild(option);
    });
}

// Mostrar resultados
function buscarRecursos() {
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapaSeleccionada = etapaSelect.value;
    const tipoSeleccionado = tipoSelect.value;

    const resultados = recursos.filter(item => {
        return (!lineaSeleccionada || item.linea_terapeutica === lineaSeleccionada) &&
               (!objetivoSeleccionado || item.objetivo_terapeutico === objetivoSeleccionado) &&
               (!etapaSeleccionada || item.etapa === etapaSeleccionada) &&
               (!tipoSeleccionado || item.tipo === tipoSeleccionado);
    });

    resultadosDiv.innerHTML = ''; // Limpiar resultados previos

    if (resultados.length === 0) {
        resultadosDiv.innerHTML = '<p>No se encontraron resultados</p>';
    } else {
        resultados.forEach(recurso => {
            const recursoDiv = document.createElement('div');
            recursoDiv.innerHTML = `
                <h4>${recurso.nombre}</h4>
                <p>Línea Terapéutica: ${recurso.linea_terapeutica}</p>
                <p>Objetivo Terapéutico: ${recurso.objetivo_terapeutico}</p>
                <p>Etapa: ${recurso.etapa}</p>
                <p>Tipo: ${recurso.tipo}</p>
                <a href="${recurso.link}" target="_blank">Ver Recurso</a>
            `;
            resultadosDiv.appendChild(recursoDiv);
        });
    }

    // Obtener el usuario actual de Netlify Identity
    const user = netlifyIdentity.currentUser();
    
    // Llamada a la función de monitoreo para registrar la búsqueda
    registrarBusqueda(user, lineaSeleccionada, objetivoSeleccionado, etapaSeleccionada, tipoSeleccionado);
}

// Asignar el evento al botón de búsqueda
document.getElementById('buscar').onclick = buscarRecursos;

// Inicializar Netlify Identity y configurar eventos de autenticación
loginBtn.addEventListener('click', () => {
    netlifyIdentity.open();
});

netlifyIdentity.on("init", user => {
    if (user) {
        cargarDatos();
        loginBtn.style.display = 'none';
    } else {
        loginBtn.style.display = 'block';
    }
});

netlifyIdentity.on("login", user => {
    cargarDatos(); // Cargar datos al iniciar sesión
    netlifyIdentity.close();
    loginBtn.style.display = 'none';
});

netlifyIdentity.on("logout", () => {
    location.reload(); // Recargar la página al cerrar sesión
});

netlifyIdentity.init();

