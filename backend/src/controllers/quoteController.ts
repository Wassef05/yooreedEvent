import { Request, Response, NextFunction } from 'express';
import { Quote } from '../models/Quote.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendEmail } from '../config/email.js';

export const createQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('📝 Création de devis - Données reçues:', JSON.stringify(req.body, null, 2));
    
    const { client, produits, notes } = req.body;

    // Validation des données
    if (!client) {
      throw new AppError('Les informations client sont requises', 400);
    }

    if (!client.nom || !client.email || !client.telephone || !client.adresse) {
      throw new AppError('Tous les champs client sont requis (nom, email, téléphone, adresse)', 400);
    }

    if (!produits || !Array.isArray(produits) || produits.length === 0) {
      throw new AppError('Au moins un produit ou un libellé personnalisé est requis', 400);
    }

    console.log('✅ Validation des données client OK');

    // Vérifier que les produits existent
    const quoteProducts = [];

    for (const item of produits) {
      const quantite = item.quantite || 1;
      const besoinsSpecifiques = item.besoinsSpecifiques || '';

      if (item.produitId) {
        console.log(`🔍 Recherche du produit: ${item.produitId}`);
        const product = await Product.findById(item.produitId);

        if (!product) {
          throw new AppError(`Produit ${item.produitId} non trouvé`, 404);
        }

        console.log(`✅ Produit trouvé: ${product.nom}`);

        quoteProducts.push({
          produitId: product._id,
          quantite,
          besoinsSpecifiques,
        });
      } else if (item.libelleCustom) {
        console.log(`📝 Produit personnalisé: ${item.libelleCustom}`);
        quoteProducts.push({
          libelleCustom: item.libelleCustom,
          quantite,
          besoinsSpecifiques,
        });
      } else {
        throw new AppError('Chaque produit doit avoir un produitId ou un libelleCustom', 400);
      }
    }

    console.log('📦 Création de l\'objet Quote...');
    const quote = new Quote({
      client,
      produits: quoteProducts,
      notes: notes || '',
    });

    console.log('💾 Sauvegarde du devis...');
    await quote.save();
    console.log(`✅ Devis sauvegardé avec succès: ${quote.numeroDevis}`);
    
    await quote.populate('produits.produitId', 'nom images prix');
    console.log('✅ Produits populés');

    // Envoyer email de confirmation au client (optionnel, ne bloque pas la création)
    try {
      // Vérifier que les credentials email sont configurés
      if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const emailHtml = `
          <h2>Demande de devis reçue</h2>
          <p>Bonjour ${client.nom},</p>
          <p>Votre demande de devis <strong>${quote.numeroDevis}</strong> a été enregistrée avec succès.</p>
          <p>Nous vous contacterons sous peu avec un devis détaillé.</p>
        `;
        await sendEmail(
          client.email,
          'Demande de devis - Yooreed Event',
          emailHtml
        );
        console.log(`✅ Email de confirmation envoyé à ${client.email}`);
      } else {
        console.log('⚠️ Configuration email non complète, email non envoyé');
      }
    } catch (emailError: any) {
      // L'erreur d'email ne doit pas empêcher la création du devis
      console.error('⚠️ Erreur envoi email (non bloquant):', emailError?.message || emailError);
    }

    res.status(201).json({
      success: true,
      data: { quote },
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la création du devis:', error);
    console.error('❌ Stack:', error?.stack);
    console.error('❌ Message:', error?.message);
    
    // Si c'est une erreur Mongoose de validation
    if (error?.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map((err: any) => err.message).join(', ');
      return next(new AppError(`Erreur de validation: ${messages}`, 400));
    }
    
    // Si c'est une erreur Mongoose de cast
    if (error?.name === 'CastError') {
      return next(new AppError(`ID invalide: ${error.message}`, 400));
    }
    
    next(error);
  }
};

export const getQuotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '20',
      statut,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (statut) {
      query.statut = statut;
    }

    const sortOptions: any = {};
    sortOptions[sort as string] = order === 'asc' ? 1 : -1;

    const quotes = await Quote.find(query)
      .populate('produits.produitId', 'nom images prix')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Quote.countDocuments(query);

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id).populate(
      'produits.produitId',
      'nom images prix description'
    );

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    res.json({
      success: true,
      data: { quote },
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuoteStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { statut, notes } = req.body;

    const validStatuses = ['en_cours', 'traite'];
    if (!validStatuses.includes(statut)) {
      throw new AppError('Statut invalide', 400);
    }

    const updateData: any = { statut };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const quote = await Quote.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('produits.produitId', 'nom images prix');

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    res.json({
      success: true,
      data: { quote },
    });
  } catch (error) {
    next(error);
  }
};

