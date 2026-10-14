import type {MentorshipPageDoc} from '@/types/pages';
import {photo} from '../images';

export const mentorshipPage: MentorshipPageDoc = {
  _id: 'mentorshipPage',
  _type: 'mentorshipPage',
  seo: {
    title: {en: 'Mentorship Program', ko: '멘토십 프로그램'},
    description: {
      en: 'Learn how ELCA’s mentorship program works, who can apply, and what you will gain.',
      ko: 'ELCA 멘토십 프로그램의 진행 방식과 지원 자격, 기대할 수 있는 성장을 안내합니다.',
    },
  },
  hero: {
    eyebrow: {en: 'Mentorship', ko: '멘토십'},
    title: {en: 'Mentorship that meets you where you are', ko: '지금의 나에게 맞는 멘토십'},
    body: {
      en: 'Get matched with a mentor who understands your goals, and grow alongside a cohort of peers.',
      ko: '나의 목표를 이해하는 멘토와 연결되고, 같은 기수의 동료들과 함께 성장하세요.',
    },
    cta: {label: {en: 'Apply for Mentorship', ko: '멘토십 신청하기'}, href: '#apply'},
    image: photo('cafeMentoring', '16:9'),
  },
  offer: {
    needsReview: true,
    eyebrow: {en: 'What we offer', ko: '프로그램 소개'},
    title: {en: 'More than advice — a relationship', ko: '조언을 넘어, 관계를 만듭니다'},
    summary: {
      en: 'ELCA recruits mentees each January and July and matches them with mentors based on their interests. Alongside 1:1 mentoring, mentees join seminars, workshops, and community events.',
      ko: 'ELCA는 매년 1월과 7월에 멘티를 모집하고, 관심 분야에 맞춰 멘토와 연결합니다. 1:1 멘토링과 함께 세미나, 워크숍, 커뮤니티 행사에 참여할 수 있습니다.',
    },
    benefits: [
      {
        icon: 'compass',
        title: {en: 'Career guidance', ko: '커리어 가이드'},
        body: {
          en: 'Explore fields, plan your next step, and learn how professionals got where they are.',
          ko: '다양한 분야를 탐색하고 다음 단계를 계획하며, 현직자들의 경험을 듣습니다.',
        },
      },
      {
        icon: 'bookOpen',
        title: {en: 'Seminars & workshops', ko: '세미나 & 워크숍'},
        body: {
          en: 'Practical sessions on employment, entrepreneurship, marketing, law, and accounting.',
          ko: '취업, 창업, 마케팅, 법률, 회계 등 실용적인 주제의 세션에 참여합니다.',
        },
      },
      {
        icon: 'users',
        title: {en: 'Lasting network', ko: '오래가는 네트워크'},
        body: {
          en: 'Build relationships with mentors, alumni, and peers that continue after the cohort.',
          ko: '기수가 끝난 뒤에도 이어지는 멘토, 선배, 동기와의 관계를 쌓습니다.',
        },
      },
      {
        icon: 'award',
        title: {en: 'Scholarships', ko: '장학금'},
        body: {
          en: 'Outstanding mentees may be considered for donor-funded scholarships.',
          ko: '우수 멘티는 후원금으로 마련된 장학금 대상자로 선정될 수 있습니다.',
        },
      },
    ],
  },
  inlineCta: {
    title: {en: 'Ready to take the first step?', ko: '첫걸음을 내디딜 준비가 되셨나요?'},
    cta: {label: {en: 'Become a Mentee', ko: '멘티 신청하기'}, href: '#apply'},
  },
  eligibility: {
    isSample: true,
    eyebrow: {en: 'Who can apply', ko: '지원 자격'},
    title: {en: 'Is this program for you?', ko: '이런 분께 추천합니다'},
    items: {
      en: [
        'High school and post-secondary students in the Greater Toronto Area',
        'Young professionals early in their careers',
        'Anyone curious about entrepreneurship or leadership',
        'Participants able to commit to the full cohort period',
      ],
      ko: [
        '광역 토론토 지역의 고등학생 및 대학생',
        '커리어를 막 시작한 청년',
        '창업이나 리더십에 관심 있는 누구나',
        '기수 기간 동안 꾸준히 참여할 수 있는 분',
      ],
    },
  },
  process: {
    isSample: true,
    eyebrow: {en: 'Application phase', ko: '지원 절차'},
    title: {en: 'How it works', ko: '진행 과정'},
    steps: [
      {title: {en: 'Recruitment', ko: '모집'}, body: {en: 'Applications open each January and July.', ko: '매년 1월과 7월에 지원서를 받습니다.'}, duration: {en: '2–3 weeks', ko: '2–3주'}},
      {title: {en: 'Application', ko: '지원서 제출'}, body: {en: 'Tell us about your interests, goals, and availability.', ko: '관심 분야와 목표, 참여 가능한 일정을 알려 주세요.'}, duration: {en: 'About 15 minutes', ko: '약 15분'}},
      {title: {en: 'Matching', ko: '매칭'}, body: {en: 'We pair you with a mentor based on your interests.', ko: '관심사를 바탕으로 멘토와 연결해 드립니다.'}, duration: {en: '1–2 weeks', ko: '1–2주'}},
      {title: {en: 'Kickoff', ko: '킥오프'}, body: {en: 'Meet your mentor and cohort at the opening session.', ko: '오프닝 세션에서 멘토와 동기들을 처음 만납니다.'}, duration: {en: '1 day', ko: '1일'}},
      {title: {en: 'Mentoring', ko: '멘토링'}, body: {en: 'Regular 1:1 meetings plus workshops and events.', ko: '정기적인 1:1 만남과 함께 워크숍, 행사에 참여합니다.'}, duration: {en: 'About 6 months', ko: '약 6개월'}},
      {title: {en: 'Graduation', ko: '수료'}, body: {en: 'Celebrate your growth and stay connected as an alum.', ko: '성장을 함께 축하하고, 수료 후에도 커뮤니티로 이어집니다.'}, duration: {en: '1 day', ko: '1일'}},
    ],
  },
  details: {
    isSample: true,
    eyebrow: {en: 'Program details', ko: '프로그램 정보'},
    title: {en: 'At a glance', ko: '한눈에 보기'},
    items: [
      {label: {en: 'Duration', ko: '기간'}, value: {en: 'About 6 months per cohort', ko: '기수당 약 6개월'}},
      {label: {en: 'Format', ko: '방식'}, value: {en: '1:1 mentoring, online or in person', ko: '1:1 멘토링, 온라인 또는 대면'}},
      {label: {en: 'Frequency', ko: '빈도'}, value: {en: 'At least one meeting per month', ko: '최소 월 1회 만남'}},
      {label: {en: 'Cost', ko: '비용'}, value: {en: 'Free for mentees', ko: '멘티 무료'}},
    ],
  },
  outcomes: {
    eyebrow: {en: 'What you’ll achieve', ko: '기대 효과'},
    title: {en: 'Where you could be in six months', ko: '6개월 뒤 달라질 나의 모습'},
    items: [
      {icon: 'target', title: {en: 'Clear goals', ko: '분명한 목표'}, body: {en: 'A realistic plan for your next academic or career step.', ko: '다음 학업·커리어 단계에 대한 현실적인 계획.'}},
      {icon: 'sparkles', title: {en: 'Confidence', ko: '자신감'}, body: {en: 'Practice talking with professionals and presenting your ideas.', ko: '현직자와 대화하고 내 생각을 표현하는 연습.'}},
      {icon: 'briefcase', title: {en: 'Career skills', ko: '커리어 역량'}, body: {en: 'A stronger résumé, interview skills, and industry knowledge.', ko: '탄탄한 이력서와 면접 역량, 업계에 대한 이해.'}},
      {icon: 'sprout', title: {en: 'A path to give back', ko: '나눔의 길'}, body: {en: 'The option to return as a junior mentor for the next cohort.', ko: '다음 기수의 주니어 멘토로 돌아올 수 있는 기회.'}},
    ],
  },
  stories: {
    eyebrow: {en: 'Success stories', ko: '멘티 이야기'},
    title: {en: 'Mentees who took the first step', ko: '첫걸음을 내디딘 멘티들'},
  },
  apply: {
    isSample: true,
    eyebrow: {en: 'Apply', ko: '지원하기'},
    title: {en: 'Apply for the next cohort', ko: '다음 기수에 지원하세요'},
    body: {
      en: 'Applications are reviewed in the order they are received. This form is a demo and does not send your information anywhere.',
      ko: '지원서는 접수 순서대로 검토합니다. 이 양식은 데모이며 입력한 정보는 어디에도 전송되지 않습니다.',
    },
    nextCohort: {en: 'Cohort 14 · Starts February 2027', ko: '14기 · 2027년 2월 시작'},
    deadline: {en: 'Apply by January 24, 2027', ko: '2027년 1월 24일까지 지원'},
  },
  faq: {
    eyebrow: {en: 'FAQ', ko: '자주 묻는 질문'},
    title: {en: 'Mentorship FAQ', ko: '멘토십 FAQ'},
  },
};
