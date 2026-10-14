# 원본 요구사항 (Original Brief)

> 프로젝트 시작 시점(2026-10-13)에 전달받은 프론트엔드 UI 개발 프롬프트 원문이다. **수정하지 않고 보존한다.**
> 이 원문과 달라진 결정은 [`../specs/00-overview.md`](../specs/00-overview.md)의 결정 로그(Decision Log)에 기록한다.

전달 시 함께 받은 지시: "이 레포지토리에 next.js + vercel + sanity를 사용하여 홈페이지를 구축할 것이다."

---

# ELCA Toronto — Website Frontend UI Development Prompt

## 1. 프로젝트 개요
ELCA Toronto 공식 홈페이지의 프론트엔드 UI 프로토타입을 제작한다. ADPList의 현대적 UI 패턴과 ELCA의 멘토십/커뮤니티 브랜드 정체성을 참고하되 다른 사이트 디자인을 그대로 복제하지 않는다.
- 기술: Next.js App Router + TypeScript + Tailwind CSS
- 현재 단계: 화면/컴포넌트/반응형/인터랙션 구현. 데이터는 TypeScript 기반 local mock data만 사용한다.
- 제외: Sanity CMS 연동, Vercel 배포, 인증, 실제 DB/API, 결제, 이메일 발송, 구독 서비스 연결.
- 참고 사이트: https://adplist.org/ 및 https://www.elcatoronto.com/
- 중요 행동: 멘토십 신청, 이벤트 참여, 후원 전환
- 대상 사용자: 학생 · 청년, 멘토십 신청자, 멘토 지원자, 후원자 · 파트너, 커뮤니티 구성원

## 2. 전체 디자인 방향
- Warm Community: 실제 사람과 커뮤니티 활동 사진, 친밀하고 환영받는 브랜드 분위기
- 컬러 사용: Neutral Background/Surface 약 75%, Primary/Secondary 약 20%, Accent 약 5%를 시각적 가이드로 삼는다.
- 과도한 그라디언트, 과장된 모션, 큰 그림자, 무의미한 장식은 지양한다. 일관성 있는 여백과 실제 활동 사진을 우선한다.

## 3. Color System — Modern Navy / Teal
- primary: #17324D
- secondary: #406A72
- accent: #B85B35
- background: #F9FAF8
- surface: #FFFFFF
- text: #17232B
- muted: #65727C
- border: #E3E8E5
- Primary는 주요 CTA/Header/Footer에, Secondary는 보조 강조에, Accent는 Donate CTA/핵심 강조에 제한적으로 사용한다.
- 배경과 카드 대비, 본문/버튼의 텍스트 대비는 WCAG AA 목표로 검토한다.

## 4. Typography
- 서체: Heading: Manrope, Body: Inter, Korean fallback: Noto Sans KR
- Heading: Balanced Modern; desktop H1 52-60px / H2 36-40px, mobile H1 36-40px / H2 28-32px
- Weight: 400, 500, 600, 700, 800. 제목 letter-spacing -0.02em~-0.04em, line-height 1.1~1.2.
- Body: 16px, line-height 1.6~1.75, 본문 최대 너비 680px, 제목 최대 너비 900px.
- Left alignment를 기본으로 하고 Hero/CTA/Testimonial은 필요한 경우 중앙 정렬한다.

## 5. Layout & Responsive
- Container max-width: 1280px
- 12-column desktop, 8-column tablet, 4-column mobile를 기준으로 grid/flex를 상황에 맞게 적용.
- Spacing: section padding desktop 96px / tablet 72px / mobile 56px; card gap 24px
- Border radius: cards 8px, buttons 6px, images 8px; 1px subtle border; no default shadow
- Responsive breakpoints: mobile 0~639px, tablet 640~1023px, desktop 1024px+, wide desktop 1280px+.
- Container horizontal padding: desktop 48px, tablet 32px, mobile 20px.
- 멘토 카드 desktop 4열/tablet 2열/mobile 1열, News/Event 카드 desktop 3열/tablet 2열/mobile 1열.

## 6. Global Header / Footer / Floating UI
- Header: static white header, minimalist navigation, no sticky behavior
- Navigation: Home / About ELCA / Get Involved (Mentorship, Mentors, Donate) / Events & News / Contact Us.
- Desktop은 Get Involved dropdown, mobile은 keyboard/touch 지원 메뉴로 구현한다.
- Footer: dark navy pre-footer CTA + four-column footer (Brand, Explore, Get Involved, Stay Connected) + bottom bar
- Footer 포함 요소: ELCA Logo, Organization Description, Quick Navigation, Contact Information, Social Media Links, Newsletter, Donation CTA, Copyright, Privacy Policy
- Footer 예시 텍스트: “Connecting people through mentorship, leadership, and community.”
- Footer Contact: info@elcatoronto.com (실제 운영 정보 확정 전 검수 대상).
- Newsletter는 UI 데모이며 실제 구독 성공으로 오인시키지 않는다.
- Floating UI: bottom-right fixed Contact 52px and Back to Top 44px; show top button after 600px scroll; hide when overlays open
- Overlay/Modal/Menu가 열릴 때 Floating UI를 가린다. 모바일 Safe Area를 고려한다.

