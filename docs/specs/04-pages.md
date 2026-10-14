# 04. 페이지별 설계 (Pages)

## 표기
- **병합 원칙:** 원본의 기본 섹션 순서와 "페이지별 추가 지시"가 충돌하면 추가 지시를 우선하고 두 목록을 병합한다 (Decision D3).
- 모든 경로 앞에는 `/{locale}`이 붙는다(`/en`, `/ko`). 아래에서는 생략한다.
- `[S]` = `isSample` (SAMPLE 배지), `[R]` = `needsReview` (검수 배지).
- 모든 FAQ·Q&A는 Accordion이다.
- 섹션의 문구(제목·설명·CTA 라벨)는 해당 페이지 singleton(`homePage` 등) mock에서 오고, 목록은 컬렉션 mock에서 온다 ([05-data-model.md](05-data-model.md)).

## 라우트 요약

| # | 경로 | 페이지 | Hero | Primary CTA |
|---|---|---|---|---|
| 1 | `/` | Home | HeroCarousel (사진) | Explore Mentorship → `/get-involved/mentorship` |
| 2 | `/about` | About ELCA | typography | Get Involved → `/get-involved/mentorship` |
| 3 | `/about/reports` | Reports | typography | — |
| 4 | `/get-involved/mentorship` | Mentorship | photo | Apply for Mentorship → `#apply` |
| 5 | `/get-involved/mentors` | Mentors | typography | Become a Mentor → `/contact?topic=mentor` |
| 6 | `/get-involved/donate` | Donate | photo | Make a Donation → `#donation-options` |
| 7 | `/events-news` | Events & News | typography | View Upcoming Events → `#events` |
| 8 | `/events-news/[slug]` | Event / News 상세 | 상세 헤더 | Register (Demo) → `#register` (예정 이벤트만) |
| 9 | `/contact` | Contact Us | typography | Send Message (Demo) → `#contact-form` |

---

## 1. Home `/`

**목적:** 브랜드와 멘토십 가치를 빠르게 소개하고 멘티 신청·멘토 지원·이벤트 참여·후원으로 유도.

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **HeroCarousel** | 사진 배경 + 어두운 오버레이 + 큰 제목(`h1`은 첫 슬라이드 제목) + CTA. 3 슬라이드:<br>① **Overview** — 간단 소개 + "Become a Mentee" → `/get-involved/mentorship` (보조 버튼 "Explore Mentorship")<br>② **Become a Mentor** — 설명 + 버튼 → `/get-involved/mentors#become-a-mentor`<br>③ **Upcoming Event** — 대표 예정 이벤트 이미지·제목·날짜 → 해당 `/events-news/[slug]` | `homePage.heroSlides`, ③은 `featured` 예정 이벤트 참조 |
| 2 | **SponsorBar** | 후원사 로고(워드마크 placeholder) 가로 배열 `[S]` | `sponsor[]` |
| 3 | **Values / Purpose** | 요약·개요 문단 + Value 카드 3–4개 + "About ELCA" 링크 (원본 About Preview 병합) | `homePage.purpose`, `coreValue[]` (aboutPage와 공유) |
| 4 | **Impact (cohorts)** | 핵심 수치: 12개 cohort `[R]`, 약 200명 멘티 `[R]`, 2019년 설립 `[R]` + 보조 수치(멘토 수 등) `[S]` | `stat[]` (group: `home`) |
| 5 | **Mentorship Preview** | 핵심 혜택 3개 + 진행 방식 요약 + "Explore Mentorship" | `homePage.mentorshipPreview` |
| 6 | **Featured Mentors** | MentorCarousel(사진 없는 카드) + "View all mentors" → `/get-involved/mentors`. 카드 클릭 시 MentorProfileDialog | `getFeaturedMentors()` |
| 7 | **Events & News** | 최신 3건(예정 이벤트 우선, 부족하면 최신 포스트로 채움) + "View all" → `/events-news` | `getLatestHighlights(3)` |
| 8 | **Testimonials** | 멘티·멘토 후기 카드 **가로 스크롤** (TestimonialScroller) | `testimonial[]` |
| 9 | **Get Involved CTA** | 카드 3개: Become a Mentee / Become a Mentor / Donate(accent) | `homePage.getInvolved` |
| 10 | **FAQ** | 4–6개 | `faq[]` (group: `home`) |

