---
title: "Diving into AI Watermarks"
date: 2025-10-20T12:00:00+09:00
tags: ["ai", "watermarks", "safety", "alignment", "red-teaming"]
description: "AI 워터마크 기술의 작동 원리부터 최신 연구, 안전성 및 정렬성 관점, 그리고 적대적 테스트 사례를 탐구한 대화 요약."
draft: false
---

# AI 워터마크의 비밀 탐구: Nano Banana부터 Red Teaming까지

최근 AI 생성 콘텐츠의 진위성을 확인하는 워터마크 기술에 대한 관심이 높아지고 있습니다. 이 포스트에서는 Google의 Nano Banana 이미지 생성 도구에서 시작해 OpenAI의 접근 방식, 최신 연구 동향, AI 안전성 및 정렬성 관점, 그리고 red teaming 사례까지를 다룹니다. 이는 AI 윤리와 실용성을 이해하는 데 중요한 인사이트를 제공합니다.

## Nano Banana 워터마크의 발견과 작동 원리

Nano Banana(Google Gemini 앱의 AI 이미지 생성 모델)에서 생성된 이미지를 과$$포화 처리하면 숨겨진 격자 패턴이 드러난다는 Reddit 포스트가 화제가 되었습니다. 이 패턴은 Google의 SynthID 워터마크로, 픽셀 수준에서 미세한 노이즈를 삽입해 인간 눈에는 보이지 않게 숨겨집니다. 스테가노그래피 기법을 활용하며, 크롭이나 압축에도 강하지만, 포화도 조절 같은 편집으로 쉽게 드러나거나 제거될 수 있습니다.

텍스트 출력에서도 SynthID가 적용되는데, 토큰 선택 확률을 조작해 자연스러운 패턴을 만듭니다. 이는 AI 생성 텍스트를 검출하는 데 유용하지만, 짧은 텍스트나 재작성 시 약해집니다. 예를 들어, Hugging Face 라이브러리로 워터마크 점수를 계산할 수 있습니다.

## OpenAI의 워터마크 기술

OpenAI는 텍스트, 이미지, 오디오, 비디오에 걸쳐 워터마크를 개발 중입니다. 텍스트에서는 토큰 확률 조작과 특수 유니코드 문자(U+202F)를 사용해 신호를 임베딩하지만, 파라프레이징으로 우회 가능합니다. 이미지(DALL-E)에서는 C2PA 메타데이터를 활용해 출처와 수정 이력을 기록하며, 98% 정확도의 분류기를 결합합니다.

오디오와 비디오(Sora)에서도 tamper-resistant 신호를 삽입하지만, 메타데이터 제거가 쉽다는 한계가 있습니다. OpenAI는 공개를 주저하며, false positive와 alignment 저하를 우려하고 있습니다.

## 최신 연구 방향: 강화와 취약점 탐구

2025년 연구는 워터마크의 강인성을 높이는 데 초점 맞춰져 있습니다. UnMarker 도구처럼 99% 제거 성공률을 보이는 우회 기술이 등장하며, 'arms race' 양상을 띠고 있습니다. 텍스트와 멀티모달 워터마크 강화, C2PA 표준화가 주요 트렌드입니다.

AI safety 관점에서 워터마크는 misinformation 방지에 기여하지만, 취약점이 신뢰를 떨어뜨릴 수 있습니다. Alignment 측면에서는 워터마크 삽입이 모델 응답 품질을 10-20% 저하시킬 수 있어 trade-off가 존재합니다. EU AI Act처럼 규제가 워터마크 의무화를 촉진하고 있습니다.

## Red Teaming 사례: 취약점 테스트의 실전

Red teaming은 워터마크의 취약점을 시뮬레이션합니다. NeurIPS 2024 대회에서 2,722개 제출물이 워터마크를 90% 우회하는 사례를 드러냈습니다. OpenAI의 하이브리드 접근은 30-50분 만에 취약점을 발견합니다.

Microsoft의 100개 GenAI 제품 테스트에서는 prompt injection으로 텍스트 워터마크를 우회하는 사례가 많았습니다. Biden AI 행정명령도 red teaming을 의무화하며, 지속적 테스트의 필요성을 강조합니다. 이는 워터마크를 'security theater'가 아닌 실효적 도구로 만드는 데 기여합니다.

## 결론: AI 워터마크의 미래

AI 워터마크는 딥페이크 시대의 필수 도구지만, 우회와 alignment 문제로 완벽하지 않습니다. 지속적 연구와 표준화가 핵심입니다. 이 기술을 이해하면 AI 윤리를 더 잘 다룰 수 있을 것입니다.

---

출처: 
- https://www.reddit.com/r/nanobanana/comments/1o1tvbm/nano_bananas_watermark/
- https://civitai.com/posts/23540958 (ComfyUI 워크플로)
- Google SynthID 관련: https://deepmind.google/technologies/synthid/
- OpenAI 워터마크 연구: https://openai.com/research/watermarking
- UnMarker 도구: Waterloo University 연구 (arXiv 검색 추천)
- NeurIPS 2024 대회: https://neurips.cc/Conferences/2024/
- Microsoft Red Teaming 논문: https://arxiv.org/ (검색: "Lessons From Red Teaming 100 Generative AI Products")