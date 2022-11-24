import { IAuthInformation } from "./../types/index";
import { IMeProfile, UserRole } from "@/common/types";
import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import queryString from "query-string";
import { ListResponse, Rating } from "@/common/types";
export interface IUpdateProfileDTO {
  roleType?: UserRole;
  wallet_address?: string;
  skills?: string[];
}

export const getMeProfile = (isCache: boolean = false) => {
  return fetchApi<IMeProfile>(`profile/me`, null, METHOD.GET, {}, isCache);
};

export const updateUserProfile = (id: string, body: IUpdateProfileDTO, isCache: boolean = false) => {
  return fetchApi<IMeProfile>(`profile/update/${id}`, body, METHOD.PUT, {}, isCache);
};

export const getMeProfileDetail =
  (id: string, isCache: boolean = false) =>
  () =>
    fetchApi<IMeProfile>(`profile/detail/${id}`, {}, METHOD.GET, {}, isCache);

export const getOAuth2Information = (isCache: boolean = false) => {
  return fetchApi<IAuthInformation>(`auth/information`, null, METHOD.GET, {}, isCache);
};

export const getRatingList =
  (user_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<Rating[]>>(`rating/list?${queryString.stringify({ user_id })}`, {}, METHOD.GET, {}, isCache);
