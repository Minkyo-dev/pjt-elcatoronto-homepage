# 07. 품질 기준과 테스트 (Quality & Testing)

## 1. 테스트 계층

| 계층 | 도구 | 명령 (예정) | 대상 |
|---|---|---|---|
| 타입 | TypeScript | `npm run typecheck` (`tsc --noEmit`) | 전체 |
| 린트 | ESLint (Next.js 설정) | `npm run lint` | 전체 |
| 단위 | Vitest | `npm run test` | 순수 로직 (§2) |
| E2E·접근성 | Playwright + `@axe-core/playwright` | `npm run test:e2e` | 라우트·인터랙션 (§3) |
| 빌드 | Next.js | `npm run build` | 모든 라우트 × en/ko 정적 생성 성공 |

로직 단위(§2)는 **테스트 우선(TDD)** 으로 작성한다. UI 인터랙션은 E2E로 검증한다.

## 2. 단위 테스트 (Vitest)

| 대상 | 검증 내용 |
|---|---|
| `localize()` | `ko` 존재 시 ko 반환, 없거나 빈 문자열이면 en fallback |
| `getEvents()` | `now` 주입 시 upcoming/past 분류, 정렬 방향, `kind` 필터 |
| `getEventTimeline()` | 연도 그룹핑, 과거/현재/예정 상태 |
| `getContentBySlug()` | event·post 판별, 없는 slug → `null` |
| mock 무결성 | event·post slug 전체 유일, 모든 이미지에 alt.en·width·height 존재, `order` 중복 없음 |
| 멘토 검색 (`filterMentors`) | 대소문자·공백 무시, 다른 로케일 이름으로도 매칭, 빈 검색어 → 전체 |
| zod 스키마 | 각 폼의 필수값·이메일 형식·길이 제한·후원 금액 범위(5–10,000, 정수) |
| Contact `topic` 파서 | 허용값 매핑, 알 수 없는 값 무시 |

## 3. E2E·접근성 테스트 (Playwright)

### 뷰포트
- mobile 375×812, tablet 768×1024, desktop 1280×800.

### 라우트 스모크 (9 라우트 × en/ko, 상세는 대표 slug 2개: 예정 이벤트 1, 뉴스 1)
- HTTP 200, `<html lang>`이 로케일과 일치.
- `h1`이 정확히 1개.
- **axe 검사: serious / critical 위반 0건.**
- 3개 뷰포트 모두 **가로 overflow 없음**: `document.documentElement.scrollWidth <= clientWidth`.
- 존재하지 않는 slug → 404 화면.
- `/` → `/en` 또는 `/ko` 리다이렉트.

### 인터랙션 시나리오
| 영역 | 시나리오 |
|---|---|
| Header (desktop) | Get Involved 드롭다운을 키보드로 열고(Enter) ↓ 이동, Esc로 닫히며 트리거로 focus 복귀. 외부 클릭으로 닫힘 |
| Header (mobile) | 햄버거 → Drawer 열림, Tab이 Drawer 내부에 갇힘, Esc로 닫힘, 링크 클릭 시 이동 후 닫힘 |
| 언어 전환 | `/en/get-involved/mentors` → KO 클릭 → `/ko/get-involved/mentors`, 쿼리 유지 |
| Hero 캐러셀 | 다음/이전 이동, 일시정지 버튼 동작. `reducedMotion: 'reduce'` 에뮬레이션 시 일정 시간 후에도 슬라이드 변화 없음 |
| Testimonials | 다음 버튼으로 가로 스크롤 이동 |
| Accordion | FAQ 항목 열고 닫기, `aria-expanded`/`open` 상태 |
| Mentors | 이름 검색 → 결과 수 갱신, 결과 없음 EmptyState, "Load more"로 카드 증가, "View Profile" → Dialog 열림·Esc로 닫힘·트리거로 focus 복귀 |
| Mentorship | "Apply for Mentorship" → `#apply` 이동, Apply Dialog 폼 빈 제출 시 에러·첫 필드 focus, 올바른 입력 시 DEMO 상태 |
| Donate | 프리셋 선택 → 요약 갱신, Other에 3 입력 → 에러, 50 입력 → DEMO 상태("No payment was processed") |
| Events & News | 카테고리 탭 전환 → URL `?category=` 반영 및 목록 변화, 새로고침 후 탭 상태 복원, Gallery Lightbox 열고 닫기, Host/Request 탭 폼 검증 |
| 이벤트 상세 | 예정 이벤트에 등록 폼 존재·DEMO 제출, 지난 이벤트에는 Recap 갤러리 존재·등록 폼 없음 |
| Contact | `?topic=mentor` 진입 시 주제가 "Become a Mentor"로 선택됨, 폼 검증·DEMO 상태 |
| Newsletter | 잘못된 이메일 에러, 올바른 이메일 → "This is a demo" 문구, 체크 아이콘 없음 |
| Floating UI | 초기 Top 버튼 숨김, 700px 스크롤 후 표시, 클릭 시 상단 이동. Dialog/Drawer 열면 Contact·Top 버튼 모두 숨김 |
| 링크 | [04-pages.md](04-pages.md) 부록 A의 CTA 매핑을 순회하며 대상 경로·앵커 확인 |

## 4. 수동 확인 항목

자동화하기 어려워 구현 완료 시 사람이 확인한다.
- 사진 Hero 위 텍스트 대비(오버레이 적용 후) — 이미지별로 육안 + 대비 도구 확인.
- 한국어 페이지의 줄바꿈(`word-break: keep-all` 적용 여부)과 제목 자간.
- 스크린리더(VoiceOver 또는 NVDA)로 Home·Mentors·Donate 핵심 흐름 1회 통과.
- Lighthouse(모바일) Performance·Accessibility·Best Practices·SEO 점수 기록(목표: Accessibility 95+, CLS < 0.1).

## 5. Phase 1 완료 조건 (Definition of Done)

1. 9개 라우트 × en/ko가 렌더링되고, 모든 내부 링크와 CTA가 올바른 라우트·앵커로 연결된다.
2. Accordion, Tabs, Dialog, Drawer, Carousel, 멘토 검색, Load more가 로컬 state로 동작한다.
3. **모든 데모 폼**(Contact, Newsletter, Donation, Mentee Apply, Event Register, Host an Event, Request an Event)이 입력·검증만 수행하고 DEMO 상태를 명확히 표시하며, 외부 네트워크 요청을 보내지 않는다.
4. §1의 typecheck·lint·unit·e2e·build가 모두 통과한다.
5. 이미지는 고정 비율 또는 width/height 지정으로 CLS를 방지한다.
6. 컴포넌트에 하드코딩된 콘텐츠가 없다. 반복 목록은 mock 배열의 `map`으로 렌더링한다. 화면 문구는 messages 또는 mock에서 온다.
7. SAMPLE·검수 대상 데이터에 배지가 표시된다.
8. 컴포넌트에 hex 값·임의 px 값이 없다(토큰만 사용) — 디자이너 교체 대비 ([02-design-system.md](02-design-system.md)).
9. `README.md`에 실행 명령어, 폴더·컴포넌트 구조 설명, mock 데이터 수정 방법, 이벤트 상태가 빌드 시점에 따라 달라진다는 주의사항이 있다.
