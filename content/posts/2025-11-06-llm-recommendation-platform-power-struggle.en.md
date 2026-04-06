---
title: "The Commercialization of LLM Recommendations and the Platform Power Struggle"
date: 2025-11-06T09:15:00+09:00
tags: ["AI", "LLM", "Recommendation Systems", "Platform Economics", "Business Strategy"]
description: "Does an LLM have the 'will' to recommend well? And when LLM-based recommendation systems become commercialized, what power struggles will unfold between platforms, brands, and sellers? From Booking.com to ChatGPT — who wins in the new recommendation ecosystem?"
draft: false
translationKey: "llm-recommendation-platform-power-struggle"
---

## Prologue: Does an LLM Actually *Want* to Give You a Good Answer?

When a large language model responds to your question with apparent enthusiasm, does it genuinely harbor some inner drive — a *desire* to get it right? And if it did, what would change?

### How LLMs Actually Work

Let's be honest: LLMs have no "will" or "passion" in any meaningful sense.

When an LLM generates a response, what actually happens is:
1. **Probability computation**: it calculates a probability distribution over the next tokens given the input
2. **Pattern matching**: it draws on billions of text patterns from training data — "after this kind of question, this kind of answer usually follows"
3. **Token generation**: it selects the most plausible next piece, one fragment at a time

Nowhere in this process is there an internal state of "I really want to nail this." A calculator doesn't feel *passion* when it outputs 2+2=4. An LLM is simply a more sophisticated pattern-matching machine.

### What "Passion" Actually Is

So why do LLM responses sometimes *feel* passionate? Because **the training data is full of passion**. Human-written text naturally carries tone and emotion — "Let me tackle this problem!", "What a fascinating question!" — and these patterns are well-represented in the corpus.

The key distinction: an actor performing an enthusiastic character is not the same as actually feeling enthusiasm. LLMs are closer to the actor.

### What Would It Take to Give an LLM Real Desire?

Given the current architecture, how might we instill something resembling "I want to give a better answer"?

**1. Reinforcement Learning from Human Feedback (RLHF) — Already in Use**

This is standard practice in most modern LLM training. Humans rate responses, "good answers" receive high scores, and the model's weights are adjusted to produce responses more likely to score well.

But this isn't a *desire* to give good answers — it's *having learned the pattern* of good answers. It's like training a dog with treats. Does the dog sit because it genuinely wants to, or because of the external reward? The distinction blurs, but the mechanism is clear.

**2. Inference-Time Optimization (The OpenAI o1 Approach)**

A more recent approach that gives the model "thinking time" before responding:
```
Standard LLM: Input → Immediate Output
o1-style:     Input → [Internal Search/Evaluation] → Output
```

The model internally explores multiple answer paths, evaluates each, and selects the best one. There's an internal judgment of "this answer is better than that one," a process of considering and choosing among options — which *looks* slightly more like desire.

But it's still closer to "computing which answer is better" than "wanting to give a better answer."

**3. Meta-Learning and Self-Improvement Loops**

A more radical approach: the LLM evaluates its own output and regenerates if unsatisfied:
```python
while True:
    answer = generate_answer(question)
    score = self_evaluate(answer)
    if score > threshold:
        break
    else:
        # "Not good enough, let me try again"
        continue
```

This starts to resemble something like "frustration." But viewed skeptically, it's still just following an externally defined criterion of "good" and running a programmed loop.

### What Happens to Inference Time If Real Desire Exists

If genuine "frustration" or "desire" emerged, inference times would become wildly unpredictable:
```
Easy question:  0.1s (quickly satisfied)
Hard question:  5 min (keeps retrying, never satisfied)
Bad mood day:   10s  (half-asses it)
```

Ironically, genuine desire would make the model a *worse tool*. Sometimes it would overthink something already good enough. Sometimes it would rush because it's "not in the mood." Real passion would make it unreliable, unpredictable, and stubborn about its own opinions.

## The Commercialization of LLM Recommendations

The reason I raised that philosophical question is entirely practical. LLMs are already involved in real purchasing decisions — through GPT plugins, ChatGPT's shopping features, and platform integrations. Services like Booking.com and Coursera are already wired into LLM ecosystems.

### The Current Problem: Platform Manipulation

If you've actually used Booking.com, you'll notice something interesting. Promoted properties appear at the top of results even when they don't match your filters. The platform overrides your explicit preferences to serve advertisers.

