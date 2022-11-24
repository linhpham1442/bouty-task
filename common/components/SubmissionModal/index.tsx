import { Modal, Button, message } from "antd";
import { closeModal } from "@/common/redux/actions/modalAction";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getValue } from "@/common/redux/utils";
import Editor from "@/common/components/Content";
import types from "@/common/redux/types";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { handleApi } from "@/common/utils";
import { getTaskList } from "@/common/api/task";
import { useAppDispatch } from "@/common/redux/hooks";
import { submitTask, updateSubmitTask } from "@/common/api/submission";
import { getBountyTaskDetail } from "@/common/api/bountyTask";

interface SubmissionModalProps extends ReactProps {
  handleAfterSubmitSuccess?: () => void;
  isCallApiOther?: boolean
}

const SubmissionModal: React.FC<SubmissionModalProps> = (props) => {
  const { handleAfterSubmitSuccess, isCallApiOther = true } = props;
  const { open, data } = useSelector(getValue(types.modalSubmission));
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmitTaskByType = (content: string) => {
    if (data?.content) return handleApi(updateSubmitTask(data.id, data?.bounty_task_id, content));
    return handleApi(submitTask(data.id, content), true);
  };

  const handleSubmitTask = async (content: string) => {
    setLoading(true);
    try {
      const { success, data: dataResponse } = await handleSubmitTaskByType(content);
      if (success) {
        message.success("Submit task successfully");
        handleAfterSubmitSuccess();
        if(isCallApiOther) {
          dispatch(fetchData(types.taskDetail, getBountyTaskDetail(data.id?.toString())));
          dispatch(fetchData(types.listTaskDoing, getTaskList(data.id, 1, 1, 20, "")));
          dispatch(fetchData(types.listTaskInreview, getTaskList(data.id, 2, 1, 20, "")));
        }
        handleCancel();
      }
    } catch (error) {
      console.log("handleSubmitTask", error);
      message.success("Submit task failed");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    dispatch(closeModal(types.modalSubmission));
  };

  return (
    <div className="relative flex bg-white">
      <div>
        <Modal
          centered={true}
          title="Submit task"
          open={open}
          width={640}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>,
            <Button className="mr-2" key="submit" type="primary" onClick={() => handleSubmitTask(content)} loading={loading}>
              Submit
            </Button>,
          ]}
        >
          <div className="mb-2 text-base ant-form-item-label">Your submission</div>
          <Editor value={content || data?.content} onChange={(value) => setContent(value)} />
        </Modal>
      </div>
    </div>
  );
};

export default SubmissionModal;
