import {ActionEvent, getActionSuccess} from 'actions/actionEvent';
import {initialState} from './index'
import {ErrorCode} from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.ADD_CATEGORY:
        case ActionEvent.UPDATE_CATEGORY:
        case ActionEvent.GET_CATEGORIES:
        case ActionEvent.GET_CATEGORY_DETAIL:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.ADD_CATEGORY):
        case getActionSuccess(ActionEvent.GET_CATEGORIES):
        case getActionSuccess(ActionEvent.UPDATE_CATEGORY):
        case getActionSuccess(ActionEvent.GET_CATEGORY_DETAIL):
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