**Hero 캐러셀 동작:** 자동 재생 7초 간격, 일시정지/재생 버튼, 이전/다음, 인디케이터. hover·focus 시 일시정지, reduced-motion이면 자동 재생 없음. 슬라이드 데이터는 `media: { type: 'image' | 'video' }`를 지원하되 Phase 1은 이미지만 사용.

---

## 2. About ELCA `/about`

**목적:** 조직의 목적, 비전, 역사, 팀 소개.

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **Intro** (typography Hero) | 제목 + 조직 소개 + "Get Involved" → `/get-involved/mentorship` | `aboutPage.hero` |
| 2 | **Purpose & Values** | Purpose 문단 + Core Value 카드 | `aboutPage.purpose`, `coreValue[]` |
| 3 | **Mission & Vision** | 2단 배치 (mobile 1단) | `aboutPage.mission`, `aboutPage.vision` |
| 4 | **Our Story** | 타임라인. 2019 설립 `[R]`, 2020 첫 cohort `[R]`, 그 외 `[S]` | `timelineEntry[]` (group: `history`) |
| 5 | **Our Impact** | StatGrid + 짧은 사례 1–2개 | `stat[]` (group: `about`) |
| 6 | **Leadership & Team** | TeamCard 그리드(이니셜 아바타) `[S]` | `teamMember[]` |
| 7 | **Reports 티저** | 설명 + "View Reports" → `/about/reports` | `aboutPage.reportsTeaser` |
| 8 | **Q&A** | Accordion | `faq[]` (group: `about`) |
| 9 | **Get Involved CTA** | CTASection | `aboutPage.cta` |

## 3. Reports `/about/reports`

| 순서 | 섹션 | 내용 |
|---|---|---|
| 1 | typography Hero | 제목 + 투명성 안내 문구 |
| 2 | **Tabs** | Financial Statements / Annual Reports |
| 3 | 연도별 목록 | 연도(내림차순), 제목, 요약, 파일 버튼. 전체 `[S]` |

- `report.file`이 없으면 버튼은 비활성 + "Sample — file not available" 표시. Phase 2에서 Sanity file asset으로 연결.
- 결과가 없는 탭은 EmptyState.

---

## 4. Mentorship `/get-involved/mentorship`

**목적:** 프로그램 혜택·절차·대상 안내와 신청 유도.

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **Program Hero** (photo) | 멘토십 소개 + "Apply for Mentorship" → `#apply` | `mentorshipPage.hero` |
| 2 | **What We Offer** | 요약·개요 + 혜택(Benefit) 카드 | `mentorshipPage.offer` |
| 3 | **Become a Mentee 띠배너** | 한 줄 메시지 + "Apply" → `#apply` | `mentorshipPage.inlineCta` |
| 4 | **Who Can Apply** | 자격 조건 목록 | `mentorshipPage.eligibility` |
| 5 | **Application Phase** | 단계: 모집(1월·7월 `[R]`) → 지원서 제출 → 매칭 → Kickoff → 활동 → 수료. 각 단계 기간 `[S]` | `mentorshipPage.process` |
| 6 | **Program Details** | 기간·방식·형식(온/오프라인, 빈도) `[S]` | `mentorshipPage.details` |
| 7 | **What You'll Achieve** | 성과 항목 카드 | `mentorshipPage.outcomes` |
| 8 | **Success Stories** | TestimonialCard (멘티 후기) | `testimonial[]` (author: `mentee`) |
| 9 | **Apply** `#apply` | 다음 cohort 안내(모집 기간·시작일 `[S]`) + "Apply Now (Demo)" → **MenteeApplyDialog** | `mentorshipPage.apply` |
| 10 | **FAQ** | Accordion | `faq[]` (group: `mentorship`) |

**MenteeApplyDialog (데모 폼):** 이름*, 이메일*, 학교/학년*, 관심 분야(다중 선택)*, 지원 동기(최대 500자). 검증만 수행하고 DEMO 상태 표시.

---

## 5. Mentors `/get-involved/mentors`

