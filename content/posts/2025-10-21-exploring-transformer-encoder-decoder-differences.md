---
title: "Transformer Encoder와 Decoder 차이 탐구"
date: 2025-10-21T12:00:00+09:00
tags: ["ai", "transformer", "nlp", "bert", "gpt"]
description: "GNN과 SBERT 임베딩에서 시작해 Transformer의 Encoder-only와 Decoder-only 모델의 차이, 임베딩 과정까지 탐구한 인사이트."
draft: false
---

# Transformer 모델의 구조적 차이 탐구

최근 NLP 분야에서 Transformer 기반 모델을 다루다 보니, GNN(Graph Neural Network)에서 SBERT 임베딩의 효과성에 대한 궁금증이 생겼다. 이를 계기로 BERT의 임베딩 과정과 Transformer의 Encoder-Decoder 구조를 깊이 파고들었다. 이 포스트에서는 그 과정을 정리하며, 핵심 인사이트를 공유한다.

## 초기 궁금증: GNN과 SBERT 임베딩의 적합성

처음 질문은 Knowledge Graph(KG)의 SPO(Subject-Predicate-Object) 구조에서 SBERT 임베딩이 효과적인가였다. KG는 주어-목적어-동사 형태의 짧은 삼중항으로 구성되는데, BERT의 Transformer 구조가 긴 문장에서 빛을 발휘하는 만큼, 짧은 입력에서 과잉일 수 있다는 우려였다.

이에 대한 분석은 긍정적이었다. SBERT는 Siamese 네트워크와 Triplet Loss로 fine-tuning된 모델로, 짧은 문장 간 유사도를 최적화한다. SPO를 "Paris is the capital of France"처럼 문장화하면 semantic embedding을 효과적으로 생성한다. GNN에서 이 임베딩을 노드/엣지 특징으로 활용하면 sparse KG의 성능을 높일 수 있으며, 연구에서 KG completion 태스크에서 50% 이상 향상을 보였다.

## BERT 임베딩의 역할과 Transformer의 개입

임베딩 과정에서 Transformer가 어떻게 쓰이는지 더 궁금해졌다. BERT는 pre-trained Transformer로, 입력 텍스트를 고차원 벡터로 변환한다. 예를 들어, [CLS] 토큰의 hidden state를 문장 임베딩으로 사용한다.

훈련 단계에서는 Transformer가 MLM(Masked Language Modeling) 태스크로 학습되며, 임베딩도 업데이트된다. 추론 시에는 forward pass로 임베딩을 추출한다. GNN 훈련에서는 이 임베딩을 미리 뽑아 입력으로 사용하므로, Transformer는 임베딩 생성 단계에서만 직접 관여한다.

## Encoder-only 모델의 임베딩 적합성

BERT가 Encoder-only 모델이라 임베딩에 적합한 이유를 물었다. Encoder는 bidirectional attention으로 전체 맥락을 포착한다. 이는 병렬 처리로 효율적이며, semantic richness가 높다.

반대로 Decoder-only 모델(GPT 등)은 causal attention으로 autoregressive 방식이다. 임베딩 추출은 가능하지만, hidden states에서 풀링해야 하며 비용이 더 든다. OpenAI의 embedding 모델처럼 fine-tuning하면 활용할 수 있다.

## Encoder와 Decoder의 상세 비교

마지막으로 Encoder와 Decoder의 차이를 상세히 탐구했다. Transformer 원래 설계는 Encoder-Decoder 스택이다.

### Encoder의 특징
- Self-Attention: Bidirectional, 모든 토큰 간 자유로운 관계 계산.
- 처리: Parallel, 입력 전체 한 번에.
- 용도: 이해 중심 (분류, QA, 임베딩).
- 예: BERT, RoBERTa.

### Decoder의 특징
- Masked Self-Attention: Causal, 과거 토큰만 참조.
- Cross-Attention: Encoder 출력 참조 (하이브리드 모델에서).
- 처리: Autoregressive, 순차적 생성.
- 용도: 생성 중심 (번역, 챗봇).
- 예: GPT, Llama.

표로 비교하면 다음과 같다:

| 항목          | Encoder                          | Decoder                          |
|---------------|----------------------------------|----------------------------------|
| Attention 타입 | Bidirectional Self-Attention     | Causal Self-Attention + Cross-Attention |
| 처리 방식     | Parallel                         | Autoregressive                   |
| 주요 용도     | 이해/임베딩                      | 생성                             |
| 임베딩 적합성 | 높음                             | 중간                             |
| 컴퓨테이션    | O(N^2)                           | O(M^2) 추가                      |

이 구조적 차이는 모델 선택에 큰 영향을 미친다. Encoder는 읽기-like, Decoder는 쓰기-like로 비유할 수 있다.

## 결론: 실무 적용 인사이트

이 탐구를 통해 Transformer의 유연성을 재확인했다. 임베딩 전용으로는 Encoder-only를, 생성 중심으로는 Decoder-only를 우선 고려할 만하다. 실험 시 Hugging Face 라이브러리를 활용해 비교 테스트를 추천한다.

---

출처: [Attention is All You Need 논문](https://arxiv.org/abs/1706.03762), [Hugging Face Transformers 문서](https://huggingface.co/docs/transformers/index)