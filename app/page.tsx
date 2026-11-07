import Portfolio from "@/components/portfolio";
import { portfolioData } from "@/lib/portfolio-data";

export default function Home() {
  return <Portfolio data={portfolioData} />;
}
