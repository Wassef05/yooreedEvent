import api from './api';

export const eventServiceApi = {
  listPublic: async () => {
    const res = await api.get('/event-services');
    return res.data;
  },
  listAdmin: async () => {
    const res = await api.get('/event-services/all');
    return res.data;
  },
  create: async (payload: any) => {
    const res = await api.post('/event-services', payload);
    return res.data;
  },
  update: async (id: string, payload: any) => {
    const res = await api.put(`/event-services/${id}`, payload);
    return res.data;
  },
  remove: async (id: string) => {
    const res = await api.delete(`/event-services/${id}`);
    return res.data;
  },
};

