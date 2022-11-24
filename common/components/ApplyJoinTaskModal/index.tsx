import { Modal, Button, message } from "antd";
import { closeModal } from "@/common/redux/actions/modalAction";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { getValue } from "@/common/redux/utils";
import types from "@/common/redux/types";
import { useAppDispatch } from "@/common/redux/hooks";
import { handleApi } from "@/common/utils";
import { useAuth } from "@/common/hooks/useAuth";
import { checkRequestedJoinTask, requestJoinTask } from "@/common/api/taskRequestJoin";
import Editor from '@/common/components/Content'
import _get from 'lodash/get';

interface RatingModalProps extends ReactProps {
  handleRequestedTask: (isRequested: boolean) => void
}

const ApplyJoinTaskModal: React.FC<RatingModalProps> = (props) => {
  const {handleRequestedTask} = props;
  const { open, data } = useSelector(getValue(types.modalApplyJoinTask));
  const { profile } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal(types.modalApplyJoinTask));
  };

  const checkRequested = async (bountyTaskId: string, userId: string) => {
    try {
      const { success, data: dataResponse } = await handleApi(checkRequestedJoinTask(bountyTaskId, userId), true);
      if (success) {
        handleRequestedTask(true)
      } else {
        handleRequestedTask(false)
      }
    } catch (error) {
      handleRequestedTask(false)
    }
  };

  const handleSubmitRating = async () => {
    setIsLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(requestJoinTask(_get(data, 'id', ''), content), true);

      if (success) {
        message.success("Request join task successfully");
        checkRequested(_get(data, 'id'), profile.id)
        handleCloseModal();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      message.success("Request join task failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex bg-white h-253 w-443">
      <div>
        <Modal
          title="Apply to join this task"
          open={open}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          footer={[
            <Button key="back" onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>,
            <Button className="mr-2" key="submit" type="primary" onClick={handleSubmitRating} loading={loading} disabled={loading}>
              Apply
            </Button>,
          ]}
        >
          <div className="text-[16px] mb-3">
            <span className="font-semibold">Introduce yourself to convince the task manager</span><span> (optional)</span>
          </div>
          <Editor 
            onChange={(value) => setContent(value)} 
            value={content} />
        </Modal>
      </div>
    </div>
  );
};

export default ApplyJoinTaskModal;
