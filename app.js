let allResources = []; // Variable global para almacenar todos los recursos

// Función para cargar recursos desde el archivo JSON
function fetchResources() {
  fetch('resources.json')
    .then(response => response.json())
    .then(data => {
      allResources = data.recursos; // Guardar los datos en la variable global
      generarFiltros(); // Generar los filtros iniciales
    })
    .catch(error => console.error("Error al obtener los datos del archivo JSON: ", error));
}

// Función para generar los filtros dinámicamente
function generarFiltros() {
  const filterLinea = document.getElementById("filter-linea-terapeutica");
  
  // Generar opciones para "Línea terapéutica"
  const lineas = [...new Set(allResources.map(resource => resource.linea_terapeutica))];
  filterLinea.innerHTML = '<option value="">Selecciona una línea terapéutica</option>';
  lineas.forEach(linea => filterLinea.innerHTML += `<option value="${linea}">${linea}</option>`);

  // Configurar eventos de cambio para filtros dependientes
  filterLinea.addEventListener("change", actualizarObjetivo);
  document.getElementById("filter-objetivo").addEventListener("change", actualizarEtapa);
  document.getElementById("filter-etapa").addEventListener("change", actualizarTipo);
}

// Función para actualizar el filtro de Objetivo Terapéutico basado en la Línea Terapéutica seleccionada
function actualizarObjetivo() {
  const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
  const filterObjetivo = document.getElementById("filter-objetivo");

  // Filtrar objetivos terapéuticos en función de la línea terapéutica seleccionada
  const objetivos = [...new Set(allResources
    .filter(resource => resource.linea_terapeutica === lineaSeleccionada)
    .map(resource => resource.objetivo_terapeutico))];

  // Actualizar opciones de "Objetivo terapéutico"
  filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
  objetivos.forEach(objetivo => filterObjetivo.innerHTML += `<option value="${objetivo}">${objetivo}</option>`);

  // Limpiar selectores dependientes
  document.getElementById("filter-etapa").innerHTML = '<option value="">Selecciona una etapa</option>';
  document.getElementById("filter-tipo").innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
}

// Función para actualizar el filtro de Etapa basado en el Objetivo Terapéutico seleccionado
function actualizarEtapa() {
  const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
  const objetivoSeleccionado = document.getElementById("filter-objetivo").value;
  const filterEtapa = document.getElementById("filter-etapa");

  // Filtrar etapas en función de la línea terapéutica y el objetivo terapéutico seleccionados
  const etapas = [...new Set(allResources
    .filter(resource => resource.linea_terapeutica === lineaSeleccionada && resource.objetivo_terapeutico === objetivoSeleccionado)
    .map(resource => resource.etapa))];

  // Actualizar opciones de "Etapa"
  filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
  etapas.forEach(etapa => filterEtapa.innerHTML += `<option value="${etapa}">${etapa}</option>`);

  // Limpiar el selector dependiente de "Tipo de recurso"
  document.getElementById("filter-tipo").innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
}

// Función para actualizar el filtro de Tipo de Recurso basado en la Etapa seleccionada
function actualizarTipo() {
  const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
  const objetivoSeleccionado = document.getElementById("filter-objetivo").value;
  const etapaSeleccionada = document.getElementById("filter-etapa").value;
  const filterTipo = document.getElementById("filter-tipo");

  // Filtrar tipos de recursos en función de la línea, objetivo y etapa seleccionados
  const tipos = [...new Set(allResources
    .filter(resource => 
      resource.linea_terapeutica === lineaSeleccionada && 
      resource.objetivo_terapeutico === objetivoSeleccionado && 
      resource.etapa === etapaSeleccionada)
    .map(resource => resource.tipo))];

  // Actualizar opciones de "Tipo de recurso"
  filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
  tipos.forEach(tipo => filterTipo.innerHTML += `<option value="${tipo}">${tipo}</option>`);
}

// Función para renderizar la lista de recursos en el DOM
function renderResourceList(resources) {
  const resourceList = document.getElementById("resource-list");
  resourceList.innerHTML = "";  // Limpiar la lista actual

  resources.forEach(resource => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${resource.nombre}</strong> - ${resource.objetivo_terapeutico} - ${resource.etapa} - ${resource.tipo} - <a href="${resource.link}" target="_blank">Ver recurso</a>`;
    resourceList.appendChild(li);
  });
}

// Función para filtrar y mostrar los recursos en función de todos los filtros seleccionados
function filterResources() {
  const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
  const objetivoSeleccionado = document.getElementById("filter-objetivo").value;
  const etapaSeleccionada = document.getElementById("filter-etapa").value;
  const tipoSeleccionado = document.getElementById("filter-tipo").value;

  // Aplicar filtros en cascada basados en las selecciones actuales
  const filteredResources = allResources.filter(resource =>
    (lineaSeleccionada === "" || resource.linea_terapeutica === lineaSeleccionada) &&
    (objetivoSeleccionado === "" || resource.objetivo_terapeutico === objetivoSeleccionado) &&
    (etapaSeleccionada === "" || resource.etapa === etapaSeleccionada) &&
    (tipoSeleccionado === "" || resource.tipo === tipoSeleccionado)
  );

  // Mostrar los recursos filtrados
  renderResourceList(filteredResources);
}

// Configurar el botón de búsqueda
document.getElementById("buscar").addEventListener("click", filterResources);

// Cargar los recursos al cargar la página
fetchResources();
