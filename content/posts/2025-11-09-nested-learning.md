---
title: "Nested Learning: The Illusion of Deep Learning
Architectures 논문 번역본"
date: 2025-11-09T09:15:00+09:00
tags: ["AI"]
description: ""
draft: false
---

# Nested Learning: The Illusion of Deep Learning Architectures

## Abstract

지난 수십 년 동안, 더 강력한 신경망 구조를 개발하고 동시에 그것들을 효과적으로 학습시키기 위한 최적화 알고리즘을 설계하는 것이 머신러닝 모델의 성능을 향상시키기 위한 연구의 핵심이 되어왔다. 최근 특히 언어 모델(Language Models, LMs)의 발전에도 불구하고, 이러한 모델이 지속적으로 학습·기억하며, 스스로 개선하고, ‘효과적인 해(solution)’를 찾을 수 있는가에 대한 근본적인 도전과 미해결 문제가 여전히 존재한다. 이 논문에서는 **Nested Learning(NL)**이라 불리는 새로운 학습 패러다임을 제시한다. 이는 모델을 여러 개의 중첩된(nested), 다단계(multi-level), 또는 병렬적인 최적화 문제들의 집합으로 일관되게 표현하는 방식이다. 각 최적화 문제는 고유한 **‘context flow(문맥 흐름)’**를 가진다. NL은 기존의 딥러닝 방법이 데이터를 학습할 때 사실상 자신의 문맥 흐름을 압축하는 과정을 거친다는 점을 드러내며, 대형 모델에서 ‘in-context learning(문맥 내 학습)’이 어떻게 나타나는지를 설명한다. NL은 또한 딥러닝에 새로운 차원을 제시하며, 더 많은 ‘단계(levels)’를 가진 보다 표현력 있는 학습 알고리즘 설계를 가능하게 하여 고차원적(in-higher-order) 문맥 내 학습 능력을 부여한다. 그 신경과학적으로 그럴듯하고 수학적으로도 화이트박스(white-box)적인 특성 외에도, 우리는 NL의 중요성을 세 가지 핵심 기여를 통해 강조한다:
1. Deep Optimizers: NL에 기반하여, 잘 알려진 그래디언트 기반 옵티마이저들(예: Adam, 모멘텀을 가진 SGD 등)이 사실상 그래디언트를 그래디언트 하강법으로 압축하려는 연합기억(associative memory) 모듈임을 보인다. 이를 바탕으로, 더 깊은 메모리와 더 강력한 학습 규칙을 가진 새로운 형태의 옵티마이저들을 제안한다.
2. Self-Modifying Titans: NL이 학습 알고리즘에 대해 제공하는 통찰을 활용하여, 자신의 업데이트 알고리즘을 학습함으로써 스스로를 수정할 수 있는 새로운 시퀀스 모델을 제시한다.
3. Continuum Memory System: 기존의 ‘장기/단기 메모리’ 개념을 일반화하는 새로운 메모리 시스템 공식을 제시한다.
이 자기 수정형 시퀀스 모델과 연속 메모리 시스템을 결합하여, 우리는 HOPE라 불리는 학습 모듈을 제안하며, 이는 언어 모델링, 지속적 학습, 장문 문맥 추론(long-context reasoning) 작업에서 유망한 결과를 보인다.

## 1 Introduction

**그림 1 설명:**
인간의 **지속적 학습(continual learning)**을 가능하게 하는 핵심 요소는 **균일하고 재사용 가능한 구조(uniform and reusable structure)**와 **다중 시간 척도 업데이트(multi time-scale update)**이다.

**Nested Learning(NL)**은 이러한 뇌의 특성을 모방하여, **각 구성 요소(component)**가 **서로 다른 시간 척도(time scale)**에서 업데이트될 수 있도록 하는 학습 패러다임을 제시한다.
이를 통해 NL은 뇌의 학습 메커니즘을 수학적으로 표현하며, **잘 알려진 딥러닝 아키텍처들(예: Transformer)**이 사실상 **서로 다른 주기(frequency)**로 업데이트되는 **선형 계층(linear layers)**의 조합임을 보여준다.

즉, NL은 **“시간 스케일 기반 계층적 학습”**이라는 관점에서, 인간의 뇌와 현대 신경망 구조 간의 연결을 설명한다.

---

수십 년 동안 인공지능(AI) 연구는 **데이터 [2–5] 또는 경험 [6–8]으로부터 학습하는 머신러닝 알고리즘을 설계하는 것**에 집중해왔다.
이러한 알고리즘들은 보통 **매개변수 θ ∈ Θ에 대한 목적 함수 L(θ)**를 **그래디언트 기반 방법(gradient-based methods)**으로 최적화함으로써 학습된다.

전통적인 머신러닝 기법들은 **특징 추출기(feature extractor)**를 설계하기 위해 **세심한 엔지니어링과 도메인 전문지식**을 필요로 했으며, 이는 자연 데이터로부터 직접 학습하거나 처리할 수 있는 능력을 제한했다 [9].
반면, **딥 표현 학습(deep representation learning)**은 주어진 작업(task)에 필요한 **표현(representation)을 자동으로 발견할 수 있는 완전 자동화된 대안**을 제시했다.

그 이후로, **딥러닝은 대규모 계산 모델의 필수 구성 요소**로 자리 잡았으며,
**화학과 생물학 [10]**, **게임 [11, 12]**, **컴퓨터 비전 [13, 14]**, 그리고 **멀티모달 및 자연어 이해 [15–17]** 분야에서 획기적인 성공을 거두었다.

---

딥러닝 모델에서 흔히 하듯이 여러 층(layer)을 쌓는 것은 모델의 **용량(capacity)**을 늘리고, **복잡한 특징을 표현하는 능력(expressive power)**을 향상시키며, **내부 계산량(예: FLOPS)**을 증가시킨다 [18–20].
이러한 특성들은 **고정된 데이터 분포 내(in-distribution)**에서 **정적인(static) 예측 작업**을 수행할 때 매우 중요하고 바람직한 성질이다.

그러나 이러한 **“깊은 설계(deep design)”**가 모든 문제의 보편적인 해법은 아니며, 모델의 표현력을 여러 측면에서 충분히 개선하지 못할 수도 있다. 예를 들어:
- (i) 층을 더 쌓더라도 **계산적 깊이(computational depth)**가 실제로 증가하지 않아, 모델이 복잡한 알고리즘을 구현하는 능력은 기존의 얕은(shallow) 모델과 크게 다르지 않을 수 있다 [21, 22, 23].
- (ii) 일부 **매개변수(parameter) 집합의 표현력(capacity)**은 모델의 깊이나 너비를 늘려도 **한계적인 개선(marginal improvement)**만을 보일 수 있다 [24].
- (iii) **훈련 과정(training process)**은 종종 **비최적의 옵티마이저 선택**이나 **하이퍼파라미터 설정**으로 인해 **준최적(suboptimal) 해**로 수렴할 수 있다.
- (iv) 모델의 **새로운 작업에 대한 빠른 적응력(fast adaptation)**, **지속적 학습 능력(continual learning)**, 또는 **분포 밖 데이터(out-of-distribution) 일반화 능력**은 단순히 층을 더 쌓는 것만으로는 향상되지 않으며, 보다 **정교한 설계**가 필요하다.

---

위의 문제들을 극복하고 딥러닝 모델의 성능을 향상시키기 위한 핵심적인 노력들은 다음 네 가지 방향에 집중되어 있다.
- (1) **더 표현력이 높은 매개변수 집합(즉, 신경망 구조)**을 개발하는 것 [13, 25–28];
- (2) **주어진 작업을 더 잘 모델링할 수 있는 목적 함수(objective)**를 도입하는 것 [29–32];
- (3) **더 효율적이고 효과적인 최적화 알고리즘(optimization algorithms)**을 설계하여 더 나은 해(solution)를 찾거나, 망각(forgetting)에 더 강인한(resilient) 학습을 가능하게 하는 것 [33–36];
- (4) **적절한 신경망 구조, 목적 함수, 그리고 최적화 알고리즘이 선택된 경우**, **모델 크기를 확장(scaling)**하여 표현력을 더욱 강화하는 것 [24, 37, 38].

