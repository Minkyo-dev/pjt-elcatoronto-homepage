# 05. 데이터 모델과 Content Repository (Data Model)

## 1. 원칙

1. **`data/mock`의 형태 = Phase 2 Sanity 문서 형태.** 현지화 필드는 `{ en, ko }` 객체(필드 단위 현지화, Decision D2).
2. **페이지는 `lib/content`만 호출한다.** Repository가 로케일을 적용해 평탄한 **ViewModel**을 반환한다.
3. **컴포넌트는 ViewModel만 안다.** 데이터 출처(mock/Sanity)와 로케일 해석을 모른다.
4. Phase 2 전환 시 바뀌는 곳은 `lib/content/*` 내부 구현뿐이다. 함수 시그니처와 ViewModel 타입은 유지한다.

```
data/mock (Doc 타입)  ──▶  lib/content (resolve + 정렬/필터)  ──▶  ViewModel  ──▶  components
Phase 2: Sanity GROQ  ──▶  (동일)
```

## 2. 공통 타입 (`types/common.ts`)

```ts
export type Locale = 'en' | 'ko'

/** 필드 단위 현지화. ko가 비어 있으면 en으로 fallback (development에서 console.warn) */
export type Localized<T = string> = { en: T; ko?: T }

export type ImageAsset = {
  url: string                 // Phase 1: Unsplash URL / Phase 2: Sanity image → urlFor()
  alt: Localized
  width: number
  height: number
  credit?: string             // Unsplash 작가 표기 (선택)
}

export type FileAsset = { url: string; sizeBytes?: number; mimeType?: string }

export type Cta = { label: Localized; href: string }   // href: 내부 경로(로케일 없이) 또는 #anchor 또는 외부 URL

/** Portable Text 블록 배열 — @portabletext/types의 PortableTextBlock */
export type RichText = PortableTextBlock[]

/** 화면 배지의 근거. Phase 2 스키마에도 유지 */
export type Flags = {
  isSample?: boolean          // SAMPLE 배지 — 가상의 인물·통계·후원 수치
  needsReview?: boolean       // 검수 배지 — 기존 사이트에서 가져온 미확인 사실
}

export type DocBase = Flags & { _id: string; _type: string }
```

### 현지화 해석 (`lib/i18n/localize.ts`)
- `localize<T>(value: Localized<T>, locale: Locale): T` — `value[locale]`가 없거나 공백이면 `value.en`.
- `resolveLocalized<T>(doc, locale): Resolved<T>` — 문서 전체를 깊게 해석한다. `Resolved<T>` 타입이 모든 `Localized<X>`를 `X`로 바꾸므로 ViewModel 타입이 Doc 타입에서 자동으로 파생된다 (D29).
- 단위 테스트 대상: fallback 동작, 빈 문자열 처리(빈 문자열은 값이 있는 것으로 간주하지 않고 fallback).

## 3. Doc 타입과 ViewModel

각 도메인은 `XxxDoc`(원본, 현지화 필드 포함)과 `Xxx`(ViewModel, 문자열로 해석됨)를 함께 정의한다.

```ts
// types/mentor.ts
export type MentorDoc = DocBase & {
  _type: 'mentor'
  slug: string
  name: Localized                 // { en: 'Jiwon Kim', ko: '김지원' }
  jobTitle: Localized
  company: Localized               // D30: 학생 멘토 소속도 번역
  location: Localized
  cohort?: number                 // 출신 cohort (ELCA 멘티 출신이 아니면 없음)
  cohortRole?: Localized          // 'Cohort 3 Mentee → Mentor'
  bio: Localized
  expertise: Localized<string[]>
  linkedinUrl?: string
  industry?: string               // 예약 필드 — Phase 1 UI 미사용
  role?: string                   // 예약 필드
  featured?: boolean
  order: number
}

export type Mentor = Flags & {
  id: string
  slug: string
  name: string
  nameAlt?: string                // 다른 로케일 이름 (검색용)
  jobTitle: string
  company: string
  location: string
  cohort?: number
  cohortRole?: string
  bio: string
  expertise: string[]
  linkedinUrl?: string
}
```

나머지 도메인도 같은 규칙을 따른다. 아래 표는 **Doc 타입의 필드**이며 `L` = `Localized`.

## 4. 문서 타입 목록 (Phase 2 Sanity 스키마와 1:1)

### Singleton (페이지 문구)

