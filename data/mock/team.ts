import type {TeamMemberDoc} from '@/types/people';

const member = (order: number, en: string, ko: string, title: {en: string; ko: string}): TeamMemberDoc => ({
  _id: `teamMember.${order}`,
  _type: 'teamMember',
  isSample: true,
  order,
  name: {en, ko},
  title,
});

export const team: TeamMemberDoc[] = [
  member(1, 'Eunji Park', '박은지', {en: 'President', ko: '회장'}),
  member(2, 'Michael Cho', '조민수', {en: 'Vice President', ko: '부회장'}),
  member(3, 'Sarah Kim', '김사라', {en: 'Program Director', ko: '프로그램 디렉터'}),
  member(4, 'Joon Lee', '이준', {en: 'Mentorship Coordinator', ko: '멘토십 코디네이터'}),
  member(5, 'Yeji Han', '한예지', {en: 'Events Lead', ko: '행사 담당'}),
  member(6, 'Brian Nam', '남병우', {en: 'Communications Lead', ko: '커뮤니케이션 담당'}),
];
