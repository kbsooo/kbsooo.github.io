---
title: "Transformer의 대분기: Encoder와 Decoder는 왜 갈라졌고, 누가 이겼는가"
date: 2025-10-21T11:32:00+09:00
tags: ["AI", "Transformer", "NLP", "BERT", "GPT", "Attention", "Embeddings"]
description: "원래 하나였던 Transformer가 Encoder-only와 Decoder-only로 갈라진 이유, 각 아키텍처의 기술적 차이, 그리고 Decoder-only가 승리한 배경을 깊이 탐구한다."
draft: false
translationKey: "exploring-transformer-encoder-decoder-differences"
---

## 아이러니에서 시작하자

2017년 Google Brain 팀이 "Attention Is All You Need"를 발표했을 때, 논문의 핵심 아키텍처는 **Encoder와 Decoder를 모두 갖춘** 완전한 구조였다. 기계 번역을 위해 설계된 이 모델은 입력 문장을 이해하는 Encoder와 번역문을 생성하는 Decoder가 한 몸처럼 작동했다.

그런데 불과 1~2년 사이에, 이 필드는 기묘한 선택을 했다. BERT는 Encoder만 떼어냈고, GPT는 Decoder만 가져갔다. 원래 하나였던 것을 일부러 반으로 쪼갠 셈이다. 왜? 그리고 8년이 지난 지금, 누가 이겼는가?

이 글은 그 분기의 기술적 이유, 각 아키텍처의 내부 메커니즘, 그리고 Decoder-only가 지배적 패러다임이 된 배경을 추적한다. 마지막에는 다시 합쳐지고 있는 최근 흐름까지 다룬다.

---

## 원본 아키텍처: Attention Is All You Need

Vaswani et al. (2017)의 원본 Transformer는 sequence-to-sequence 모델이다. 구조를 정리하면:

**Encoder (N=6 layers):**
- Multi-Head Self-Attention → 입력 시퀀스의 모든 토큰이 서로를 본다
- Position-wise Feed-Forward Network (FFN)
- 각 sub-layer마다 Residual Connection + Layer Normalization

**Decoder (N=6 layers):**
- Masked Multi-Head Self-Attention → 미래 토큰을 가리는 causal mask 적용
- Multi-Head Cross-Attention → Encoder 출력을 Key/Value로 받아 참조
- Position-wise FFN
- 역시 Residual + LayerNorm

핵심은 Encoder가 입력 전체를 한 번에 처리해서 **contextual representation**을 만들고, Decoder가 이를 참조하면서 한 토큰씩 출력을 생성한다는 것이다. Cross-Attention이 이 둘을 연결하는 다리 역할을 한다.

이 구조는 기계 번역에서 당시 SOTA를 달성했다. 하지만 곧 연구자들은 이 구조의 각 부분이 독립적으로도 강력하다는 것을 발견한다.

---

## 대분기: 왜 쪼개졌는가

### BERT: Encoder만으로 충분하다 (2018)

Devlin et al.이 BERT를 발표했을 때, 핵심 통찰은 간단했다: **자연어 이해(NLU)에는 생성이 필요 없다.** 감정 분석, 개체명 인식, 질의응답 — 이 작업들은 입력을 "읽고 이해"하면 된다. 출력을 한 토큰씩 생성할 필요가 없다.

Encoder-only 구조의 장점:

1. **양방향 문맥(Bidirectional Context):** 모든 토큰이 앞뒤 모든 토큰을 볼 수 있다. "bank"가 강둑인지 은행인지, 주변 맥락 전체로 판단한다.
2. **병렬 처리:** Autoregressive가 아니므로 입력을 한 번에 처리한다. 추론 속도가 빠르다.
3. **Pre-training 목표의 우아함:** MLM(Masked Language Modeling)으로 문맥 양쪽을 모두 활용하는 학습이 가능하다.

BERT의 pre-training은 두 가지 목표를 사용했다:
- **MLM:** 입력 토큰의 15%를 [MASK]로 가리고 원래 토큰을 예측. 양방향 문맥을 강제한다.
- **NSP (Next Sentence Prediction):** 두 문장이 연속인지 판별. (이후 RoBERTa에서 불필요하다고 제거됨)

### GPT: Decoder만으로 충분하다 (2018)

