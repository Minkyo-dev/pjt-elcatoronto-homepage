import type {ContactPageDoc} from '@/types/pages';

export const contactPage: ContactPageDoc = {
  _id: 'contactPage',
  _type: 'contactPage',
  seo: {
    title: {en: 'Contact Us', ko: '문의하기'},
    description: {
      en: 'Get in touch with ELCA about mentorship, events, donations, or partnerships.',
      ko: '멘토십, 행사, 후원, 파트너십에 대해 ELCA에 문의하세요.',
    },
  },
  hero: {
    eyebrow: {en: 'Contact', ko: '문의'},
    title: {en: 'We would love to hear from you', ko: '언제든 편하게 연락 주세요'},
    body: {
      en: 'Questions about mentorship, events, or partnerships? Send us a message and a volunteer will get back to you.',
      ko: '멘토십, 행사, 파트너십에 대해 궁금한 점이 있다면 메시지를 남겨 주세요. 담당 봉사자가 답변드립니다.',
    },
    cta: {label: {en: 'Send Message (Demo)', ko: '메시지 보내기 (데모)'}, href: '#contact-form'},
  },
  info: {title: {en: 'Ways to reach us', ko: '연락 방법'}},
  form: {
    eyebrow: {en: 'Message', ko: '메시지'},
    title: {en: 'Send us a message', ko: '메시지 보내기'},
    intro: {en: 'This form is a demo. Nothing you enter will be sent.', ko: '데모 양식입니다. 입력한 내용은 전송되지 않습니다.'},
  },
  location: {
    eyebrow: {en: 'Location', ko: '위치'},
    title: {en: 'Based in Toronto', ko: '토론토에서 활동합니다'},
    intro: {
      en: 'We meet at partner venues across the Greater Toronto Area and online.',
      ko: '광역 토론토 지역의 파트너 공간과 온라인에서 모입니다.',
    },
  },
  faq: {
    eyebrow: {en: 'Support', ko: '지원'},
    title: {en: 'Before you write', ko: '문의 전에 확인하세요'},
  },
};
