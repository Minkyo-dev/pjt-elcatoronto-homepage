import type {SiteSettingsDoc} from '@/types/pages';

export const siteSettings: SiteSettingsDoc = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  orgName: 'ELCA',
  // The official Korean name is unconfirmed, so both locales use the English name.
  orgFullName: {en: 'Entrepreneurial Leadership Canada', ko: 'Entrepreneurial Leadership Canada (ELCA)'},
  description: {
    en: 'Connecting people through mentorship, leadership, and community.',
    ko: '멘토십과 리더십, 그리고 커뮤니티로 사람을 잇습니다.',
  },
  contact: {
    needsReview: true,
    email: 'info@elcatoronto.com',
    location: {en: 'Toronto, Ontario, Canada', ko: '캐나다 온타리오주 토론토'},
  },
  social: {
    needsReview: true,
    facebook: 'https://www.facebook.com/elcatoronto',
    linkedin: 'https://www.linkedin.com/company/elcatoronto',
  },
  preFooterCta: {
    title: {en: 'Grow with a community that shows up for you', ko: '함께 성장하는 커뮤니티에 합류하세요'},
    body: {
      en: 'Find a mentor, share what you know, or help the next cohort get started.',
      ko: '멘토를 만나고, 경험을 나누고, 다음 기수의 시작을 응원해 주세요.',
    },
    ctas: [
      {label: {en: 'Explore Mentorship', ko: '멘토십 알아보기'}, href: '/get-involved/mentorship'},
      {label: {en: 'Donate', ko: '후원하기'}, href: '/get-involved/donate'},
    ],
  },
  newsletter: {
    title: {en: 'Stay in the loop', ko: '소식 받아보기'},
    body: {en: 'Program updates, events, and stories from our community.', ko: '프로그램 소식과 행사, 커뮤니티 이야기를 전해 드려요.'},
  },
};