| 타입 | 주요 필드 |
|---|---|
| `siteSettings` | `orgName: L`, `description: L`, `email`, `location: { label: L, address?: L }`, `social: { facebook?, linkedin?, instagram? }`, `preFooterCta: { title: L, body: L, ctas: Cta[] }`, `newsletter: { title: L, body: L }` |
| (공통) | 모든 페이지 singleton은 `seo: {title: L, description: L}`을 가진다 |
| `homePage` | `heroSlides: HeroSlide[]`, `purpose: { title: L, body: L }`, `mentorshipPreview: { title: L, body: L, items: { title: L, body: L }[], cta: Cta }`, `getInvolved: { title: L, cards: { title: L, body: L, cta: Cta, tone: 'primary' \| 'secondary' \| 'accent' }[] }`, 섹션별 `title/intro: L` |
| `aboutPage` | `hero`, `purpose`, `mission`, `vision`, `reportsTeaser`, `cta`, 섹션별 `title/intro` |
| `reportsPage` | `hero`, 탭 라벨 `L` |
| `mentorshipPage` | `hero`, `offer: { summary: L, benefits: Card[] }`, `inlineCta`, `eligibility: L<string[]>`, `process: { title: L, body: L, duration?: L }[]`, `details: { label: L, value: L }[]`, `outcomes: Card[]`, `apply: { title: L, body: L, nextCohort?: L, deadline?: string }` |
| `mentorsPage` | `hero`, `cta`, 섹션별 `title/intro` |
| `donatePage` | `hero`, `why: { title: L, body: L, points: Card[] }`, `fundUsage: { label: L, percent: number }[]` |
| `eventsPage` | `hero`, `forms: { hostIntro: L, requestIntro: L }`, 섹션별 `title/intro` |
| `reportsPage` | `hero` |
| `mentorsPage` | `hero`, `featured`, `directory`(섹션 문구), `cta` |
| `contactPage` | `hero`, 섹션별 `title/intro` |

보조 객체:
- `HeroSlide = { kind: 'overview' | 'mentor' | 'event'; title: L; body: L; media: { type: 'image' | 'video'; image: ImageAsset; videoUrl?: string }; ctas: Cta[]; eventRef?: string }`
- `PageHero = { eyebrow?: L; title: L; body: L; cta?: Cta; image?: ImageAsset }`
- `Card = { title: L; body: L; icon?: string }` — `icon`은 lucide 아이콘 이름 화이트리스트

### Collection

| 타입 | 주요 필드 | 비고 |
|---|---|---|
| `mentor` | 위 §3 | |
| `teamMember` | `name: L`, `title: L`, `bio?: L`, `photo?: ImageAsset`, `order` | Phase 1은 photo 없음 → 이니셜 |
| `event` | `slug`, `kind: 'workshop' \| 'event'`, `title: L`, `summary: L`, `body: RichText(L)`, `startsAt`, `endsAt`, `location: { mode: 'online' \| 'in-person' \| 'hybrid'; label: L }`, `audience?: L`, `capacity?: number`, `agenda?: { time: string; item: L }[]`, `coverImage: ImageAsset`, `gallery?: ImageAsset[]`, `featured?` | upcoming/past는 저장하지 않고 계산 |
| `post` | `slug`, `kind: 'story' \| 'news'`, `title: L`, `excerpt: L`, `body: RichText(L)`, `publishedAt`, `author?: L`, `coverImage: ImageAsset`, `featured?` | |
| `testimonial` | `quote: L`, `name: L`, `authorType: 'mentee' \| 'mentor'`, `cohort?: number`, `context?: L`, `order` | |
| `faq` | `group: 'home' \| 'about' \| 'mentorship' \| 'donate' \| 'events' \| 'contact'`, `question: L`, `answer: RichText(L)`, `order` | |
| `sponsor` | `name`, `logo?: ImageAsset`, `url?`, `order` | Phase 1은 워드마크 |
| `report` | `kind: 'financial' \| 'annual'`, `year: number`, `title: L`, `summary?: L`, `file?: FileAsset` | |
| `timelineEntry` | `group: 'history'`, `year: number`, `title: L`, `body?: L`, `order` | Events 타임라인은 `event`에서 파생 |
| `stat` | `group: 'home' \| 'about'`, `value: string`, `label: L`, `description?: L`, `order` | `value`는 표시 문자열("12", "200+") |
| `coreValue` | `title: L`, `body: L`, `icon?`, `order` | Home·About 공유. 타입명 `value`는 필드명과 혼동되어 피함 |
| `donationTier` | `amount: number`, `impact: L`, `order` | CAD |

- **slug:** 로케일 공통 단일 값 (`/en/events-news/x` ↔ `/ko/events-news/x`).
- **날짜:** ISO 8601 문자열(오프셋 포함). 표시 시 `America/Toronto`.
- **RichText(L):** `{ en: RichText; ko?: RichText }`.

## 5. Repository 계약 (`lib/content/*`)

모든 파일 첫 줄 `import 'server-only'`. 모든 함수는 `async`.

