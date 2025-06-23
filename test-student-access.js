// Script pour tester l'accès à l'interface élève
console.log('🚀 Test d\'accès à l\'interface élève...');

// Simuler un utilisateur élève
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

console.log('👤 Utilisateur élève créé:', tempStudent);
console.log('📋 Copie ce JSON dans le localStorage de ton navigateur:');
console.log(JSON.stringify(tempStudent, null, 2));

console.log('\n📝 Instructions:');
console.log('1. Ouvre http://localhost:5174 dans ton navigateur');
console.log('2. Appuie sur F12 pour ouvrir les outils de développement');
console.log('3. Va dans l\'onglet "Console"');
console.log('4. Copie et colle cette commande:');
console.log(`localStorage.setItem('tempStudent', '${JSON.stringify(tempStudent)}');`);
console.log('5. Recharge la page (F5)');
console.log('6. Tu devrais être redirigé vers l\'interface élève');

console.log('\n🔗 Ou va directement sur: http://localhost:5174/student'); 