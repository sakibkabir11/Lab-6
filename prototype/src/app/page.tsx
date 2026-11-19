import { loadWorkspace } from "@/app/actions";
import SplitSmartApp from "@/components/splitsmart-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadWorkspace();
  return <SplitSmartApp initialData={data} />;
}
