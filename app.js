document.addEventListener('DOMContentLoaded', function () {
  // Selección de elementos en el DOM
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const filterLinea = document.getElementById("filter-linea-terapeutica");
  const filterObjetivo = document.getElementById("filter-objetivo");
  const filterEtapa = document.getElementById("filter-etapa");
  const filterTipo = document.getElementById("filter-tipo");
  const searchBtn = document.getElementById('buscar');
  const resultadosDiv = document.getElementById('resource-list');
  let resourcesData = []; // Array para almacenar datos de los recursos

  // Inicializar Netlify Identity para autenticación
  netlifyIdentity.on('init', user => {
    if (user) {
      showAuthenticated(user); // Mostrar UI autenticada si hay usuario
    } else {
      netlifyIdentity.open(); // Pedir login si no hay usuario
    }
  });

  // Función para mostrar la UI autenticada y cargar recursos
  function showAuthenticated(user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loadResources(); // Cargar los recursos desde JSON
  }

  // Evento para cerrar sesión
  logoutBtn.addEventListener('click', () => {
    netlifyIdentity.logout();
    location.reload(); // Recargar la página después de cerrar sesión
  });

  // Evento para abrir login
  loginBtn.addEventListener('click', () => {
    netlifyIdentity.open();
  });

  // Cargar recursos desde el archivo JSON
  function loadResources() {
    fetch('resources.json')
      .then(response => response.json())
      .then(data => {
        resourcesData = data.recursos; // Guardar datos en resourcesData
        populateLineaOptions(); // Poblar opciones iniciales de línea terapéutica
      });
  }

  // Poblar opciones de "Línea Terapéutica" en el filtro
  function populateLineaOptions() {
    const lineas = [...new Set(resourcesData.map(resource => resource.linea_terapeutica))];
    lineas.forEach(linea => {
      const option = document.createElement("option");
      option.value = linea;
      option.textContent = linea;
      filterLinea.appendChild(option);
    });
  }

  // Actualizar "Objetivo Terapéutico" basado en la "Línea Terapéutica" seleccionada
  filterLinea.addEventListener('change', () => {
    const selectedLinea = filterLinea.value;

    // Limpiar opciones dependientes
    filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
    filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';

    // Obtener objetivos relacionados a la línea seleccionada
    const objetivos = [...new Set(
      resourcesData
        .filter(resource => resource.linea_terapeutica === selectedLinea)
        .map(resource => resource.objetivo_terapeutico)
    )];

    // Poblar opciones de "Objetivo Terapéutico"
    objetivos.forEach(objetivo => {
      const option = document.createElement("option");
      option.value = objetivo;
      option.textContent = objetivo;
      filterObjetivo.appendChild(option);
    });
  });

  // Actualizar "Etapa" basado en el "Objetivo Terapéutico" seleccionado
  filterObjetivo.addEventListener('change', () => {
    const selectedLinea = filterLinea.value;
    const selectedObjetivo = filterObjetivo.value;

    // Limpiar opciones dependientes
    filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';

    // Obtener etapas relacionadas al objetivo seleccionado
    const etapas = [...new Set(
      resourcesData
        .filter(resource => resource.linea_terapeutica === selectedLinea && resource.objetivo_terapeutico === selectedObjetivo)
        .map(resource => resource.etapa)
    )];

    // Poblar opciones de "Etapa"
    etapas.forEach(etapa => {
      const option = document.createElement("option");
      option.value = etapa;
      option.textContent = etapa;
      filterEtapa.appendChild(option);
    });
  });

  // Actualizar "Tipo" basado en la "Etapa" seleccionada
  filterEtapa.addEventListener('change', () => {
    const selectedLinea = filterLinea.value;
    const selectedObjetivo = filterObjetivo.value;
    const selectedEtapa = filterEtapa.value;

    // Limpiar opciones de tipo de recurso
    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';

    // Obtener tipos relacionados a la etapa seleccionada
    const tipos = [...new Set(
      resourcesData
        .filter(resource => 
          resource.linea_terapeutica === selectedLinea &&
          resource.objetivo_terapeutico === selectedObjetivo &&
          resource.etapa === selectedEtapa
        )
        .map(resource => resource.tipo)
    )];

    // Poblar opciones de "Tipo de Recurso"
    tipos.forEach(tipo => {
      const option = document.createElement("option");
      option.value = tipo;
      option.textContent = tipo;
      filterTipo.appendChild(option);
    });
  });

  // Filtrar y mostrar resultados en base a las selecciones del usuario
  searchBtn.addEventListener('click', () => {
    const selectedLinea = filterLinea.value;
    const selectedObjetivo = filterObjetivo.value;
    const selectedEtapa = filterEtapa.value;
    const selectedTipo = filterTipo.value;

    // Filtrar recursos según los filtros seleccionados
    const filteredResources = resourcesData.filter(resource =>
      (!selectedLinea || resource.linea_terapeutica === selectedLinea) &&
      (!selectedObjetivo || resource.objetivo_terapeutico === selectedObjetivo) &&
      (!selectedEtapa || resource.etapa === selectedEtapa) &&
      (!selectedTipo || resource.tipo === selectedTipo)
    );

    displayResults(filteredResources); // Mostrar resultados filtrados
  });

  // Función para mostrar resultados en el DOM
  function displayResults(resources) {
    resultadosDiv.innerHTML = '';
    if (resources.length > 0) {
      resources.forEach(recurso => {
        resultadosDiv.innerHTML += `
          <li class="resource">
            <h3>${recurso.nombre}</h3>
            <p><strong>Objetivo terapéutico:</strong> ${recurso.objetivo_terapeutico}</p>
            <p><strong>Etapa:</strong> ${recurso.etapa}</p>
            <p><strong>Tipo:</strong> ${recurso.tipo}</p>
            <a href="${recurso.link}" target="_blank">Abrir recurso</a>
          </li>`;
      });
    } else {
      resultadosDiv.innerHTML = '<p>No se encontraron recursos.</p>';
    }
  }

  // Eventos de login/logout de Netlify Identity para actualizar la UI
  netlifyIdentity.on('login', user => {
    showAuthenticated(user);
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    location.reload();
  });
});
