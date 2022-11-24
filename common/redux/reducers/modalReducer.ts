import { createReducer } from "@reduxjs/toolkit";
import { getTypeCloseModal, getTypeOpenModal } from "../utils";

const initialState = {
  open: false,
  data: null as any,
  action: null as any,
};

const createModalReducer = (type: string) =>
  createReducer(initialState, {
    [getTypeOpenModal(type)]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    [getTypeCloseModal(type)]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  });

export default createModalReducer;
