import type { Route } from "./+types/home";
import Cleaning from "~/components/Cleaning";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "청소상태관리 - 프론트엔드 김나눔" },
    { name: "description", content: "청소상태를 관리합니다" },
  ];
}

export default function Home() {
  return <Cleaning />;
}
