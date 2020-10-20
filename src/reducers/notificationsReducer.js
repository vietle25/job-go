import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.GET_NOTIFICATIONS:
        case ActionEvent.GET_NOTIFICATIONS_VIEW:
        case ActionEvent.SEARCH_NOTIFICATION:
        case ActionEvent.READ_ALL_NOTIFICATION:
        case ActionEvent.GET_NOTIFICATIONS_BY_TYPE:
        case ActionEvent.SEND_REVIEW_BRANCH:
        case ActionEvent.DELETE_NOTIFICATIONS:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case ActionEvent.COUNT_NEW_NOTIFICATION:
        case ActionEvent.SEEN_NOTIFICATION:
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.SEND_REVIEW_BRANCH):
        case getActionSuccess(ActionEvent.GET_NOTIFICATIONS):
        case getActionSuccess(ActionEvent.GET_NOTIFICATIONS_VIEW):
        case getActionSuccess(ActionEvent.SEARCH_NOTIFICATION):
        case getActionSuccess(ActionEvent.READ_ALL_NOTIFICATION):
        case getActionSuccess(ActionEvent.GET_NOTIFICATIONS_BY_TYPE):
        case getActionSuccess(ActionEvent.DELETE_NOTIFICATIONS):
        case getActionSuccess(ActionEvent.SEEN_NOTIFICATION):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.INSERT_GROUP_STATUS_LOG_IN_NOTIFICATION:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
            break;
        case getActionSuccess(ActionEvent.INSERT_GROUP_STATUS_LOG_IN_NOTIFICATION):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
            break;
        default:
            return state;
    }
}
