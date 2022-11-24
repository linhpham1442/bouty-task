import { getBountyTaskDetail } from "@/common/api/bountyTask";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import types from "@/common/redux/types";
import { formatDistance } from "date-fns";
import { ArrowLeft2, Chart1, ClipboardImport, Clock, DollarCircle, FlashCircle, Key, People, TaskSquare, Messages1 } from "iconsax-react";
import { BountyTask, FetchReducer, Task, UserRole } from "@/common/types";
import { selectValue } from "@/common/redux/utils";
import ParsedToken from "@/common/components/ParsedToken";
import { Avatar, Button, message, Popconfirm, Tag, Tabs } from "antd";
import dynamic from "next/dynamic";
import RatingModal from "@/common/components/RatingModal";
import ApplyJoinTaskModal from "@/common/components/ApplyJoinTaskModal";
import { handleApi } from "@/common/utils";
import { cancelTask, claimTask, countTaskByBountyTask, getTaskByUserBountyTask, joinTask } from "@/common/api/task";
import { checkRequestedJoinTask } from "@/common/api/taskRequestJoin";
import { openModal } from "@/common/redux/actions/modalAction";
import ApproveModal from "@/common/components/ApproveModal";
import SubmissionModal from "@/common/components/SubmissionModal";
import { useAuth } from "@/common/hooks/useAuth";
import InReviewModal from "@/common/components/InReviewModal";
import ActivityTaskTab from "./ActivityTaskTab";
import DiscussTab from "./DiscussTab";
import useParseTokenFromWei from "@/common/hooks/useParseTokenFromWei";
import { DollarCircleOutlined } from "@ant-design/icons";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BountyTaskDetail = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentTaskClaimed, setCurrentTaskClaimed] = useState(0);
  const [userTask, setUserTask] = useState({} as Task);
  const { profile } = useAuth();
  const [isRequested, setIsRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isClaim, setIsClaim] = useState(false);
  const { data, loading } = useAppSelector<{ data: BountyTask } & FetchReducer>(selectValue(types.taskDetail));
  const { id } = router.query;

  const fixedAmountFormat = useParseTokenFromWei(data?.fixed_amount, data?.token_address);

  const goToList = () => {
    router.push("/bounty-task");
  };

  const checkRequested = async (bountyTaskId: string, userId: string) => {
    try {
      const { success, data: dataResponse } = await handleApi(checkRequestedJoinTask(bountyTaskId, userId), true);
      if (success) {
        setIsRequested(dataResponse?.data || false);
      } else {
        setIsRequested(false);
      }
    } catch (error) {
      setIsRequested(false);
    }
  };

  useEffect(() => {
    if (id && profile.id) {
      checkRequested(id?.toString(), profile.id);
    }
  }, []);

  const fetchTaskByUserBountyTask = async (id: string) => {
    try {
      const { success, data: dataResponse } = await handleApi(getTaskByUserBountyTask(id), true);
      if (success) {
        setUserTask(dataResponse?.data);
      }
    } catch (error) {
      console.log("fetchTaskByUserBountyTask", error);
    }
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

  const openSubmission = (taskId: string, bounty_task_id: string) => {
    dispatch(openModal(types.modalReview, { taskId, bounty_task_id }));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchData(types.taskDetail, getBountyTaskDetail(id?.toString())));
      fetchCurrentTaskClaimed(id?.toString());
      fetchTaskByUserBountyTask(id?.toString());
    }
  }, [id, dispatch]);

  const handleTaskByUserBountyTask = () => {
    if (id) {
      fetchTaskByUserBountyTask(id?.toString());
    }
  };

  // this func called when call api checkRequestedJoinTask success
  // setIsRequested true for child comp disable button
  const handleRequestedTask = (value: boolean) => {
    setIsRequested(value);
  };

  const handleClaimReward = async (taskId: string) => {
    setIsClaim(true);
    try {
      let { success } = await handleApi(claimTask(taskId), true);
      if (success) {
        message.success("Claim token successfully");
      }
    } catch (error) {
      console.log("handleClaimReward error", error);
      message.error("Claim token failed");
    }
    setIsClaim(false);
  };

  return (
    <div className="px-9">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="text-[#8F8C9C] cursor-pointer pt-2" onClick={goToList}>
            <ArrowLeft2 size={18} className="mr-1" />
          </div>
          <div className="text-xl font-semibold">{data?.title}</div>
        </div>
        {data?.created_at ? (
          <div className="text-[#8F8C9C] text-sm">
            Posted{" "}
            {formatDistance(new Date(data?.created_at), new Date(), {
              addSuffix: true,
            })}
          </div>
        ) : null}
      </div>
      <div className="text-[#8F8C9C] text-sm flex items-center mb-10">
        Created by <Avatar size={20} className="mx-1" src={data?.owner?.avatar} />
        <span className="font-semibold">{data?.owner?.display_name}</span>
      </div>
      <div className="flex items-center mb-4 font-semibold">
        <FlashCircle className="mr-2" size={20} />
        Task requirements:
      </div>
      <ReactQuill theme={null} value={data?.description || ""} readOnly={true} onChange={() => {}} />

      {/* <div className="h-px w-full bg-[#EAE8F1] mt-2 mb-8" /> */}
      <div className="grid w-4/5 grid-cols-4 gap-4 mb-8">
        <div>
          <div className="flex items-center">
            <DollarCircle size={16} color="#34C77B" className="mr-1" />
            <span className="text-sm text-[#6C6684]">Fixed price</span>
          </div>
          <div className="text-base font-medium">
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
            <span className="text-sm text-[#6C6684]">Duration</span>
          </div>
          <div className="text-base font-medium">
            {data?.duration} {data?.duration_type}
          </div>
        </div>
        <div>
          <div className="flex items-center text-base">
            <Key size={16} color="#FF9900" className="mr-1" />
            <span className="text-sm text-[#6C6684]">Entry</span>
          </div>
          <div className="text-base font-medium">{data?.type_work_entry === 0 ? "Everyone can join" : "Apply to join"}</div>
        </div>
        <div>
          <div className="flex items-center text-base">
            <People size={16} color="#F367FF" className="mr-1" />
            <span className="text-sm text-[#6C6684]">Headcount</span>
          </div>
          <div className="text-base font-medium">
            {currentTaskClaimed}/{data?.max_headcount} contributors
          </div>
        </div>
      </div>
      {/* <div className="h-px w-full bg-[#EAE8F1] mt-8 mb-8" /> */}
      <div className="mb-2 text-sm">Required skills:</div>
      <div>
        {data?.skills?.map((item, idx) => (
          <Tag key={idx.toString()} className="px-2 py-1 mb-1 mr-1 font-medium text-xs rounded-[100px] text-[#3D2E7C]" color="#EFF0FF">
            {item?.name}
          </Tag>
        ))}
      </div>
      <div className="h-px w-full bg-[#EAE8F1] mt-8 mb-6" />
      {!userTask && data?.owner?._id !== profile.id ? (
        <>
          {data.type_work_entry === 0 && profile.role !== UserRole.manager ? (
            <ButtonJoinTask id={id?.toString()} setUserTask={(data) => setUserTask(data)} />
          ) : null}
          {data.type_work_entry === 1 && profile.role !== UserRole.manager ? (
            <ButtonRequestJoinTask id={id?.toString()} isRequested={isRequested} />
          ) : null}
        </>
      ) : (
        <>
          <div className="flex gap-3 mb-10">
            {userTask?.type === 1 && data?.owner?._id !== profile.id && profile.role !== UserRole.manager ? (
              <>
                <ButtonSubmitTask id={id?.toString()} />
                <ButtonExitTask id={id?.toString()} setUserTask={(data) => setUserTask(data)} />
              </>
            ) : null}
            {userTask?.type === 2 && data?.owner?._id !== profile.id && profile.role !== UserRole.manager ? (
              <Button type="primary" size="large" onClick={() => openSubmission(userTask._id, id.toString())}>
                <div className="flex items-center gap-1">
                  <TaskSquare size={16} />
                  View your submission
                </div>
              </Button>
            ) : null}
            {userTask?.type === 4 && data?.owner?._id !== profile.id && profile.role !== UserRole.manager ? (
              <Button type="primary" size="large" onClick={() => handleClaimReward(userTask._id)} disabled={isClaim}>
                <div className="flex items-center gap-1">
                  <DollarCircleOutlined size={16} />
                  Claim reward
                </div>
              </Button>
            ) : null}
          </div>
          <div className="bounty-task-activity">
            <Tabs
              defaultActiveKey="1"
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              size="small"
              items={[
                {
                  label: (
                    <div className="flex items-center mb-4 font-semibold">
                      <Chart1 className="mr-2" size={16} />
                      <span>Activity on this task</span>
                    </div>
                  ),
                  key: "1",
                  children: <ActivityTaskTab activeTab={activeTab} type_work_entry={data?.type_work_entry} />,
                },
                {
                  label: (
                    <div className="flex items-center mb-4 font-semibold">
                      <Messages1 className="mr-2" size={16} />
                      <span>Discuss</span>
                    </div>
                  ),
                  key: "2",
                  children: <DiscussTab activeTab={activeTab} bounty_task_id={id?.toString()} />,
                },
              ]}
            />
          </div>
        </>
      )}
      <RatingModal />
      <SubmissionModal handleAfterSubmitSuccess={handleTaskByUserBountyTask} />
      <InReviewModal />
      <ApplyJoinTaskModal handleRequestedTask={handleRequestedTask} />
      <ApproveModal />
    </div>
  );
};

