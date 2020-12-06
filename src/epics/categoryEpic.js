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
import * as categoryActions from 'actions/categoryActions';
import { ServerPath } from 'config/Server';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import ApiUtil from 'utils/apiUtil';

export const addCategoryEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.ADD_CATEGORY),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `category/add`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("ADD_CATEGORY", responseJson)
                return categoryActions.addCategorySuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("ADD_CATEGORY:", ActionEvent.ADD_CATEGORY, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateCategoryEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_CATEGORY),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `category/update`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("UPDATE_CATEGORY", responseJson)
                return categoryActions.updateCategorySuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_CATEGORY:", ActionEvent.UPDATE_CATEGORY, error);
                    return handleConnectErrors(error)
                })
        )
    );


export const getCategoriesEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CATEGORIES),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'category/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_CATEGORIES_EPIC", responseJson);
                return categoryActions.getCategoriesSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CATEGORIES_EPIC:", ActionEvent.GET_CATEGORIES, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getCategoriesHomeViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CATEGORIES_HOME_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'category/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_CATEGORIES_HOME_VIEW EPIC", responseJson);
                return categoryActions.getCategoriesHomeViewSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CATEGORIES_HOME_VIEW EPIC:", ActionEvent.GET_CATEGORIES_HOME_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getCategoriesAddJobViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'category/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_CATEGORIES_ADD_JOB_VIEW_EPIC", responseJson);
                return categoryActions.getCategoriesAddJobViewSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CATEGORIES_ADD_JOB_VIEW:", ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );


export const getCategoryDetailEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CATEGORY_DETAIL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `category/detail/${action.payload.id}`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_CATEGORY_DETAIL EPIC", responseJson);
                return categoryActions.getCategoryDetailSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CATEGORY_DETAIL:", ActionEvent.GET_CATEGORY_DETAIL, error);
                    return handleConnectErrors(error)
                })
        )
    );