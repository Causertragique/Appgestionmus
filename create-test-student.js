// Script pour créer automatiquement un utilisateur élève
import fs from 'fs';

console.log('🚀 Création automatique d\'un utilisateur élève...');

// Données de l'utilisateur élève
const tempStudent = {
  id: 'demo-student-123',
  firstName: 'Élève',
  lastName: 'Demo',
  email: 'eleve.demo@test.com',
  role: 'student',
  instrument: 'Piano',
  subscriptionStatus: 'active',
  isActive: true,
  createdAt: new Date(),
  picture: null
};

// Créer le fichier HTML de test
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Interface Élève</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 5px; }
        .code { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
        .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
        .success { border-left-color: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 Test Interface Élève</h1>
        
        <div class="step">
            <h3>Étape 1: Créer l'utilisateur élève</h3>
            <p>Clique sur ce bouton pour créer automatiquement un utilisateur élève :</p>
            <button class="button" onclick="createStudent()">👤 Créer utilisateur élève</button>
        </div>
        
        <div class="step">
            <h3>Étape 2: Aller à l'interface élève</h3>
            <p>Clique sur ce bouton pour accéder directement à l'interface élève :</p>
            <button class="button" onclick="goToStudent()">🎵 Aller à l'interface élève</button>
        </div>
        
        <div class="step success">
            <h3>Étape 3: Vérifier</h3>
            <p>Tu devrais voir l'interface élève avec les onglets : Pratique, Devoirs, Chat, etc.</p>
        </div>
        
        <div class="step">
            <h3>Code manuel (si nécessaire)</h3>
            <p>Si les boutons ne fonctionnent pas, copie ce code dans la console (F12) :</p>
            <div class="code">
localStorage.setItem('tempStudent', '${JSON.stringify(tempStudent)}');
window.location.href = 'http://localhost:5174/student';
            </div>
        </div>
    </div>
    
    <script>
        function createStudent() {
            const tempStudent = ${JSON.stringify(tempStudent)};
            localStorage.setItem('tempStudent', JSON.stringify(tempStudent));
            alert('✅ Utilisateur élève créé !');
        }
        
        function goToStudent() {
            window.location.href = 'http://localhost:5174/student';
        }
    </script>
</body>
</html>
`;

// Écrire le fichier HTML
fs.writeFileSync('test-student.html', htmlContent);

console.log('📄 Fichier de test créé: test-student.html');
console.log('🌐 Ouvre ce fichier dans ton navigateur ou va directement sur : http://localhost:5174/student'); 