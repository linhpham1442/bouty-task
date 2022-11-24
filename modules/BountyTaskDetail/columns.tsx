import CountDown from "@/common/components/Countdown";
import { Avatar, Popover, Rate, Button, message } from "antd";
import { ExportSquare } from "iconsax-react";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import { openModal } from "@/common/redux/actions/modalAction";
import types from "@/common/redux/types";
import { formatDistance } from "date-fns";
import { useAuth } from "@/common/hooks/useAuth";
import { handleApi, sleep } from "@/common/utils";
import { useEffect, useState } from "react";
import { getTaskList, joinTask } from "@/common/api/task";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { getRequestJoinTaskList, requestCancelJoinTask } from "@/common/api/taskRequestJoin";
import { selectValue } from "@/common/redux/utils";
import { ContractTask } from "@/common/services/task";
import useChainId from "@/common/hooks/useChainId";
import useMetamask from "@/common/hooks/useMetamask";
import ParsedToken from "@/common/components/ParsedToken";
import { BountyTask, FetchReducer, UserRole, RatingByUserTask } from "@/common/types";
import useParseTokenFromWei from "@/common/hooks/useParseTokenFromWei";
import { getRatingByUserTask } from "@/common/api/rating";
import _isEmpty from "lodash/isEmpty";

export const useRequestJoinColumns = (
  bountyTaskId: string,
  chainId: string,
  smcTaskId: number,
  walletOwnerAddress: string,
  ownerId: string
) => {
  const dispatch = useAppDispatch();
  const { profile } = useAuth();
  const currentChainId = useChainId();
  const { data: dataAbis } = useAppSelector(selectValue(types.listAbis));
  const { data } = useAppSelector(selectValue(types.inputNetwork));
  const { account, requestNewAccount } = useMetamask();

  const [loading, setLoading] = useState(false);

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
          const chainData = data.find((item: any) => item.chain_id === chainId);
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

  const handleApproveJoinTask = async (userId: string, userWalletAddress: string) => {
    setLoading(true);
    try {
      if (chainId !== currentChainId) {
        const success = await handleSwitchNetwork(chainId);
        if (!success) {
          setLoading(false);
          return;
        }
      }

      if (!userWalletAddress) {
        message.error("Current wallet address contributor has not configurated yet");
        setLoading(false);
        return;
      }

      let currentAccount = account;
      if (!account) {
        currentAccount = await requestNewAccount();
      }

      if (walletOwnerAddress?.toLowerCase() !== currentAccount?.toLowerCase()) {
        message.error("Current wallet address active and account wallet config are not match");
        setLoading(false);
        return;
      }

      const dataAbisByChain = dataAbis.filter((item: any) => item.chain_id === chainId);

      const contractTask = new ContractTask(dataAbisByChain);
      const tx = await contractTask.approveMemberJoin(userId, userWalletAddress, smcTaskId);
      await tx.wait();

      message.success("Approve join task successfully");
      await sleep(1000);
      dispatch(fetchData(types.listRequestJoin, getRequestJoinTaskList(bountyTaskId, 1, 20)));
      dispatch(fetchData(types.listTaskDoing, getTaskList(bountyTaskId, 1, 1, 20, "")));
    } catch (error) {
      console.log("handleApproveJoinTask", error);
      message.error("Approve join task failed");
    }
    setLoading(false);
  };

  const handleCancelJoinTask = async (userId: string) => {
    setLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(requestCancelJoinTask(bountyTaskId, userId), true);

      if (success) {
        message.success("Decline join task successfully");
        dispatch(fetchData(types.listRequestJoin, getRequestJoinTaskList(bountyTaskId, 1, 20)));
      }
    } catch (error) {
      console.log("handleCancelJoinTask", error);
      message.success("Decline join task failed");
    }
    setLoading(false);
  };

  const handleOpenModalApprove = (
    id: any,
    userId: string,
    userWalletAddress: string,
    chainId: string,
    walletOwnerAddress: string,
    smcTaskId: number,
    bountyTaskId: string,
    description: string
  ) => {
    dispatch(
      openModal(types.modalApprove, {
        idJoinTask: id,
        userId,
        userWalletAddress,
        chainId,
        walletOwnerAddress,
        smcTaskId,
        bountyTaskId,
        description,
      })
    );
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "name",
      render: (_: string, record: any) => (
        <div className="flex items-center">
          <Avatar size={20} src={record?.avatar} /> <b className="ml-1">{record?.name}</b> <span className="ml-1">requested to join</span>
        </div>
      ),
    },
  ];

  if (profile.role === 1 && profile?.id === ownerId) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      width: 150,
      render: (_: string, record: any) => {
        return (
          <div className="flex gap-3">
            <Button size="small" onClick={() => handleCancelJoinTask(record?.user_id)}>
              Decline
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                // handleApproveJoinTask(record?.user_id, record?.wallet_id);
                handleOpenModalApprove(
                  record?.id,
                  record?.user_id,
                  record?.wallet_id,
                  chainId,
                  walletOwnerAddress,
                  smcTaskId,
                  bountyTaskId,
                  record?.description
                );
              }}
              loading={loading}
            >
              Approve
            </Button>
          </div>
        );
      },
    });
  }

  return columns;
};

