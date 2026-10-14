import type {EventsPageDoc} from '@/types/pages';

export const eventsPage: EventsPageDoc = {
  _id: 'eventsPage',
  _type: 'eventsPage',
  seo: {
    title: {en: 'Events & News', ko: '이벤트 & 소식'},
    description: {
      en: 'Upcoming workshops and events, community stories, and news from ELCA.',
      ko: 'ELCA의 다가오는 워크숍과 행사, 커뮤니티 이야기와 소식을 확인하세요.',
    },
  },
  hero: {
    eyebrow: {en: 'Events & News', ko: '이벤트 & 소식'},
    title: {en: 'Learn, connect, and celebrate together', ko: '함께 배우고, 연결되고, 축하해요'},
    body: {
      en: 'Workshops, networking nights, and stories from our community. All items listed are samples.',
      ko: '워크숍과 네트워킹 행사, 커뮤니티의 이야기를 만나 보세요. 현재 목록은 모두 샘플입니다.',
    },
    cta: {label: {en: 'View Upcoming Events', ko: '다가오는 행사 보기'}, href: '#events'},
  },
  featured: {title: {en: 'Featured', ko: '주요 소식'}},
  upcoming: {
    eyebrow: {en: 'Upcoming', ko: '예정'},
    title: {en: 'Upcoming events & workshops', ko: '다가오는 행사 & 워크숍'},
  },
  timeline: {
    eyebrow: {en: 'Timeline', ko: '타임라인'},
    title: {en: 'Our events over the years', ko: '연도별 행사'},
  },
  latest: {
    eyebrow: {en: 'Latest', ko: '최신'},
    title: {en: 'News & stories', ko: '소식 & 이야기'},
  },
  recap: {
    eyebrow: {en: 'Recap', ko: '지난 행사'},
    title: {en: 'Past events recap', ko: '지난 행사 돌아보기'},
  },
  forms: {
    eyebrow: {en: 'Get involved', ko: '참여하기'},
    title: {en: 'Host or request an event', ko: '행사 개설 제안 · 요청하기'},
    hostIntro: {
      en: 'Mentors: propose a workshop, seminar, or networking session you would like to lead.',
      ko: '멘토 여러분, 직접 진행하고 싶은 워크숍이나 세미나, 네트워킹 세션을 제안해 주세요.',
    },
    requestIntro: {
      en: 'Have a topic you want us to cover, or a question about an event? Let us know.',
      ko: '다뤄 줬으면 하는 주제나 행사에 대한 질문이 있다면 알려 주세요.',
    },
  },
};
