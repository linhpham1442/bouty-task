import { updateUserProfile } from "@/common/api/user";
import Logo from "@/common/components/Header/Logo";
import { UserRole } from "@/common/types";
import { Button, Modal, ModalProps } from "antd";
import classNames from "classnames";
import { Courthouse, Microscope } from "iconsax-react";
import { useState } from "react";

export interface IRoleSelectionModalProps {
  isOpen: ModalProps["open"];
  onSubmitRole: (role: UserRole) => void;
  userId: string;
}

export default function RoleSelectionModal({ isOpen, onSubmitRole, userId }: IRoleSelectionModalProps) {
  const [role, setRole] = useState(UserRole.manager);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitRole = async () => {
    setIsLoading(true);
    await updateUserProfile(userId, { roleType: role });
    setIsLoading(false);
    onSubmitRole(role);
  };

  return (
    <Modal open={isOpen} footer={null} closable={false} width={604}>
      <div className={"max-w-full flex flex-col items-center"}>
        <Logo />

        <div className="mt-6 text-3xl font-medium mb-7">Join as a manager or contributor</div>

        <div className="flex gap-5 mb-7">
          <RoleSelectItem
            label={
              <div className="flex flex-col items-center">
                <Courthouse className="mb-3 text-[#FF9900]" />
                <div className="text-sm text-center">I’m a manager hiring for my tasks</div>
              </div>
            }
            onSelect={() => {
              setRole(UserRole.manager);
            }}
            selected={role === UserRole.manager}
          />
          <RoleSelectItem
            label={
              <div className="flex flex-col items-center">
                <Microscope className="mb-3 text-[#3D9ACC]" />
                <div className="text-sm text-center">I’m a contributor looking for tasks</div>
              </div>
            }
            onSelect={() => {
              setRole(UserRole.contributor);
            }}
            selected={role === UserRole.contributor}
          />
        </div>

        <Button
          onClick={() => {
            handleSubmitRole();
          }}
          loading={isLoading}
          type="primary"
        >
          Join as a {role === UserRole.contributor ? "contributor" : "manager"}
        </Button>
      </div>
    </Modal>
  );
}

interface IRoleSelectItemProps {
  label: React.ReactNode;
  onSelect: () => void;
  selected?: boolean;
}

function RoleSelectItem({ label, onSelect, selected }: IRoleSelectItemProps) {
  return (
    <div
      className={classNames(
        `flex flex-col px-4 py-[18px] border border-[#D8D4E8] rounded w-[210px] justify-between items-center cursor-pointer`,
        {
          "bg-[#EFF0FF]": selected,
        }
      )}
      onClick={onSelect}
    >
      <span className="font-medium leading-6 text-base"> {label}</span>
    </div>
  );
}
