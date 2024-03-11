import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const auth = getAuth();

auth.onAuthStateChanged((user) => {
    if (user) {
        // El usuario ha iniciado sesión
        console.log("El usuario ha iniciado sesión");
    } else {
        // No hay usuario iniciado sesión
        console.log("No hay usuario iniciado sesión");
    }
});

// Asegurarse de que el DOM esté completamente cargado antes de agregar el event listener
document.addEventListener('DOMContentLoaded', (event) => {
    var logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log("Usuario cerró sesión con éxito");
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("Error al cerrar la sesión:", error);
            });
        });
    }
});
