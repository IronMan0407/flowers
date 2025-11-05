import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCcpSkwfG_olajj__YBHANEmG7c2QXxLU",
  authDomain: "flowerforoyu.firebaseapp.com",
  projectId: "flowerforoyu",
  storageBucket: "flowerforoyu.appspot.com",
  messagingSenderId: "970259307817",
  appId: "1:970259307817:web:93422cb10d689890da2b38",
  measurementId: "G-8SKMKJ17NT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app, "gs://flowerforoyu.appspot.com");

const uploadBtn = document.getElementById("uploadBtn");
const photoInput = document.getElementById("photoInput");
const commentInput = document.getElementById("commentInput");
const gallery = document.getElementById("gallery");

uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  const comment = commentInput.value.trim();
  if (!file) return alert("Оруулах зургаа сонгоорой хөөрхнөө!");

  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `photos/${uniqueName}`);

  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "memories"), {
      url,
      comment,
      timestamp: new Date(),
    });

    alert("Uploaded successfully!");
    showGallery();
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed! Check console for details.");
  }
});

async function showGallery() {
  gallery.innerHTML = "";
  try {
    const q = query(collection(db, "memories"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `
          <img src="${
            data.url
          }" style="width:200px;height:auto;border-radius:10px;margin:10px;">
          <p>${data.comment || ""}</p>
        `;
      gallery.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to load gallery:", error);
  }
}

showGallery();
