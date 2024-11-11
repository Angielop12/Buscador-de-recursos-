// Asegúrate de inicializar Firebase solo una vez
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Configuración de Firebase (reemplaza con tus valores reales)
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "buscador-cresentia-dad48.firebaseapp.com",
    projectId: "buscador-cresentia-dad48",
    storageBucket: "buscador-cresentia-dad48.firebasestorage.app",
    messagingSenderId: "401159603535",
    appId: "1:401159603535:web:9442828e92ed08f295b13a"
};

// Inicializa Firebase y Firestore solo una vez
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para registrar la búsqueda en Firebase
export async function registrarBusqueda(user, linea, objetivo, etapa, tipo) {
    const fechaHora = new Date().toISOString();
    const registro = {
        user: user && user.email ? user.email : "anonimo",
        fecha_hora: fechaHora,
        linea_terapeutica: linea,
        objetivo_terapeutico: objetivo,
        etapa: etapa,
        tipo: tipo
    };

    try {
        // Guardar el registro en Firestore
        await addDoc(collection(db, "registros"), registro);
        console.log("Registro de búsqueda guardado en Firebase:", registro);
    } catch (error) {
        console.error("Error al registrar la búsqueda:", error);
    }
}

