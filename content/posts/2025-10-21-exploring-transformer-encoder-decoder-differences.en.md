---
title: "The Great Transformer Divergence: Why Encoder and Decoder Split, and Who Won"
date: 2025-10-21T11:32:00+09:00
tags: ["AI", "Transformer", "NLP", "BERT", "GPT", "Attention", "Embeddings"]
description: "Why the original Transformer split into encoder-only and decoder-only variants, the technical differences between each architecture, and why decoder-only models ultimately won the scaling race."
draft: false
translationKey: "exploring-transformer-encoder-decoder-differences"
---

## Start with the Irony

When the Google Brain team published "Attention Is All You Need" in 2017, the core architecture had **both an encoder and a decoder** working as a unified whole. Designed for machine translation, the encoder comprehended the input sentence while the decoder generated the translation — two halves of a single organism.

Within a year or two, the field made a curious choice. BERT ripped out just the encoder. GPT took only the decoder. Researchers deliberately split apart what was originally one. Why? And eight years later, who won?

This post traces the technical reasons behind that divergence, the internal mechanics of each architecture, and why decoder-only models became the dominant paradigm. At the end, we look at recent signs that the pendulum is swinging back.

---

## The Original Architecture: Attention Is All You Need

Vaswani et al.'s (2017) original Transformer is a sequence-to-sequence model. Here is the structure:

**Encoder (N=6 layers):**
- Multi-Head Self-Attention — every token in the input attends to every other token
- Position-wise Feed-Forward Network (FFN)
- Residual Connection + Layer Normalization around each sub-layer

**Decoder (N=6 layers):**
- Masked Multi-Head Self-Attention — a causal mask prevents attending to future tokens
- Multi-Head Cross-Attention — attends to the encoder's output using it as Key/Value
- Position-wise FFN
- Residual + LayerNorm as well

The key idea: the encoder processes the entire input at once to produce a **contextual representation**, while the decoder references that representation through cross-attention and generates output one token at a time.

This architecture achieved state-of-the-art results on machine translation. But researchers soon discovered that each half was powerful on its own.

---

## The Great Divergence: Why the Split Happened

### BERT: The Encoder Is Enough (2018)

When Devlin et al. released BERT, the core insight was simple: **natural language understanding (NLU) does not require generation.** Sentiment analysis, named entity recognition, question answering — these tasks only need the model to "read and comprehend" the input. There is no need to generate output token by token.

Advantages of the encoder-only design:

1. **Bidirectional Context:** Every token can attend to every other token, both left and right. Whether "bank" means a riverbank or a financial institution is determined from the full surrounding context.
2. **Parallel Processing:** Without autoregressive constraints, the entire input is processed in a single pass. Inference is fast.
3. **Elegant Pre-training Objective:** Masked Language Modeling (MLM) forces the model to leverage context from both directions.

BERT used two pre-training objectives:
- **MLM:** Mask 15% of input tokens and predict the originals. Forces bidirectional context learning.
- **NSP (Next Sentence Prediction):** Classify whether two sentences are consecutive. (Later removed by RoBERTa as unnecessary.)

### GPT: The Decoder Is Enough (2018)

At nearly the same time, OpenAI's Radford et al. released GPT. Their insight was different: **the most natural learning signal for language is next-word prediction.**

Advantages of the decoder-only design:

1. **Causal (Autoregressive) Generation:** Tokens are generated sequentially, which is natural for text generation tasks.
2. **Simple Training Objective:** A single objective — Next Token Prediction — handles everything. No special masking strategy required.
3. **Data Efficiency:** No paired data needed. Every piece of text on the internet is training data. Just concatenate documents.

GPT's causal language modeling objective:

$$\mathcal{L} = -\sum_{i=1}^{N} \log P(t_i \mid t_1, t_2, \ldots, t_{i-1})$$

Each token's probability is conditioned only on the preceding tokens. Simple — but this simplicity turned out to be the key to scaling.

### T5: Keep Both (2019)

Google's Raffel et al. took a third path with T5 (Text-to-Text Transfer Transformer). The idea: "Unify every NLP problem as text-to-text." Classification, translation, summarization — everything becomes "input text → output text."

