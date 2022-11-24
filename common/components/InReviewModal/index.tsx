import { Modal, Input, Avatar, Button as ButtonAnd, Comment, Form, List, Tooltip, Button, message } from "antd";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getValue, selectValue } from "@/common/redux/utils";
import types from "@/common/redux/types";
import { UserOutlined } from "@ant-design/icons";
import { Message } from "iconsax-react";
import { handleApi } from "@/common/utils";
import { getSubmissionByTask } from "@/common/api/submission";
import { BountyTask, FetchReducer, IComment, Submission } from "@/common/types";
import { formatDistance } from "date-fns";
import dynamic from "next/dynamic";
import { useAuth } from "@/common/hooks/useAuth";
import { createComment, getCommentList } from "@/common/api/comment";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import useChainId from "@/common/hooks/useChainId";
import { ContractTask } from "@/common/services/task";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { getTaskList } from "@/common/api/task";
import _isArray from "lodash/isArray";
import { openModal, closeModal } from "@/common/redux/actions/modalAction";
import SubmissionModal from "@/common/components/SubmissionModal";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface InReviewModalProps extends ReactProps {}

const { TextArea } = Input;

const InReviewModal: React.FC<InReviewModalProps> = (props) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { open, data } = useSelector(getValue(types.modalReview));
  const dispatch = useAppDispatch();
  const [submission, setSubmission] = useState({} as Submission);
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  console.log("\n----submission----\n", submission, "\n----submission----\n");
  const fetchSubmissionDetail = async (taskId: string) => {
    try {
      const { success, data: dataResponse } = await handleApi(getSubmissionByTask(taskId), true);
      if (success) {
        setSubmission(dataResponse?.data);
      }
    } catch (error) {
      console.log("fetchSubmissionDetail error", error);
    }
  };

  const fetchCommentList = async (taskId: string) => {
    try {
      const { success, data: dataResponse } = await handleApi(getCommentList(taskId), true);

      if (success) {
        setComments(dataResponse?.data);
      }
    } catch (error) {
      console.log("fetchCommentList error", error);
    }
  };

  useEffect(() => {
    if (data?.taskId) {
      fetchSubmissionDetail(data.taskId);
      fetchCommentList(data.taskId);
    }
  }, [data?.taskId]);

  const handleCancel = () => {
    dispatch(closeModal(types.modalReview));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!value) return;

    setSubmitting(true);

    try {
      const { success, data: dataResponse } = await handleApi(createComment(data.taskId, value), true);
      if (success) {
        setValue("");
        fetchCommentList(data.taskId);
      }
    } catch (error) {
      console.log("handleSubmit error", error);
    }
    setSubmitting(false);
  };

  const commentsList =
    _isArray(comments) &&
    comments.map((item) => {
      return {
        author: item?.owner?.display_name,
        avatar: item?.owner?.avatar,
        content: item?.content,
        email: item?.owner?.email,
        datetime: (
          <Tooltip title={`${item?.created_at}`}>
            {item?.created_at ? (
              <span>
                {formatDistance(new Date(item?.created_at), new Date(), {
                  addSuffix: true,
                })}
              </span>
            ) : null}
          </Tooltip>
        ),
      };
    });

  const handleOpenModalSubmission = () => {
    dispatch(openModal(types.modalSubmission, { id: data?.taskId, content: submission?.content, bounty_task_id: submission?._id }));
    handleCancel();
  };

  const handleAfterSubmitSuccess = () => {
    handleCancel();
  };

  return (
    <>
      <div className="container px-10">
        <div className="container p-10">
          <Modal centered={true} open={open} onCancel={handleCancel} closable={true} footer={null} width={900}>
            <div>
              <div className="text-xl font-semibold text-center">Review</div>
              <div className="flex items-center justify-center my-2 ">
                <div className="mr-1">
                  <Avatar size="small" icon={<UserOutlined />} src={submission?.owner_id?.avatar} />
                </div>
                <div>
                  <span className="font-semibold">{submission?.owner_id?.display_name}</span> submit task in{" "}
                  {submission?.created_at
                    ? formatDistance(new Date(submission?.created_at), new Date(), {
                        addSuffix: true,
                      })
                    : null}
                </div>
              </div>
            </div>
            <div className="p-2 border rounded">
              {submission?.content ? (
                <ReactQuill theme={null} value={submission?.content || ""} readOnly={true} onChange={() => {}} />
              ) : null}
            </div>
            <div className="flex gap-2 my-2">
              {profile.role === 1 ? <PayButton taskId={data?.smcTaskId} receiver={submission?.owner?.wallet_id} /> : null}
              {profile.role === 2 ? (
                <Button type="primary" loading={loading} disabled={loading} onClick={handleOpenModalSubmission}>
                  Edit submission
                </Button>
              ) : null}
            </div>
            <div className="flex items-center mt-10 mb-2">
              <div className="flex items-center mr-2">
                <Message size={24} />
              </div>
              <div className="text-base font-semibold">Discuss</div>
            </div>

            <div>
              <Comment
                avatar={<Avatar src={profile?.avatar} alt={profile.display_name} />}
                content={<Editor onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} value={value} />}
              />
            </div>
            <div>
              <List
                className="comment-list"
                header={`${commentsList?.length} comments`}
                itemLayout="horizontal"
                dataSource={commentsList}
                renderItem={(item) => (
                  <li>
                    <Comment
                      author={item.email}
                      avatar={<Avatar src={item.avatar} alt="" />}
                      content={item.content}
                      datetime={item.datetime}
                    />
                  </li>
                )}
              />
            </div>
          </Modal>
        </div>
      </div>
      <SubmissionModal handleAfterSubmitSuccess={handleAfterSubmitSuccess} isCallApiOther={false} />
    </>
  );
};

