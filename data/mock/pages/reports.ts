import type {ReportsPageDoc} from '@/types/pages';

export const reportsPage: ReportsPageDoc = {
  _id: 'reportsPage',
  _type: 'reportsPage',
  seo: {
    title: {en: 'Reports', ko: '보고서'},
    description: {en: 'Financial statements and annual reports from ELCA.', ko: 'ELCA의 재무제표와 연차 보고서입니다.'},
  },
  hero: {
    eyebrow: {en: 'About ELCA', ko: 'ELCA 소개'},
    title: {en: 'Reports & transparency', ko: '보고서와 투명성'},
    body: {
      en: 'We share our financial statements and annual reports so that members and donors can see how ELCA operates. The documents listed here are samples.',
      ko: '회원과 후원자가 ELCA의 운영을 확인할 수 있도록 재무제표와 연차 보고서를 공개합니다. 현재 목록은 샘플입니다.',
    },
  },
};
