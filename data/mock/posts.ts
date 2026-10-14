import {localizedPt} from '@/lib/utils/pt';
import type {PostDoc} from '@/types/event';
import {photo} from './images';

const comms = {en: 'ELCA Communications', ko: 'ELCA 커뮤니케이션팀'};
const team = {en: 'ELCA Team', ko: 'ELCA 팀'};
const sampleNote = {en: 'This story is a sample written for the website prototype.', ko: '이 이야기는 웹사이트 시안을 위해 작성한 샘플입니다.'};

export const posts: PostDoc[] = [
  {
    _id: 'post.from-mentee-to-mentor', _type: 'post', slug: 'from-mentee-to-mentor', kind: 'story', isSample: true,
    title: {en: 'From Mentee to Mentor: Jiwon’s Story', ko: '멘티에서 멘토로: 지원 님의 이야기'},
    excerpt: {en: 'How a Cohort 2 mentee came back to guide the next generation.', ko: '2기 멘티가 다음 세대를 이끄는 멘토로 돌아오기까지.'},
    body: localizedPt({
      en: `When Jiwon joined Cohort 2, she was unsure which major to choose. Her mentor did not hand her an answer — instead, they explored the options together.\n\n## Coming back\n\nYears later, Jiwon returned as a mentor. “I wanted to give someone the same patience I was given,” she says.\n\n${sampleNote.en}`,
      ko: `2기에 처음 참여했을 때 지원 님은 어떤 전공을 선택해야 할지 몰랐습니다. 멘토는 답을 정해 주는 대신 함께 여러 가능성을 살펴봤습니다.\n\n## 다시 돌아오다\n\n몇 년 뒤 지원 님은 멘토로 돌아왔습니다. “제가 받았던 인내심을 누군가에게 똑같이 돌려주고 싶었어요.”\n\n${sampleNote.ko}`,
    }),
    publishedAt: '2026-08-20T09:00:00-04:00',
    author: comms,
    coverImage: photo('highFive'),
  },
  {
    _id: 'post.first-internship-story', _type: 'post', slug: 'first-internship-story', kind: 'story', isSample: true,
    title: {en: 'Landing a First Internship', ko: '첫 인턴십을 얻기까지'},
    excerpt: {en: 'A mentee shares what changed after practising interviews with her mentor.', ko: '멘토와 면접 연습을 한 뒤 무엇이 달라졌는지 한 멘티가 이야기합니다.'},
    body: localizedPt({
      en: `After three rejections, Hayoung asked her mentor to run mock interviews every week.\n\n## What helped\n\n- Practising answers out loud\n- Preparing stories about past projects\n- Asking thoughtful questions at the end\n\n${sampleNote.en}`,
      ko: `세 번의 불합격 뒤, 하영 님은 멘토에게 매주 모의 면접을 부탁했습니다.\n\n## 도움이 된 것들\n\n- 소리 내어 답변 연습하기\n- 지난 프로젝트 경험 정리하기\n- 마지막에 좋은 질문 준비하기\n\n${sampleNote.ko}`,
    }),
    publishedAt: '2026-06-10T09:00:00-04:00',
    author: comms,
    coverImage: photo('openOffice'),
  },
  {
    _id: 'post.building-confidence-through-mentorship', _type: 'post', slug: 'building-confidence-through-mentorship', kind: 'story', isSample: true,
    title: {en: 'Building Confidence, One Conversation at a Time', ko: '대화를 통해 쌓아 가는 자신감'},
    excerpt: {en: 'Why small, regular conversations matter more than big advice.', ko: '거창한 조언보다 작고 꾸준한 대화가 중요한 이유.'},
    body: localizedPt({
      en: `Mentors often say their biggest contribution is simply showing up. Regular check-ins create a space where mentees can try, fail, and try again.\n\n${sampleNote.en}`,
      ko: `멘토들은 가장 큰 기여가 ‘꾸준히 곁에 있는 것’이라고 말합니다. 정기적인 만남은 멘티가 시도하고, 실패하고, 다시 도전할 수 있는 공간이 됩니다.\n\n${sampleNote.ko}`,
    }),
    publishedAt: '2026-02-18T09:00:00-05:00',
    author: comms,
    coverImage: photo('friendsTablet'),
  },
  {
    _id: 'post.junior-mentor-journey', _type: 'post', slug: 'junior-mentor-journey', kind: 'story', isSample: true,
    title: {en: 'The Junior Mentor Journey', ko: '주니어 멘토가 되는 길'},
    excerpt: {en: 'How former mentees take on new responsibilities as junior mentors.', ko: '멘티 출신이 주니어 멘토로서 새로운 역할을 맡게 되는 과정.'},
    body: localizedPt({
      en: `Junior mentors support newer mentees while learning to mentor themselves, with guidance from senior mentors.\n\n${sampleNote.en}`,
      ko: `주니어 멘토는 선배 멘토의 도움을 받으며 새로운 멘티를 지원하고, 스스로도 멘토링을 배워 갑니다.\n\n${sampleNote.ko}`,
    }),
    publishedAt: '2025-10-02T09:00:00-04:00',
    author: comms,
    coverImage: photo('libraryStudy'),
  },
  {
    _id: 'post.cohort-14-applications-open', _type: 'post', slug: 'cohort-14-applications-open', kind: 'news', isSample: true,
    title: {en: 'Cohort 14 Applications Open in January', ko: '14기 지원, 1월에 시작합니다'},
    excerpt: {en: 'Mark your calendar: applications for Cohort 14 open in early January 2027.', ko: '2027년 1월 초, 14기 지원이 시작됩니다. 일정을 미리 확인하세요.'},
    body: localizedPt({
      en: 'Applications for Cohort 14 will open in early January 2027. Mentees will be matched in February.\n\n## How to prepare\n\n- Think about what you want to explore\n- Check that you can meet at least once a month\n- Read the Mentorship page for details\n\nDates in this post are samples.',
      ko: '14기 지원은 2027년 1월 초에 시작되며, 2월에 매칭이 진행됩니다.\n\n## 미리 준비해 주세요\n\n- 탐색하고 싶은 분야 생각해 보기\n- 월 1회 이상 만남이 가능한지 확인하기\n- 멘토십 페이지에서 자세한 내용 읽어 보기\n\n이 글의 일정은 샘플입니다.',
    }),
    publishedAt: '2026-10-01T09:00:00-04:00',
    author: team,
    coverImage: photo('laptopTable'),
  },
  {
    _id: 'post.new-scholarship-fund-2026', _type: 'post', slug: 'new-scholarship-fund-2026', kind: 'news', isSample: true,
    title: {en: 'New Scholarship Fund for Mentees', ko: '멘티를 위한 장학 기금 신설'},
    excerpt: {en: 'Donor support makes a new scholarship fund possible this year.', ko: '후원자 여러분 덕분에 올해 새로운 장학 기금을 마련했습니다.'},
    body: localizedPt({
      en: 'Thanks to community donations, ELCA is expanding its scholarships for outstanding mentees.\n\nDetails in this post are samples.',
      ko: '커뮤니티의 후원 덕분에 ELCA는 우수 멘티를 위한 장학금을 확대합니다.\n\n이 글의 내용은 샘플입니다.',
    }),
    publishedAt: '2026-07-15T09:00:00-04:00',
    author: team,
    coverImage: photo('warmFriends'),
  },
  {
    _id: 'post.new-website-preview', _type: 'post', slug: 'new-website-preview', kind: 'news', isSample: true,
    title: {en: 'Previewing Our New Website', ko: '새 웹사이트를 미리 소개합니다'},
    excerpt: {en: 'A first look at the redesigned ELCA website, now in English and Korean.', ko: '영어와 한국어로 새롭게 단장한 ELCA 웹사이트를 먼저 만나 보세요.'},
    body: localizedPt({
      en: 'We are rebuilding our website to make it easier to apply, find events, and support our programs — in both English and Korean.\n\nThis is a prototype; content may change.',
      ko: '지원하고, 행사를 찾고, 프로그램을 후원하기 쉽도록 영어와 한국어로 웹사이트를 새로 만들고 있습니다.\n\n현재는 시안이며 내용은 바뀔 수 있습니다.',
    }),
    publishedAt: '2026-10-10T09:00:00-04:00',
    author: team,
    coverImage: photo('coworking'),
  },
  {
    _id: 'post.partner-spotlight-2026', _type: 'post', slug: 'partner-spotlight-2026', kind: 'news', isSample: true,
    title: {en: 'Partner Spotlight: Hosting Workshops Together', ko: '파트너 소개: 함께 만드는 워크숍'},
    excerpt: {en: 'How local partners help us host workshops across the GTA.', ko: '지역 파트너들이 광역 토론토 곳곳에서 워크숍 개최를 돕는 방법.'},
    body: localizedPt({
      en: 'Our workshops happen because partners open their spaces and share their expertise.\n\nPartner names in this post are samples.',
      ko: '파트너들이 공간과 전문성을 나눠 준 덕분에 워크숍이 열립니다.\n\n이 글의 파트너 정보는 샘플입니다.',
    }),
    publishedAt: '2026-04-05T09:00:00-04:00',
    author: team,
    coverImage: photo('boardroom'),
  },
];
