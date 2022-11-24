import { Rate, Modal, Input, Button, message } from "antd";
import { closeModal } from "@/common/redux/actions/modalAction";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { getValue } from "@/common/redux/utils";
import types from "@/common/redux/types";
import { useAppDispatch } from "@/common/redux/hooks";
import { handleApi, sleep } from "@/common/utils";
import { submitRating } from "@/common/api/rating";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { getTaskList } from "@/common/api/task";
import { getRatingByUserTask } from "@/common/api/rating";

interface RatingModalProps extends ReactProps {}

const RatingModal: React.FC<RatingModalProps> = (props) => {
  const { open, data } = useSelector(getValue(types.modalRating));
  const [comment, setComment] = useState("");
  const [loading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(0);
  const { TextArea } = Input;

  const handleSubmitRating = async () => {
    setIsLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(submitRating(data.userId, data.taskId, value, comment), true);
      if (success) {
        message.success("Submit rating successfully");
        await sleep(1000);
        data?.refreshFunc(data.userId, data.taskId);
        handleCancel();
      }
    } catch (error) {
      message.success("Submit task failed");
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    dispatch(closeModal(types.modalRating));
  };

  return (
    <div className="relative flex bg-white h-253 w-443">
      <div>
        <Modal
          title="Rate for this contributor"
          open={open}
          onOk={handleSubmitRating}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>,
            <Button className="mr-2" key="submit" type="primary" onClick={handleSubmitRating} loading={loading}>
              Rate
            </Button>,
          ]}
        >
          <Rate onChange={(value) => setValue(value)} value={value} />
          <div className="pt-5">
            <p>Add comment</p>
          </div>
          <TextArea rows={2} onChange={(e) => setComment(e.target.value)} value={comment} />
        </Modal>
      </div>
    </div>
  );
};

export default RatingModal;
