import type {MentorsPageDoc} from '@/types/pages';

const becomeMentor = {label: {en: 'Become a Mentor', ko: '멘토 지원하기'}, href: '/contact?topic=mentor'};

export const mentorsPage: MentorsPageDoc = {
  _id: 'mentorsPage',
  _type: 'mentorsPage',
  seo: {
    title: {en: 'Mentors', ko: '멘토'},
    description: {
      en: 'Browse ELCA mentors by name and learn how to become a mentor.',
      ko: 'ELCA 멘토를 이름으로 찾아보고, 멘토로 참여하는 방법을 확인하세요.',
    },
  },
  hero: {
    eyebrow: {en: 'Mentors', ko: '멘토'},
    title: {en: 'Mentors who were once in your shoes', ko: '한때 같은 고민을 했던 멘토들'},
    body: {
      en: 'Our mentors include working professionals, entrepreneurs, and former mentees who came back to give back. All profiles shown are samples.',
      ko: '현직자와 창업가, 그리고 다시 돌아와 경험을 나누는 멘티 출신 멘토들이 함께합니다. 현재 프로필은 모두 샘플입니다.',
    },
    cta: becomeMentor,
  },
  featured: {
    eyebrow: {en: 'Featured', ko: '추천 멘토'},
    title: {en: 'Featured mentors', ko: '추천 멘토'},
  },
  directory: {
    eyebrow: {en: 'Directory', ko: '디렉터리'},
    title: {en: 'All mentors', ko: '전체 멘토'},
    intro: {en: 'Search by name in English or Korean.', ko: '영문 또는 한글 이름으로 검색할 수 있어요.'},
  },
  cta: {
    title: {en: 'Become a mentor', ko: '멘토로 함께해 주세요'},
    body: {
      en: 'If you have experience to share and a few hours a month, we would love to hear from you.',
      ko: '나눌 경험과 한 달에 몇 시간의 여유가 있다면 연락 주세요.',
    },
    ctas: [becomeMentor],
  },
};
