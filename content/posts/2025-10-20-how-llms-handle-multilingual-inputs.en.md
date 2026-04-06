---
title: "How LLMs Handle Multilingual Inputs: The Secret of English Context with Korean Instructions"
date: 2025-10-20T09:00:00+09:00
tags: ["AI", "LLM", "Multilingual Processing", "Language Models", "Tokenization", "NLP"]
description: "A deep dive into how LLMs process multilingual inputs — from tokenizer design and cross-lingual embeddings to language routing mechanisms. How a single Korean instruction word changes the entire output language."
draft: false
translationKey: "how-llms-handle-multilingual-inputs"
---

## One Word Changes Everything

Paste a 3,000-word English research paper into an LLM. Append three Korean characters at the end: "요약해줘" (summarize this). The entire output comes back in Korean. Ninety-nine percent of the input was English, yet that one percent of Korean determined the output language.

This is not a trivial feature. Beneath it lies a deep stack of interacting systems: tokenizer design, cross-lingual embeddings, attention mechanisms, instruction tuning, and reinforcement learning from human feedback. This post traces the mechanisms by which LLMs process multilingual inputs, from the ground up.

## Tokenization: An Uneven Starting Line

### How BPE Handles Korean

The first gate every input passes through is tokenization. Most modern LLMs use BPE (Byte Pair Encoding) or its variant SentencePiece. The core idea is straightforward: iteratively merge the most frequent byte pairs in a training corpus to build a vocabulary.

The problem starts here. BPE tokenizer training corpora are overwhelmingly English-centric. While the exact proportions of GPT-4's training data remain undisclosed, English typically accounts for 40-60% of Common Crawl-based corpora. Korean is usually around 1-3%.

This imbalance directly manifests in vocabulary allocation:

```
English:  "understanding" → 1 token
Korean:   "이해하다"       → 2-3 tokens
Korean:   "이해"           → 1-2 tokens
Japanese: "理解する"       → 2-3 tokens
```

The number of tokens required to express the same meaning differs dramatically. This metric is called the **fertility rate** — the average number of tokens needed to represent a single word. English sits at roughly 1.0-1.3; Korean ranges from 2.0-3.5; Chinese from 1.5-2.5.

### The Real-World Cost

Fertility differences are not just technical trivia. They translate into tangible costs.

**Context window inequality**: GPT-4's 128K token context window can hold approximately 96,000 English words. The same window holds roughly 36,000-50,000 Korean words. You pay the same price but process half the information.

**Inference cost**: For API-billed LLM services charged per token, Korean users pay 1.5-2x more than English users for equivalent content. Petrov et al. (2023) systematically documented this disparity in "Language Model Tokenizers Introduce Unfairness Between Languages."

**Speed degradation**: More tokens means more attention computation. Since self-attention scales at O(n²), doubling the token count quadruples the attention operations.

### Language-Specific Tokenizers

Research to address this problem is active. Thunder-Tok (2025) proposed a dedicated tokenizer that minimizes token counts for Korean text by integrating Korean morphological analysis into BPE's pre-tokenization step. Korean is agglutinative — a root like "이해" (understand) can become "이해했었겠지만" (although [someone] would have understood) through stacked suffixes — and Thunder-Tok helps BPE recognize these morphological boundaries.

But such per-language optimization conflicts with the design philosophy of universal multilingual models. Applying language-optimized tokenizers for each of 100+ supported languages is impractical. The current BPE paradigm remains fundamentally "most efficient for English, compromised for everything else."

## Cross-Lingual Embeddings: A Meaning Space Beyond Language

### The Discovery of Shared Semantic Space

Once the tokenizer breaks text into tokens, the next step is embedding. Something remarkable happens here: multilingual LLMs map tokens from different languages into a **single shared semantic space**.

"Dog," "개," "犬," "chien" — these four words use entirely different writing systems, but in embedding space, they occupy nearby positions. This is how the model connects meaning across languages without explicit translation.

This was not designed. It **emerges spontaneously** from training on large multilingual corpora. Wikipedia articles on the same concept in English and Korean use similar words in similar contexts. Programming documentation features the same code snippets regardless of the surrounding language. These statistical regularities forge language-transcendent semantic representations inside the model.

### LLMs Think in English

Wendler et al.'s landmark 2024 paper "Do Llamas Work in English?" dissected the internal workings of multilingual LLMs. Using the **logit lens** technique to analyze hidden representations at intermediate layers of Llama-2, the results were striking.

The internal processing of multilingual LLMs divides into three phases:

