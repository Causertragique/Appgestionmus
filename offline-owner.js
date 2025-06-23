// Script pour forcer l'accès propriétaire en mode hors ligne
import fs from 'fs';

console.log('📴 Mode hors ligne - Accès propriétaire...');

// Créer un script qui contourne Firebase
const offlineScript = `
// Script pour forcer l'accès propriétaire en mode hors ligne
console.log('📴 Mode hors ligne - Accès propriétaire...');

// 1. Nettoyer complètement
localStorage.clear();
sessionStorage.clear();

// 2. Créer un utilisateur propriétaire complet
const ownerUser = {
  id: 'owner-offline-123',
  firstName: 'Propriétaire',
  lastName: 'Hors Ligne',
  email: 'proprietaire.offline@musique.com',
  role: 'owner',
  subscriptionStatus: 'active',
  isActive: true,
  createdAt: new Date().toISOString(),
  picture: null,
  groups: [],
  settings: {},
  lastLogin: new Date().toISOString(),
  instrument: null,
  teacherId: null,
  preferences: {},
  offline: true
};

// 3. Stocker dans localStorage
localStorage.setItem('tempOwner', JSON.stringify(ownerUser));

// 4. Vérifier
const stored = localStorage.getItem('tempOwner');
console.log('Utilisateur stocké:', stored ? '✅' : '❌');

// 5. Forcer la redirection
console.log('🔄 Redirection vers /teacher...');
window.location.href = 'http://localhost:5174/teacher';

// 6. Si ça ne fonctionne pas, essayer de forcer le rechargement
setTimeout(() => {
  if (window.location.pathname !== '/teacher') {
    console.log('⏰ Tentative de rechargement forcé...');
    window.location.replace('http://localhost:5174/teacher');
  }
}, 2000);
`;

// Créer le fichier HTML
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Mode Hors Ligne - Accès Propriétaire</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            max-width: 600px; 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
        }
        .button { 
            background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
            color: white; 
            padding: 20px 40px; 
            border: none; 
            border-radius: 10px; 
            cursor: pointer; 
            margin: 10px; 
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
        }
        h1 { color: #00b894; margin-bottom: 30px; }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .code {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            margin: 15px 0;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📴 Mode Hors Ligne</h1>
        
        <div class="warning">
            <strong>⚠️ Problème Firebase détecté :</strong><br>
            Les erreurs Firebase empêchent le chargement normal.<br>
            Cette méthode contourne Firebase pour forcer l'accès.
        </div>
        
        <div id="status" class="status">
            Prêt à forcer l'accès propriétaire en mode hors ligne
        </div>
        
        <button class="button" onclick="forceOfflineAccess()">
            📴 FORCER ACCÈS HORS LIGNE
        </button>
        
        <button class="button" onclick="checkFirebaseStatus()" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);">
            🔍 Vérifier Firebase
        </button>
        
        <div class="code" id="codeDisplay" style="display: none;">
            <strong>Code de secours :</strong><br><br>
            <span id="codeContent"></span>
        </div>
        
        <div style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Si le problème persiste :</strong><br>
            1. Désactive les extensions (uBlock, AdBlock, etc.)<br>
            2. Essaie en navigation privée<br>
            3. Vérifie ta connexion internet<br>
            4. Contacte le support si nécessaire
        </div>
    </div>
    
    <script>
        function updateStatus(message, type = 'info') {
            const status = document.getElementById('status');
            status.textContent = message;
        }
        
        function forceOfflineAccess() {
            updateStatus('📴 Mode hors ligne - Accès propriétaire...');
            
            try {
                // Nettoyer complètement
                localStorage.clear();
                sessionStorage.clear();
                
                setTimeout(() => {
                    // Créer un utilisateur propriétaire complet
                    const ownerUser = {
                        id: 'owner-offline-123',
                        firstName: 'Propriétaire',
                        lastName: 'Hors Ligne',
                        email: 'proprietaire.offline@musique.com',
                        role: 'owner',
                        subscriptionStatus: 'active',
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        picture: null,
                        groups: [],
                        settings: {},
                        lastLogin: new Date().toISOString(),
                        instrument: null,
                        teacherId: null,
                        preferences: {},
                        offline: true
                    };
                    
                    // Stocker dans localStorage
                    localStorage.setItem('tempOwner', JSON.stringify(ownerUser));
                    updateStatus('✅ Utilisateur propriétaire créé (hors ligne) !');
                    
                    setTimeout(() => {
                        updateStatus('🔄 Redirection vers /teacher...');
                        window.location.href = 'http://localhost:5174/teacher';
                    }, 1000);
                }, 500);
                
            } catch (error) {
                updateStatus('❌ Erreur : ' + error.message);
                showManualCode();
            }
        }
        
        function checkFirebaseStatus() {
            updateStatus('🔍 Vérification Firebase...');
            
            // Vérifier si Firebase est accessible
            fetch('https://firestore.googleapis.com', { mode: 'no-cors' })
                .then(() => {
                    updateStatus('✅ Firebase accessible');
                })
                .catch(() => {
                    updateStatus('❌ Firebase bloqué - Utilise le mode hors ligne');
                });
        }
        
        function showManualCode() {
            const codeDisplay = document.getElementById('codeDisplay');
            const codeContent = document.getElementById('codeContent');
            
            const manualCode = \`// Mode hors ligne - Accès propriétaire
localStorage.clear();
const ownerUser = ${JSON.stringify({
                id: 'owner-offline-123',
                firstName: 'Propriétaire',
                lastName: 'Hors Ligne',
                email: 'proprietaire.offline@musique.com',
                role: 'owner',
                subscriptionStatus: 'active',
                isActive: true,
                createdAt: new Date().toISOString(),
                picture: null,
                groups: [],
                settings: {},
                lastLogin: new Date().toISOString(),
                instrument: null,
                teacherId: null,
                preferences: {},
                offline: true
            })};
localStorage.setItem('tempOwner', JSON.stringify(ownerUser));
window.location.href = 'http://localhost:5174/teacher';\`;
            
            codeContent.textContent = manualCode;
            codeDisplay.style.display = 'block';
        }
        
        // Vérifier l'état au chargement
        window.onload = function() {
            checkFirebaseStatus();
        };
    </script>
</body>
</html>
`;

// Écrire le fichier HTML
fs.writeFileSync('offline-owner.html', htmlContent);

console.log('📄 Fichier mode hors ligne créé: offline-owner.html');
console.log('📴 Ouvre ce fichier pour forcer l\'accès propriétaire sans Firebase');
console.log('💡 Cette méthode contourne les problèmes de connexion Firebase'); 