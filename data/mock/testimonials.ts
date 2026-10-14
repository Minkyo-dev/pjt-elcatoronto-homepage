import type {TestimonialDoc} from '@/types/people';

export const testimonials: TestimonialDoc[] = [
  {
    _id: 'testimonial.1', _type: 'testimonial', isSample: true, order: 1, authorType: 'mentee', cohort: 11,
    quote: {
      en: 'My mentor helped me realize that I did not have to have everything figured out at seventeen. We made a plan one step at a time.',
      ko: '열일곱 살에 모든 걸 정해 둘 필요는 없다는 걸 멘토님 덕분에 알았어요. 한 걸음씩 계획을 세웠습니다.',
    },
    name: {en: 'Seoyeon K.', ko: '서연 K.'},
    context: {en: 'High school student', ko: '고등학생'},
  },
  {
    _id: 'testimonial.2', _type: 'testimonial', isSample: true, order: 2, authorType: 'mentee', cohort: 10,
    quote: {
      en: 'Practising interviews with my mentor made my first co-op interview feel familiar instead of terrifying.',
      ko: '멘토님과 면접 연습을 해 둔 덕분에 첫 코업 면접이 두렵기보다 익숙하게 느껴졌어요.',
    },
    name: {en: 'Daniel L.', ko: '다니엘 L.'},
    context: {en: 'University student', ko: '대학생'},
  },
  {
    _id: 'testimonial.3', _type: 'testimonial', isSample: true, order: 3, authorType: 'mentee', cohort: 9,
    quote: {
      en: 'I came for career advice and left with friends from my cohort who still cheer each other on.',
      ko: '커리어 조언을 얻으러 왔다가, 지금도 서로를 응원하는 동기들을 얻었어요.',
    },
    name: {en: 'Minseo P.', ko: '민서 P.'},
    context: {en: 'University student', ko: '대학생'},
  },
  {
    _id: 'testimonial.4', _type: 'testimonial', isSample: true, order: 4, authorType: 'mentee', cohort: 12,
    quote: {
      en: 'Hearing how my mentor started her business made entrepreneurship feel possible for me too.',
      ko: '멘토님이 사업을 시작한 이야기를 들으며 창업이 저에게도 가능한 일처럼 느껴졌어요.',
    },
    name: {en: 'Jason C.', ko: '제이슨 C.'},
    context: {en: 'High school student', ko: '고등학생'},
  },
  {
    _id: 'testimonial.5', _type: 'testimonial', isSample: true, order: 5, authorType: 'mentee', cohort: 11,
    quote: {
      en: 'The workshops on résumés and LinkedIn were practical and easy to apply right away.',
      ko: '이력서와 링크드인 워크숍은 실용적이어서 바로 적용할 수 있었어요.',
    },
    name: {en: 'Hayoung J.', ko: '하영 J.'},
    context: {en: 'University student', ko: '대학생'},
  },
  {
    _id: 'testimonial.6', _type: 'testimonial', isSample: true, order: 6, authorType: 'mentor',
    quote: {
      en: 'Every cohort reminds me how much a little encouragement can change someone’s direction.',
      ko: '기수마다 작은 격려가 누군가의 방향을 얼마나 바꿀 수 있는지 다시 느낍니다.',
    },
    name: {en: 'Sora L.', ko: '소라 L.'},
    context: {en: 'Mentor since Cohort 1', ko: '1기부터 멘토'},
  },
  {
    _id: 'testimonial.7', _type: 'testimonial', isSample: true, order: 7, authorType: 'mentor',
    quote: {
      en: 'Mentoring has made me a better manager. My mentees ask the questions I forgot to ask myself.',
      ko: '멘토링 덕분에 더 좋은 관리자가 되었어요. 멘티들은 제가 잊고 있던 질문을 던져 줍니다.',
    },
    name: {en: 'Daniel P.', ko: '다니엘 P.'},
    context: {en: 'Mentor since Cohort 5', ko: '5기부터 멘토'},
  },
  {
    _id: 'testimonial.8', _type: 'testimonial', isSample: true, order: 8, authorType: 'mentor', cohort: 9,
    quote: {
      en: 'I was a mentee once. Coming back as a junior mentor felt like closing a circle.',
      ko: '저도 멘티였어요. 주니어 멘토로 돌아오니 한 바퀴를 돈 느낌이에요.',
    },
    name: {en: 'Taeyoung M.', ko: '태영 M.'},
    context: {en: 'Cohort 9 Mentee → Junior Mentor', ko: '9기 멘티 → 주니어 멘토'},
  },
];