**목적:** 멘토 프로필 탐색.

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **Intro** (typography Hero) | 제목 + 디렉터리 소개 + "Become a Mentor" → `/contact?topic=mentor` | `mentorsPage.hero` |
| 2 | **Featured Mentors** | 4명 (MentorGrid) | `getFeaturedMentors(4)` |
| 3 | **Directory** | 이름 검색 입력 + 결과 수(`aria-live`) + MentorGrid(4/2/1열) + "Load more"(12명 단위) + 결과 없음 EmptyState("검색어 지우기" 액션) | `getMentors()` |
| 4 | **Profile Dialog** | 카드의 "View Profile"로 열림 | — |
| 5 | **Become a Mentor** `#become-a-mentor` | CTASection → `/contact?topic=mentor` | `mentorsPage.cta` |

### MentorCard 필드 (Decision D5)
이름, 직함(직업), 직장, 지역(location), **출신 cohort + 직함**(예: "Cohort 3 Mentee → Mentor" / "3기 멘티 → 현 멘토"), "View Profile" 버튼. **사진·별점 없음** — 이니셜 Avatar.

### Profile Dialog 필드
카드 필드 전체 + 소개(bio), 전문 분야 태그, LinkedIn 링크(있을 때).

### 검색 동작
- 대상: 현재 로케일 이름 + 다른 로케일 이름(한글·영문 이름 모두 검색되도록). 대소문자·앞뒤 공백 무시.
- 입력 즉시 필터링(`useDeferredValue`로 입력 지연 없이 처리). 검색어가 바뀌면 "Load more" 페이지를 초기화.
- industry / role / location 필터는 **UI 없음**. 데이터 필드만 예약.

---

## 6. Donate `/get-involved/donate`

**목적:** 후원 필요성과 활용 설명, 후원 유도.

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **Donation Hero** (photo) | 후원 메시지 + "Make a Donation" → `#donation-options` | `donatePage.hero` |
| 2 | **Why Donate** | 장학금·세미나·멘토십 운영 등 `[R]` | `donatePage.why` |
| 3 | **Donation Impact** | 금액별 영향 카드($25 / $50 / $100 / $250) `[S]` | `donationTier[]` |
| 4 | **How Funds Are Used** | 항목별 비율 막대 + 범례 `[S]` | `donatePage.fundUsage` |
| 5 | **Donation Options** `#donation-options` | DonationSelector (아래) | `donationTier[]` |
| 6 | **FAQ** | 세금 영수증 관련 답변 `[R]` (자선단체 등록 여부 미확인) | `faq[]` (group: `donate`) |

### DonationSelector (데모)
- 빈도 토글: 일시 후원 / 월 정기 (`role="radiogroup"`).
- 금액: 프리셋 4개(라디오 카드) + "Other" 직접 입력(CAD, 최소 $5, 최대 $10,000, 정수).
- 선택 시 해당 금액의 Impact 문구를 요약 영역에 표시.
- 선택 사항: 이름, 이메일(영수증 안내 문구용, 검증만).
- "Continue (Demo)" → `FormStatus variant="demo"`: "No payment was processed." 결제 연동 없음.

---

## 7. Events & News `/events-news`

**목적:** 활동 일정과 소식을 카테고리별로 탐색, 이벤트 참여 유도.

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **Page Header** (typography Hero) | 제목 + 소개 + "View Upcoming Events" → `#events` | `eventsPage.hero` |
| 2 | **Featured** | 대표 콘텐츠 1건 큰 카드(16:9) | `featured` 플래그 항목 |
| 3 | **Category Tabs** | All / Workshops / Events / Stories / News. 선택값은 `?category=`와 동기화(클라이언트). 아래 4·6 섹션 목록을 함께 필터링 | — |
| 4 | **Upcoming** `#events` | 예정 이벤트·워크숍 카드(3/2/1열), 날짜 오름차순, "Details & Register" → 상세 | `getEvents({ status: 'upcoming' })` |
| 5 | **Timeline** | 연도별 이벤트 제목, 과거 → 현재 → 예정 상태 표시 | `getEventTimeline()` |
| 6 | **Latest News & Stories** | 포스트 카드(3/2/1열), 날짜 내림차순 | `getPosts()` |
| 7 | **Past Events Recap** | 지난 이벤트 사진 카드 갤러리 + Lightbox | `getEvents({ status: 'past' })`의 `gallery` |
| 8 | **Load more** | 4·6·7 각 목록 하단, 6개 단위 | — |
| 9 | **Host or Request an Event** | Tabs: ① Host an Event(멘토용) ② Request an Event(Q&A) — 데모 폼 | `eventsPage.forms` |

