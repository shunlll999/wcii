import { PRESETS_MOCK, PRESETS_MOCK_EXTRA, PRESETS_MOCK_FORM } from '@Shared/constants';
import { ComponentsResponseType, CSSResponseType, PresetResponseType } from '@Shared/types';
import { api, AxiosError } from '../api';
import { WCI_TEMPLATE_CODE, WCI_TEMPLATE_STYLE_CODE } from '@Shared/constants/template/wciTemplate';
import { toPascalCase } from '@Shared/utils/allCapital';

export const getPresets = async (): Promise<PresetResponseType> => {
    const navigation: PresetResponseType = { data: {
      basic: { seq: 1, data: PRESETS_MOCK },
      form: { seq: 2, data: PRESETS_MOCK_FORM },
      extra: { seq: 3, data: PRESETS_MOCK_EXTRA },
    }, type: 'presets' };

  return navigation;
};

export const getPresetByCode = async (code: string, id: number): Promise<ComponentsResponseType> => {
  try {
    const res = await api.get<ComponentsResponseType>(WCI_TEMPLATE_CODE(code)[code]);
    const text = res.data as unknown;
    const out = (text as string).replace(new RegExp(`<%componentName%>`, 'g'), toPascalCase(code));
    const response =  { id, template: out, code };
    return response;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return { id: 0, template: '', code: '', error: err.response?.data.error };
    }
    return { id: 0, template: '', code: '', error: err as string };
  }
}

export const getPresetStyleByCode = async (code: string): Promise<CSSResponseType> => {
  try {
    const res = await api.get<CSSResponseType>(WCI_TEMPLATE_STYLE_CODE(code)[code]);
    return { css: String(res.data) };
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return { css: '' , error: err.response?.data.error };
    }
    return { css: '', error: err as string };
  }
}
