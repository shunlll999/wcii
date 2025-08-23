import axios, { AxiosInstance } from "axios";

type Maybe<T> = T | null | undefined;

const SERVER_DEFAAULT = {
  DEV_PORT: Number(process.env.NEXT_PUBLIC_PORT) || 3000,
  PRODUCT_FALLBACK: 'https://api.wcii.dev'
}

function pick<T extends string>(...vals: Maybe<T>[]) {
  return vals.find(Boolean);
}

function normalizeBase(url: string) {
  // เอา slash ท้ายออก (ถ้ามี) เพื่อกัน '//' เวลาต่อ path
  return url.replace(/\/+$/, '');
}

export function resolveBaseURL(): string {
  if (typeof window !== 'undefined') return '';
  const fromEnv = pick(
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.BASE_URL,
    `http://localhost:${process.env.PORT}`
  );

  if (fromEnv) return normalizeBase(fromEnv);
  if (process.env.NODE_ENV === 'production') return normalizeBase(SERVER_DEFAAULT.PRODUCT_FALLBACK);

  return `http://localhost:${SERVER_DEFAAULT.DEV_PORT}`;
}

export const api: AxiosInstance = axios.create({
  baseURL: resolveBaseURL(),
});

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
