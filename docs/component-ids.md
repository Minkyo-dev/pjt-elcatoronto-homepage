# 컴포넌트 ID (디자인 리뷰용)

화면의 각 컴포넌트에 ID를 붙여, 디자인 피드백을 "HOM-03-02 간격 줄이기"처럼 주고받기 위한 체계입니다.

## 보는 법

- 아무 페이지 URL 뒤에 `?ids=1`을 붙이면 색 박스와 ID 라벨이 켜집니다. `?ids=0`이면 꺼집니다.
- 단축키 **Shift+Alt+I**로 켜고 끕니다. 설정은 브라우저에 저장되어 다른 페이지로 이동해도 유지됩니다.
- 라벨을 클릭하면 ID가 클립보드에 복사됩니다. 라벨에 마우스를 올리면 컴포넌트 이름이 보입니다.
- 좌측 하단 배지(`Component IDs · N visible`)를 클릭해도 꺼집니다.
- 배포된 프리뷰에서도 동작합니다. 기본값은 꺼짐이라 일반 방문자에게는 보이지 않습니다.

| 색 | 단계 | 형식 | 예 |
|---|---|---|---|
| 빨강 실선 | 섹션 | `화면-NN` | `HOM-03` |
| 파랑 실선 | 섹션 안 컴포넌트 | `화면-NN-MM` | `HOM-03-05` |
| 초록 점선 | 반복 항목(카드, 행 등). 같은 종류는 같은 ID를 씁니다 | `…a`, `…b` | `HOM-03-05a` |

조건부 요소(빈 상태, 선택 시에만 보이는 항목 등)는 그 요소가 화면에 있을 때만 박스가 그려집니다. 번호는 고정이라, 어떤 요소가 빠져도 뒤 번호가 당겨지지 않습니다.

## 화면 코드

| 코드 | 화면 | 경로 |
|---|---|---|
| GLB | 공통 (헤더, 모바일 메뉴, 푸터, 플로팅 버튼) | 모든 화면 |
| HOM | 홈 | `/` |
| ABT | About ELCA | `/about` |
| RPT | Reports | `/about/reports` |
| MSP | Mentorship | `/get-involved/mentorship` |
| MTR | Mentors | `/get-involved/mentors` |
| DON | Donate | `/get-involved/donate` |
| EVT | Events & News | `/events-news` |
| EVD | 이벤트·워크숍 상세 | `/events-news/[slug]` |
| NWS | 스토리·뉴스 상세 | `/events-news/[slug]` |
| CON | Contact Us | `/contact` |
| ERR | 404 | 없는 경로 |

## 코드에서 찾기

ID는 소스에 문자열로 들어 있습니다. `grep -rn "HOM-03" app components`로 위치를 찾을 수 있습니다. 하위 ID 중에는 컴포넌트가 상위 ID에서 자동으로 만드는 것도 있습니다(Hero, FAQSection, CTASection, SponsorBar, 목록 컴포넌트). 이런 ID는 상위 ID로 검색하세요. 규칙과 헬퍼는 `lib/utils/cid.ts`에, 오버레이는 `components/layout/ComponentIdOverlay.tsx`에 있습니다.

새 컴포넌트를 추가할 때:
- 공용 컴포넌트는 `cid?: string` prop을 받아 루트 요소에 `{...cidAttrs(cid, 'Name')}`를 붙입니다.
- 페이지에서는 다음 번호를 이어서 부여합니다.
- 기존 ID는 재사용하거나 바꾸지 않습니다. 디자인 노트가 그 ID를 참조하고 있기 때문입니다.
- `tests/e2e/component-ids.spec.ts`가 형식, 중복, 화면 코드를 검사합니다.

---

## GLB — 공통

