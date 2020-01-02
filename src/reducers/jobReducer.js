import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.ADD_JOB:
        case ActionEvent.UPDATE_JOB:
        case ActionEvent.GET_JOBS:
        case ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW:
        case ActionEvent.GET_JOB_DETAIL:
        case ActionEvent.GET_MY_JOB_POST:
        case ActionEvent.GET_JOB_RECRUITMENT:
        case ActionEvent.APPLY_JOB:
        case ActionEvent.GET_MY_RECRUITMENT_BY_JOB:
        case ActionEvent.GET_USER_APPLY_HISTORY:
        case ActionEvent.DROP_APPLY:
        case ActionEvent.GET_JOB_SAVE:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type,
                isSaving: false,
            }
        case ActionEvent.SAVE_JOB:
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type,
                isSaving: true,
            }
        case getActionSuccess(ActionEvent.ADD_JOB):
        case getActionSuccess(ActionEvent.UPDATE_JOB):
        case getActionSuccess(ActionEvent.GET_JOBS):
        case getActionSuccess(ActionEvent.GET_JOB_DETAIL):
        case getActionSuccess(ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW):
        case getActionSuccess(ActionEvent.GET_MY_JOB_POST):
        case getActionSuccess(ActionEvent.GET_JOB_RECRUITMENT):
        case getActionSuccess(ActionEvent.APPLY_JOB):
        case getActionSuccess(ActionEvent.GET_MY_RECRUITMENT_BY_JOB):
        case getActionSuccess(ActionEvent.GET_USER_APPLY_HISTORY):
        case getActionSuccess(ActionEvent.DROP_APPLY):
        case getActionSuccess(ActionEvent.SAVE_JOB):
        case getActionSuccess(ActionEvent.GET_JOB_SAVE):
            return {
                ...state,
                isLoading: false,
                isSaving: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                isSaving: false,
                error: action.payload.error,
                errorCode: action.payload.errorCode,
                action: action.type
            }
        default:
            return state;
    }
}