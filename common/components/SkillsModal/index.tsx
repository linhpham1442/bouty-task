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
import SelectSkill from "@/common/components/Select/SelectSkill";
import { updateUserProfile, getMeProfile } from "@/common/api/user";
import { Skill } from "@/common/types";
import _includes from "lodash/includes";
import _get from "lodash/get";

interface SkillsModalProps extends ReactProps {
  currentSkills: string[];
  userId: string;
  handleUpdateSkillProfile: (skills: Skill[]) => void;
}

const SkillsModal: React.FC<SkillsModalProps> = (props) => {
  const { currentSkills, userId, handleUpdateSkillProfile } = props;
  const { open, data } = useSelector(getValue(types.skillsModal));
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) {
      setSkills(currentSkills);
    }
  }, [open]);

  const handleUpdateProfile = async (userId: string, skills: string[]) => {
    setLoading(true);
    try {
      const {
        data: { data, success },
      } = await updateUserProfile(userId, { skills });
      if (success) {
        const {
          data: { data: profile },
        } = await getMeProfile();
        handleUpdateSkillProfile(profile?.skills);
        message.success("Update profile successfully");
        handleCancel();
      }
    } catch (error) {
      message.success("Update profile failed");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    dispatch(closeModal(types.skillsModal));
  };

  return (
    <div className="relative flex bg-white">
      <div>
        <Modal
          centered={true}
          title="Edit Profile"
          open={open}
          width={640}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>,
            <Button className="mr-2" key="submit" type="primary" onClick={() => handleUpdateProfile(userId, skills)} disabled={loading}>
              Save
            </Button>,
          ]}
        >
          <div className="mb-2 text-base ant-form-item-label">Skill</div>
          <SelectSkill
            mode="multiple"
            allowClear
            showArrow
            value={skills}
            onChange={(skill) => setSkills(skill)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default SkillsModal;