거의 같은 시기에, OpenAI의 Radford et al.은 GPT를 발표했다. 이쪽의 통찰은 달랐다: **언어의 가장 자연스러운 학습 신호는 다음 단어 예측이다.**

Decoder-only 구조의 장점:

1. **Causal (Autoregressive) 생성:** 토큰을 순차적으로 생성하므로, 텍스트 생성에 자연스럽다.
2. **단순한 학습 목표:** Next Token Prediction이라는 하나의 목표로 모든 것을 학습한다. 별도의 masking 전략이 필요 없다.
3. **데이터 효율성:** 쌍(pair) 데이터가 필요 없다. 인터넷의 모든 텍스트가 학습 데이터다. 각 문서를 그냥 이어붙이면 된다.

GPT의 causal language modeling 목표:

$$\mathcal{L} = -\sum_{i=1}^{N} \log P(t_i \mid t_1, t_2, \ldots, t_{i-1})$$

각 토큰의 확률을 이전 토큰들로만 조건부 예측한다. 단순하지만, 이것이 스케일링의 열쇠가 된다.

### T5: 둘 다 유지하자 (2019)

Google의 Raffel et al.은 T5(Text-to-Text Transfer Transformer)로 제3의 길을 택했다. "모든 NLP 문제를 text-to-text로 통일하자"는 아이디어였다. 분류도, 번역도, 요약도, 전부 "입력 텍스트 → 출력 텍스트" 형태로 바꾼다.

이 접근의 장점:
- Encoder가 입력을 깊이 이해하고, Decoder가 출력을 생성하는 원본 구조의 이점을 그대로 유지
- Cross-Attention으로 입력과 출력의 관계를 명시적으로 모델링
- 동일한 프레임워크로 이해(NLU)와 생성(NLG) 작업을 모두 처리

하지만 T5 계열은 결국 메인스트림에서 밀렸다. 이유는 뒤에서 다룬다.

---

## Attention 메커니즘 심층 분석

Encoder와 Decoder의 차이를 진짜로 이해하려면, Attention의 내부를 들여다봐야 한다.

### Self-Attention의 기본 연산

모든 Attention은 같은 뼈대를 공유한다. 입력 시퀀스 $X \in \mathbb{R}^{n \times d}$에 대해:

$$Q = XW_Q, \quad K = XW_K, \quad V = XW_V$$

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$

$QK^\top$의 각 원소 $(i, j)$는 토큰 $i$의 query와 토큰 $j$의 key 사이의 유사도다. $\sqrt{d_k}$로 나누는 것은 dot product의 분산을 안정시켜 softmax가 지나치게 뾰족해지는 것을 방지한다 — 이 scaling 없이는 큰 $d_k$에서 gradient vanishing이 발생한다.

### Bidirectional Self-Attention (Encoder)

Encoder의 self-attention에서 attention score 행렬은 **제한 없이 완전(fully connected)**하다:

$$A_{ij} = \frac{\exp(q_i \cdot k_j / \sqrt{d_k})}{\sum_{l=1}^{n} \exp(q_i \cdot k_l / \sqrt{d_k})}$$

모든 $(i, j)$ 쌍에 대해 attention이 계산된다. 토큰 3이 토큰 7을 볼 수 있고, 토큰 7도 토큰 3을 볼 수 있다. 이것이 양방향(bidirectional) attention이다.

결과적으로 각 토큰의 representation은 **문장 전체의 문맥**을 반영한다. "I went to the bank to deposit money"에서 "bank"의 representation은 "deposit"과 "money"의 영향을 받아 금융 의미로 편향된다.

### Causal Self-Attention (Decoder)

Decoder의 self-attention에는 **upper triangular mask**가 적용된다:

$$M_{ij} = \begin{cases} 0 & \text{if } j \leq i \\ -\infty & \text{if } j > i \end{cases}$$

$$A_{ij} = \frac{\exp\!\bigl((q_i \cdot k_j + M_{ij}) / \sqrt{d_k}\bigr)}{\sum_{l=1}^{n} \exp\!\bigl((q_i \cdot k_l + M_{il}) / \sqrt{d_k}\bigr)}$$

$M_{ij} = -\infty$이면 softmax 후 해당 위치의 가중치가 0이 된다. 즉, **토큰 $i$는 자신 이전의 토큰들 ($j \leq i$)만 볼 수 있다.** 미래 정보 유출(information leakage)을 원천 차단한다.

