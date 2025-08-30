export const WCI_TEMPLATE_CODE = (code: string) => ({
  [code]: `/presets/${code}.template.wci`,
}) as Record<string, string>