| ID | 컴포넌트 | 설명 |
|---|---|---|
| GLB-01 | Header | 상단 헤더 |
| GLB-01-01 | Logo | 로고 |
| GLB-01-02 | DesktopNav | 데스크톱 내비게이션 (드롭다운 포함) |
| GLB-01-03 | LanguageSwitcher | 언어 전환 EN / KO |
| GLB-01-04 | Button | 헤더 Donate 버튼 |
| GLB-01-05 | MobileNavButton | 모바일 메뉴 열기 버튼 |
| GLB-02 | Dialog | 모바일 메뉴 드로어 |
| GLB-02-01 | MobileNavLinks | 드로어 메뉴 링크 |
| GLB-02-02 | MobileNavActions | 드로어 하단 언어 전환 + Donate |
| GLB-03 | PreFooterCTA | 푸터 위 CTA 띠 |
| GLB-03-01 | CTAText | CTA 제목·본문 |
| GLB-03-02 | CTAButtons | CTA 버튼 그룹 |
| GLB-04 | Container | 푸터 본문 |
| GLB-04-01 | FooterBrand | 로고·단체명·소개·SNS |
| GLB-04-02 | FooterLinks | Explore 링크 열 |
| GLB-04-03 | FooterLinks | Get Involved 링크 열 |
| GLB-04-04 | FooterContact | 연락처·뉴스레터 열 |
| GLB-04-05 | NewsletterForm | 뉴스레터 구독 폼 |
| GLB-05 | FooterBottomBar | 저작권·개인정보 바 |
| GLB-06 | FloatingActions | 우측 하단 플로팅 버튼 (맨 위로, 문의) |

## HOM — 홈 `/`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| HOM-01 | HeroCarousel | 히어로 캐러셀 |
| HOM-01-01 | Slides | 슬라이드 영역 |
| HOM-01-01a | Slide | 개별 슬라이드 (활성 슬라이드만 보임) |
| HOM-01-02 | SlideEyebrow | 슬라이드 아이브로우 |
| HOM-01-03 | FlagBadges | 슬라이드 플래그 배지 |
| HOM-01-04 | SlideTitle | 슬라이드 제목 |
| HOM-01-05 | SlideBody | 슬라이드 본문 |
| HOM-01-06 | SlideCTAs | 슬라이드 CTA 버튼 그룹 |
| HOM-01-07 | PrevButton | 이전 슬라이드 버튼 |
| HOM-01-08 | NextButton | 다음 슬라이드 버튼 |
| HOM-01-09 | PlayPauseButton | 자동재생 일시정지/재생 |
| HOM-01-10 | SlideIndicators | 슬라이드 인디케이터 |
| HOM-01-10a | SlideIndicator | 인디케이터 점 |
| HOM-02 | SponsorBar | 후원사 바 |
| HOM-02-01 | SponsorTitle | 후원사 제목 |
| HOM-02-02 | SponsorList | 후원사 로고 목록 |
| HOM-02-02a | SponsorLogo | 후원사 로고 |
| HOM-03 | Section | 목적 (Purpose) |
| HOM-03-01 | SectionHeading | 섹션 제목 |
| HOM-03-02 | PurposeBody | 목적 설명 문단 |
| HOM-03-03 | FlagBadges | 플래그 배지 |
| HOM-03-04 | Button | About ELCA 버튼 |
| HOM-03-05 | CardGrid | 핵심 가치 카드 그리드 |
| HOM-03-05a | Card | 가치 카드 |
| HOM-04 | Section | 임팩트 |
| HOM-04-01 | SectionHeading | 섹션 제목 |
| HOM-04-02 | StatGrid | 통계 그리드 |
| HOM-04-02a | Stat | 통계 항목 |
| HOM-05 | Section | 멘토십 미리보기 |
| HOM-05-01 | SectionHeading | 섹션 제목 |
| HOM-05-02 | Button | Explore Mentorship 버튼 (제목 우측) |
| HOM-05-03 | FlagBadges | 플래그 배지 |
| HOM-05-04 | CardGrid | 멘토십 항목 카드 그리드 |
| HOM-05-04a | Card | 멘토십 항목 카드 |
| HOM-06 | Section | 추천 멘토 |
| HOM-06-01 | SectionHeading | 섹션 제목 |
| HOM-06-02 | Button | 전체 멘토 보기 버튼 |
| HOM-06-03 | Scroller | 멘토 가로 스크롤러 (좌우 버튼 포함) |
| HOM-06-03a | MentorCard | 멘토 카드 |
| HOM-07 | Section | 이벤트·소식 하이라이트 |
| HOM-07-01 | SectionHeading | 섹션 제목 |
| HOM-07-02 | Button | 전체 보기 버튼 |
| HOM-07-03 | HighlightList | 하이라이트 카드 목록 |
| HOM-07-03a | EventCard / NewsCard | 이벤트 또는 뉴스 카드 |
| HOM-08 | Section | 후기 |
| HOM-08-01 | SectionHeading | 섹션 제목 |
| HOM-08-02 | Scroller | 후기 가로 스크롤러 |
| HOM-08-02a | TestimonialCard | 후기 카드 |
| HOM-09 | Section | 참여하기 |
| HOM-09-01 | SectionHeading | 섹션 제목 (가운데 정렬) |
| HOM-09-02 | GetInvolvedCards | 참여 방법 카드 그리드 |
| HOM-09-02a | GetInvolvedCard | 참여 방법 카드 |
| HOM-10 | FAQSection | FAQ |
| HOM-10-01 | SectionHeading | FAQ 제목 |
| HOM-10-02 | Accordion | FAQ 아코디언 |
| HOM-10-02a | AccordionItem | FAQ 항목 |
| HOM-11 | Dialog | 멘토 프로필 다이얼로그 (멘토 카드에서 열림) |
| HOM-11-01 | ProfileHeader | 아바타·직함·회사 |
| HOM-11-02 | ProfileDetails | 지역·기수 정보 |
| HOM-11-03 | ProfileBio | 소개글 |
| HOM-11-04 | ProfileExpertise | 전문 분야 태그 |
| HOM-11-05 | Button | LinkedIn 버튼 |
| HOM-11-06 | FlagBadges | 플래그 배지 |

