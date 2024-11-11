// Asegúrate de que Firebase esté inicializado
if (!firebase.apps.length) {
    // Esto solo se ejecutará si Firebase no ha sido inicializado ya
    firebase.initializeApp({
      apiKey: "AIzaSyAy8J1xeXEGINvvQ8DDJcvnZPGREQIe4G8",
      authDomain: "buscador-cresentia-dad48.firebaseapp.com",
      projectId: "buscador-cresentia-dad48",
      storageBucket: "buscador-cresentia-dad48.firebasestorage.app",
      messagingSenderId: "401159603535",
      appId: "1:401159603535:web:9442828e92ed08f295b13a",
      measurementId: "G-HD1L0EHGQF"
    });
  }
  
  // Inicializa Firestore
  const db = firebase.firestore();
  
  // Función para registrar la búsqueda en Firestore
  async function registrarBusqueda(user, linea, objetivo, etapa, tipo) {
      const fechaHora = new Date().toISOString();
      const registro = {
          user: user ? user.email : "anonimo", // Usa el email del usuario o "anónimo" si no está autenticado
          fecha_hora: fechaHora,
          linea_terapeutica: linea,
          objetivo_terapeutico: objetivo,
          etapa: etapa,
          tipo: tipo
      };
  
      try {
          // Guardar el registro en Firebase Firestore
          await db.collection("registros").add(registro);
          console.log("Registro de búsqueda guardado en Firebase:", registro);
      } catch (error) {
          console.error("Error al registrar la búsqueda:", error);
      }
  }
  