import { fetchApi } from "../utils";
import { METHOD } from "../utils/constants";
  
export const getProofOfWork =
(id: string, isCache: boolean = false) =>
() => {
  return fetchApi<any>(`proof-of-work/${id}`, {}, METHOD.GET, {}, isCache);
};

export const getListBountyTaskClaim =
(isCache: boolean = false) =>
() => {
  return fetchApi<any>(`proof-of-work/get-list-bounty-task-claim`, {}, METHOD.GET, {}, isCache);
};
