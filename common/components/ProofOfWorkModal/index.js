import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getValue } from "@/common/redux/utils";
import { closeModal } from "@/common/redux/actions/modalAction";
import types from "@/common/redux/types";
import { Modal, Row, Col } from "antd";
import _map from "lodash/map";
import ProofOfWorkItem from "./ProofOfWorkItem";

const ProofOfWorkModal = () => {
  const dispatch = useDispatch();
  const { open, data } = useSelector(getValue(types.proofModal));
  const [taskClaim, setTaskClaim] = useState({});

  return (
    <Modal
      open={open}
      width={taskClaim?.data?.length > 1 ? "70%" : "50%"}
      title="Proof of work"
      onCancel={() => dispatch(closeModal(types.proofModal))}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        {_map(data, (item) => (
          <Col className="gutter-row" span={8}>
            <ProofOfWorkItem data={item} />
          </Col>
        ))}
      </Row>
    </Modal>
  );
};
export default ProofOfWorkModal;
