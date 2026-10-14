# 03. 공통 레이아웃과 컴포넌트 (Layout & Components)

> 시각 스타일은 [02-design-system.md](02-design-system.md)의 토큰을 따르며 디자이너 작업물에 따라 변경될 수 있다. 이 문서는 **구조와 동작(behavior), 접근성 계약**을 정의하며, 이는 디자인이 바뀌어도 유지한다.

## 1. Header

- 흰색(`surface`) 정적 헤더. **sticky 아님.** 하단 1px `border`.
- 맨 앞에 Skip link("Skip to content" / "본문으로 건너뛰기") → `<main id="main">`.

### Desktop (≥1024px)
```
[ELCA 로고]   Home  About ELCA ▾  Get Involved ▾  Events & News  Contact Us     EN | KO   [Donate]
```
| 메뉴 | 하위 항목 |
|---|---|
| About ELCA | About ELCA (`/about`), Reports (`/about/reports`) |
| Get Involved | Mentorship, Mentors, Donate |

- Dropdown 트리거는 `<button aria-expanded aria-controls>`. **hover만으로 열지 않는다**(터치와 일관성).
- 키보드: Enter/Space로 열기, ↓/↑로 항목 이동, Esc로 닫고 트리거로 focus 복귀, Tab으로 패널을 벗어나면 닫힘.
- 패널 외부 클릭 시 닫힘. 한 번에 하나의 Dropdown만 열림.
- 현재 페이지 링크(하위 항목 포함)는 `aria-current="page"` + 밑줄. 하위 항목이 현재 페이지면 상위 트리거에도 활성 표시.
- `Donate` 버튼은 `accent` variant → `/get-involved/donate`.

### Mobile/Tablet (<1024px)
```
[ELCA 로고]                                   [☰]
```
- 햄버거 `<button aria-expanded aria-controls aria-label="Open menu">` → 오른쪽에서 전체 높이 **Drawer**.
- Drawer: focus trap, Esc·닫기 버튼·배경 클릭으로 닫힘, 닫히면 햄버거로 focus 복귀, 열린 동안 body 스크롤 잠금.
- 하위 메뉴는 Accordion 형태로 펼침. 하단에 LanguageSwitcher와 Donate 버튼.
- 라우트 이동 시 Drawer 자동 닫힘.

### LanguageSwitcher
- `EN | KO` 두 링크. 현재 로케일은 `aria-current="true"`, 각 링크에 `lang`, `hreflang` 지정.
- 현재 경로와 쿼리스트링을 유지하고 로케일만 교체.

## 2. Footer

```
┌──────────────────────── Pre-footer CTA (primary 배경) ────────────────────────┐
│  제목 + 설명                                [Explore Mentorship] [Donate]       │
├──────────────────────────────── 4-column ─────────────────────────────────────┤
│ Brand            │ Explore          │ Get Involved     │ Stay Connected       │
│ 로고              │ Home             │ Mentorship       │ info@elcatoronto.com │
│ 설명 문구          │ About ELCA       │ Mentors          │ Newsletter 폼         │
│ SNS (FB, LinkedIn)│ Reports          │ Donate           │                      │
│                  │ Events & News    │                  │                      │
│                  │ Contact Us       │                  │                      │
├──────────────────────────────── Bottom bar ───────────────────────────────────┤
│ © {현재 연도} ELCA. All rights reserved.                   Privacy Policy      │
└────────────────────────────────────────────────────────────────────────────────┘
```
- Pre-footer CTA 배경은 `primary`, 4열 영역과 bottom bar는 `primary-deep`(D26). 보조 텍스트는 `on-primary-muted`.
- 4열 → tablet 2열 → mobile 1열.
- 설명 문구·연락처·SNS URL·CTA 문구는 `siteSettings`(mock)에서 온다. 연락처 이메일은 `needsReview`.
- 각 열은 `<nav aria-label>` 또는 `<section>` + 제목(`h2`, 시각적으로 작게).
- SNS 링크는 레터마크(`SocialMark`, D27) + `aria-label`("ELCA on Facebook (opens in a new tab)"), `target="_blank" rel="noopener noreferrer"`.
- **Privacy Policy:** 페이지가 범위 밖이므로 Contact로 연결하고 "(준비 중 / Coming soon)" 텍스트를 함께 표시 (Decision D15).

