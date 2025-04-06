// 이미지 크기를 조정하는 함수
function fixImageSizes() {
  // 모든 이미지 선택
  const images = document.querySelectorAll("img");

  // 각 이미지에 스타일 적용
  images.forEach((img) => {
    img.style.maxWidth = "100%";
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "2rem auto";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    img.style.outline = "2px solid red"; // 디버깅용 테두리

    // 부모 요소의 너비를 제한
    if (img.parentElement) {
      img.parentElement.style.maxWidth = "100%";
      if (img.parentElement.tagName.toLowerCase() === "p") {
        img.parentElement.style.width = "100%";
        img.parentElement.style.margin = "2rem auto";
      }
    }

    // 이미지 로드 완료 후 크기 조정 재확인
    img.onload = function () {
      this.style.maxWidth = "100%";
      this.style.width = "100%";
    };
  });
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", fixImageSizes);

// 동적으로 추가된 이미지 처리를 위한 MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      fixImageSizes();
    }
  });
});

// 페이지 로드 후 관찰 시작
window.addEventListener("load", () => {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 페이지 완전 로드 후 한번 더 실행
  setTimeout(fixImageSizes, 500);
});
