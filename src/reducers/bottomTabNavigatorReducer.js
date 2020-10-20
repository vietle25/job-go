import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.COUNT_UNSEEN_CONVERSATION:
            console.log("BOTTOM TAB REUDCER", action.payload);
            return {
                ...state,
                isLoading: false,
                data: action.payload !== undefined ? action.payload : null,
                errorCode: 1,
                action: action.type,
            }
        case getActionSuccess(ActionEvent.COUNT_FRIEND_REQUESTS):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: 1,
                action: action.type,
            }
        case ActionEvent.REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
                errorCode: 1,
                action: action.type
            }
        default:
            return state;
    }
}