1. **Input space (early layers)**: Processes tokens in the input language. If the input is Korean, Korean token characteristics are preserved.
2. **Concept space (middle layers)**: This is where the critical transformation occurs. Regardless of input language, decoding the hidden states at middle layers produces **English tokens with the highest probability**. Even when processing Japanese input, the model is "thinking" in English at intermediate layers.
3. **Output space (late layers)**: The concept space representation is converted to the final output language. If the response should be in Korean, the mapping to Korean token space happens here.

This is a direct consequence of English-dominant training data. Since English constitutes the majority of training data, the model's internal representations naturally align most closely with English. Other languages are processed through this English-centric "concept space."

An interesting counterpoint exists: the Swallow model, specialized for Japanese, showed a mixed pattern of English and Japanese in intermediate layers. This is evidence that training data language ratios determine the "language of thought" in internal representations.

### Language-Agnostic Middle Layers

Cross-Layer Transcoder research in 2025 refined this picture further. Researchers found that multilingual LLMs consistently form **language-agnostic shared spaces** in middle layers, regardless of English dominance in training mixtures. This aligns with the "Platonic hypothesis" — the idea that sufficiently large models trained on diverse data converge toward abstract, unified representations.

The same pattern appears in MoE (Mixture of Experts) architectures. Bandarkar and Yang's 2025 study "Multilingual Routing in Mixture-of-Experts" showed that MoE models route tokens to different language-specific experts in early and late layers, but show significant cross-lingual routing alignment in middle layers. The models **implicitly learned to invoke similar experts across languages**.

## Language Routing: How Models Decide Output Language

### The Discovery of Language-Specific Neurons

Tang et al.'s 2024 ACL paper "Language-Specific Neurons: The Key to Multilingual Capabilities in Large Language Models" identified neurons that play a pivotal role in multilingual processing.

They proposed **LAPE (Language Activation Probability Entropy)**, a detection method that tracks activation patterns per neuron across languages to find neurons that activate strongly only for specific languages. Experiments across LLaMA-2, BLOOM, and Mistral revealed:

- Language-specific neurons concentrate in the **top and bottom layers** of the model
- These neurons constitute a small fraction of the total, yet are decisive for processing specific languages
- Selectively activating or deactivating these neurons can **steer the output language**

That last finding is particularly significant. The LLM's output language is not determined by some mystical "understanding" — it is governed by the activation patterns of specific neurons.

### Sparse Autoencoders Reveal Language Features

Anthropic's 2024 "Scaling Monosemanticity" research extracted millions of interpretable features from Claude 3 Sonnet's middle layers. These features were remarkably abstract and multilingual. Features corresponding to cities (San Francisco), people (Rosalind Franklin), elements (Lithium) responded across multiple languages — they were both multimodal and multilingual.

The 2025 follow-up, "On the Biology of a Large Language Model," went deeper. Using **attribution graphs** to trace multilingual processing circuits in Claude 3.5 Haiku:

- When asked "What is the opposite of small?" in English, French, and Chinese, the **same core features** (concepts of smallness, opposition, largeness) activated in all three
- Language-specific components and language-independent components work in combination
- **Larger models share more circuitry**: Claude 3.5 Haiku shared more than twice the proportion of features between languages compared to a smaller model

This suggests LLMs possess a kind of universal "language of thought." Individual languages are merely input/output interfaces to this universal concept space.

### Sparse Dimensions of Language Control

The 2025 paper "Language Lives in Sparse Dimensions" provides even more direct evidence. Researchers identified **sparse dimensions** in the LLM's activation space that control language selection. Manipulating these dimensions switches the output language while preserving semantic content.

```
# In pseudocode:
hidden_state = model.encode("Summarize the following article...")
hidden_state[language_dims] = korean_language_vector  # swap language dims only
output = model.decode(hidden_state)  # outputs in Korean
```

This is the essence of what "요약해줘" does. When Korean tokens enter the model, the attention mechanism extracts a "Korean" language signal from those tokens, which activates language-specific neurons in the output layers, switching the entire output to Korean.

### The Role of Instruction Tuning

Language-specific neurons alone do not fully explain why "요약해줘" determines the output language. This is where **instruction tuning** enters the picture.

Modern LLMs undergo supervised fine-tuning on (instruction, response) pairs after pre-training. During this process, the model learns a critical pattern:

> "When the user instructs in Korean, respond in Korean."

RLHF (Reinforcement Learning from Human Feedback) reinforces this pattern further. When human evaluators score "Korean response to Korean instruction" highly, the model learns to treat **the instruction language as a strong signal for output language**.

