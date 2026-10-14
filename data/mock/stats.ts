import type {StatDoc} from '@/types/misc';

const cohorts = {value: {en: '12', ko: '12'}, label: {en: 'Cohorts completed', ko: '완료된 기수'}};
const mentees = {value: {en: '~200', ko: '약 200'}, label: {en: 'Mentees supported', ko: '함께한 멘티'}};

export const stats: StatDoc[] = [
  {_id: 'stat.home-cohorts', _type: 'stat', group: 'home', order: 1, needsReview: true, ...cohorts},
  {_id: 'stat.home-mentees', _type: 'stat', group: 'home', order: 2, needsReview: true, ...mentees},
  {
    _id: 'stat.home-founded', _type: 'stat', group: 'home', order: 3, needsReview: true,
    value: {en: '2019', ko: '2019'},
    label: {en: 'Founded in Toronto', ko: '토론토에서 설립'},
  },
  {
    _id: 'stat.home-mentors', _type: 'stat', group: 'home', order: 4, isSample: true,
    value: {en: '40+', ko: '40+'},
    label: {en: 'Volunteer mentors', ko: '자원봉사 멘토'},
  },
  {_id: 'stat.about-cohorts', _type: 'stat', group: 'about', order: 1, needsReview: true, ...cohorts},
  {_id: 'stat.about-mentees', _type: 'stat', group: 'about', order: 2, needsReview: true, ...mentees},
  {
    _id: 'stat.about-events', _type: 'stat', group: 'about', order: 3, isSample: true,
    value: {en: '30+', ko: '30+'},
    label: {en: 'Events and workshops hosted', ko: '개최한 행사 및 워크숍'},
  },
  {
    _id: 'stat.about-scholarships', _type: 'stat', group: 'about', order: 4, isSample: true,
    value: {en: '$25K', ko: '2.5만 달러'},
    label: {en: 'Scholarships awarded', ko: '지급된 장학금'},
  },
];