이 mask가 autoregressive 생성을 가능하게 한다. 학습 시에는 teacher forcing으로 모든 위치를 병렬 계산하지만, 추론 시에는 한 토큰씩 생성해야 한다.

### Cross-Attention: Encoder와 Decoder의 다리

원본 Transformer와 T5 같은 encoder-decoder 모델에는 Cross-Attention이 존재한다. Decoder의 각 layer에서:

$$Q = H_{\text{dec}} W_Q, \quad K = H_{\text{enc}} W_K, \quad V = H_{\text{enc}} W_V$$

Query는 Decoder의 현재 hidden state에서 오고, Key와 Value는 **Encoder의 출력**에서 온다. Decoder의 각 토큰이 "입력의 어디를 봐야 하는가?"를 학습하는 것이다.

기계 번역에서 이것은 직관적이다: "Je suis etudiant"를 번역할 때, "I"를 생성하는 시점에 "Je"에 높은 attention을 주고, "student"를 생성할 때 "etudiant"에 집중한다.

Cross-Attention이 없는 Decoder-only 모델에서는 이 역할을 Self-Attention이 대신한다. 입력(prompt)과 출력(completion)을 하나의 시퀀스로 이어붙이고, causal mask 아래에서 Self-Attention이 둘 다 처리한다. 작동은 하지만, 입력에 대한 양방향 처리가 불가능하다는 구조적 한계가 있다.

---

## 임베딩 모델의 진화

Transformer 아키텍처의 분기는 임베딩(embedding) 모델의 발전에도 깊은 영향을 미쳤다. 텍스트를 고정 차원 벡터로 변환하는 임베딩은 검색, 분류, 클러스터링 등 거의 모든 NLP 파이프라인의 기반이다.

### 1세대: BERT 기반 (2018-2020)

BERT의 [CLS] 토큰 출력을 문장 임베딩으로 사용하는 것이 초기 접근이었다. 하지만 BERT의 [CLS] 토큰은 원래 NSP 분류를 위해 학습된 것이지, 문장의 의미적 유사도를 위한 것이 아니었다. 코사인 유사도로 비교하면 성능이 실망스럽다.

### 2세대: Sentence-BERT와 Contrastive Learning (2019-2022)

Reimers & Gurevych (2019)의 Sentence-BERT(SBERT)가 전환점이었다. Siamese 네트워크 구조로 BERT를 fine-tuning하여, 의미적으로 유사한 문장은 가깝고 다른 문장은 먼 벡터 공간을 학습했다. Contrastive Loss와 Triplet Loss가 핵심 학습 목표였다.

이 시기의 주요 모델: SimCSE, Contriever, 그리고 초기 E5 모델들.

### 3세대: 대규모 학습 + 지시문 기반 (2023-2024)

E5 (Wang et al., 2022)부터 학습 데이터의 스케일이 도약한다. 웹 규모 코퍼스에서 자연 발생하는 (query, document) 쌍을 수억 개 수집하고, 이를 contrastive learning으로 학습했다.

BGE (BAAI General Embedding, 2023)는 여기에 **instruction-tuning**을 도입했다. 임베딩 시 "Represent this sentence for retrieval:" 같은 지시문(instruction)을 앞에 붙여, 같은 문장도 task에 따라 다른 임베딩을 생성할 수 있게 했다.

GTE (General Text Embedding, Alibaba, 2023)는 multi-stage training과 더 큰 모델 규모를 실험했다.

### 4세대: Decoder-only 모델의 역습 (2024-현재)

놀라운 반전이 일어났다. 임베딩은 Encoder-only의 영역이라는 통념을 Decoder-only 모델이 깨기 시작한 것이다.

**NV-Embed-v2 (NVIDIA, 2024)**가 대표적이다. Mistral 7B (decoder-only LLM)를 기반으로 하면서, 핵심 혁신은:

1. **Causal Attention Mask 제거:** Contrastive training 단계에서 causal mask를 벗겨내고 bidirectional attention을 활성화한다. Decoder-only 모델이 Encoder처럼 동작하게 만드는 것이다.
2. **Latent Attention Pooling:** [CLS] 토큰이나 마지막 토큰의 hidden state 대신, learnable latent vector로 attention을 수행하여 더 풍부한 pooled embedding을 생성한다.
3. **2-Stage Contrastive Training:** 먼저 retrieval 데이터로 사전 학습하고, 다양한 task의 데이터로 fine-tuning한다.