### NewsletterForm (데모)
- 이메일 1개 필드 + 제출 버튼, `<label>` 제공(시각적으로 숨김 가능).
- zod 이메일 검증. 에러는 필드 아래 `aria-describedby`.
- 제출 성공 시에도 `FormStatus variant="demo"`: "This is a demo. No subscription was created." — **성공을 연상시키는 녹색·체크 아이콘을 쓰지 않는다.**

## 3. Floating UI

| 버튼 | 크기 | 동작 |
|---|---|---|
| Contact | 52px | `/contact` 링크, 항상 표시, `aria-label="Contact us"` |
| Back to Top | 44px | 스크롤 600px 초과 시 표시. 클릭 시 맨 위로 + `#main`의 첫 heading으로 focus 이동. reduced-motion이면 즉시 이동 |

- 위치: 오른쪽 아래 고정. `right: calc(16px + env(safe-area-inset-right))`, `bottom: calc(16px + env(safe-area-inset-bottom))`. 두 버튼은 세로로 쌓고 간격 12px.
- **오버레이가 열리면 숨김:** 전역 `OverlayProvider`가 열린 오버레이 수를 센다. Dialog, Drawer, Dropdown, Lightbox는 열릴 때 `register()`, 닫힐 때 `unregister()`. 카운트 > 0이면 Floating UI를 `hidden` 처리(포커스 불가).
- Contact 페이지에서는 Contact 버튼을 숨긴다.
- 스크롤 리스너는 `requestAnimationFrame`으로 스로틀.

## 4. 공통 컴포넌트 목록

### `components/ui` (도메인을 모르는 프리미티브)

| 컴포넌트 | 계약 |
|---|---|
| `Button` | variant: `primary` / `secondary` / `accent` / `ghost` / `inverse`(다크 배경 위 흰 버튼) / `on-dark`(다크 배경 위 외곽선); size: `md` / `lg`; `href`가 있으면 로케일 인지 `Link`로 렌더링, 외부 URL이면 `<a>`. 아이콘 슬롯 |
| `Badge` | variant: `neutral` / `category` / `sample` / `review` / `demo` |
| `Tabs` | WAI-ARIA Tabs 패턴(`role=tablist/tab/tabpanel`, ←/→/Home/End, roving tabindex). controlled/uncontrolled 모두 지원(URL 동기화용) |
| `Accordion` | `<details>/<summary>` 기반. 다중 열림 허용. 제목 레벨은 prop으로 지정 |
| `Dialog` | 네이티브 `<dialog>` + `showModal()`. 제목 `aria-labelledby`, Esc·닫기 버튼·backdrop 클릭으로 닫힘, 닫히면 트리거로 focus 복귀, body 스크롤 잠금, OverlayProvider 연동 |
| `Drawer` | Dialog와 동일한 계약, 측면 슬라이드 레이아웃 |
| `Input`, `Textarea`, `Select` | `border-strong` 테두리, 에러 상태 스타일, `aria-invalid` |
| `FormField` | label, 필수 표시, 도움말, 에러 메시지를 묶고 `aria-describedby` 연결 |
| `FormStatus` | variant: `demo` / `error`. `role="status"` 또는 `role="alert"` |
| `EmptyState` | 아이콘, 제목, 설명, 선택 액션 |
| `Avatar` | 이니셜 아바타(이름 → 이니셜, 배경색은 이름 해시로 토큰 팔레트 중 선택). `src`가 있으면 이미지 |
| `Carousel` | 슬라이드 컨테이너, 이전/다음, 인디케이터, 자동 재생 + **일시정지 버튼**, `aria-roledescription="carousel"`, 각 슬라이드 `role="group" aria-label="n of N"`. hover·focus 시 일시정지, reduced-motion 시 자동 재생 끔 |

