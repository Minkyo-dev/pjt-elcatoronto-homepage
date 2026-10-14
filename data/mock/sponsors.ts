import type {SponsorDoc} from '@/types/misc';

const names = ['Aster & Co.', 'Lumen Labs', 'Cedar Trust', 'Bluepine Group', 'Orchard Foundation', 'Northstar Partners'];

export const sponsors: SponsorDoc[] = names.map((name, index): SponsorDoc => ({
  _id: `sponsor.${index + 1}`,
  _type: 'sponsor',
  isSample: true,
  order: index + 1,
  name,
}));
