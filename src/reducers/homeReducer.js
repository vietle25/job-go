import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.NOTIFY_LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_SUCCESS,
                data: null,
                action: action.type,
            }
        case ActionEvent.DELETE_FRIEND_SUGGESTION:
        case ActionEvent.GET_USER_INFO:
        case ActionEvent.GET_CONFIG:
        case ActionEvent.GET_UPDATE_VERSION:
        case ActionEvent.USER_DEVICE_INFO:
        case ActionEvent.GET_WALLET:
        case ActionEvent.GET_BANNER:
        case ActionEvent.GET_PROFILE_ADMIN:
        case ActionEvent.CHECK_EXIST_CONVERSATION_IN_HOME:
        case ActionEvent.CHECK_CONVERSATION_ACTIVE:
        case ActionEvent.GET_PRODUCT_CATEGORY_IN_HOME:
        case ActionEvent.GET_POSTS:
        case ActionEvent.COUNT_FRIEND_REQUESTS:
        case ActionEvent.COUNT_NEW_NOTIFICATION:
        case ActionEvent.GET_RECOMMEND_FRIENDS_IN_HOME:
        case ActionEvent.SEND_FRIEND_REQUEST:
        case ActionEvent.CANCEL_FRIEND_REQUEST:
        case ActionEvent.GET_JOB_HOME_VIEW:
        case ActionEvent.GET_CATEGORIES_HOME_VIEW:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type,
            }
        case ActionEvent.GET_ALL_CART:
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_SUCCESS,
                data: action.payload !== undefined ? action.payload : null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.DELETE_FRIEND_SUGGESTION):
        case getActionSuccess(ActionEvent.GET_CATEGORIES_HOME_VIEW):
        case getActionSuccess(ActionEvent.GET_USER_INFO):
        case getActionSuccess(ActionEvent.GET_CONFIG):
        case getActionSuccess(ActionEvent.GET_UPDATE_VERSION):
        case getActionSuccess(ActionEvent.USER_DEVICE_INFO):
        case getActionSuccess(ActionEvent.GET_WALLET):
        case getActionSuccess(ActionEvent.GET_BANNER):
        case getActionSuccess(ActionEvent.GET_PROFILE_ADMIN):
        case getActionSuccess(ActionEvent.CHECK_EXIST_CONVERSATION_IN_HOME):
        case getActionSuccess(ActionEvent.CHECK_CONVERSATION_ACTIVE):
        case getActionSuccess(ActionEvent.GET_PRODUCT_CATEGORY_IN_HOME):
        case getActionSuccess(ActionEvent.GET_POSTS):
        case getActionSuccess(ActionEvent.COUNT_FRIEND_REQUESTS):
        case getActionSuccess(ActionEvent.COUNT_NEW_NOTIFICATION):
        case getActionSuccess(ActionEvent.GET_RECOMMEND_FRIENDS_IN_HOME):
        case getActionSuccess(ActionEvent.SEND_FRIEND_REQUEST):
        case getActionSuccess(ActionEvent.CANCEL_FRIEND_REQUEST):
        case getActionSuccess(ActionEvent.ADD_JOB):
        case getActionSuccess(ActionEvent.UPDATE_JOB):
        case getActionSuccess(ActionEvent.GET_JOB_HOME_VIEW):
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
        default:
            return state;
    }
}