이러한 발전들과 딥러닝 모델의 **스케일링 패턴(scaling pattern)**에 대한 새로운 발견들은 **대규모 언어 모델(Large Language Models, LLMs)**이 구축될 수 있는 **토대(foundation)**를 마련했다.

---

위의 문제들을 극복하고 딥러닝 모델의 성능을 향상시키기 위한 핵심적인 노력들은 다음 네 가지 방향에 집중되어 있다.
(1) **더 표현력이 높은 매개변수 집합(즉, 신경망 구조)**을 개발하는 것 [13, 25–28];
(2) **주어진 작업을 더 잘 모델링할 수 있는 목적 함수(objective)**를 도입하는 것 [29–32];
(3) **더 효율적이고 효과적인 최적화 알고리즘(optimization algorithms)**을 설계하여 더 나은 해(solution)를 찾거나, 망각(forgetting)에 더 강인한(resilient) 학습을 가능하게 하는 것 [33–36];
(4) **적절한 신경망 구조, 목적 함수, 그리고 최적화 알고리즘이 선택된 경우**, **모델 크기를 확장(scaling)**하여 표현력을 더욱 강화하는 것 [24, 37, 38].

이러한 발전들과 딥러닝 모델의 **스케일링 패턴(scaling pattern)**에 대한 새로운 발견들은 **대규모 언어 모델(Large Language Models, LLMs)**이 구축될 수 있는 **토대(foundation)**를 마련했다.

---

**현재 모델은 오직 ‘현재’만을 경험한다.**
LLM의 정적인(static) 특성을 설명하기 위해, 우리는 **전향성 기억상실증(anterograde amnesia)**이라는 신경학적 질환을 비유로 든다.
이 질환은 **발병 이후 새로운 장기 기억(long-term memory)을 형성하지 못하지만**,
이전에 형성된 기억은 그대로 유지되는 상태를 말한다 [45].

이러한 상태에 놓인 사람은 **발병 이전의 과거 기억과 짧은 현재의 순간만을 인식**할 수 있으며,
그 결과 **“지금 이 순간”을 늘 새롭게 경험하는 것처럼 느끼게 된다.**

현재의 LLM들도 유사한 패턴을 보인다.
그들의 지식은 다음 두 가지로 제한된다:

1. **맥락 창(context window)** 안에 들어오는 **즉각적인 현재 문맥**,
2. **사전 학습(pre-training)**이 끝나기 이전에 MLP 계층에 저장된 **오래된(과거의) 지식**.

즉, 모델은 **새로운 장기 기억을 형성하거나 지속적으로 지식을 갱신할 수 없으며**,
항상 주어진 문맥만을 기반으로 “지금 이 순간만”을 이해한다.

이러한 한계는 연구자들에게 **신경생리학(neurophysiology)** 문헌에서
**뇌가 단기 기억(short-term memory)을 어떻게 장기 기억으로 통합(consolidate)**하는지를 참고할 동기를 부여했다.

### 1.1 Human Brain Perspective and Neurophysiological Motivation

인간의 뇌는 **지속적 학습(continual learning, 즉 효과적인 문맥 관리)**에 있어서 매우 효율적이고 강력하다.
이러한 능력은 흔히 **신경가소성(neuroplasticity)** — 즉, 새로운 경험, 기억, 학습, 심지어 손상에 대해서도 스스로 구조를 바꾸는 뇌의 놀라운 능력 — 에 기인한다고 알려져 있다 [46, 47].

최근 연구에 따르면, **장기 기억(long-term memory)**의 형성은 최소 두 가지 **서로 다른 그러나 상호 보완적인 통합(consolidation) 과정**을 포함한다 [48–50]:

1. **빠른 “온라인(online)” 통합**, 또는 **시냅스 통합(synaptic consolidation)** 단계 — 학습 직후, 혹은 깨어 있는 동안 바로 일어나는 과정이다.
   이 단계에서는 **새롭고 불안정한 기억 흔적(memory trace)**이 **안정화(stabilization)**되며, **단기 기억에서 장기 기억 저장소로 이전**되기 시작한다.

2. **“오프라인(offline)” 통합**, 또는 **시스템 통합(systems consolidation)** 단계 — 이는 최근에 인코딩된 패턴을 **반복적으로 재생(replay)**하는 과정이다.
   이 재생은 **해마(hippocampus)**에서의 **샤프-웨이브 리플(sharp-wave ripples, SWRs)** 동안 일어나며, **대뇌 피질(cortex)**의 **수면 방추(sleep spindle)** 및 **저주파 진동(slow oscillation)**과 조정되어 진행된다.
   이러한 과정은 **기억을 강화(strengthen)**하고 **재구조화(reorganize)**하여, **피질 영역으로의 기억 이전(memory transfer)**을 지원한다 [51–53].

---

앞서 언급한 **전향성 기억상실증(anterograde amnesia)**의 비유로 돌아가 보면, 연구에 따르면 이 질환은 두 단계 모두에 영향을 줄 수 있지만, 특히 **온라인 통합(online consolidation)** 단계에 더 큰 영향을 미친다고 알려져 있다.
그 이유는 **해마(hippocampus)**가 **새로운 선언적 기억(declarative memory)**을 부호화하는 **게이트웨이 역할**을 하기 때문이다. 따라서 해마가 손상되면 **새로운 정보가 장기 기억(long-term memory)에 저장되지 못하게 된다.**

이와 유사하게, **LLM(대형 언어 모델)**—특히 **Transformer 기반 구조(Transformer-based backbone)**—의 설계 역시 **사전 학습(pre-training)**이 끝난 이후에 유사한 문제를 겪는다.
즉, **문맥(context)에서 주어진 새로운 정보는 모델의 장기 기억 파라미터(예: feedforward layer)**에 **영향을 미치지 못하므로**, 모델은 **새로운 지식이나 기술을 획득할 수 없다.**
그 정보는 오직 **단기 기억(short-term memory)**—예를 들어 **어텐션(attention)** 메커니즘—에 남아 있는 동안에만 활용 가능하다.

비록 **두 번째 단계(오프라인 통합)** 또한 기억 강화와 재구조화에 있어 **동등하거나 더 중요한 역할**을 하지만, 그 부재는 기억 손실(memory loss)을 초래할 수 있음에도 불구하고 [54, 55],
이 논문에서는 **첫 번째 단계**, 즉 **기억 통합(memory consolidation)을 온라인 과정(online process)**으로 다루는 데 초점을 맞춘다.

또한, **인간 두뇌 관점에서의 논의와 NL(Nested Learning)과의 연결성**은 **부록 A(Appendix A)**에 추가로 제시되어 있다.

---

**표기법(Notation)**

- 입력 $x \in \mathbb{R}^{N \times d_{in}}$ 은 입력 벡터를 의미한다.
- $M_t$ 는 시각 $t$에서의 **메모리 또는 모델의 상태(state)**를 나타낸다.
- $K, V, Q$ 는 각각 **key**, **value**, **query** 행렬을 의미한다.
- 하첨자 $t$가 붙은 **굵은 소문자(bold lowercase)**는 시각 $t$에서의 입력 벡터를 나타내며, 예를 들어 $k_t, v_t, q_t$이다.
- 임의의 엔티티 $f$의 분포(distribution)는 $p(f)$로 표기한다.

논문 전체에서, 메모리 모듈 $M(\cdot)$의 구조는
**층 수 $L_M \ge 1$**인 **단순 MLP(multilayer perceptron)**에 **잔차 연결(residual connection)**을 추가한 형태로 사용된다.

필요한 경우, 메모리 모듈의 파라미터는
$$
\theta_M \supseteq \{ W_1, W_2, \dots, W_{L_M} \}
$$
로 나타내며, 이는 최소한 MLP의 선형 계층(linear layers)의 파라미터들을 포함한다.

