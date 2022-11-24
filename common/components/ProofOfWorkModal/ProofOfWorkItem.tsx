import React from "react";
import ParsedToken from "@/common/components/ParsedToken";
import useParseTokenFromWei from "@/common/hooks/useParseTokenFromWei";
import { Button, Tag } from "antd";
import { DollarCircle } from "iconsax-react";
import { useRouter } from "next/router";

interface proofProps {
  data?: any;
}

const ProofOfWorkItem = ({ data }: proofProps) => {
  const router = useRouter();
  const fixedAmountFormat = useParseTokenFromWei(data?.fixed_amount, data?.token_address);
  const goToDetail = () => {
    router.push(`/bounty-task/${data?._id}`);
  };
  return (
    <div className="border-solid border-[#D8D4E] border rounded-lg p-4">
      <div className="mb-4">
        <div className="font-medium">{data?.title}</div>
        <div className="text-sm font-medium">Created by {data?.owner?.display_name}</div>
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
      </div>
      <div className="mb-4">
        {data?.skills?.map((item: {name: string}, index: number) => (
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
export default ProofOfWorkItem;