## 7. 페이지별 설계
### 1. Home (/)
- 목적: 브랜드와 멘토십 가치를 빠르게 소개하고 핵심 행동을 유도
- Hero: Typography-focused hero with large title, concise description and CTA, minimal decoration
- Primary CTA: "Explore Mentorship" → /get-involved/mentorship
- Section 순서:
   1. Hero — 핵심 메시지 + 이미지 + CTA
   2. About Preview — 조직 소개와 About 링크
   3. Impact Overview — 통계 수치 카드 (가상 표기)
   4. Mentorship Preview — 프로그램 미리보기
   5. Featured Mentors — 멘토 캐러셀
   6. Events & News — 최신 일정 및 소식
   7. Testimonials — 커뮤니티 후기
   8. Get Involved CTA — 참여 및 후원 CTA
   9. FAQ — 질문 아코디언
- 페이지별 추가 지시: # 최상단 carousel 
- overview : 간단 소개 + 배경 (동영상/사진) + cta button (bdecome a mentee)
- become a mentor + button
- events page 연동 이미지

# 후원사 로고 바

# Values / Purpose (Summary, Overview)

# Impacts (성과 숫자로) cohorts

# 멘티 멘토 후기 카드
- 가로 스크롤

### 2. About ELCA (/about)
- 목적: 조직의 목적, 비전, 역사, 팀을 소개
- Hero: Typography-focused hero with large title, concise description and CTA, minimal decoration
- Primary CTA: "Get Involved" → /get-involved/mentorship
- Section 순서:
   1. Page Introduction — 제목 + 조직 소개
   2. Mission & Vision — 미션/비전 2단
   3. Our Story — 연혁 / 타임라인
   4. Core Values — 가치 카드
   5. Our Impact — 활동 통계 / 사례
   6. Leadership & Team — 운영진 카드
   7. Get Involved CTA — 참여 유도 배너
- 페이지별 추가 지시: # intro

# - Value / Purpose / Mission / Vision

# Leadership (photos)

# QnA

# 하위 메뉴) Financial Statement  / Annual report

### 3. Mentorship (/get-involved/mentorship)
- 목적: 프로그램 혜택, 절차, 대상 안내 및 신청 유도
- Hero: Full-width photographic hero with legible dark overlay and high-contrast text
- Primary CTA: "Apply for Mentorship" → #apply
- Section 순서:
   1. Program Hero — 프로그램의 핵심 가치
   2. Benefits — 혜택 카드
   3. How It Works — 단계별 절차
   4. Who Can Apply — 참여 자격 안내
   5. Program Details — 기간 / 방식 / 형식
   6. Success Stories — 멘티 후기
   7. Application CTA — 데모 신청 CTA
   8. FAQ — 자주 묻는 질문
- 페이지별 추가 지시: - header - 멘토쉽 소개, what we offer (Summary, Overview) 
+ Become a mentee → Apply Button
- Application phase (process)
- What you’ll achieve
- Become a mentee → Apply Button

### 4. Mentors (/get-involved/mentors)
- 목적: 멘토 프로필을 검색하고 분야별로 탐색할 수 있는 디렉터리
- Hero: Typography-focused hero with large title, concise description and CTA, minimal decoration
- Primary CTA: "Become a Mentor" → /contact
- Section 순서:
   1. Page Introduction — 타이틀 + 디렉터리 소개
   2. Featured Mentors — 추천 멘토
   3. Mentor Directory — 카드 그리드
   4. Filters — 분야별 필터 / 검색
   5. Mentor Details — 프로필 모달 / 상세
   6. Become a Mentor — 지원 CTA
- 페이지별 추가 지시: - 이름, 직업, 직장, location, 몇기출신(+직함)
- 별점, photo 제외
- **필터링 기능 x for now — industry, roles, location**
- button - Become a Mentor

### 5. Donate (/get-involved/donate)
- 목적: 후원의 필요성과 활용 사례를 설명하고 후원 행동 유도
- Hero: Full-width photographic hero with legible dark overlay and high-contrast text
- Primary CTA: "Make a Donation" → #donation-options
- Section 순서:
   1. Donation Hero — 후원 메시지 + CTA
   2. Why Donate — 후원 필요성
   3. Donation Impact — 금액별 영향 예시
   4. How Funds Are Used — 후원금 사용 안내
   5. Donation Options — 금액 선택 데모
   6. FAQ — 후원 FAQ
