import { getTaskList } from "@/common/api/task";
import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { FetchReducer, ListResponse, Task } from "@/common/types";
import { Table } from "antd";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { useDoingColumns } from "./columns";

interface DoingTableProps {
  activeTab: string
}

const DoingTable: React.FC<DoingTableProps> = ({activeTab}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useAppSelector<ListResponse<{ data: Task[]; count: number }> & FetchReducer>(selectValue(types.listTaskDoing));
  const dispatch = useAppDispatch();

  const doingColumns = useDoingColumns();

  const reloadData = (page: number) => {
    dispatch(fetchData(types.listTaskDoing, getTaskList(id?.toString(), 1, page, 20, "")));
  };

  const handleChange = debounce((page: number) => {
    reloadData(page);
  }, 500);

  useEffect(() => {
    if (id && activeTab === '1') {
      dispatch(fetchData(types.listTaskDoing, getTaskList(id?.toString(), 1, 1, 20, "")));
    }
  }, [dispatch, id, activeTab]);

  useEffect(() => {
    return () => {
      dispatch(clearAction(types.listTaskDoing));
    };
  }, []);

  const datasource = data.data?.map((item) => {
    return { name: item?.owner?.display_name, avatar: item?.owner?.avatar, created_at: item.created_at, expired_at: item.expired_at };
  });

  return (
    <div className="mb-6">
      <div className="mb-2">
        <span className="mr-3 text-base font-medium">Doing</span>
        <span className="text-sm text-[#FF9900] bg-[#FFF0BC] rounded-full px-2 py-0.5">{data?.count || 0}</span>
      </div>
      <div>
        <Table
          showHeader={false}
          dataSource={datasource}
          columns={doingColumns}
          size="small"
          pagination={{ position: ["bottomCenter"], onChange: handleChange, pageSize: 20, total: data?.count || 0 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default memo(DoingTable);
