import { getBountyTaskList } from "@/common/api/bountyTask";
import { getAverageRating } from "@/common/api/rating";
import { getListSkillByIds } from "@/common/api/skill";
import { getTaskByOwner, getTaskByUserBountyTask } from "@/common/api/task";
import { getMeProfile, getOAuth2Information, updateUserProfile } from "@/common/api/user";
import { AuthContext } from "@/common/hooks/useAuth";
import useMetamask from "@/common/hooks/useMetamask";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { BountyTask, FetchReducer, IUserInformation, ListResponse, Task, TaskType } from "@/common/types";
import { Button } from "@mantine/core";
import { Avatar, Image, Pagination, Rate, Tag, Button as ButtonAntd, Modal, Typography } from "antd";
import { format, previousDay } from "date-fns";
import { CalendarTick, Edit2, EmptyWallet, Like1, Medal, MoneyRecive, Star1 } from "iconsax-react";
import { useRouter } from "next/router";
import { Fragment, memo, useContext, useEffect, useMemo, useState } from "react";
import BountyTaskItem from "../BountyTaskList/BountyTaskItem";
import DefaultAvatar from "/public/images/default-avatar.png";
import FacebookIcon from "/public/svg/icons/facebook-24.svg";
import GoogleIcon from "/public/svg/icons/google-24.svg";
import TwitterIcon from "/public/svg/icons/twitter-24.svg";
import { getListBountyTaskClaim } from "@/common/api/proofOfWork";
import ProofOfWorkModal from "@/common/components/ProofOfWorkModal";
import { openModal } from "@/common/redux/actions/modalAction";
import SkillsModal from "@/common/components/SkillsModal";
import { Skill } from "@/common/types";
import _map from "lodash/map";
import _size from "lodash/size";

const { Text } = Typography;