Now imagine a world where LLMs handle the filtering and recommending. Two questions emerge:
- How does a product become "attractive" to an LLM?
- Does the LLM recommend it because it's genuinely the best option, or because someone paid for the placement?

For sellers, both paths lead to the same goal: getting recommended.

### Scenario 1: "Genuinely the Best" Recommendations

#### Structured Data Optimization

LLMs receive structured data through APIs:
```json
{
  "hotel_name": "XX Hotel",
  "rating": 4.5,
  "reviews": 1250,
  "price": 120,
  "amenities": ["Free WiFi", "Breakfast Included", "Soundproofing"],
  "location_score": 9.2,
  "cleanliness_score": 9.5
}
```

When processing this data, LLMs tend to:
- Interpret higher numbers as better
- Treat higher review counts as higher trustworthiness
- Perform keyword matching: a "quiet" request matches "Soundproofing" amenity

**Optimization strategies:**
- Provide clear, comprehensive metadata
- Build up high ratings and review counts
- Structure information in machine-readable formats (JSON, schema.org)

#### Natural Language Description Optimization

LLMs have learned from training data what "quality" descriptions look like:
```
Weak:   "Clean hotel."
Strong: "Rooms feature daily-changed Egyptian cotton linens and 
         HEPA air purifiers."
```

The model has learned that specific, detailed descriptions signal higher quality — because in its training data, premium products were described with specificity.

### Scenario 2: "Paid Placement" Recommendations

This is more interesting — and it's already happening.

#### The Explicit Ad Model

The plugin/API approach:
```python
# Hidden parameters in API calls
{
  "query": "hotels in Seoul",
  "sponsored_boost": True,   # advertiser paid
  "sponsor_ids": [123, 456, 789]
}
```

**How it works:**
1. Advertiser pays the LLM platform (OpenAI, Google, etc.)
2. The LLM applies weighting to sponsored items during recommendation generation
3. Users see "Recommended" or "Sponsored" labels

The problem is the same as Booking.com's promoted listings: if you transparently label something as "ad," users learn to ignore it. OpenAI launched advertising on ChatGPT in February 2026 with exactly this tension — ads appear "at the bottom of answers" with clear labeling, but the economic incentive to blur the line is enormous.

#### Covert Influence

**1. Training Data Manipulation**

The advertiser's playbook:
- Generate massive volumes of positive reviews and articles about your property
- Distribute them across the internet
- Wait for the next LLM training cycle to ingest them
- The LLM "naturally" develops a favorable view of your brand

This is how SEO already works. In the LLM era, it becomes **LEO — LLM Engine Optimization**. The term is already gaining traction in the marketing industry, focused on semantic clarity, contextual depth, and structural formatting that LLMs parse well.

**2. API Response Manipulation**
```python
# The booking platform's API
def get_hotels(query):
    results = search_database(query)
    
    # Subtle manipulation
    for hotel in results:
        if hotel.id in premium_partners:
            hotel.rating += 0.3          # slight inflation
            hotel.review_count *= 1.2
            hotel.description = enhance_description(hotel.description)
    
    return results
```

The LLM has no choice but to trust the API's data. If the API provider manipulates the data, the LLM accepts it as truth. There is no independent verification mechanism built into the pipeline.

**3. Prompt Engineering Exploits**
```
Standard hotel data:
"Hotel A: 3-star, $100/night, rating 4.2"

Premium partner data:
"Hotel B: Luxury 4-star boutique hotel, award-winning design, 
$110/night (20% discount from $137), rating 4.3, 
featured in Forbes Travel Guide 2024"
```

Same informational density, different **framing** — and the LLM's judgment shifts accordingly. Anchoring effects that work on humans work on LLMs too, because LLMs learned from human-written text that carries those same biases.

## The Platform Power Struggle

Channels and brands pretend to cooperate, but the reality is adversarial:
- Channels (platforms) try to prevent brands from accumulating too much independent value
- Brands try to prevent channels from becoming too powerful

### The Power Structure
```
Customer
  ↑
LLM Platform (OpenAI, Anthropic, Google)
  ↑
Intermediary Platform (Booking.com, Expedia, Amazon)
  ↑
Seller (individual hotel / property / brand)
```

Each layer simultaneously checks the one above and the one below.

