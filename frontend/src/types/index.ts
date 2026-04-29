// Types partagés pour le frontend

export interface Product {
  _id: string;
  nom: string;
  categorie: string;
  sousCategorie: string;
  description: string;
  descriptionTechnique: string;
  prix: number;
  images: string[];
  videos: string[];
  materiaux: string[];
  personnalisation: string[];
  recommandations: string[];
  stock: number;
  delaiLivraison: string;
  gravureLaser: boolean;
  resine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  nom: string;
  slug: string;
  description: string;
  parentId: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  personalization?: string;
}

export interface Order {
  _id: string;
  numeroCommande: string;
  client: {
    nom: string;
    societe: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  produits: Array<{
    produitId: string;
    quantite: number;
    prixUnitaire: number;
    personnalisation?: string;
  }>;
  total: number;
  statut: 'en_attente' | 'en_traitement' | 'expediee' | 'annulee';
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  _id: string;
  numeroDevis: string;
  client: {
    nom: string;
    societe: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  produits: Array<{
    produitId: string;
    quantite: number;
    besoinsSpecifiques: string;
  }>;
  statut: 'en_cours' | 'traite';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

