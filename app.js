document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultadosDiv = document.getElementById('resultados');

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
    loadResources(); // Cargar recursos solo para usuarios autenticados
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

  // Cargar recursos desde JSON
  function loadResources() {
    fetch('resources.json')
      .then(response => response.json())
      .then(data => {
        generarFiltros(data.recursos);
        searchBtn.addEventListener('click', () => {
          const query = searchInput.value.toLowerCase();
          const filteredResources = data.recursos.filter(recurso => {
            return (
              recurso.nombre.toLowerCase().includes(query) ||
              recurso.objetivo_terapeutico.toLowerCase().includes(query) ||
              recurso.etapa.toLowerCase().includes(query) ||
              recurso.tipo.toLowerCase().includes(query) ||
              recurso.linea_terapeutica.toLowerCase().includes(query) // Nuevo filtro
            );
          });

          displayResults(filteredResources);
        });
      });
  }

  // Función para generar los filtros dinámicamente
  function generarFiltros(resources) {
    const filterObjetivo = document.getElementById("filter-objetivo");
    const filterEtapa = document.getElementById("filter-etapa");
    const filterTipo = document.getElementById("filter-tipo");
    const filterLinea = document.getElementById("filter-linea-terapeutica");

    let objetivos = new Set();
    let etapas = new Set();
    let tipos = new Set();
    let lineas = new Set();

    resources.forEach(resource => {
      objetivos.add(resource.objetivo_terapeutico);
      etapas.add(resource.etapa);
      tipos.add(resource.tipo);
      lineas.add(resource.linea_terapeutica);
    });

    objetivos.forEach(obj => {
      let option = document.createElement("option");
      option.value = obj;
      option.textContent = obj;
      filterObjetivo.appendChild(option);
    });

    etapas.forEach(et => {
      let option = document.createElement("option");
      option.value = et;
      option.textContent = et;
      filterEtapa.appendChild(option);
    });

    tipos.forEach(tp => {
      let option = document.createElement("option");
      option.value = tp;
      option.textContent = tp;
      filterTipo.appendChild(option);
    });

    lineas.forEach(ln => {
      let option = document.createElement("option");
      option.value = ln;
      option.textContent = ln;
      filterLinea.appendChild(option);
    });
  }

  // Mostrar los resultados en el DOM
  function displayResults(resources) {
    resultadosDiv.innerHTML = '';
    if (resources.length > 0) {
      resources.forEach(recurso => {
        resultadosDiv.innerHTML += `
          <div class="resource">
            <h3>${recurso.nombre}</h3>
            <p><strong>Objetivo terapéutico:</strong> ${recurso.objetivo_terapeutico}</p>
            <p><strong>Etapa:</strong> ${recurso.etapa}</p>
            <p><strong>Tipo:</strong> ${recurso.tipo}</p>
            <p><strong>Línea Terapéutica:</strong> ${recurso.linea_terapeutica}</p> <!-- Nuevo campo -->
            <a href="${recurso.link}" target="_blank">Abrir recurso</a>
          </div>`;
      });
    } else {
      resultadosDiv.innerHTML = '<p>No se encontraron recursos.</p>';
    }
  }

  // Escuchar el evento de login de Netlify Identity
  netlifyIdentity.on('login', user => {
    showAuthenticated(user);
    netlifyIdentity.close();
  });

  // Recargar al cerrar sesión
  netlifyIdentity.on('logout', () => {
    location.reload();
  });
});
