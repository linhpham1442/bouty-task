import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { ListResponse, Submission } from "@/common/types";
import queryString from "query-string";

export const submitTask =
  (bounty_task_id: string, content: string, isCache: boolean = false) =>
  () =>
    fetchApi<Submission>(`submission/create`, { bounty_task_id, content }, METHOD.POST, {}, isCache);

export const updateSubmitTask =
  (task_id: string, bounty_task_id: string, content: string, isCache: boolean = false) =>
  () =>
    fetchApi<Submission>(`submission/update/${bounty_task_id}`, { task_id, content }, METHOD.PUT, {}, isCache);

export const getSubmissionByTask =
  (task_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<Submission>(`submission/get-by-task?${queryString.stringify({ task_id })}`, null, METHOD.GET, {}, isCache);
