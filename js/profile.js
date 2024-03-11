import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

let imageUrl = '';

auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario ha iniciado sesión
        getDoc(doc(collection(db, "usuarios"), user.uid))
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    // Los datos del usuario registrado en el firestore
                    const userData = docSnapshot.data();
                    document.querySelector("h1").textContent = `Bienvenido ${userData.nombre}`; // Cuando Inicia sesion se relaciona al usuario registrado por default
                    document.querySelector(".perfil").innerHTML = `
                        <img id="profileImage" class="profile-image" src="${userData.imageUrl || ''}" >
                        <p><strong>Nombre:</strong> ${userData.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> ${userData.email}</p>
                        <p><strong>Nickname:</strong> ${userData.nickname}</p>
                        <input type="file" id="imageUpload" accept="image/*">
                        <button id="saveImage">Guardar imagen</button>
                    `;
                    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
                    document.getElementById('saveImage').addEventListener('click', saveImage);
                } else {
                    // Los datos del usuario no existentes en el firestore
                    console.error("No se encontraron datos de usuario en Firestore");
                }
            });
    } else {
        // Aqui se muestra en la consola cuando un usuario no inicia sesion
        console.error("No hay usuario iniciando sesión");
    }
});

function handleImageUpload(e) {
    const file = e.target.files[0];
    const storageRef = ref(storage, 'userImages/' + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Se puede usar snapshot para mostrar el progreso de la subida
        },
        (error) => {
            console.error("Error al subir la imagen:", error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                // Actualizar la imagen del perfil con la nueva URL de la imagen
                document.getElementById('profileImage').src = downloadURL;
            });
        }
    );
}
