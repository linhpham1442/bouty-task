import { getBountyTaskList } from "@/common/api/bountyTask";
import { getAverageRating } from "@/common/api/rating";
import { getMeProfile, getOAuth2Information, updateUserProfile } from "@/common/api/user";
import { AuthContext } from "@/common/hooks/useAuth";
import useMetamask from "@/common/hooks/useMetamask";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { BountyTask, FetchReducer, IUserInformation, ListResponse } from "@/common/types";
import { Button } from "@mantine/core";
import { Avatar, Pagination, Rate } from "antd";
import { format, isValid } from "date-fns";
import { CalendarTick, Edit2, EmptyWallet, MoneyRecive, Star1, Medal } from "iconsax-react";
import { Fragment, memo, useContext, useEffect, useMemo, useState } from "react";
// import BountyTaskItem from "../BountyTaskList/BountyTaskItem";
import FacebookIcon from "/public/svg/icons/facebook-24.svg";
import GoogleIcon from "/public/svg/icons/google-24.svg";
import TwitterIcon from "/public/svg/icons/twitter-24.svg";
import { formatNumber } from "@/common/utils";
import { getProofOfWork } from "@/common/api/proofOfWork";
import Review from "./Review";

const OwnerProfile = (): JSX.Element => {
  const { data: dataTasks, loading } = useAppSelector<ListResponse<{ data: BountyTask[]; count: number }> & FetchReducer>(
    selectValue(types.listBountyTask)
  );
  const { account, requestNewAccount } = useMetamask();
  const { state } = useContext(AuthContext);
  const [profile, setProfile] = useState<IUserInformation>({} as any);
  const [filter, setFilter] = useState({ page: 1, pageSize: 20 });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData(types.listBountyTask, getBountyTaskList(filter.page, filter.pageSize, "", null, state.profile.id)));
  }, [filter]);

  const getProfile = async () => {
    const {
      data: { data: profile },
    } = await getMeProfile();
    const {
      data: { data: authInformation },
    } = await getOAuth2Information();

    setProfile({
      joinDate: profile?.created_at,
      loginType: authInformation.type,
      name: profile?.display_name,
      proof_of_work: [],
      rating: profile?.rating,
      skills: profile?.skills,
      wallet_id: profile.wallet_id,
      avatar: profile.avatar,
    });
  };

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

  useEffect(() => {
    if (state.profile.id) {
      getProfile();
    }
  }, [state.profile.id]);

  const skills = ["content marketing", "SEO"];

  return (
    <div className="mx-8">
      <div className="grid justify-items-center">
        <Avatar size={100} src={profile.avatar} />
      </div>
      {/* Information */}
      <div className="p-2 my-6 border rounded">
        <div className="m-6 space-y-4 divide-y divide-gray-200">
          <div className="flex flex-wrap my-2 space-y-1">
            <h2 className="mr-4 text-xl font-semibold sm:text-2xl">Information</h2>
          </div>
          {/* footer inform */}
          <div>
            <div className="grid grid-cols-2 m-5">
              <div className="flex flex-col gap-4">
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
              <div className="flex flex-col gap-4">
                {/* <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <MoneyRecive size="20" color="#34C77B" />
                      </div>
                      <div className="flex-1 text-sm text-[#6C6684]">Tasks created</div>
                      <div className="flex-1 text-base">{dataTasks.count || "0"}</div>
                    </div> */}

                {/* <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <MoneyRecive size="20" color="#34C77B" />
                  </div>
                  <div className="flex-1 text-sm text-[#6C6684]">Proof of work</div>
                  <div className="flex-1 text-base text-green-600">${formatNumber(100)} earned</div>
                </div> */}

                {/* <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <Star1 size="20" color="#fde047" />
                  </div>
                  <div className="flex-1 text-sm text-[#6C6684]">Rating</div>
                  <div className="flex-1 text-base">
                    {profile?.rating && Math.round(profile?.rating * 10) / 10} <Rate value={Math.round(profile.rating * 10) / 10} allowHalf disabled />
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
                        <span key={index.toString()} className="text-sm text-[#3E74FF] bg-[#D3E0FF] rounded-full px-2 py-0.5 mr-2">
                          {item?.name}
                        </span>
                      ))}
                  </div>
                </div> */}

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
            </div>
          </div>
        </div>
      </div>

      {/* Review */}
      <Review user_id={state.profile.id} />

      {/* Task created */}
      {/* <div className="">
          <div className="flex items-center">
            <div className="flex-none my-6 text-xl font-semibold">Task Created</div>
            <div className="flex-none border rounded-full w-8 h-8 text-center pt-0.5 ml-2 text-orange-600 bg-amber-300 border-amber-300">
              {dataTasks.count || "0"}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {dataTasks.data?.length > 0 ? dataTasks?.data.map((item) => <BountyTaskItem key={item?._id} data={item} />) : null}
          </div>
          {dataTasks.data?.length > 0 && (
            <div className="grid mt-4 justify-items-center">
              <Pagination
                defaultCurrent={filter.page}
                total={dataTasks.count}
                pageSize={filter.pageSize}
                onChange={(page: number, pageSize: number) => {
                  setFilter({ ...filter, page, pageSize });
                }}
              />
            </div>
          )}
        </div> */}
    </div>
  );
};

export default memo(OwnerProfile);