- 카테고리 필터 결과가 비면 섹션별 EmptyState.
- 카테고리 매핑: Workshops·Events → `event.kind`, Stories·News → `post.kind`. "Workshops/Events" 탭 선택 시 6번 섹션은 EmptyState 대신 숨김, "Stories/News" 탭 선택 시 4·5·7 섹션 숨김.

### 데모 폼
- **Host an Event (멘토):** 이름*, 이메일*, 멘토 cohort(선택), 이벤트 유형(Workshop/Seminar/Networking/Other)*, 제목*, 희망 시기*, 형식(온/오프라인)*, 설명*(최대 1000자).
- **Request an Event (Q&A):** 이름*, 이메일*, 요청 주제*, 질문·요청 내용*(최대 1000자).

---

## 8. Event / News 상세 `/events-news/[slug]`

### Event·Workshop
| 순서 | 섹션 | 내용 |
|---|---|---|
| 1 | Breadcrumb | Events & News › 제목 |
| 2 | 상세 헤더 | 카테고리 배지, 제목(`h1`), 일시(Toronto 시간), 장소/온라인, 대상, 정원 `[S]` |
| 3 | 대표 이미지 | 16:9 |
| 4 | 본문 | Portable Text 소개 + 아젠다 목록 |
| 5 | **Register** `#register` (예정 이벤트만) | 데모 등록 폼: 이름*, 이메일*, 멘티 cohort(선택), 질문(선택) |
| 5' | **Recap** (지난 이벤트) | 등록 폼 대신 Gallery + 요약 |
| 6 | Related | 같은 카테고리 3건 |

### Story·News
Breadcrumb → 카테고리 배지, 제목(`h1`), 날짜, 작성자 → 대표 이미지 → Portable Text 본문 → Related 3건.

- 알 수 없는 slug → `notFound()` (`[locale]/not-found.tsx`).
- 이벤트 상세 metadata에 이벤트 제목·요약·대표 이미지(OG)를 넣는다.

---

## 9. Contact Us `/contact`

| 순서 | 섹션 | 내용 | 데이터 |
|---|---|---|---|
| 1 | **Page Header** (typography Hero) | 소개 + "Send Message (Demo)" → `#contact-form` | `contactPage.hero` |
| 2 | **Contact Information** | 카드: 이메일 `[R]`, 위치(Toronto, ON), SNS | `siteSettings` |
| 3 | **Contact Form** `#contact-form` | 이름*, 이메일*, 주제 select*(General / Mentorship / Become a Mentor / Donation / Event / Partnership), 메시지*(최대 2000자) | — |
| 4 | **Location** | 주소 텍스트 + 지도 placeholder(정적 블록, 외부 embed 없음) | `siteSettings.location` |
| 5 | **FAQ / Support** | Accordion | `faq[]` (group: `contact`) |

- `?topic=` 값(`general`, `mentorship`, `mentor`, `donation`, `event`, `partnership`)으로 주제를 미리 선택. 알 수 없는 값은 무시. hydration 후 `useSyncExternalStore`로 읽어 정적 렌더링 유지 (D24).

---

## 부록 A. CTA·링크 매핑 (E2E 검증 대상)

| 출발 | CTA | 대상 |
|---|---|---|
| Header | Donate | `/get-involved/donate` |
| Home Hero ① | Become a Mentee / Explore Mentorship | `/get-involved/mentorship` |
| Home Hero ② | Become a Mentor | `/get-involved/mentors#become-a-mentor` |
| Home Hero ③ | 이벤트 보기 | `/events-news/[slug]` |
| Home Mentors | View all mentors | `/get-involved/mentors` |
| Home Events | View all | `/events-news` |
| Home Get Involved | Mentee / Mentor / Donate | `/get-involved/mentorship` / `/get-involved/mentors#become-a-mentor` / `/get-involved/donate` |
| About | Get Involved | `/get-involved/mentorship` |
| About | View Reports | `/about/reports` |
| Mentorship | Apply for Mentorship / Apply | `#apply` |
| Mentors | Become a Mentor | `/contact?topic=mentor` |
| Donate | Make a Donation | `#donation-options` |
| Events & News | View Upcoming Events | `#events` |
| Event 카드 | Details & Register | `/events-news/[slug]` |
| Contact | Send Message (Demo) | `#contact-form` |
| Footer Pre-CTA | Explore Mentorship / Donate | `/get-involved/mentorship` / `/get-involved/donate` |
| Floating | Contact | `/contact` |