const FreelancerProfile = (): JSX.Element => {
  const router = useRouter();
  const { account, requestNewAccount } = useMetamask();
  const [profile, setProfile] = useState<IUserInformation>({} as any);
  const { state } = useContext(AuthContext);
  const [filterDoingList, setFilterDoingList] = useState({
    page: 1,
    pageSize: 20,
  });

  const [filterInReviewList, setFilterInReviewList] = useState({
    page: 1,
    pageSize: 20,
  });

  const [filterPaidList, setFilterPaidList] = useState({
    page: 1,
    pageSize: 20,
  });

  const [doingList, setDoingList] = useState<ListResponse<Task[]>>({
    count: 0,
    data: [],
  });
  const [inReviewList, setInReviewList] = useState<ListResponse<Task[]>>({
    count: 0,
    data: [],
  });
  const [paidList, setPaidList] = useState<ListResponse<Task[]>>({
    count: 0,
    data: [],
  });

  const dispatch = useAppDispatch();

  const handleConnectWallet = async () => {
    try {
      const newAccount = await requestNewAccount();
      await updateUserProfile(state.profile.id, {
        wallet_address: newAccount,
      });
      setProfile({ ...profile, wallet_id: newAccount });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const newAccount = "";
      await updateUserProfile(state.profile.id, {
        wallet_address: newAccount,
      });
      setProfile({ ...profile, wallet_id: newAccount });
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    const {
      data: { data: profile },
    } = await getMeProfile();

    const [
      {
        data: { data: ratingPointAvg },
      },
      // {
      //   data: { data: skills },
      // },
      {
        data: { data: authInformation },
      },
      {
        data: { data: proof },
      },
    ] = await Promise.all([
      getAverageRating(profile._id)(),
      // getListSkillByIds(profile.skillIds)(),
      getOAuth2Information(),
      getListBountyTaskClaim()(),
    ]);

    setProfile({
      joinDate: profile.created_at,
      loginType: authInformation.type,
      name: profile.display_name,
      proof_of_work: proof,
      rating: ratingPointAvg,
      skills: profile?.skills,
      wallet_id: profile.wallet_id,
      avatar: profile.avatar,
    });
  };

  useEffect(() => {
    if (state.profile.id) {
      (async () => {
        const {
          data: { data: _doingList },
        } = await getTaskByOwner({
          owner_id: state.profile.id,
          type: TaskType.Doing,
          page: filterDoingList.page,
          page_size: filterDoingList.pageSize,
        });
        setDoingList(_doingList);
      })();
    }
  }, [filterDoingList, state.profile.id]);

  useEffect(() => {
    if (state.profile.id) {
      (async () => {
        const {
          data: { data: _paidList },
        } = await getTaskByOwner({
          owner_id: state.profile.id,
          type: TaskType.Paid,
          page: filterPaidList.page,
          page_size: filterPaidList.pageSize,
        });
        setPaidList(_paidList);
      })();
    }
  }, [filterPaidList, state.profile.id]);

  useEffect(() => {
    if (state.profile.id) {
      (async () => {
        const {
          data: { data: _inReviewList },
        } = await getTaskByOwner({
          owner_id: state.profile.id,
          type: TaskType.InReview,
          page: filterInReviewList.page,
          page_size: filterInReviewList.pageSize,
        });
        setInReviewList(_inReviewList);
      })();
    }
  }, [filterInReviewList, state.profile.id]);

  useEffect(() => {
    if (state.profile.id) {
      getProfile();
    }
  }, [state.profile.id]);

  const loginInformation: { icon: any; name: string } = useMemo(() => {
    switch (profile.loginType) {
      case "FACEBOOK": {
        return {
          icon: FacebookIcon,
          name: "Facebook",
        };
      }
      case "TWITTER": {
        return {
          icon: TwitterIcon,
          name: "Twitter",
        };
      }

      case "GOOGLE": {
        return {
          icon: GoogleIcon,
          name: "Google",
        };
      }
      default: {
        return {
          icon: Fragment,
          name: "",
        };
      }
    }
  }, [profile.loginType]);

  const handleUpdateSkillProfile = (skills: Skill[]) => {
    setProfile((prev) => ({ ...prev, skills }));
  };

  return (
    <>
      <div className="mx-8">
        {/* Avatar */}
        <div className="grid justify-items-center">
          <Avatar
            size={100}
            src={<Image src={profile.avatar} fallback={DefaultAvatar.src} preview={false} referrerPolicy={"no-referrer"} alt="" />}
          />
        </div>
        {/* Information */}
        <div className="border-b">
          <div className="p-2 my-6 border rounded">
            <div className="m-6 space-y-4 divide-y divide-gray-200">
              <div className="flex flex-wrap my-2 space-y-1">
                <h2 className="mr-4 text-xl font-semibold sm:text-2xl">Information</h2>
              </div>
              {/* footer inform */}
              <div>
                <div className="grid grid-cols-2 my-5">
                  <div className="flex flex-col gap-7">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <loginInformation.icon />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">{loginInformation.name}</div>
                      <div className="flex-1">{profile.name}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <EmptyWallet size="20" color="#625DF5" />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">Wallet</div>
                      <div className="flex-1 break-all px-2">{profile.wallet_id || "No account connected"}</div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center mr-2 w-5"></div>
                      <div className="flex-1"></div>
                      <div className="flex-1">
                        <Button size="md" onClick={profile.wallet_id ? handleDisconnectWallet : handleConnectWallet}>
                          <div className="flex justify-center text-base">
                            <span className="whitespace-nowrap">{profile.wallet_id ? "Disconnect wallet" : "Connect wallet"}</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-7">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <MoneyRecive size="20" color="#34C77B" />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">Proof of work</div>
                      <div className="flex-1 text-base text-[#2B1C50]">
                        {_size(profile?.proof_of_work?.count)} task were done{" "}
                        <Text underline onClick={() => dispatch(openModal(types.proofModal, profile?.proof_of_work?.data))}>
                          View
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <Star1 size="20" color="#FF8A65" />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">Rating</div>
                      <div className="flex-1 flex items-center">
                        {profile?.rating && Math.round(profile?.rating * 10) / 10}
                        <Rate className="flex mt-[-4px] pl-3" value={Math.round(profile.rating * 10) / 10} allowHalf disabled />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <Medal size="20" color="#3D9ACC" />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">Skill</div>
                      <div className="flex items-center flex-1 flex-wrap">
                        {Array.isArray(profile?.skills) &&
                          profile.skills?.map((skill) => {
                            return (
                              <Tag
                                key={skill._id}
                                className="px-5 py-1 mb-1 mr-1 font-normal text-sm rounded-[100px] text-[#3D2E7C]"
                                color="#EFF0FF"
                              >
                                {skill.name}
                              </Tag>
                            );
                          })}

                        <div>
                          <ButtonAntd
                            type="text"
                            shape="circle"
                            icon={<Edit2 size="23" color="#6C6684" variant="Outline" />}
                            onClick={() => dispatch(openModal(types.skillsModal, {}))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex items-center mr-2">
                        <CalendarTick size="20" color="#6C6684" />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">Join date</div>
                      <div className="flex-1">{profile.joinDate ? format(new Date(profile.joinDate), "LLLL do, yyyy").toString() : ""}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Task section */}
        <div className="flex items-center my-6">
          <div className="flex items-center">
            <Like1 size="32" color="#000" />
          </div>
          <div className="flex-none ml-2 text-xl font-semibold">Contribution</div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div className="flex-none my-6 text-base font-medium leading-6">Doing</div>
            <div className="flex-none flex justify-center items-center border rounded-full min-w-6 h-6 text-center text-[#FF9900] bg-[#FFF0BC] text-sm border-none px-1">
              {doingList.count}
            </div>
          </div>
          <div className="flex flex-col w-full">
            {doingList.data?.map((i) => {
              return (
                <TaskItem
                  key={i._id}
                  mainTaskName={(i.bounty_task_id as BountyTask).title}
                  mainTaskId={(i.bounty_task_id as BountyTask)._id}
                />
              );
            })}
          </div>
          <div className="grid mt-4 justify-items-center">
            <Pagination
              defaultCurrent={filterDoingList.page}
              total={doingList.count}
              current={filterDoingList.page}
              pageSize={filterDoingList.pageSize}
              onChange={(page: number, pageSize: number) => {
                setFilterDoingList({
                  ...filterDoingList,
                  page,
                  pageSize,
                });
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div className="flex-none my-6 text-base font-medium leading-6">In review</div>
            <div className="flex-none flex justify-center items-center border rounded-full min-w-6 h-6 text-center text-[#3E74FF] bg-[#D3E0FF] text-sm border-none px-1">
              {inReviewList.count}
            </div>
          </div>
          <div className="flex flex-col w-full">
            {inReviewList.data?.map((i) => {
              return (
                <TaskItem
                  key={i._id}
                  mainTaskName={(i.bounty_task_id as BountyTask).title}
                  mainTaskId={(i.bounty_task_id as BountyTask)._id}
                />
              );
            })}
          </div>

          <div className="grid mt-4 justify-items-center">
            <Pagination
              defaultCurrent={filterInReviewList.page}
              total={inReviewList.count}
              current={filterInReviewList.page}
              pageSize={filterInReviewList.pageSize}
              onChange={(page: number, pageSize: number) => {
                setFilterInReviewList({
                  ...filterInReviewList,
                  page,
                  pageSize,
                });
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div className="flex-none my-6 text-base font-medium leading-6">Paid</div>
            <div className="flex-none flex justify-center items-center border rounded-full min-w-6 h-6 text-center text-[#34C77B] bg-[#CEFFE6] text-sm border-none px-1">
              {paidList.count}
            </div>
          </div>
          <div className="flex flex-col w-full">
            {paidList.data?.map((i) => {
              return <TaskItem key={i._id} mainTaskName={i?.bounty_task?.title} mainTaskId={i?.bounty_task?._id} />;
            })}
          </div>
          <div className="grid mt-4 justify-items-center">
            <Pagination
              defaultCurrent={filterPaidList.page}
              total={paidList.count}
              current={filterPaidList.page}
              pageSize={filterPaidList.pageSize}
              onChange={(page: number, pageSize: number) => {
                setFilterPaidList({
                  ...filterPaidList,
                  page,
                  pageSize,
                });
              }}
            />
          </div>
        </div>
      </div>
      <SkillsModal
        currentSkills={_map(profile?.skills, (item) => item?._id)}
        userId={state?.profile?.id}
        handleUpdateSkillProfile={handleUpdateSkillProfile}
      />
      <ProofOfWorkModal />
    </>
  );
};

export default memo(FreelancerProfile);

interface ITaskItemProps {
  mainTaskName: string;
  mainTaskId: string;
}

function TaskItem({ mainTaskName, mainTaskId }: ITaskItemProps) {
  const router = useRouter();
  return (
    <div className="flex gap-[6px] items-center w-full py-3 border-b-[1px]">
      <Avatar src={DefaultAvatar.src} size={20} />
      <div className="text-[#6C6684] text-sm flex-1 min-w-0">
        <span className="text-black font-medium">You</span> submitted task in main task{" "}
        <span className="text-black font-medium">{mainTaskName}</span>
      </div>

      <Button
        className="ml-auto"
        onClick={() => {
          router.push(`/bounty-task/${mainTaskId}`);
        }}
      >
        View main task
      </Button>
    </div>
  );
}
