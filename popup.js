// Briecheeze - popup.js
// The one and only Helena is here!

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  console.log("팝업 스크립트 로드. 현재 상태를 불러옵니다.");

  // 저장된 설정 값을 불러와 토글 스위치에 반영
  chrome.storage.local.get('isEnabled', (data) => {
    // 저장된 값이 없거나(undefined) true일 경우 활성화
    const isEnabled = data.isEnabled !== false;
    toggleSwitch.checked = isEnabled;
    console.log(`현재 설정값: ${isEnabled}, 스위치 상태: ${toggleSwitch.checked}`);
  });

  // 토글 스위치 값이 변경될 때 이벤트 처리
  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    console.log(`스위치 변경됨. 새로운 상태: ${isEnabled}`);

    // 변경된 값을 스토리지에 저장하고 백그라운드 스크립트에 메시지 전송
    chrome.runtime.sendMessage({ isEnabled: isEnabled }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("메시지 전송 오류:", chrome.runtime.lastError.message);
      } else {
        console.log("백그라운드로부터 응답:", response);
      }
    });
  });
});