상위 수준의 중첩 학습 단계(즉, 서로 다른 업데이트 빈도)에 해당하는 파라미터들은 **위첨자 괄호(superscript with parenthesis)**로 구분한다.
예: $W^{(\ell)}$ → 중첩 학습의 **ℓ번째 수준(level)**에서의 파라미터.

---

## 2 Nested Learning

이 절에서는 Nested Learning(NL)의 **동기(motivation)**, **형식적 정의(formal definitions)**, 그리고 **전반적인 고수준 함의(high-level implications)**를 다룬다.
우리는 먼저 **연합 기억(associative memory)**의 정식화를 시작점으로 삼고, 이어서 **단계별 예제(step-by-step examples)**를 통해 **아키텍처 분해(architecture decomposition)**에 대한 직관을 쌓고, 이것이 **신경망을 여러 최적화 문제들이 통합된 시스템으로 모델링하는 것**과 어떻게 연결되는지 설명한다.

우리의 목표는 먼저 **기존의 딥러닝 방법과 개념들이 NL 패러다임 하에서 어떻게 해석될 수 있는지**를 보이는 것이다.
그 후, 전통적인 방법을 넘어서는 **새로운 정식화들(new formulations)**을 제시하고, 이를 통해 **기존 알고리즘과 설계를 개선하는 방법에 대한 통찰(insights)**을 제공하고자 한다.


---

**그림 2 설명:**
이 그림은 **Nested Learning(NL)** 패러다임이 **기계 학습 모델과 그 학습 절차를 중첩된 최적화 문제들의 집합으로 표현**한다는 개념을 보여준다.

* **(왼쪽)**: *하이브리드 아키텍처(Hybrid Architecture)*의 예시이다.
  전통적인 **딥러닝 관점에서는 NL의 평면화된(flattened) 형태**만을 보기 때문에, 각 블록 내부의 계산 깊이(depth of computation)에 대한 통찰을 제공하지 못한다.
  반면, **NL 패러다임은 내부의 모든 그래디언트 흐름(inner gradient flows)을 투명하게 표현**하여, 모델 내부에서 일어나는 학습 과정의 계층적 구조를 명확히 보여준다.

* **(오른쪽)**: *신경 학습 모듈(Neural Learning Module)*의 개념을 나타낸다.
  이는 **자신의 문맥 흐름(context flow)을 압축하는 방법을 학습하는 계산적 모델**이다.
  예를 들어, **가장 바깥쪽 수준(first level)**은 모델의 **가장 외부 루프 학습(outer-loop training)**을 의미하며, 이는 일반적으로 **사전 학습(pre-training)** 단계로 불린다.

요약하자면, 그림 2는 NL이 기존 딥러닝보다 더 깊은 수준의 최적화 과정을 계층적으로 드러내어, **모델이 “자기 학습 구조”를 이해하고 조정할 수 있는 새로운 관점**을 제공한다는 점을 시각적으로 보여준다.

### 2.1 Associative Memory

**연합 기억(Associative Memory)** — 사건들 간의 연결을 형성하고 회상(retrieve)할 수 있는 능력 — 은 인간 학습의 **근본적인 인지 과정**이며, **학습의 불가분한 구성 요소**이다 [56].

일반적으로 문헌에서는 **기억(memorization)**과 **학습(learning)**의 개념이 **서로 혼용되어 사용**되지만,
**신경심리학(neuropsychology)** 분야에서는 두 개념이 **명확히 구분**된다.

보다 구체적으로, 우리는 신경심리학 연구 [57]를 따라 **기억(memory)**과 **학습(learning)**의 개념을 다음 정의를 기반으로 구체화한다.

>**학습(Learning) vs. 기억(Memorization):**
>**기억(memory)**은 **입력(input)에 의해 발생하는 신경적 갱신(neural update)**이며, **학습(learning)**은 **효과적이고 유용한 기억을 획득하는 과정(process)**이다.
>
>즉, 단순히 정보를 저장하는 것이 기억이라면,
>그 저장된 정보를 구조적으로 조직화하고 일반화하여 **의미 있는 형태로 활용할 수 있게 만드는 과정이 바로 학습**이다.


이 연구의 목표는 **최적화 알고리즘(optimizers)**과 **신경망(neural networks)**을 포함한 **계산적 순차 모델(computational sequence model)**의 모든 구성 요소가,
사실상 **자신의 문맥 흐름(context flow)을 압축하는 연합 기억 시스템(associative memory systems)**임을 보이는 것이다.

좀 더 일반적으로 말하면, **연합 기억(associative memory)**은 **하나의 키(key) 집합을 값(value) 집합으로 매핑하는 연산자(operator)**이다.
우리는 **Behrouz et al. [58]**이 제시한 **연합 기억의 일반적 정의**를 따른다.

---

**정의 1 (연합 기억, Associative Memory)**
키 집합 $K \subseteq \mathbb{R}^{d_k}$ 와 값 집합 $V \subseteq \mathbb{R}^{d_v}$가 주어졌을 때,
**연합 기억(associative memory)**은 두 집합 $K$와 $V$를 매핑하는 **연산자(operator)** $M : K \rightarrow V$로 정의된다.

이러한 매핑을 데이터로부터 학습하기 위해, **목적 함수(objective)** $\tilde{L}(\cdot; \cdot)$는 매핑의 품질(quality)을 측정하며,
최적의 연합 기억 $M^*$은 다음과 같이 정의된다:

$$
M^* = \arg\min_M \tilde{L}(M(K); V)
\tag{1}
$$

즉, 연합 기억은 **키(key)**와 **값(value)** 간의 관계를 학습하여, 주어진 입력 키에 대해 적절한 출력을 복원하거나 추론할 수 있도록 하는 **함수적 메커니즘(functional mechanism)**을 의미한다.

---

연산자(operator) 자체는 **기억(memory)**이며, 그 매핑(mapping)은 **기억화 과정(memorization process)** — 즉, **문맥(context) 내 사건들의 연결 관계를 기억하는 과정** — 으로 작동한다.
데이터를 기반으로 이러한 효과적인 연산자를 획득하는 것은 곧 **학습(learning) 과정**이다.

여기서 주목할 점은, **키(keys)**와 **값(values)**이 반드시 토큰(tokens)에 한정되지 않고,
기억이 매핑하려는 **임의의 사건들(any arbitrary events)**이 될 수 있다는 것이다.
이 섹션 후반부에서는 주어진 **문맥 흐름(context flow)** 내에서 키와 값이 **토큰, 그래디언트, 서브시퀀스(sub-sequences)** 등 다양한 형태로 나타날 수 있음을 논의한다.

또한, “연합 기억(associative memory)”이라는 용어는 주로 **신경과학(neuroscience)**과 **신경심리학(neuropsychology)**에서 사용되지만,
위의 수식적 정의는 **데이터 압축(data compression)** 및 **저차원 표현(low-dimensional representation)**과도 밀접한 관련이 있다.

즉, 식 (1)의 최적화 과정을

"네트워크 $M(\cdot)$이 그 매핑을 자신의 파라미터에 압축(compress)하여, 저차원 공간에서 이를 표현하도록 학습하는 과정" 으로 해석할 수 있다.

---

시퀀스 모델링에서, 키와 값이 입력 토큰(예: 토크나이즈된 텍스트)인 경우,
식 (1)을 푸는 데 사용되는 **목적 함수(objective)**와 **최적화 과정(optimization process)**의 선택에 따라
글로벌/로컬 소프트맥스 어텐션 [27]이나 기타 최신 순환 모델들 [28, 60, 61]과 같은 **서로 다른 시퀀스 모델링 아키텍처**가 만들어질 수 있다.

이와 같은 **단순한 시퀀스 모델 정식화(formulation)**는
– 이들 모델의 **내부 동작 과정(internal process)**을 더 잘 이해하게 해 줄 뿐만 아니라,
– 각각의 **목적 함수와 최적화 방식**을 기준으로 **모델링 능력(modeling power)을 비교할 수 있는 도구**를 제공한다.

