import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { NotificationsResponse, Notification, FetchReducer, BountyTask } from "@/common/types";
import { selectValue } from "@/common/redux/utils";

import { Avatar, Divider, Button, Pagination, Skeleton, Empty, Rate, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import _map from "lodash/map";
import _get from "lodash/get";
import _toUpper from "lodash/toUpper";
import _size from "lodash/size";
import _find from "lodash/find";
import useChainId from "@/common/hooks/useChainId";
import useMetamask from "@/common/hooks/useMetamask";
import { ContractTask } from "@/common/services/task";
import { sleep } from "@/common/utils";
import { fetchData } from "@/common/redux/actions/fetchAction";

import TimeAgo from "./TimeAgo";

const { Text } = Typography;

interface NotificationProps {
  hasButton?: boolean;
  isOwnner?: boolean;
  loading: boolean;
  tab: string;
  handleGetData: (tab: string, page: number) => void;
  handleDecline: (bountyTaskId: string) => void;
  handleGetRequestJoinTask: () => void;
}

const NotificationItem: React.FC<NotificationProps> = (props): JSX.Element => {
  const { hasButton = true, loading = false, isOwnner, tab = "1", handleGetData, handleDecline, handleGetRequestJoinTask } = props;
  const dispatch = useAppDispatch();
  const currentChainId = useChainId();
  const { data: dataNetWork } = useAppSelector(selectValue(types.inputNetwork));
  const { data: dataAbis } = useAppSelector(selectValue(types.listAbis));
  const { account, requestNewAccount } = useMetamask();
  const [page, setPage] = useState(1);
  const [loadingApprove, setLoadingApprove] = useState({ isloading: false, current: null });

  const onChangePage = (currentPage: number) => {
    setPage(currentPage);
    handleGetData(tab, currentPage);
  };

  const notificationAll = useAppSelector<NotificationsResponse<{ data: Notification[]; count: number }> & FetchReducer>(
    selectValue(types.notificationAll)
  );

  const notificationRequest = useAppSelector<NotificationsResponse<{ data: Notification[]; count: number }> & FetchReducer>(
    selectValue(types.notificationRequest)
  );

  const notiData = tab === "1" ? _get(notificationAll, "data") : _get(notificationRequest, "data");

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
          const chainData = dataNetWork.find((item: any) => item.chain_id === chainId);
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

  const handleApproveTask = async (
    userId: string,
    userWalletAddress: string,
    chainId: string,
    walletOwnerAddress: string,
    smcTaskId: number,
    index: number
  ) => {
    setLoadingApprove({ isloading: true, current: index });
    try {
      if (chainId !== currentChainId) {
        const success = await handleSwitchNetwork(chainId);
        if (!success) {
          setLoadingApprove({ isloading: false, current: index });
          return;
        }
      }

      if (!userWalletAddress) {
        message.error("Current wallet address contributor has not configurated yet");
        setLoadingApprove({ isloading: false, current: index });
        return;
      }

      let currentAccount = account;
      if (!account) {
        currentAccount = await requestNewAccount();
      }

      if (walletOwnerAddress?.toLowerCase() !== currentAccount?.toLowerCase()) {
        message.error("Current wallet address active and account wallet config are not match");
        setLoadingApprove({ isloading: false, current: index });
        return;
      }

      const dataAbisByChain = dataAbis.filter((item: any) => item.chain_id === chainId);

      const contractTask = new ContractTask(dataAbisByChain);
      const tx = await contractTask.approveMemberJoin(userId, userWalletAddress, smcTaskId);
      await tx.wait();

      message.success("Approve join task successfully");
      await sleep(1000);
      handleGetRequestJoinTask();
    } catch (error) {
      console.log("handleApproveJoinTask", error);
      message.error("Approve join task failed");
    }
    setLoadingApprove({ isloading: false, current: index });
  };

  const notiByType: any = {
    CREATED: "successfully created a task",
    REQUEST_JOIN: "requested to join task",
    JOINED: "joined task",
    ACCEPTED_JOIN: "approved your application to join task",
    CANCELLED: "cancel a task you join",
    SUBMITTED: "submitted task",
    COMMENTED: "comment on your submit",
    ACCEPTED_PAY: "paid for you contribution to task",
    PAID: "paid task",
    RATED: "rate your contribution",
  };

  const buildLinkTransaction = (chain_id: string, transaction_hash: string) => {
    const network = _find(dataNetWork, (item) => item?.chain_id === chain_id) || {};
    if (network?.block_explorer_url) {
      let block_explorer_url = network?.block_explorer_url;
      if (typeof block_explorer_url === "string" && block_explorer_url[block_explorer_url.length - 1] === "/") {
        block_explorer_url = block_explorer_url.slice(0, -1);
      }
      window.location.href = `${block_explorer_url}/tx/${transaction_hash}`;
    }
  };

  return (
    <>
      <div>
        {_get(notificationRequest, "loading") || _get(notificationAll, "loading") ? (
          _map([...Array(4)], (item, index) => (
            <div key={index.toString()}>
              <Skeleton avatar paragraph={{ rows: 1 }} />
              <div>
                <Divider />
              </div>
            </div>
          ))
        ) : (
          <>
            {_size(notiData) > 0 ? (
              _map(_get(notiData, "data", []), (item, index) => {
                return (
                  <React.Fragment key={index.toString()}>
                    <div className="flex">
                      <div>
                        <Avatar src={_get(item, "receiver.avatar") || _get(item, "owner.avatar")} alt="" size="large" icon={<UserOutlined />} />
                      </div>
                      <div className="w-full flex items-center justify-between ml-3">
                        <div>
                          <div>
                            <b>{_get(item, "receiver.display_name", "") || _get(item, "owner.display_name", "")}</b> {notiByType[_toUpper(item?.type)] || "requested to join task"}
                          </div>
                          {item.type === "RATED" && (
                            <div>
                              <Rate value={Math.round(item.rating * 10) / 10} allowHalf disabled />
                            </div>
                          )}
                          {item.type === "ACCEPTED_PAY" && item?.transaction_hash && (
                            <div>
                              <Text
                                underline
                                type="secondary"
                                onClick={() => buildLinkTransaction(item?.bounty_task?.chain_id, item?.transaction_hash)}
                                className="cursor-pointer"
                              >
                                Check transaction here
                              </Text>
                            </div>
                          )}
                          {hasButton && isOwnner && (
                            <div className="mt-2">
                              <Button
                                type="primary"
                                danger
                                className="mr-2"
                                size="small"
                                onClick={() => handleDecline(item?._id)}
                                disabled={loading}
                              >
                                Decline
                              </Button>
                              <Button
                                type="primary"
                                size="small"
                                onClick={() =>
                                  handleApproveTask(
                                    item?.owner?._id,
                                    item?.owner?.wallet_id,
                                    item?.bounty_task?.chain_id,
                                    item?.bounty_task?.owner_address,
                                    item?.bounty_task?.task_id,
                                    index
                                  )
                                }
                                disabled={loadingApprove.isloading}
                                loading={loadingApprove.current === index && loadingApprove.isloading}
                              >
                                Approve
                              </Button>
                            </div>
                          )}
                        </div>
                        <div>
                          <TimeAgo date={new Date(_get(item, "created_at"))} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Divider />
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <>
                <Empty />
                <Divider />
              </>
            )}
          </>
        )}
      </div>

      {_size(notiData) > 0 && (
        <div className="text-center">
          <Pagination pageSize={10} total={notiData.count} current={page} onChange={onChangePage} />
        </div>
      )}
    </>
  );
};
export default NotificationItem;