NV-Embed-v2는 MTEB 벤치마크에서 56개 task에 걸쳐 평균 72.31점으로 1위를 차지했다 (2024년 8월 기준). Encoder-only 기반 모델들을 제치고.

이것이 시사하는 바는 중요하다: **대규모 LLM의 representation power가 아키텍처의 구조적 한계를 뛰어넘을 수 있다.** Decoder-only 모델은 원래 임베딩에 불리하지만, 충분히 큰 모델을 적절히 adaptation하면 Encoder-only를 이긴다.

| 세대 | 대표 모델 | 기반 아키텍처 | 핵심 혁신 |
|------|-----------|---------------|-----------|
| 1세대 | BERT [CLS] | Encoder-only | 사전학습된 representation 직접 사용 |
| 2세대 | SBERT, SimCSE | Encoder-only | Contrastive/Triplet Loss fine-tuning |
| 3세대 | E5, BGE, GTE | Encoder-only | 웹 스케일 데이터 + Instruction tuning |
| 4세대 | NV-Embed-v2 | Decoder-only | Causal mask 제거 + Latent Attention |

---

## 왜 Decoder-only가 이겼는가

2024-2025년 기준으로, 가장 강력한 범용 언어 모델은 모두 Decoder-only다: GPT-4, Claude, Llama, Gemma, Mistral. 왜 이 아키텍처가 지배적이 됐는가?

### 이유 1: 학습 데이터의 통일성

Encoder-Decoder 모델(T5 등)은 학습에 입출력 쌍이 필요하다. "translate English to French: The house is red → La maison est rouge" 같은 형태. 이런 쌍 데이터는 구축 비용이 높다.

Decoder-only 모델은 **인터넷의 모든 텍스트**가 학습 데이터다. 문서를 이어붙이기만 하면 된다. Next Token Prediction이라는 단일 목표가 모든 종류의 텍스트에 적용된다. 이 단순함이 데이터 스케일링의 병목을 제거했다.

### 이유 2: 스케일링 법칙의 예측 가능성

Kaplan et al. (2020, OpenAI)과 Hoffmann et al. (2022, DeepMind의 Chinchilla 논문)이 보여준 것은, Decoder-only Transformer의 성능이 모델 크기와 학습 데이터 양에 대해 **예측 가능한 power law**를 따른다는 것이다.

Chinchilla의 핵심 발견:

$$L(N, D) \approx \frac{A}{N^\alpha} + \frac{B}{D^\beta} + E$$

여기서 $N$은 파라미터 수, $D$는 학습 토큰 수, $E$는 reducible하지 않은 손실이다. 주어진 compute budget $C$에서, 최적의 $N$과 $D$는 대략 $C^{0.5}$에 비례하여 함께 증가해야 한다.

이 법칙이 중요한 이유: 1000억 달러를 투자하면 얼마나 좋은 모델이 나올지 **미리 예측할 수 있다.** 이것은 AI 기업들이 수십억 달러의 투자 결정을 내리는 근거가 됐다. Encoder-Decoder 모델에 대한 동등한 스케일링 법칙 연구는 상대적으로 부족했다.

### 이유 3: In-Context Learning의 발현

GPT-3 (2020)에서 발견된 in-context learning은 game changer였다. 모델을 fine-tuning하지 않고도, prompt에 예시를 넣는 것만으로 새로운 task를 수행할 수 있다. 이것은 Decoder-only 구조의 autoregressive 특성과 자연스럽게 맞물린다.

Encoder-only 모델(BERT)에서는 이것이 불가능하다. BERT는 생성을 하지 못하고, 새로운 task마다 분류 head를 달고 fine-tuning해야 한다. Encoder-Decoder 모델(T5)에서는 가능하지만, 입력을 encoder로, 출력을 decoder로 라우팅해야 하므로, 순수한 autoregressive 모델보다 구조적 복잡성이 높다.

### 이유 4: 엔지니어링의 단순함