The advantages:
- Preserves the original architecture's strengths: encoder deeply comprehends the input, decoder generates the output
- Cross-attention explicitly models the relationship between input and output
- A single framework handles both NLU and NLG tasks

But the T5 family was eventually overtaken. We will see why below.

---

## Attention Mechanisms: A Deep Dive

To truly understand the difference between encoder and decoder, you need to look inside the attention mechanism.

### The Basic Self-Attention Operation

All attention shares the same skeleton. For an input sequence $X \in \mathbb{R}^{n \times d}$:

$$Q = XW_Q, \quad K = XW_K, \quad V = XW_V$$

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$

Each element $(i, j)$ of $QK^\top$ is the similarity between token $i$'s query and token $j$'s key. Dividing by $\sqrt{d_k}$ stabilizes the variance of the dot product and prevents softmax from becoming too peaked — without this scaling, large $d_k$ values cause gradient vanishing.

### Bidirectional Self-Attention (Encoder)

In the encoder's self-attention, the attention score matrix is **fully connected with no restrictions**:

$$A_{ij} = \frac{\exp(q_i \cdot k_j / \sqrt{d_k})}{\sum_{l=1}^{n} \exp(q_i \cdot k_l / \sqrt{d_k})}$$

Attention is computed for every $(i, j)$ pair. Token 3 can see token 7, and token 7 can see token 3. This is bidirectional attention.

As a result, each token's representation reflects **the full context of the entire sentence**. In "I went to the bank to deposit money," the representation of "bank" is influenced by "deposit" and "money," biasing it toward the financial meaning.

### Causal Self-Attention (Decoder)

In the decoder's self-attention, an **upper triangular mask** is applied:

$$M_{ij} = \begin{cases} 0 & \text{if } j \leq i \\ -\infty & \text{if } j > i \end{cases}$$

$$A_{ij} = \frac{\exp\!\bigl((q_i \cdot k_j + M_{ij}) / \sqrt{d_k}\bigr)}{\sum_{l=1}^{n} \exp\!\bigl((q_i \cdot k_l + M_{il}) / \sqrt{d_k}\bigr)}$$

When $M_{ij} = -\infty$, the weight at that position becomes zero after softmax. This means **token $i$ can only attend to tokens at positions $j \leq i$** — earlier tokens or itself. Future information leakage is structurally impossible.

This mask enables autoregressive generation. During training, teacher forcing allows parallel computation across all positions, but at inference time tokens must be generated one by one.

### Cross-Attention: The Bridge Between Encoder and Decoder

In encoder-decoder models like the original Transformer and T5, cross-attention exists in each decoder layer:

$$Q = H_{\text{dec}} W_Q, \quad K = H_{\text{enc}} W_K, \quad V = H_{\text{enc}} W_V$$

The queries come from the decoder's current hidden state, while keys and values come from the **encoder's output**. Each decoder token learns "which part of the input should I focus on?"

In machine translation this is intuitive: when generating "I," the model places high attention on "Je"; when generating "student," it focuses on "etudiant."

In decoder-only models without cross-attention, self-attention handles both roles. The input (prompt) and output (completion) are concatenated into a single sequence, and causal self-attention processes both. It works — but with a structural limitation: bidirectional processing of the input is impossible.

---

## The Evolution of Embedding Models

The Transformer architecture split profoundly shaped the development of embedding models. Embeddings — fixed-dimensional vector representations of text — underpin virtually every NLP pipeline: retrieval, classification, clustering, and more.

### Generation 1: BERT-Based (2018-2020)

The initial approach used BERT's [CLS] token output as the sentence embedding. But BERT's [CLS] token was originally trained for NSP classification, not for capturing sentence-level semantic similarity. Cosine similarity comparisons yielded disappointing results.

### Generation 2: Sentence-BERT and Contrastive Learning (2019-2022)

Reimers & Gurevych's (2019) Sentence-BERT (SBERT) was the turning point. By fine-tuning BERT with a Siamese network structure, it learned a vector space where semantically similar sentences are close and dissimilar ones are far apart. Contrastive loss and triplet loss were the key training objectives.

Notable models from this era: SimCSE, Contriever, and the early E5 models.

### Generation 3: Web-Scale Training + Instructions (2023-2024)

Starting with E5 (Wang et al., 2022), the scale of training data took a leap. Hundreds of millions of naturally occurring (query, document) pairs were collected from web-scale corpora and trained with contrastive learning.

