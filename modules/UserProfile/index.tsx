import { memo, useContext } from "react";
import OwnerProfile from "./OwnerProfile";
import FreelancerProfile from "./FreelancerProfile";
import { UserRole } from "@/common/types";
import { AuthContext } from "@/common/hooks/useAuth";

const UserProfile = (): JSX.Element => {
  const { state } = useContext(AuthContext);
  if (state.profile.role === UserRole.manager) {
    return (
      <>
        <OwnerProfile />
      </>
    );
  }
  return (
    <>
      <FreelancerProfile />
    </>
  );
};

export default memo(UserProfile);
