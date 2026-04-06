---
title: "Nested Learning Paper Review: Stripping the Illusion from Deep Learning Architectures"
date: 2025-11-09T09:15:00+09:00
tags: ["AI", "Deep Learning", "Nested Learning", "Titans", "Memory Systems", "Optimization", "Paper Review"]
description: "A deep review of the Nested Learning paper that reframes deep learning architectures as nested optimization problems. The revolutionary insight that gradient optimizers are associative memory modules."
draft: false
translationKey: "nested-learning"
---

## Why This Paper Matters

What if everything we call "deep learning" is not actually deep?

This is the provocative question at the heart of *Nested Learning: The Illusion of Deep Learning Architectures* (Behrouz, Razaviyayn, Zhong, Mirrokni -- Google Research, [NeurIPS 2025](https://openreview.net/forum?id=nbMeRvNb7A)). The paper argues that stacking more layers does not necessarily increase the computational depth or learning capacity of a model. Instead, it proposes a fundamentally different axis of depth: **nesting levels of optimization problems**, each with its own context flow and update frequency.

The lead author, Ali Behrouz, is the same researcher behind [Titans](https://arxiv.org/abs/2501.00663), the architecture that introduced "learning to memorize at test time" -- a neural long-term memory module that updates its weights during inference. Nested Learning is the theoretical completion of that line of work. Where Titans demonstrated a specific architecture, this paper provides the unifying mathematical framework that explains why it works and how to generalize it.

> **Paper:** [arXiv:2512.24695](https://arxiv.org/abs/2512.24695) | [OpenReview](https://openreview.net/forum?id=nbMeRvNb7A) | [Google Research Blog](https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/)

---

## Paper Summary

### The Core Thesis

Current deep learning models suffer from what the authors call "anterograde amnesia" -- a neurological condition where new long-term memories cannot be formed after onset, though pre-existing memories remain intact. A person with this condition perceives only the past (before onset) and the immediate present, perpetually experiencing the current moment as new.

The analogy to LLMs is precise. An LLM's knowledge is confined to two sources: (1) the immediate context window -- a fleeting short-term memory, and (2) stale knowledge baked into MLP layers during pre-training -- an unchanging long-term memory frozen at a fixed point in time. The model cannot form new long-term memories. It cannot consolidate information from inference into persistent knowledge. It is trapped in an eternal present.

This limitation is not a failure of scale; it is a failure of architecture. Simply stacking more layers does not address it. The authors identify four specific ways in which depth-by-stacking falls short:

1. **Computational depth does not increase linearly with layer count.** Additional layers may not meaningfully increase the model's ability to implement complex algorithms.
2. **Parameter expressivity has diminishing returns.** Some parameter sets show only marginal improvement with additional depth or width.
3. **Training converges to suboptimal solutions** due to optimizer choice and hyperparameter sensitivity.
4. **Adaptation, continual learning, and out-of-distribution generalization** are not improved by depth alone.

Nested Learning (NL) addresses this by reframing a machine learning model not as a monolithic function approximator, but as **a system of nested, multi-level, or parallel optimization problems**, each operating at a different time scale and possessing its own gradient flow. The key insight borrowed from neurophysiology is that the human brain achieves continual learning through two complementary consolidation processes: fast "online" synaptic consolidation (stabilizing new memory traces) and slow "offline" systems consolidation (replaying and reorganizing memories during sleep). NL captures this multi-timescale structure mathematically.

### Three Key Contributions

The paper makes three concrete contributions built on this framework:

1. **Deep Optimizers:** Well-known gradient-based optimizers (Adam, SGD with Momentum, etc.) are shown to be associative memory modules that compress gradients via gradient descent. This opens the door to designing optimizers with deeper memory and more expressive learning rules.

2. **Self-Modifying Titans:** A novel sequence model that learns its own update algorithm, enabling it to modify itself during inference. This creates an architecture with potentially unbounded levels of in-context learning.

3. **Continuum Memory System (CMS):** A generalization of the traditional long-term/short-term memory dichotomy into a continuous spectrum of memory modules, each updating at different frequencies.

These three components are combined into **HOPE** (Higher-Order Persistent Evolution), a learning module that shows promising results on language modeling, continual learning, and long-context reasoning tasks.

---

## Key Insights

### 1. Everything Is Associative Memory

The paper begins with a deceptively simple observation rooted in neuropsychology. The authors draw a careful distinction between *memorization* (a neural update caused by an input) and *learning* (the process of acquiring effective, useful memories). With this distinction in hand, they define an associative memory as an operator $M: K \rightarrow V$ that maps a set of keys to a set of values. The operator itself is the memory; the mapping process is memorization; acquiring a good operator from data is learning.

From this starting point, the authors show that a single-layer MLP trained with gradient descent is a 1-level associative memory. Consider the standard weight update:

$$W_{t+1} = W_t - \eta_{t+1} \nabla_{y_{t+1}} L(W_t; x_{t+1}) \otimes x_{t+1}$$

Setting $u_{t+1} = \nabla_{y_{t+1}} L(W_t; x_{t+1})$, the gradient in representation space, this update can be reinterpreted as solving the following optimization problem:

$$W_{t+1} = \arg\min_W \left( \langle W x_{t+1}, u_{t+1} \rangle + \frac{1}{2\eta_{t+1}} \|W - W_t\|_2^2 \right)$$

The first term measures the quality of the mapping (via dot-product similarity), and the second is a proximity regularizer. The signal $u_{t+1}$ is what the authors call a **Local Surprise Signal (LSS)** -- it quantifies the mismatch between the current output and the structure enforced by the loss function. So training is equivalent to finding an associative memory that maps data points to their surprise signals, compressing this mapping into the weight matrix.

This reframing is the foundational move of the entire paper. It transforms the familiar narrative of "minimize a loss function" into "build an efficient memory system." And the implications cascade: if single-layer MLP training is 1-level associative memory, what happens when we add momentum? When we use attention? When we stack these components together?

**Linear attention as nested memory.** The paper then applies this lens to linear attention. The recurrence $M_t = M_{t-1} + v_t k_t^\top$ is shown to be equivalent to optimizing a matrix-valued associative memory via gradient descent with a dot-product objective and learning rate 1. Combined with the outer training loop that optimizes projection matrices $W_k, W_v, W_q$, linear attention trained with gradient descent becomes a **2-level nested optimization system**: the inner level compresses context tokens, while the outer level compresses training data statistics.

This decomposition reveals something crucial: **in the inner loop, no gradient flows through the memory $M_t$ to the projection layers, and vice versa.** Each level has its own exclusive gradient flow. This is the structural signature of Nested Learning.

### 2. The Formal Framework: Update Frequency and Neural Learning Modules

Before diving into the specific applications, it is worth understanding the formal machinery that makes NL rigorous. The key concept is **update frequency**: for any component $A$ of a model (a weight matrix, a momentum buffer, an attention memory), its frequency $f_A$ is defined as the number of updates per unit time (where one update for one data point is the unit of time).

Components are ordered by a relation $A \succ B$ ("A is faster than B") when either $f_A > f_B$, or they have the same frequency but $A$ must be computed before $B$. This ordering creates a hierarchy of **levels**. Components at the same level have the same update frequency; higher levels update less frequently.

A **Neural Learning Module (NLM)** is then defined as a computational model whose components span multiple levels -- each with its own optimization problem, objective function, and exclusive gradient flow. This is orthogonal to traditional depth (layer stacking): adding more levels adds learning capacity without adding more parameters at any single level.

This formalization is what separates NL from related ideas like meta-learning or Fast Weight Programs. It provides a concrete, measurable way to characterize the "depth of learning" of any architecture -- simply count its levels and characterize their frequency schedule.

### 3. Deep Optimizers: Adam Is a Memory Module

The most disruptive insight in the paper is the reinterpretation of standard optimizers as nested memory systems.

**Momentum as 2-level optimization.** When you add momentum to gradient descent, the update becomes:

$$W_{t+1} = W_t - m_{t+1}, \quad m_{t+1} = \alpha m_t - \eta_t \nabla L(W_t; x_t)$$

The momentum term $m_t$ is itself being optimized by a single step of gradient descent at each iteration. It is an associative memory that compresses the history of gradients into its parameters. So momentum-based gradient descent is actually a **2-level optimization process**: the inner level learns to store gradient patterns, and the outer level uses those stored patterns to update weights.

This is not merely a mathematical curiosity. It reframes the relationship between slow weights (model parameters) and fast weights (optimizer state) as a hierarchy of memory modules operating at different frequencies -- precisely analogous to Fast Weight Programs [Schmidhuber, 1992].

**Adam as optimal associative memory.** The paper further shows (in Appendix C.4) that the Adam optimizer, with minor modifications, can be interpreted as an optimal associative memory over model gradients. This provides a theoretical explanation for why Adam has been so empirically successful: it has the right memory structure for gradient compression.

**Designing new optimizers.** The NL framework suggests concrete extensions:
- **More expressive association** (Eq. 19-20): Using a preconditioner $P_i$ to create richer key-value mappings for the momentum memory, equivalent to preconditioned momentum GD.
- **More expressive objectives** (Eq. 21-22): Replacing the inner dot-product objective with L2 regression yields a delta-rule-based update, improving memory capacity.
- **More expressive memory** (Eq. 23): Replacing the linear momentum matrix with an MLP creates "Deep Momentum Gradient Descent" (DMGD) -- an optimizer with nonlinear gradient memory.
- **Non-linear outputs** (Eq. 24): Adding a nonlinear output function. When this is Newton-Schulz iteration and the memory is linear, the result is equivalent to the [Muon optimizer](https://arxiv.org/abs/2502.16982) -- providing a post-hoc theoretical justification for Muon's empirical success.

### 4. Self-Modifying Titans

The Titans architecture (Behrouz et al., 2025) introduced a neural long-term memory module -- a deep MLP whose weights are updated during inference via gradient descent on a surprise-based objective. In NL terminology, standard Titans is a 2-level system: the inner level updates the memory module's weights (fast), while the outer level updates the projection and gating parameters (slow, during pre-training).

Self-Modifying Titans push this further. The update rule of the memory module is itself parameterized by a learnable function. Instead of a fixed gradient descent step, the memory update becomes:

$$\theta_{M}^{(t+1)} = \theta_{M}^{(t)} - f_\phi\left(\nabla L(\theta_{M}^{(t)}; x_t)\right)$$

where $f_\phi$ is a learned transformation of the gradient. The parameters $\phi$ of this transformation are themselves trained -- creating a 3-level system. And $\phi$ could itself have a learnable update rule, creating a 4-level system, and so on.

This creates a potentially infinite recursion of learning levels: the model learns, learns how to learn, learns how to learn how to learn. While the mathematical formulation is elegant, the practical implementation requires careful stabilization -- the paper uses techniques from the MIRAS framework to prevent divergence.

The connection to meta-learning is direct but the execution is different. Traditional meta-learning (MAML, Reptile) operates across tasks: the outer loop sees different tasks, and the inner loop fine-tunes on each one. Self-Modifying Titans operate within a single sequence: the nesting happens across time scales of the same data stream. This makes it applicable to standard language modeling, not just few-shot learning scenarios.

The significance here is not the specific architecture but the principle: **the depth of a learning system should be measured not by the number of layers, but by the number of nested optimization levels.**

### 5. Continuum Memory System

Traditional architectures treat memory as a binary: short-term (attention) vs. long-term (MLP weights). The Continuum Memory System (CMS) generalizes this into a continuous spectrum.

The underlying idea comes from brain wave hierarchies. Different brain regions process information at different frequency rates -- fast oscillations for immediate sensory processing, slow oscillations for abstract conceptual integration. CMS mirrors this by introducing a **chain of MLP blocks** $\text{MLP}^{(f_1)}, \ldots, \text{MLP}^{(f_k)}$, where each block updates at a different frequency $f_\ell$.

The output at each time step passes through the entire chain:

$$y_t = \text{MLP}^{(f_k)}(\text{MLP}^{(f_{k-1})}(\cdots \text{MLP}^{(f_1)}(x_t)))$$

But critically, the parameters of the $\ell$-th block are only updated every $C^{(\ell)}$ steps:

$$\theta^{(f_\ell)}_{i+1} = \begin{cases} \theta^{(f_\ell)}_i - \sum_{t=i-C^{(\ell)}}^{i} \eta^{(\ell)}_t f(\theta^{(f_\ell)}_t; x_t), & \text{if } i \equiv 0 \pmod{C^{(\ell)}} \\ \theta^{(f_\ell)}_i, & \text{otherwise} \end{cases}$$

The highest-frequency blocks ($f_1$) capture rapidly changing contextual information -- functioning like attention. The lowest-frequency blocks ($f_k$) store slowly evolving abstract knowledge -- functioning like traditional FFN layers. Everything in between creates a gradient of temporal abstraction that has no analogue in standard architectures.

A traditional Transformer block is a special case where $k = 1$ -- only two extreme frequencies exist. The gap between "update every token" (attention) and "update never after training" (FFN) is enormous. CMS fills this gap with intermediate frequencies, providing a principled way to handle information that changes faster than world knowledge but slower than token-level context.

This interpretation also offers a fresh perspective on the FFN layers themselves. Rather than viewing them as generic feature mixers or knowledge stores, CMS reframes them as **memory modules at a specific frequency** -- the lowest one. Their "knowledge" is simply context compressed at the slowest time scale available to the system.

### 6. HOPE Architecture

HOPE combines three elements:
1. The self-referential learning module from Self-Modifying Titans
2. A novel variant of gradient descent (Eq. 28-29) that accounts for dependencies between data points using L2 regression
3. The Continuum Memory System

The novel gradient descent variant is particularly noteworthy. Standard backpropagation uses a dot-product objective (Eq. 26) that ignores dependencies between data samples. HOPE replaces this with an L2 regression objective:

$$\min_W \| W x_t - \nabla_{y_t} L(W_t; x_t) \|_2^2$$

which yields the update rule:

$$W_{t+1} = W_t (I - x_t x_t^\top) - \eta_{t+1} \nabla_{y_t} L(W_t; x_t) \otimes x_t$$

The key difference is the $(I - x_t x_t^\top)$ term, which creates a data-dependent decay that accounts for inter-token dependencies. This is crucial in token space, where tokens are decidedly not independent of each other.

The result is an architecture that can continuously learn and adapt, with memory modules operating across multiple time scales. On language modeling benchmarks, HOPE achieves lower perplexity than both standard Transformers and modern recurrent models (including Mamba and RWKV). On continual learning and long-context reasoning tasks -- where the multi-timescale memory structure provides the greatest advantage -- the improvements are even more pronounced. The BABILong benchmark results are particularly striking, as HOPE can reason over extremely long contexts that exceed the capacity of standard attention-based models.

---

## Analysis and Commentary

### Redrawing the Map of Sequence Model Architectures

Since 2024, the sequence modeling landscape has exploded with diversity: Mamba's selective state spaces, RWKV's linear attention RNN, xLSTM's exponential gating, TTT-Linear's test-time training layers, and Titans' neural memory. Each architecture brings its own vocabulary and framework, making it genuinely difficult to understand what they share and where they differ.

Nested Learning imposes order on this chaos. Through the NL lens:

- **Transformer attention** is a non-parametric associative memory at the fastest update frequency (every token). FFN layers are the slowest frequency (only during pre-training). A standard Transformer is an extreme 2-level NL system with nothing in between.

- **Mamba's selective SSM** is a parametric associative memory where the state transition matrix is input-dependent. The selective mechanism is a learned gate that decides what information to compress into memory -- exactly the NL formulation.

- **TTT-Linear** is perhaps the most directly connected to NL. Its hidden state is a linear model, and its update rule is a gradient descent step on a self-supervised objective. It is, in essence, a 2-level nested optimization system. Nested Learning extends this idea to arbitrary depth.

- **RWKV's WKV mechanism** is a variant of linear attention, which the paper (Section 2.1) shows is mathematically equivalent to an associative memory optimized by gradient descent.

What this means is that the recent architecture wars have been, unknowingly, an exploration of different points in a single design space: **"At which nesting level, with what objective function, and at what frequency do you update memory?"**

### The Optimizer-Architecture Unification

Perhaps the most consequential implication of this paper is the collapse of the boundary between optimizers and architectures. Traditionally, these have been separate research communities with separate conferences and separate intuitions. NL shows they are the same thing at different levels of a unified system.

This has practical consequences:

1. **Co-design becomes natural.** Instead of choosing an architecture and then separately choosing an optimizer, practitioners can think about the entire stack as a hierarchy of memory modules. What is the right memory capacity at each level? What objective should each level optimize? These questions apply equally to attention mechanisms and to Adam's moment estimates.

2. **Muon and other empirical optimizers get theoretical grounding.** The paper's demonstration that Muon is a special case of NL's non-linear output extension (Eq. 24 with Newton-Schulz iteration) retroactively explains an optimizer that was primarily justified empirically. This suggests NL can serve as a theory-first tool for discovering new optimizers.

3. **Optimizer state is not overhead -- it is model capacity.** If momentum is an associative memory, then optimizer memory (which can be 2-3x the model size for Adam) is not wasted storage; it is additional memory capacity for gradient patterns. This reframes discussions about optimizer memory efficiency.

### The Self-Modification Problem

The self-modifying aspect of HOPE is the most intellectually exciting -- and the most practically uncertain -- part of the paper. A model that learns its own update rule is, in principle, a model that can continuously improve itself. But it also introduces fundamental stability concerns.

The infinite recursion of "learning to learn to learn..." is mathematically well-defined but practically challenging. In software engineering terms, it is like writing code that modifies its own compiler. The potential is enormous, but so is the risk of divergence, mode collapse, or catastrophic self-modification. The paper uses MIRAS-style stabilization, but scaling these techniques to production LLMs remains an open challenge.

From an AI safety perspective, self-modifying systems introduce a new class of alignment concerns. If a model can alter its own learning dynamics, the guarantees we make about its behavior at deployment time may not hold after prolonged inference. This is an important area for future work.

### What Depth Really Means

The paper's title -- "The Illusion of Deep Learning Architectures" -- is a bold claim, and the paper largely delivers on it. The argument is not that depth (stacking layers) is useless, but that it is only one dimension of model capacity. A 100-layer Transformer with a standard optimizer has exactly 2 levels of nested optimization: the inner memory update (attention) and the outer parameter update (backpropagation). A 2-layer model with 5 levels of nested optimization may be "deeper" in a more meaningful sense.

This echoes a long-standing intuition in the meta-learning community: what matters is not the size of the hypothesis space, but the structure of the learning process that searches it. NL formalizes this intuition and makes it actionable.

There is an important historical thread here. Jurgen Schmidhuber's Fast Weight Programs (1992) already established the concept of networks with two time scales of learning -- slow weights trained by backpropagation and fast weights generated by another network. The connection between linear attention and FWPs was later made explicit by Schlag et al. (2021). NL generalizes this beyond two levels to arbitrary nesting depth, and critically, it formalizes the concept with the update frequency ordering and the neural learning module abstraction. This is the difference between a specific technique and a general framework.

### Limitations and Open Questions

No paper is without limitations, and NL has several worth noting:

1. **Empirical scale.** HOPE's experimental results are promising but at moderate scale (up to ~1B parameters in the reported experiments). Whether the theoretical advantages of deeper nesting translate at frontier model scales (100B+) remains to be demonstrated. The computational overhead of maintaining multiple optimization levels may interact poorly with existing infrastructure optimized for standard Transformer training.

2. **Stability of deep nesting.** The paper acknowledges but does not fully resolve the stability challenges of deep self-modification. The MIRAS framework provides practical stabilization, but a theoretical understanding of convergence guarantees for deeply nested optimization is lacking.

3. **The "levels" question.** How many levels of nesting does a practical task actually need? The paper does not provide a principled method for determining the optimal nesting depth for a given problem. This is analogous to early deep learning lacking guidance on how many layers to use, and it will likely require extensive empirical investigation.

4. **Interaction with scaling laws.** The existing neural scaling laws (Kaplan et al., 2020; Hoffmann et al., 2022) are formulated for standard Transformers with standard optimizers. NL introduces new axes of scaling (nesting depth, per-level capacity, frequency schedule) that may require entirely new scaling law formulations.

---

## Practical Implications

### For Architecture Designers

1. **Think in frequencies, not layers.** When designing a model, the question "how many layers?" is less important than "how many time scales of memory does this task require?" Short-range token dependencies need fast-frequency memory (attention). Document-level coherence needs medium-frequency memory. World knowledge needs slow-frequency memory. CMS provides a principled way to combine these.

2. **Hybrid architectures are not hacks.** Models that combine Transformer attention with SSM blocks or RNN components are often dismissed as unprincipled combinations. NL provides the theoretical justification: these hybrids are simply systems with memory modules at multiple frequency bands.

3. **Consider nested objectives.** Most architectures use a single training objective (next-token prediction). NL suggests that each level of nesting could have its own objective function, optimized at its own time scale. This is already implicit in techniques like auxiliary losses, but NL makes it explicit and systematic.

### For Practitioners

1. **Optimizer choice is architecture choice.** Moving from Adam to a deeper optimizer (like DMGD or a Muon variant) is equivalent to adding a new memory level to your model. If your task involves complex gradient dynamics -- for instance, continual learning or multi-task training -- investing in optimizer expressivity may yield more returns than adding layers. Concretely: if you are training with AdamW and noticing that the model struggles with long-range dependencies in training data, the NL framework suggests that your optimizer's gradient memory (the first and second moment estimates) may be the bottleneck, not the model architecture.

2. **CMS is a low-cost upgrade path.** Adding frequency-stratified MLP chains to an existing Transformer backbone is architecturally simple and conceptually justified by NL. For applications that require long-context reasoning without the quadratic cost of full attention, CMS offers a principled middle ground. Unlike techniques like sparse attention or sliding window attention that sacrifice information for efficiency, CMS provides a different type of memory that complements attention rather than replacing it.

3. **Monitor optimizer state as model state.** If momentum is memory, then monitoring optimizer state (gradient magnitude distributions, moment estimate dynamics) is as informative as monitoring hidden states. This may offer new diagnostic tools for training instability. When training diverges or loss spikes occur, the NL interpretation suggests examining the optimizer's "memory health" -- is the momentum buffer accurately compressing gradient history, or has it lost track of important patterns?

4. **Rethink fine-tuning strategies.** If the outer-level memory (pre-trained weights) represents slow-frequency knowledge and the inner-level memory (attention/fast weights) represents fast-frequency context, then fine-tuning is an operation that modifies the slow memory using a much faster signal than it was designed for. This may explain some pathologies of fine-tuning (catastrophic forgetting, overfitting to small datasets) and suggests that fine-tuning procedures should respect the frequency hierarchy -- updating slow memories slowly, perhaps using lower learning rates or more conservative optimization for outer-level parameters.

### For Researchers

1. **The design space is larger than we thought.** NL reveals a vast, mostly unexplored design space of nested optimization configurations. The traditional axes of model design (depth, width, attention pattern) are augmented by nesting depth, per-level objectives, per-level optimizers, and frequency scheduling. To give a sense of scale: a standard Transformer has 2 nesting levels, one inner objective (implicit in attention), and one frequency schedule (per-token for attention, per-batch for weights). HOPE has at least 4 levels. The number of possible configurations grows combinatorially with nesting depth.

2. **Test-time learning is the frontier.** The progression from static inference (Transformer) to single-level test-time learning (Titans, TTT) to multi-level self-modification (HOPE) suggests that the field is converging on models that genuinely learn during deployment. The engineering challenges are substantial, but the theoretical foundation is now in place. An important corollary: benchmarks designed for static models may systematically undervalue architectures with test-time learning capabilities. Tasks like continual learning, lifelong adaptation, and open-ended reasoning may be where deeply nested models show their true advantage.

3. **Neuroscience is not just a metaphor.** NL's inspiration from multi-timescale brain dynamics -- synaptic consolidation, systems consolidation, hierarchical oscillations -- is more than analogical. The mathematical framework makes these biological principles computationally precise, suggesting that neuroscience may offer more concrete architectural guidance than previously appreciated. The analogy to anterograde amnesia is not just didactic -- it identifies a specific structural deficiency (absence of online consolidation) and proposes a specific structural remedy (adding intermediate-frequency memory modules).

4. **Unifying theory enables systematic ablation.** One underappreciated benefit of NL as a framework is that it enables principled ablation studies across architectures. Instead of comparing "Transformer vs. Mamba" as monolithic entities, researchers can compare specific design choices at specific nesting levels: "What is the effect of replacing the inner objective from dot-product to L2 regression?" or "How does adding a third frequency level affect long-context performance?" This level of systematic comparison has been difficult with previous frameworks.

---

## Where the Field Is Heading

Nested Learning, combined with the broader trend of test-time-compute and test-time-learning architectures, points toward a future where the boundary between "training" and "inference" dissolves. The progression is clear:

- **Static inference** (standard Transformer): Parameters are frozen after training. The model is a fixed function.
- **Single-level test-time learning** (Titans, TTT-Linear): One memory level updates during inference. The model adapts but through a fixed learning rule.
- **Multi-level self-modification** (HOPE): Multiple memory levels update during inference, and the learning rules themselves can evolve. The model is a learning system, not just a function.

If this progression continues, we may see production models that genuinely improve with use -- not through fine-tuning or RLHF, but through built-in multi-timescale learning during normal operation. The engineering challenges are formidable (stability, efficiency, safety), but the theoretical path is now marked.

One concrete prediction: hybrid architectures that combine attention (non-parametric fast memory), SSM-style recurrence (parametric medium-frequency memory), and CMS-style MLP chains (parametric slow-frequency memory) will become the default backbone for production language models within the next few years. The current trend of "Transformer + Mamba" hybrids (such as Jamba from AI21 Labs and similar architectures) already moves in this direction, but without the principled frequency-based design that NL makes possible. When these hybrids are designed with explicit frequency schedules and per-level objectives, we should expect meaningful improvements in long-context performance and continual learning capability.

Another direction to watch: the application of NL's Deep Optimizer framework to the design of training procedures. If optimizers are memory modules, then the common practice of using the same optimizer configuration throughout training is analogous to using the same memory structure for both initial learning and late-stage refinement. NL suggests that the optimizer's "depth" and objective could be dynamically adjusted during training -- perhaps starting with a simple (shallow) optimizer for rapid initial learning and progressively deepening it for fine-grained pattern compression in later stages. This is loosely analogous to curriculum learning, but applied to the optimizer rather than the data.

The convergence with neuroscience is also worth watching. NL's inspiration from multi-timescale brain dynamics -- synaptic consolidation, systems consolidation, hierarchical oscillations -- is not mere analogy. The mathematical framework makes these biological principles computationally precise. As neuroscience continues to reveal the detailed mechanisms of biological memory consolidation, we may find increasingly specific architectural guidance for artificial systems.

## Conclusion

Nested Learning does not merely propose a new architecture. It redefines the rules of the architecture design game itself. The shift from "stack more layers" to "nest more levels of learning" offers a fundamental alternative to the "scale up" paradigm that has dominated the last decade.

The paper leaves us with an uncomfortable truth: much of what we have called "deep" learning may not have been very deep at all. True depth lies not in the number of layers, but in the number of levels of learning.

---

*This review is based on the paper [Nested Learning: The Illusion of Deep Learning Architectures](https://arxiv.org/abs/2512.24695) by Behrouz et al. (NeurIPS 2025). The analysis and commentary sections represent the reviewer's interpretation and do not necessarily reflect the authors' positions.*
