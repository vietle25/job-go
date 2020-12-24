import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.GET_FRIENDS_LIST_USER:
        case ActionEvent.GET_ALL_LIST_MEMBER:
        case ActionEvent.GET_USER_REQUEST:
        case ActionEvent.INSERT_GROUP_STATUS_LOG:
        case ActionEvent.UPDATE_GROUP_MEMBER:
        case ActionEvent.GET_LIST_ADMIN:
            {
                return {
                    ...state,
                    isLoading: true,
                    error: null,
                    errorCode: ErrorCode.ERROR_INIT,
                    data: null,
                    action: action.type
                }
            }
        case getActionSuccess(ActionEvent.GET_FRIENDS_LIST_USER):
        case getActionSuccess(ActionEvent.GET_ALL_LIST_MEMBER):
        case getActionSuccess(ActionEvent.GET_USER_REQUEST):
        case getActionSuccess(ActionEvent.INSERT_GROUP_STATUS_LOG):
        case getActionSuccess(ActionEvent.UPDATE_GROUP_MEMBER):
        case getActionSuccess(ActionEvent.GET_LIST_ADMIN):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.INSERT_MULTI_GROUP_STATUS_LOG:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.INSERT_MULTI_GROUP_STATUS_LOG):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
                errorCode: action.payload.errorCode,
                action: action.type
            }
        case ActionEvent.CHANGE_SEARCH_TEXT:
            const searchText = action.payload.data;
            return {
                ...state,
                data: searchText,
                errorCode: 0,
                action: action.type,
            }
            break;
        default:
            return state;
    }
}