import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

auth.onAuthStateChanged((user) => {
    if (user) {
        // El usuario está autenticado
        const userId = user.uid;
        const q = query(collection(db, "usuarios"), where("userId", "==", userId));
        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const nickname = userData.nickname;
                    const nombre = userData.nombre;
                    const userName = nickname || nombre || user.email.split('@')[0]; // Priorizar nickname, luego nombre, luego correo electrónico
                    document.getElementById("welcomeMessage").innerText = `Bienvenid@, ${userName}!`;
                } else {
                    document.getElementById("welcomeMessage").innerText = `Bienvenid@, ${user.email.split('@')[0]}!`; // Mostrar el nombre de usuario del correo electrónico si no hay datos adicionales en la base de datos
                }
            })
            .catch((error) => {
                console.error("Error al obtener la información del usuario:", error);
                document.getElementById("welcomeMessage").innerText = `Bienvenid@, ${user.email.split('@')[0]}!`; // Mostrar el nombre de usuario del correo electrónico en caso de error
            });
    } else {
        // El usuario no está autenticado, redirigirlo a la página de inicio de sesión
        window.location.href = "login.html";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    var logoutLink = document.getElementById('logoutLink'); // Obtener el enlace de cerrar sesión
    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            showModal(); // Mostrar la ventana modal al hacer clic en el enlace de cerrar sesión
        });
    }

    var profileImage = document.getElementById('profileImage');
    var imageUpload = document.getElementById('imageUpload');
    var saveImage = document.getElementById('saveImage');

    // Mostrar la imagen de perfil actual
    const user = auth.currentUser; // Obtener el usuario autenticado
    if (user) {
        const storageRef = ref(storage, 'profile_images/' + user.uid);
        getDownloadURL(storageRef)
            .then((url) => {
                profileImage.src = url; // Establecer la URL de la imagen de perfil actual
            })
            .catch((error) => {
                console.error('Error al obtener la URL de la imagen de perfil:', error);
            });
    }

    // Lógica para guardar la imagen de perfil
    saveImage.addEventListener('click', () => {
        const file = imageUpload.files[0]; // Obtener el archivo de la entrada de carga de imagen
        if (file) {
            uploadImage(file)
                .then((downloadURL) => {
                    profileImage.src = downloadURL; // Actualizar la imagen de perfil con la nueva URL
                })
                .catch((error) => {
                    console.error('Error al subir la imagen de perfil:', error);
                });
        }
    });
});

function showModal() {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>¿Estás seguro de que deseas cerrar sesión?</h2>
            <div class="modal-buttons">
                <button id="confirmButton">Sí</button>
                <button id="cancelButton">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Ventana Modal para confirmar el cierre de sesión
    var confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            closeModal();
            window.location.href = "index.html"; // Redirige al usuario a la página de inicio después de cerrar sesión
        }).catch((error) => {
            console.error("Error al cerrar la sesión:", error);
        });
    });

    var cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click', () => {
        closeModal();
    });
}

function closeModal() {
    var modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function uploadImage(file) {
    const user = auth.currentUser; // Obtener el usuario autenticado
    const storageRef = ref(storage, 'profile_images/' + user.uid); // Referencia al almacenamiento de la imagen de perfil del usuario
    return uploadBytes(storageRef, file)
        .then((snapshot) => {
            console.log('Imagen subida con éxito');
            return getDownloadURL(snapshot.ref);
        });
}

function showCustomAlert(message) {
    var alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerHTML = `
        <p class="alert-message">${message}</p>
        <button class="alert-button" onclick="this.parentNode.remove()">Aceptar</button>
    `;
    document.body.appendChild(alertBox);
}
