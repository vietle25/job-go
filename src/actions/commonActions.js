import { ActionEvent, getActionSuccess } from "./actionEvent";

export const resetAction = () => ({
    type: ActionEvent.RESET_ACTION
})

export const fetchError = (errorCode, error) => ({
    type: ActionEvent.REQUEST_FAIL,
    payload: { errorCode, error }
})

export const getArea = (filter) => ({
    type: ActionEvent.GET_AREA,
    payload: { ...filter }
})

export const getAreaSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_AREA),
    payload: { data }
})

export const saveException = (filter) => ({
    type: ActionEvent.SAVE_EXCEPTION,
    payload: { ...filter }
})

export const saveExceptionSuccess = data => ({
    type: getActionSuccess(ActionEvent.SAVE_EXCEPTION),
    payload: { data }
})

export const search = (filter) => ({
    type: ActionEvent.SEARCH,
    payload: { ...filter }
})

export const searchSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH),
    payload: { data }
})

export const pushNotification = (filter) => ({
    type: ActionEvent.PUSH_NOTIFICATION,
    payload: { ...filter }
})

export const pushNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.PUSH_NOTIFICATION),
    payload: { data }
})