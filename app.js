document.addEventListener('DOMContentLoaded', function () {
  const lineaSelect = document.getElementById('filter-linea');
  const objetivoSelect = document.getElementById('filter-objetivo');
  const etapaSelect = document.getElementById('filter-etapa');
  const tipoSelect = document.getElementById('filter-tipo');
  const buscarBtn = document.getElementById('buscar');
  const resourceList = document.getElementById('resource-list');

  // Cargar datos desde el archivo JSON
  fetch('resources.json')
    .then(response => response.json())
    .then(data => {
      const recursos = data.recursos;
      initFilters(recursos);
      
      buscarBtn.addEventListener('click', () => {
        const filteredResources = filterResources(recursos);
        displayResources(filteredResources);
      });
    });

  // Inicializar filtros únicos
  function initFilters(recursos) {
    const lineas = [...new Set(recursos.map(recurso => recurso['linea_terapeutica '].trim()))];
    const objetivos = [...new Set(recursos.map(recurso => recurso.objetivo_terapeutico.trim()))];
    const etapas = [...new Set(recursos.map(recurso.etapa.trim()))];
    const tipos = [...new Set(recursos.map(recurso.tipo.trim()))];

    populateSelect(lineaSelect, lineas);
    populateSelect(objetivoSelect, objetivos);
    populateSelect(etapaSelect, etapas);
    populateSelect(tipoSelect, tipos);
  }

  function populateSelect(selectElement, options) {
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      selectElement.appendChild(opt);
    });
  }

  function filterResources(recursos) {
    const selectedLinea = lineaSelect.value;
    const selectedObjetivo = objetivoSelect.value;
    const selectedEtapa = etapaSelect.value;
    const selectedTipo = tipoSelect.value;

    return recursos.filter(recurso => {
      return (!selectedLinea || recurso['linea_terapeutica '].trim() === selectedLinea) &&
             (!selectedObjetivo || recurso.objetivo_terapeutico.trim() === selectedObjetivo) &&
             (!selectedEtapa || recurso.etapa.trim() === selectedEtapa) &&
             (!selectedTipo || recurso.tipo.trim() === selectedTipo);
    });
  }

  function displayResources(recursos) {
    resourceList.innerHTML = '';
    recursos.forEach(recurso => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${recurso.link}" target="_blank">${recurso.nombre}</a>`;
      resourceList.appendChild(li);
    });
  }

  // Manejo de autenticación con Netlify
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  netlifyIdentity.on('login', () => {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline';
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    loginBtn.style.display = 'inline';
    logoutBtn.style.display = 'none';
  });

  loginBtn.addEventListener('click', () => {
    netlifyIdentity.open();
  });

  logoutBtn.addEventListener('click', () => {
    netlifyIdentity.logout();
  });
});
