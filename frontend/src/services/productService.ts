import api from './api';

export const productService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sousCategorie?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (category: string, sousCategorie?: string) => {
    const params = sousCategorie ? { sousCategorie } : {};
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },
};

