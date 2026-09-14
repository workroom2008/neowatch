import { useI18n } from './i18n';

// Locale-aware display names for catalog metadata (countries / languages),
// which the server only provides in English. Uses Intl.DisplayNames('zh-Hans')
// so no hardcoded country tables are needed; nonstandard codes get overrides.

// iptv-org uses codes that are not ISO 3166-1 alpha-2 (Intl cannot resolve them).
const COUNTRY_OVERRIDES: Record<string, string> = {
  UK: '英国',
  CS: '塞尔维亚和黑山',
  SU: '苏联',
  AN: '荷属安的列斯',
};

let regionDN: Intl.DisplayNames | null = null;
let langDN: Intl.DisplayNames | null = null;

const isZh = () => useI18n.getState().lang === 'zh';

export function zhCountry(code: string | null | undefined): string | null {
  if (!isZh() || !code) return null;
  const c = code.toUpperCase();
  if (COUNTRY_OVERRIDES[c]) return COUNTRY_OVERRIDES[c];
  try {
    regionDN ??= new Intl.DisplayNames(['zh-Hans'], { type: 'region' });
    const n = regionDN.of(c);
    return n && n !== c ? n : null;
  } catch {
    return null;
  }
}

export function zhLang(code: string | null | undefined): string | null {
  if (!isZh() || !code) return null;
  try {
    langDN ??= new Intl.DisplayNames(['zh-Hans'], { type: 'language' });
    const n = langDN.of(code.toLowerCase());
    return n && n !== code ? n : null;
  } catch {
    return null;
  }
}

// Best available zh display name: intl translation first, then the server
// (English) name, then the raw code.
export function countryLabelOf(code: string | null | undefined, enName: string | null | undefined): string {
  return zhCountry(code) || enName || code || '';
}

export function langLabelOf(code: string | null | undefined, enName: string | null | undefined): string {
  return zhLang(code) || enName || code || '';
}
