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