- 페이지별 추가 지시: 없음

### 6. Events & News (/events-news)
- 목적: 활동 일정 및 최신 소식을 카테고리별로 탐색
- Hero: Typography-focused hero with large title, concise description and CTA, minimal decoration
- Primary CTA: "View Upcoming Events" → #events
- Section 순서:
   1. Page Header — 타이틀 + 소개
   2. Featured Content — 대표 이벤트/뉴스
   3. Category Tabs — Events / News 분류
   4. Upcoming Events — 일정 카드
   5. Latest News — 기사 카드
   6. Archive & Pagination — 더 보기 / 페이지네이션
- 페이지별 추가 지시: - **Workshops / Events / Stories / News**
    - Upcoming Event Registration (Details) for Mentee
    - Timeline - Year, Event title, Present-Upcoming
    - Past Events Recap (Photo cards in gallery view)
    - Different forms for helping mentors to open the events
    - QnA page (event request)

### 7. Contact Us (/contact)
- 목적: 문의 및 연락 수단을 안내하고 메시지 작성을 돕는 페이지
- Hero: Typography-focused hero with large title, concise description and CTA, minimal decoration
- Primary CTA: "Send Message (Demo)" → #contact-form
- Section 순서:
   1. Page Header — 연락 페이지 소개
   2. Contact Information — 이메일 / 위치 / SNS
   3. Contact Form — 이름 / 이메일 / 메시지
   4. Location — 주소 또는 지도 placeholder
   5. FAQ / Support — 문의 안내
- 페이지별 추가 지시: 없음

## 8. 공통 컴포넌트
- Header, Footer, Container, SectionHeading, Hero, CTASection, Button, StatCard, MentorCard, MentorCarousel, EventCard, NewsCard, TestimonialCard, FAQAccordion, Tabs, Modal/Drawer, FormField, EmptyState, FormStatus.
- 멘토 카드: Portrait mentor cards, 4 columns desktop / 2 tablet / 1 mobile, large consistent image ratios, name/job/company/expertise, View Profile
- Interaction/Motion: subtle 150-200ms transitions only for hover, focus, menu and accordion; no large scroll animations
- 모든 Hover 외에 Focus-visible, keyboard, touch, aria labels, reduced-motion을 지원한다.

## 9. 데이터 및 폴더 구조
- app/ : route별 page.tsx, layout.tsx, metadata.
- components/layout/ : Header, Footer 등 공통 Layout.
- components/ui/ : Button, Tabs, Accordion, Dialog, Input.
- components/sections/ : Hero, MentorGrid, EventsList 등 재사용 Section.
- components/pages/ : 페이지 특화 Section.
- data/mock/ : site-settings.ts, mentors.ts, events.ts, news.ts, testimonials.ts, faq.ts.
- types/ : Mentor, Event, News, FAQ 등 도메인 타입.
- lib/ : 필요시 UI helper / constants.
- 반복 목록은 mock 배열.map으로 렌더링하고 컴포넌트에 콘텐츠를 하드코딩하지 않는다.
- 실제 인물·통계·후원 실적처럼 보이는 값은 명확히 SAMPLE/DEMO로 표시하고 검증되지 않은 사실을 만들지 않는다.

## 10. 동작 / 품질 / 완료 조건
- 모든 내비게이션과 내부 링크가 동작하고, 주요 CTA는 알맞은 route/section으로 연결한다.
- Accordion, Tabs, Modal, Carousel, 검색/필터는 실제 로컬 UI state로 작동한다.
- Contact form/Donation selector/Newsletter는 사용자 입력과 검증만 수행하며 외부 제출·결제·구독 연결은 하지 않는다.
- 모바일/태블릿/데스크톱에서 overflow가 발생하지 않도록 하고 이미지 aspect ratio와 CLS를 관리한다.
- Header, Footer, Color, Type Scale, Spacing 등 공통 토큰을 재사용한다.
- Semantic HTML, heading hierarchy, alt, label, accessible contrast, focus states를 갖춘다.

## 11. 추가 지시
페이지 내에 있는 FAQ는 아코디언으로 구성

## 12. 구현 산출물
1. 실행 가능한 Next.js 프로젝트 및 모든 지정 route.
2. 공통 디자인 토큰과 컴포넌트.
3. 모든 페이지의 실제 화면, 반응형 및 UI state.
4. 충분한 로컬 Mock Data와 타입 정의.
5. 주요 폴더/컴포넌트 구조 설명 및 실행 명령어.
6. 향후 Sanity 연동을 고려한 표현 데이터/컴포넌트 구조 분리 (현 단계에서는 연동하지 않음).
