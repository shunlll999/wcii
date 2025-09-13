export const PAGE_URL = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  BUILDER: '/builder'
}

export const ROUTE_API = {
  NAVIGATION: '/api/navigation',
  PRESET_CODE: (code: string) => `/api/preset/${code}`,
  PRESET_STYLE_CODE: (code: string) => `/api/preset/style/${code}`
}

export const CHANNEL_NAME = {
  NAVIGATION: 'navigation_channel',
  PRESET: 'preset_channel',
  COMPONENT: 'component_channel',
  PAGE: 'page_channel',
  INSPECTOR: 'inspector_channel'
}