이후에는 단계별 예시(step-by-step examples)를 통해,
이 정식화가 **신경 아키텍처의 모든 구성 요소(전처리 포함 사전학습 단계의 최적화 과정까지)**에 어떻게 적용될 수 있는지,
그리고 실제로는 모델이 **각각 고유한 컨텍스트 흐름(context flow)을 가진 다단계(multi-level), 중첩(nested), 혹은 병렬(parallel) 메모리들의 통합 시스템**이라는 것을
어떻게 보여주는지를 논의한다.

---

**MLP 학습의 간단한 예시**

간단한 예시로, **1층짜리 MLP (가중치 $W$로 파라미터화됨)**를 **작업 $T$**와 **데이터셋 $D_{\text{train}} = \{x_1, \ldots, x_{|D_{\text{train}}|}\}$**에 대해 **목적 함수 $L(\cdot; \cdot)$**을 **경사하강법(gradient descent)**으로 최적화한다고 하자.

이 경우, 학습 과정은 다음의 최적화 문제와 동등하다:
$$
W^* = \arg\min_W L(W; D_{\text{train}}) \tag{2}
$$

이를 경사하강법으로 최적화하면 가중치 갱신 규칙은 다음과 같다:
$$
W_{t+1} = W_t - \eta_{t+1} \nabla_{W_t} L(W_t; x_{t+1}) \tag{3}
$$
$$
= W_t - \eta_{t+1} \nabla_{y_{t+1}} L(W_t; x_{t+1}) \otimes x_{t+1}, \quad x_{t+1} \sim D_{\text{train}} \tag{4}
$$
여기서 $y_{t+1} = W_t x_{t+1}$는 입력 $x_{t+1}$에 대한 모델의 출력이다.

이 정식화로부터, $u_{t+1} = \nabla_{y_{t+1}} L(W_t; x_{t+1})$라 두면, 역전파(backpropagation) 과정을 다음과 같은 **최적 연합기억(associative memory)**을 찾는 **최적화 문제**로 재해석할 수 있다:
데이터 포인트 $D_{\text{train}} = \{x_t\}_{t=1}^{|D_{\text{train}}|}$를 대응하는 $u_{t+1} = \nabla_{y_{t+1}} L(W_t; x_{t+1})$로 매핑하는 기억 시스템 $M(\cdot) = W_t \cdot$를 찾는 것이다.

이때, 내적(dot-product) 유사도를 이용해 $W_t$의 매핑 품질을 측정하면, 다음과 같은 최적화 문제가 된다:
$$
W_{t+1} = \arg\min_W \left(
\langle W x_{t+1}, u_{t+1} \rangle +
\frac{1}{2\eta_{t+1}} \|W - W_t\|_2^2
\right) \tag{5}
$$
$$
= \arg\min_W \left(
\langle W x_t, \nabla_{y_{t+1}} L(W_t; x_{t+1}) \rangle +
\frac{1}{2\eta_{t+1}} \|W - W_t\|_2^2
\right) \tag{6}
$$

이 식에서 $u_{t+1} = \nabla_{y_{t+1}} L(W_t; x_{t+1})$는 표현 공간(representation space)에서의 **지역 놀람 신호(Local Surprise Signal, LSS)**로 해석할 수 있다.
즉, **현재 출력과 목적 함수 $L(\cdot; \cdot)$**이 강제하는 구조 사이의 불일치를 정량화하는 신호이다.

따라서, 이 정식화는 **모델의 학습 과정**을

> "데이터 샘플을 그들의 표현 공간 내 LSS(Local Surprise Signal)에 매핑하는 효과적인 기억을 획득하는 과정"
> 으로 해석한다.

이 예시에서 모델은 데이터 샘플 위에서 **단일 gradient 흐름(single gradient flow)**을 가지며,
이 흐름은 학습 데이터셋 $D_{\text{train}} = \{x_1, \ldots, x_{|D_{\text{train}}|}\}$**에 대해서만 활성화되고**,
그 이후의 다른 데이터(즉, 추론 또는 테스트 단계)에서는 **고정(frozen)** 상태로 남게 된다.

---

이전의 예시를 확장하여, 이번에는 **기본 경사하강법(gradient descent)** 대신 **모멘텀(momentum)**이 포함된 변형 알고리즘을 사용한다.
이에 따라 가중치 업데이트 규칙은 다음과 같이 바뀐다:

$$
W_{t+1} = W_t - m_{t+1}, \tag{7}
$$
$$
m_{t+1} = m_t - \eta_{t+1} \nabla_{W_t} L(W_t; x_{t+1}) = m_t - \eta_{t+1} \nabla_{y_{t+1}} L(W_t; x_{t+1}) \otimes x_{t+1}. \tag{8}
$$

식 (8)에서, 이전 상태(식 (7)에서의 시점 $t$)가 주어졌을 때,
$\nabla_{W_t} L(W_t; x_{t+1})$ 또는 $\nabla_{y_{t+1}} L(W_t; x_{t+1})$는 **반복 항(recurrence)**에 의존하지 않으므로 **미리 계산(pre-compute)**할 수 있다.
이를 위해 $u_{t+1} = \nabla_{W_t} L(W_t; x_{t+1})$라 두면, 다음과 같이 다시 쓸 수 있다:

$$
W_{t+1} = W_t - m_{t+1}, \tag{9}
$$
$$
m_{t+1} = \arg\min_m \left[ -\langle m, \nabla_{W_t} L(W_t; x_{t+1}) \rangle + \eta_{t+1} \|m - m_t\|_2^2 \right]. \tag{10}
$$
$$
= \arg\min_m \left[ -\langle m x_{t+1}, \nabla_{y_{t+1}} L(W_t; x_{t+1}) \rangle + \eta_{t+1} \|m - m_t\|_2^2 \right]. \tag{11}
$$

식 (10)의 최적화 문제는 **학습률 $\eta_{t+1}$**을 사용하는 **한 단계의 경사하강법(gradient descent)**과 동일하다.
이 정식화를 통해 **모멘텀 항(momentum term)**을 다음 두 가지 방식으로 해석할 수 있다:

1. **키 없는 연합 기억(key-less associative memory)** — 그래디언트를 자신의 파라미터에 압축하는 메커니즘,
2. **연합 기억(associative memory)** — 데이터 포인트를 해당 **LSS(Local Surprise Signal)** 값으로 매핑하는 메커니즘.

흥미롭게도, 이 정식화는 **모멘텀을 사용하는 경사하강법**이 사실상 **2단계 최적화(two-level optimization) 과정**임을 드러낸다.
즉, **메모리(memory)** 자체가 단순한 경사하강법으로 최적화되며,

이 과정은 **Fast Weight Programs(FWPs)** [62]와 밀접하게 관련된다.
여기서

* 식 (9)의 **가중치 업데이트 과정(weight update process)**은 **느린 네트워크(slow network)**를 의미하고,
* 식 (10)의 **모멘텀 가중치(momentum weight)**는 **빠른 네트워크(fast network)**에 의해 생성된다.

---

위의 예시들을 종합하면, 다음과 같은 결론을 얻을 수 있다.

(1) **경사하강법(gradient descent)**을 사용한 **1층 MLP의 학습 과정**은,
데이터 포인트를 그에 대응하는 **LSS(Local Surprise Signal)** 값으로 매핑하는 **단일 계층(1-level) 연합 기억(associative memory)**이다.

(2) 반면, **모멘텀(momentum)**이 포함된 경사하강법은,
**2계층(2-level) 연합 기억 시스템**, 즉 **2단계 최적화(optimization) 과정**으로 볼 수 있다.
이때, **내부 계층(inner-level)**은 그래디언트 값을 자신의 파라미터에 저장하는 방법을 학습하고,
**외부 계층(outer-level)**은 그 내부 기억의 값을 사용해 느린 가중치(slow weight, 즉 $W_t$)를 업데이트한다.

이 두 경우는 모두 **가장 단순한 아키텍처와 옵티마이저**를 사용한 예이지만,
이러한 통찰이 **더 복잡한 구조나 학습 설정에서도 성립할 수 있을까?**라는 질문을 자연스럽게 제기하게 된다.

