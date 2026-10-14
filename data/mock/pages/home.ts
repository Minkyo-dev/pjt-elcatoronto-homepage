import type {HomePageDoc} from '@/types/pages';
import {photo} from '../images';

const exploreMentorship = {label: {en: 'Explore Mentorship', ko: '멘토십 알아보기'}, href: '/get-involved/mentorship'};

export const homePage: HomePageDoc = {
  _id: 'homePage',
  _type: 'homePage',
  seo: {
    title: {en: 'Mentorship & Community for Young Leaders', ko: '청년 리더를 위한 멘토십 커뮤니티'},
    description: {
      en: 'ELCA connects students and young professionals in Toronto with mentors, events, and a supportive community.',
      ko: 'ELCA는 토론토의 학생과 청년을 멘토, 행사, 그리고 서로를 지지하는 커뮤니티와 연결합니다.',
    },
  },
  heroSlides: [
    {
      key: 'overview',
      kind: 'overview',
      eyebrow: {en: 'Mentorship · Leadership · Community', ko: '멘토십 · 리더십 · 커뮤니티'},
      title: {en: 'Grow your path with mentors who have walked it', ko: '먼저 걸어 본 멘토와 함께 나의 길을 찾아가세요'},
      body: {
        en: 'ELCA matches students and young professionals with mentors across industries, so you never have to figure out your next step alone.',
        ko: 'ELCA는 다양한 분야의 멘토와 학생·청년을 연결합니다. 다음 걸음을 혼자 고민하지 않아도 됩니다.',
      },
      media: {type: 'image', image: photo('communityArmInArm', '16:9')},
      ctas: [exploreMentorship, {label: {en: 'Become a Mentee', ko: '멘티 신청하기'}, href: '/get-involved/mentorship#apply'}],
    },
    {
      key: 'mentor',
      kind: 'mentor',
      eyebrow: {en: 'For mentors', ko: '멘토를 찾습니다'},
      title: {en: 'Share what you know. Shape who comes next.', ko: '나의 경험이 누군가의 다음 걸음이 됩니다'},
      body: {
        en: 'Mentors give a few hours a month and help a mentee see what is possible.',
        ko: '한 달에 몇 시간의 대화로 멘티가 더 넓은 가능성을 보도록 도와주세요.',
      },
      media: {type: 'image', image: photo('pairCoding', '16:9')},
      ctas: [{label: {en: 'Become a Mentor', ko: '멘토 지원하기'}, href: '/get-involved/mentors#become-a-mentor'}],
    },
    {
      key: 'event',
      kind: 'event',
      isSample: true,
      eventSlug: 'winter-networking-night-2026',
      eyebrow: {en: 'Upcoming event', ko: '다가오는 행사'},
      title: {en: 'Winter Networking Night', ko: '윈터 네트워킹 나이트'},
      body: {
        en: 'Meet mentors, alumni, and new friends on November 20 in Toronto.',
        ko: '11월 20일, 토론토에서 멘토와 선배, 새로운 친구들을 만나 보세요.',
      },
      // Replaced by the event's cover image in the repository.
      media: {type: 'image', image: photo('networking', '16:9')},
      ctas: [{label: {en: 'View event details', ko: '행사 자세히 보기'}, href: '/events-news/winter-networking-night-2026'}],
    },
  ],
  sponsors: {title: {en: 'Supported by', ko: '함께하는 후원사'}},
  purpose: {
    needsReview: true,
    eyebrow: {en: 'Our purpose', ko: '우리의 목적'},
    title: {en: 'Helping the next generation grow with confidence', ko: '다음 세대가 자신 있게 성장하도록'},
    body: {
      en: 'Since 2019, ELCA has connected mentees with mentors from many fields to support personal and career growth, and to build a culture of support within the Korean-Canadian community.',
      ko: 'ELCA는 2019년부터 다양한 분야의 멘토와 멘티를 연결해 개인과 커리어의 성장을 돕고, 한인 커뮤니티 안에 서로를 지지하는 문화를 만들어 왔습니다.',
    },
    cta: {label: {en: 'Learn about ELCA', ko: 'ELCA 소개 보기'}, href: '/about'},
  },
  impact: {
    eyebrow: {en: 'Our impact', ko: '임팩트'},
    title: {en: 'Cohort by cohort, our community keeps growing', ko: '기수마다 함께 자라는 커뮤니티'},
    intro: {
      en: 'Figures marked “Needs review” come from our previous website and will be confirmed before launch.',
      ko: '‘검수 필요’로 표시된 수치는 기존 웹사이트에서 가져온 것으로, 오픈 전에 확인할 예정입니다.',
    },
  },
  mentorshipPreview: {
    isSample: true,
    eyebrow: {en: 'Mentorship program', ko: '멘토십 프로그램'},
    title: {en: 'A six-month journey, one conversation at a time', ko: '대화로 채워 가는 6개월의 여정'},
    intro: {
      en: 'Each cohort pairs mentees with mentors based on shared interests and goals.',
      ko: '각 기수는 관심사와 목표가 맞는 멘토와 멘티를 연결합니다.',
    },
    items: [
      {
        icon: 'compass',
        title: {en: 'Matched by interest', ko: '관심사 기반 매칭'},
        body: {
          en: 'Tell us what you are curious about and we will find a mentor who has been there.',
          ko: '관심 분야를 알려 주시면 그 길을 먼저 걸어 본 멘토를 찾아 드립니다.',
        },
      },
      {
        icon: 'messageCircle',
        title: {en: 'Regular 1:1 conversations', ko: '정기적인 1:1 대화'},
        body: {
          en: 'Meet your mentor regularly to set goals, ask questions, and reflect.',
          ko: '멘토와 정기적으로 만나 목표를 세우고, 궁금한 것을 묻고, 돌아봅니다.',
        },
      },
      {
        icon: 'users',
        title: {en: 'A cohort that grows together', ko: '함께 성장하는 동기'},
        body: {
          en: 'Workshops and events connect you with peers who share the journey.',
          ko: '워크숍과 행사에서 같은 길을 걷는 동기들을 만납니다.',
        },
      },
    ],
    cta: exploreMentorship,
  },
  featuredMentors: {
    eyebrow: {en: 'Mentors', ko: '멘토'},
    title: {en: 'Meet some of our mentors', ko: 'ELCA의 멘토를 소개합니다'},
    intro: {
      en: 'Professionals and former mentees who volunteer their time.',
      ko: '자신의 시간을 나누는 현직자와 멘티 출신 멘토들입니다.',
    },
    cta: {label: {en: 'View all mentors', ko: '전체 멘토 보기'}, href: '/get-involved/mentors'},
  },
  highlights: {
    eyebrow: {en: 'Events & News', ko: '이벤트 & 소식'},
    title: {en: 'What is happening at ELCA', ko: 'ELCA의 새로운 소식'},
    cta: {label: {en: 'View all', ko: '전체 보기'}, href: '/events-news'},
  },
  testimonials: {
    eyebrow: {en: 'Community voices', ko: '커뮤니티 이야기'},
    title: {en: 'In their own words', ko: '멘티와 멘토가 전하는 이야기'},
  },
  getInvolved: {
    eyebrow: {en: 'Get involved', ko: '함께하기'},
    title: {en: 'Find your place in the community', ko: '커뮤니티에서 나의 자리를 찾아보세요'},
    cards: [
      {
        tone: 'primary',
        icon: 'graduationCap',
        title: {en: 'Become a Mentee', ko: '멘티 되기'},
        body: {en: 'Apply for the next cohort and get matched with a mentor.', ko: '다음 기수에 지원하고 나에게 맞는 멘토를 만나 보세요.'},
        cta: {label: {en: 'Apply for Mentorship', ko: '멘토십 신청하기'}, href: '/get-involved/mentorship'},
      },
      {
        tone: 'secondary',
        icon: 'handshake',
        title: {en: 'Become a Mentor', ko: '멘토 되기'},
        body: {en: 'Share your experience with a student or young professional.', ko: '학생과 청년에게 나의 경험을 나눠 주세요.'},
        cta: {label: {en: 'Become a Mentor', ko: '멘토 지원하기'}, href: '/get-involved/mentors#become-a-mentor'},
      },
      {
        tone: 'accent',
        icon: 'heart',
        title: {en: 'Donate', ko: '후원하기'},
        body: {en: 'Fund scholarships, workshops, and community events.', ko: '장학금과 워크숍, 커뮤니티 행사를 후원해 주세요.'},
        cta: {label: {en: 'Make a Donation', ko: '후원하기'}, href: '/get-involved/donate'},
      },
    ],
  },
  faq: {
    eyebrow: {en: 'FAQ', ko: '자주 묻는 질문'},
    title: {en: 'Questions, answered', ko: '궁금한 점을 확인하세요'},
  },
};
