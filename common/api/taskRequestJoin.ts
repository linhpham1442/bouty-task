import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { ListResponse, TaskRequestJoin } from "@/common/types";
import queryString from "query-string";

export const requestJoinTask =
  (bounty_task_id: string, description: string, isCache: boolean = false) =>
  () =>
    fetchApi<TaskRequestJoin>(`tasks-request-join/create`, { bounty_task_id, description }, METHOD.POST, {}, isCache);

export const requestCancelJoinTask =
  (bounty_task_id: string, user_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<TaskRequestJoin>(
      `tasks-request-join/cancel?${queryString.stringify({ bounty_task_id, user_id })}`,
      null,
      METHOD.GET,
      {},
      isCache
    );

export const checkRequestedJoinTask =
  (bounty_task_id: string, user_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<boolean>(
      `tasks-request-join/check-requested?${queryString.stringify({ bounty_task_id, user_id })}`,
      null,
      METHOD.GET,
      {},
      isCache
    );

export const getRequestJoinTaskList =
  (bounty_task_id: string, page: number, page_size: number, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<TaskRequestJoin[]>>(
      `tasks-request-join/list?${queryString.stringify({ page, page_size, bounty_task_id })}`,
      {},
      METHOD.GET,
      {},
      isCache
    );
