import get from "lodash/get";
import { createSelector } from "@reduxjs/toolkit";

export const getTypeSuccess = (type: string) => `${type}_SUCCESS`;
export const getTypeFail = (type: string) => `${type}_FAIL`;
export const getTypeUpdate = (type: string) => `${type}_UPDATE`;
export const getTypeClear = (type: string) => `${type}_CLEAR`;
export const getTypeRemove = (type: string) => `${type}_REMOVE`;
export const getTypeAdd = (type: string) => `${type}_ADD`;
export const getTypeOpenModal = (type: string) => `${type}_OPEN`;
export const getTypeCloseModal = (type: string) => `${type}_CLOSE`;

// get value from object
export const getValue =
  (path: string, defaultValue: any = undefined) =>
  (object: any) => {
    return get(object, path, defaultValue);
  };

export const selectValue = (path: string, defaultValue?: any) => createSelector(getValue(path, defaultValue), (data) => data);
