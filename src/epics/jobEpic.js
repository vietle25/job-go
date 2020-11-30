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
import * as jobActions from 'actions/jobActions';
import { ServerPath } from 'config/Server';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import ApiUtil from 'utils/apiUtil';
import { async } from 'rxjs/internal/scheduler/async';

export const addJobEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.ADD_JOB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `job/add`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("ADD_Job", responseJson)
                return jobActions.addJobSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("ADD_Job:", ActionEvent.ADD_JOB, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateJobEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_JOB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `job/update`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("UPDATE_Job", responseJson)
                return jobActions.updateJobSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_Job:", ActionEvent.UPDATE_Job, error);
                    return handleConnectErrors(error)
                })
        )
    );


export const getJobsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_JOBS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_JOBS_EPIC", responseJson);
                return jobActions.getJobsSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_JOBS_EPIC:", ActionEvent.GET_JOBS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getJobDetailEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_JOB_DETAIL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `job/detail/${action.payload.id}`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_JOB_DETAIL_EPIC", responseJson);
                return jobActions.getJobDetailSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_JOB_DETAIL_EPIC:", ActionEvent.GET_JOB_DETAIL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getJobHomeViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_JOB_HOME_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_JOB_HOME_VIEW EPIC", responseJson);
                return jobActions.getJobHomeViewSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_JOB_HOME_VIEW EPIC:", ActionEvent.GET_JOB_HOME_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getMyJobPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MY_JOB_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/list/user', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_MY_JOB_POST EPIC", responseJson);
                return jobActions.getMyJobPostSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_MY_JOB_POST EPIC:", ActionEvent.GET_MY_JOB_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getJobRecruitmentEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_JOB_RECRUITMENT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/recruitment/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_JOB_RECRUITMENT EPIC", responseJson);
                return jobActions.getJobRecruitmentSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_JOB_RECRUITMENT EPIC:", ActionEvent.GET_JOB_RECRUITMENT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const applyJobEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.APPLY_JOB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/apply', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("APPLY_JOB EPIC", responseJson);
                return jobActions.applyJobSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("APPLY_JOB EPIC:", ActionEvent.APPLY_JOB, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getMyRecruitmentByJobEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MY_RECRUITMENT_BY_JOB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/recruitment/my/job', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_MY_RECRUITMENT_BY_JOB EPIC", responseJson);
                return jobActions.getMyRecruitmentByJobSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_MY_RECRUITMENT_BY_JOB EPIC:", ActionEvent.GET_MY_RECRUITMENT_BY_JOB, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getUserApplyHistoryEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_USER_APPLY_HISTORY),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/user/apply/history', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_USER_APPLY_HISTORY EPIC", responseJson);
                return jobActions.getUserApplyHistorySuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_USER_APPLY_HISTORY EPIC:", ActionEvent.GET_USER_APPLY_HISTORY, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const dropApplyEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DROP_APPLY),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/recruitment/drop', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("DROP_APPLY EPIC", responseJson);
                return jobActions.dropApplySuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("DROP_APPLY EPIC:", ActionEvent.DROP_APPLY, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const searchJobEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_JOB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("SEARCH_JOB EPIC", responseJson);
                return jobActions.searchJobSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SEARCH_JOB EPIC:", ActionEvent.SEARCH_JOB, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const saveJobEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SAVE_JOB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/save', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("SAVE_JOB EPIC", responseJson);
                return jobActions.saveJobSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SAVE_JOB EPIC:", ActionEvent.SAVE_JOB, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getJobSaveEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_JOB_SAVE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'job/save/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_JOB_SAVE EPIC", responseJson);
                return jobActions.getJobSaveSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_JOB_SAVE EPIC:", ActionEvent.GET_JOB_SAVE, error);
                    return handleConnectErrors(error)
                })
        )
    );