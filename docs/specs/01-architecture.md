# 01. 아키텍처 (Architecture)

## 1. 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| Framework | Next.js 16.4 App Router | `cacheComponents: true`, `partialPrefetching` 끔 (D22) |
| Language | TypeScript (`strict: true`) | |
| Styling | Tailwind CSS v4 | 토큰은 `app/globals.css`의 `@theme`에 정의 |
| i18n | next-intl | 로케일 라우팅, 메시지, 날짜·숫자 포맷 |
| Rich text | `@portabletext/react` | Phase 2 Sanity 본문과 동일 렌더러 |
| Validation | zod | 데모 폼 검증, Phase 3 재사용 |
| Icons | lucide-react | |
| Test | Vitest, Playwright, `@axe-core/playwright` | 07 문서 참조 |
| Runtime | Node 24 LTS, npm 11 | `.nvmrc`로 이 레포에만 적용 (D21) |

외부 UI 컴포넌트 라이브러리는 사용하지 않는다 (Decision D16).

## 2. 라우팅

```
app/
├─ [locale]/                         ← 공개 사이트 root layout
│  ├─ layout.tsx                     <html lang>, 폰트, NextIntlClientProvider, Header/Footer/FloatingActions
│  ├─ page.tsx                       Home
│  ├─ about/page.tsx                 About ELCA
│  ├─ about/reports/page.tsx         Financial Statement / Annual Report
│  ├─ get-involved/mentorship/page.tsx
│  ├─ get-involved/mentors/page.tsx
│  ├─ get-involved/donate/page.tsx
│  ├─ events-news/page.tsx
│  ├─ events-news/[slug]/page.tsx    이벤트/뉴스 상세
│  ├─ contact/page.tsx
│  └─ not-found.tsx
├─ studio/[[...tool]]/               ← Phase 2 전용. 별도 root layout, i18n 대상 아님
├─ robots.ts
└─ sitemap.ts
proxy.ts                              ← next-intl 미들웨어 (Next 16의 middleware → proxy)
```

### 규칙
- **모든 공개 라우트는 로케일 prefix를 가진다.** `/` 접근 시 `Accept-Language`를 보고 `/en` 또는 `/ko`로 리다이렉트하며, 판단할 수 없으면 `/en`.
- `proxy.ts`의 matcher는 `/studio`, `/api`, `/_next`, 정적 파일(확장자 포함 경로)을 제외한다.
- 각 페이지는 `generateStaticParams`로 `en`, `ko`를 정적 생성한다. `[slug]`는 모든 slug × 로케일을 생성하고, 알 수 없는 slug는 `notFound()`.
- 각 페이지는 `generateMetadata`로 로케일별 title/description과 `alternates.languages`(hreflang)를 제공한다.
- 공개 사이트(`[locale]/layout.tsx`)와 Studio(`studio/layout.tsx`)는 **서로 다른 root layout**이다. 별도의 `app/layout.tsx`는 두지 않는다. 결과적으로 공개 페이지 번들에는 Studio 코드가 포함되지 않는다.
- 내부 링크는 next-intl의 로케일 인지 `Link`(`lib/i18n/navigation.ts`)만 사용한다. 하드코딩된 `/en/...` 경로 문자열은 쓰지 않는다.

### 앵커
페이지 내 CTA가 가리키는 앵커 id는 고정한다: `#apply`, `#become-a-mentor`, `#donation-options`, `#events`, `#contact-form`. 앵커 대상 섹션에는 `scroll-margin-top`을 둔다.

## 3. i18n

- 지원 로케일: `en`(기본), `ko`. 설정은 `lib/i18n/routing.ts` 한 곳.
- **UI 라벨**(내비게이션, 버튼 공통 라벨, 폼 라벨·에러, aria-label, 데모 안내)은 `messages/en.json`, `messages/ko.json`.
- **편집 콘텐츠**(Hero 문구, 섹션 소개, CTA 라벨, 모든 컬렉션 데이터)는 `data/mock`의 `{ en, ko }` 필드 → Phase 2에서 Sanity. 경계 규칙은 [05-data-model.md](05-data-model.md) 참조.
- 서버 컴포넌트에서는 `setRequestLocale` + `getTranslations`, 클라이언트 컴포넌트에서는 `useTranslations`. 클라이언트로 내려가는 메시지는 필요한 네임스페이스만 전달한다.
- 날짜·시간은 `America/Toronto` 시간대로 next-intl formatter를 통해 표시한다.
- 언어 전환(`LanguageSwitcher`)은 현재 경로와 쿼리를 유지한 채 로케일만 바꾼다.

## 4. 폴더 구조

