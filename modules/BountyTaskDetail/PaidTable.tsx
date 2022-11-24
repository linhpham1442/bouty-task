import { Table } from "antd";
import { memo, useEffect } from "react";
import { getTaskList } from "@/common/api/task";
import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { FetchReducer, ListResponse, Task } from "@/common/types";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { usePaidColumns } from "./columns";

interface PaidTable {
  activeTab: string;
}

const PaidTable: React.FC<PaidTable> = ({ activeTab }) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useAppSelector<ListResponse<{ data: Task[]; count: number }> & FetchReducer>(selectValue(types.listTaskPaid));
  const dispatch = useAppDispatch();

  const paidColumns = usePaidColumns();

  const reloadData = (page: number) => {
    dispatch(fetchData(types.listTaskPaid, getTaskList(id?.toString(), 3, page, 20, "")));
  };

  const handleChange = debounce((page: number) => {
    reloadData(page);
  }, 500);

  useEffect(() => {
    if (id && activeTab === "1") {
      dispatch(fetchData(types.listTaskPaid, getTaskList(id?.toString(), 3, 1, 20, "")));
    }
  }, [dispatch, id, activeTab]);

  useEffect(() => {
    return () => {
      dispatch(clearAction(types.listTaskPaid));
    };
  }, []);

  const datasource = data.data?.map((item) => {
    return { taskId: item._id, userId: item?.owner?._id, name: item?.owner?.display_name, avatar: item?.owner?.avatar };
  });

  return (
    <div className="mb-6">
      <div className="mb-2">
        <span className="mr-3 text-base font-medium">Paid</span>
        <span className="text-sm text-[#34C77B] bg-[#CEFFE6] rounded-full px-2 py-0.5">{data?.count || 0}</span>
      </div>
      <div>
        <Table
          dataSource={datasource}
          columns={paidColumns}
          size="small"
          pagination={{ position: ["bottomCenter"], onChange: handleChange, pageSize: 20, total: data?.count || 0 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default memo(PaidTable);
