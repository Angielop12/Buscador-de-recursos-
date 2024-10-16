// Función que se ejecuta cuando el usuario inicia sesión correctamente con Google
function onSignIn(googleUser) {
    // Obtener la información del perfil del usuario
    var profile = googleUser.getBasicProfile();
    var email = profile.getEmail();
    var name = profile.getName();

    console.log('Email: ' + email);
    console.log('Nombre: ' + name);

    // Aquí puedes agregar la validación para comprobar si el usuario está autorizado
    if (emailAutorizado(email)) {
        // Mostrar el buscador si el usuario está autorizado
        document.getElementById('buscador').style.display = 'block';
        document.getElementById('status').innerText = 'Acceso concedido. Bienvenido, ' + name;
    } else {
        // Mostrar un mensaje de error si el usuario no está autorizado
        document.getElementById('status').innerText = 'No tienes acceso autorizado.';
    }
}

// Función para verificar si el correo electrónico está en la lista de autorizados
function emailAutorizado(email) {
    // Lista de usuarios autorizados (puedes actualizar esto para usar Google Sheets más adelante)
    var usuariosAutorizados = ["usuario1@gmail.com", "usuario2@gmail.com"];
    return usuariosAutorizados.includes(email);
}

// Función para cerrar sesión (opcional)
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('Usuario desconectado.');
        document.getElementById('buscador').style.display = 'none';
        document.getElementById('status').innerText = '';
    });
}
