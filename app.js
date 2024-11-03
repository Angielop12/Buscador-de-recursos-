  document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultadosDiv = document.getElementById('resultados');
    const lineaInput = document.getElementById('linea-input'); // Nuevo input para la línea terapéutica

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
          searchBtn.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase();
            const lineaQuery = lineaInput.value.toLowerCase(); // Obtener el valor del nuevo filtro
            const filteredResources = data.recursos.filter(recurso => {
              return (
                recurso.nombre.toLowerCase().includes(query) || 
                recurso.objetivo_terapeutico.toLowerCase().includes(query) ||
                recurso.etapa.toLowerCase().includes(query) ||
                recurso.tipo.toLowerCase().includes(query)
              ) && 
              recurso.linea_terapeutica.toLowerCase().includes(lineaQuery); // Filtrar también por línea terapéutica
            });

            displayResults(filteredResources);
          });
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
              <p><strong>Línea terapéutica:</strong> ${recurso.linea_terapeutica}</p>
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
