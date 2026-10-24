import HomePage from "@/features/logs/pages/HomePage";
import NextSteps from "@/features/health/components/NextSteps";
import QuickAdd from "@/features/health/components/QuickAdd";
import TrendCard from "@/features/health/components/TrendCard";

export default function Page() {
  return (
    <>
      <HomePage />
      <NextSteps />
      <QuickAdd />
      <TrendCard />
    </>
  );
}
