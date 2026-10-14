import type {AboutPageDoc} from '@/types/pages';

export const aboutPage: AboutPageDoc = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  seo: {
    title: {en: 'About ELCA', ko: 'ELCA 소개'},
    description: {
      en: 'Learn about ELCA’s purpose, mission, story, and the team behind our mentorship community.',
      ko: 'ELCA의 목적과 미션, 걸어온 길, 그리고 멘토십 커뮤니티를 이끄는 사람들을 소개합니다.',
    },
  },
  hero: {
    eyebrow: {en: 'About ELCA', ko: 'ELCA 소개'},
    title: {en: 'A community built on mentorship', ko: '멘토십으로 이어진 커뮤니티'},
    body: {
      en: 'Entrepreneurial Leadership Canada (ELCA) is a Toronto-based non-profit that connects mentees with mentors to support personal and career growth.',
      ko: 'ELCA(Entrepreneurial Leadership Canada)는 토론토에 기반을 둔 비영리 단체로, 멘티와 멘토를 연결해 개인과 커리어의 성장을 돕습니다.',
    },
    cta: {label: {en: 'Get Involved', ko: '참여하기'}, href: '/get-involved/mentorship'},
  },
  purpose: {
    eyebrow: {en: 'Purpose', ko: '목적'},
    title: {en: 'Why we exist', ko: '우리가 존재하는 이유'},
    body: {
      en: 'We believe that a single conversation with the right person can change the direction of a career. ELCA creates those conversations — across generations, industries, and backgrounds.',
      ko: '적절한 사람과 나눈 한 번의 대화가 커리어의 방향을 바꿀 수 있다고 믿습니다. ELCA는 세대와 분야, 배경을 넘어 그런 대화가 일어나도록 돕습니다.',
    },
  },
  values: {
    eyebrow: {en: 'Core values', ko: '핵심 가치'},
    title: {en: 'What guides us', ko: '우리가 지키는 가치'},
  },
  missionVision: {
    needsReview: true,
    mission: {
      title: {en: 'Mission', ko: '미션'},
      body: {
        en: 'To support personal and career growth through networking and mentorship, and to encourage collaboration between generations and among members.',
        ko: '네트워킹과 멘토십을 통해 개인과 커리어의 성장을 지원하고, 세대 간·회원 간 협력을 장려합니다.',
      },
    },
    vision: {
      title: {en: 'Vision', ko: '비전'},
      body: {
        en: 'A connected community where every young person has someone to learn from — and, later, someone to give back to.',
        ko: '모든 청년이 배울 수 있는 누군가를 만나고, 언젠가 다시 누군가에게 돌려줄 수 있는 연결된 커뮤니티.',
      },
    },
  },
  story: {
    eyebrow: {en: 'Our story', ko: '걸어온 길'},
    title: {en: 'From a small circle to a growing community', ko: '작은 모임에서 함께 자라는 커뮤니티로'},
  },
  impact: {
    needsReview: true,
    eyebrow: {en: 'Our impact', ko: '임팩트'},
    title: {en: 'Growth we can see', ko: '눈으로 확인하는 변화'},
    cases: [
      {
        icon: 'trendingUp',
        title: {en: 'From mentee to mentor', ko: '멘티에서 멘토로'},
        body: {
          en: 'Strong mentees can continue as junior mentors and later as full mentors, passing on what they learned.',
          ko: '우수한 멘티는 주니어 멘토를 거쳐 정식 멘토로 활동하며 배운 것을 다음 기수에 전합니다.',
        },
      },
      {
        icon: 'award',
        title: {en: 'Scholarships for outstanding mentees', ko: '우수 멘티 장학금'},
        body: {
          en: 'Donations fund scholarships awarded to mentees who show outstanding growth.',
          ko: '후원금으로 뛰어난 성장을 보여 준 멘티에게 장학금을 수여합니다.',
        },
      },
    ],
  },
  team: {
    eyebrow: {en: 'Leadership & team', ko: '운영진'},
    title: {en: 'The people behind ELCA', ko: 'ELCA를 이끄는 사람들'},
    intro: {
      en: 'Profiles below are samples and will be replaced with the actual team.',
      ko: '아래 프로필은 샘플이며 실제 운영진 정보로 교체될 예정입니다.',
    },
  },
  reportsTeaser: {
    eyebrow: {en: 'Transparency', ko: '투명성'},
    title: {en: 'Financial statements & annual reports', ko: '재무제표 및 연차 보고서'},
    intro: {
      en: 'See how we use donations and what each year has looked like.',
      ko: '후원금이 어떻게 쓰였는지, 한 해를 어떻게 보냈는지 확인하세요.',
    },
    cta: {label: {en: 'View Reports', ko: '보고서 보기'}, href: '/about/reports'},
  },
  faq: {
    eyebrow: {en: 'Q&A', ko: 'Q&A'},
    title: {en: 'Questions about ELCA', ko: 'ELCA에 대해 궁금한 점'},
  },
  cta: {
    title: {en: 'Ready to get involved?', ko: '함께할 준비가 되셨나요?'},
    body: {
      en: 'Join the next cohort as a mentee, volunteer as a mentor, or support our programs.',
      ko: '다음 기수 멘티로 지원하거나, 멘토로 참여하거나, 프로그램을 후원해 주세요.',
    },
    ctas: [
      {label: {en: 'Get Involved', ko: '참여하기'}, href: '/get-involved/mentorship'},
      {label: {en: 'Donate', ko: '후원하기'}, href: '/get-involved/donate'},
    ],
  },
};