## ABT — About ELCA `/about`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| ABT-01 | Hero | 히어로 (typography) |
| ABT-01-01 | Eyebrow | 아이브로우 |
| ABT-01-02 | HeroTitle | 페이지 제목 (h1) |
| ABT-01-03 | HeroBody | 히어로 본문 |
| ABT-01-04 | HeroCTAs | CTA 버튼 그룹 |
| ABT-02 | Section | 목적 & 가치 |
| ABT-02-01 | SectionHeading | 섹션 제목 |
| ABT-02-02 | PurposeBody | 목적 설명 문단 |
| ABT-02-03 | ValuesEyebrow | 핵심 가치 라벨 |
| ABT-02-04 | CardGrid | 핵심 가치 카드 그리드 |
| ABT-02-04a | Card | 가치 카드 |
| ABT-03 | Section | 미션 & 비전 |
| ABT-03-01 | MissionVisionGrid | 미션·비전 2단 그리드 |
| ABT-03-01a | MissionVisionCard | 미션 카드 / 비전 카드 |
| ABT-03-02 | FlagBadges | 플래그 배지 |
| ABT-04 | Section | 연혁 (Our Story) |
| ABT-04-01 | SectionHeading | 섹션 제목 |
| ABT-04-02 | HistoryTimeline | 연혁 타임라인 |
| ABT-04-02a | HistoryEntry | 연혁 항목 |
| ABT-05 | Section | 임팩트 |
| ABT-05-01 | SectionHeading | 섹션 제목 |
| ABT-05-02 | StatGrid | 통계 그리드 |
| ABT-05-02a | Stat | 통계 항목 |
| ABT-05-03 | CardGrid | 사례 카드 그리드 |
| ABT-05-03a | Card | 사례 카드 |
| ABT-05-04 | FlagBadges | 플래그 배지 |
| ABT-06 | Section | 리더십 & 팀 |
| ABT-06-01 | SectionHeading | 섹션 제목 |
| ABT-06-02 | TeamGrid | 팀원 그리드 |
| ABT-06-02a | TeamCard | 팀원 카드 |
| ABT-07 | Section | 보고서 티저 |
| ABT-07-01 | SectionHeading | 섹션 제목 |
| ABT-07-02 | Button | View Reports 버튼 |
| ABT-08 | FAQSection | Q&A |
| ABT-08-01 | SectionHeading | Q&A 제목 |
| ABT-08-02 | Accordion | Q&A 아코디언 |
| ABT-08-02a | AccordionItem | Q&A 항목 |
| ABT-09 | CTASection | 하단 CTA |
| ABT-09-01 | CTAText | CTA 제목·본문 |
| ABT-09-02 | CTAButtons | CTA 버튼 그룹 |