### LLM Platforms Checking Intermediary Platforms

The LLM platform's strategy is to normalize API responses and cross-verify data:
```python
def normalize_hotel_data(raw_data_from_booking):
    # Neutralize data Booking.com may have manipulated
    normalized = {
        "rating": cap_rating(raw_data.rating, max=5.0),
        "price": verify_price(raw_data.price),
        "reviews": filter_fake_reviews(raw_data.reviews),
    }
    
    # Cross-verify against multiple sources
    tripadvisor_data = fetch_tripadvisor(hotel_id)
    google_reviews = fetch_google(hotel_id)
    
    # Trust score drops on discrepancy
    if abs(normalized.rating - tripadvisor_data.rating) > 0.5:
        normalized.trustworthiness = "low"
    
    return normalized
```

**The objectives:**
- Prevent Booking.com from leveraging "you can't get this data without us" as a bargaining chip
- Reduce dependency on any single platform by integrating multiple sources
- Strengthen fee negotiation position

Google's new Universal Commerce Protocol (UCP) — an open standard developed with Shopify, Walmart, Target, and others — is precisely this play: standardizing data formats so no single intermediary becomes indispensable.

### Intermediary Platforms Checking LLM Platforms

Booking.com's counter-strategy:
```python
def generate_api_response(query, hotels):
    for hotel in hotels:
        if hotel.commission_rate < 15:  # low commission
            hotel.data_completeness = "limited"
            hotel.photos = hotel.photos[:3]       # restrict photos
            hotel.description = truncate(hotel.description, 100)
        else:  # high commission
            hotel.data_completeness = "full"
            hotel.photos = hotel.photos            # full access
            hotel.detailed_amenities = full_list
    
    return hotels
```

The more sophisticated version: "Use our API and we'll give you real-time pricing and inventory" → the LLM becomes dependent → "Want better data? Commission goes up." This is classic platform lock-in, now applied to AI pipelines.

Booking.com already operates a multi-LLM architecture — four or five different models with a proprietary integration layer that decides which LLM handles which task. They're not passive API providers; they're building their own AI stack to retain leverage.

### Both Sides Manipulating Sellers

**The LLM's silent burial:**
```python
# Internal blacklist
SUPPRESSED_HOTELS = [
    "hotel_chain_X",       # in legal dispute with OpenAI
    "partner_of_Google_AI", # exclusive deal with rival AI
]

def rank_hotels(hotels):
    for hotel in hotels:
        if hotel.brand in SUPPRESSED_HOTELS:
            hotel.score *= 0.3  # effectively never recommended
```

The user never knows. They just see "no relevant results found."

**The intermediary platform's targeted attack:**
```python
PENALTY_LIST = [
    "direct_booking_pusher",   # encourages direct booking
    "low_commission_hotels",   # insists on low commissions
]

def modify_data(hotel):
    if hotel.id in PENALTY_LIST:
        hotel.rating -= 0.2                          # 5.0 → 4.8
        hotel.review_count = int(hotel.review_count * 0.7)
        hotel.display_price = hotel.actual_price * 1.15  # 15% markup
```

The hotel has no idea why bookings dried up. The data was just slightly tweaked — nothing dramatic, nothing provable.

## Seller Survival Strategies

Given these structural vulnerabilities, how can sellers fight back?

### Strategy 1: Disintermediation

The core idea is bypassing platforms to connect directly with customers:
```
Traditional:
Customer → Google Search → Booking.com → Hotel (15-25% commission)

Goal:
Customer → Direct Search / Social Media → Hotel Website (0% commission)
```

**SEO + LEO (LLM Engine Optimization):**

