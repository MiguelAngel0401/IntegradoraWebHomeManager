import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

auth.onAuthStateChanged((user) => {
    if (user) {
        // Aqui se muestra en la consola del navegador cuando el ususario ha iniciado sesion
        console.log("El usuario ha iniciado sesión");
    } else {
        // Aqui se muestra en la consola cuando un usuario no inicia sesion
        console.log("No hay usuario iniciando sesión");
    }
});

function iniciarSesion(event) {
    event.preventDefault();

    var nickname = document.getElementById("usuario").value;
    var contrasena = document.getElementById("contrasena").value;

    // Aqui se relaciona el correo referente a su nickname
    const q = query(collection(db, "usuarios"), where("nickname", "==", nickname));
    getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
            // Cuando encuentra en Nickname inicia sesion con el correo que le corresponde
            const email = querySnapshot.docs[0].data().email;
            signInWithEmailAndPassword(auth, email, contrasena)
                .then((userCredential) => {
                    // Dirige al perfil al momento de iniciar sesion
                    window.location.href = "profile.html";
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error("Error durante el inicio de sesión:", errorMessage);
                });
        } else {
            // No encunetra nickname relacionado por lo tanto no s epuede iniciar sesion
            console.error("Nickname no encontrado");
        }
    }).catch((error) => {
        console.error("Error al buscar el nickname:", error);
    });
}

// Se carga el DOM para el evento
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").addEventListener("submit", iniciarSesion);
});
