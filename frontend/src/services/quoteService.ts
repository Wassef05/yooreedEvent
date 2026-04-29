import api from './api';

export const quoteService = {
  create: async (quoteData: {
    client: {
      nom: string;
      societe: string;
      email: string;
      telephone: string;
      adresse: string;
    };
    produits: Array<{
      produitId?: string;
      libelleCustom?: string;
      quantite?: number;
      besoinsSpecifiques?: string;
    }>;
    notes?: string;
  }) => {
    const response = await api.post('/quotes', quoteData);
    return response.data;
  },
};

