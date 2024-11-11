// Importa la función registrarBusqueda desde analytics.js
import { registrarBusqueda } from './analytics.js';

let recursos = [];

// Elementos del DOM
const lineaTerapeuticaSelect = document.getElementById('linea_terapeutica');
const objetivoTerapeuticoSelect = document.getElementById('objetivo_terapeutico');
const etapaSelect = document.getElementById('etapa');
const tipoSelect = document.getElementById('tipo');
const resultadosDiv = document.getElementById('resultados');

// Función para cargar el archivo JSON
async function cargarDatos() {
    try {
        const response = await fetch('resources.json');
        const data = await response.json();
        recursos = data.recursos;
        console.log("Datos cargados correctamente:", recursos); // Comprobación de carga de datos
        cargarLineasTerapeuticas();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        resultadosDiv.innerHTML = '<p>Error al cargar los datos. Intenta de nuevo más tarde.</p>';
    }
}

// Hacer que cargarDatos esté disponible globalmente
window.cargarDatos = cargarDatos;

// Cargar filtros en cascada
function cargarLineasTerapeuticas() {
    if (recursos.length === 0) {
        console.log("recursos no contiene datos.");
        return;
    }
    lineaTerapeuticaSelect.innerHTML = '<option value="">Línea terapéutica</option>';
    const lineasTerapeuticas = [...new Set(recursos.map(item => item.linea_terapeutica))];
    lineasTerapeuticas.forEach(linea => {
        const option = document.createElement('option');
        option.value = linea;
        option.textContent = linea;
        lineaTerapeuticaSelect.appendChild(option);
    });
    console.log("Líneas terapéuticas cargadas:", lineasTerapeuticas);
}

// Funciones para actualizar filtros en cascada
function actualizarObjetivos() {
    objetivoTerapeuticoSelect.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
    etapaSelect.innerHTML = '<option value="">Selecciona una etapa</option>';
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivos = [...new Set(recursos.filter(item => item.linea_terapeutica === lineaSeleccionada).map(item => item.objetivo_terapeutico))];
    objetivos.forEach(objetivo => {
        const option = document.createElement('option');
        option.value = objetivo;
        option.textContent = objetivo;
        objetivoTerapeuticoSelect.appendChild(option);
    });
    console.log("Objetivos terapéuticos cargados:", objetivos);
}

function actualizarEtapas() {
    etapaSelect.innerHTML = '<option value="">Selecciona una etapa</option>';
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapas = [...new Set(recursos.filter(item => item.linea_terapeutica === lineaSeleccionada && item.objetivo_terapeutico === objetivoSeleccionado).map(item => item.etapa))];
    etapas.forEach(etapa => {
        const option = document.createElement('option');
        option.value = etapa;
        option.textContent = etapa;
        etapaSelect.appendChild(option);
    });
    console.log("Etapas cargadas:", etapas);
}

function actualizarTipos() {
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapaSeleccionada = etapaSelect.value;
    const tipos = [...new Set(recursos.filter(item => item.linea_terapeutica === lineaSeleccionada && item.objetivo_terapeutico === objetivoSeleccionado && item.etapa === etapaSeleccionada).map(item => item.tipo))];
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        tipoSelect.appendChild(option);
    });
    console.log("Tipos cargados:", tipos);
}

// Mostrar resultados y registrar búsqueda
async function buscarRecursos() {
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

    // Registrar búsqueda
    await registrarBusqueda(user, lineaSeleccionada, objetivoSeleccionado, etapaSeleccionada, tipoSeleccionado);
}

// Asignar el evento al botón de búsqueda
document.getElementById('buscar').onclick = buscarRecursos;

// Inicializar Netlify Identity y cargar datos solo si el usuario está autenticado
netlifyIdentity.on("init", user => {
    if (user) cargarDatos();
});

netlifyIdentity.on("login", user => {
    cargarDatos();
    netlifyIdentity.close();
});

netlifyIdentity.init();
