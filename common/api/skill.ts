import { ISkill } from "../types";
import { fetchApi } from "../utils";
import { METHOD } from "../utils/constants";

export const getListSkillByIds =
(ids: string[], isCache: boolean = false) =>
() =>
  fetchApi<ISkill[]>(`skill/detail/multiple`, {ids}, METHOD.POST, {}, isCache);