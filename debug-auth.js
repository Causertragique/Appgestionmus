// Script pour déboguer le contexte d'authentification
import fs from 'fs';

console.log('🐛 Débogage du contexte d\'authentification...');

// Créer un script de débogage
const debugScript = `
// Script de débogage pour le contexte d'authentification
console.log('🐛 Débogage du contexte d\'authentification...');

// 1. Vérifier le localStorage
console.log('📋 Contenu localStorage:');
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('temp')) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            console.log(\`\${key}:\`, value);
        } catch (e) {
            console.log(\`\${key}:\`, localStorage.getItem(key));
        }
    }
});

// 2. Vérifier si l'utilisateur est détecté par l'app
console.log('🔍 Vérification de l\'état utilisateur dans l\'app...');

// Attendre que l'app se charge
setTimeout(() => {
    // Essayer d'accéder au contexte d'authentification
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('✅ React DevTools détecté');
    }
    
    // Vérifier les éléments de l'interface
    const userElements = document.querySelectorAll('[data-user], [class*="user"], [class*="owner"]');
    console.log('👤 Éléments utilisateur trouvés:', userElements.length);
    
    // Vérifier si on est sur la bonne page
    console.log('📍 URL actuelle:', window.location.href);
    console.log('📄 Titre de la page:', document.title);
    
    // Vérifier les erreurs dans la console
    console.log('🚨 Vérifiez la console pour les erreurs JavaScript');
    
}, 2000);

// 3. Forcer la création d'un utilisateur propriétaire avec debug
console.log('🔧 Création d\'un utilisateur propriétaire avec debug...');

const debugOwnerUser = {
    id: 'owner-debug-123',
    firstName: 'Propriétaire',
    lastName: 'Debug',
    email: 'proprietaire.debug@musique.com',
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
    debug: true
};

// Nettoyer et créer
localStorage.clear();
localStorage.setItem('tempOwner', JSON.stringify(debugOwnerUser));

console.log('✅ Utilisateur propriétaire de debug créé');
console.log('🔄 Redirection vers /teacher...');

setTimeout(() => {
    window.location.href = 'http://localhost:5174/teacher';
}, 1000);
`;

// Créer le fichier HTML de débogage
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Débogage Authentification</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            max-width: 700px; 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .button { 
            background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 10px; 
            cursor: pointer; 
            margin: 10px; 
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .debug-log {
            background: #2d3436;
            color: #00b894;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            margin: 15px 0;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
        }
        h1 { color: #6c5ce7; margin-bottom: 30px; text-align: center; }
        .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐛 Débogage Authentification</h1>
        
        <div class="step">
            <h3>Étape 1: Vérifier l'état actuel</h3>
            <button class="button" onclick="checkCurrentState()">🔍 Vérifier l'état</button>
        </div>
        
        <div class="step">
            <h3>Étape 2: Créer un utilisateur de debug</h3>
            <button class="button" onclick="createDebugUser()">🔧 Créer utilisateur debug</button>
        </div>
        
        <div class="step">
            <h3>Étape 3: Forcer la redirection</h3>
            <button class="button" onclick="forceRedirect()">🚀 Forcer redirection</button>
        </div>
        
        <div class="step">
            <h3>Logs de débogage</h3>
            <div id="debugLog" class="debug-log">En attente...</div>
        </div>
        
        <div class="step">
            <h3>Code de débogage manuel</h3>
            <p>Copie ce code dans la console (F12) :</p>
            <div class="debug-log">${debugScript}</div>
        </div>
    </div>
    
    <script>
        function log(message) {
            const logElement = document.getElementById('debugLog');
            const timestamp = new Date().toLocaleTimeString();
            logElement.textContent += '[' + timestamp + '] ' + message + '\\n';
            logElement.scrollTop = logElement.scrollHeight;
            console.log(message);
        }
        
        function checkCurrentState() {
            log('🔍 Vérification de l\'état actuel...');
            
            // Vérifier localStorage
            const keys = Object.keys(localStorage);
            log('Clés localStorage: ' + keys.join(', '));
            
            keys.forEach(key => {
                if (key.startsWith('temp')) {
                    try {
                        const value = JSON.parse(localStorage.getItem(key));
                        log(\`\${key}: \${value.role} - \${value.firstName} \${value.lastName}\`);
                    } catch (e) {
                        log(\`\${key}: Erreur parsing\`);
                    }
                }
            });
            
            // Vérifier URL
            log('URL actuelle: ' + window.location.href);
            log('Titre: ' + document.title);
        }
        
        function createDebugUser() {
            log('🔧 Création utilisateur de debug...');
            
            const debugOwnerUser = {
                id: 'owner-debug-123',
                firstName: 'Propriétaire',
                lastName: 'Debug',
                email: 'proprietaire.debug@musique.com',
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
                debug: true
            };
            
            localStorage.clear();
            localStorage.setItem('tempOwner', JSON.stringify(debugOwnerUser));
            log('✅ Utilisateur de debug créé');
        }
        
        function forceRedirect() {
            log('🚀 Forçage de la redirection...');
            window.location.href = 'http://localhost:5174/teacher';
        }
        
        // Initialisation
        log('🐛 Débogage démarré');
        checkCurrentState();
    </script>
</body>
</html>
`;

// Écrire le fichier HTML
fs.writeFileSync('debug-auth.html', htmlContent);

console.log('📄 Fichier de débogage créé: debug-auth.html');
console.log('🐛 Ouvre ce fichier pour déboguer le problème d\'authentification');
console.log('💡 Utilise les boutons pour diagnostiquer étape par étape'); 