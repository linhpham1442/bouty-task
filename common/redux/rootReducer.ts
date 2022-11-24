import { combineReducers } from "@reduxjs/toolkit";
import fetchReducer from "./reducers/fetchReducer";
import createModalReducer from "./reducers/modalReducer";
import types from "./types";

const rootReducers = combineReducers({
  [types.listBountyTask]: fetchReducer(
    types.listBountyTask,
    {
      [`${types.listBountyTask}__UPDATE_FILTER`]: (state: any, action: any) => {
        return {
          ...state,
          filter: {
            ...state.filter,
            ...action.payload,
          },
        };
      },
      [`${types.listBountyTask}__UPDATE_DATA`]: (state: any, action: any) => {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
    {
      filter: {
        title: "",
        key: "",
        order_by: "",
      },
    }
  ),
  [types.listToken]: fetchReducer(
    types.listToken,
    {
      [`${types.listToken}__UPDATE_FILTER`]: (state: any, action: any) => {
        return {
          ...state,
          filter: {
            ...state.filter,
            ...action.payload,
          },
        };
      },
      [`${types.listToken}__UPDATE_DATA`]: (state: any, action: any) => {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
    {
      filter: {
        title: "",
        key: "",
        order_by: "",
      },
    }
  ),

  [types.listTopBountyTask]: fetchReducer(types.listTopBountyTask),
  [types.listTaskDoing]: fetchReducer(types.listTaskDoing),
  [types.listTaskInreview]: fetchReducer(types.listTaskInreview),
  [types.listTaskPaid]: fetchReducer(types.listTaskPaid),
  [types.listTaskCancelled]: fetchReducer(types.listTaskCancelled),
  [types.listRequestJoin]: fetchReducer(types.listRequestJoin),
  [types.taskDetail]: fetchReducer(types.taskDetail),
  [types.modalRating]: createModalReducer(types.modalRating),
  [types.modalSubmission]: createModalReducer(types.modalSubmission),
  [types.modalReview]: createModalReducer(types.modalReview),
  [types.inputCategory]: fetchReducer(types.inputCategory),
  [types.inputSkill]: fetchReducer(types.inputSkill),
  [types.inputNetwork]: fetchReducer(types.inputNetwork),
  [types.listAbis]: fetchReducer(types.listAbis),
  [types.listCategory]: fetchReducer(types.listCategory),
  [types.notificationAll]: fetchReducer(types.notificationAll),
  [types.notificationRequest]: fetchReducer(types.notificationRequest),
  [types.modalApplyJoinTask]: createModalReducer(types.modalApplyJoinTask),
  [types.modalApprove]: createModalReducer(types.modalApprove),
  [types.ratingByUserTask]: fetchReducer(types.ratingByUserTask),
  [types.skillsModal]: createModalReducer(types.skillsModal),
  [types.proofModal]: createModalReducer(types.proofModal),
});

export default rootReducers;
