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
                    nickname: nombre, // Se guardara el nickname en el firebase
                })
                .then(function() {
                    console.log("Usuario registrado exitosamente en Firestore");
                })
                .catch(function(error) {
                    console.error("Error al registrar usuario en Firestore:", error);
                });
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error("Error durante el registro en Firebase Authentication:", errorMessage);
            });
    }

    // Se carga el DOM para el evento
    var registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            registrarUsuario();
        });
    }
});
