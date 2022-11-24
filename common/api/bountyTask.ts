import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { ListResponse, BountyTask } from "@/common/types";
import queryString from "query-string";

export const getBountyTaskList =
  (page: number, page_size: number, search: string, category_id?: string, owner_id?: string, sort?: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<BountyTask[]>>(
      `bounty-tasks/list?${queryString.stringify({ page, page_size, search, sort, category_id, owner_id })}`,
      {},
      METHOD.GET,
      {},
      isCache
    );

export const getBountyTaskDetail =
  (id: string, isCache: boolean = false) =>
  () =>
    fetchApi<BountyTask>(`bounty-tasks/detail/${id}`, null, METHOD.GET, {}, isCache);

export const createBountyTask =
  (data: any, isCache: boolean = false) =>
  () =>
    fetchApi<BountyTask>(`bounty-tasks/create`, data, METHOD.POST, {}, isCache);

export const updateBountyTask =
  (id: string, data: any, isCache: boolean = false) =>
  () =>
    fetchApi<BountyTask>(`bounty-tasks/update/${id}`, data, METHOD.PUT, {}, isCache);
