import api from './api';

export interface IPhotoData {
  title: string;
  description: string;
  acquisitionDate: string;
  size: number;
  predominantColor: string;
  imageUrl: string;
  albumId: string;
}

export const photoService = {
  criar: async (data: IPhotoData) => {
    return api.post('/photo', data);
  },

  listarPorAlbum: async (albumId: string, page: number = 1) => {
    return api.get(`/photo/album/${albumId}?page=${page}`);
  },

  buscarPorId: async (photoId: string) => {
    return api.get(`/photo/${photoId}`);
  },

  atualizar: async (photoId: string, data: Partial<IPhotoData>) => {
    return api.put(`/photo/${photoId}`, data);
  },

  deletar: async (photoId: string) => {
    return api.delete(`/photo/${photoId}`);
  }
};