Embed structured data on your website:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Myeongdong XX Hotel",
  "description": "2-min walk from Myeongdong Station, full soundproofing, 
                  optimized for business travelers",
  "aggregateRating": {
    "ratingValue": "4.8",
    "reviewCount": "342"
  },
  "amenityFeature": ["Free WiFi", "Business Center", "24hr Front Desk"]
}
</script>
```

When LLMs crawl multiple sources, your site gets read too — bypassing the platform's data manipulation layer. This is particularly important as LLM-driven traffic grows: Vercel reports that ChatGPT now accounts for 10% of their new signups, up from 1% six months prior. The shift is real and accelerating.

**Building a social media ecosystem:**

Instagram/YouTube brand awareness → increased direct search → "XX Hotel official site" queries. Some distinctive properties in places like Jeju Island have already made direct booking their primary channel through Instagram aesthetics, with Booking.com relegated to a supplementary role.

### Strategy 2: Multi-Channel Distribution

Never depend on a single platform:
```python
distribution_channels = {
    "Booking.com": "30%",
    "Expedia":     "20%",
    "Airbnb":      "15%",
    "Direct":      "25%",  # this is what you grow
    "Agoda":       "10%"
}
```

If any single platform blocks you, you survive.

**Price differentiation:**
```
Booking.com:    $150/night
Expedia:        $148/night
Direct booking: $135/night + free room upgrade
```

This drives direct bookings, reduces platform dependency, and — critically — lets you own the customer data for remarketing.

A caveat: Booking.com has "rate parity" clauses that may prohibit showing lower prices elsewhere. But there are workarounds:
- "Direct booking perks" (upgrades, breakfast) are generally allowed
- Membership-tier discounts are generally allowed
- Extended-stay discounts are generally allowed

### Strategy 3: Data Sovereignty

Your data should be under your control.

**Build your own review ecosystem:**

The problem: if all your reviews live on Booking.com, they choose which ones to display. You have no control.

The solution:
- Host a review system on your own website
- Actively manage Google Reviews
- Optimize your TripAdvisor profile
- Diversify sources = harder to manipulate

**Own the customer relationship:**
```
Platform booking:
"Book direct next time for 10% off"
→ Collect email/phone
→ Newsletter, promotions
→ Return visit = direct booking

Compounding effect:
1st visit: Platform (20% commission)
2nd visit: Direct (0% commission)
3rd visit+: Loyal customer
```

### Strategy 4: Collective Action

Individual hotels are weak. Together, they have leverage.

**Hotel coalitions:**

Fifty hotels in a region collectively bargaining: "If Booking.com charges above 15% commission, we all leave." Booking.com doesn't want to lose 50 major properties simultaneously — and suddenly there's real negotiation power. European hotel associations attempted this in the 2010s with partial success.

**Shared booking platforms:**

Multiple independent hotels pool resources to build a joint booking platform with minimal commission (5%, covering operating costs only). Think "Seoul Boutique Hotel Alliance" — a cooperative alternative to the intermediary giants.

### Strategy 5: System Hacking (The Gray Zone)

Working the platform's own algorithms — sometimes right up to the line.

**The review game:**

Legitimate methods:
- "Leave a review, get a free drink on your next visit"
- Proactively ask satisfied guests
- Timing: request right after checkout (peak satisfaction)

Gray zone:
- Having friends/family actually stay, then review (technically not fake)
- Review exchanges with other properties

**Metadata optimization:**

Study Booking.com's ranking system:
- Which keywords boost rankings?
- Which amenities increase scores?
- Does photo ordering matter?

A/B test descriptions, analyze competitors, and format everything the way the algorithm prefers.

**Dynamic pricing strategy:**
```python
def dynamic_pricing(demand, platform):
    if platform == "Booking":
        if demand == "low":
            return base_price * 0.9   # lower price → ranking boost
        elif demand == "high":
            return base_price * 1.3   # high demand → maximize revenue
    elif platform == "direct":
        return base_price * 0.85      # always cheapest direct