---

**아키텍처 분해의 예시(An Example of Architectural Decomposition)**

이번 예시에서는 MLP 모듈을 **선형 어텐션(linear attention)** [60]으로 대체한다.
즉, 작업 $T$와 데이터 시퀀스 $D_{\text{train}} = \{x_1, \ldots, x_{|D_{\text{train}}|}\}$에 대해,
목적 함수 $L$을 경사하강법(gradient descent)으로 최적화하여 **1층(linear) 어텐션**을 학습하는 것을 목표로 한다.

비정규화(un-normalized) 선형 어텐션의 수식은 다음과 같다:
$$
k_t = x_t W_k, \quad v_t = x_t W_v, \quad q_t = x_t W_q \tag{12}
$$
$$
M_t = M_{t-1} + v_t k_t^\top \tag{13}
$$
$$
y_t = M_t q_t \tag{14}
$$

기존 연구 [58, 59]에 따르면, 식 (13)의 **순환 구조(recurrence)**는 **행렬 형태의 연합 기억(matrix-valued associative memory)** $M_t(\cdot)$의 최적화 과정으로 재해석할 수 있다.
이 메모리는 키 $k_t$와 값 $v_t$의 매핑을 자신의 파라미터에 압축(compress)하는 것을 목표로 한다.

정의 1(Definition 1)에 따라,
$$
\tilde{L}(M_{t-1}; k_t, v_t) := -\langle M_{t-1} k_t, v_t \rangle
$$
로 두고, 이 목적함수를 경사하강법으로 최적화하면, 다음의 메모리 업데이트 규칙을 얻는다.
(이때, $\nabla \tilde{L}(M_{t-1}; k_t, v_t) = v_t k_t^\top$이며, 학습률 $\eta_t = 1$로 둔다.)

$$
M_{t+1} = \arg\min_M \left[ \langle M k_{t+1}, v_{t+1} \rangle + \|M - M_t\|_2^2 \right]
\tag{15}
$$
$$
\Rightarrow M_{t+1} = M_t - \nabla \tilde{L}(M_t; k_{t+1}, v_{t+1}) = M_t + v_{t+1} k_{t+1}^\top
\tag{16}
$$

이는 식 (13)의 **비정규화된 선형 어텐션 업데이트 규칙**과 정확히 동일하다.

또한, 앞선 예시에서 본 것처럼, **선형 계층(linear layer)을 경사하강법으로 학습하는 과정** 자체가
이미 **1층 연합 기억(1-layer associative memory)**의 최적화 문제(식 3 참조)이다.
따라서, **투영 행렬(projection layers, 즉 $W_k, W_v, W_q$)의 학습/업데이트 과정** 역시
하나의 **연합 기억 최적화 과정**으로 해석될 수 있다.

결과적으로,

> **선형 어텐션을 경사하강법으로 학습하는 과정 전체**는
> **2단계(two-level) 최적화 과정(optimization process)**으로 볼 수 있다.

- **외부 루프(outer loop)** — 즉, **학습 과정(training process)** — 은 투영 계층($W_k, W_v, W_q$)을 경사하강법으로 최적화한다.
- **내부 루프(inner loop)** — 즉, **메모리 업데이트 과정** — 은 내부 메모리 $M_t$를 경사하강법으로 최적화한다.

요컨대, **선형 어텐션의 학습은 중첩된 최적화 문제(nested optimization problem)**로 해석될 수 있으며,
이는 NL(Nested Learning)의 핵심 개념을 구체적으로 보여주는 예시이다.

---

앞서 논의한 것처럼, 여기서는 **두 개의 연합 기억(associative memories)**이 존재하며, 각각은 **고유한 최적화 과정(optimization process)**과 **그래디언트 흐름(gradient flow)**을 가진다.

즉,

- **외부 단계(outer-level)**에서는 $W_k, W_v, W_q$ 파라미터를 최적화하지만, 이때 **메모리 $M(\cdot)$**에 대한 그래디언트는 존재하지 않으며, 따라서 **그를 통한 역전파(backpropagation)**도 발생하지 않는다.
- 반대로, **내부 단계(inner-level)**에서는 메모리 $M_t$를 최적화하지만, 이때 **프로젝션 계층(projection layers)**은 **고정(frozen)**된 상태로, 그들에 대한 역전파는 일어나지 않는다.

또한 이 예시는 **FWP(Fast Weight Program)** 관점에서의 **선형 어텐션(linear attention)** [63]과 밀접한 관련이 있다.
FWP에서는 **프로젝션 파라미터($W_k, W_v, W_q$)**를 **느린 가중치(slow weights)**로,
그리고 **식 (13)의 메모리 업데이트**를 **빠른 가중치 갱신 규칙(fast weight update rule)**으로 본다.

요약하면,
이 구조는 **두 계층의 독립적인 연합 기억 시스템**으로 구성되어 있으며,
**외부 루프는 느린 학습(slow learning)**을, **내부 루프는 빠른 메모리 갱신(fast memory update)**을 수행하는 형태로
**Fast Weight Program(FWP)**의 이론적 틀과 **동일한 학습 역학(dynamics)**을 보인다.

---

**더 많은 수준(Levels)을 가진 아키텍처 분해(Architectural Decomposition with More Levels)**

앞선 두 예시에서는 단순한 경우들을 다뤘는데, 이들은 모두 **2단계 최적화 과정(2-level optimization process)**으로 해석될 수 있으며, 이는 동시에 **Fast Weight Programs(FWPs)**의 관점과도 일치한다.

하지만 실제로는 모델을 학습하기 위해 더 강력한 **최적화 알고리즘(optimization algorithm)**이나, 더 강력한 **재귀적 메모리 갱신 규칙(recurrent update rule)**이 필요하다.

간단한 예로, **모멘텀(momentum)**이 포함된 **경사하강법(gradient descent)**을 사용해 **선형 어텐션(linear attention)** 모델을 학습한다고 가정하자.
앞선 예시들에서 보았듯이, 선형 어텐션 구성요소는 두 개의 중첩된 최적화 문제(nested optimization problems)로 분해될 수 있다.

이 경우, 모델은 다음과 같은 **2계층 최적화 구조**로 표현된다:

1. **내부 단계(inner level)** — 경사하강법을 사용해 메모리를 최적화하여 **문맥(context)을 압축(compress)**한다 (식 15 참고).
2. **외부 단계(outer level)** — **모멘텀을 포함한 경사하강법**으로 **프로젝션 계층(projection layers)**을 최적화한다.

흥미롭게도, 첫 번째 예시에서 이미 살펴본 것처럼,

> “모멘텀을 사용하는 경사하강법(gradient descent with momentum)” 자체가 또 하나의 **2단계 최적화 문제(2-level optimization problem)**이며,
> 이때 **모멘텀 항(momentum term)**은 과거 그래디언트를 자신의 파라미터에 압축하는 **연합 기억(associative memory)**로 작동한다.

따라서, 선형 어텐션을 모멘텀 기반 경사하강법으로 학습하는 전체 과정은 **다중 수준(nested, multi-level) 최적화 구조**로 확장되며,
이것이 바로 **NL(Nested Learning)**이 보여주는 핵심 개념—“학습 알고리즘과 아키텍처를 계층적으로 분해해 내부 기억과 외부 학습 과정을 통합적으로 이해하는 틀”—이다.

### 2.2 Nested Optimization Problems

이전 섹션에서는 **머신러닝 모델을 중첩적(nested) 혹은 다단계(multi-level) 최적화 문제 집합으로 분해하는 방법**을 예시를 통해 보였다.

이제 다음 단계로,

1. **중첩 학습 문제(nested learning problems)**에 대한 **형식적 수식(formal formulation)**을 제시하고,
2. 데이터를 통해 학습하는 통합적 계산 시스템인 **Neural Learning Module (NLM)**을 정의하는 것을 목표로 한다.

즉, 앞선 예시들이 직관적으로 보여준 “학습 과정의 다층적 구조”를 이제 수학적으로 일반화하고, 그것을 실제 계산 단위로 구현한 개념이 바로 NLM이다.

