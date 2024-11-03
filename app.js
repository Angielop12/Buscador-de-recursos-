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

  // Mostrar UI para usuarios autenticados
  function showAuthenticated(user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    fetchResources(); // Cargar recursos solo para usuarios autenticados
  }

  // Cerrar sesión
  logoutBtn.addEventListener('click', () => {
    netlifyIdentity.logout();
    location.reload();
  });

  // Login handler
  loginBtn.addEventListener('click', () => {
    netlifyIdentity.open();
  });

  // Escuchar el evento de login de Netlify Identity
  netlifyIdentity.on('login', user => {
    showAuthenticated(user);
    netlifyIdentity.close();
  });

  // Recargar al cerrar sesión
  netlifyIdentity.on('logout', () => {
    location.reload();
  });

  // Función para obtener los datos desde el archivo JSON
  function fetchResources() {
    fetch('resources.json')
      .then(response => response.json())
      .then(data => {
        const resources = data.recursos;
        generarFiltros(resources);
        renderResourceList(resources);
      })
      .catch(error => {
        console.error("Error al obtener los datos del archivo JSON: ", error);
      });
  }

  // Función para generar los filtros dinámicamente en el orden especificado
  function generarFiltros(resources) {
    // Cargar opciones de línea terapéutica
    let lineas = new Set(resources.map(r => r.linea_terapeutica));
    lineas.forEach(linea => {
      let option = document.createElement("option");
      option.value = linea;
      option.textContent = linea;
      filterLinea.appendChild(option);
    });

    // Actualizar objetivos según la línea seleccionada
    filterLinea.addEventListener("change", () => {
      const lineaSeleccionada = filterLinea.value;
      const objetivos = new Set(resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada)
        .map(r => r.objetivo_terapeutico));

      filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
      objetivos.forEach(obj => {
        let option = document.createElement("option");
        option.value = obj;
        option.textContent = obj;
        filterObjetivo.appendChild(option);
      });

      // Limpiar los siguientes filtros al seleccionar una nueva línea
      filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
      filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    });

    // Actualizar etapas según el objetivo seleccionado
    filterObjetivo.addEventListener("change", () => {
      const lineaSeleccionada = filterLinea.value;
      const objetivoSeleccionado = filterObjetivo.value;
      const etapas = new Set(resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada && r.objetivo_terapeutico === objetivoSeleccionado)
        .map(r => r.etapa));

      filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
      etapas.forEach(etapa => {
        let option = document.createElement("option");
        option.value = etapa;
        option.textContent = etapa;
        filterEtapa.appendChild(option);
      });

      // Limpiar tipo al seleccionar un nuevo objetivo
      filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    });

    // Actualizar tipos según la etapa seleccionada
    filterEtapa.addEventListener("change", () => {
      const lineaSeleccionada = filterLinea.value;
      const objetivoSeleccionado = filterObjetivo.value;
      const etapaSeleccionada = filterEtapa.value;
      const tipos = new Set(resources
        .filter(r => r.linea_terapeutica === lineaSeleccionada && 
                     r.objetivo_terapeutico === objetivoSeleccionado && 
                     r.etapa === etapaSeleccionada)
        .map(r => r.tipo));

      filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
      tipos.forEach(tipo => {
        let option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        filterTipo.appendChild(option);
      });
    });
  }

  // Función para renderizar la lista de recursos en el DOM
  function renderResourceList(resources) {
    resourceList.innerHTML = "";  // Limpiar la lista actual
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

  // Función para filtrar y mostrar los recursos
  function filterResources() {
    const filterLineaVal = filterLinea.value.toLowerCase();
    const filterObjetivoVal = filterObjetivo.value.toLowerCase();
    const filterEtapaVal = filterEtapa.value.toLowerCase();
    const filterTipoVal = filterTipo.value.toLowerCase();

    fetch('resources.json')
      .then(response => response.json())
      .then(data => {
        const filteredResources = data.recursos.filter(recurso => {
          return (
            (filterLineaVal === "" || recurso.linea_terapeutica.toLowerCase() === filterLineaVal) &&
            (filterObjetivoVal === "" || recurso.objetivo_terapeutico.toLowerCase() === filterObjetivoVal) &&
            (filterEtapaVal === "" || recurso.etapa.toLowerCase() === filterEtapaVal) &&
            (filterTipoVal === "" || recurso.tipo.toLowerCase() === filterTipoVal)
          );
        });
        renderResourceList(filteredResources);
      });
  }

  buscarBtn.addEventListener("click", filterResources);
});