BGE (BAAI General Embedding, 2023) introduced **instruction-tuning** to embeddings. By prepending instructions like "Represent this sentence for retrieval:" at embedding time, the same sentence could produce different embeddings depending on the task.

GTE (General Text Embedding, Alibaba, 2023) experimented with multi-stage training and larger model scales.

### Generation 4: The Decoder-Only Counterattack (2024-Present)

A surprising reversal occurred. Decoder-only models began to shatter the conventional wisdom that embeddings were encoder-only territory.

**NV-Embed-v2 (NVIDIA, 2024)** is the flagship example. Built on Mistral 7B (a decoder-only LLM), its key innovations are:

1. **Removing the Causal Attention Mask:** During contrastive training, the causal mask is stripped away, enabling bidirectional attention. The decoder-only model is made to behave like an encoder.
2. **Latent Attention Pooling:** Instead of using the [CLS] token or last-token hidden state, learnable latent vectors attend over the sequence to produce richer pooled embeddings.
3. **Two-Stage Contrastive Training:** First pre-trained on retrieval data, then fine-tuned on diverse task data.

NV-Embed-v2 achieved the top position on the MTEB benchmark across 56 tasks with an average score of 72.31 (as of August 2024), surpassing encoder-only models.

The implication is significant: **the representational power of large-scale LLMs can overcome architectural structural limitations.** Decoder-only models are inherently disadvantaged for embeddings, but a sufficiently large model with proper adaptation beats encoder-only alternatives.

| Generation | Representative Models | Base Architecture | Key Innovation |
|-----------|----------------------|------------------|----------------|
| 1st | BERT [CLS] | Encoder-only | Direct use of pretrained representations |
| 2nd | SBERT, SimCSE | Encoder-only | Contrastive/Triplet loss fine-tuning |
| 3rd | E5, BGE, GTE | Encoder-only | Web-scale data + Instruction tuning |
| 4th | NV-Embed-v2 | Decoder-only | Causal mask removal + Latent Attention |

---

## Why Decoder-Only Won the War

As of 2024-2025, the most powerful general-purpose language models are all decoder-only: GPT-4, Claude, Llama, Gemma, Mistral. Why did this architecture become dominant?

### Reason 1: Training Data Unification

Encoder-decoder models (T5 etc.) require input-output pairs for training. Formatted examples like "translate English to French: The house is red → La maison est rouge." Such paired data is expensive to construct.

Decoder-only models can use **every piece of text on the internet** as training data. Just concatenate documents. Next Token Prediction as a single objective applies to all text. This simplicity removed the bottleneck for data scaling.

### Reason 2: Predictable Scaling Laws

