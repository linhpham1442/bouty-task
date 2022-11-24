import { fetchApi } from "@/common/utils";
import { METHOD } from "@/common/utils/constants";
import { ListResponse, UserToken, Category, Network, Skill, Abi } from "@/common/types";
import queryString from "query-string";

export const createUserToken =
  (chain_id: string, token_address: string, token_name: string, isCache: boolean = false) =>
  () =>
    fetchApi<UserToken>(`metadata/user-token`, { chain_id, token_address, name: token_name }, METHOD.POST, {}, isCache);

export const getListToken =
  (network_id: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<UserToken[]>>(`metadata/user-tokens?${queryString.stringify({ network_id })}`, {}, METHOD.GET, {}, isCache);

export const getCategories =
  (search?: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<Category[]>>(`metadata/categories?${queryString.stringify({ search })}`, {}, METHOD.GET, {}, isCache);

export const getSkills =
  (category_id: string, search: string, isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<Skill[]>>(`metadata/skills?${queryString.stringify({ category_id, search })}`, {}, METHOD.GET, {}, isCache);

export const getNetworks =
  (isCache: boolean = false) =>
  () =>
    fetchApi<ListResponse<Network[]>>(`metadata/networks`, {}, METHOD.GET, {}, isCache);

export const getAllAbi =
  (isCache: boolean = false) =>
  () =>
    fetchApi<Abi[]>(`/metadata/abis`, {}, METHOD.GET, {}, isCache);