Decoder-only 모델은 하나의 Transformer 스택이다. Encoder-Decoder 모델은 두 개의 스택에 Cross-Attention까지 있다. 학습, 추론, 서빙, 최적화 — 모든 면에서 단순한 쪽이 유리하다.

이것은 과소평가되는 요인이다. 수천 개의 GPU에서 분산 학습을 구현할 때, 단일 스택 아키텍처의 파이프라인 병렬화가 훨씬 직관적이다.

---

## 효율성 혁신: Decoder를 실용적으로 만든 기술들

Decoder-only 모델이 이론적으로 우수해도, 실제 배포에는 심각한 효율성 문제가 있었다. 이를 해결한 핵심 기술들을 살펴보자.

### KV Cache: 반복 계산의 제거

Autoregressive 생성의 근본적 비효율은 이것이다: 토큰 $t_n$을 생성하려면 $t_1$부터 $t_{n-1}$까지의 attention을 모두 다시 계산해야 한다. 하지만 $t_1, \ldots, t_{n-1}$의 Key와 Value는 이전 스텝에서 이미 계산한 것이다.

**KV Cache**는 이전 토큰들의 Key와 Value 텐서를 메모리에 캐싱하여, 새 토큰 생성 시에는 해당 토큰의 Query만 계산하면 된다.

KV Cache 적용 전후 속도 차이는 극적이다. 실험에서 **KV Cache 사용 시 약 4.7배 속도 향상** (56초 → 12초)이 관측된다.

하지만 대가가 있다: KV Cache의 메모리는 시퀀스 길이에 선형으로 증가한다. Llama 2 70B 모델에서 4096 토큰 시퀀스의 KV Cache는 약 2.5GB를 차지한다. 128K 토큰 context라면? 수십 GB가 필요하다. 이것이 후속 최적화의 동기가 됐다.

### Multi-Query Attention (MQA)와 Grouped-Query Attention (GQA)

표준 Multi-Head Attention(MHA)에서는 각 head가 독립적인 $W_Q$, $W_K$, $W_V$를 갖는다. $h$개의 head가 있으면 KV Cache 크기도 $h$배다.

**Multi-Query Attention (Shazeer, 2019):** 모든 head가 **하나의** Key-Value 쌍을 공유한다. KV Cache 크기가 $h$분의 1로 줄어든다. 하지만 품질 저하가 발생할 수 있다.

**Grouped-Query Attention (Ainslie et al., 2023):** MHA와 MQA의 중간. Query head들을 $g$개의 그룹으로 나누고, 각 그룹이 하나의 KV head를 공유한다. $g = h$이면 MHA, $g = 1$이면 MQA.

| 방식 | KV Head 수 | KV Cache 크기 | 품질 | 채택 모델 |
|------|-----------|--------------|------|-----------|
| MHA | $h$ | $h \times d_k \times 2 \times L$ | 최고 | GPT-3, BERT |
| GQA | $g$ ($1 < g < h$) | $g \times d_k \times 2 \times L$ | MHA에 근접 | Llama 2/3, Gemma |
| MQA | $1$ | $d_k \times 2 \times L$ | 약간 하락 | PaLM, Falcon |

Llama 2가 GQA를 채택한 이후, GQA는 사실상 업계 표준이 됐다. MHA 수준의 품질을 유지하면서 추론 처리량을 크게 높인다.

### FlashAttention: 메모리 계층을 고려한 정확한 Attention

Dao et al. (2022)의 FlashAttention은 알고리즘적 혁신이다. 표준 attention의 문제는 $n \times n$ attention 행렬을 GPU HBM(High Bandwidth Memory)에 materialze해야 한다는 것이다. 시퀀스 길이가 길어지면 이 행렬이 메모리를 폭파시킨다.

FlashAttention의 핵심 아이디어: **attention 행렬을 절대로 전체 materialze하지 않는다.** 대신 입력을 블록 단위로 나눠 GPU SRAM(훨씬 빠르지만 작은 메모리)에서 처리하고, online softmax 알고리즘으로 블록 결과를 점진적으로 합산한다.

결과:
- 메모리 복잡도: $O(n^2) \rightarrow O(n)$
- IO 복잡도 대폭 감소로 실제 wall-clock time 2-4배 단축
- **수학적으로 정확(exact)** — 근사가 아니다