## RPT — Reports `/about/reports`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| RPT-01 | Hero | 히어로 (typography) |
| RPT-01-01 | Eyebrow | 아이브로우 |
| RPT-01-02 | HeroTitle | 페이지 제목 (h1) |
| RPT-01-03 | HeroBody | 히어로 본문 |
| RPT-01-04 | HeroCTAs | CTA 버튼 그룹 (있을 때만) |
| RPT-02 | Section | 보고서 목록 |
| RPT-02-01 | Tabs | 재무/연간 보고서 탭 (탭 + 패널 전체) |
| RPT-02-02 | ReportList / EmptyState | 보고서 목록, 결과가 없으면 빈 상태 |
| RPT-02-02a | ReportRow | 보고서 행 (연도·제목·요약·파일 버튼) |

## MSP — Mentorship `/get-involved/mentorship`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| MSP-01 | Hero | 히어로 (photo) |
| MSP-01-01 | Eyebrow | 아이브로우 |
| MSP-01-02 | HeroTitle | 페이지 제목 (h1) |
| MSP-01-03 | HeroBody | 히어로 본문 |
| MSP-01-04 | HeroCTAs | CTA 버튼 그룹 |
| MSP-02 | Section | 프로그램 제공 내용 (What We Offer) |
| MSP-02-01 | SectionHeading | 섹션 제목 |
| MSP-02-02 | FlagBadges | 플래그 배지 |
| MSP-02-03 | CardGrid | 혜택 카드 그리드 |
| MSP-02-03a | Card | 혜택 카드 |
| MSP-03 | InlineCTA | Become a Mentee 띠배너 |
| MSP-03-01 | InlineCTATitle | 띠배너 문구 |
| MSP-03-02 | Button | Apply 버튼 |
| MSP-04 | Section | 지원 자격 |
| MSP-04-01 | SectionHeading | 섹션 제목 |
| MSP-04-02 | EligibilityList | 자격 조건 목록 |
| MSP-04-02a | EligibilityItem | 자격 조건 항목 |
| MSP-04-03 | FlagBadges | 플래그 배지 |
| MSP-05 | Section | 지원 절차 |
| MSP-05-01 | SectionHeading | 섹션 제목 |
| MSP-05-02 | StepList | 단계 목록 |
| MSP-05-02a | Step | 단계 카드 |
| MSP-05-03 | FlagBadges | 플래그 배지 |
| MSP-06 | Section | 프로그램 세부 정보 |
| MSP-06-01 | SectionHeading | 섹션 제목 |
| MSP-06-02 | ProgramDetailList | 세부 정보 목록 |
| MSP-06-02a | ProgramDetailItem | 세부 정보 카드 |
| MSP-06-03 | FlagBadges | 플래그 배지 |
| MSP-07 | Section | 기대 성과 |
| MSP-07-01 | SectionHeading | 섹션 제목 |
| MSP-07-02 | CardGrid | 성과 카드 그리드 |
| MSP-07-02a | Card | 성과 카드 |
| MSP-08 | Section | 성공 사례 |
| MSP-08-01 | SectionHeading | 섹션 제목 |
| MSP-08-02 | StoryList | 멘티 후기 목록 |
| MSP-08-02a | TestimonialCard | 멘티 후기 카드 |
| MSP-09 | Section | 지원하기 (#apply) |
| MSP-09-01 | SectionHeading | 섹션 제목·본문 |
| MSP-09-02 | ApplyKeyDates | 다음 기수·마감일 정보 |
| MSP-09-02a | ApplyKeyDate | 날짜 정보 카드 |
| MSP-09-03 | FlagBadges | 플래그 배지 |
| MSP-09-04 | Button | Apply Now 버튼 (다이얼로그 열기) |
| MSP-10 | FAQSection | FAQ |
| MSP-10-01 | SectionHeading | FAQ 제목 |
| MSP-10-02 | Accordion | FAQ 아코디언 |
| MSP-10-02a | AccordionItem | FAQ 항목 |
| MSP-11 | Dialog | 멘티 지원 다이얼로그 |
| MSP-11-01 | MenteeApplyForm | 멘티 지원 폼 |

## MTR — Mentors `/get-involved/mentors`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| MTR-01 | Hero | 히어로 (typography) |
| MTR-01-01 | Eyebrow | 아이브로우 |
| MTR-01-02 | HeroTitle | 페이지 제목 (h1) |
| MTR-01-03 | HeroBody | 히어로 본문 |
| MTR-01-04 | HeroCTAs | CTA 버튼 그룹 |
| MTR-02 | Section | 추천 멘토 |
| MTR-02-01 | SectionHeading | 섹션 제목 |
| MTR-02-02 | MentorGrid | 추천 멘토 그리드 |
| MTR-02-02a | MentorCard | 멘토 카드 |
| MTR-03 | Section | 멘토 디렉터리 |
| MTR-03-01 | SectionHeading | 섹션 제목·소개 |
| MTR-03-02 | MentorSearch | 이름 검색 입력 |
| MTR-03-03 | ResultCount | 검색 결과 수 |
| MTR-03-04 | MentorGrid | 멘토 그리드 |
| MTR-03-04a | MentorCard | 멘토 카드 |
| MTR-03-05 | EmptyState | 검색 결과 없음 (그리드 대신 표시) |
| MTR-03-06 | Button | Load more 버튼 |
| MTR-04 | CTASection | Become a Mentor (#become-a-mentor) |
| MTR-04-01 | CTAText | CTA 제목·본문 |
| MTR-04-02 | CTAButtons | CTA 버튼 그룹 |
| MTR-05 | Dialog | 멘토 프로필 다이얼로그 (추천 멘토·디렉터리 공통) |
| MTR-05-01 | ProfileHeader | 아바타·직함·회사 |
| MTR-05-02 | ProfileDetails | 지역·기수 정보 |
| MTR-05-03 | ProfileBio | 소개글 |
| MTR-05-04 | ProfileExpertise | 전문 분야 태그 |
| MTR-05-05 | Button | LinkedIn 버튼 |
| MTR-05-06 | FlagBadges | 플래그 배지 |

## DON — Donate `/get-involved/donate`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| DON-01 | Hero | 히어로 (photo) |
| DON-01-01 | Eyebrow | 아이브로우 |
| DON-01-02 | HeroTitle | 페이지 제목 (h1) |
| DON-01-03 | HeroBody | 히어로 본문 |
| DON-01-04 | HeroCTAs | CTA 버튼 그룹 |
| DON-02 | Section | 후원 이유 |
| DON-02-01 | SectionHeading | 섹션 제목·본문 |
| DON-02-02 | FlagBadges | 플래그 배지 |
| DON-02-03 | CardGrid | 후원 이유 카드 그리드 |
| DON-02-03a | Card | 후원 이유 카드 |
| DON-03 | Section | 후원 임팩트 |
| DON-03-01 | SectionHeading | 섹션 제목·소개 |
| DON-03-02 | ImpactTierList | 금액별 임팩트 목록 |
| DON-03-02a | ImpactTier | 금액별 임팩트 카드 |
| DON-04 | Section | 기금 사용처 |
| DON-04-01 | SectionHeading | 섹션 제목 |
| DON-04-02 | FundUsageList | 사용 비율 목록 |
| DON-04-02a | FundUsageItem | 사용처 항목 + 비율 막대 |
| DON-04-03 | FlagBadges | 플래그 배지 |
| DON-05 | Section | 후원 옵션 (#donation-options) |
| DON-05-01 | SectionHeading | 섹션 제목·소개 |
| DON-05-02 | DonationSelector | 후원 선택 폼 (주기·금액·정보·요약·제출) |
| DON-06 | FAQSection | FAQ |
| DON-06-01 | SectionHeading | FAQ 제목 |
| DON-06-02 | Accordion | FAQ 아코디언 |
| DON-06-02a | AccordionItem | FAQ 항목 |

## EVT — Events & News `/events-news`

EVT-04~07은 카테고리 탭(EVT-03-01) 패널 안에 있어서, 박스도 EVT-03 박스 안쪽에 그려집니다. 선택한 카테고리에 따라 일부 섹션은 숨겨집니다.

| ID | 컴포넌트 | 설명 |
|---|---|---|
| EVT-01 | Hero | 히어로 (typography) |
| EVT-01-01 | Eyebrow | 아이브로우 |
| EVT-01-02 | HeroTitle | 페이지 제목 (h1) |
| EVT-01-03 | HeroBody | 히어로 본문 |
| EVT-01-04 | HeroCTAs | CTA 버튼 그룹 |
| EVT-02 | Section | 추천 콘텐츠 (featured가 있을 때만) |
| EVT-02-01 | SectionHeading | 섹션 제목 |
| EVT-02-02 | FeaturedContentCard | 추천 콘텐츠 큰 카드 |
| EVT-03 | Section | 카테고리 탐색 |
| EVT-03-01 | Tabs | 카테고리 탭 (All/Workshops/Events/Stories/News) |
| EVT-04 | Section | 예정 이벤트 (#events) |
| EVT-04-01 | SectionHeading | 섹션 제목 |
| EVT-04-02 | CardList | 이벤트 카드 목록 |
| EVT-04-02a | EventCard | 이벤트 카드 |
| EVT-04-03 | Button | Load more 버튼 |
| EVT-04-04 | EmptyState | 결과 없음 |
| EVT-05 | Section | 이벤트 타임라인 |
| EVT-05-01 | SectionHeading | 섹션 제목 |
| EVT-05-02 | EventTimeline | 연도별 타임라인 |
| EVT-05-02a | TimelineYear | 연도 행 |
| EVT-05-02b | TimelineEvent | 이벤트 행 |
| EVT-06 | Section | 최신 소식 |
| EVT-06-01 | SectionHeading | 섹션 제목 |
| EVT-06-02 | CardList | 뉴스 카드 목록 |
| EVT-06-02a | NewsCard | 뉴스 카드 |
| EVT-06-03 | Button | Load more 버튼 |
| EVT-06-04 | EmptyState | 결과 없음 |
| EVT-07 | Section | 지난 이벤트 사진 리캡 |
| EVT-07-01 | SectionHeading | 섹션 제목 |
| EVT-07-02 | Gallery | 사진 갤러리 |
| EVT-07-02a | GalleryPhoto | 갤러리 사진 |
| EVT-07-02b | Button | 갤러리 Load more 버튼 |
| EVT-07-02c | Dialog | 사진 라이트박스 |
| EVT-07-03 | EmptyState | 사진 없음 |
| EVT-08 | Section | 이벤트 개최·요청 |
| EVT-08-01 | SectionHeading | 섹션 제목 |
| EVT-08-02 | Tabs | Host / Request 탭 |
| EVT-08-03 | HostEventForm / RequestEventForm | 선택한 탭의 신청 폼 |
| EVT-09 | FAQSection | Q&A |
| EVT-09-01 | SectionHeading | Q&A 제목 |
| EVT-09-02 | Accordion | Q&A 아코디언 |
| EVT-09-02a | AccordionItem | Q&A 항목 |

## EVD — 이벤트·워크숍 상세 `/events-news/[slug]`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| EVD-01 | DetailHeader | 상세 헤더 |
| EVD-01-01 | Breadcrumb | 브레드크럼 |
| EVD-01-02 | BadgeRow | 카테고리·상태·플래그 배지 |
| EVD-01-03 | Title | 이벤트 제목 (h1) |
| EVD-01-04 | Summary | 요약문 |
| EVD-01-05 | DetailList | 일시·장소·대상·정원 목록 |
| EVD-01-05a | DetailItem | 정보 항목 |
| EVD-01-06 | Button | Register 바로가기 (예정 이벤트만) |
| EVD-02 | Section | 본문 |
| EVD-02-01 | ImageFrame | 대표 이미지 |
| EVD-02-02 | RichText | 본문 |
| EVD-02-03 | Agenda | 아젠다 (있을 때만) |
| EVD-02-03a | AgendaItem | 아젠다 항목 |
| EVD-02-04 | RegisterPanel | 등록 패널 (#register, 예정 이벤트만) |
| EVD-02-05 | EventRegisterForm | 등록 폼 (예정 이벤트만) |
| EVD-03 | Section | 사진 리캡 (지난 이벤트 + 사진이 있을 때) |
| EVD-03-01 | SectionHeading | 섹션 제목 |
| EVD-03-02 | Gallery | 사진 갤러리 |
| EVD-03-02a | GalleryPhoto | 갤러리 사진 |
| EVD-03-02b | Button | 갤러리 Load more 버튼 |
| EVD-03-02c | Dialog | 사진 라이트박스 |
| EVD-04 | RelatedContent | 관련 콘텐츠 |
| EVD-04-01 | SectionHeading | 섹션 제목 |
| EVD-04-02 | RelatedList | 관련 카드 목록 |
| EVD-04-02a | EventCard / NewsCard | 관련 콘텐츠 카드 |

## NWS — 스토리·뉴스 상세 `/events-news/[slug]`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| NWS-01 | DetailHeader | 상세 헤더 |
| NWS-01-01 | Breadcrumb | 브레드크럼 |
| NWS-01-02 | BadgeRow | 카테고리·플래그 배지 |
| NWS-01-03 | Title | 글 제목 (h1) |
| NWS-01-04 | PostMeta | 게시일·작성자 |
| NWS-02 | Section | 본문 |
| NWS-02-01 | ImageFrame | 대표 이미지 |
| NWS-02-02 | RichText | 본문 |
| NWS-03 | RelatedContent | 관련 콘텐츠 |
| NWS-03-01 | SectionHeading | 섹션 제목 |
| NWS-03-02 | RelatedList | 관련 카드 목록 |
| NWS-03-02a | EventCard / NewsCard | 관련 콘텐츠 카드 |

## CON — Contact Us `/contact`

| ID | 컴포넌트 | 설명 |
|---|---|---|
| CON-01 | Hero | 히어로 (typography) |
| CON-01-01 | Eyebrow | 아이브로우 |
| CON-01-02 | HeroTitle | 페이지 제목 (h1) |
| CON-01-03 | HeroBody | 히어로 본문 |
| CON-01-04 | HeroCTAs | CTA 버튼 그룹 |
| CON-02 | Section | 연락처 정보 |
| CON-02-01 | SectionHeading | 섹션 제목 |
| CON-02-02 | InfoCards | 연락처 카드 3열 |
| CON-02-02a | EmailCard | 이메일 카드 |
| CON-02-02b | LocationCard | 위치 카드 |
| CON-02-02c | SocialCard | SNS 카드 |
| CON-03 | Section | 문의 폼 (#contact-form) |
| CON-03-01 | SectionHeading | 섹션 제목·소개 (좌측 열) |
| CON-03-02 | ContactForm | 문의 폼 (우측 열) |
| CON-04 | Section | 위치 |
| CON-04-01 | SectionHeading | 섹션 제목 |
| CON-04-02 | MapPlaceholder | 지도 자리표시 |
| CON-05 | FAQSection | FAQ / Support |
| CON-05-01 | SectionHeading | FAQ 제목 |
| CON-05-02 | Accordion | FAQ 아코디언 |
| CON-05-02a | AccordionItem | FAQ 항목 |

## ERR — 404

| ID | 컴포넌트 | 설명 |
|---|---|---|
| ERR-01 | Section | 404 섹션 |
| ERR-01-01 | NotFoundTitle | 404 제목 (h1) |
| ERR-01-02 | NotFoundBody | 안내 문단 |
| ERR-01-03 | Button | 홈으로 버튼 |