export default memo(BountyTaskDetail);

function ButtonJoinTask({ id, setUserTask }: { id: string; setUserTask: (data: Task) => void }) {
  const [loading, setLoading] = useState(false);

  const handleJoinTask = async () => {
    setLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(joinTask(id));

      if (success) {
        message.success("Join task successfully");
        setUserTask(dataResponse?.data);
      }
    } catch (error) {
      console.log("handleJoinTask", error);
      message.success("Join task failed");
    }
    setLoading(false);
  };

  return (
    <Button size="large" type="primary" onClick={handleJoinTask} loading={loading}>
      Join task
    </Button>
  );
}

function ButtonRequestJoinTask({ id, isRequested }: { id: string; isRequested: boolean }) {
  const dispatch = useAppDispatch();

  const handleOpenModalApply = () => {
    dispatch(openModal(types.modalApplyJoinTask, { id: id }));
  };

  return (
    <Button size="large" type="primary" onClick={handleOpenModalApply} disabled={isRequested}>
      {isRequested ? "Requested" : "Request join task"}
    </Button>
  );
}

function ButtonSubmitTask({ id }: { id: string }) {
  const dispatch = useAppDispatch();

  const handleOpenModalSubmission = () => {
    dispatch(openModal(types.modalSubmission, { id: id }));
  };

  return (
    <Button size="large" type="primary" onClick={handleOpenModalSubmission}>
      <div className="flex items-center gap-1">
        <ClipboardImport size={16} />
        Submit task
      </div>
    </Button>
  );
}

function ButtonExitTask({ id, setUserTask }: { id: string; setUserTask: (data: Task) => void }) {
  const [loading, setLoading] = useState(false);

  const handleExitTask = async () => {
    setLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(cancelTask(id));

      if (success) {
        message.success("Exit task successfully");
        setUserTask(dataResponse?.data);
      }
    } catch (error) {
      console.log("handleExitTask", error);
      message.success("Exit task failed");
    }
    setLoading(false);
  };

  return (
    <Popconfirm
      title="Are you sure to exit this task?"
      onConfirm={handleExitTask}
      okText="Yes"
      okButtonProps={{ danger: true }}
      cancelText="No"
    >
      <Button size="large" type="primary" danger loading={loading}>
        Exit task
      </Button>
    </Popconfirm>
  );
}
