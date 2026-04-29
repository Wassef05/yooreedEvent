import { Admin } from '../models/Admin.js';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const NEW_PASSWORD = 'Admin@2025'; // ← Changez ce mot de passe si vous voulez

const resetAdminPassword = async () => {
  try {
    await connectDB();
    console.log('✅ Connecté à MongoDB');

    const admin = await Admin.findOne({ username: 'admin' });

    if (!admin) {
      console.error('❌ Aucun admin trouvé avec le username "admin"');
      process.exit(1);
    }

    console.log(`📧 Admin trouvé: ${admin.username} (${admin.email})`);

    // Mettre à jour le mot de passe (sera hashé automatiquement par le pre-save hook)
    admin.passwordHash = NEW_PASSWORD;
    await admin.save();

    console.log('✅ Mot de passe réinitialisé avec succès !');
    console.log('📧 Username: admin');
    console.log(`🔑 Nouveau mot de passe: ${NEW_PASSWORD}`);
    console.log('⚠️  Changez le mot de passe après connexion !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du reset:', error);
    process.exit(1);
  }
};

resetAdminPassword();