| 파일 | 함수 | 반환 |
|---|---|---|
| `site.ts` | `getSiteSettings(locale)` | `SiteSettings` |
| `pages.ts` | `getHomePage(locale)`, `getAboutPage`, `getReportsPage`, `getMentorshipPage`, `getMentorsPage`, `getDonatePage`, `getEventsPage`, `getContactPage` | 각 페이지 ViewModel |
| `mentors.ts` | `getMentors(locale)` (order 순), `getFeaturedMentors(locale, limit = 4)` | `Mentor[]` |
| `team.ts` | `getTeamMembers(locale)` | `TeamMember[]` |
| `events.ts` | `getEvents({ locale, status?, kind?, now? })`, `getEventBySlug(locale, slug)`, `getEventTimeline(locale, now?)`, `getAllEventSlugs()` | `EventItem[]` 등. `status`: `'upcoming'`(endsAt ≥ now, startsAt 오름차순) / `'past'`(endsAt < now, startsAt 내림차순) |
| `posts.ts` | `getPosts({ locale, kind? })`, `getPostBySlug(locale, slug)`, `getAllPostSlugs()` | `Post[]` (publishedAt 내림차순) |
| `content.ts` | `getContentBySlug(locale, slug)` → `{ type: 'event', ... } \| { type: 'post', ... } \| null`, `getAllContentSlugs()`, `getLatestHighlights(locale, limit)`, `getRelated(locale, slug, limit = 3)`, `getFeaturedContent(locale)` | 상세·Home용 |
| `testimonials.ts` | `getTestimonials(locale, { authorType? })` | |
| `faq.ts` | `getFaqs(locale, group)` | |
| `sponsors.ts`, `reports.ts`, `stats.ts`, `coreValues.ts`, `timeline.ts`, `donation.ts` | 각 목록 조회 | |

- `now` 파라미터는 테스트용 주입 지점. 기본값은 `new Date()`(Phase 1에서는 빌드 시점).
- **slug 충돌 금지:** `event`와 `post`는 같은 URL 공간(`/events-news/[slug]`)을 공유하므로 slug가 전체에서 유일해야 한다. mock 로딩 시 중복 검사(단위 테스트로 보장).
- 클라이언트 컴포넌트로 전달하는 값은 직렬화 가능한 plain 객체만(Date 객체 대신 ISO 문자열).

## 6. UI 라벨과 콘텐츠의 경계

| 위치 | 담는 것 | 예 |
|---|---|---|
| `messages/{en,ko}.json` | 운영진이 편집할 필요 없는 UI 문구 | 내비게이션 라벨, "View Profile", "Load more", 폼 라벨·placeholder·에러, aria-label, DEMO/SAMPLE 안내, 404 문구 |
| `data/mock` → Sanity | 운영진이 편집하는 모든 문구 | Hero 제목·설명, 섹션 제목·소개, CTA 라벨, 모든 컬렉션 |

판단 기준: "운영진이 문구를 바꾸고 싶어할 가능성이 있는가?" → 있으면 콘텐츠.

## 7. Mock 데이터 규칙

### 분량
| 데이터 | 수량 | 목적 |
|---|---|---|
| mentor | 18 (featured 4) | Load more(12) 동작 확인 |
| event | 10 (예정 4, 지난 6, 그중 workshop 4) | 상태·카테고리·타임라인·갤러리 |
| post | 8 (story 4, news 4) | 카테고리·Load more |
| testimonial | 8 (mentee 5, mentor 3) | 가로 스크롤 |
| faq | 그룹별 4–6 | |
| teamMember | 6 | |
| sponsor | 6 | |
| report | 4 (financial 2, annual 2) | 탭·EmptyState 아님 확인 |
| heroSlide | 3 | |
| donationTier | 4 | |

- 예정 이벤트는 **2026-11 ~ 2027-03** 범위, 지난 이벤트는 2024–2026-09 범위로 작성한다(빌드 시점 기준 상태가 의도대로 나오도록). 이 범위를 벗어나는 시점에 빌드하면 상태가 바뀔 수 있음을 README에 명시한다.

### 사실성 규칙 (Decision D18)
- 가상의 인물(멘토, 운영진, 후기 작성자), 통계, 후원사, 금액, 리포트: `isSample: true`. 실존 인물·기업으로 오인될 이름을 쓰지 않는다(회사명은 "Northbridge Analytics" 같은 가상 이름).
- elcatoronto.com에서 확인한 사실: `needsReview: true`.
  - 2019년 설립, 2020년부터 12개 cohort, 약 200명 멘티, 13기 2026년 7월 예정
  - 1월·7월 모집, 고등학생 대상 모집 경로(Facebook·이메일)
  - 장학금·세미나·인턴십·워크숍 운영, 주니어 멘토 경로
  - 연락처 `info@elcatoronto.com`, Facebook `elcatoronto`, LinkedIn `company/elcatoronto`
- 한국어 mock은 기계 번역 티가 나지 않도록 자연스러운 문장으로 작성한다.

### 이미지
- Unsplash `images.unsplash.com` URL에 `w`, `q`, `fit` 파라미터 지정. 실제 width/height를 함께 기록.
- 커뮤니티·워크숍·멘토링·네트워킹 분위기의 사진. 특정 실존 단체 로고·브랜드가 드러나는 사진은 피한다.
