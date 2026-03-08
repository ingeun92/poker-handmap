<p align="center">
  <img src="https://img.shields.io/badge/♠♥♦♣-Poker_Hand_Map-1a1a2e?style=for-the-badge&labelColor=059669&color=0a0a14" alt="Poker Hand Map" />
</p>

<h1 align="center">Poker Hand Map</h1>

<p align="center">
  <strong>6-max 캐시 게임을 위한 프리플랍 핸드 레인지 학습 도구</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## 왜 만들었나요?

포커를 플레이하면서 **"이 핸드, 이 포지션에서 뭘 해야 하지?"** 라는 고민을 해본 적 있으신가요?

GTO 기반의 핸드 레인지를 머릿속에 넣는 건 쉽지 않습니다. 169개의 핸드 조합 × 6개 포지션 × 다양한 시나리오... 이 모든 걸 직관적으로 학습할 수 있는 도구가 필요했습니다.

> **Poker Hand Map**은 포지션별 최적 액션을 **색상 하나로 즉각 판단**할 수 있도록 설계되었습니다.

---

## 핵심 기능

### 🗺️ 액션 기반 핸드맵

기존의 핸드 차트는 핸드의 "등급"만 보여줍니다. 하지만 실전에서 필요한 건 **"지금 뭘 해야 하는가"** 입니다.

```
┌─────────────────────────────────────────┐
│  액션 뷰 (기본)                           │
│                                         │
│  🟩 Raise  — 초록색, 바로 "Go" 인식       │
│  🟥 3-Bet  — 빨간색, 공격적 액션          │
│  🟦 Call   — 파란색, 수동적 플레이         │
│  ⬛ Fold   — 어두운 배경에 녹아듦           │
│                                         │
│  → 한 눈에 "이 핸드는 레이즈!" 판단 가능    │
└─────────────────────────────────────────┘
```

|  | 액션 뷰 | 등급 뷰 |
|:---:|:---:|:---:|
| **색상 기준** | Raise / Call / Fold / 3-Bet | Premium / Strong / Playable / Marginal / Weak |
| **용도** | 실전 빠른 판단 | 핸드 강도 학습 |
| **전환** | 우측 상단 토글로 즉시 전환 가능 | ← |

### 📍 6-max 포지션별 레인지

```
         ┌─────────┐
    SB ──┤  TABLE  ├── BB
         └────┬────┘
    BTN ──────┼────── UTG
         CO ──┘── MP
```

| 포지션 | 설명 | 오픈 레인지 |
|:---:|:---|:---:|
| **UTG** | 가장 타이트한 포지션 | ~14% |
| **MP** | 약간 확장 | ~19% |
| **CO** | 넓은 레인지 | ~27% |
| **BTN** | 가장 넓은 레인지 | ~43% |
| **SB** | Raise or Fold | ~40% |
| **BB** | 3-Bet + Wide Call | ~39% |

### ⚔️ 방어 레인지 (vs 오픈)

단순 오픈 레인지뿐 아니라, **상대가 오픈했을 때 어떻게 대응할지**도 포함합니다.

- **SB vs BTN**: 3-Bet or Fold (콜 없음, OOP이므로)
- **BB vs UTG**: 타이트한 3-Bet + 넓은 콜 레인지
- **BTN vs CO**: 넓은 3-Bet + 콜 레인지

총 **15개 시나리오**에 대한 최적 대응 전략이 내장되어 있습니다.

---

## 학습 모드

| 모드 | 설명 | 효과 |
|:---|:---|:---|
| **📊 핸드맵** | 포지션별 레인지를 시각적으로 탐색 | 전체 그림 파악 |
| **🧩 그리드 채우기** | 빈 그리드에 올바른 액션 배치 | 공간 기억 강화 |
| **⚖️ 핸드 비교** | 두 핸드 중 더 강한 핸드 선택 | 상대적 핸드 강도 학습 |
| **📂 카테고리 분류** | 핸드를 올바른 등급에 분류 | 티어 체계 내재화 |
| **🎯 오픈 레인지** | 포지션별 오픈/폴드 판단 | 실전 의사결정 훈련 |
| **⚡ 스피드 퀴즈** | 시간 제한 하에 빠른 판단 | 반응 속도 향상 |
| **🔄 간격 반복** | Leitner 박스 기반 복습 | 장기 기억 정착 |
| **📈 대시보드** | 학습 진행도 및 통계 | 성장 추적 |

---

## GTO 전략 하이라이트

### 왜 88을 폴드하고 87s를 3-Bet 하나요?

SB에서 자주 보이는 이 패턴은 GTO적으로 올바릅니다:

```
SB vs CO 레인지:

  3-Bet (블러프)          Fold
  ┌──────────┐          ┌──────────┐
  │ 87s 76s  │          │ 88 77 66 │
  │ 65s      │          │ 55 44 33 │
  └──────────┘          └──────────┘

이유:
• SB는 OOP → 콜 불가 → 3-Bet or Fold만 가능
• 88~66: 3-Bet 밸류로 약하고, 블러프로 쓰기엔 쇼다운 밸류가 아까움
• 87s~65s: 넛 포텐셜(스트레이트/플러시) 높아 3-Bet 블러프에 이상적
```

---

## 빠른 시작

```bash
# 설치
pnpm install    # 또는 npm install

# 개발 서버 실행
pnpm dev        # 또는 npm run dev

# 빌드
pnpm build      # 또는 npm run build
```

> 기본 포트: `http://localhost:5173`

---

## 프로젝트 구조

```
src/
├── components/
│   ├── handmap/        # 핸드맵 그리드, 셀, 툴팁, 범례
│   ├── quiz/           # 다양한 퀴즈 모드 컴포넌트
│   ├── dashboard/      # 학습 통계 시각화
│   └── spaced-repetition/  # Leitner 박스 학습
├── data/
│   ├── hands.ts        # 169개 핸드 랭킹 데이터
│   ├── positions.ts    # 포지션별 오픈 & 3-Bet 레인지
│   └── vsOpenRanges.ts # 방어 레인지 (15개 시나리오)
├── pages/              # 라우트별 페이지 컴포넌트
├── hooks/              # 커스텀 훅 (퀴즈, 타이머, 통계)
├── types/              # TypeScript 타입 정의
└── utils/              # 색상, 핸드 유틸리티
```

---

## 기여하기

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.

---

<p align="center">
  <sub>Built with ♠️ for poker learners everywhere</sub>
</p>
