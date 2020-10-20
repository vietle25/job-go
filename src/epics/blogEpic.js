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
import * as blogActions from 'actions/blogActions';
import { ServerPath } from 'config/Server';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import ApiUtil from 'utils/apiUtil';

export const getBlogsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BLOGS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'post/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log("GET_JOBS EPIC", responseJson.data)
                    return blogActions.getBlogsSuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("GET_BLOGS USER_EPIC:", ActionEvent.GET_BLOGS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const searchBlogEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_BLOG),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'post/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log(responseJson.data)
                    return blogActions.searchBlogSuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("SEARCH_BLOG USER_EPIC:", ActionEvent.SEARCH_BLOG, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getBlogsHomeEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BLOGS_HOME),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'post/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log(responseJson.data)
                    return blogActions.getBlogsHomeSuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("GET_BLOGS_HOME USER_EPIC:", ActionEvent.GET_BLOGS_HOME, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getRelateBlogEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_RELATE_BLOG),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'post/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log(responseJson.data)
                    return blogActions.getRelateBlogSuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("GET_RELATE_BLOG USER_EPIC:", ActionEvent.GET_RELATE_BLOG, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getDetailBlogEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_DETAIL_BLOG),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.id}/detail`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log("GET_DETAIL_BLOG EPIC", responseJson);
                    return blogActions.getDetailBlogSuccess(responseJson);
                })
                .catch((error) => {
                    consoleLogEpic("GET_DETAIL_BLOG EPIC:", ActionEvent.GET_DETAIL_BLOG, error);
                    return handleConnectErrors(error)
                })
        )
    );