---

앞선 섹션에서 우리는 모델을 여러 개의 **최적화 과정(optimization processes)**으로 분해할 수 있음을 보였지만,
이들 사이에 **위계(hierarchy)** 혹은 **순서(order)**를 정의할 수 있는지, 그리고 이 형식으로 모델을 **고유하게 표현할 수 있는지**는 아직 명확하지 않다.

이에 저자들은 **뇌파의 계층 구조(hierarchy of brain waves)**—즉, 각 뇌 영역이 서로 다른 정보 처리 주파수(frequency rate)를 가진다는 점(1장에서 논의됨)—에서 영감을 얻어,
**각 최적화 문제의 갱신 빈도(update rate)**를 기준으로 **모델 구성요소들을 다단계(multilevel)**로 정렬한다.

이를 위해,

- **하나의 데이터 포인트에 대한 한 번의 업데이트(step)**를 **시간의 단위(unit of time)**로 정의하고,
- 각 구성요소의 **갱신 주파수(update frequency rate)**를 그 구성요소가 “얼마나 자주 학습 혹은 업데이트되는가”로 정의한다.

즉, **빠른 빈도로 갱신되는 구성요소**(예: attention memory)는 **하위 수준(low-level)**에,
**느린 빈도로 갱신되는 구성요소**(예: weight parameters, optimizer states)는 **상위 수준(high-level)**에 위치한다.

이 개념을 통해 저자들은 학습 시스템을 “단일 평면적인 신경망”이 아니라, **시간적 스케일이 다른 다층 최적화 체계**로 표현하려 한다 —
이는 곧 **Nested Learning (NL)** 패러다임의 핵심 구조적 아이디어다.

---

**정의 2 (업데이트 주파수, Update Frequency)**

어떤 구성 요소 $A$가 있을 때, 이 $A$는 다음 두 종류 중 하나일 수 있다:

* **매개변수적 구성요소(parametric component)** — 예를 들어, **학습 가능한 가중치(learnable weights)**나 **모멘텀 항(momentum term)**
* **비매개변수적 구성요소(non-parametric component)** — 예를 들어, **어텐션 블록(attention block)**

이때, $A$의 **주파수(frequency)**를 $f_A$로 표기하며, 이는 **단위 시간(unit of time)** 동안 **A가 업데이트되는 횟수(number of updates)**로 정의된다.

즉,
$$
f_A = \text{number of updates of component } A \text{ per time unit.}
$$

이 개념은 **모델의 각 구성요소가 얼마나 자주 학습 또는 갱신되는지**를 나타내며,
이를 기반으로 모델 내 구성 요소들의 **계층적 순서(hierarchy)** — 즉, 빠르게 업데이트되는 하위 수준과 느리게 업데이트되는 상위 수준 — 을 정의할 수 있다.

---

앞서 정의한 **업데이트 주파수(update frequency)** 개념을 바탕으로,
머신러닝 알고리즘의 구성 요소들을 **연산자 (· ≻ ·)**를 사용해 정렬할 수 있다.

다음과 같이 정의한다:

- $A \succ B$ ("A가 B보다 빠르다") ⇔
  (1) $f_A > f_B$, 즉 A의 업데이트 빈도가 더 높거나,
  (2) $f_A = f_B$이지만, 시간 $t$에서 **B의 상태를 계산하기 위해 A의 상태 계산이 먼저 필요할 때**.

- 반대로, $A \not\succ B$ 이고 $B \not\succ A$일 경우,
  $A_f = B$로 표기한다.
  이는 **A와 B가 동일한 업데이트 주파수(frequency)**를 가지지만,
  **서로 독립적으로 계산됨(independent)**을 의미한다.
  (이 경우의 실제 예시는 **AdamW 옵티마이저**에서 제시된다.)

이 연산자를 기준으로, 구성 요소들을 “레벨(level)”이라 불리는 **순서 집합(ordered set)**으로 분류할 수 있다.

- 동일한 레벨의 구성 요소들은 **동일한 업데이트 빈도**를 가지며,
- **레벨이 높을수록 업데이트 주파수가 낮다.**

또한 이 정의에 따르면,
각 구성 요소는 **자신만의 최적화 문제(optimization problem)**와 **고유한 문맥(context)**을 갖는다.
따라서 각 구성 요소는 **자체적인 그래디언트 흐름(exclusive gradient flow)**을 가진다고 볼 수 있다.

다만, 모든 경우가 파라미터 기반 최적화만으로 설명되는 것은 아니며,
특히 어텐션(attention)과 같은 경우에는 이후에 설명될 **비매개변수적(non-parametric)** 접근법을 적용할 수도 있다.

---

**뉴럴 러닝 모듈(Neural Learning Module)**

앞서 정의한 **중첩 학습 문제(nested learning problems)**를 기반으로,
**Neural Learning Module (NLM)**은 머신러닝 모델을 표현하는 새로운 방식으로 정의된다.

이 모듈은 모델을 **상호 연결된 구성 요소들의 시스템(interconnected system of components)**으로 바라보며,
각 구성 요소는 **자신만의 그래디언트 흐름(gradient flow)**을 갖는다.

즉, 하나의 거대한 네트워크로서가 아니라,
여러 수준의 최적화 문제들이 **서로 다른 시간 스케일과 학습 주기**로 상호 작용하는 **통합 학습 시스템**으로 모델을 재해석한다.

또한,
이 개념은 **기존 딥러닝(deep learning)**과 **직교(orthogonal)** 관계에 있다.
즉, 단순히 레이어를 쌓는 깊이 증가가 아니라,
**학습 과정의 “레벨(level)”을 확장**함으로써
더 **표현력 있는(expressive)** 아키텍처를 설계할 수 있게 한다.

---

> **중첩 학습(Nested Learning)**은 여러 개의 **계층적(다층, multi-layer) 수준(levels)**으로 구성된 계산 모델이
> **서로 다른 추상화 단계(levels of abstraction)**와 **시간 스케일(time-scales)**에서 데이터를 학습하고 처리할 수 있도록 한다는 개념이다.
>
> 즉, 하나의 모델이 단일 수준에서 데이터를 단순히 변환하는 것이 아니라,
>
> - 저수준에서는 빠른 반응과 세부적 정보 학습을 담당하고,
> - 고수준에서는 느리지만 더 추상적이고 개념적인 패턴을 학습함으로써, 정보를 **다단계적 계층 구조로 통합적으로 이해하고 처리할 수 있게 하는 학습 패러다임**이다.

---

다음으로, 우리는 **중첩 학습(Nested Learning, NL)**의 관점에서
**옵티마이저(optimizers)**와 **잘 알려진 딥러닝 아키텍처들**을 살펴보고,
NL이 이러한 구성 요소들을 어떻게 향상시킬 수 있는지를 **구체적 예시를 통해** 탐구한다.

### 2.3 Optimizers as Learning Modules

이 문단은 **중첩 학습(Nested Learning, NL)** 관점에서 **최적화 알고리즘(optimizers)**을 재해석하는 부분이다.
핵심 요점은 다음과 같다:

1. **기존 옵티마이저들도 NL의 특수한 경우로 볼 수 있다.**
   예를 들어, **모멘텀을 포함한 경사하강법(gradient descent with momentum)**은 다음과 같은 형태로 표현된다:
   $$
   W_{i+1} = W_i + m_{i+1}, \quad
   m_{i+1} = \alpha_{i+1} m_i - \eta_t \nabla L(W_i; x_i)
   $$
   여기서 $m_i$는 **모멘텀(momentum)**으로, 사실상 **이전 그래디언트 정보를 기억하는 메모리 변수**이다.

2. 이 업데이트 규칙은 다음 최적화 문제를 푸는 과정으로 해석할 수 있다:
   $$
   \min_m \langle m, \nabla L(W_i; x_i)^\top \rangle
   $$
   즉, **모멘텀은 손실 함수의 그래디언트를 메모리에 압축(저장)**하려는 과정이며,
   이를 통해 **메타 메모리 모듈(meta memory module)**처럼 동작한다.

