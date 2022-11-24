import { countTaskByBountyTask } from "@/common/api/task";
import ParsedToken from "@/common/components/ParsedToken";
import useParseTokenFromWei from "@/common/hooks/useParseTokenFromWei";
import { BountyTask } from "@/common/types";
import { handleApi } from "@/common/utils";
import { Tag, Button } from "antd";
import { formatDistance } from "date-fns";
import { Clock, DollarCircle, Key, People } from "iconsax-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface BountyTaskItemProps {
  data: BountyTask;
}

const BountyTaskItem = ({ data }: BountyTaskItemProps): JSX.Element => {
  const router = useRouter();
  const [currentTaskClaimed, setCurrentTaskClaimed] = useState(0);
  const fixedAmountFormat = useParseTokenFromWei(data?.fixed_amount, data?.token_address);

  const goToDetail = () => {
    router.push(`/bounty-task/${data?._id}`);
  };

  const fetchCurrentTaskClaimed = async (id: string) => {
    try {
      const { success, data: dataResponse } = await handleApi(countTaskByBountyTask(id), true);

      if (success) {
        setCurrentTaskClaimed(dataResponse?.data || 0);
      }
    } catch (error) {
      console.log("fetchCurrentTaskClaimed", error);
    }
  };

  useEffect(() => {
    if (data?._id) {
      fetchCurrentTaskClaimed(data?._id);
    }
  }, [data?._id]);

  return (
    <div className="border-solid border-[#D8D4E] border rounded-lg p-4 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.16)] transition-all">
      <div className="mb-4">
        <div className="font-medium">{data?.title}</div>
        <div className="text-xs text-[#8F8C9C]">
          Posted{" "}
          {formatDistance(new Date(data?.created_at), new Date(), {
            addSuffix: true,
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 ">
        <div>
          <div className="flex items-center">
            <DollarCircle size={16} color="#34C77B" className="mr-1" />
            <span className="text-xs text-[#6C6684]">Fixed price</span>
          </div>
          <div className="text-sm font-medium">
            <span className="mr-1">{fixedAmountFormat}</span>
            <ParsedToken
              address={data?.token_address}
              chainId={data?.chain_id}
              showSymbol={false}
              showName={true}
              defaultNullAddressAsNative
            />
          </div>
        </div>
        <div>
          <div className="flex items-center text-base">
            <Clock size={16} color="#EB5757" className="mr-1" />
            <span className="text-xs text-[#6C6684]">Duration</span>
          </div>
          <div className="text-sm font-medium">
            {data?.duration} {data?.duration_type}
          </div>
        </div>
        <div>
          <div className="flex items-center text-base">
            <Key size={16} color="#FF9900" className="mr-1" />
            <span className="text-xs text-[#6C6684]">Entry</span>
          </div>
          <div className="text-sm font-medium">{data?.type_work_entry === 0 ? "Everyone can join" : "Apply to join"}</div>
        </div>
        <div>
          <div className="flex items-center text-base">
            <People size={16} color="#F367FF" className="mr-1" />
            <span className="text-xs text-[#6C6684]">Headcount</span>
          </div>
          <div className="text-sm font-medium">
            {currentTaskClaimed}/{data?.max_headcount} contributors
          </div>
        </div>
      </div>
      <div className="mb-4">
        {data?.skills?.map((item, index) => (
          <Tag key={index} className="px-2 py-1 mb-1 mr-1 font-medium text-xs rounded-[100px] text-[#3D2E7C]" color="#EFF0FF">
            {item?.name}
          </Tag>
        ))}
      </div>
      <Button type="primary" className="pl-5 pr-5" onClick={goToDetail}>
        See more
      </Button>
    </div>
  );
};

export default BountyTaskItem;
