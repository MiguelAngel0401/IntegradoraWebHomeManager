import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRfBHsXskhbwpCvtaLcaaZcTRCYKc1iSw",
  authDomain: "homemanager-58115.firebaseapp.com",
  projectId: "homemanager-58115",
  storageBucket: "homemanager-58115.appspot.com",
  messagingSenderId: "614657986482",
  appId: "1:614657986482:web:25c61e58072572e80f9eab"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig); 
const db = getFirestore(app);
const auth = getAuth();

// Configurar la persistencia de la sesión lo que permite volver a iniciar sesion despues de ser cerrada
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("La persistencia de la sesión está configurada para 'local'");
    })
    .catch((error) => {
        console.error("Error al configurar la persistencia de la sesión:", error);
    });

document.addEventListener('DOMContentLoaded', (event) => {
    var registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            registrarUsuario();
        });
    }

    function registrarUsuario() {
        var nombre = document.getElementById("nombre").value;
        var email = document.getElementById("email").value;
        var contrasena = document.getElementById("contrasena").value;

        // Crear usuario en Firebase Authentication
        createUserWithEmailAndPassword(auth, email, contrasena)
            .then(function(userCredential) {
                var user = userCredential.user;

                // Agregar información adicional del usuario al Firestore
                setDoc(doc(collection(db, "usuarios"), user.uid), {
                    nombre: nombre,
                    email: email,
                    nickname: nombre, // Se guardará el nickname en Firebase
                })
                .then(function() {
                    console.log("Usuario registrado exitosamente en Firestore");
                    // Mostrar la ventana modal de registro exitoso
                    showModal("Registro Exitoso", "¡El usuario se ha registrado exitosamente!", "index.html");
                })
                .catch(function(error) {
                    console.error("Error al registrar usuario en Firestore:", error);
                });
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === "auth/email-already-in-use") {
                    // Mostrar la ventana modal de usuario ya registrado
                    showModal("Usuario ya Registrado", "Ya existe un usuario con este correo electrónico. Por favor, registre uno nuevo.", null);
                } else {
                    console.error("Error durante el registro en Firebase Authentication:", errorMessage);
                }
            });
    }

    // Función para mostrar la ventana modal
    function showModal(title, message, redirectUrl) {
        var modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button id="okButton" class="modal-button">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        var span = document.getElementsByClassName("close")[0];

        // Cuando el usuario haga clic en <span> (x), cerrar el modal
        span.onclick = function() {
            closeModal();
        }

        // Cuando el usuario haga clic en el botón "OK", cerrar el modal y redirigir si es necesario
        var okButton = document.getElementById("okButton");
        okButton.onclick = function() {
            closeModal();
            if (redirectUrl) {
                // Redirigir al usuario si se especifica una URL de redirección
                window.location.href = redirectUrl;
            }
        }

        // Cuando el usuario haga clic fuera del modal, cerrarlo
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
                if (redirectUrl) {
                    // Redirigir al usuario si se especifica una URL de redirección
                    window.location.href = redirectUrl;
                }
            }
        }
    }

    function closeModal() {
        var modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }
});