Kaplan et al. (2020, OpenAI) and Hoffmann et al. (2022, DeepMind's Chinchilla paper) demonstrated that decoder-only Transformer performance follows a **predictable power law** with respect to model size and training data volume.

Chinchilla's key finding:

$$L(N, D) \approx \frac{A}{N^\alpha} + \frac{B}{D^\beta} + E$$

Where $N$ is parameter count, $D$ is training token count, and $E$ is the irreducible loss. For a given compute budget $C$, optimal $N$ and $D$ should both grow roughly proportionally to $C^{0.5}$.

Why this matters: given a $100 billion investment, you can **predict in advance** how good the model will be. This is the basis on which AI companies make billion-dollar investment decisions. Equivalent scaling law studies for encoder-decoder models were comparatively sparse.

### Reason 3: The Emergence of In-Context Learning

In-context learning, discovered with GPT-3 (2020), was a game changer. Without any fine-tuning, putting examples into the prompt enables the model to perform new tasks. This naturally aligns with the autoregressive nature of decoder-only models.

This is impossible with encoder-only models (BERT). BERT cannot generate text and requires a classification head plus fine-tuning for each new task. Encoder-decoder models (T5) can do it, but routing inputs through the encoder and outputs through the decoder introduces structural complexity that pure autoregressive models avoid.

### Reason 4: Engineering Simplicity

A decoder-only model is a single Transformer stack. An encoder-decoder model has two stacks plus cross-attention layers. For training, inference, serving, and optimization — simplicity wins across the board.

This factor is underestimated. When implementing distributed training across thousands of GPUs, pipeline parallelism for a single-stack architecture is far more intuitive.

---

## Efficiency Innovations: The Technologies That Made Decoders Viable

Even with theoretical advantages, decoder-only models faced severe efficiency challenges for real-world deployment. Here are the key technologies that solved them.

### KV Cache: Eliminating Redundant Computation

The fundamental inefficiency of autoregressive generation: to generate token $t_n$, you must recompute attention over all of $t_1$ through $t_{n-1}$. But the Key and Value tensors for $t_1, \ldots, t_{n-1}$ were already computed in previous steps.

**KV Cache** stores previous tokens' Key and Value tensors in memory, so that generating a new token only requires computing that token's Query.

The speed difference is dramatic. In benchmarks, **KV caching yields approximately 4.7x speedup** (56 seconds vs. 12 seconds).

But there is a cost: KV cache memory grows linearly with sequence length. For Llama 2 70B with a 4096-token sequence, the KV cache occupies approximately 2.5 GB. For a 128K-token context? Tens of gigabytes. This motivated subsequent optimizations.

### Multi-Query Attention (MQA) and Grouped-Query Attention (GQA)

In standard Multi-Head Attention (MHA), each head has independent $W_Q$, $W_K$, $W_V$ projections. With $h$ heads, the KV cache scales by $h$.

**Multi-Query Attention (Shazeer, 2019):** All heads share a **single** Key-Value pair. KV cache shrinks by a factor of $h$. But quality can degrade.

**Grouped-Query Attention (Ainslie et al., 2023):** A middle ground between MHA and MQA. Query heads are divided into $g$ groups, each group sharing one KV head. When $g = h$, it equals MHA; when $g = 1$, it equals MQA.

| Method | KV Heads | KV Cache Size | Quality | Adopted By |
|--------|---------|---------------|---------|------------|
| MHA | $h$ | $h \times d_k \times 2 \times L$ | Best | GPT-3, BERT |
| GQA | $g$ ($1 < g < h$) | $g \times d_k \times 2 \times L$ | Near MHA | Llama 2/3, Gemma |
| MQA | $1$ | $d_k \times 2 \times L$ | Slight drop | PaLM, Falcon |

After Llama 2 adopted GQA, it became the de facto industry standard. It maintains MHA-level quality while significantly increasing inference throughput.

### FlashAttention: Memory-Hierarchy-Aware Exact Attention

Dao et al.'s (2022) FlashAttention is an algorithmic breakthrough. The problem with standard attention: the $n \times n$ attention matrix must be materialized in GPU HBM (High Bandwidth Memory). As sequence length grows, this matrix blows up memory.

FlashAttention's core idea: **never fully materialize the attention matrix.** Instead, partition inputs into blocks, process them in GPU SRAM (much faster but much smaller memory), and progressively accumulate results using an online softmax algorithm.

Results:
- Memory complexity: $O(n^2) \rightarrow O(n)$
- Massive IO reduction yields 2-4x wall-clock speedup
- **Mathematically exact** — this is not an approximation

FlashAttention-2 (2023) improved parallelism. **FlashAttention-3 (2024)** is specialized for NVIDIA H100's Hopper architecture, exploiting asynchronous computation and FP8 low-precision. On H100 with BF16: 840 TFLOPs/s (85% of GPU peak utilization); with FP8: 1.3 PFLOPs/s.

FlashAttention-4, written in CuTeDSL, targets both Hopper and Blackwell GPUs.

The combination of these technologies made practical deployment of decoder-only models possible. FlashAttention enables training and long-context inference. GQA shrinks KV cache size. Various KV cache optimizations (quantization, layer-selective caching, etc.) further reduce memory requirements.

---

## The Pendulum Swings Back: Signs of an Encoder-Decoder Revival

Decoder-only dominance appears solid, but interesting countercurrents are emerging.

### PrefixLM: Hybrid Revival

PrefixLM brings encoder advantages inside a decoder-only model. The input sequence is split into "prefix" and "generation" portions:

- **Prefix portion:** The causal mask is removed, enabling **bidirectional attention**. Behaves like an encoder.
- **Generation portion:** Standard causal mask. Behaves like a decoder.

A single model deeply understands the input bidirectionally and generates output autoregressively. Without a separate encoder stack, it approximates the benefits of encoder-decoder architectures.

### T5Gemma: Converting Decoders to Encoder-Decoders

Google's **T5Gemma**, released in 2025, is a fascinating project. It takes the weights of an already-pretrained decoder-only model (Gemma 2) and **converts** it into an encoder-decoder architecture through adaptation.

The method:
1. Initialize both encoder and decoder with the decoder-only model's weights
2. Continue pre-training with PrefixLM or UL2 objectives
3. Task-specific fine-tuning

The results are impressive:
- T5Gemma 9B-9B: **+9 points** on GSM8K (math reasoning) over Gemma 2 9B
- T5Gemma 2B-2B IT: **+12 points** on MMLU over Gemma 2 2B, GSM8K from 58.0% to 70.7%

**Encoder-decoder architectures significantly outperform decoder-only at smaller scales.** This is an important insight: scaling laws favor decoder-only at large scales, but for edge deployment and small-model scenarios, encoder-decoder may offer better parameter efficiency.

### Gemini and Hybrid Architectures

Gemini 2.5 Pro reportedly uses a hybrid architecture combining Transformer + SSM (State Space Model) + MoE (Mixture of Experts). For processing multimodal inputs and long contexts, SSM compensates for the Transformer's $O(n^2)$ limitation.

This signals that architectures are evolving beyond pure decoder-only Transformers, toward combinations that leverage the strengths of each component.

---

## Practical Guide: What to Use in 2025

Architecture choice depends on the use case. Here is a practical guide for the current moment:

### Text Understanding / Classification / NER

**Recommendation:** Encoder-only (BERT family) or small encoder-decoder

Still the most efficient option. ModernBERT, DeBERTa-v3, or fine-tuned RoBERTa deliver the best cost-performance ratio for classification tasks. Particularly advantageous in production environments requiring sub-50ms inference.

### Embeddings / Retrieval

**Recommendation:** Depends on requirements

- Maximum quality: NV-Embed-v2 (decoder-based, 7B parameters)
- Practical balance: BGE-large, GTE-large, E5-large-v2 (encoder-based, ~335M parameters)
- Edge/lightweight: all-MiniLM-L6-v2 (encoder, 22M parameters)

For high-volume document processing, encoder-based models still have the edge in inference cost.

### Text Generation / Chatbots / Reasoning

**Recommendation:** Decoder-only

GPT-4, Claude, Llama 3, Gemma 2. There is virtually no alternative. Decoder-only dominance in this domain is complete.

### Structured Transformation (Translation, Summarization, Code Conversion)

**Recommendation:** Encoder-decoder or decoder-only

T5 variants are efficient at smaller model sizes; at larger scales, decoder-only is preferable. For dedicated small models handling specific tasks, T5Gemma or flan-T5 are strong choices.

| Task | Recommended Architecture | Representative Models | Notes |
|------|-------------------------|----------------------|-------|
| Classification/NER | Encoder-only | DeBERTa-v3, ModernBERT | Fast and cheap |
| Embeddings (top quality) | Decoder-only (adapted) | NV-Embed-v2 | MTEB #1 |
| Embeddings (practical) | Encoder-only | BGE, GTE, E5 | Cost efficient |
| Generation/Chat | Decoder-only | GPT-4, Claude, Llama 3 | The only choice |
| Translation/Summarization (small) | Encoder-decoder | T5Gemma, flan-T5 | Parameter efficient |
| Multimodal | Hybrid | Gemini 2.5 | Transformer+SSM+MoE |

---

## Closing Thoughts

The history of the Transformer is a cycle of unification and divergence. A single architecture split in two, and one half — decoder-only — won through the power of scaling. But even the winner is absorbing advantages from other architectures (PrefixLM, causal mask removal, SSM integration) and moving back toward unification.

The key takeaway: **scaling and data mattered more than architecture itself.** Decoder-only won not because it was structurally superior, but because it had the best conditions for scaling up — a simple training objective, abundant data, and predictable scaling laws. If conditions change — for instance, if small-scale edge deployment becomes critical, or if multimodal input complexity increases — the optimal architecture changes too.

In the end, what matters is understanding your tools and choosing the right one for the problem.

---

**References:**
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
