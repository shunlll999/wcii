import { ROUTE_API } from '@Shared/constants';
import { PresetResponseType } from '@Shared/types';
import { api } from './api';

export const getPresets = async (): Promise<PresetResponseType> => {
  const res = await api.get<PresetResponseType>(ROUTE_API.NAVIGATION, { params: { type: 'presets' } });
  if (res.statusText !== 'OK')
    return { data: { basic: { seq: 1, data: [] }, form: { seq: 2, data: [] }, extra: { seq: 3, data: [] } }, type: 'presets' } as PresetResponseType;
  return res.data as PresetResponseType;
};
