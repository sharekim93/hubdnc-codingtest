import { useState } from "react";

// 청소 상태 ENUM
const CLEANING_STATUS = {
  READY: "READY", // 준비
  IN_PROGRESS: "IN_PROGRESS", // 진행중
  COMPLETED: "COMPLETED", // 완료
};

export default function CleaningStatus() {
  const [order, setOrder] = useState(false); // "청소해주세요" (주문)
  const [brush, setBrush] = useState(CLEANING_STATUS.READY); // "빗자루"
  const [mop, setMop] = useState(CLEANING_STATUS.READY); // "걸레"
  const [talk, setTalk] = useState({
    // "다했어요" (말하기)
    brush: false,
    mop: false,
  });
  const [clear, setClear] = useState(false); // "끝" (종료)

  // 청소주문 버튼 클릭 핸들러 - 토글 기능
  const handleOrder = () => {
    if (clear) return; // clear가 true이면 더 이상 상태 변경 불가

    setOrder(!order);
    if (!order) {
      // 주문을 시작할 때 청소 상태를 IN_PROGRESS로 변경
      setBrush(CLEANING_STATUS.IN_PROGRESS);
      setMop(CLEANING_STATUS.IN_PROGRESS);
    } else {
      // 주문을 취소할 때 초기 상태로 리셋
      setBrush(CLEANING_STATUS.READY);
      setMop(CLEANING_STATUS.READY);
      setTalk({ brush: false, mop: false });
    }
  };

  // 빗자루 청소 버튼 클릭 핸들러
  const handleBrushStatus = () => {
    if (clear) return; // clear가 true이면 더 이상 상태 변경 불가

    if (brush === CLEANING_STATUS.IN_PROGRESS) {
      setBrush(CLEANING_STATUS.COMPLETED);
      setTalk((prev) => ({ ...prev, brush: true }));
    } else if (brush === CLEANING_STATUS.COMPLETED) {
      setBrush(CLEANING_STATUS.IN_PROGRESS);
      setTalk((prev) => ({ ...prev, brush: false }));
    }
  };

  // 걸레 청소 버튼 클릭 핸들러
  const handleMopStatus = () => {
    if (clear) return; // clear가 true이면 더 이상 상태 변경 불가

    if (mop === CLEANING_STATUS.IN_PROGRESS) {
      setMop(CLEANING_STATUS.COMPLETED);
      setTalk((prev) => ({ ...prev, mop: true }));
    } else if (mop === CLEANING_STATUS.COMPLETED) {
      setMop(CLEANING_STATUS.IN_PROGRESS);
      setTalk((prev) => ({ ...prev, mop: false }));
    }
  };

  // 다했어요 버튼 클릭 핸들러 - clear를 true로 변경 (토글 아님)
  const handleAllDone = () => {
    if (talk.brush && talk.mop && !clear) {
      setClear(true);
    }
  };

  // 버튼 텍스트 생성 함수
  const getBrushButtonText = () => {
    if (!order) return "빗자루 청소";
    switch (brush) {
      case CLEANING_STATUS.READY:
        return "빗자루 청소 준비";
      case CLEANING_STATUS.IN_PROGRESS:
        return "빗자루 청소완료";
      case CLEANING_STATUS.COMPLETED:
        return "빗자루 청소취소";
      default:
        return "빗자루 청소";
    }
  };

  const getMopButtonText = () => {
    if (!order) return "걸레 청소";
    switch (mop) {
      case CLEANING_STATUS.READY:
        return "걸레 청소 준비";
      case CLEANING_STATUS.IN_PROGRESS:
        return "걸레 청소완료";
      case CLEANING_STATUS.COMPLETED:
        return "걸레 청소취소";
      default:
        return "걸레 청소";
    }
  };

  // 버튼 스타일 생성 함수
  const getBrushButtonStyle = () => {
    if (!order || clear) return "bg-gray-300 cursor-not-allowed";
    switch (brush) {
      case CLEANING_STATUS.READY:
        return "bg-green-300 text-white cursor-not-allowed";
      case CLEANING_STATUS.IN_PROGRESS:
        return "bg-green-500 text-white hover:bg-green-600";
      case CLEANING_STATUS.COMPLETED:
        return "bg-green-700 text-white hover:bg-green-800";
      default:
        return "bg-gray-300 cursor-not-allowed";
    }
  };

  const getMopButtonStyle = () => {
    if (!order || clear) return "bg-gray-300 cursor-not-allowed";
    switch (mop) {
      case CLEANING_STATUS.READY:
        return "bg-yellow-300 text-white cursor-not-allowed";
      case CLEANING_STATUS.IN_PROGRESS:
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case CLEANING_STATUS.COMPLETED:
        return "bg-yellow-700 text-white hover:bg-yellow-800";
      default:
        return "bg-gray-300 cursor-not-allowed";
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">청소 상태 관리</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleOrder}
          disabled={clear}
          className={`px-4 py-2 rounded transition-colors ${
            clear
              ? "bg-gray-300 cursor-not-allowed"
              : order
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {order ? "청소 취소" : "청소해주세요"}
        </button>

        <button
          onClick={handleBrushStatus}
          disabled={!order || brush === CLEANING_STATUS.READY || clear}
          className={`px-4 py-2 rounded transition-colors ${getBrushButtonStyle()}`}
        >
          {getBrushButtonText()}
        </button>

        <button
          onClick={handleMopStatus}
          disabled={!order || mop === CLEANING_STATUS.READY || clear}
          className={`px-4 py-2 rounded transition-colors ${getMopButtonStyle()}`}
        >
          {getMopButtonText()}
        </button>

        <button
          onClick={handleAllDone}
          disabled={!talk.brush || !talk.mop || clear}
          className={`px-4 py-2 rounded transition-colors ${
            !talk.brush || !talk.mop || clear
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          {clear ? "완료됨" : "다했어요"}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">현재 상태:</h2>
        <ul className="space-y-1">
          <li>청소해주세요 (order): {order.toString()}</li>
          <li>빗자루 (brush): {brush}</li>
          <li>걸레 (mop): {mop}</li>
          <li>
            다했어요 (talk):
            <ul className="ml-4">
              <li>빗자루 보고: {talk.brush.toString()}</li>
              <li>걸레 보고: {talk.mop.toString()}</li>
            </ul>
          </li>
          <li className="font-bold text-lg mt-2">
            끝 (clear): {clear.toString()}
          </li>
        </ul>
      </div>
    </div>
  );
}
