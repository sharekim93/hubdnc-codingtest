import React, { useState } from "react";

interface Pizza {
  id: number;
  status: "ready" | "cooking" | "completed";
}

const PizzaMaker = () => {
  const totalPizzas = 100; // 총 피자 수
  const [completedPizzas, setCompletedPizzas] = useState<Pizza[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workerCount, setWorkerCount] = useState(5); // 알바생 수 (기본값 5명)

  // 피자 만들기 API 호출
  const makePizza = async (id: number): Promise<Pizza> => {
    try {
      const response = await fetch("https://dough.pizza.com/makePizza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pizzaId: id }),
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      // 피자에 대한 데이터가 있다면 처리
      const data = await response.json();

      return {
        id,
        status: "completed",
      };
    } catch (error) {
      throw error;
    }
  };

  // 피자를 그룹으로 처리하는 함수
  const processPizzaGroup = async (pizzaIds: number[]) => {
    const pizzaPromises = pizzaIds.map(async (pizzaId) => {
      try {
        const pizza = await makePizza(pizzaId);
        setCompletedPizzas((prev) => [...prev, pizza]);
        return pizza;
      } catch (error) {
        console.error(`피자 ID ${pizzaId} 처리 중 오류:`, error);
        throw error;
      }
    });

    return Promise.all(pizzaPromises);
  };

  // 그룹 단위로 피자 만들기 (모든 그룹을 병렬로 처리)
  const makeAllPizzas = async () => {
    setIsProcessing(true);
    setCompletedPizzas([]);

    // 모든 피자 ID 생성
    const allPizzaIds = Array.from({ length: totalPizzas }, (_, i) => i + 1);

    // 알바생 수에 따라 그룹 나누기
    const pizzaGroups = [];
    for (let i = 0; i < allPizzaIds.length; i += workerCount) {
      pizzaGroups.push(allPizzaIds.slice(i, i + workerCount));
    }

    try {
      // 모든 그룹을 병렬로 처리
      const groupPromises = pizzaGroups.map((group) =>
        processPizzaGroup(group)
      );
      await Promise.all(groupPromises);
    } catch (error) {
      console.error("피자 제작 중 오류 발생:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        피자 대량 주문 시스템
      </h1>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <label htmlFor="workerCount" className="mr-3 font-medium">
            알바생 수:
          </label>
          <input
            id="workerCount"
            type="number"
            min="1"
            max="20"
            value={workerCount}
            onChange={(e) =>
              setWorkerCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="border border-gray-300 rounded px-3 py-1 w-20 text-center"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={makeAllPizzas}
            disabled={isProcessing}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            피자만들기
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-medium mb-2">상태 변수:</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="font-medium">totalPizzas:</div>
          <div>{totalPizzas}</div>

          <div className="font-medium">workerCount:</div>
          <div>{workerCount}</div>

          <div className="font-medium">isProcessing:</div>
          <div>{isProcessing ? "true" : "false"}</div>

          <div className="font-medium">completedPizzas.length:</div>
          <div>{completedPizzas.length}</div>

          <div className="font-medium">그룹 수:</div>
          <div>{Math.ceil(totalPizzas / workerCount)}</div>
        </div>
      </div>
    </div>
  );
};

export default PizzaMaker;