### `components/layout`
`Header`, `MobileNav`, `Footer`, `NewsletterForm`, `FloatingActions`, `OverlayProvider`, `LanguageSwitcher`, `Container`, `Section`(세로 padding 토큰, 배경 variant, `id`, `aria-labelledby`).

### `components/sections` (재사용 섹션, 도메인 ViewModel을 props로 받음)

| 컴포넌트 | 설명 |
|---|---|
| `Hero` | variant `typography`(큰 제목·설명·CTA, 장식 최소) / `photo`(전폭 사진 + `overlay` + 고대비 텍스트) |
| `HeroCarousel` | Home 전용 Hero, `Carousel` 기반 |
| `SectionHeading` | eyebrow, 제목(레벨 지정), 설명, 정렬 |
| `CTASection` | 제목, 설명, 버튼 1–2개, 배경 variant |
| `StatGrid`, `StatCard` | 수치, 라벨, 설명, Sample/Review 배지 |
| `ValueCard` | 아이콘, 제목, 설명 |
| `MentorCard` | Avatar(이니셜), 이름, 직함, 직장, 지역, cohort 출신·직함, "View Profile" |
| `MentorGrid` | 4/2/1열 그리드 |
| `MentorCarousel` | Featured 멘토 가로 캐러셀 |
| `MentorProfileDialog` | 멘토 상세 모달 |
| `EventCard` | 이미지(3:2), 카테고리 배지, 날짜, 제목, 장소/온라인, 상세 링크 |
| `NewsCard` | 이미지(3:2), 카테고리 배지, 날짜, 제목, 요약 |
| `TestimonialCard` | 인용문, 이름, 역할(멘티/멘토, cohort) |
| `TestimonialScroller` | 가로 스크롤(scroll-snap) + 이전/다음 버튼, 키보드 스크롤 가능 영역(`tabindex=0`, `aria-label`) |
| `FAQSection` | SectionHeading + Accordion |
| `SponsorBar` | 로고(또는 워드마크) 가로 배열, 링크 |
| `Timeline` | 연도별 항목, 현재/예정 상태 표시 |
| `Gallery` | 정사각 그리드 + Lightbox(Dialog) |
| `TeamCard` | Avatar, 이름, 직함 |

### `components/pages/<page>/`
페이지 전용 조합 섹션(예: `home/ImpactSection`, `donate/DonationOptions`, `events-news/EventsExplorer`). 재사용 가능성이 생기면 `sections/`로 승격한다.

## 5. 폼 공통 규칙

- 모든 데모 폼은 `"use client"` + zod 스키마(`lib/validation/*`) + `FormField`.
- 검증 시점: 제출 시 전체 검증 → 이후 에러가 있는 필드는 blur·change 시 재검증.
- 제출 실패 시 첫 에러 필드로 focus 이동, 상단에 `FormStatus variant="error"` 요약(`role="alert"`).
- 제출 성공 시 `FormStatus variant="demo"`: "Demo — nothing was sent." 폼 값은 유지하지 않고 초기화.
- 외부 네트워크 요청 없음. 제출 처리 함수(`onSubmit`)는 폼 UI와 분리된 단일 함수로 두어 Phase 3에서 Server Action으로 교체한다.
- 필수 필드는 `required` + 시각적 표시(*) + 스크린리더용 텍스트.

## 6. 접근성 공통 계약

- 페이지당 `h1` 1개, heading 레벨 건너뛰기 금지.
- 랜드마크: `header`, `nav`(aria-label 구분), `main#main`, `footer`.
- 모든 이미지에 의미 있는 `alt`(장식 이미지는 `alt=""`). alt 텍스트도 현지화한다.
- 아이콘 전용 버튼은 `aria-label` 필수.
- 상태 변화(검색 결과 수, 폼 결과)는 `aria-live`로 알린다.
- 모든 인터랙션은 마우스·키보드·터치에서 동일하게 동작한다.
