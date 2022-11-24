import { Table } from "antd";
import { memo, useEffect } from "react";
import { useInReviewColumns } from "./columns";
import { getTaskList } from "@/common/api/task";
import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { BountyTask, FetchReducer, ListResponse, Task } from "@/common/types";
import { debounce } from "lodash";
import { useRouter } from "next/router";

interface InreviewTableProps {
  activeTab: string
}

const InreviewTable: React.FC<InreviewTableProps> = ({activeTab}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useAppSelector<ListResponse<{ data: Task[]; count: number }> & FetchReducer>(
    selectValue(types.listTaskInreview)
  );
  const { data: dataBountyTask } = useAppSelector<{ data: BountyTask } & FetchReducer>(selectValue(types.taskDetail));
  const dispatch = useAppDispatch();

  const inReviewColumns = useInReviewColumns(dataBountyTask?.task_id);

  const reloadData = (page: number) => {
    dispatch(fetchData(types.listTaskInreview, getTaskList(id?.toString(), 2, page, 20, "")));
  };

  const handleChange = debounce((page: number) => {
    reloadData(page);
  }, 500);

  useEffect(() => {
    if (id && activeTab === '1') {
      dispatch(fetchData(types.listTaskInreview, getTaskList(id?.toString(), 2, 1, 20, "")));
    }
  }, [dispatch, id, activeTab]);

  useEffect(() => {
    return () => {
      dispatch(clearAction(types.listTaskInreview));
    };
  }, []);

  const datasource = data?.data?.map((item) => {
    return { id: item._id, name: item?.owner?.display_name, avatar: item?.owner?.avatar, submitted_at: item.submitted_at };
  });

  return (
    <div className="mb-6">
      <div className="mb-2">
        <span className="mr-3 text-base font-medium">In review</span>
        <span className="text-sm text-[#3E74FF] bg-[#D3E0FF] rounded-full px-2 py-0.5">{data?.count || 0}</span>
      </div>
      <div>
        <Table
          showHeader={false}
          dataSource={datasource}
          columns={inReviewColumns}
          size="small"
          pagination={{ position: ["bottomCenter"], onChange: handleChange, pageSize: 20, total: data?.count || 0 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default memo(InreviewTable);
