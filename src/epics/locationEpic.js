import { ActionEvent } from 'actions/actionEvent'
import { Observable } from 'rxjs';
import {
    map,
    filter,
    catchError,
    mergeMap
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { delay, mapTo, switchMap } from 'rxjs/operators';
import { dispatch } from 'rxjs/internal/observable/range';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import { ServerPath } from 'config/Server';
import * as location from 'actions/locationActions';
import ApiUtil from 'utils/apiUtil';

export const getBranchEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BRANCH),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/branch/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.getBranchSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_BRANCH GET_BRANCH_EPIC:", ActionEvent.GET_BRANCH, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const searchBranchEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_BRANCH),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/branch/${action.payload}/search`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                console.log('response', response)
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.searchBranchSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("SEARCH_BRANCH SEARCH_BRANCH_EPIC:", ActionEvent.SEARCH_BRANCH, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const requestRescueEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.REQUEST_RESCUE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/rescue/request`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.requestRescueSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("REQUEST_RESCUE RESCUE_EPIC:", ActionEvent.REQUEST_RESCUE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const cancelRequestRescueEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CANCEL_REQUEST_RESCUE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/rescue/cancel/request`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.cancelRequestRescueSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("CANCEL_REQUEST_RESCUE RESCUE_EPIC:", ActionEvent.CANCEL_REQUEST_RESCUE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getFeedbackRescueEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_FEEDBACK_RESCUE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/rescue/${action.payload.userId}/feedback`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return location.getFeedbackRescueSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_FEEDBACK_RESCUE RESCUE_EPIC:", ActionEvent.GET_FEEDBACK_RESCUE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const rescueCompleteEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.RESCUE_COMPLETE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/rescue/${action.payload.rescueId}/complete`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return location.rescueCompleteSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("RESCUE_COMPLETE RESCUE_EPIC:", ActionEvent.RESCUE_COMPLETE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const vehicleTransferEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.VEHICLE_TRANSFER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/vehicle/transfer`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.vehicleTransferSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("VEHICLE_TRANSFER RESCUE_EPIC:", ActionEvent.VEHICLE_TRANSFER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const findEmployeeRescueEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.FIND_EMPLOYEE_RESCUE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/rescue/find/employee`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.findEmployeeRescueSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("FIND_EMPLOYEE_RESCUE RESCUE_EPIC:", ActionEvent.FIND_EMPLOYEE_RESCUE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const acceptEmployeeRescueEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.ACCEPT_EMPLOYEE_RESCUE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/rescue/accept/employee`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.acceptEmployeeRescueSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("ACCEPT_EMPLOYEE_RESCUE RESCUE_EPIC:", ActionEvent.ACCEPT_EMPLOYEE_RESCUE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getFeedbackTransferEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_FEEDBACK_TRANSFER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/transfer/${action.payload.userId}/feedback`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return location.getFeedbackTransferSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_FEEDBACK_TRANSFER RESCUE_EPIC:", ActionEvent.GET_FEEDBACK_TRANSFER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const transferCompleteEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.TRANSFER_COMPLETE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/transfer/${action.payload.transferId}/complete`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return location.transferCompleteSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("TRANSFER_COMPLETE RESCUE_EPIC:", ActionEvent.TRANSFER_COMPLETE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getTroubleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_TROUBLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/trouble`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return location.getTroubleSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_TROUBLE RESCUE_EPIC:", ActionEvent.GET_TROUBLE, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getTroubleForEmployeeEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_TROUBLE_FOR_EMPLOYEE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/trouble/for/employee`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return location.getTroubleForEmployeeSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_TROUBLE_FOR_EMPLOYEE RESCUE_EPIC:", ActionEvent.GET_TROUBLE_FOR_EMPLOYEE, error);
                return handleConnectErrors(error)
            })
        )
    );

export const searchAddressEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_ADDRESS),
        switchMap((action) =>
            fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=
            ${action.payload.input}&language=vi&components=country:VN&key=${action.payload.key}`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("JSON", responseJson);
                return location.searchAddressSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SEARCH_ADDRESS:", ActionEvent.SEARCH_ADDRESS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getAddressFromPlaceIdEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_ADDRESS_FROM_PLACE_ID),
        switchMap((action) =>
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${action.payload.placeId}&key=${action.payload.key}`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("JSON", responseJson);
                return location.getAddressFromPlaceIdSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_ADDRESS_FROM_PLACE_ID:", ActionEvent.GET_ADDRESS_FROM_PLACE_ID, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getMyLocationByLatLngEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MY_LOCATION_BY_LAT_LNG),
        switchMap((action) =>
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=
            ${action.payload.latitude},${action.payload.longitude}&key=${action.payload.key}`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("JSON", responseJson);
                return location.getMyLocationByLatLngSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_MY_LOCATION_BY_LAT_LNG:", ActionEvent.GET_MY_LOCATION_BY_LAT_LNG, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getBranchByIdEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BRANCH_BY_ID),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/branch/${action.payload.data}`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.getBranchByIdSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_BRANCH GET_BRANCH_EPIC:", ActionEvent.GET_BRANCH_BY_ID, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getBranchByPagingEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BRANCH_BY_PAGING),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `location/branch/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return location.getBranchByPagingSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_BRANCH_BY_PAGING RESCUE_EPIC:", ActionEvent.GET_BRANCH_BY_PAGING, error);
                    return handleConnectErrors(error)
                })
        )
    );