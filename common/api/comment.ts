import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { ListResponse, IComment } from "@/common/types";
import queryString from "query-string";

export const getCommentList =
  (task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<IComment[]>>(`comment/list?${queryString.stringify({ task_id })}`, {}, METHOD.GET, {}, isCache);

export const createComment =
  (task_id: string, content: string, isCache: boolean = false) =>
  () =>
    fetchApi<IComment>(`comment/create`, { task_id, content }, METHOD.POST, {}, isCache);

export const getListDiscuss =
  (bounty_task_id: string,limit?: number , offset?: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<IComment[]>>(`comment/list-discuss?${queryString.stringify({ bounty_task_id, limit, offset })}`, {}, METHOD.GET, {}, isCache);

export const createListDiscuss =
  (bounty_task_id: string, content: string, isCache: boolean = false) =>
  () =>
    fetchApi<IComment>(`comment/create-discuss`, { bounty_task_id, content }, METHOD.POST, {}, isCache);
