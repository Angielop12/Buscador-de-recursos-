document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const filterLinea = document.getElementById("filter-linea-terapeutica");
  const filterObjetivo = document.getElementById("filter-objetivo");
  const filterEtapa = document.getElementById("filter-etapa");
  const filterTipo = document.getElementById("filter-tipo");
  const searchBtn = document.getElementById('buscar');
  const resultadosDiv = document.getElementById('resource-list');
  let resourcesData = [];

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
    loadResources();
  }

  logoutBtn.addEventListener('click', () => {
    netlifyIdentity.logout();
    location.reload();
  });

  loginBtn.addEventListener('click', () => {
    netlifyIdentity.open();
  });

  // Cargar recursos desde JSON y almacenar los datos
  function loadResources() {
    fetch('resources.json')
      .then(response => response.json())
      .then(data => {
        resourcesData = data.recursos;
        populateLineaOptions();
      });
  }

  // Poblar opciones de "Línea Terapéutica"
  function populateLineaOptions() {
    const lineas = [...new Set(resourcesData.map(resource => resource.linea_terapeutica))];
    lineas.forEach(linea => {
      const option = document.createElement("option");
      option.value = linea;
      option.textContent = linea;
      filterLinea.appendChild(option);
    });
  }

  // Actualizar "Objetivo Terapéutico" basado en "Línea Terapéutica"
  filterLinea.addEventListener('change', () => {
    const selectedLinea = filterLinea.value;
    filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
    filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';

    const objetivos = [...new Set(
      resourcesData
        .filter(resource => resource.linea_terapeutica === selectedLinea)
        .map(resource => resource.objetivo_terapeutico)
    )];

    objetivos.forEach(objetivo => {
      const option = document.createElement("option");
      option.value = objetivo;
      option.textContent = objetivo;
      filterObjetivo.appendChild(option);
    });
  });

  // Actualizar "Etapa" basado en "Objetivo Terapéutico"
  filterObjetivo.addEventListener('change', () => {
    const selectedLinea = filterLinea.value;
    const selectedObjetivo = filterObjetivo.value;
    filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';

    const etapas = [...new Set(
      resourcesData
        .filter(resource => resource.linea_terapeutica === selectedLinea && resource.objetivo_terapeutico === selectedObjetivo)
        .map(resource => resource.etapa)
    )];

    etapas.forEach(etapa => {
      const option = document.createElement("option");
      option.value = etapa;
      option.textContent = etapa;
      filterEtapa.appendChild(option);
    });
  });

  // Actualizar "Tipo" basado en "Etapa"
  filterEtapa.addEventListener('change', () => {
    const selectedLinea = filterLinea.value;
    const selectedObjetivo = filterObjetivo.value;
    const selectedEtapa = filterEtapa.value;
    filterTipo.innerHTML = '<option value="">Selecciona un tipo de recurso</option>';

    const tipos = [...new Set(
      resourcesData
        .filter(resource => 
          resource.linea_terapeutica === selectedLinea &&
          resource.objetivo_terapeutico === selectedObjetivo &&
          resource.etapa === selectedEtapa
        )
        .map(resource => resource.tipo)
    )];

    tipos.forEach(tipo => {
      const option = document.createElement("option");
      option.value = tipo;
      option.textContent = tipo;
      filterTipo.appendChild(option);
    });
  });

  // Filtrar y mostrar resultados
  searchBtn.addEventListener('click', () => {
    const selectedLinea = filterLinea.value;
    const selectedObjetivo = filterObjetivo.value;
    const selectedEtapa = filterEtapa.value;
    const selectedTipo = filterTipo.value;

    const filteredResources = resourcesData.filter(resource =>
      (!selectedLinea || resource.linea_terapeutica === selectedLinea) &&
      (!selectedObjetivo || resource.objetivo_terapeutico === selectedObjetivo) &&
      (!selectedEtapa || resource.etapa === selectedEtapa) &&
      (!selectedTipo || resource.tipo === selectedTipo)
    );

    displayResults(filteredResources);
  });

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

  netlifyIdentity.on('login', user => {
    showAuthenticated(user);
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    location.reload();
  });
});
