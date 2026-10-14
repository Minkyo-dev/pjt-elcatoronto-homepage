import type {DonatePageDoc} from '@/types/pages';
import {photo} from '../images';

export const donatePage: DonatePageDoc = {
  _id: 'donatePage',
  _type: 'donatePage',
  seo: {
    title: {en: 'Donate', ko: '후원하기'},
    description: {
      en: 'Support ELCA scholarships, workshops, and community programs.',
      ko: 'ELCA의 장학금, 워크숍, 커뮤니티 프로그램을 후원해 주세요.',
    },
  },
  hero: {
    eyebrow: {en: 'Donate', ko: '후원'},
    title: {en: 'Invest in the next generation of leaders', ko: '다음 세대의 리더에게 투자하세요'},
    body: {
      en: 'Your gift helps students and young professionals access mentorship, practical workshops, and scholarships.',
      ko: '여러분의 후원은 학생과 청년이 멘토십과 실용적인 워크숍, 장학금을 만날 수 있도록 돕습니다.',
    },
    cta: {label: {en: 'Make a Donation', ko: '후원하기'}, href: '#donation-options'},
    image: photo('handsTogether', '16:9'),
  },
  why: {
    needsReview: true,
    eyebrow: {en: 'Why donate', ko: '후원이 필요한 이유'},
    title: {en: 'Mentorship should be open to everyone', ko: '멘토십은 누구에게나 열려 있어야 합니다'},
    body: {
      en: 'ELCA is run by volunteers and funded by donations. Your support keeps the program free for mentees.',
      ko: 'ELCA는 자원봉사자가 운영하고 후원금으로 유지됩니다. 여러분의 후원 덕분에 멘티는 무료로 프로그램에 참여할 수 있습니다.',
    },
    points: [
      {icon: 'award', title: {en: 'Scholarships', ko: '장학금'}, body: {en: 'Recognize mentees who show outstanding growth.', ko: '뛰어난 성장을 보여 준 멘티를 격려합니다.'}},
      {icon: 'bookOpen', title: {en: 'Seminars & workshops', ko: '세미나 & 워크숍'}, body: {en: 'Bring in speakers on careers, entrepreneurship, law, and finance.', ko: '커리어, 창업, 법률, 금융 분야의 연사를 초청합니다.'}},
      {icon: 'users', title: {en: 'Community events', ko: '커뮤니티 행사'}, body: {en: 'Create spaces where mentees, mentors, and alumni meet.', ko: '멘티와 멘토, 선배들이 만나는 자리를 만듭니다.'}},
    ],
  },
  impact: {
    eyebrow: {en: 'Your impact', ko: '후원의 효과'},
    title: {en: 'What your gift can do', ko: '후원금이 만드는 변화'},
    intro: {en: 'The examples below are illustrative samples.', ko: '아래 예시는 이해를 돕기 위한 샘플입니다.'},
  },
  fundUsage: {
    isSample: true,
    eyebrow: {en: 'How funds are used', ko: '후원금 사용'},
    title: {en: 'Where your donation goes', ko: '후원금은 이렇게 쓰입니다'},
    items: [
      {label: {en: 'Programs & events', ko: '프로그램 & 행사'}, percent: 40},
      {label: {en: 'Scholarships', ko: '장학금'}, percent: 35},
      {label: {en: 'Operations', ko: '운영'}, percent: 15},
      {label: {en: 'Outreach', ko: '홍보'}, percent: 10},
    ],
  },
  options: {
    eyebrow: {en: 'Donation options', ko: '후원 방법'},
    title: {en: 'Choose your gift', ko: '후원 금액을 선택하세요'},
    intro: {en: 'This is a demo. No payment will be processed.', ko: '데모 화면입니다. 실제 결제는 진행되지 않습니다.'},
  },
  faq: {
    eyebrow: {en: 'FAQ', ko: '자주 묻는 질문'},
    title: {en: 'Donation FAQ', ko: '후원 FAQ'},
  },
};