3. 이러한 관점에서 보면, 옵티마이저는 단순히 파라미터를 업데이트하는 도구가 아니라,
   **그래디언트의 흐름을 학습하는 또 하나의 신경 메모리 시스템**이다.

4. 이어서 논문은 **C.4 절에서 Adam 옵티마이저가 약간의 수정만으로 “모델 그래디언트에 대한 최적의 연상 메모리(optimal associative memory)”**임을 보인다고 밝히며,
   이러한 관점이 **더 표현력 있는 옵티마이저(expressive optimizers)** 설계로 이어질 수 있음을 제시한다.

즉, 결론적으로

> “모멘텀과 Adam 같은 옵티마이저는 단순한 수학적 알고리즘이 아니라,
> 모델이 자신의 그래디언트를 학습하고 기억하는 신경적 메모리 구조로 해석될 수 있다.”

---

**확장: 더 표현력 있는 연합(Extension: More Expressive Association)**

앞서 설명했듯이, **모멘텀(momentum)**은 **값(value)이 없는 연합 기억(value-less associative memory)**이기 때문에 표현력이 제한적이다.
이 한계를 해결하기 위해, 연합 기억의 원래 정의 — 즉, **키(keys)를 값(values)에 매핑하는 것** —을 따른다.

이를 위해 **값 파라미터**를 $v_i = P_i$로 두면, 모멘텀은 다음의 목적 함수를 최소화하도록 학습하게 된다:
$$
\min_m \langle m, \nabla L(W_i; x_i)^\top, P_i \rangle \tag{19}
$$
이를 경사하강법으로 최적화하면 다음의 **갱신 규칙(update rule)**을 얻는다:
$$
W_{i+1} = W_i + m_{i+1}
$$
$$
m_{i+1} = \alpha_{i+1} m_i - \eta_t P_i \nabla L(W_i; x_i) \tag{20}
$$

이 정식화는 **모멘텀 경사하강법(momentum GD)**을 **사전조건화(preconditioning)**한 형태와 동일하다.
즉, **모멘텀 항(momentum term)**은 **$P_i$**와 **그래디언트 $\nabla L(W_i; x_i)$** 간의 매핑을 자신의 파라미터에 **압축(compress)**하는 **연합 기억(associative memory)**로 해석할 수 있다.

여기서 $P_i$는 사전조건(preconditioner) 역할을 하는데,
이 $P_i$의 선택이 **모델의 표현력(expressivity)**을 크게 좌우한다.
예를 들어,

* 단순한 **랜덤 피처(random features)**도 기본 모멘텀보다 표현력을 개선할 수 있지만,
* **Hessian 정보 등 그래디언트의 고차 통계(high-order statistics)**를 반영한 $P_i$를 사용하면,
  모멘텀 메모리가 그래디언트를 더 **의미 있게 매핑**할 수 있다.

즉, 이 관점에서 보면

> “모멘텀은 그래디언트를 대응되는 값(gradient-associated value)으로 매핑하는 메모리이며,
> 사전조건(preconditioner)은 이 매핑을 더 풍부하게 만드는 연합 기억의 표현 차원이다.”

---

**확장: 더 표현력 있는 목적 함수(Extension: More Expressive Objectives)**

Behrouz et al. [58]의 논의에 따르면,
**내부 목적(inner objective)**으로 **내적(dot-product) 유사도**를 최적화하는 것은 **Hebbian 형태의 업데이트 규칙(Hebbian-like update rule)**을 초래하며,
이는 메모리 효율을 떨어뜨릴 수 있다.

이 문제를 해결하기 위한 자연스러운 확장은,
내적 대신 **ℓ₂ 회귀 손실(ℓ₂ regression loss)**을 사용하여
키-값(key-value) 매핑의 적합도(fitness)를 측정하고 다음의 손실 함수를 최소화하는 것이다:
$$
\min_m \| m \nabla L(W_i; x_i)^\top - P_i \|_2^2
$$

이를 최적화하면 다음과 같은 **업데이트 규칙(update rule)**을 얻는다:
$$
W_{i+1} = W_i + m_{i+1} \tag{21}
$$
$$
m_{i+1} = \left[ \alpha_{i+1}I - \nabla L(W_i; x_i)^\top \nabla L(W_i; x_i) \right] m_i - \eta_t P_i \nabla L(W_i; x_i) \tag{22}
$$

이 업데이트는 **델타 규칙(delta rule)** [64]에 기반하고 있으며,
이를 통해 **메모리(즉, 모멘텀)**가 제한된 용량(capacity)을 보다 효율적으로 관리하고,
**과거 그래디언트들의 연속적인 패턴(series of past gradients)**을 더 잘 기억할 수 있게 된다.

즉, 이 확장은 기존의 Hebbian-like 단순 내적 기반 학습보다
메모리의 **연상 능력(associative capacity)**과 **정보 보존 능력(memory retention)**을 향상시키는 방법이다.

---

**확장: 더 표현력 있는 메모리(Extension: More Expressive Memory)**

앞서 논의했듯이, **모멘텀(momentum)**은 과거 그래디언트(gradient) 값을 압축하기 위해
**선형 계층(linear layer, 즉 행렬 형태의 메모리)**을 사용하는 **메타 메모리 모델(meta memory model)**로 볼 수 있다.

하지만 이 선형적 특성 때문에, 모멘텀은 내부적으로 **과거 그래디언트의 선형 함수(linear functions)**만 학습할 수 있다는 한계가 있다.

이 한계를 극복하고 **학습 용량(learning capacity)**을 높이기 위한 한 가지 방법은,
선형 행렬 메모리 대신 더 강력한 **지속적 학습 모듈(persistent learning module)**을 사용하는 것이다.
즉, 모멘텀을 단순한 선형층이 아니라 **MLP(다층 퍼셉트론)**으로 대체하여
과거 그래디언트의 **비선형적 패턴과 동역학(dynamic behavior)**을 포착할 수 있도록 하는 것이다.

이를 위해 식 (17)을 다음과 같이 확장한다:
$$
W_{i+1} = W_i + m_{i+1}(u_i), \quad m_{i+1} = \alpha_{i+1} m_i - \eta_t \nabla L^{(2)}(m_i; u_i, I) \tag{23}
$$
여기서

* $u_i = \nabla L(W_i; x_i)$는 입력 그래디언트이며,
* $\nabla L^{(2)}(\cdot)$는 모멘텀의 내부 목적 함수(internal objective)를 의미한다.
  (예: 내적 유사도(dot-product similarity) $\langle m(u_i^\top), 1 \rangle$)

이 변형된 형태의 알고리즘을 **Deep Momentum Gradient Descent (DMGD)**라고 부른다.

요약하면,

> DMGD는 기존의 선형 모멘텀을 비선형 MLP 기반 메모리로 확장하여,
> **과거 그래디언트의 더 복잡한 패턴과 상관관계**를 학습할 수 있게 만든
> **더 표현력 있는 옵티마이저(Expressive Optimizer)**이다.

---

**확장: 비선형 출력(Extension: Non-Linear Outputs)**

앞서 제시된 관점—즉, **모멘텀(momentum)**을 **신경 아키텍처(neural architecture)**로 해석하는 관점—을 기반으로,
모멘텀 메모리 모듈의 **표현력(representation power)**을 향상시키는 일반적인 방법 중 하나는
**출력단(output)에 비선형성(non-linearity)**을 추가하는 것이다 [28, 65].

이를 위해 식 (23)을 다음과 같이 재정의한다:
$$
W_{i+1} = W_i + \sigma(m_{i+1}(u_i)), \quad
m_{i+1} = \alpha_{i+1} m_i - \eta_t \nabla L^{(2)}(m_i; u_i, I) \tag{24}
$$
여기서

* $\sigma(\cdot)$는 임의의 비선형 함수(non-linearity)이고,
* $u_i = \nabla L(W_i; x_i)$는 입력 그래디언트이다.

