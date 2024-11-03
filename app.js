document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const filterLinea = document.getElementById("filter-linea");
  const filterObjetivo = document.getElementById("filter-objetivo");
  const filterEtapa = document.getElementById("filter-etapa");
  const filterTipo = document.getElementById("filter-tipo");
  const resourceList = document.getElementById("resource-list");
  const buscarBtn = document.getElementById("buscar");

  function showAuthenticated(user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    fetchResources();
  }

  logoutBtn.addEventListener('click', () => {
    netlifyIdentity.logout();
    location.reload();
  });

  loginBtn.addEventListener('click', () => {
    netlifyIdentity.open();
  });

  netlifyIdentity.on('login', user => {
    showAuthenticated(user);
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    location.reload();
  });

  function fetchResources() {
    fetch('resources.json')
      .then(response => response.json())
      .then(data => {
        const resources = data.recursos;
        inicializarFiltroLinea(resources);
        buscarBtn.addEventListener("click", () => filterResources(resources));
      })
      .catch(error => {
        console.error("Error al obtener los datos del archivo JSON: ", error);
      });
  }

  // Función para inicializar el filtro de Línea Terapéutica
  function inicializarFiltroLinea(resources) {
    limpiarFiltro(filterLinea, "Selecciona una línea terapéutica");
    let lineas = new Set(resources.map(r => r.linea_terapeutica));

    lineas.forEach(linea => {
      let option = document.createElement("option");
      option.value = linea;
      option.textContent = linea;
      filterLinea.appendChild(option);
    });

    filterLinea.addEventListener("change", () => {
      const lineaSeleccionada = filterLinea.value;
      if (lineaSeleccionada) {
        inicializarFiltroObjetivo(resources, lineaSeleccionada);
      }
      limpiarFiltro(filterObjetivo, "Selecciona un objetivo terapéutico");
      limpiarFiltro(filterEtapa, "Selecciona una etapa");
      limpiarFiltro(filterTipo, "Selecciona un tipo de recurso");
    });
  }

  // Función para inicializar el filtro de Objetivo Terapéutico
  function inicializarFiltroObjetivo(resources, lineaSeleccionada) {
    limpiarFiltro(filterObjetivo, "Selecciona un objetivo terapéutico");
    const objetivos = new Set(
      resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada)
        .map(r => r.objetivo_terapeutico)
    );

    objetivos.forEach(obj => {
      let option = document.createElement("option");
      option.value = obj;
      option.textContent = obj;
      filterObjetivo.appendChild(option);
    });

    filterObjetivo.addEventListener("change", () => {
      const objetivoSeleccionado = filterObjetivo.value;
      if (objetivoSeleccionado) {
        inicializarFiltroEtapa(resources, lineaSeleccionada, objetivoSeleccionado);
      }
      limpiarFiltro(filterEtapa, "Selecciona una etapa");
      limpiarFiltro(filterTipo, "Selecciona un tipo de recurso");
    });
  }

  // Función para inicializar el filtro de Etapa
  function inicializarFiltroEtapa(resources, lineaSeleccionada, objetivoSeleccionado) {
    limpiarFiltro(filterEtapa, "Selecciona una etapa");
    const etapas = new Set(
      resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada && r.objetivo_terapeutico === objetivoSeleccionado)
        .map(r => r.etapa)
    );

    etapas.forEach(etapa => {
      let option = document.createElement("option");
      option.value = etapa;
      option.textContent = etapa;
      filterEtapa.appendChild(option);
    });

    filterEtapa.addEventListener("change", () => {
      const etapaSeleccionada = filterEtapa.value;
      if (etapaSeleccionada) {
        inicializarFiltroTipo(resources, lineaSeleccionada, objetivoSeleccionado, etapaSeleccionada);
      }
      limpiarFiltro(filterTipo, "Selecciona un tipo de recurso");
    });
  }

  // Función para inicializar el filtro de Tipo de Recurso
  function inicializarFiltroTipo(resources, lineaSeleccionada, objetivoSeleccionado, etapaSeleccionada) {
    limpiarFiltro(filterTipo, "Selecciona un tipo de recurso");
    const tipos = new Set(
      resources
        .filter(
          r => r.linea_terapeutica === lineaSeleccionada &&
               r.objetivo_terapeutico === objetivoSeleccionado &&
               r.etapa === etapaSeleccionada
        )
        .map(r => r.tipo)
    );

    tipos.forEach(tipo => {
      let option = document.createElement("option");
      option.value = tipo;
      option.textContent = tipo;
      filterTipo.appendChild(option);
    });
  }

  // Función para limpiar un filtro y agregar una opción por defecto
  function limpiarFiltro(filtro, mensaje) {
    filtro.innerHTML = `<option value="">${mensaje}</option>`;
  }

  function filterResources(resources) {
    const lineaSeleccionada = filterLinea.value.toLowerCase();
    const objetivoSeleccionado = filterObjetivo.value.toLowerCase();
    const etapaSeleccionada = filterEtapa.value.toLowerCase();
    const tipoSeleccionado = filterTipo.value.toLowerCase();

    const filteredResources = resources.filter(recurso => {
      return (
        (lineaSeleccionada === "" || recurso.linea_terapeutica.toLowerCase() === lineaSeleccionada) &&
        (objetivoSeleccionado === "" || recurso.objetivo_terapeutico.toLowerCase() === objetivoSeleccionado) &&
        (etapaSeleccionada === "" || recurso.etapa.toLowerCase() === etapaSeleccionada) &&
        (tipoSeleccionado === "" || recurso.tipo.toLowerCase() === tipoSeleccionado)
      );
    });

    renderResourceList(filteredResources);
  }

  function renderResourceList(resources) {
    resourceList.innerHTML = "";
    resources.forEach(resource => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${resource.nombre}</strong> - ${resource.objetivo_terapeutico} - ${resource.etapa} - ${resource.tipo} - ${resource.linea_terapeutica}`;

      const downloadLink = document.createElement("a");
      downloadLink.href = resource.link;
      downloadLink.textContent = "Ver recurso";
      downloadLink.target = "_blank";

      li.appendChild(downloadLink);
      resourceList.appendChild(li);
    });
  }
});
