import {localizedPt} from '@/lib/utils/pt';
import type {Flags} from '@/types/common';
import type {FaqDoc, FaqGroup} from '@/types/misc';

type Entry = Flags & {q: {en: string; ko: string}; a: {en: string; ko: string}};

function group(name: FaqGroup, entries: Entry[]): FaqDoc[] {
  return entries.map(({q, a, ...flags}, index) => ({
    _id: `faq.${name}-${index + 1}`,
    _type: 'faq',
    group: name,
    order: index + 1,
    question: q,
    answer: localizedPt(a),
    ...flags,
  }));
}

export const faqs: FaqDoc[] = [
  ...group('home', [
    {
      q: {en: 'Who can join ELCA’s mentorship program?', ko: '누가 ELCA 멘토십 프로그램에 참여할 수 있나요?'},
      a: {
        en: 'High school students, university students, and young professionals who want guidance on their studies, careers, or entrepreneurship are welcome to apply.',
        ko: '학업, 커리어, 창업에 대해 조언이 필요한 고등학생, 대학생, 사회초년생 누구나 지원할 수 있습니다.',
      },
    },
    {
      isSample: true,
      q: {en: 'How much does it cost?', ko: '참가비가 있나요?'},
      a: {
        en: 'The mentorship program is free for mentees. It is supported by volunteers and donations.',
        ko: '멘티는 무료로 참여할 수 있습니다. 프로그램은 자원봉사자와 후원으로 운영됩니다.',
      },
    },
    {
      needsReview: true,
      q: {en: 'When are applications open?', ko: '지원은 언제 받나요?'},
      a: {
        en: 'We recruit new cohorts twice a year, in January and July. Follow our newsletter or social channels for exact dates.',
        ko: '매년 1월과 7월, 두 번 새로운 기수를 모집합니다. 정확한 일정은 뉴스레터나 SNS에서 확인해 주세요.',
      },
    },
    {
      isSample: true,
      q: {en: 'Do I need to speak Korean?', ko: '한국어를 할 줄 알아야 하나요?'},
      a: {
        en: 'No. Programs are run in English and Korean, and mentors are matched with your language preference in mind.',
        ko: '아니요. 프로그램은 영어와 한국어로 진행되며, 선호하는 언어를 고려해 멘토를 연결합니다.',
      },
    },
    {
      q: {en: 'How can I support ELCA without mentoring?', ko: '멘토 활동 외에 ELCA를 도울 방법이 있나요?'},
      a: {
        en: 'You can donate, sponsor an event, or volunteer to help run workshops and community events.',
        ko: '후원하거나 행사를 협찬하고, 워크숍과 커뮤니티 행사 운영에 자원봉사자로 참여할 수 있습니다.',
      },
    },
  ]),
  ...group('about', [
    {
      needsReview: true,
      q: {en: 'What does ELCA stand for?', ko: 'ELCA는 무슨 뜻인가요?'},
      a: {
        en: 'ELCA stands for Entrepreneurial Leadership Canada, a non-profit organization founded in Toronto in 2019.',
        ko: 'ELCA는 Entrepreneurial Leadership Canada의 약자로, 2019년 토론토에서 설립된 비영리 단체입니다.',
      },
    },
    {
      needsReview: true,
      q: {en: 'Is ELCA a registered charity?', ko: 'ELCA는 등록된 자선단체인가요?'},
      a: {
        en: 'ELCA is a federally incorporated non-profit. Whether it holds registered charity status will be confirmed before launch.',
        ko: 'ELCA는 연방 비영리 법인입니다. 등록 자선단체 여부는 오픈 전에 확인하여 안내할 예정입니다.',
      },
    },
    {
      isSample: true,
      q: {en: 'Who runs ELCA?', ko: 'ELCA는 누가 운영하나요?'},
      a: {
        en: 'ELCA is run by a volunteer board and program team, many of whom are former mentees and mentors.',
        ko: 'ELCA는 자원봉사 이사회와 프로그램 팀이 운영하며, 상당수가 멘티·멘토 출신입니다.',
      },
    },
    {
      q: {en: 'How can my organization partner with ELCA?', ko: '단체나 기업이 ELCA와 협력하려면 어떻게 하나요?'},
      a: {
        en: 'We welcome partners who can host workshops, offer internships, or sponsor events. Reach out through our contact page.',
        ko: '워크숍 개최, 인턴십 제공, 행사 후원 등 다양한 협력을 환영합니다. 문의 페이지로 연락해 주세요.',
      },
    },
  ]),
  ...group('mentorship', [
    {
      needsReview: true,
      q: {en: 'How are mentors and mentees matched?', ko: '멘토와 멘티는 어떻게 매칭되나요?'},
      a: {
        en: 'We match based on the interests, goals, and availability you share in your application.',
        ko: '지원서에 적어 주신 관심 분야, 목표, 가능한 일정을 바탕으로 매칭합니다.',
      },
    },
    {
      isSample: true,
      q: {en: 'How often will I meet my mentor?', ko: '멘토와 얼마나 자주 만나나요?'},
      a: {
        en: 'Most pairs meet at least once a month, online or in person, and agree on a rhythm that works for both.',
        ko: '대부분 최소 한 달에 한 번 온라인 또는 대면으로 만나며, 서로에게 맞는 주기를 정합니다.',
      },
    },
    {
      isSample: true,
      q: {en: 'Can I request a specific mentor?', ko: '원하는 멘토를 지정할 수 있나요?'},
      a: {
        en: 'You can mention mentors you are interested in, but final matches depend on availability.',
        ko: '관심 있는 멘토를 적어 주실 수 있지만, 최종 매칭은 멘토의 일정에 따라 달라집니다.',
      },
    },
    {
      q: {en: 'What if the match is not working?', ko: '매칭이 잘 맞지 않으면 어떻게 하나요?'},
      a: {
        en: 'Talk to the mentorship coordinator. We will check in with both sides and help find a better fit if needed.',
        ko: '멘토십 코디네이터에게 알려 주세요. 양쪽의 이야기를 듣고 필요하면 더 잘 맞는 멘토를 찾아 드립니다.',
      },
    },
    {
      needsReview: true,
      q: {en: 'Can I join more than one cohort?', ko: '여러 기수에 참여할 수 있나요?'},
      a: {
        en: 'Yes. Many mentees return for another cohort, and strong mentees may be invited back as junior mentors.',
        ko: '네. 많은 멘티가 다음 기수에도 참여하며, 우수 멘티는 주니어 멘토로 초대받기도 합니다.',
      },
    },
    {
      q: {en: 'Is the application form on this page real?', ko: '이 페이지의 지원 양식은 실제로 제출되나요?'},
      a: {
        en: 'Not yet. The form on this prototype is a demo and does not send your information.',
        ko: '아직은 아닙니다. 이 시안의 양식은 데모이며 정보를 전송하지 않습니다.',
      },
    },
  ]),
  ...group('donate', [
    {
      needsReview: true,
      q: {en: 'Will I receive a tax receipt?', ko: '기부금 영수증을 받을 수 있나요?'},
      a: {
        en: 'Tax receipts depend on ELCA’s registered charity status, which will be confirmed before launch.',
        ko: '기부금 영수증 발급 여부는 ELCA의 등록 자선단체 여부에 따라 달라지며, 오픈 전에 확인하여 안내할 예정입니다.',
      },
    },
    {
      q: {en: 'Can I donate monthly?', ko: '매달 정기 후원을 할 수 있나요?'},
      a: {
        en: 'Yes. Choose “Monthly” in the donation options. In this prototype, no payment is processed.',
        ko: '네. 후원 방법에서 ‘월 정기’를 선택하세요. 이 시안에서는 실제 결제가 진행되지 않습니다.',
      },
    },
    {
      q: {en: 'Can my company sponsor an event?', ko: '회사가 행사를 후원할 수 있나요?'},
      a: {
        en: 'Absolutely. Contact us with the topic “Partnership” and we will share sponsorship options.',
        ko: '물론입니다. 문의 페이지에서 ‘파트너십’ 주제로 연락 주시면 후원 방법을 안내해 드립니다.',
      },
    },
    {
      q: {en: 'How are donations used?', ko: '후원금은 어디에 쓰이나요?'},
      a: {
        en: 'Donations fund scholarships, workshops, community events, and basic operations. See the breakdown above.',
        ko: '후원금은 장학금, 워크숍, 커뮤니티 행사, 기본 운영에 쓰입니다. 위의 사용 내역을 참고해 주세요.',
      },
    },
    {
      isSample: true,
      q: {en: 'Can I donate in someone’s honour?', ko: '다른 사람의 이름으로 후원할 수 있나요?'},
      a: {
        en: 'We are planning to support tribute gifts. Contact us if you would like to arrange one.',
        ko: '기념 후원 기능을 준비하고 있습니다. 원하시면 문의해 주세요.',
      },
    },
  ]),
  ...group('events', [
    {
      q: {en: 'Who can attend ELCA events?', ko: 'ELCA 행사에는 누가 참여할 수 있나요?'},
      a: {
        en: 'Most events are open to mentees, mentors, and community members. Each event page lists its audience.',
        ko: '대부분의 행사는 멘티, 멘토, 커뮤니티 회원 모두에게 열려 있습니다. 대상은 각 행사 페이지에서 확인하세요.',
      },
    },
    {
      isSample: true,
      q: {en: 'Are events free?', ko: '행사는 무료인가요?'},
      a: {
        en: 'Most events are free. If there is a fee, it will be listed on the event page.',
        ko: '대부분 무료입니다. 참가비가 있는 경우 행사 페이지에 안내합니다.',
      },
    },
    {
      q: {en: 'How do I propose a workshop as a mentor?', ko: '멘토로서 워크숍을 제안하려면 어떻게 하나요?'},
      a: {
        en: 'Use the “Host an Event” form on this page to share your idea and preferred timing.',
        ko: '이 페이지의 ‘행사 개설 제안’ 양식으로 아이디어와 희망 시기를 알려 주세요.',
      },
    },
    {
      q: {en: 'Can I request a topic for a future event?', ko: '다음 행사 주제를 요청할 수 있나요?'},
      a: {
        en: 'Yes. Use the “Request an Event” form and tell us what you would like to learn.',
        ko: '네. ‘행사 요청’ 양식에 배우고 싶은 주제를 적어 주세요.',
      },
    },
  ]),
  ...group('contact', [
    {
      isSample: true,
      q: {en: 'How quickly will I hear back?', ko: '답변은 얼마나 걸리나요?'},
      a: {en: 'Our volunteers usually reply within 3–5 business days.', ko: '보통 영업일 기준 3–5일 안에 봉사자가 답변드립니다.'},
    },
    {
      q: {en: 'I want to become a mentor. What should I include?', ko: '멘토로 지원하고 싶어요. 무엇을 적으면 되나요?'},
      a: {
        en: 'Choose “Become a Mentor” as the topic and share your field, experience, and availability.',
        ko: '주제에서 ‘멘토 지원’을 선택하고 분야, 경력, 가능한 일정을 적어 주세요.',
      },
    },
    {
      isSample: true,
      q: {en: 'Can I visit ELCA in person?', ko: 'ELCA를 직접 방문할 수 있나요?'},
      a: {
        en: 'ELCA does not have a public office. We meet at partner venues and online.',
        ko: 'ELCA는 상시 운영하는 사무실이 없습니다. 파트너 공간과 온라인에서 모입니다.',
      },
    },
    {
      q: {en: 'Is this contact form connected?', ko: '이 문의 양식은 실제로 전송되나요?'},
      a: {
        en: 'Not yet. In this prototype the form only checks your input. Please email us directly for now.',
        ko: '아직은 아닙니다. 이 시안의 양식은 입력값만 확인합니다. 지금은 이메일로 직접 연락해 주세요.',
      },
    },
  ]),
];
