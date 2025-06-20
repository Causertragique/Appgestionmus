#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Test de la configuration Firebase...\n');

// Vérifier si le fichier .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local non trouvé !');
  console.log('💡 Exécutez d\'abord : npm run setup-firebase');
  process.exit(1);
}

// Lire le fichier .env.local
const envContent = fs.readFileSync(envPath, 'utf8');

// Vérifier les variables requises
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

console.log('📋 Vérification des variables d\'environnement :');

let allVarsPresent = true;
requiredVars.forEach(varName => {
  if (envContent.includes(varName)) {
    console.log(`✅ ${varName} : Présente`);
  } else {
    console.log(`❌ ${varName} : Manquante`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n❌ Configuration incomplète !');
  console.log('💡 Exécutez : npm run setup-firebase');
  process.exit(1);
}

// Vérifier les dépendances Firebase
console.log('\n📦 Vérification des dépendances :');

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const firebaseDeps = ['firebase'];
  firebaseDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} : Installé (${dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} : Non installé`);
      allVarsPresent = false;
    }
  });
}

// Vérifier les fichiers de configuration Firebase
console.log('\n📁 Vérification des fichiers de configuration :');

const firebaseConfigPath = path.join(process.cwd(), 'src', 'services', 'firebase.ts');
if (fs.existsSync(firebaseConfigPath)) {
  console.log('✅ src/services/firebase.ts : Présent');
} else {
  console.log('❌ src/services/firebase.ts : Manquant');
  allVarsPresent = false;
}

const firestoreServicePath = path.join(process.cwd(), 'src', 'services', 'firestoreService.ts');
if (fs.existsSync(firestoreServicePath)) {
  console.log('✅ src/services/firestoreService.ts : Présent');
} else {
  console.log('❌ src/services/firestoreService.ts : Manquant');
  allVarsPresent = false;
}

// Résultat final
console.log('\n' + '='.repeat(50));

if (allVarsPresent) {
  console.log('🎉 Configuration Firebase valide !');
  console.log('\n🚀 Vous pouvez maintenant :');
  console.log('1. Lancer l\'application : npm run dev');
  console.log('2. Tester la connexion Firebase');
  console.log('3. Initialiser les données de démonstration');
  console.log('4. Préparer le déploiement : npm run build');
} else {
  console.log('❌ Configuration Firebase incomplète !');
  console.log('\n🔧 Actions à effectuer :');
  console.log('1. Installer les dépendances : npm install');
  console.log('2. Configurer Firebase : npm run setup-firebase');
  console.log('3. Vérifier les fichiers de configuration');
}

console.log('\n' + '='.repeat(50)); 