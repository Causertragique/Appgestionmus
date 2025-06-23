// Script pour forcer l'accès propriétaire
import fs from 'fs';

console.log('🔨 Force l\'accès propriétaire...');

// Créer un script qui force l'accès
const forceScript = `
// Script pour forcer l'accès propriétaire
console.log('🔨 Force l\'accès propriétaire...');

// 1. Nettoyer complètement
localStorage.clear();
sessionStorage.clear();

// 2. Créer un utilisateur propriétaire avec toutes les propriétés
const ownerUser = {
  id: 'owner-force-123',
  firstName: 'Propriétaire',
  lastName: 'Application',
  email: 'proprietaire@musique.com',
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
  preferences: {}
};

// 3. Stocker dans localStorage
localStorage.setItem('tempOwner', JSON.stringify(ownerUser));

// 4. Vérifier que c'est bien stocké
const stored = localStorage.getItem('tempOwner');
console.log('Utilisateur stocké:', stored ? '✅' : '❌');

if (stored) {
  try {
    const parsed = JSON.parse(stored);
    console.log('Rôle détecté:', parsed.role);
    console.log('Nom:', parsed.firstName, parsed.lastName);
  } catch (e) {
    console.error('Erreur parsing:', e);
  }
}

// 5. Forcer le rechargement complet
console.log('🔄 Rechargement forcé...');
window.location.href = 'http://localhost:5174/teacher';

// 6. Si ça ne fonctionne pas après 3 secondes, essayer une autre approche
setTimeout(() => {
  console.log('⏰ Tentative alternative...');
  // Essayer de forcer l'état utilisateur
  if (window.location.pathname !== '/teacher') {
    console.log('Redirection manuelle...');
    window.location.replace('http://localhost:5174/teacher');
  }
}, 3000);
`;

// Créer le fichier HTML avec le script intégré
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Force Accès Propriétaire</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white; 
            padding: 20px 40px; 
            border: none; 
            border-radius: 10px; 
            cursor: pointer; 
            margin: 10px; 
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
        }
        h1 { color: #ff6b6b; margin-bottom: 30px; }
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
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔨 Force Accès Propriétaire</h1>
        
        <div class="warning">
            <strong>⚠️ Attention :</strong> Cette méthode force l'accès propriétaire en contournant les vérifications normales.
        </div>
        
        <div id="status" class="status">
            Prêt à forcer l'accès propriétaire
        </div>
        
        <button class="button" onclick="forceOwnerAccess()">
            🔨 FORCER L'ACCÈS PROPRIÉTAIRE
        </button>
        
        <button class="button" onclick="checkAndFix()" style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%);">
            🔍 Vérifier et Corriger
        </button>
        
        <div class="code" id="codeDisplay" style="display: none;">
            <strong>Code de secours :</strong><br><br>
            <span id="codeContent"></span>
        </div>
        
        <div style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Si ça ne fonctionne toujours pas :</strong><br>
            1. Vérifiez que le serveur fonctionne sur http://localhost:5174<br>
            2. Videz le cache du navigateur (Ctrl+Shift+R)<br>
            3. Essayez en navigation privée<br>
            4. Vérifiez la console pour les erreurs
        </div>
    </div>
    
    <script>
        function updateStatus(message) {
            const status = document.getElementById('status');
            status.textContent = message;
        }
        
        function forceOwnerAccess() {
            updateStatus('🔨 Force l\'accès propriétaire...');
            
            // Nettoyer complètement
            localStorage.clear();
            sessionStorage.clear();
            
            setTimeout(() => {
                // Créer un utilisateur propriétaire avec toutes les propriétés
                const ownerUser = {
                    id: 'owner-force-123',
                    firstName: 'Propriétaire',
                    lastName: 'Application',
                    email: 'proprietaire@musique.com',
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
                    preferences: {}
                };
                
                // Stocker dans localStorage
                localStorage.setItem('tempOwner', JSON.stringify(ownerUser));
                updateStatus('✅ Utilisateur propriétaire créé !');
                
                setTimeout(() => {
                    updateStatus('🔄 Redirection forcée...');
                    // Forcer le rechargement complet
                    window.location.href = 'http://localhost:5174/teacher';
                }, 1000);
            }, 500);
        }
        
        function checkAndFix() {
            updateStatus('🔍 Vérification en cours...');
            
            const owner = localStorage.getItem('tempOwner');
            if (owner) {
                try {
                    const user = JSON.parse(owner);
                    updateStatus(\`✅ Propriétaire détecté : \${user.firstName} \${user.lastName} (\${user.role})\`);
                    
                    if (user.role !== 'owner') {
                        updateStatus('❌ Rôle incorrect, correction...');
                        user.role = 'owner';
                        localStorage.setItem('tempOwner', JSON.stringify(user));
                        setTimeout(() => {
                            window.location.href = 'http://localhost:5174/teacher';
                        }, 1000);
                    }
                } catch (e) {
                    updateStatus('❌ Données corrompues, nettoyage...');
                    localStorage.removeItem('tempOwner');
                    setTimeout(forceOwnerAccess, 1000);
                }
            } else {
                updateStatus('❌ Aucun propriétaire trouvé, création...');
                setTimeout(forceOwnerAccess, 1000);
            }
        }
        
        // Vérifier l'état au chargement
        window.onload = function() {
            const owner = localStorage.getItem('tempOwner');
            if (owner) {
                try {
                    const user = JSON.parse(owner);
                    updateStatus(\`✅ Propriétaire déjà présent : \${user.firstName} \${user.lastName}\`);
                } catch (e) {
                    updateStatus('❌ Données propriétaire corrompues');
                }
            } else {
                updateStatus('❌ Aucun propriétaire détecté');
            }
        };
    </script>
</body>
</html>
`;

// Écrire le fichier HTML
fs.writeFileSync('force-owner-access.html', htmlContent);

console.log('📄 Fichier de force créé: force-owner-access.html');
console.log('🔨 Ouvre ce fichier et clique sur "FORCER L\'ACCÈS PROPRIÉTAIRE"');
console.log('💡 Cette méthode contourne toutes les vérifications pour forcer l\'accès'); 