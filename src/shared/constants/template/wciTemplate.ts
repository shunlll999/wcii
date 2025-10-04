export const WCI_TEMPLATE_CODE = (code: string) => ({
  [code]: `/presets/${code}.template.wci`,
}) as Record<string, string>


export const WCI_TEMPLATE_STYLE_CODE = (code: string) => ({
  [code]: `/assets/css/${code}/index.css`,
}) as Record<string, string>
