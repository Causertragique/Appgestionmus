#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🔍 Diagnostic Firebase - Où en êtes-vous ?\n');
  console.log('='.repeat(60));

  // Vérifier si Firebase est configuré
  const envPath = path.join(process.cwd(), '.env.local');
  const isFirebaseConfigured = fs.existsSync(envPath);

  if (isFirebaseConfigured) {
    console.log('✅ Firebase est déjà configuré !');
    console.log('📁 Fichier .env.local trouvé');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasAllVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ].every(varName => envContent.includes(varName));

    if (hasAllVars) {
      console.log('✅ Toutes les variables d\'environnement sont présentes');
      console.log('\n🎉 Votre configuration Firebase est complète !');
      console.log('\n📋 Que souhaitez-vous faire maintenant ?');
      console.log('1. Tester l\'application (npm run dev)');
      console.log('2. Préparer le déploiement (npm run prepare-deployment)');
      console.log('3. Voir les guides de configuration');
      
      const choice = await question('\nVotre choix (1-3) : ');
      
      switch (choice.trim()) {
        case '1':
          console.log('\n🚀 Lancement de l\'application...');
          const { execSync } = require('child_process');
          try {
            execSync('npm run dev', { stdio: 'inherit' });
          } catch (error) {
            console.log('❌ Erreur lors du lancement');
          }
          break;
        case '2':
          console.log('\n🚀 Préparation du déploiement...');
          try {
            execSync('npm run prepare-deployment', { stdio: 'inherit' });
          } catch (error) {
            console.log('❌ Erreur lors de la préparation');
          }
          break;
        case '3':
          showGuides();
          break;
        default:
          console.log('❌ Choix invalide');
      }
    } else {
      console.log('❌ Configuration Firebase incomplète');
      console.log('💡 Relancez : npm run setup-firebase');
    }
  } else {
    console.log('❌ Firebase non configuré');
    console.log('📋 Vous devez configurer Firebase avant de continuer\n');
    
    await diagnoseFirebaseSetup();
  }

  rl.close();
}

async function diagnoseFirebaseSetup() {
  console.log('🔍 Diagnostic de votre progression Firebase :\n');

  const steps = [
    {
      name: 'Projet Firebase créé',
      question: 'Avez-vous créé un projet Firebase sur https://console.firebase.google.com/ ? (oui/non) : '
    },
    {
      name: 'Firestore Database activé',
      question: 'Avez-vous activé Firestore Database dans votre projet ? (oui/non) : '
    },
    {
      name: 'Authentication configuré',
      question: 'Avez-vous configuré Authentication (Google/Microsoft) ? (oui/non) : '
    },
    {
      name: 'Application web ajoutée',
      question: 'Avez-vous ajouté une application web dans les paramètres ? (oui/non) : '
    },
    {
      name: 'Configuration copiée',
      question: 'Avez-vous copié la configuration Firebase (apiKey, authDomain, etc.) ? (oui/non) : '
    }
  ];

  let currentStep = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const answer = await question(step.question);
    
    if (answer.toLowerCase().includes('oui')) {
      console.log(`✅ ${step.name}`);
      currentStep = i + 1;
    } else {
      console.log(`❌ ${step.name}`);
      break;
    }
  }

  console.log('\n' + '='.repeat(60));
  
  if (currentStep === 0) {
    console.log('🎯 Vous êtes à l\'étape 1 : Créer un projet Firebase');
    console.log('📖 Consultez : FIREBASE_SETUP_STEPS.md');
    console.log('🌐 Allez sur : https://console.firebase.google.com/');
  } else if (currentStep === 1) {
    console.log('🎯 Vous êtes à l\'étape 2 : Activer Firestore Database');
    console.log('📖 Consultez : FIREBASE_SETUP_STEPS.md (section 2)');
  } else if (currentStep === 2) {
    console.log('🎯 Vous êtes à l\'étape 3 : Configurer Authentication');
    console.log('📖 Consultez : FIREBASE_SETUP_STEPS.md (section 3)');
  } else if (currentStep === 3) {
    console.log('🎯 Vous êtes à l\'étape 4.2 : Ajouter une application web');
    console.log('📖 Consultez : FIREBASE_VISUAL_GUIDE.md');
    console.log('💡 C\'est l\'étape où vous êtes bloqué !');
    
    const helpChoice = await question('\nVoulez-vous de l\'aide spécifique pour cette étape ? (oui/non) : ');
    if (helpChoice.toLowerCase().includes('oui')) {
      showSpecificHelp();
    }
  } else if (currentStep === 4) {
    console.log('🎯 Vous êtes à l\'étape 5 : Configurer l\'application');
    console.log('💡 Lancez : npm run setup-firebase');
  } else if (currentStep === 5) {
    console.log('🎯 Configuration terminée !');
    console.log('💡 Lancez : npm run setup-firebase');
  }
}

function showSpecificHelp() {
  console.log('\n🎯 AIDE SPÉCIFIQUE - Étape 4.2 : Ajouter une application web\n');
  
  console.log('📍 Navigation exacte :');
  console.log('1. Dans Firebase Console, cliquez sur l\'icône ⚙️ (en haut à droite)');
  console.log('2. Cliquez sur "Paramètres du projet"');
  console.log('3. Assurez-vous d\'être dans l\'onglet "Général"');
  console.log('4. Faites défiler JUSQU\'EN BAS de la page');
  console.log('5. Cherchez la section "Vos applications"');
  console.log('6. Cliquez sur l\'icône </> (première icône)');
  
  console.log('\n🔍 Si vous ne voyez pas "Vos applications" :');
  console.log('- Vous êtes peut-être dans le mauvais onglet');
  console.log('- Faites défiler plus bas, c\'est tout en bas de la page');
  console.log('- Rafraîchissez la page (F5)');
  
  console.log('\n📖 Consultez le guide visuel : FIREBASE_VISUAL_GUIDE.md');
  console.log('🌐 Console Firebase : https://console.firebase.google.com/');
}

function showGuides() {
  console.log('\n📚 GUIDES DISPONIBLES :\n');
  console.log('📄 FIREBASE_SETUP_STEPS.md - Guide complet étape par étape');
  console.log('🎨 FIREBASE_VISUAL_GUIDE.md - Guide visuel avec navigation');
  console.log('🚀 VERCEL_DEPLOYMENT.md - Guide de déploiement Vercel');
  console.log('📖 README.md - Documentation générale');
  
  console.log('\n💡 Pour ouvrir un fichier :');
  console.log('macOS : open FIREBASE_SETUP_STEPS.md');
  console.log('Windows : notepad FIREBASE_SETUP_STEPS.md');
  console.log('Linux : xdg-open FIREBASE_SETUP_STEPS.md');
}

// Gestion de l'interruption
process.on('SIGINT', () => {
  console.log('\n👋 Au revoir !');
  rl.close();
  process.exit(0);
});

// Lancer le diagnostic
main().catch(console.error); 