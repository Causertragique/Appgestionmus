// Script pour tester l'accès propriétaire
import fs from 'fs';

console.log('👑 Test d\'accès propriétaire...');

// Code d'accès propriétaire actuel
const OWNER_ACCESS_CODE = '1473AA';

// Créer un utilisateur propriétaire
const ownerUser = {
  id: 'owner-permanent-123',
  firstName: 'Propriétaire',
  lastName: 'Application',
  email: 'proprietaire@musique.com',
  role: 'owner',
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
    <title>Test Accès Propriétaire</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 5px; }
        .code { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
        .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
        .success { border-left-color: #28a745; }
        .warning { border-left-color: #ffc107; }
        .error { border-left-color: #dc3545; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>👑 Test Accès Propriétaire</h1>
        
        <div class="step">
            <h3>Code d'accès actuel</h3>
            <div class="code">${OWNER_ACCESS_CODE}</div>
            <p><strong>Important :</strong> Ce code est sensible à la casse. Utilisez exactement : ${OWNER_ACCESS_CODE}</p>
        </div>
        
        <div class="step">
            <h3>Test du code d'accès</h3>
            <input type="text" id="testCode" placeholder="Entrez le code d'accès" maxlength="6" style="text-transform: uppercase;">
            <button class="button" onclick="testCode()">🧪 Tester le code</button>
            <div id="testResult"></div>
        </div>
        
        <div class="step success">
            <h3>Accès direct propriétaire</h3>
            <p>Clique sur ce bouton pour accéder directement en mode propriétaire :</p>
            <button class="button" onclick="createOwner()">👑 Accès Propriétaire Direct</button>
        </div>
        
        <div class="step warning">
            <h3>Méthodes d'accès</h3>
            <ul>
                <li><strong>Code :</strong> ${OWNER_ACCESS_CODE}</li>
                <li><strong>Raccourci clavier :</strong> Ctrl+Shift+O</li>
                <li><strong>URL directe :</strong> <a href="http://localhost:5174/owner" target="_blank">http://localhost:5174/owner</a></li>
                <li><strong>Bouton discret :</strong> En haut à droite de la page de connexion</li>
            </ul>
        </div>
        
        <div class="step">
            <h3>Code manuel (si nécessaire)</h3>
            <p>Si rien ne fonctionne, copie ce code dans la console (F12) :</p>
            <div class="code">
localStorage.setItem('tempOwner', '${JSON.stringify(ownerUser)}');
window.location.href = 'http://localhost:5174/teacher';
            </div>
        </div>
        
        <div class="step error">
            <h3>Dépannage</h3>
            <p>Si le code ne fonctionne pas :</p>
            <ol>
                <li>Vérifiez que vous tapez exactement : <strong>${OWNER_ACCESS_CODE}</strong></li>
                <li>Assurez-vous que le serveur fonctionne sur http://localhost:5174</li>
                <li>Videz le cache du navigateur (Ctrl+Shift+R)</li>
                <li>Utilisez le bouton "Accès Propriétaire Direct" ci-dessus</li>
            </ol>
        </div>
    </div>
    
    <script>
        function testCode() {
            const input = document.getElementById('testCode');
            const result = document.getElementById('testResult');
            const code = input.value.toUpperCase();
            
            if (code === '${OWNER_ACCESS_CODE}') {
                result.innerHTML = '<div style="color: green; margin-top: 10px;">✅ Code correct !</div>';
                setTimeout(() => {
                    createOwner();
                }, 1000);
            } else {
                result.innerHTML = '<div style="color: red; margin-top: 10px;">❌ Code incorrect. Essayez : ${OWNER_ACCESS_CODE}</div>';
            }
        }
        
        function createOwner() {
            const ownerUser = ${JSON.stringify(ownerUser)};
            localStorage.setItem('tempOwner', JSON.stringify(ownerUser));
            alert('✅ Utilisateur propriétaire créé ! Redirection...');
            window.location.href = 'http://localhost:5174/teacher';
        }
        
        // Auto-uppercase pour l'input
        document.getElementById('testCode').addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    </script>
</body>
</html>
`;

// Écrire le fichier HTML
fs.writeFileSync('test-owner.html', htmlContent);

console.log('📄 Fichier de test créé: test-owner.html');
console.log('🔑 Code d\'accès propriétaire: ' + OWNER_ACCESS_CODE);
console.log('🌐 Ouvre test-owner.html dans ton navigateur pour tester');
console.log('💡 Ou va directement sur: http://localhost:5174/owner'); 