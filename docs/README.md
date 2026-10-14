# ELCA Toronto Homepage — 문서

Next.js + Sanity + Vercel 기반 ELCA(Entrepreneurial Leadership Canada) 공식 홈페이지 프로젝트의 설계 문서 모음.

## 읽는 순서

1. [specs/00-overview.md](specs/00-overview.md) — 목적, 범위, 단계 구분, **결정 로그**, 확인 필요 항목
2. [specs/01-architecture.md](specs/01-architecture.md) — 스택, 라우팅, i18n, 폴더 구조, `/studio` 접근 보호
3. [specs/02-design-system.md](specs/02-design-system.md) — 디자인 토큰, 대비 검증 (⚠️ 디자이너 작업물에 따라 변경 가능)
4. [specs/03-layout-and-components.md](specs/03-layout-and-components.md) — Header, Footer, Floating UI, 공통 컴포넌트, 폼·접근성 규칙
5. [specs/04-pages.md](specs/04-pages.md) — 라우트별 섹션 구성, CTA 매핑
6. [specs/05-data-model.md](specs/05-data-model.md) — 타입, 문서 타입, Repository 계약, mock 규칙
7. [specs/06-roadmap-sanity-vercel.md](specs/06-roadmap-sanity-vercel.md) — Phase 2(Sanity·Studio·Vercel), Phase 3 경계
8. [specs/07-quality-and-testing.md](specs/07-quality-and-testing.md) — 테스트 전략, 완료 조건

## 디렉터리

| 경로 | 내용 |
|---|---|
| `brief/` | 전달받은 요구사항 원문 (수정하지 않음) |
| `specs/` | 설계 스펙 |
| `plans/` | 구현 계획 — [Phase 1 인덱스](plans/2026-10-13-phase1-00-index.md) |

## 문서 운영 규칙

- 원문(`brief/`)과 다른 결정을 내리면 `specs/00-overview.md`의 결정 로그에 번호를 붙여 추가한다.
- 디자이너 결과물 반영 시 `specs/02-design-system.md`의 토큰 표와 대비 검증 표를 함께 갱신한다.
