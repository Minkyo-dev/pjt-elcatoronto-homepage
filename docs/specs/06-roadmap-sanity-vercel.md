# 06. 로드맵: Phase 2 (Sanity · Studio · Vercel) / Phase 3

> 이 문서는 Phase 2·3의 **방향과 경계**만 정의한다. 각 Phase 착수 시 별도의 상세 스펙과 구현 계획을 작성한다.

## 1. 단계 개요

| 단계 | 범위 | 상태 |
|---|---|---|
| **Phase 1** | UI 프로토타입: mock 데이터, EN/KO, 9개 라우트, 데모 폼, 테스트 | 이 스펙 세트의 구현 대상 |
| **Phase 2** | Sanity 연동, `/studio` 내장(관리자 CRUD), Vercel 배포, 콘텐츠 재검증 | 방향 확정 |
| **Phase 3** | 사용자 제출 데이터 처리, 뉴스레터, 실제 후원 결제 | 경계만 정의 |

## 2. Phase 2 — Sanity

### Studio 내장 (Decision D10)
- `app/studio/[[...tool]]/page.tsx`에서 `next-sanity/studio`의 `NextStudio` 렌더링. `app/studio/layout.tsx`는 별도 root layout(`noindex`).
- 설정: 루트 `sanity.config.ts`, `sanity.cli.ts`. 스키마: `sanity/schemaTypes/`.
- Structure tool 구성:
  - **Pages:** Singleton 문서(siteSettings, homePage, aboutPage, reportsPage, mentorshipPage, mentorsPage, donatePage, eventsPage, contactPage) — 문서 생성·삭제 불가, 단일 편집 화면.
  - **Collections:** mentor, teamMember, event, post, testimonial, faq(그룹별 필터 목록), sponsor, report, timelineEntry, stat, coreValue, donationTier.
- 접근 보호는 [01-architecture.md](01-architecture.md) §6 "관리자 접근 보호 설계"를 따른다.

### 스키마
- [05-data-model.md](05-data-model.md)의 문서 타입 목록과 1:1.
- 현지화 객체 타입: `localeString`, `localeText`, `localeStringArray`, `localeRichText` — 모두 `{ en, ko }` 필드. `en`은 required, `ko`는 optional(미입력 시 en fallback).
- `isSample`, `needsReview` boolean 필드를 해당 타입에 유지하고, 문서 목록 미리보기에 배지로 표시해 운영진이 실제 데이터로 교체할 대상을 쉽게 찾게 한다.
- `slug`는 `event`·`post` 전체에서 유일하도록 커스텀 `isUnique` 검증.
- 이미지 필드는 `alt`(localeString) 필수.

### 데이터 접근 전환
- `lib/sanity/client.ts`(`next-sanity` `createClient`, `useCdn`, `perspective: 'published'`), `lib/sanity/queries.ts`(GROQ).
- `lib/content/*` 내부를 GROQ 호출로 교체. 시그니처·ViewModel 유지.
- `sanity typegen`으로 생성한 타입과 `types/`의 Doc 타입을 비교해 차이를 해소.
- `next.config` `images.remotePatterns`에 `cdn.sanity.io` 추가, 이미지 URL은 `@sanity/image-url`로 생성.

### 초기 콘텐츠 이관
- `scripts/export-mock-to-ndjson.ts`: `data/mock` → NDJSON 변환 → `sanity dataset import`.
- 이미지는 실제 사진으로 교체해 업로드(Unsplash 이미지는 이관하지 않는 것을 기본으로 함).

### 콘텐츠 갱신
- 페이지는 정적 생성 + 문서 타입별 cache tag(예: `mentor`, `event`, `homePage`).
- Sanity webhook → `POST /api/revalidate` → `next-sanity/webhook`의 `parseBody`로 **서명 검증** → `_type`에 해당하는 tag만 재검증.
- 구체적인 캐시 API(`revalidateTag` / Cache Components의 `cacheTag`)는 Phase 2 착수 시 Next.js 버전에 맞춰 결정.

### 미리보기 (선택)
- Presentation tool + Draft Mode(`/api/draft-mode/enable`, `@sanity/preview-url-secret`으로 요청 검증). 게시 전 화면을 Studio 안에서 확인.

### 환경변수

| 변수 | 노출 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | 공개 | Studio·클라이언트 설정 (비밀 아님) |
| `NEXT_PUBLIC_SANITY_DATASET` | 공개 | dataset 이름 |
| `NEXT_PUBLIC_SANITY_API_VERSION` | 공개 | API 버전 날짜 |
| `SANITY_API_READ_TOKEN` | **서버 전용** | private dataset 읽기, draft 미리보기 |
| `SANITY_REVALIDATE_SECRET` | **서버 전용** | webhook 서명 검증 |
| 쓰기 토큰 | **두지 않음** | Phase 3에서 제출 처리 방식 결정 시 재검토 |

## 3. Phase 2 — Vercel

- GitHub 연동: PR마다 Preview 배포, `main` → Production.
- 환경변수는 Preview / Production 분리. 필요 시 dataset을 `staging` / `production`으로 분리하고 Preview는 `staging`을 바라본다.
- 커스텀 도메인 연결 후 Sanity CORS origin에 운영 도메인과 Preview 도메인 패턴 등록.
- Studio 접근 보호에 Vercel Firewall 규칙을 추가할지는 운영진 접속 환경을 확인 후 결정(선택 사항).

## 4. Phase 3 — 경계

Phase 1에서 미리 지켜야 할 경계만 정의한다.

- 데모 폼의 제출 함수(`onSubmit`)는 UI와 분리된 단일 함수이며, zod 스키마(`lib/validation/*`)는 서버에서 재사용 가능하게 순수 모듈로 둔다. → Phase 3에서 Server Action으로 교체.
- Phase 3에서 결정할 사항:
  - 제출 데이터 저장처: Sanity `submission` 문서(범위 제한 토큰) / 이메일 서비스 / 외부 폼 서비스
  - 스팸 방지: honeypot, rate limit, CAPTCHA 여부
  - 뉴스레터 서비스 선택
  - 후원 결제: Stripe / CanadaHelps 등, 세금 영수증 발행 가능 여부(자선단체 등록 여부에 따름)
  - 개인정보 처리방침(Privacy Policy) 페이지
