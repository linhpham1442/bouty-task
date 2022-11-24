import { BountyTask, FetchReducer, ListResponse } from "@/common/types";
import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";

import { ArrowRight } from "iconsax-react";
import BountyTaskItem from "../BountyTaskList/BountyTaskItem";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { TutorialDoc } from "@/pages/tutorials/TutorialDoc";
import { TutorialGit } from "../../pages/tutorials/TutorialGit";
import { TutorialVideo } from "@/pages/tutorials/TutorialVideo";
import Tutorials from "../../pages/tutorials/index";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { getBountyTaskList } from "@/common/api/bountyTask";
import { selectValue } from "@/common/redux/utils";
import types from "@/common/redux/types";

const TopTaskList = (): JSX.Element => {
  const { data, loading } = useAppSelector<ListResponse<{ data: BountyTask[]; count: number }> & FetchReducer>(
    selectValue(types.listTopBountyTask)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData(types.listTopBountyTask, getBountyTaskList(1, 9, "", null, null, "fixed_amount")));
  }, [dispatch]);

  return (
    <div className="block w-full max-w-[1100px] mx-auto">
      <div className="px-10 my-4">
        <div className="mb-10 text-center">
          <h1 className="flex items-center justify-center text-2xl font-bold lg:text-4xl">
            <div className="w-[45px] mr-2">
              <Image src="/svg/icons/icon-quality.svg" alt="quality" width="50px" height="50px" layout="responsive" />
            </div>
            TOP TASKS
          </h1>
          <div className="max-w-[900px] mx-auto lg:text-2xl text-[#6C6684] leading-tight	mt-4">
            Spinel Task is a blockchain task platform that connects millions of people to new opportunities to differentiate yourself from
            your competitors and produce output at higher caliber.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {data.data?.length > 0 ? data?.data.map((item) => <BountyTaskItem key={item?._id} data={item} />) : null}
        </div>
        <div className="mt-10 text-center">
          <Link href="/bounty-task">
            <Button size="large" type="primary">
              <div className="flex items-center">
                <span className="font-medium">Explore more tasks</span>
                <ArrowRight size={20} className="ml-2" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(TopTaskList);
