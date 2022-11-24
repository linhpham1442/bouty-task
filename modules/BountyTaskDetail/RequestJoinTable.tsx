import { Table } from "antd";
import { memo, useEffect } from "react";
import { useRequestJoinColumns } from "./columns";
import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { BountyTask, FetchReducer, ListResponse, TaskRequestJoin } from "@/common/types";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { getRequestJoinTaskList } from "@/common/api/taskRequestJoin";

interface RequestJoinProps {
  activeTab: string;
}

const RequestJoinTable: React.FC<RequestJoinProps> = ({ activeTab }) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useAppSelector<ListResponse<{ data: TaskRequestJoin[]; count: number }> & FetchReducer>(
    selectValue(types.listRequestJoin)
  );
  const { data: bountyTaskData } = useAppSelector<{ data: BountyTask } & FetchReducer>(selectValue(types.taskDetail));
  const dispatch = useAppDispatch();

  const requestJoinColumns = useRequestJoinColumns(
    id?.toString(),
    bountyTaskData.chain_id,
    bountyTaskData.task_id,
    bountyTaskData?.owner?.wallet_id,
    bountyTaskData?.owner?._id
  );

  const reloadData = (page: number) => {
    dispatch(fetchData(types.listRequestJoin, getRequestJoinTaskList(id?.toString(), page, 20)));
  };

  const handleChange = debounce((page: number) => {
    reloadData(page);
  }, 500);

  useEffect(() => {
    if (id && activeTab === "1") {
      dispatch(fetchData(types.listRequestJoin, getRequestJoinTaskList(id?.toString(), 1, 20)));
    }
  }, [dispatch, id, activeTab]);

  useEffect(() => {
    return () => {
      dispatch(clearAction(types.listRequestJoin));
    };
  }, []);

  const datasource = data.data?.map((item) => {
    return {
      id: item._id,
      user_id: item?.owner?._id,
      name: item?.owner?.display_name,
      avatar: item?.owner?.avatar,
      wallet_id: item?.owner?.wallet_id,
      description: item?.description,
    };
  });

  return (
    <div className="mb-6">
      <div className="mb-2">
        <span className="mr-3 text-base font-medium">Request</span>
        <span className="text-sm text-red-600 bg-red-100 rounded-full px-2 py-0.5">{data?.count || 0}</span>
      </div>
      <div>
        <Table
          showHeader={false}
          dataSource={datasource}
          columns={requestJoinColumns}
          size="small"
          pagination={{ position: ["bottomCenter"], onChange: handleChange, pageSize: 20, total: data?.count || 0 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default memo(RequestJoinTable);