export default InReviewModal;

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

interface CommentItem {
  author: string;
  avatar: string;
  content: React.ReactNode;
  datetime: string;
}

const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} placeholder="Write something" />
    </Form.Item>
    <Form.Item>
      <ButtonAnd htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </ButtonAnd>
    </Form.Item>
  </>
);

interface PayButtonProps {
  taskId: number;
  receiver: string;
}
function PayButton({ taskId, receiver }: PayButtonProps) {
  const { data: bountyTaskData, loading: bountyTaskLoading } = useAppSelector<{ data: BountyTask } & FetchReducer>(
    selectValue(types.taskDetail)
  );
  const { data: dataAbis } = useAppSelector(selectValue(types.listAbis));
  const { data } = useAppSelector(selectValue(types.inputNetwork));
  const [loading, setLoading] = useState(false);
  const chainId = useChainId();
  const dispatch = useAppDispatch();

  const handleSwitchNetwork = async (chainId: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      message.success("Switch network successfully");
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          const chainData = data.find((item: any) => item.chain_id === chainId);
          if (chainData) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainData.chain_id,
                  chainName: chainData.network_name,
                  rpcUrls: [chainData.new_rpc_url],
                  blockExplorerUrls: [chainData.block_explorer_url],
                  nativeCurrency: {
                    name: chainData.currency_name,
                    symbol: chainData.currency_symbol,
                    decimals: chainData.decimals,
                  },
                },
              ],
            });

            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chainId }],
            });

            message.success("Switch network successfully");
            return true;
          } else {
            message.error("Switch network failed");
          }
        } catch (addError) {
          // handle "add" error
          message.error("Switch network failed");
        }
      }

      return false;
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    if (chainId !== bountyTaskData.chain_id) {
      const success = await handleSwitchNetwork(bountyTaskData.chain_id);
      if (!success) return;
    }

    try {
      const dataAbisByChain = dataAbis.filter((item: any) => item.chain_id === bountyTaskData.chain_id);

      const contractTask = new ContractTask(dataAbisByChain);
      let tx = await contractTask.payForThisMember(receiver, taskId);
      await tx.wait();
      message.success("Pay for this contributor successfully");

      dispatch(fetchData(types.listTaskInreview, getTaskList(bountyTaskData._id, 2, 1, 20, "")));
      dispatch(fetchData(types.listTaskPaid, getTaskList(bountyTaskData._id, 3, 1, 20, "")));
    } catch (error) {
      console.log("handlePayment error", error);
      message.error("Pay for this contributor failed");
    }
    setLoading(false);
  };

  return (
    <Button type="primary" onClick={handlePayment} disabled={loading}>
      Pay for this contributor
    </Button>
  );
}
