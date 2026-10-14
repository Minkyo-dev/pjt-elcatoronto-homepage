import type {CoreValueDoc} from '@/types/misc';

export const coreValues: CoreValueDoc[] = [
  {
    _id: 'coreValue.growth', _type: 'coreValue', order: 1, icon: 'sprout',
    title: {en: 'Growth', ko: '성장'},
    body: {en: 'We help every member take the next step, whatever their starting point.', ko: '출발점이 어디든, 모든 구성원이 다음 걸음을 내딛도록 돕습니다.'},
  },
  {
    _id: 'coreValue.connection', _type: 'coreValue', order: 2, icon: 'handshake',
    title: {en: 'Connection', ko: '연결'},
    body: {en: 'We build relationships across generations, industries, and backgrounds.', ko: '세대와 분야, 배경을 넘어 관계를 만듭니다.'},
  },
  {
    _id: 'coreValue.leadership', _type: 'coreValue', order: 3, icon: 'lightbulb',
    title: {en: 'Leadership', ko: '리더십'},
    body: {en: 'We encourage initiative, curiosity, and the courage to start something new.', ko: '주도성과 호기심, 새로운 일을 시작하는 용기를 응원합니다.'},
  },
  {
    _id: 'coreValue.giving-back', _type: 'coreValue', order: 4, icon: 'heart',
    title: {en: 'Giving back', ko: '나눔'},
    body: {en: 'Those who were helped come back to help the next cohort.', ko: '도움을 받은 사람이 다시 다음 기수를 돕습니다.'},
  },
];
