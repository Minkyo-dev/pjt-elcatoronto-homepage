# 02. 디자인 시스템 (Design System)

> **⚠️ 변경 가능성 고지**
> 이 문서의 컬러·타이포·간격·컴포넌트 시각 스타일은 **Phase 1 프로토타입을 위한 초기값**이며, **디자이너의 작업물에 따라 변경될 수 있다.**
> 이를 위해 시각적 결정은 아래 두 곳에만 둔다.
> 1. `app/globals.css`의 `@theme` 토큰
> 2. `components/ui/*` 프리미티브의 스타일
>
> `components/sections`, `components/pages`, `app/`은 **토큰 이름(Tailwind 유틸리티)만 참조**하고 hex 값·임의 px 값을 직접 쓰지 않는다. 디자인 변경 시 위 두 곳만 수정하면 전체에 반영되는 것을 목표로 한다.

## 1. 디자인 방향

- **Warm Community:** 실제 사람과 커뮤니티 활동 사진, 친밀하고 환영받는 분위기.
- 컬러 비중 가이드: Neutral(Background/Surface) 약 75%, Primary/Secondary 약 20%, Accent 약 5%.
- 지양: 과도한 그라디언트, 과장된 모션, 큰 그림자, 무의미한 장식.
- ADPList의 현대적 UI 패턴을 참고하되 복제하지 않는다.

## 2. 컬러 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `primary` | #17324D | 주요 CTA, Footer 배경, 진한 섹션 |
| `primary-hover` | #10263B | primary 버튼 hover |
| `secondary` | #406A72 | 보조 강조, 링크, 배지, focus ring |
| `accent` | #B85B35 | Donate CTA 배경, 핵심 강조(제한적) |
| `accent-strong` | #A14E2C | accent 계열 **텍스트**, accent 버튼 hover |
| `background` | #F9FAF8 | 페이지 배경 |
| `surface` | #FFFFFF | 카드, Header, 입력 필드 배경 |
| `text` | #17232B | 본문 |
| `muted` | #65727C | 보조 텍스트(밝은 배경 위) |
| `on-primary` | #FFFFFF | primary/secondary/accent 배경 위 텍스트 |
| `on-primary-muted` | #B9C1CA | primary 배경 위 보조 텍스트 |
| `border` | #E3E8E5 | 카드·구분선(장식용) |
| `border-strong` | #8A959C | 입력 필드 테두리, 의미 있는 UI 경계 |
| `overlay` | `rgb(23 35 43 / 0.72)` | 사진 Hero 위 어두운 오버레이. 흰 사진 최악 조건에서도 흰 텍스트 6.36:1 (D25). 사진 위 텍스트는 `on-primary`만 사용 |
| `primary-deep` | #10263B | Footer 본문 배경 (pre-footer CTA `primary`와 구분) |
| `danger-on-dark` | #FDA29B | 다크 배경 위 폼 에러 (7.94:1 on `primary-deep`) |
| `danger` | #B42318 | 폼 에러 텍스트·테두리 |

`primary-hover`, `primary-deep`, `accent-strong`, `on-primary-muted`, `border-strong`, `overlay`, `danger`, `danger-on-dark`는 원본 팔레트에 없는 **파생 토큰**이다 (Decision D12, D26).

### 대비 검증 결과 (WCAG 2.x 상대 휘도 공식으로 계산)

| 조합 | 대비 | 판정 | 규칙 |
|---|---|---|---|
| text on background | 15.29 | AA ✅ | |
| muted on background / surface | 4.72 / 4.94 | AA ✅ | |
| on-primary on primary | 13.13 | AA ✅ | |
| on-primary on secondary | 5.96 | AA ✅ | |
| on-primary on accent | 4.58 | AA ✅ (여유 적음) | hover는 `accent-strong`(5.77) |
| **accent on background** | **4.37** | **AA ❌ (일반 텍스트)** | accent 텍스트는 `accent-strong`(5.51) 사용 |
| **muted on primary** | **2.66** | **AA ❌** | primary 배경 위 보조 텍스트는 `on-primary-muted`(7.22) |
| **border on background** | **1.18** | **비텍스트 3:1 ❌** | `border`는 장식용 한정. 입력 테두리는 `border-strong`(3.06 on surface) |
| secondary (focus ring) on surface | 5.96 | 3:1 ✅ | |
| danger on surface / background | 6.57 / 6.28 | AA ✅ | 에러 텍스트·테두리 |

디자이너 팔레트로 교체 시 이 표를 다시 계산해 갱신한다.

## 3. 타이포그래피

