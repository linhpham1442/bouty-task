import { fetchApi } from "../utils";
import { METHOD } from "../utils/constants";
import { Rating } from "@/common/types";
import queryString from "query-string";

export const submitRating =
  (user_id: string, task_id: string, rating: number, comment: string, isCache: boolean = false) =>
  () => {
    fetchApi<Rating>(`rating/create`, { user_id, task_id, rating, comment }, METHOD.POST, {}, isCache);
  };

export const getAverageRating =
  (id: string, isCache: boolean = false) =>
  () => {
    return fetchApi<number>(`rating/average?user_id=${id}`, {}, METHOD.GET, {}, isCache);
  };

export const getRatingByUserTask =
  (user_id: string, task_id: string, isCache: boolean = false) =>
  () => {
    return fetchApi<number>(`rating/get-by-user-task?${queryString.stringify({ user_id, task_id })}`, {}, METHOD.GET, {}, isCache);
  };
