import { ActionEvent, getActionSuccess } from './actionEvent';

export const getBranch = (filter) => ({
    type: ActionEvent.GET_BRANCH,
    payload: { ...filter }
})

export const getBranchSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BRANCH),
    payload: { data }
})

export const searchBranch = data => ({
    type: ActionEvent.SEARCH_BRANCH,
    payload: data
})

export const searchBranchSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH_BRANCH),
    payload: { data }
})

export const requestRescue = filter => ({
    type: ActionEvent.REQUEST_RESCUE,
    payload: { ...filter }
})

export const requestRescueSuccess = data => ({
    type: getActionSuccess(ActionEvent.REQUEST_RESCUE),
    payload: { data }
})

export const getFeedbackRescue = userId => ({
    type: ActionEvent.GET_FEEDBACK_RESCUE,
    payload: { userId }
})

export const getFeedbackRescueSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_FEEDBACK_RESCUE),
    payload: { data }
})

export const rescueComplete = rescueId => ({
    type: ActionEvent.RESCUE_COMPLETE,
    payload: { rescueId }
})

export const rescueCompleteSuccess = data => ({
    type: getActionSuccess(ActionEvent.RESCUE_COMPLETE),
    payload: { data }
})

export const vehicleTransfer = filter => ({
    type: ActionEvent.VEHICLE_TRANSFER,
    payload: { ...filter }
})

export const vehicleTransferSuccess = data => ({
    type: getActionSuccess(ActionEvent.VEHICLE_TRANSFER),
    payload: { data }
})

export const getFeedbackTransfer = userId => ({
    type: ActionEvent.GET_FEEDBACK_TRANSFER,
    payload: { userId }
})

export const getFeedbackTransferSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_FEEDBACK_TRANSFER),
    payload: { data }
})

export const transferComplete = transferId => ({
    type: ActionEvent.TRANSFER_COMPLETE,
    payload: { transferId }
})

export const transferCompleteSuccess = data => ({
    type: getActionSuccess(ActionEvent.TRANSFER_COMPLETE),
    payload: { data }
})

export const getTrouble = () => ({
    type: ActionEvent.GET_TROUBLE,
})

export const getTroubleSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_TROUBLE),
    payload: { data }
})

export const getTroubleForEmployee = () => ({
    type: ActionEvent.GET_TROUBLE_FOR_EMPLOYEE,
})

export const getTroubleForEmployeeSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_TROUBLE_FOR_EMPLOYEE),
    payload: { data }
})

export const getAddressFromPlaceId = (placeId, key) => ({
    type: ActionEvent.GET_ADDRESS_FROM_PLACE_ID,
    payload: { placeId, key }
})

export const getAddressFromPlaceIdSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_ADDRESS_FROM_PLACE_ID),
    payload: { data }
})

export const getMyLocationByLatLng = (location, key) => ({
    type: ActionEvent.GET_MY_LOCATION_BY_LAT_LNG,
    payload: { ...location, key }
})

export const getMyLocationByLatLngSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MY_LOCATION_BY_LAT_LNG),
    payload: { data }
})

export const searchAddress = (input, key) => ({ type: ActionEvent.SEARCH_ADDRESS, payload: { input, key } })

export const searchAddressSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH_ADDRESS),
    payload: { data }
})

export const cancelRequestRescue = filter => ({
    type: ActionEvent.CANCEL_REQUEST_RESCUE,
    payload: { ...filter }
})

export const cancelRequestRescueSuccess = data => ({
    type: getActionSuccess(ActionEvent.CANCEL_REQUEST_RESCUE),
    payload: { data }
})

export const findEmployeeRescue = filter => ({
    type: ActionEvent.FIND_EMPLOYEE_RESCUE,
    payload: { ...filter }
})

export const findEmployeeRescueSuccess = data => ({
    type: getActionSuccess(ActionEvent.FIND_EMPLOYEE_RESCUE),
    payload: { data }
})

export const acceptEmployeeRescue = filter => ({
    type: ActionEvent.ACCEPT_EMPLOYEE_RESCUE,
    payload: { ...filter }
})

export const acceptEmployeeRescueSuccess = data => ({
    type: getActionSuccess(ActionEvent.ACCEPT_EMPLOYEE_RESCUE),
    payload: { data }
})

export const getBranchById = (data) => ({
    type: ActionEvent.GET_BRANCH_BY_ID,
    payload: { data }
})

export const getBranchByIdSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BRANCH_BY_ID),
    payload: { data }
})

export const getBranchByPaging = (filter) => ({
    type: ActionEvent.GET_BRANCH_BY_PAGING,
    filter
})

export const getBranchByPagingSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BRANCH_BY_PAGING),
    payload: { data }
})