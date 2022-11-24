import React, { memo, useState, useEffect } from "react";

import { fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { UserRole } from "@/common/types";
import { getNoticationRequest, getNoticationList } from "@/common/api/notification";
import { handleApi } from "@/common/utils";
import {requestCancelJoinTask} from '@/common/api/taskRequestJoin';
import { Tabs } from "antd";
import { useAuth } from "@/common/hooks/useAuth";
import _get from "lodash/get";
import {message} from 'antd';
import NotificationItem from "./NotificationItem";

const Notification = (): JSX.Element => {
  const [activeKey, setActiveKey] = useState("1");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { profile } = useAuth();
  const isOwnner = profile?.role === UserRole.manager;

  const onChange = (key: string) => {
    setActiveKey(key);
    handleGetNoti(key, 1);
  };

  const handleGetNoti = (tab: string, page: number) => {
    if (tab === "1") {
      dispatch(fetchData(types.notificationAll, getNoticationList(_get(profile, "id", ""), page, 20)));
    } else if (tab === "2") {
      if (isOwnner) {
        dispatch(fetchData(types.notificationRequest, getNoticationRequest(_get(profile, "id", ""), page, 20)));
      } else {
        dispatch(fetchData(types.notificationAll, getNoticationList(_get(profile, "id", ""), page, 20, 'ACCEPTED_PAY')));
      }
    }
  };

  const handleGetRequestJoinTask = () => {
    dispatch(fetchData(types.notificationRequest, getNoticationRequest(_get(profile, "id", ""), 1, 20)));
  }
  
  useEffect(() => {
    handleGetNoti(activeKey, 1);
  }, []);

  const handleDeclineTask = async (bountyTaskId: string) => {
    setLoading(true);
    try {
      const { success } = await handleApi(requestCancelJoinTask(bountyTaskId, _get(profile, "id", "")), true);
      if (success) {
        message.success("Decline join task successfully");
        dispatch(fetchData(types.notificationRequest, getNoticationRequest(_get(profile, "id", ""), 1, 20)));
      }
    } catch (error) {
      message.success("Decline join task failed");
    }
    setLoading(false);
  };


  return (
    <div className="px-[40px]">
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        onChange={onChange}
        items={[
          {
            label: `All`,
            key: "1",
            children: <NotificationItem hasButton={false} tab={activeKey} handleGetData={handleGetNoti} handleDecline={handleDeclineTask} handleGetRequestJoinTask={handleGetRequestJoinTask} loading={loading} isOwnner={isOwnner} />,
          },
          {
            label: isOwnner ? 'Application request' : 'Payment',
            key: "2",
            children: <NotificationItem tab={activeKey} handleGetData={handleGetNoti} handleDecline={handleDeclineTask} handleGetRequestJoinTask={handleGetRequestJoinTask} loading={loading} isOwnner={isOwnner} />,
          },
        ]}
      />
    </div>
  );
};

export default memo(Notification);
