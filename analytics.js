async function registrarBusqueda(user, linea, objetivo, etapa, tipo) {
    const fechaHora = new Date().toISOString();
    const registro = {
        user: user ? user.email : "anonimo",  // Nombre de usuario o "anónimo" si no ha iniciado sesión
        fecha_hora: fechaHora,
        linea_terapeutica: linea,
        objetivo_terapeutico: objetivo,
        etapa: etapa,
        tipo: tipo
    };

    try {
        // Por ahora, vamos a registrar en la consola
        console.log("Registro de búsqueda:", registro);
        // Más adelante podemos configurar un almacenamiento en archivo o base de datos
    } catch (error) {
        console.error("Error al registrar la búsqueda:", error);
    }
}
