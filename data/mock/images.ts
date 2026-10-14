import type {ImageAsset, Localized} from '@/types/common';

type Ratio = '3:2' | '16:9' | '1:1';

const SIZES: Record<Ratio, {width: number; height: number}> = {
  '3:2': {width: 1200, height: 800},
  '16:9': {width: 1920, height: 1080},
  '1:1': {width: 800, height: 800},
};

type PhotoSource = {id: string; alt: Localized};

/**
 * Unsplash stand-ins until real ELCA activity photos are available.
 * IDs were verified to resolve; alt text describes what each photo actually shows.
 */
export const photos = {
  cafeMentoring: {
    id: '1522202176988-66273c2fd55f',
    alt: {en: 'Three young adults talking around a café table with laptops', ko: '카페 테이블에서 노트북을 펴고 대화하는 세 명의 청년'},
  },
  communityArmInArm: {
    id: '1529156069898-49953e39b3ac',
    alt: {en: 'A group of friends sitting arm in arm, looking out at the view', ko: '어깨동무를 하고 나란히 앉아 풍경을 바라보는 친구들'},
  },
  meetingTable: {
    id: '1517048676732-d65bc937f952',
    alt: {en: 'People gathered around a wooden table with notebooks during a meeting', ko: '노트를 펴고 나무 테이블에 둘러앉아 회의하는 사람들'},
  },
  stickyNoteWorkshop: {
    id: '1552664730-d307ca884978',
    alt: {en: 'A woman arranging sticky notes on a wall during a team workshop', ko: '팀 워크숍에서 벽에 포스트잇을 붙이는 참가자'},
  },
  seminarAudience: {
    id: '1515187029135-18ee286d815b',
    alt: {en: 'An audience seated in a gallery space listening to a speaker', ko: '갤러리 공간에 앉아 연사의 이야기를 듣는 청중'},
  },
  conferenceHall: {
    id: '1540575467063-178a50c2df87',
    alt: {en: 'Attendees seated in a dimly lit conference hall', ko: '어두운 컨퍼런스 홀에 앉아 있는 참석자들'},
  },
  libraryStudy: {
    id: '1523240795612-9a054b0db644',
    alt: {en: 'Students studying together with laptops in a library', ko: '도서관에서 노트북으로 함께 공부하는 학생들'},
  },
  pairCoding: {
    id: '1531482615713-2afd69097998',
    alt: {en: 'Two people reviewing code together on a laptop', ko: '노트북 화면의 코드를 함께 살펴보는 두 사람'},
  },
  highFive: {
    id: '1600880292203-757bb62b4baf',
    alt: {en: 'Two colleagues giving each other a high five at their desks', ko: '책상에서 하이파이브를 나누는 두 동료'},
  },
  lectureHall: {
    id: '1544531586-fde5298cdd40',
    alt: {en: 'A speaker addressing a full lecture hall', ko: '가득 찬 강의실에서 강연하는 연사'},
  },
  microphone: {
    id: '1475721027785-f74eccf877e2',
    alt: {en: 'A microphone in front of a blurred event audience', ko: '흐릿한 행사장 청중 앞에 놓인 마이크'},
  },
  openOffice: {
    id: '1556761175-b413da4baf72',
    alt: {en: 'A team working at desks in a bright open office', ko: '밝은 오픈 오피스에서 일하는 팀'},
  },
  coworking: {
    id: '1559136555-9303baea8ebd',
    alt: {en: 'A coworking space with long desks and brick walls', ko: '긴 책상과 벽돌 벽이 있는 코워킹 공간'},
  },
  friendsTablet: {
    id: '1543269865-cbf427effbad',
    alt: {en: 'Friends smiling while looking at a tablet together', ko: '태블릿을 함께 보며 웃는 친구들'},
  },
  laptopTable: {
    id: '1521737604893-d14cc237f11d',
    alt: {en: 'People working on laptops at a shared table', ko: '공용 테이블에서 노트북으로 작업하는 사람들'},
  },
  communityDinner: {
    id: '1528605248644-14dd04022da1',
    alt: {en: 'People sharing a meal and conversation at a long table', ko: '긴 테이블에서 식사하며 이야기를 나누는 사람들'},
  },
  stagePresentation: {
    id: '1505373877841-8d25f7d46678',
    alt: {en: 'A presenter on stage in front of a large screen and audience', ko: '대형 스크린 앞 무대에서 발표하는 연사와 청중'},
  },
  classroomTalk: {
    id: '1524178232363-1fb2b075b655',
    alt: {en: 'A presenter leading a session in a classroom-style room', ko: '강의실 형태의 공간에서 세션을 진행하는 발표자'},
  },
  laptopDiscussion: {
    id: '1517245386807-bb43f82c33c4',
    alt: {en: 'A person explaining an idea during a meeting with a laptop', ko: '노트북을 앞에 두고 아이디어를 설명하는 사람'},
  },
  warmFriends: {
    id: '1491438590914-bc09fcaaf77a',
    alt: {en: 'Friends laughing together in warm light', ko: '따뜻한 햇살 속에서 함께 웃는 친구들'},
  },
  handsTogether: {
    id: '1556484687-30636164638b',
    alt: {en: 'Hands of several people resting together on a wooden table', ko: '나무 테이블 위에 모은 여러 사람의 손'},
  },
  techCareer: {
    id: '1573164713988-8665fc963095',
    alt: {en: 'A woman holding a tablet in a server room', ko: '서버실에서 태블릿을 들고 있는 여성'},
  },
  loftMeeting: {
    id: '1557804506-669a67965ba0',
    alt: {en: 'A small team meeting around a whiteboard in a loft office', ko: '로프트 사무실에서 화이트보드 앞에 모인 소규모 팀'},
  },
  networking: {
    id: '1515169067868-5387ec356754',
    alt: {en: 'People chatting with drinks at an evening networking event', ko: '저녁 네트워킹 행사에서 음료를 들고 대화하는 사람들'},
  },
  notetaking: {
    id: '1529070538774-1843cb3265df',
    alt: {en: 'Audience members taking notes during a talk', ko: '강연 중 메모하는 청중'},
  },
  boardroom: {
    id: '1542744173-8e7e53415bb0',
    alt: {en: 'A group meeting around a conference table with laptops', ko: '노트북을 펴고 회의 테이블에 둘러앉은 사람들'},
  },
  financeChart: {
    id: '1543286386-713bdd548da4',
    alt: {en: 'A hand-drawn growth chart on paper next to a ruler and pen', ko: '자와 펜 옆, 종이에 그린 성장 그래프'},
  },
  panelStage: {
    id: '1561489396-888724a1543d',
    alt: {en: 'A panel discussion on a round stage surrounded by an audience', ko: '청중에 둘러싸인 원형 무대 위 패널 토론'},
  },
} satisfies Record<string, PhotoSource>;

export type PhotoKey = keyof typeof photos;

export function photo(key: PhotoKey, ratio: Ratio = '3:2'): ImageAsset {
  const {id, alt} = photos[key];
  const {width, height} = SIZES[ratio];
  return {
    url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`,
    alt,
    width,
    height,
    credit: 'Unsplash',
  };
}
