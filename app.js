<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buscador de Recursos CreSentia</title>
  <style>
    /* Estilos del sitio */
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #f7eae6;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 900px;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }

    .logo-section, .form-section {
      width: 45%;
    }

    .logo-section {
      text-align: center;
    }

    .logo-section img {
      width: 200px;
      margin-bottom: 20px;
    }

    .logo-section button {
      background-color: #fff;
      color: #2f4f3e;
      border: 2px solid #2f4f3e;
      padding: 10px 20px;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .logo-section button:hover {
      background-color: #2f4f3e;
      color: #fff;
    }

    .form-section h2 {
      color: #2f4f3e;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .form-section p {
      color: #2f4f3e;
      margin-bottom: 20px;
    }

    .form-section label {
      font-weight: bold;
      color: #b26060;
      display: block;
      margin-bottom: 5px;
    }

    .form-section select, .form-section button {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid #ddd;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }

    .form-section select {
      background-color: #f9f6f5;
      color: #2f4f3e;
    }

    .form-section button {
      background-color: #2f4f3e;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border: none;
    }

    .form-section button:hover {
      background-color: #1e3b2b;
    }

    #resource-list {
      margin-top: 20px;
      list-style: none;
      padding: 0;
    }

    #resource-list li {
      background-color: #f8bbd0;
      margin: 10px 0;
      padding: 10px;
      border-radius: 10px;
    }

    #resource-list a {
      color: #ad1457;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>

  <div class="container">
    <!-- Sección del logo y botón de inicio de sesión -->
    <div class="logo-section">
      <img src="https://raw.githubusercontent.com/Angielop12/Buscador-de-recursos-/main/logo.jpg" alt="Logo CreSentia">
      <button id="login-btn">Iniciar sesión</button>
    </div>

    <!-- Sección del formulario de filtros -->
    <div class="form-section">
      <h2>Hola! Bienvenid@</h2>
      <p>Al banco de recursos de <strong>CreSentia</strong></p>
      <p>Completa los filtros para realizar la búsqueda:</p>

      <label for="filter-linea-terapeutica">Línea terapéutica</label>
      <select id="filter-linea-terapeutica">
        <option value="">Selecciona una línea terapéutica</option>
      </select>

      <label for="filter-objetivo">Objetivo terapéutico</label>
      <select id="filter-objetivo">
        <option value="">Selecciona un objetivo terapéutico</option>
      </select>

      <label for="filter-etapa">Etapa</label>
      <select id="filter-etapa">
        <option value="">Selecciona una etapa</option>
      </select>

      <label for="filter-tipo">Tipo de recurso</label>
      <select id="filter-tipo">
        <option value="">Selecciona un tipo de recurso</option>
      </select>

      <button id="buscar">Buscar recurso</button>
    </div>
  </div>

  <!-- Lista de resultados -->
  <ul id="resource-list"></ul>

  <script>
    let allResources = []; // Variable global para almacenar todos los recursos

    // Inicializar Netlify Identity
    const loginBtn = document.getElementById('login-btn');
    
    netlifyIdentity.on('init', user => {
      if (user) {
        loginBtn.style.display = 'none';
        fetchResources();
      }
    });

    loginBtn.addEventListener('click', () => {
      netlifyIdentity.open();
    });

    netlifyIdentity.on('login', user => {
      loginBtn.style.display = 'none';
      fetchResources();
      netlifyIdentity.close();
    });

    netlifyIdentity.on('logout', () => {
      loginBtn.style.display = 'inline-block';
      document.getElementById("resource-list").innerHTML = "";  // Limpiar lista de recursos al cerrar sesión
    });

    // Función para cargar recursos desde el archivo JSON
    function fetchResources() {
      fetch('resources.json')
        .then(response => response.json())
        .then(data => {
          allResources = data.recursos;
          generarFiltros();
        })
        .catch(error => console.error("Error al obtener los datos del archivo JSON: ", error));
    }

    // Función para generar los filtros dinámicamente
    function generarFiltros() {
      const filterLinea = document.getElementById("filter-linea-terapeutica");
      
      const lineas = [...new Set(allResources.map(resource => resource.linea_terapeutica))];
      filterLinea.innerHTML = '<option value="">Selecciona una línea terapéutica</option>';
      lineas.forEach(linea => filterLinea.innerHTML += `<option value="${linea}">${linea}</option>`);

      filterLinea.addEventListener("change", actualizarObjetivo);
      document.getElementById("filter-objetivo").addEventListener("change", actualizarEtapa);
      document.getElementById("filter-etapa").addEventListener("change", actualizarTipo);
    }

    // Función para actualizar el filtro de Objetivo Terapéutico basado en la Línea Terapéutica seleccionada
    function actualizarObjetivo() {
      const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
      const filterObjetivo = document.getElementById("filter-objetivo");

      const objetivos = [...new Set(allResources
        .filter(resource => resource.linea_terapeutica === lineaSeleccionada)
        .map(resource => resource.objetivo_terapeutico))];

      filterObjetivo.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
      objetivos.forEach(objetivo => filterObjetivo.innerHTML += `<option value="${objetivo}">${objetivo}</option>`);

      document.getElementById("filter-etapa").innerHTML = '<option value="">Selecciona una etapa</option>';
      document.getElementById("filter-tipo").innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    }

    // Función para actualizar el filtro de Etapa basado en el Objetivo Terapéutico seleccionado
    function actualizarEtapa() {
      const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
      const objetivoSeleccionado = document.getElementById("filter-objetivo").value;
      const filterEtapa = document.getElementById("filter-etapa");

      const etapas = [...new Set(allResources
        .filter(resource => resource.linea_terapeutica === lineaSeleccionada && resource.objetivo_terapeutico === objetivoSeleccionado)
        .map(resource => resource.etapa))];

      filterEtapa.innerHTML = '<option value="">Selecciona una etapa</option>';
      etapas.forEach(etapa => filterEtapa.innerHTML += `<option value="${etapa}">${etapa}</option>`);

      document.getElementById("filter-tipo").innerHTML = '<option value="">Selecciona un tipo de recurso</option>';
    }

    // Función para actualizar el filtro de Tipo de Recurso basado en la Etapa seleccionada
    function actualizarTipo() {
      const lineaSeleccionada = document.getElementById("filter-linea-terapeutica").value;
      const objetivoSeleccionado = document.getElementById("filter-objetivo").value;
      const etapaSeleccionada = document.getElementById("filter-etapa").value;
      const filterTipo = document.getElementById("filter-tipo");

      const tipos = [...new Set(allResources
        .filter(resource => 
          resource.linea_terapeutica === lineaSeleccionada && 
          resource.objetivo_terapeutico === objetivoSeleccionado && 
          resource.etapa === etapaSeleccionada)
        .map(resource => resource.tipo))];

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

      const filteredResources = allResources.filter(resource =>
        (lineaSeleccionada === "" || resource.linea_terapeutica === lineaSeleccionada) &&
        (objetivoSeleccionado === "" || resource.objetivo_terapeutico === objetivoSeleccionado) &&
        (etapaSeleccionada === "" || resource.etapa === etapaSeleccionada) &&
        (tipoSeleccionado === "" || resource.tipo === tipoSeleccionado)
      );

      renderResourceList(filteredResources);
    }

    document.getElementById("buscar").addEventListener("click", filterResources);
  </script>
</body>
</html>
