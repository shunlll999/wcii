import { ROUTE_API } from '@Shared/constants';
import { ComponentsResponseType, PresetResponseType } from '@Shared/types';
import { api, AxiosError } from './api';

export const getPresets = async (): Promise<PresetResponseType> => {
  const res = await api.get<PresetResponseType>(ROUTE_API.NAVIGATION, { params: { type: 'presets' } });
  if (res.statusText !== 'OK')
    return { data: { basic: { seq: 1, data: [] }, form: { seq: 2, data: [] }, extra: { seq: 3, data: [] } }, type: 'presets' };
  return res.data;
};

export const getPresetByCode = async (code: string, id: number): Promise<ComponentsResponseType> => {
  try {
    const res = await api.get<ComponentsResponseType>(ROUTE_API.PRESET_CODE(code), { params: { id } });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return { id: 0, template: '', code: '', error: err.response?.data.error };
    }
    return { id: 0, template: '', code: '', error: err as string };
  }
}
