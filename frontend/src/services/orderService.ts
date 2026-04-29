import api from './api';

export const orderService = {
  create: async (orderData: {
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
      personnalisation?: string;
    }>;
    instructions?: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