This is observable in prompt engineering. "Summarize in Korean" (an English instruction) does produce Korean output, but "한국어로 요약해줘" (Korean instruction) produces it far more reliably. The language of the instruction itself is the strongest signal for output language determination.

## Code-Switching: When Languages Collide

### Human Code-Switching, Machine Code-Switching

Bilingual speakers naturally code-switch. "오늘 meeting에서 새로운 feature에 대해 discuss했어" (We discussed the new feature at today's meeting) mixes Korean and English seamlessly. LLMs must handle these mixed inputs too.

Consider an extreme example:

```
"What (무엇) est (is) the 날씨 (weather) en (in) Seoul hoy (today)?"
```

This sentence interleaves English, Korean, French, and Spanish at the word level. Remarkably, modern LLMs correctly interpret it as "What is the weather in Seoul today?"

This works because of cross-lingual embeddings. Regardless of which language each word is written in, they map to the same semantic region in embedding space. The attention mechanism builds connections between words based on these semantic relationships, not orthographic similarity.

### DeepSeek-R1's "Accidental Bilingualism"

In early 2025, an intriguing phenomenon emerged. Reasoning-specialized models like DeepSeek-R1 and QwQ-32B began **spontaneously mixing languages** during chain-of-thought reasoning. An English question would trigger Chinese reasoning mid-thought, or a Chinese question would elicit English thinking.

This was not an intended feature. It is believed to be a byproduct of the RLVR (Reinforcement Learning with Verifiable Rewards) training strategy. Since the reward function evaluates only the final answer's correctness — not language consistency in the reasoning chain — the model takes "the most efficient path to the answer," even if that path crosses language boundaries.

This phenomenon reveals something fundamental about multilingual processing in LLMs. **Language is a tool, not a destination for the model.** Korean and English are not separate systems but different interfaces to the same conceptual space.

### Limitations of Code-Switching Processing

There are limitations, of course.

**Grammar conflicts**: Korean uses SOV (Subject-Object-Verb) word order; English uses SVO (Subject-Verb-Object). Mixing both in a sentence creates ambiguity about which grammar rules to follow.

**Homographs across languages**: "Gift" means "present" in English but "poison" in German. Such collisions in mixed-language inputs increase the risk of misinterpretation.

**Rare language combinations**: Code-switching between high-resource languages (English-Chinese, English-Spanish) is handled relatively well, but combinations like Swahili-Korean — nearly absent from training data — show sharply degraded accuracy.

## Experimental Evidence and Recent Research

### Anthropic's "Tracing Thoughts" Study (2025)

Anthropic's March 2025 paper "On the Biology of a Large Language Model" provides the most direct evidence to date. Researchers used attribution graphs to visualize the multilingual processing circuits in Claude 3.5 Haiku.

The key experiment was simple. Ask "What is the opposite of small?" in English, French ("Quel est le contraire de petit?"), and Chinese ("'小'的反义词是什么?"), then compare the internal circuit activations.

Results:
- All three languages activated the **same concept features** for "smallness," the "opposite" relation, and "largeness"
- Differences appeared only in language-specific input parsing and output generation stages
- Larger models showed higher proportions of shared circuitry

This proves LLMs are not merely "systems that translate well." Internally, they perform **language-independent conceptual reasoning**, converting to specific languages only at the input and output stages.

### Neuron Steering Experiments

Follow-up work to Tang et al. (2024) conducted an even more provocative experiment: artificially manipulating language-specific neurons to control output language.

For instance, given an English prompt with Korean neurons force-activated, the model responds in Korean. Conversely, given a Korean prompt with Korean neurons deactivated, the model reverts to English.

This is direct evidence of the mechanism by which "요약해줘" changes the output language. When Korean tokens enter, they activate Korean language neurons, and this activation propagates through the entire output generation process.

### SAE-Based Multilingual Analysis (2025)

"Unveiling Language-Specific Features in Large Language Models via Sparse Autoencoders" (ACL 2025) used SAEs to identify language-specific features within feed-forward networks with greater precision. Using a method called SAE-LAPE to quantify the monolinguality of features:

- Language-specific features are distributed primarily in **middle-to-final layers**
- These features are interpretable and correspond to grammatical patterns of specific languages
- **Steering vectors** based on these features can switch output language while preserving semantic content

## The Multilingual Performance Gap

### What Benchmarks Reveal

"Supporting all languages" does not mean performing equally across all languages. Major 2025 benchmark studies make this clear.

**MMLU-ProX (2025)**: A large-scale benchmark evaluating identical 11,829 questions across 29 languages. Performance gaps of up to 24.3% were found between high-resource and low-resource languages.

**BenchMAX (2025)**: Concluded that "increasing model size consistently enhances multilingual performance, but the performance gap between English and other languages persists."

**KMMLU**: A Korean-specific MMLU variant with culturally relevant questions that capture real Korean language capabilities beyond what simple translation benchmarks can measure.

For Korean specifically, performance collapses in certain task types. Reliable Version Editing drops to 32-37% for Korean, while German sometimes surpasses English. This is the compounded effect of tokenization inequality, training data volume, and structural linguistic properties.

## Prompt Engineering: Practical Implications

### Controlling Output Language

Understanding these mechanisms enables more sophisticated multilingual prompt engineering.

**The instruction language is the strongest signal.** Writing "Reply in Korean" in English is less reliable than writing "한국어로 답변하세요" in Korean. The Korean tokens directly activate language-specific neurons.

**System prompt language sets the default.** Setting the system prompt of ChatGPT or Claude in Korean creates a strong tendency to respond in Korean even when the user writes in English.

**The last instruction dominates.** This is why appending a Korean instruction after a long English document produces Korean output. In the transformer's attention mechanism, recent tokens tend to exert stronger influence (recency bias).

### Performance Optimization Tips

**Use English for complex reasoning**: Given that the model's "language of thought" is close to English, tasks requiring deep reasoning may benefit from English instructions with Korean-only output.

```
Analyze the following data and identify the top 3 trends.
Then present your findings in Korean.
[data]
```

**Consider token efficiency**: When context window space is limited, providing core content in English and instructions in Korean lets you fit more information.

**Maintain language consistency**: Unless code-switching is specifically needed, keeping the entire prompt in one language produces the most stable output.

## Future Directions: Toward Language-Fair AI

### Current Limitations

Current multilingual LLMs are fundamentally **English-centric systems with multilingual capabilities bolted on**. English is the "default language" and everything else is "additional." This is confirmed at every level: tokenizer design, training data composition, internal representation structure.

### Paths Forward

**Balanced training data**: Not just more data, but higher quality and diversity within each language. For Korean, this means academic papers, legal documents, creative writing, and other domain-specific high-quality text.

**Language-fair tokenizers**: Acknowledging BPE's fundamental limitations, researchers are exploring byte-level tokenization and language-adaptive vocabularies. Parity-Aware BPE (2025) explicitly optimizes for cross-lingual tokenization fairness.

**Language-adaptive MoE**: Assigning specific experts to specific languages within MoE architectures is under investigation. MoE-LPR (2024) integrates language priors into the routing mechanism, enabling efficient expansion of language capabilities to existing models without catastrophic forgetting.

**Interpretability-driven improvement**: Anthropic's attribution graphs and SAE-based analyses have made it possible to "open up" the model's multilingual processing mechanisms. This is not just academic curiosity. When we can precisely diagnose where and why a model fails for a specific language, targeted improvements become possible.

## Conclusion

The phenomenon where three Korean characters — "요약해줘" — change an LLM's output language looks simple on the surface, but beneath it lies a tightly interwoven web of core NLP technologies. The unequal vocabulary allocation of BPE tokenizers, the shared semantic space of cross-lingual embeddings, the English-pivot middle layers, the selective activation of language-specific neurons, and the language preference learned through instruction tuning and RLHF — all of these combine to create a seamless user experience.

But behind that seamlessness lies structural inequality. English speakers and Korean speakers use the same model but do not have the same experience. Token efficiency, context window capacity, reasoning accuracy, API costs — across every dimension, non-English languages are at a disadvantage.

Recognizing this is the first step toward improvement. And recent interpretability research and fair tokenization work show that more equitable multilingual AI is not technically impossible. The problem is not capability — it is priority.

---

**References**

- Wendler et al. (2024). "Do Llamas Work in English? On the Latent Language of Multilingual Transformers." ACL 2024.
- Tang et al. (2024). "Language-Specific Neurons: The Key to Multilingual Capabilities in Large Language Models." ACL 2024.
- Anthropic (2024). "Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet."
- Anthropic (2025). "On the Biology of a Large Language Model." Transformer Circuits.
- Bandarkar & Yang (2025). "Multilingual Routing in Mixture-of-Experts."
- Petrov et al. (2023). "Language Model Tokenizers Introduce Unfairness Between Languages."
- "Language Lives in Sparse Dimensions." (2025).
- "Unveiling Language-Specific Features in Large Language Models via Sparse Autoencoders." ACL 2025.
