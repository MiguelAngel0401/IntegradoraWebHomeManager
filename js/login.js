import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var nickname = document.getElementById("usuario").value;
        var contrasena = document.getElementById("contrasena").value;

        const q = query(collection(db, "usuarios"), where("nickname", "==", nickname));
        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const email = querySnapshot.docs[0].data().email;
                    signInWithEmailAndPassword(auth, email, contrasena)
                        .then((userCredential) => {
                            // El usuario ha iniciado sesión correctamente
                            const user = userCredential.user;
                            if (user) {
                                // Mostrar ventana modal de éxito
                                showModal();
                            } else {
                                // Mostrar ventana modal de error
                                showErrorModal();
                            }
                        })
                        .catch((error) => {
                            console.error("Error durante el inicio de sesión:", error.message);
                            // Mostrar ventana modal de error
                            showErrorModal();
                        });
                } else {
                    console.error("Nickname no encontrado");
                    // Mostrar ventana modal de error
                    showErrorModal();
                }
            })
            .catch((error) => {
                console.error("Error al buscar el nickname:", error.message);
                // Mostrar ventana modal de error
                showErrorModal();
            });
    });
});

// Función para mostrar la ventana modal de inicio de sesión exitoso
function showModal() {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Inicio de Sesión Exitoso</h2>
            <p>¡Bienvenido de vuelta!</p>
            <div class="modal-buttons">
                <button id="okButton">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    var span = document.getElementsByClassName("close")[0];

    // Cuando el usuario haga clic en <span> (x), cerrar el modal
    span.onclick = function() {
        closeModal();
    }

    // Cuando el usuario haga clic en el botón OK, cerrar el modal y redirigir a la página de perfil
    var okButton = document.getElementById("okButton");
    okButton.onclick = function() {
        closeModal();
        // Redirigir al usuario a la página de perfil después de cerrar el modal
        window.location.href = "profile.html";
    }

    // Cuando el usuario haga clic fuera del modal, cerrarlo
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
            // Redirigir al usuario a la página de perfil después de cerrar el modal
            window.location.href = "profile.html";
        }
    }
}

// Función para mostrar la ventana modal de error de inicio de sesión
function showErrorModal() {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Error de Inicio de Sesión</h2>
            <p>Los datos de inicio de sesión no son correctos. Por favor, inténtalo de nuevo.</p>
            <div class="modal-buttons">
                <button id="errorOkButton">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    var span = document.getElementsByClassName("close")[0];

    // Cuando el usuario haga clic en <span> (x), cerrar el modal
    span.onclick = function() {
        closeModal();
    }

    // Cuando el usuario haga clic en el botón OK, cerrar el modal
    var errorOkButton = document.getElementById("errorOkButton");
    errorOkButton.onclick = function() {
        closeModal();
    }

    // Cuando el usuario haga clic fuera del modal, cerrarlo
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

function closeModal() {
    var modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}
