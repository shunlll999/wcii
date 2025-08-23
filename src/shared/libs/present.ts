import { ROUTE_API } from '@Shared/constants';
import { PresetResponseType } from '@Shared/types';
import axios from 'axios';

const serverBaseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || `http://localhost:${process.env.PORT}`) : 'http://localhost:3000';
const api = axios.create({
  baseURL: serverBaseUrl,
})

console.log('process.env', process.env);

export const getPresets = async (): Promise<PresetResponseType> => {
  const res = await api.get(ROUTE_API.NAVIGATION, {
    params: {
      type: 'presets',
    },
  });
  if (res.statusText !== 'OK')
    return { data: [], type: 'presets' } as PresetResponseType;
  return res.data as Promise<PresetResponseType>;
};
