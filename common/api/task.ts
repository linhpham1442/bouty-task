import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { ListResponse, Task, TaskType } from "@/common/types";
import queryString from "query-string";

export const countTaskByBountyTask =
  (bounty_task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<number>(`tasks/count-by-bounty-task?${queryString.stringify({ bounty_task_id })}`, null, METHOD.GET, {}, isCache);

export const getTaskList =
  (bounty_task_id: string, type: number, page: number, page_size: number, search: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<Task[]>>(
      `tasks/list?${queryString.stringify({ page, page_size, search, bounty_task_id, type })}`,
      {},
      METHOD.GET,
      {},
      isCache
    );

export const getTaskDetail =
  (task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<Task>(`tasks/detail/${task_id}`, null, METHOD.GET, {}, isCache);

export const joinTask =
  (bounty_task_id: string, user_id?: string,  isCache: boolean = false) =>
  () =>
    fetchApi<Task>(`tasks/create`, { bounty_task_id, user_id }, METHOD.POST, {}, isCache);

export const cancelTask =
  (bounty_task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<Task>(`tasks/cancel`, { bounty_task_id }, METHOD.PUT, {}, isCache);

// export const submitTask =
//   (task_id: string, isCache: boolean = false) =>
//   () =>
//     fetchApi<Task>(`tasks/submit`, { task_id }, METHOD.PUT, {}, isCache);

export const claimTask =
  (task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<Task>(`tasks/claim`, { task_id }, METHOD.PUT, {}, isCache);

export const getTaskByUserBountyTask =
  (bounty_task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<Task>(`tasks/get-by-user?${queryString.stringify({ bounty_task_id })}`, null, METHOD.GET, {}, isCache);

export type GetTaskByOwnerFilterType = {
  owner_id: string;
  type?: TaskType;
  page: number;
  page_size: number;
  search?: string;
}
export const getTaskByOwner = async(filter: GetTaskByOwnerFilterType, isCache: boolean = false) => 
    await fetchApi<ListResponse<Task[]>>(`tasks/list-by-owner?${queryString.stringify(filter)}`, null, METHOD.GET, {}, isCache);