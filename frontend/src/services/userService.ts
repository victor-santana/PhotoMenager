import api from './api';

export const userService = {
  cadastrar: async (userData: any) => {
    const payload = {
      name: userData.nome,
      email: userData.email,
      password: userData.senha
    };

    return api.post('/user', payload);
  },

  logar: async (credentials: any) => {
    return api.post('/login', credentials);
  },

  buscarPorId: async (id: string) => {
    return api.get(`/user/${id}`);
  }
};