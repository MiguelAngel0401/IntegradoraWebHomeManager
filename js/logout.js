import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const auth = getAuth();

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("El usuario ha iniciado sesión");
    } else {
        console.log("No hay usuario iniciado sesión");
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    var logoutButton = document.getElementById('yesButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            showModal();
        });
    }

    var noButton = document.getElementById('noButton');
    if (noButton) {
        noButton.addEventListener('click', () => {
            showCustomAlert("¡Bien, tu sesión sigue activa!");
        });
    }
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


    //Ventana Modal para confirmar el cierre de sesion
    var confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            closeModal();
            window.location.href = "index.html";
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

function showCustomAlert(message) {
    var alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerHTML = `
        <p class="alert-message">${message}</p>
        <button class="alert-button" onclick="this.parentNode.remove()">Aceptar</button>
    `;
    document.body.appendChild(alertBox);
}
