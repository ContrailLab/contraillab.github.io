export interface Partner {
  id: string;
  name: string;
  logo: string;
  logoFallback: string;
  url: string;
}

export interface PartnersData {
  partners: Partner[];
}

let cachedPartners: PartnersData | null = null;

export async function loadPartners(): Promise<PartnersData> {
  if (cachedPartners) return cachedPartners;
  const res = await fetch('/config/partners.json');
  const data = await res.json() as PartnersData;
  cachedPartners = data;
  return data;
}
