import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.ACCEPT_FRIEND_REQUEST:
        case ActionEvent.REJECT_FRIEND_REQUEST:
        case ActionEvent.UNFRIEND_REQUEST:
        case ActionEvent.CHECK_IS_FRIEND:
        case ActionEvent.GET_USER_INFO:
        case ActionEvent.GET_SOME_ONE_INFO:
        case ActionEvent.EDIT_PROFILE:
        case ActionEvent.GET_REVENUE_CHART:
        case ActionEvent.SEND_FRIEND_REQUEST:
        case ActionEvent.CANCEL_FRIEND_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.ACCEPT_FRIEND_REQUEST):
        case getActionSuccess(ActionEvent.REJECT_FRIEND_REQUEST):
        case getActionSuccess(ActionEvent.UNFRIEND_REQUEST):
        case getActionSuccess(ActionEvent.CHECK_IS_FRIEND):
        case getActionSuccess(ActionEvent.GET_USER_INFO):
        case getActionSuccess(ActionEvent.GET_SOME_ONE_INFO):
        case getActionSuccess(ActionEvent.EDIT_PROFILE):
        case getActionSuccess(ActionEvent.GET_REVENUE_CHART):
        case getActionSuccess(ActionEvent.SEND_FRIEND_REQUEST):
        case getActionSuccess(ActionEvent.CANCEL_FRIEND_REQUEST):
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