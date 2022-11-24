import { getBountyTaskList } from "@/common/api/bountyTask";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { BountyTask, FetchReducer, ListResponse } from "@/common/types";
import { Empty, Input, Pagination, Spin } from "antd";
import { Bookmark, SearchNormal1 } from "iconsax-react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import BountyTaskItem from "./BountyTaskItem";

const BountyTaskList = (): JSX.Element => {
  const { data, loading } = useAppSelector<ListResponse<{ data: BountyTask[]; count: number }> & FetchReducer>(
    selectValue(types.listBountyTask)
  );
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const { category_id } = router.query;

  const reloadData = (searchText: string, page: number) => {
    dispatch(fetchData(types.listBountyTask, getBountyTaskList(page, 18, searchText, category_id?.toString())));
  };

  const handleChange = debounce((searchText: string, page: number) => {
    setSearchText(searchText);
    reloadData(searchText, page);
  }, 500);

  useEffect(() => {
    dispatch(fetchData(types.listBountyTask, getBountyTaskList(1, 18, "", category_id?.toString())));
  }, [dispatch, category_id]);

  return (
    <div className="px-10 my-4 bg-white">
      <div className="flex items-center justify-between mt-10 mb-10">
        <div className="flex font-semibold text-black">
          <Bookmark className="mr-2" /> {data?.count ?? 0} open tasks
        </div>
        <Input
          placeholder="Find hundreds of potential tasks and get bounties"
          prefix={<SearchNormal1 size={14} />}
          defaultValue={searchText}
          onChange={(e) => handleChange(e.target.value, 1)}
          style={{ width: 476 }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center w-full h-48 item-center">
          <Spin />
        </div>
      ) : (
        <>
          {data?.data?.length > 0 ? (
            <div className="grid grid-cols-3 gap-8">
              {data?.data.map((item) => (
                <BountyTaskItem key={item?._id} data={item} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
          <div>
            {data?.count > 0 && (
              <div className="flex justify-center mt-16">
                <Pagination total={data?.count} pageSize={18} onChange={(value) => handleChange(searchText, value)} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(BountyTaskList);