```
app/                  라우트, layout, metadata, robots, sitemap
components/
  layout/             Header, MobileNav, Footer, NewsletterForm, FloatingActions,
                      LanguageSwitcher, Container, Section
  ui/                 Button, Badge, Tabs, Accordion, Dialog, Drawer, Input, Textarea,
                      Select, FormField, FormStatus, EmptyState, Avatar, Carousel
  sections/           여러 페이지에서 재사용하는 섹션 (Hero, CTASection, FAQSection,
                      MentorGrid, EventCard ...)
  pages/              페이지 전용 섹션 (home/, about/, mentorship/, mentors/,
                      donate/, events-news/, contact/)
data/mock/            mock 원본 데이터 ({ en, ko } 현지화 필드)
lib/
  content/            Content Repository — 데이터 접근의 유일한 진입점 (Sanity 전환 지점)
  i18n/               routing, navigation, request config, 현지화 resolve 헬퍼
  validation/         zod 폼 스키마
  utils/              cn() 등 순수 헬퍼
messages/             en.json, ko.json
types/                도메인 타입 (Sanity 스키마와 동일 구조)
public/               로고, 파비콘 등 정적 자산
tests/
  unit/               Vitest
  e2e/                Playwright
docs/                 설계 문서
```

### 의존 방향
```
app/(page.tsx) → lib/content → data/mock (Phase 2: Sanity client)
      │
      └──→ components/pages → components/sections → components/ui
                                    └──→ components/layout
```
- `components/*`는 `lib/content`나 `data/mock`을 **import하지 않는다.** 데이터는 항상 props로 받는다.
- `components/ui`는 도메인 타입을 알지 않는다(범용 프리미티브).
- `lib/content/*`는 `import 'server-only'`로 클라이언트 번들 유입을 막는다.

### 데이터 흐름
`page.tsx`(Server Component) → `lib/content` 함수 호출(`locale` 전달) → 현지화가 적용된 직렬화 가능한 ViewModel → 섹션 컴포넌트 props → 필요한 경우에만 클라이언트 컴포넌트로 전달.

## 5. 렌더링 전략

- Server Component 기본. 상태가 필요한 컴포넌트(메뉴, Drawer, Tabs, Accordion, Carousel, Dialog, 검색, 폼, Floating UI)만 `"use client"`.
- 모든 공개 페이지는 빌드 시 정적 생성(SSG). 페이지에서 `searchParams`를 읽지 않는다 — 쿼리 의존 UI(`?category=`, `?topic=`)는 클라이언트에서 `useSyncExternalStore`로 hydration 후 읽고, 쓰기는 `history.replaceState`로 한다 (D24).
- 현재 시각이 필요한 계산은 `'use cache'` Repository 함수 안에서만 한다 (D23).
- 이미지는 `next/image`. Phase 1의 `remotePatterns`는 `images.unsplash.com`만 허용(Phase 2에서 `cdn.sanity.io` 추가).
- 폰트는 `next/font/google`(self-host)로 레이아웃 시프트 방지.

## 6. 관리자 접근 보호 설계 (`/studio`, Phase 2)

요구사항: 관리자는 데이터를 CRUD할 수 있어야 하고, 일반 사용자는 해당 페이지에 들어올 수 없어야 하며, 자체 로그인은 구현하지 않는다.

**방식:** Sanity Studio를 `/studio`에 내장하고, 인증·권한은 Sanity 프로젝트 멤버십에 위임한다 (Decision D10).

```
[관리자] ── Sanity 계정 로그인 ──▶ /studio (Sanity Studio)
                                      │ 쓰기: 로그인한 멤버의 세션 권한
                                      ▼
                              Sanity Content Lake (private dataset)
                                      │ 읽기: 서버 전용 read token
                                      ▼
[일반 사용자] ───────────────▶ 공개 페이지 (/en, /ko ...) — 쓰기 경로 없음
```

| 계층 | 조치 |
|---|---|
| 인증 | Sanity 프로젝트에 초대된 멤버만 Studio에 로그인 가능. 비멤버는 로그인 화면 이후 어떤 데이터도 보거나 수정할 수 없음 |
| 권한 | Sanity 역할(Administrator / Editor / Viewer)로 운영진 권한 분리. 플랜별 좌석·커스텀 역할 지원 여부는 Phase 2 착수 시 확인 |
| 쓰기 | Studio는 로그인 세션으로 쓴다. **웹 앱 환경변수에 쓰기 토큰을 두지 않는다** |
| 읽기 | **private dataset** + 서버 전용 `SANITY_API_READ_TOKEN`(`NEXT_PUBLIC_` 금지). 공개 API로 직접 조회 불가 |
| CORS | Sanity 허용 origin을 운영 도메인과 `http://localhost:3000`으로 제한 (credentials 허용) |
| 노출 최소화 | 공개 UI에 Studio 링크 없음, `robots.ts`에서 `/studio` Disallow, Studio layout에 `noindex` |
| 번들 격리 | 별도 root layout으로 Studio 코드가 공개 페이지 번들에 섞이지 않음 |

**하지 않는 것:** 숨겨진 URL·쿼리 비밀값, 공유 Basic Auth 비밀번호, 자체 관리자 화면. 공유가 한 번 일어나면 무력화되고, 개인별 차단과 감사 기록이 불가능하기 때문이다.

**선택적 추가 계층:** 필요 시 Vercel Firewall 규칙이나 Cloudflare Access 같은 SSO 게이트를 `/studio` 앞에 둘 수 있다. 기본 설계만으로도 일반 사용자의 열람·수정은 차단된다.