FlashAttention-2 (2023)는 병렬화를 개선했고, **FlashAttention-3 (2024)**는 NVIDIA H100의 Hopper 아키텍처에 특화되어 비동기 연산과 FP8 저정밀도를 활용한다. H100에서 BF16 기준 840 TFLOPs/s (GPU 최대 성능의 85% 활용), FP8로는 1.3 PFLOPs/s에 도달한다.

FlashAttention-4는 CuTeDSL로 작성되어 Hopper와 Blackwell GPU를 모두 지원한다.

이 기술들의 조합이 Decoder-only 모델의 실용적 배포를 가능하게 만들었다. FlashAttention으로 학습과 긴 context 추론을 가능하게 하고, GQA로 KV Cache 크기를 줄이고, 다양한 KV Cache 최적화(양자화, 레이어 선택적 캐싱 등)로 메모리를 추가 절감한다.

---

## 진자가 돌아온다: Encoder-Decoder의 귀환 조짐

Decoder-only의 지배가 확고해 보이지만, 흥미로운 역류가 감지된다.

### PrefixLM: 하이브리드의 부활

PrefixLM은 Decoder-only 모델 안에서 Encoder의 장점을 살리는 방법이다. 입력 시퀀스를 "prefix"와 "generation" 부분으로 나눈다:

- **Prefix 부분:** Causal mask를 제거하고 **bidirectional attention** 적용. Encoder처럼 작동.
- **Generation 부분:** 기존과 같은 causal mask. Decoder처럼 작동.

하나의 모델이 입력을 양방향으로 깊이 이해하고, 출력은 autoregressive로 생성한다. 별도의 Encoder 스택 없이도 Encoder-Decoder의 이점을 근사한다.

### T5Gemma: Decoder에서 Encoder-Decoder로 변환

Google이 2025년에 발표한 **T5Gemma**는 매우 흥미로운 프로젝트다. 이미 사전학습된 Decoder-only 모델(Gemma 2)의 가중치를 사용하여, Encoder-Decoder 아키텍처로 **변환(adaptation)**하는 기법이다.

방법:
1. Decoder-only 모델의 가중치로 Encoder와 Decoder를 각각 초기화
2. PrefixLM 또는 UL2 목표로 추가 사전학습
3. Task-specific fine-tuning

결과는 인상적이다:
- T5Gemma 9B-9B: GSM8K(수학 추론)에서 Gemma 2 9B 대비 **+9점**
- T5Gemma 2B-2B IT: MMLU에서 Gemma 2 2B 대비 **+12점**, GSM8K 58.0% → 70.7%

**특히 소규모 모델에서 Encoder-Decoder가 Decoder-only를 크게 이긴다.** 이것은 중요한 시사점이다: 스케일링 법칙이 Decoder-only에 유리한 것은 대규모에서이고, edge deployment 등 소규모에서는 Encoder-Decoder가 파라미터 효율이 더 높을 수 있다.

### Gemini와 하이브리드 아키텍처

Gemini 2.5 Pro는 Transformer + SSM(State Space Model) + MoE(Mixture of Experts)를 결합한 하이브리드 아키텍처를 사용하는 것으로 알려져 있다. 멀티모달 입력과 긴 context를 처리할 때 SSM이 Transformer의 $O(n^2)$ 한계를 보완한다.

이것은 순수 Decoder-only Transformer를 넘어, 각 컴포넌트의 장점을 조합하는 방향으로 아키텍처가 진화하고 있음을 보여준다.

---

## 실무 가이드: 2025년에 무엇을 쓸 것인가

아키텍처 선택은 use case에 따라 달라진다. 현재 시점의 실용적 가이드:

### 텍스트 이해 / 분류 / NER

**추천:** Encoder-only (BERT 계열) 또는 소규모 Encoder-Decoder

여전히 가장 효율적이다. ModernBERT, DeBERTa-v3, 또는 fine-tuned RoBERTa가 분류 작업에서 비용 대비 최고 성능을 제공한다. 수십 ms 이내의 추론 속도가 필요한 production 환경에서 특히 유리하다.

### 임베딩 / 검색 (Retrieval)

**추천:** 용도에 따라 선택

- 범용 최고 품질: NV-Embed-v2 (Decoder 기반, 7B)
- 실용적 균형: BGE-large, GTE-large, E5-large-v2 (Encoder 기반, ~335M)
- Edge/경량: all-MiniLM-L6-v2 (Encoder, 22M)