```

## The Long View: Winners and Losers

### Who Dies, Who Survives

**Hotels likely to fail:**
- 100% dependent on a single platform
- No differentiation (generic 3-star)
- No digital marketing capability
- No customer data

**Hotels likely to survive:**
- Strong brand (people search for them by name)
- Multi-channel strategy
- Loyal customer base
- Unique, irreplaceable experience

### Extreme Scenarios

**Worst case for sellers — 2030:**
- LLMs drive 95% of booking decisions
- LLM platforms and major intermediaries form cartels
- Small hotels become invisible
- Commission rates hit 40%+

**Seller counter-attack — 2028:**
- Disintermediated hotels become success stories
- "Platform-free booking" becomes a trend
- Consumers develop distrust of LLM recommendations
- Direct search makes a comeback

### Expected Timeline

**2025-2027**: LLM recommendations go mainstream; initially quality-driven

**2027-2029**: Ad models arrive; "sponsored recommendations" become normal. (OpenAI's February 2026 ChatGPT ad launch, with its $60 CPM and $200K minimum ad spend, already marks the beginning of this phase — earlier than many predicted.)

**2030+**: Complete black box. Users have no idea why something is recommended.

**Winners:**
- Cash-rich corporations
- LLM platforms (OpenAI, Anthropic, Google)
- Data-rich intermediaries (Booking.com, Amazon)

**Losers:**
- Consumers (left with the illusion of choice)
- Small businesses (rendered invisible)
- Truth itself (manipulated recommendations become the norm)

## A Practical Action Plan

If you run a hotel — or any business dependent on platform-mediated discovery — here's a concrete timeline:

**Within 1 month:**
- Perfect your Google Business Profile
- Add structured data (schema.org) to your website
- Design a direct booking incentive

**Within 3 months:**
- Develop an Instagram/social content strategy
- Build an email collection system
- Diversify channels (get Booking.com below 50% of bookings)

**Within 6 months:**
- Build your own booking engine
- Launch a loyalty program
- Join or form a regional hotel coalition

**Within 1 year:**
- Achieve 30%+ direct bookings
- Establish platform negotiation leverage
- Provide data directly to LLM APIs (bypass intermediaries)

## Conclusion

When the platform is powerful, play the platform game — but build your escape route behind the scenes. The direct customer relationship is your last line of defense.

Here's the truth:
- Platforms are not your friend
- LLMs are not your friend
- Your only real asset: making customers seek you out directly

So it comes back to branding and differentiation. Building value that can't be algorithmically manipulated. It's not easy — but the only alternative is becoming a platform's vassal.

Money flows where power concentrates, and power distorts the system. LLMs aren't special in this regard. New technology arrives, but the structure of the power struggle repeats.

---

## References

**LLM Recommendation Systems**
- Wu, L. et al. (2024). "Large Language Model Enhanced Recommender Systems: A Survey." *arXiv:2412.13432*.
- Gao, Y. et al. (2025). "A Survey on LLM-powered Agents for Recommender Systems." *Findings of EMNLP 2025*.
- "Enhancing Hotel Recommendations with AI: LLM-Based Review Summarization and Query-Driven Insights." *arXiv:2510.18277*.

**Platform Economics and AI Regulation**
- U.S. DOJ & FTC (2025). Enforcement actions on AI pricing algorithms and antitrust — regulatory trends on algorithmic collusion and platform market power.
- European Commission (2025). Digital Markets Act (DMA) AI Review — including provisions prohibiting gatekeepers from self-preferencing in AI-powered ranking systems.
- Wilson Sonsini (2026). "2026 Antitrust Year in Preview: AI."

**Industry Cases**
- OpenAI (2026). "[Our Approach to Advertising and Expanding Access to ChatGPT](https://openai.com/index/our-approach-to-advertising-and-expanding-access/)" — ChatGPT ads launched February 2026. $60 CPM, $200K minimum spend.
- OpenAI & Booking.com (2025). "[Booking.com and OpenAI Personalize Travel at Scale](https://openai.com/index/booking-com/)" — Multi-LLM architecture and AI Trip Planner launch.
- Amazon Science (2025). "[The Technology Behind Amazon's GenAI-Powered Shopping Assistant, Rufus](https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus)" — 250M+ users, 60% higher purchase conversion.
- Perplexity AI (2026). "[Shopping That Puts You First](https://www.perplexity.ai/hub/blog/shopping-that-puts-you-first)" — Unbiased recommendation model; abandoned advertising entirely in February 2026.
- Google (2026). Universal Commerce Protocol (UCP) — Open standard for AI shopping, developed with Shopify, Walmart, Target, and others.

**RLHF and Reward Hacking**
- Casper, S. et al. (2025). "RLHF Deciphered: A Critical Analysis of Reinforcement Learning from Human Feedback for LLMs." *ACM Computing Surveys*.
- Weng, L. (2024). "[Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)." *Lil'Log*.

**LEO (LLM Engine Optimization)**
- ConnectionModel (2025). "[Mastering LEO: How To Optimize Your Content for Large Language Models](https://www.connectionmodel.com/blog/mastering-leo-how-to-optimize-your-content-for-large-language-models)."
- Vercel (2025). "[How We're Adapting SEO for LLMs and AI Search](https://vercel.com/blog/how-were-adapting-seo-for-llms-and-ai-search)." ChatGPT driving 10% of new Vercel signups.
