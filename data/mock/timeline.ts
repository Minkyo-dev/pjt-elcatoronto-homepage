import type {HistoryEntryDoc} from '@/types/misc';

export const history: HistoryEntryDoc[] = [
  {
    _id: 'history.2019', _type: 'timelineEntry', group: 'history', order: 1, year: 2019, needsReview: true,
    title: {en: 'Founded in Toronto', ko: '토론토에서 설립'},
    body: {en: 'ELCA is incorporated as a non-profit to connect young people with mentors.', ko: '청년과 멘토를 연결하기 위한 비영리 법인으로 설립되었습니다.'},
  },
  {
    _id: 'history.2020', _type: 'timelineEntry', group: 'history', order: 2, year: 2020, needsReview: true,
    title: {en: 'First mentorship cohort', ko: '첫 멘토십 기수'},
    body: {en: 'The first cohort launches, recruiting high school students through local entrepreneurs.', ko: '지역 기업가들을 통해 고등학생을 모집하며 첫 기수를 시작합니다.'},
  },
  {
    _id: 'history.2022', _type: 'timelineEntry', group: 'history', order: 3, year: 2022, isSample: true,
    title: {en: 'Junior mentor pathway', ko: '주니어 멘토 제도'},
    body: {en: 'Outstanding mentees begin returning as junior mentors.', ko: '우수 멘티가 주니어 멘토로 돌아오기 시작합니다.'},
  },
  {
    _id: 'history.2023', _type: 'timelineEntry', group: 'history', order: 4, year: 2023, isSample: true,
    title: {en: 'Scholarship program', ko: '장학금 프로그램'},
    body: {en: 'Donor-funded scholarships recognize outstanding mentees.', ko: '후원금으로 마련한 장학금으로 우수 멘티를 격려합니다.'},
  },
  {
    _id: 'history.2025', _type: 'timelineEntry', group: 'history', order: 5, year: 2025, needsReview: true,
    title: {en: 'Twelve cohorts', ko: '12번째 기수'},
    body: {en: 'Around 200 mentees have now taken part in the program.', ko: '누적 약 200명의 멘티가 프로그램에 참여했습니다.'},
  },
  {
    _id: 'history.2026', _type: 'timelineEntry', group: 'history', order: 6, year: 2026, needsReview: true,
    title: {en: 'Cohort 13 begins', ko: '13기 시작'},
    body: {en: 'Cohort 13 begins in July 2026.', ko: '2026년 7월 13기가 시작됩니다.'},
  },
];