export const useDoingColumns = () => {
  return [
    {
      title: "",
      dataIndex: "name",
      render: (_: string, record: any) => (
        <div className="flex items-center">
          <Avatar size={20} src={record?.avatar} /> <b className="ml-1">{record?.name}</b>{" "}
          <span className="ml-1">
            joined in{" "}
            {formatDistance(new Date(record?.created_at), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "expired_at",
      width: "30%",
      render: (value: Date) => {
        return (
          <div className="flex items-center justify-end text-xs text-slate-700">
            Ends in
            <CountDown className="ml-2" countDownDistance={new Date(value).getTime() - new Date().getTime()} />
          </div>
        );
      },
    },
  ];
};

export const useInReviewColumns = (smcTaskId: number) => {
  const dispatch = useAppDispatch();
  const { profile } = useAuth();

  const handleOpenReviewModal = (taskId: string, smcTaskId: number) => {
    dispatch(openModal(types.modalReview, { taskId, smcTaskId }));
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "name",
      render: (_: string, record: any) => (
        <div className="flex items-center">
          <Avatar size={20} src={record?.avatar} /> <b className="ml-1">{record?.name}</b>{" "}
          <span className="ml-1">
            sumitted task in{" "}
            {record?.submitted_at
              ? formatDistance(new Date(), new Date(record?.submitted_at), {
                  addSuffix: true,
                })
              : null}
          </span>
        </div>
      ),
    },
  ];

  if (profile.role === 1) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      width: 150,
      render: (_: string, record: any) => {
        return (
          <Button type="primary" size="small" onClick={() => handleOpenReviewModal(record.id, smcTaskId)}>
            View submission
          </Button>
        );
      },
    });
  }

  return columns;
};

export const usePaidColumns = () => {
  const { data: dataBountyTask } = useAppSelector<{ data: BountyTask } & FetchReducer>(selectValue(types.taskDetail));

  const fixedAmountFormat = useParseTokenFromWei(dataBountyTask?.fixed_amount, dataBountyTask?.token_address);

  return [
    {
      title: "User",
      dataIndex: "user",
      width: "15%",
      render: (_: string, record: any) => (
        <div className="flex items-center">
          <Avatar size={20} src={record?.avatar} /> <b className="ml-1">{record?.name}</b>
        </div>
      ),
    },
    {
      title: "Earning",
      dataIndex: "earning",
      width: "15%",
      render: (text: string) => (
        <div>
          <span className="mr-1">{fixedAmountFormat}</span>
          <ParsedToken
            address={dataBountyTask?.token_address}
            chainId={dataBountyTask?.chain_id}
            showSymbol={false}
            showName={true}
            defaultNullAddressAsNative
          />
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      width: "40%",
      render: (_: string, record: any) => {
        return <Rating userId={record.userId} taskId={record.taskId} />;
      },
    },
  ];
};

const Rating = ({ userId, taskId }: { userId: string; taskId: string }) => {
  const { profile } = useAuth();
  const { data: dataBountyTask } = useAppSelector<{ data: BountyTask } & FetchReducer>(selectValue(types.taskDetail));
  const [ratingByUserTask, setRatingByUserTask] = useState(null);
  const dispatch = useAppDispatch();

  const handleModal = (userId: string, taskId: string) => {
    dispatch(openModal(types.modalRating, { userId, taskId, refreshFunc: fetchRatingByUserTask }));
  };

  const fetchRatingByUserTask = async (userId: string, taskId: string) => {
    try {
      let { data } = await handleApi(getRatingByUserTask(userId, taskId), true);
      if (data?.data) {
        setRatingByUserTask(data?.data);
      }
    } catch (error) {
      console.log("fetchRatingByUserTask error", error);
    }
  };

  useEffect(() => {
    if (userId && taskId) {
      fetchRatingByUserTask(userId, taskId);
    }
  }, [userId, taskId]);

  return (
    <div>
      {profile.role === UserRole.manager && profile?.id === dataBountyTask?.owner?._id && _isEmpty(ratingByUserTask) ? (
        <Button
          className="bg-[#FADB14] text-white border-transparent h-6 py-0 px-5 focus:border-transparent focus:text-white focus:bg-[#FADB14] hover:bg-[#FADB14] hover:border-transparent hover:text-white"
          onClick={() => handleModal(userId, taskId)}
        >
          Rate
        </Button>
      ) : (
        <div className="flex items-center">
          <Rate className="mr-2 text-base" value={ratingByUserTask?.rating} disabled={true} />
          <Popover content={ratingByUserTask?.comment} trigger="click">
            <span className="italic underline cursor-pointer">View comment</span>
          </Popover>
        </div>
      )}
    </div>
  );
};

export const useCancelledColumns = () => {
  const columns: any = [
    {
      title: "",
      dataIndex: "name",
      render: (_: string, record: any) => (
        <div className="flex items-center">
          <Avatar size={20} src={record?.avatar} /> <b className="ml-1">{record?.name}</b>{" "}
          <span className="ml-1">
            cancelled task in{" "}
            {record?.cancelled_at
              ? formatDistance(new Date(), new Date(record?.cancelled_at), {
                  addSuffix: true,
                })
              : null}
          </span>
        </div>
      ),
    },
  ];

  return columns;
};
