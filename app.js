document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const filterLinea = document.getElementById("filter-linea");
  const filterObjetivo = document.getElementById("filter-objetivo");
  const filterEtapa = document.getElementById("filter-etapa");
  const filterTipo = document.getElementById("filter-tipo");
  const resourceList = document.getElementById("resource-list");
  const buscarBtn = document.getElementById("buscar");

  // Inicializar Netlify Identity
  netlifyIdentity.on('init', user => {
    if (user) {
      showAuthenticated(user);
    } else {
      netlifyIdentity.open();
    }
  });

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

  // Inicializar el filtro de Línea Terapéutica
  function inicializarFiltroLinea(resources) {
    let lineas = new Set(resources.map(r => r.linea_terapeutica));
    filterLinea.innerHTML = '<option value="">Selecciona una línea terapéutica</option>';
    lineas.forEach(linea => {
      let option = document.createElement("option");
      option.value = linea;
      option.textContent = linea;
      filterLinea.appendChild(option);
    });

    // Al seleccionar una línea, actualizamos los objetivos terapéuticos
    filterLinea.addEventListener("change", () => {
      const lineaSeleccionada = filterLinea.value;
      inicializarFiltroObjetivo(resources, lineaSeleccionada);
      filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
      filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
      filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    });
  }

  // Inicializar el filtro de Objetivo Terapéutico basado en la Línea Terapéutica seleccionada
  function inicializarFiltroObjetivo(resources, lineaSeleccionada) {
    const objetivos = new Set(
      resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada)
        .map(r => r.objetivo_terapeutico)
    );

    filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
    objetivos.forEach(obj => {
      let option = document.createElement("option");
      option.value = obj;
      option.textContent = obj;
      filterObjetivo.appendChild(option);
    });

    filterObjetivo.addEventListener("change", () => {
      const objetivoSeleccionado = filterObjetivo.value;
      inicializarFiltroEtapa(resources, lineaSeleccionada, objetivoSeleccionado);
      filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
      filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    });
  }

  // Inicializar el filtro de Etapa basado en la Línea y el Objetivo seleccionados
  function inicializarFiltroEtapa(resources, lineaSeleccionada, objetivoSeleccionado) {
    const etapas = new Set(
      resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada && r.objetivo_terapeutico === objetivoSeleccionado)
        .map(r => r.etapa)
    );

    filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
    etapas.forEach(etapa => {
      let option = document.createElement("option");
      option.value = etapa;
      option.textContent = etapa;
      filterEtapa.appendChild(option);
    });

    filterEtapa.addEventListener("change", () => {
      const etapaSeleccionada = filterEtapa.value;
      inicializarFiltroTipo(resources, lineaSeleccionada, objetivoSeleccionado, etapaSeleccionada);
      filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    });
  }

  // Inicializar el filtro de Tipo de Recurso basado en la Línea, Objetivo y Etapa seleccionados
  function inicializarFiltroTipo(resources, lineaSeleccionada, objetivoSeleccionado, etapaSeleccionada) {
    const tipos = new Set(
      resources
        .filter(
          r => r.linea_terapeutica === lineaSeleccionada &&
               r.objetivo_terapeutico === objetivoSeleccionado &&
               r.etapa === etapaSeleccionada
        )
        .map(r => r.tipo)
    );

    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    tipos.forEach(tipo => {
      let option = document.createElement("option");
      option.value = tipo;
      option.textContent = tipo;
      filterTipo.appendChild(option);
    });
  }

  // Función para renderizar la lista de recursos en el DOM
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
});
