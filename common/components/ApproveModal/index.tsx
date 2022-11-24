import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getValue } from "@/common/redux/utils";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import { closeModal } from "@/common/redux/actions/modalAction";
import { Modal, Button, Rate, Avatar, message, Tag } from "antd";
import types from "@/common/redux/types";
import dynamic from "next/dynamic";
import { CalendarTick, Medal, MoneyRecive, Star1 } from "iconsax-react";
import { formatNumber } from "@/common/utils";
import { getMeProfileDetail } from "@/common/api/user";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { IUserInformation } from "@/common/types";
import isValid from "date-fns/isValid";
import format from "date-fns/format";
import { handleApi, sleep } from "@/common/utils";
import useChainId from "@/common/hooks/useChainId";
import { selectValue } from "@/common/redux/utils";
import useMetamask from "@/common/hooks/useMetamask";
import { ContractTask } from "@/common/services/task";
import { getRequestJoinTaskList, requestCancelJoinTask } from "@/common/api/taskRequestJoin";
import { getTaskList, joinTask } from "@/common/api/task";
import { getAverageRating } from "@/common/api/rating";
import { getListBountyTaskClaim } from "@/common/api/proofOfWork";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ApproveModal = () => {
  const dispatch = useAppDispatch();
  const { open, data } = useSelector(getValue(types.modalApprove));
  const currentChainId = useChainId();
  const { data: dataNetWork } = useAppSelector(selectValue(types.inputNetwork));
  const { data: dataAbis } = useAppSelector(selectValue(types.listAbis));
  const { account, requestNewAccount } = useMetamask();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<IUserInformation>({} as any);

  const handleCancel = () => {
    dispatch(closeModal(types.modalApprove));
  };

  const getProfileDetail = async (id: string) => {
    const [{ data: profileDetail }, { data: rating }, { data: proof }] = await Promise.all([
      getMeProfileDetail(id)(),
      getAverageRating(id)(),
      getListBountyTaskClaim()(),
    ]);

    try {
      if (profileDetail?.success) {
        setProfile({
          joinDate: profileDetail?.data?.created_at,
          loginType: "FACEBOOK",
          name: profileDetail?.data?.display_name,
          proof_of_work: proof?.data,
          rating: rating?.data,
          skills: profileDetail?.data?.skills,
          wallet_id: profileDetail?.data?.wallet_id,
          avatar: profileDetail?.data?.avatar,
        });
      }
    } catch {}
  };

  useEffect(() => {
    if (open) {
      getProfileDetail(data?.userId);
    }
  }, [open]);

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

  const handleApproveJoinTask = async (
    userId: string,
    userWalletAddress: string,
    chainId: string,
    walletOwnerAddress: string,
    smcTaskId: number,
    bountyTaskId: string
  ) => {
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
      dispatch(closeModal(types.modalApprove));
    } catch (error) {
      console.log("handleApproveJoinTask", error);
      message.error("Approve join task failed");
    }
    setLoading(false);
  };

  const handleCancelJoinTask = async (userId: string, bountyTaskId: string) => {
    setLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(requestCancelJoinTask(bountyTaskId, userId), true);

      if (success) {
        message.success("Decline join task successfully");
        dispatch(fetchData(types.listRequestJoin, getRequestJoinTaskList(bountyTaskId, 1, 20)));
        dispatch(closeModal(types.modalApprove));
      }
    } catch (error) {
      console.log("handleCancelJoinTask", error);
      message.success("Decline join task failed");
    }
    setLoading(false);
  };

  return (
    <Modal
      title="View application"
      open={open}
      width={640}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={() => handleCancelJoinTask(data?.userId, data?.bountyTaskId)} disabled={loading}>
          Decline
        </Button>,
        <Button
          className="mr-2"
          key="submit"
          type="primary"
          disabled={loading}
          loading={loading}
          onClick={() =>
            handleApproveJoinTask(
              data?.userId,
              data?.userWalletAddress,
              data?.chainId,
              data?.walletOwnerAddress,
              data?.smcTaskId,
              data?.bountyTaskId
            )
          }
        >
          Approve
        </Button>,
      ]}
    >
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center mr-1">
          <Avatar size={22} src={profile?.avatar} />
        </div>
        <div className="flex items-center mr-1">
          <span className="text-sm font-medium text-[#2B1C50]">{profile?.name}</span>
        </div>
        <span className="text-sm text-[#6C6684]">requested to contribute to this task</span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <div className="flex-1 text-base font-medium text-[#2B1C50]">Application</div>
          </div>
        </div>
        <div className="border rounded">
          <ReactQuill theme={null} value={data?.description || ""} readOnly={true} onChange={() => {}} />
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <Avatar size={22} src={profile.avatar} />
          </div>
          <div className="flex-1 text-base font-medium text-[#2B1C50]">Profile</div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <MoneyRecive size="20" color="#34C77B" />
          </div>
          <div className="flex-1 text-sm text-[#6C6684]">Proof of work</div>
          <div className="flex-1 text-base text-green-600">{profile?.proof_of_work?.count} tasks were done</div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <Star1 size="20" color="#fde047" />
          </div>
          <div className="flex-1 text-sm text-[#6C6684]">Rating</div>
          <div className="flex-1 text-base">
            {profile?.rating && Math.round(profile?.rating * 10) / 10}{" "}
            <Rate value={Math.round(profile.rating * 10) / 10} allowHalf disabled />
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <Medal size="20" color="#3E74FF" />
          </div>
          <div className="flex-1 text-sm text-[#6C6684]">Skill</div>
          <div className="flex-1 text-base align-center">
            {Array.isArray(profile?.skills) &&
              profile?.skills.map((item, index) => (
                <Tag
                  key={index.toString()}
                  className="px-5 py-1 mb-1 mr-1 font-normal text-sm rounded-[100px] text-[#3D2E7C]"
                  color="#EFF0FF"
                >
                  {item?.name}
                </Tag>
              ))}
          </div>
        </div>

        <div className="flex">
          <div className="flex items-center mr-2">
            <CalendarTick size="20" color="#6C6684" />
          </div>
          <div className="flex-1 text-sm text-[#6C6684]">Join date</div>
          <div className="flex-1">
            {isValid(new Date(profile.joinDate)) ? format(new Date(profile.joinDate), "LLLL do, yyyy").toString() : ""}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ApproveModal;
