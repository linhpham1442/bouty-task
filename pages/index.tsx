import { Loader } from "@mantine/core";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/top-tasks");
  }, [router]);

  return (
    <div style={{ minHeight: 400 }}>
      <Loader className="z-[9999] absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2" size="xl" />
    </div>
  );
};

export default Home;
