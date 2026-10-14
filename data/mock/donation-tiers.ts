import type {DonationTierDoc} from '@/types/misc';

const tier = (order: number, amount: number, impact: {en: string; ko: string}): DonationTierDoc => ({
  _id: `donationTier.${amount}`,
  _type: 'donationTier',
  isSample: true,
  order,
  amount,
  impact,
});

export const donationTiers: DonationTierDoc[] = [
  tier(1, 25, {en: 'Provides learning materials for one mentee workshop.', ko: '멘티 한 명의 워크숍 학습 자료를 마련합니다.'}),
  tier(2, 50, {en: 'Covers event costs for two mentees at a networking night.', ko: '네트워킹 행사에 참여하는 멘티 두 명의 비용을 지원합니다.'}),
  tier(3, 100, {en: 'Supports one month of program operations for a mentoring group.', ko: '멘토링 그룹 하나의 한 달 운영을 지원합니다.'}),
  tier(4, 250, {en: 'Contributes to a scholarship for an outstanding mentee.', ko: '우수 멘티 장학금에 보탬이 됩니다.'}),
];