대규모 문서 처리에서는 Encoder 기반이 추론 비용에서 여전히 우위다.

### 텍스트 생성 / 챗봇 / 추론

**추천:** Decoder-only

GPT-4, Claude, Llama 3, Gemma 2. 선택의 여지가 거의 없다. 이 영역에서 Decoder-only의 지배는 완전하다.

### 구조화된 변환 (번역, 요약, 코드 변환)

**추천:** Encoder-Decoder 또는 Decoder-only

T5 계열이 작은 모델에서 효율적이고, 큰 모델에서는 Decoder-only가 유리하다. 소규모 모델로 특정 task를 전담시키는 경우 T5Gemma나 flan-T5가 좋은 선택이다.

| 작업 | 추천 아키텍처 | 대표 모델 | 비고 |
|------|-------------|-----------|------|
| 분류/NER | Encoder-only | DeBERTa-v3, ModernBERT | 빠르고 저렴 |
| 임베딩 (최고 품질) | Decoder-only (adapted) | NV-Embed-v2 | MTEB 1위 |
| 임베딩 (실용) | Encoder-only | BGE, GTE, E5 | 비용 효율 |
| 생성/대화 | Decoder-only | GPT-4, Claude, Llama 3 | 유일한 선택 |
| 번역/요약 (소규모) | Encoder-Decoder | T5Gemma, flan-T5 | 파라미터 효율 |
| 멀티모달 | 하이브리드 | Gemini 2.5 | Transformer+SSM+MoE |

---

## 맺으며

Transformer의 역사는 통합과 분기의 반복이다. 하나의 아키텍처가 둘로 갈라졌고, 그중 하나(Decoder-only)가 스케일링의 힘으로 승리했다. 하지만 그 승자마저 다른 아키텍처의 장점을 흡수하며 (PrefixLM, causal mask 제거, SSM 결합 등) 다시 통합의 방향으로 움직이고 있다.

이 흐름에서 기억할 것은 **아키텍처 자체보다 스케일링과 데이터가 더 중요했다**는 점이다. Decoder-only가 이긴 것은 구조적으로 우월해서가 아니라, 스케일 업에 가장 적합한 조건(단순한 학습 목표, 풍부한 데이터, 예측 가능한 스케일링 법칙)을 갖추고 있었기 때문이다. 다른 조건이 달라지면 — 예를 들어, 소규모 edge 배포가 중요해지거나, 멀티모달 입력의 복잡성이 증가하면 — 최적 아키텍처도 달라진다.

결국 중요한 것은 도구를 이해하고, 문제에 맞게 선택하는 것이다.

---

**참고 문헌:**
- Vaswani et al., "Attention Is All You Need" (2017) — [arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers" (2018) — [arxiv.org/abs/1810.04805](https://arxiv.org/abs/1810.04805)
- Radford et al., "Improving Language Understanding by Generative Pre-Training" (2018) — OpenAI
- Raffel et al., "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer" (2019) — [arxiv.org/abs/1910.10683](https://arxiv.org/abs/1910.10683)
- Kaplan et al., "Scaling Laws for Neural Language Models" (2020) — [arxiv.org/abs/2001.08361](https://arxiv.org/abs/2001.08361)
- Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla, 2022) — [arxiv.org/abs/2203.15556](https://arxiv.org/abs/2203.15556)
- Dao et al., "FlashAttention: Fast and Memory-Efficient Exact Attention" (2022) — [arxiv.org/abs/2205.14135](https://arxiv.org/abs/2205.14135)
- Ainslie et al., "GQA: Training Generalized Multi-Query Transformer Models" (2023) — [arxiv.org/abs/2305.13245](https://arxiv.org/abs/2305.13245)
- Shah et al., "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision" (2024) — [arxiv.org/abs/2407.08608](https://arxiv.org/abs/2407.08608)
- Lee et al., "NV-Embed: Improved Techniques for Training LLMs as Generalist Embedding Models" (2024) — [arxiv.org/abs/2405.17428](https://arxiv.org/abs/2405.17428)
- Google, "T5Gemma: Encoder-Decoder Gemma Models" (2025) — [developers.googleblog.com](https://developers.googleblog.com/en/t5gemma/)