예를 들어, $\sigma(\cdot) = \text{Newton-Schulz}(\cdot)$로 설정할 수 있는데,
이는 **뉴턴-슐츠(Newton–Schulz) 반복법** [66]을 이용한 비선형 연산이다.
또한 $m(\cdot)$을 단순한 **선형 계층(linear layer)**로 두면,
결과적으로 이 옵티마이저는 **Muon 옵티마이저** [34]와 **동등(equivalent)**하다.

즉, 이 확장은 기존의 선형 모멘텀 구조에 **비선형 출력 변환**을 추가하여,
메모리 모듈이 **더 복잡한 그래디언트 동역학**을 학습하고
**비선형 패턴을 포착할 수 있는 능력**을 부여한다.

---

단순한 역전파(Backpropagation)를 넘어서기.
앞서 2.1절에서 논의했듯이, 사전 학습(pre-training) 과정과 역전파(backpropagation)는 **연상 기억(associative memory)**의 한 형태로 볼 수 있다.
여기서 입력 데이터 $x_t$는 예측된 출력이 유발한 놀람(surprise), 즉 $\nabla_{y_t} L(W_t; x_t)$에 매핑된다:

$$
W_{t+1} = W_t - \eta_{t+1} \nabla_{W_t} L(W_t; x_t)
= W_t - \eta_{t+1} \nabla_{y_t} L(W_t; x_t) \otimes x_t, \quad \text{where } x_t \sim D_{\text{train}}. \tag{25}
$$

연상 기억의 관점에서 보면, 위의 식은 다음 최적화 과정에서의 **한 단계의 경사하강(gradient descent)**과 동등하다:

$$
\min_W \langle W x_t, \nabla_{y_t} L(W_t; x_t) \rangle. \tag{26}
$$

그러나 **부록 C(Appendix C)**에서 논의했듯이, 위의 공식은 $x_t$와 같은 데이터 샘플 간의 **의존성(dependency)**을 무시하는 문제를 야기한다.
이 한계를 극복하기 위해, 데이터 포인트 간의 의존성 또한 고려하는 보다 강력한 형태로 확장한다.
(이는 특히 **토큰 공간(token space)**에서 옵티마이저를 사용할 때 중요하다. 왜냐하면 토큰들은 서로 독립적이지 않기 때문이다.)

이를 위해 다음과 같이 **L₂ 회귀(L2 regression)** 목적함수를 사용하고, 한 단계의 경사하강을 수행한다:

$$
\min_W \| W x_t - \nabla_{y_t} L(W_t; x_t) \|_2^2. \tag{27}
$$

이 공식은 다음과 같이 단순화된 새로운 형태의 **경사하강 변형(variant of gradient descent)**을 유도한다:

$$
W_{t+1} = W_t (I - x_t x_t^\top) - \eta_{t+1} \nabla_{W_t} L(W_t; x_t) \tag{28}
$$
$$
= W_t (I - x_t x_t^\top) - \eta_{t+1} \nabla_{y_t} L(W_t; x_t) \otimes x_t, \quad \text{where } x_t \sim D_{\text{train}}. \tag{29}
$$

이후, 우리는 이 옵티마이저를 **HOPE 아키텍처**의 내부 옵티마이저로 사용한다.

## 3 HOPE: A Self-Referential Learning Module with Continuum Memory

기존의 신경망 구조적 백본(architectural backbone)은 다음 두 가지 구성요소로 이루어져 있다.
(1) **작업 기억 모듈(working memory module)** — 예를 들어 **어텐션(attention)** —은 시퀀스 길이에 걸쳐 정보를 능동적으로 융합(fuse)하는 역할을 한다.
(2) **피드포워드 계층(feed-forward layer)** — 예를 들어 **MLP** —은 특징(feature) 간의 정보를 융합하고, **사전 학습(pre-training)** 단계에서의 **지속적 기억(persistent memory)** 또는 **지식 저장소(knowledge storage)**로 작동한다.

NL(Nested Learning) 관점에서 보면, **사전 학습(pre-training)**은 학습 모듈의 **가장 외곽 수준(outermost level)**이 제한된 맥락 흐름(context flow) 내에서 업데이트되는 단계이다.
따라서 **지속 학습(continual learning)** 환경에서는 이러한 사전 학습 단계가 시간에 따라 거의 업데이트되지 않으며, 이에 대응하는 **지식 저장소 또한 시간이 지나도 거의 업데이트될 필요가 없다.**

이러한 직관을 바탕으로, 우리는 기존의 **장기/단기 기억 체계(long-term/short-term memory system)**에 대한 관점을 확장하여,
**각 수준(또는 주파수 영역, frequency domain)**마다 **지식 저장용 피드포워드(knowledge storage feed-forward)** 모듈을 두는 방식을 제안한다.

---

주파수(frequency)의 정의에 따라, **연속 기억 시스템(Continuum Memory System, CMS)**은
연결된 MLP 블록들의 체인으로 형식화된다 —
즉, $\text{MLP}^{(f_1)}(\cdot), \ldots, \text{MLP}^{(f_k)}(\cdot)$ 로 이루어진다.

각 블록은 다음과 같은 **청크 크기(chunk size)** $C^{(\ell)} := \max_\ell \frac{C^{(\ell)}}{f_\ell}$ 에 대응된다.
입력 $x = \{x_1, \ldots, x_T\}$가 주어졌을 때, 체인의 출력은 다음과 같이 계산된다
(정규화 항은 명확성을 위해 생략한다):

$$
y_t = \text{MLP}^{(f_k)}(\text{MLP}^{(f_{k-1})}(\cdots \text{MLP}^{(f_1)}(x_t)))). \tag{30}
$$

ℓ번째 MLP 블록의 파라미터, 즉 $\theta^{(f_\ell)}$는 매 $C^{(\ell)}$ 스텝마다 다음과 같이 업데이트된다:

$$
\theta^{(f_\ell)}_{i+1} =
\begin{cases}
\theta^{(f_\ell)}_i - \sum_{t=i-C^{(\ell)}}^{i} \eta^{(\ell)}_t f(\theta^{(f_\ell)}_t; x_t), & \text{if } i \equiv 0 \pmod{C^{(\ell)}} \\
0, & \text{otherwise.}
\end{cases} \tag{31}
$$

부록 B.1에서는 이 공식의 다양한 변형,
예를 들어 **완전 중첩형(fully nested) MLP 계층**에 대해서도 논의한다.

여기서 $\eta^{(\ell)}_t$는 $\theta^{(f_\ell)}$에 대응되는 학습률(learning rate)을 나타내며,
$f(\cdot)$는 임의의 옵티마이저(예: 경사하강법에서 $\nabla L(\theta^{(f_\ell)}_t; x_t)$)의 **오차 항(error component)**이다.

전통적인 **Transformer 블록**은 이 공식의 특수한 경우이며, $k = 1$일 때에 해당한다.

또한 식 (31)은 중요한 해석을 제공한다:
파라미터 $\theta^{(f_\ell)}_t$는 **자신의 컨텍스트(context)**를 **자신의 파라미터 안에 압축하는 역할**을 하며,
따라서 이는 해당 컨텍스트의 **추상적 지식(abstract knowledge)**을 표현하는 존재로 볼 수 있다.

---

**HOPE.** 우리는 *Titans* [28]에 기반한 **자가참조(self-referential) 학습 모듈**과,
부록 B.1에서 제시한 **우리의 경사하강법 변형(variant of gradient descent)**을 기반으로 한 새로운 구성요소를 제안한다.
이 **자가참조적 시퀀스 모델(self-referential sequence model)**을 **연속 기억 시스템(Continuum Memory System, CMS)**과 결합하면,
**HOPE 아키텍처(HOPE architecture)**가 완성된다.

요약하자면 —
HOPE는 모델이 **스스로의 파라미터 갱신 과정(learning dynamics)**을 내적으로 학습하고,
이를 CMS 구조(서로 다른 주파수 및 시간 스케일에서 작동하는 기억 계층들)와 통합함으로써
**자기반영적(self-referential)**이며 **다계층 학습(nested learning)**을 수행할 수 있는 구조를 의미한다.