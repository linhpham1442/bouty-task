import { Table } from "antd";
import { memo, useEffect } from "react";
import { useCancelledColumns } from "./columns";
import { getTaskList } from "@/common/api/task";
import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { FetchReducer, ListResponse, Task } from "@/common/types";
import { debounce } from "lodash";
import { useRouter } from "next/router";

interface CancelledTableProps {
  activeTab: string
}

const CancelledTable: React.FC<CancelledTableProps> = ({activeTab}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useAppSelector<ListResponse<{ data: Task[]; count: number }> & FetchReducer>(
    selectValue(types.listTaskCancelled)
  );
  const dispatch = useAppDispatch();

  const cancelledColumns = useCancelledColumns();

  const reloadData = (page: number) => {
    dispatch(fetchData(types.listTaskCancelled, getTaskList(id?.toString(), 0, page, 20, "")));
  };

  const handleChange = debounce((page: number) => {
    reloadData(page);
  }, 500);

  useEffect(() => {
    if (id && activeTab === '1') {
      dispatch(fetchData(types.listTaskCancelled, getTaskList(id?.toString(), 0, 1, 20, "")));
    }
  }, [dispatch, id, activeTab]);

  useEffect(() => {
    return () => {
      dispatch(clearAction(types.listTaskCancelled));
    };
  }, []);

  const datasource = data.data?.map((item) => {
    return { id: item._id, name: item?.owner?.display_name, avatar: item?.owner?.avatar, submitted_at: item.submitted_at, cancelled_at: item?.cancelled_at };
  });

  return (
    <div className="mb-6">
      <div className="mb-2">
        <span className="mr-3 text-base font-medium">Cancelled</span>
        <span className="text-sm text-red-600 bg-red-100 rounded-full px-2 py-0.5">{data?.count || 0}</span>
      </div>
      <div>
        <Table
          showHeader={false}
          dataSource={datasource}
          columns={cancelledColumns}
          size="small"
          pagination={{ position: ["bottomCenter"], onChange: handleChange, pageSize: 20, total: data?.count || 0 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default memo(CancelledTable);
