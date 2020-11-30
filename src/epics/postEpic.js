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
import * as postActions from 'actions/postActions';
import ApiUtil from 'utils/apiUtil';

export const getPostsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_POSTS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
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
                return postActions.getPostsSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_POSTS EPIC:", ActionEvent.GET_POSTS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getPostVideosEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_POST_VIDEOS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
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
                return postActions.getPostVideosSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_POST_VIDEOS EPIC:", ActionEvent.GET_POST_VIDEOS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getPostDetailEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_POST_DETAIL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/detail`, {
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
                return postActions.getPostDetailSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_POST_DETAIL EPIC:", ActionEvent.GET_POST_DETAIL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const postNewsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.POST_NEWS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/up`, {
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
                return postActions.postNewsSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("POST_NEWS EPIC:", ActionEvent.POST_NEWS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updatePostNewsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_POST_NEWS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/update`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload.post)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.updatePostNewsSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_POST_NEWS EPIC:", ActionEvent.UPDATE_POST_NEWS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getPostsGroupEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_POSTS_GROUP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(`total post APPROVED : ${responseJson.length}`);
                console.log(responseJson)
                return postActions.getPostsGroupSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_POSTS_GROUP EPIC:", ActionEvent.GET_POSTS_GROUP, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getPostsOfUserEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_POSTS_OF_USER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
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
                return postActions.getPostsOfUserSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_POSTS_OF_USER EPIC:", ActionEvent.GET_POSTS_OF_USER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateGroupPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_GROUP_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/group/${action.payload.postId}/update`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.updateGroupPostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_GROUP_POST EPIC:", ActionEvent.UPDATE_GROUP_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateGroupPostInPostDetailEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_GROUP_POST_IN_POST_DETAIL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/group/${action.payload.postId}/update`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.updateGroupPostInPostDetailSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_GROUP_POST_IN_POST_DETAIL EPIC:", ActionEvent.UPDATE_GROUP_POST_IN_POST_DETAIL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const hidePostForUserEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.HIDE_POST_FOR_USER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/hide`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.hidePostForUserSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("HIDE_POST_FOR_USER EPIC:", ActionEvent.HIDE_POST_FOR_USER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deletePostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/delete`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.deletePostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("DELETE_POST EPIC:", ActionEvent.DELETE_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const editPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.EDIT_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/update`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.editPostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("EDIT_POST EPIC:", ActionEvent.EDIT_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const checkRemainQuantityPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHECK_REMAIN_QUANTITY_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/check/remain/quantity`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.checkRemainQuantityPostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("CHECK_REMAIN_QUANTITY_POST EPIC:", ActionEvent.CHECK_REMAIN_QUANTITY_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getGroupPostsInGroupViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_GROUP_POSTS_IN_GROUP_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(`total post waiting : ${responseJson.length}`);
                console.log(responseJson);
                console.log("Dfdsfdsf")
                return postActions.getGroupPostInGroupViewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_GROUP_POSTS_IN_GROUP_VIEW EPIC:", ActionEvent.GET_GROUP_POSTS_IN_GROUP_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deletePostInGroupViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_POST_IN_GROUP_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/delete`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.deletePostInGroupViewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("DELETE_POST_IN_GROUP_VIEW EPIC:", ActionEvent.DELETE_POST_IN_GROUP_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deletePostInApprovedPostViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_POST_IN_APPROVED_POST_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/delete`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.deletePostInApprovedPostViewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("DELETE_POST_IN_APPROVED_POST_VIEW EPIC:", ActionEvent.DELETE_POST_IN_APPROVED_POST_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getGroupPostsInPostViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_GROUP_POSTS_IN_POST_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(`total post waiting : ${responseJson.length}`);
                console.log(responseJson);
                console.log("Dfdsfdsf")
                return postActions.getGroupPostsInPostViewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_GROUP_POSTS_IN_POST_VIEW EPIC:", ActionEvent.GET_GROUP_POSTS_IN_POST_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const userSeenPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.USER_SEEN_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/${action.payload.postId}/see/save`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.userSeenPostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("USER_SEEN_POST EPIC:", ActionEvent.USER_SEEN_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const pushNotifcationForNewPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.PUSH_NOTIFICATION_WHEN_UPLOAD_NEW_POST_SUCCESS_IN_GROUP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/up/notification`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log(`== PUSH ==`);
                console.log(response);

                if (response.ok) {
                    return response.json();
                }
                console.log(response);
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(`=== RESPONSE JSON ===`);
                
                console.log(responseJson)
                return postActions.pushNotificationForNewPostSuccess(responseJson)
            })
                .catch((error) => {
                    console.log(`== ERROR PUSH ==`);
                    console.log(error);
                    consoleLogEpic("PUSH_NOTIFICATION_WHEN_UPLOAD_NEW_POST_SUCCESS_IN_GROUP EPIC:", ActionEvent.PUSH_NOTIFICATION_WHEN_UPLOAD_NEW_POST_SUCCESS_IN_GROUP, error);
                    return handleConnectErrors(error)
                })
        )
    );