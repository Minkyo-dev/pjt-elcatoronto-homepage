# 00. 개요 (Overview)

- 문서 상태: Draft — 리뷰 대기
- 작성일: 2026-10-13
- 원본 요구사항: [`../brief/original-prompt.md`](../brief/original-prompt.md)

## 1. 목적

ELCA(Entrepreneurial Leadership Canada, 토론토 소재 비영리 단체, 2019년 설립) 공식 홈페이지를 Next.js + Sanity + Vercel로 새로 구축한다. 이 스펙 세트는 그중 **Phase 1: 프론트엔드 UI 프로토타입**의 설계와, 이후 단계를 위한 구조적 경계를 정의한다.

### 핵심 전환 행동
1. 멘토십 신청 (Become a Mentee)
2. 이벤트 참여 (Event Registration)
3. 후원 (Donate)

보조 행동: 멘토 지원(Become a Mentor), 문의(Contact), 뉴스레터 구독.

### 대상 사용자
학생·청년, 멘토십 신청자, 멘토 지원자, 후원자·파트너, 한인 커뮤니티 구성원. 영어·한국어 사용자가 공존하므로 EN/KO 이중언어로 제공한다.

### 성공 기준 (Phase 1)
- 9개 라우트 × 2개 로케일의 실제 화면이 반응형으로 동작한다.
- 핵심 전환 행동까지의 경로(CTA → 페이지/섹션 → 데모 폼)가 끊김 없이 이어진다.
- Phase 2에서 **컴포넌트 변경 없이** 데이터 출처만 Sanity로 교체할 수 있는 구조다.
- 디자이너 결과물이 들어올 때 **토큰과 `components/ui`만 수정**해 반영할 수 있는 구조다.

## 2. 범위

### Phase 1 포함
- Next.js App Router + TypeScript + Tailwind CSS v4 + next-intl 프로젝트
- 라우트 9종 (EN/KO): Home, About, About/Reports, Mentorship, Mentors, Donate, Events & News, Events & News 상세, Contact
- 공통 디자인 토큰, 레이아웃, UI 컴포넌트
- TypeScript mock 데이터와 도메인 타입, Content Repository 레이어
- 데모 폼(입력·검증만): Contact, Newsletter, Donation, Mentee Apply, Event Register, Host an Event, Request an Event
- 단위 테스트, E2E·접근성 테스트

### Phase 1 제외
Sanity 연동, `/studio`, Vercel 배포, 인증, 실제 DB/API, 결제, 이메일 발송, 구독 서비스, 외부 지도 embed.

### 이후 단계 (상세: [`06-roadmap-sanity-vercel.md`](06-roadmap-sanity-vercel.md))
- **Phase 2:** Sanity 연동, `/studio` 내장(관리자 CRUD), Vercel 배포, webhook 기반 재검증
- **Phase 3:** 사용자 제출 데이터 처리, 뉴스레터, 실제 후원 결제 — 별도 스펙

## 3. 문서 맵

| 문서 | 내용 |
|---|---|
| [01-architecture.md](01-architecture.md) | 스택, 라우팅, i18n, 폴더 구조, `/studio` 보호 설계 |
| [02-design-system.md](02-design-system.md) | 컬러·타이포·레이아웃 토큰, 대비 검증, 모션 |
| [03-layout-and-components.md](03-layout-and-components.md) | Header, Footer, Floating UI, 공통 컴포넌트 |
| [04-pages.md](04-pages.md) | 라우트별 섹션 구성, CTA, 폼 |
| [05-data-model.md](05-data-model.md) | 타입, 문서 타입 목록, Repository 계약, mock 규칙 |
| [06-roadmap-sanity-vercel.md](06-roadmap-sanity-vercel.md) | Phase 2·3 방향과 경계 |
| [07-quality-and-testing.md](07-quality-and-testing.md) | 테스트 전략, 완료 조건 |

## 4. 결정 로그 (Decision Log)

원본 요구사항과 달라지거나, 원본이 모호해 해석이 필요했던 결정을 기록한다.

