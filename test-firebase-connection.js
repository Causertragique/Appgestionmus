// Test de connexion Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('🔧 Configuration Firebase :');
console.log('API Key:', firebaseConfig.apiKey ? '✅ Présent' : '❌ Manquant');
console.log('Auth Domain:', firebaseConfig.authDomain ? '✅ Présent' : '❌ Manquant');
console.log('Project ID:', firebaseConfig.projectId ? '✅ Présent' : '❌ Manquant');
console.log('Storage Bucket:', firebaseConfig.storageBucket ? '✅ Présent' : '❌ Manquant');
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Présent' : '❌ Manquant');
console.log('App ID:', firebaseConfig.appId ? '✅ Présent' : '❌ Manquant');

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('\n🚀 Test de connexion Firebase...');

// Test de création d'utilisateur
async function testFirebaseConnection() {
  try {
    console.log('📝 Test de création d\'utilisateur...');
    
    const testEmail = 'test@demo.com';
    const testPassword = 'test123';
    
    // Créer un utilisateur de test
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Utilisateur créé avec succès:', userCredential.user.uid);
    
    // Créer un document dans Firestore
    const userDoc = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDoc, {
      id: userCredential.user.uid,
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      role: 'student',
      createdAt: new Date()
    });
    console.log('✅ Document Firestore créé avec succès');
    
    // Lire le document
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      console.log('✅ Document Firestore lu avec succès:', docSnap.data());
    }
    
    // Supprimer l'utilisateur de test
    await userCredential.user.delete();
    console.log('✅ Utilisateur de test supprimé');
    
    console.log('\n🎉 Tous les tests Firebase sont réussis !');
    
  } catch (error) {
    console.error('❌ Erreur Firebase:', error);
    console.error('Code d\'erreur:', error.code);
    console.error('Message:', error.message);
  }
}

testFirebaseConnection(); 