### 서체
- Heading: **Manrope** / Body: **Inter** / Korean: **Noto Sans KR**
- `next/font/google`으로 로드, weight 400·500·600·700·800.
- 폰트 스택
  - `en`: heading `Manrope, "Noto Sans KR", sans-serif` / body `Inter, "Noto Sans KR", sans-serif`
  - `ko`: heading `Manrope, "Noto Sans KR", sans-serif`(Latin 제목은 브랜드 서체 유지, 한글 글리프는 Noto Sans KR로 fallback) / body `"Noto Sans KR", Inter, sans-serif`(본문은 한·영 혼용 시 글자 높이·굵기 일관성을 위해 Noto Sans KR 우선)
  - 로케일별 스택 전환은 `html[lang]` 선택자로 처리한다.

### 스케일 (`clamp()`로 모바일 → 데스크톱 연속 보간)

| 토큰 | Mobile | Desktop | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `display` / H1 | 36–40px | 52–60px | 800 | 1.1 | -0.03em |
| H2 | 28–32px | 36–40px | 700 | 1.15 | -0.02em |
| H3 | 22px | 24px | 700 | 1.2 | -0.02em |
| H4 | 18px | 20px | 600 | 1.3 | -0.01em |
| body-lg | 18px | 18px | 400 | 1.7 | 0 |
| body | 16px | 16px | 400 | 1.7 | 0 |
| small | 14px | 14px | 400–500 | 1.6 | 0 |
| eyebrow | 13px | 13px | 600 | 1.4 | 0.06em, 대문자(EN) |

- `/ko`에서는 제목 letter-spacing을 **-0.01em**으로 완화한다 (Decision D19). `html[lang="ko"]` 선택자로 처리.
- 최대 너비: 본문 `680px`(`max-w-prose` 토큰화), 제목 `900px`.
- 기본 정렬은 왼쪽. Hero·CTA·Testimonial은 필요 시 가운데 정렬.

## 4. 레이아웃·간격

| 항목 | Mobile (0–639) | Tablet (640–1023) | Desktop (1024+) | Wide (1280+) |
|---|---|---|---|---|
| Container 좌우 padding | 20px | 32px | 48px | 48px |
| Container max-width | — | — | — | 1280px |
| Section 세로 padding | 56px | 72px | 96px | 96px |
| Grid columns | 4 | 8 | 12 | 12 |
| Card gap | 24px | 24px | 24px | 24px |

- Breakpoint는 Tailwind 기본값 `sm`(640), `lg`(1024), `xl`(1280)을 그대로 사용한다. `md`(768)는 사용하지 않는다.
- 카드 그리드: 멘토 4/2/1열, 이벤트·뉴스 3/2/1열.

### 형태
| 요소 | 값 |
|---|---|
| Card radius | 8px |
| Image radius | 8px |
| Button radius | 6px |
| Border | 1px `border` |
| Shadow | 기본 없음. 떠 있는 요소(Dropdown, Dialog, Floating 버튼)만 작은 그림자 1종 허용 |

### 이미지 비율
| 용도 | 비율 |
|---|---|
| Hero 배경 | `object-cover`, 최소 높이 지정 |
| Event / News 카드 | 3:2 |
| Gallery | 1:1 (Lightbox에서 원본 비율) |
| Featured 카드 | 16:9 |

모든 이미지는 고정 비율 컨테이너 또는 `width/height`를 지정해 CLS를 막는다.

## 5. 모션

- 전환은 **hover, focus, 메뉴, 아코디언에만** 150–200ms (`ease-out`).
- 스크롤 기반 등장 애니메이션 없음. 패럴랙스 없음.
- `prefers-reduced-motion: reduce`일 때: 모든 transition 제거, 캐러셀 자동 재생 비활성, smooth scroll 비활성.

## 6. 상호작용 상태

| 상태 | 규칙 |
|---|---|
| Focus | `:focus-visible`에서 2px `secondary` ring + 2px offset. primary/사진 배경 위에서는 흰색 ring |
| Hover | 색 변화 또는 밑줄. 레이아웃이 움직이는 transform 금지 |
| Active/Current | 내비게이션은 `aria-current="page"` + 밑줄 |
| Disabled | 불투명도 낮춤 + `cursor-not-allowed` + `aria-disabled` |
| Touch target | 최소 44×44px |

## 7. 배지 (Sample / Review)

- `Badge variant="sample"`: "SAMPLE" — `isSample` 데이터에 표시.
- `Badge variant="review"`: "검수 필요 / Needs review" — `needsReview` 데이터에 표시. Phase 1에서는 화면에 보이게 하고, Phase 2에서 운영진이 확인 후 플래그를 해제하면 사라진다.
- `Badge variant="demo"`: "DEMO" — 데모 폼 제목 옆.
