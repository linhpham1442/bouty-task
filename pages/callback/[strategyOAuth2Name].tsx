import useCallbackOAuth2, { strategyName } from "@/common/hooks/useCallbackOAuth2";
import { Loader } from "@mantine/core";
import { useRouter } from "next/router";

export interface IGoogleCallbackPageProps {}

function GoogleCallbackPage(props: IGoogleCallbackPageProps) {
  const { query } = useRouter();
  const { strategyOAuth2Name = "" } = query;

  useCallbackOAuth2(strategyOAuth2Name as strategyName);
  return (
    <div style={{ minHeight: 400 }}>
      <Loader className="z-[9999] absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2" size="xl" />
    </div>
  );
}

export default GoogleCallbackPage;
