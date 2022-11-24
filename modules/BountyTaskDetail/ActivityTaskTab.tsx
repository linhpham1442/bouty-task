import React, { memo } from "react";
import CancelledTable from "./CancelledTable";
import RequestJoinTable from "./RequestJoinTable";
import DoingTable from "./DoingTable";
import InreviewTable from "./InreviewTable";
import PaidTable from "./PaidTable";

interface ActivityTaskProps {
  type_work_entry: number,
  activeTab: string
}

const ActivityTaskTab:React.FC<ActivityTaskProps>  = (props): JSX.Element => {
  const {type_work_entry, activeTab} = props

  return (
    <>
      {type_work_entry === 1 ? <RequestJoinTable activeTab={activeTab} /> : null}
      <DoingTable activeTab={activeTab} />
      <InreviewTable activeTab={activeTab} />
      <PaidTable activeTab={activeTab} />
      <CancelledTable activeTab={activeTab} />
    </>
  );
};

export default memo(ActivityTaskTab);
