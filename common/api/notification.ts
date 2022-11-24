import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { NotificationsResponse, Notification } from "@/common/types";
import queryString from "query-string";

export const getNoticationRequest =
  (owner_id: string, page?: number, page_size?: number, isCache: boolean = false) =>
  () =>
    fetchApi<NotificationsResponse<Notification>>(
      `/tasks-request-join/list-by-owner?${queryString.stringify({ owner_id, page, page_size })}`,
      {},
      METHOD.GET,
      {},
      isCache
    );

export const getNoticationList =
  (user_id: string, page?: number, page_size?: number, type?: string, isCache: boolean = false) =>
  () =>
    fetchApi<NotificationsResponse<Notification>>(
      `/notification/list?${queryString.stringify({ user_id, page, page_size, type })}`,
      {},
      METHOD.GET,
      {},
      isCache
    );