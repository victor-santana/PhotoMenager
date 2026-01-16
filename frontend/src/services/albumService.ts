import api from './api';


export interface IAlbumData {
  title: string;
  description: string;
  user: string;
}

export const albumService = {
  criar: async (data: IAlbumData) => {
    return api.post('/album', data);
  },

  listarPorUsuario: async (userId: string, page: number = 1) => {
    return api.get(`/album/user/${userId}?page=${page}`);
  },

  buscarPorId: async (albumId: string) => {
    return api.get(`/album/${albumId}`);
  },

  atualizar: async (albumId: string, data: Partial<IAlbumData>) => {
    return api.put(`/album/${albumId}`, data);
  },

  deletar: async (albumId: string) => {
    return api.delete(`/album/${albumId}`);
  }
};