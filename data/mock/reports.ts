import type {ReportDoc} from '@/types/misc';

export const reports: ReportDoc[] = [
  {
    _id: 'report.financial-2025', _type: 'report', kind: 'financial', year: 2025, isSample: true,
    title: {en: '2025 Financial Statements', ko: '2025 재무제표'},
    summary: {en: 'Statement of financial position and operations for the 2025 fiscal year.', ko: '2025 회계연도 재무상태표 및 운영 보고.'},
  },
  {
    _id: 'report.financial-2024', _type: 'report', kind: 'financial', year: 2024, isSample: true,
    title: {en: '2024 Financial Statements', ko: '2024 재무제표'},
    summary: {en: 'Statement of financial position and operations for the 2024 fiscal year.', ko: '2024 회계연도 재무상태표 및 운영 보고.'},
  },
  {
    _id: 'report.annual-2025', _type: 'report', kind: 'annual', year: 2025, isSample: true,
    title: {en: '2025 Annual Report', ko: '2025 연차 보고서'},
    summary: {en: 'Highlights from Cohorts 11 and 12, events, and scholarships.', ko: '11·12기 활동, 행사, 장학금 하이라이트.'},
  },
  {
    _id: 'report.annual-2024', _type: 'report', kind: 'annual', year: 2024, isSample: true,
    title: {en: '2024 Annual Report', ko: '2024 연차 보고서'},
    summary: {en: 'Highlights from Cohorts 9 and 10 and our community events.', ko: '9·10기 활동과 커뮤니티 행사 하이라이트.'},
  },
];