| # | 결정 | 근거 / 비고 |
|---|---|---|
| D1 | **EN/KO 이중언어**, URL은 항상 로케일 prefix(`/en/...`, `/ko/...`), 기본 로케일 `en`. `/` 접근 시 Accept-Language로 리다이렉트 | 기존 사이트는 한국어 중심, 원본 프롬프트는 영어 UI. 두 사용자층을 모두 지원. 정적 생성과 Sanity 필드 매핑이 단순 |
| D2 | i18n 라이브러리로 **next-intl** 사용, 콘텐츠는 **필드 단위 현지화** `{ en, ko }` | 라우팅·언어 전환·날짜 포맷을 라이브러리에 위임. Sanity 필드 단위 i18n과 동일 구조 |
| D3 | **"페이지별 추가 지시"가 기본 섹션 순서보다 우선**하며, 두 목록을 병합 | 추가 지시가 더 최근·구체적인 요구로 판단 |
| D4 | Home Hero는 Typography hero 대신 **사진 배경 캐러셀**(3 슬라이드) | Home 추가 지시("최상단 carousel", 배경 동영상/사진) 우선 |
| D5 | 멘토 카드에 **사진·별점 없음**(이니셜 아바타). 디렉터리는 **이름 검색만** 제공, industry/role/location 필터는 데이터 필드만 예약 | Mentors 추가 지시("별점, photo 제외", "필터링 기능 x for now"). 공통 컴포넌트의 "Portrait mentor cards"보다 우선 |
| D6 | 멘토 상세는 **모달**(별도 라우트 없음) | 원본 섹션 5 "프로필 모달 / 상세" 중 모달 선택 |
| D7 | 별도 라우트 추가: **`/about/reports`**(Financial Statement / Annual Report), **`/events-news/[slug]`**(이벤트·뉴스 상세 + 데모 등록) | About 하위 메뉴 지시, "Upcoming Event Registration (Details) for Mentee" 지시 |
| D8 | 멘토 이벤트 개설 폼·이벤트 요청 Q&A는 별도 페이지가 아니라 **Events & News 페이지 내 탭 섹션** | 범위 최소화 |
| D9 | 사진은 **Unsplash 원격 이미지**(`next/image` remotePatterns), 운영진은 **이니셜 아바타** | 실제 활동 사진 미확보. 실존 인물 오인 방지. 타입에 `photo?`를 두어 추후 교체 |
| D10 | 관리자 CRUD는 **Sanity Studio를 `/studio`에 내장**(Phase 2). 자체 로그인 구현 없음 — 인증은 Sanity 멤버십에 위임 | 사용자 결정. 별도 배포안도 검토했으나 단일 배포 편의 선택. 보호 설계는 01 문서 참조 |
| D11 | 디자인은 **디자이너 작업물에 따라 변경될 수 있음**. 시각 결정은 토큰과 `components/ui`에만 둔다 | 사용자 지시 |
| D12 | WCAG AA를 위해 토큰 추가: `accent-strong`, `border-strong`, `on-primary-muted`, `primary-hover` | 원본 팔레트 그대로는 accent 텍스트(4.37), muted on primary(2.66), 입력 테두리(1.18)가 기준 미달. 02 문서 참조 |
| D13 | Header의 About ELCA에도 하위 메뉴(About ELCA, Reports) 추가 | Reports 라우트 진입 경로 확보 |
| D14 | "Become a Mentor" CTA는 `/contact?topic=mentor`로 연결해 문의 주제를 미리 채움 | 원본 "→ /contact" 유지하면서 맥락 전달 |
| D15 | Privacy Policy 페이지는 범위 밖. Footer 링크는 임시로 Contact로 연결하고 "준비 중" 표시 | 원본 Footer 요소 유지, 빈 링크(`#`) 방지 |
| D16 | UI 프리미티브는 외부 UI 라이브러리 없이 **네이티브 기반**(`<dialog>`, `<details>` 등) 구현, 아이콘은 `lucide-react` | 의존성 최소화, 디자이너 스타일 적용 용이 |
| D17 | 폼 검증은 **zod** 스키마로 분리 | Phase 3 Server Action에서 재사용 |
| D18 | 기존 사이트(elcatoronto.com)에서 확인한 사실(2019 설립, 12개 cohort, 약 200명 멘티, 1·7월 모집, 연락처)은 사용하되 **`needsReview`(검수 대상)** 표시. 그 외 인물·통계·후원 수치는 **`isSample`(SAMPLE)** 표시 | 원본 "검증되지 않은 사실을 만들지 않는다" |
| D19 | 한국어 제목 letter-spacing은 -0.01em으로 완화 | 한글에 -0.04em 적용 시 자간이 뭉침 |
| D20 | 문서는 `docs/specs/`에 주제별 번호 파일로 분할 | 디자이너·팀원의 탐색 편의 |
| D21 | 런타임 **Node 24 LTS**, 이 레포에만 `.nvmrc`로 적용 (nvm default는 20 유지) | Node 20 지원 종료, Vitest 5는 Node 22+ 필요. 다른 레포(Next.js 14) 영향 없음 |
| D22 | Next.js 16.4 기본값인 `cacheComponents`는 켜고, **`partialPrefetching`은 끈다** | 켜 두면 알 수 없는 `[slug]`가 404 대신 200을 반환함을 검증으로 확인 |
| D23 | 현재 시각에 의존하는 로직(이벤트 예정/지난 판정, 저작권 연도)은 `'use cache'` Repository 함수 안에서만 계산 | cacheComponents는 prerender 중 `new Date()`를 빌드 에러로 처리 |
| D24 | `?category=`, `?topic=`은 `Suspense`+`useSearchParams` 대신 **`useSyncExternalStore`로 hydration 후 읽음** | 페이지 전체를 정적 HTML로 유지(서버 스냅샷은 기본값). 허용 목록 외 값은 무시 |
| D25 | 사진 위 오버레이를 `rgb(23 35 43 / 0.72)`로 강화, 사진 위 텍스트는 `on-primary`(흰색)만 사용 | 흰 사진 최악 조건에서 0.6은 4.30:1로 AA 미달, 0.72는 6.36:1 |
| D26 | 파생 토큰 `primary-deep`, `danger-on-dark` 추가, Button에 `inverse` variant 추가 | 다크 Footer와 사진 위 CTA의 대비 확보 |
| D27 | lucide-react 1.x에 브랜드 아이콘이 없어 SNS는 레터마크(`f`, `in`)로 대체 | 공식 마크는 디자이너 결과물로 교체 |
| D28 | 개발 전용 **UI Lab**(`/{locale}/ui-lab`): 빌드 시 `NEXT_PUBLIC_ENABLE_UI_LAB=1`일 때만 존재, noindex | 프리미티브 E2E 테스트와 디자이너용 컴포넌트 쇼케이스 겸용 |
| D29 | 현지화 해석은 필드별 수동 매핑 대신 타입 안전한 **깊은 resolver**(`resolveLocalized` + `Resolved<T>`) | 매핑 코드 수백 줄 제거, Doc ↔ View 타입 자동 일치 |
| D30 | `mentor.company`도 `Localized` | 학생 멘토의 소속("경영학 학부 재학")은 번역이 필요 |
| D31 | 데모 폼은 데모 안내 직후 재제출(더블클릭)을 무시해 초기화된 폼에 `required` 에러가 번쩍이지 않게 함 | 사용자 혼란 방지 |

## 5. 검수·확인 필요 항목 (Open Items)

Phase 1 구현을 막지는 않지만 실제 운영 전 확인이 필요한 항목이다.

- 공식 연락처 이메일(`info@elcatoronto.com`)과 SNS 계정(Facebook `elcatoronto`, LinkedIn `company/elcatoronto`)
- 설립 연도, cohort 수, 누적 멘티 수, 모집 시기 등 기존 사이트 기재 사실의 최신화
- 자선단체(Registered Charity) 등록 여부 — Donate FAQ의 세금 영수증 답변에 영향
- Privacy Policy 페이지 필요 여부와 내용
- 실제 활동 사진, Hero 배경 동영상, 후원사 로고·목록, 운영진 사진 사용 동의
- 디자이너 결과물의 반영 시점과 범위
