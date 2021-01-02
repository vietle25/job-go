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
import * as userActions from 'actions/userActions';
import { ServerPath } from 'config/Server';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import ApiUtil from 'utils/apiUtil';
import chatReducer from 'reducers/chatReducer';


/**
 * Login
 * @param {*} action$ 
 */
export const loginEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/log-me-in', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("LOGIN USER_EPIC:", responseJson);
                if (responseJson.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH) {
                    // this.showMessage('Tài khoản hoặc mật khẩu không đúng')
                }
                return userActions.loginSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("LOGIN USER_EPIC:", ActionEvent.LOGIN, error)
                    return handleConnectErrors(error)
                })
        )
    );

export const getHistoryPointEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_HISTORY_POINT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/point', {
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
                    return userActions.getHistoryPointSuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("GET_HISTORY_POINT USER_EPIC:", ActionEvent.GET_HISTORY_POINT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const loginGoogleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN_GOOGLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/log-me-in/google', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("=== GOOGLE RESPONSE=== ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log('google: ', responseJson);
                if (responseJson.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH) {
                    // this.showMessage('Tài khoản hoặc mật khẩu không đúng')
                }
                return userActions.loginGoogleSuccess(responseJson);
            })
                .catch((error) => {
                    // alert(error);
                    consoleLogEpic("LOGIN_GOOGLE USER_EPIC:", ActionEvent.LOGIN_GOOGLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const loginFacebookEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN_FB),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/log-me-in/facebook', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("=== FACEBOOK RESPONSE=== ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log('facebook: ', responseJson);
                if (responseJson.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH) {
                    // this.showMessage('Tài khoản hoặc mật khẩu không đúng')
                }
                return userActions.loginFacebookSuccess(responseJson);
            })
                .catch((error) => {
                    alert(error)
                    consoleLogEpic("LOGIN_FB USER_EPIC:", ActionEvent.LOGIN_FB, error);
                    return handleConnectErrors(error)
                })
        )
    );
export const registerEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.REGISTER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'register', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                alert(ServerPath.API_URL)
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.loginSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("REGISTER USER_EPIC:", ActionEvent.REGISTER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const changePassEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHANGE_PASS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/password/change', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.changePassSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("CHANGE_PASS USER_EPIC:", ActionEvent.CHANGE_PASS, error);
                    return handleConnectErrors(error);
                })
        )
    );

export const getUserInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_USER_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/profile`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_USER_INFO EPIC ", responseJson);
                return userActions.getUserProfileSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_USER_INFO USER_EPIC:", ActionEvent.GET_USER_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getSomeOneInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_SOME_ONE_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/profile`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getSomeOneProfileSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_SOME_ONE_INFO USER_EPIC:", ActionEvent.GET_SOME_ONE_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const editProfileEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.EDIT_PROFILE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/edit', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.editProfileSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("EDIT_PROFILE USER_EPIC:", ActionEvent.EDIT_PROFILE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const sendContactEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_CONTACT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/contact/message', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.sendContactSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SEND_CONTACT USER_EPIC:", ActionEvent.SEND_CONTACT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const checkContactProductEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHECK_CONTACT_PRODUCT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/product/check', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.checkContactProductSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("CHECK_CONTACT_PRODUCT USER_EPIC:", ActionEvent.CHECK_CONTACT_PRODUCT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const signUp = action$ =>
    action$.pipe(
        ofType(ActionEvent.SIGN_UP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/signup', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.signUpSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SIGN_UP USER_EPIC:", ActionEvent.SIGN_UP, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const forgetPassEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.FORGET_PASS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/forget-password', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.forgetPassSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("FORGET_PASS USER_EPIC:", ActionEvent.FORGET_PASS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const addCreditEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.ADD_CREDIT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/credit', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.addCreditSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("ADD_CREDIT USER_EPIC:", ActionEvent.ADD_CREDIT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getReviewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_REVIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'review/1/10/list', {
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
                return userActions.getReviewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_REVIEW USER_EPIC:", ActionEvent.GET_REVIEW, error);
                    return handleConnectErrors(error)
                })
        )
    )
export const postReviewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.POST_REVIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'review/1/10', {
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
                return userActions.postReviewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("POST_REVIEW USER_EPIC:", ActionEvent.POST_REVIEW, error);
                    return handleConnectErrors(error)
                })
        )
    )

export const getNotificationsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NOTIFICATIONS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("NOTIFICATIONS: ", responseJson)
                return userActions.getNotificationsSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("GET_NOTIFICATIONS USER_EPIC:", ActionEvent.GET_NOTIFICATIONS, error);
                return handleConnectErrors(error)
            })
        )
    )

export const pushMessageNotificationsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.PUSH_MESSAGE_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/push/message', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("PUSH NOTIFICATIONS: ", responseJson)
                return userActions.pushMessageNotificationSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("PUSH NOTIFICATIONS USER_EPIC:", ActionEvent.PUSH_MESSAGE_NOTIFICATION, error);
                return handleConnectErrors(error)
            })
        )
    )

export const getNotificationsByTypeEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NOTIFICATIONS_BY_TYPE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_NOTIFICATIONS_BY_TYPE: ", responseJson)
                return userActions.getNotificationsByTypeSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("GET_NOTIFICATIONS_BY_TYPE USER_EPIC:", ActionEvent.GET_NOTIFICATIONS_BY_TYPE, error);
                return handleConnectErrors(error)
            })
        )
    )

export const getMainNotificationsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MAIN_NOTIFICATIONS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson.data)
                return userActions.getMainNotificationsSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("GET_MAIN_NOTIFICATIONS USER_EPIC:", ActionEvent.GET_MAIN_NOTIFICATIONS, error);
                return handleConnectErrors(error)
            })
        )
    )

export const buyPackageEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.BUY_PACKAGE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/buy/exam/package', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.data)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson.data)
                return userActions.buyPackageSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("BUY_PACKAGE USER_EPIC:", ActionEvent.BUY_PACKAGE, error);
                return handleConnectErrors(error)
            })
        )
    )

export const getAffiliateEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_AFFILIATE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/affiliate/code', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getAffiliateSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_AFFILIATE USER_EPIC:", ActionEvent.GET_AFFILIATE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getNotificationsViewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NOTIFICATIONS_VIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification/view', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.postNotificationsViewSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_NOTIFICATIONS_VIEW VIEW USER_EPIC:", ActionEvent.GET_NOTIFICATIONS_VIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const makeSuggestionsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.MAKE_SUGGESTIONS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/contact/message', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.makeSuggestionsSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("MAKE_SUGGESTIONS USER_EPIC:", ActionEvent.MAKE_SUGGESTIONS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const buyPracticalWritingEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.BUY_PRACTICAL_WRITING),
        switchMap((action) =>
            fetch(ServerPath.API_URL + '', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.buyPracticalWritingSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("BUY_PRACTICAL_WRITING USER_EPIC:", ActionEvent.BUY_PRACTICAL_WRITING, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const studyingEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.STUDYING),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/exam/registration/studying', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getStudyingSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("STUDYING USER_EPIC:", ActionEvent.STUDYING, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getConfigEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CONFIG),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/m/config', {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_config", responseJson);
                return userActions.getConfigSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CONFIG USER_EPIC:", ActionEvent.GET_CONFIG, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const changeTargetPointEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHANGE_TARGET_POINT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/target/point/change', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.changeTargetPointSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("CHANGE_TARGET_POINT USER_EPIC:", ActionEvent.CHANGE_TARGET_POINT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getBlogPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BLOG_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'blog/post', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson.data)
                return userActions.getBlogPostSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("GET_BLOG_POST USER_EPIC:", ActionEvent.GET_BLOG_POST, error);
                return handleConnectErrors(error)
            })
        )
    );

export const sendOTPEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_OTP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/send-otp', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson.data)
                return userActions.sendOTPSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("SEND_OTP USER_EPIC:", ActionEvent.SEND_OTP, error);
                return handleConnectErrors(error)
            })
        )
    );

export const confirmOTPEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CONFIRM_OTP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/confirm-otp', {
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
                return userActions.confirmOTPSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("CONFIRM_OTP USER_EPIC:", ActionEvent.CONFIRM_OTP, error);
                return handleConnectErrors(error)
            })
        )
    );

export const postUserDeviceInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.USER_DEVICE_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/device', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.postUserDeviceInfoSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("USER_DEVICE_INFO USER_EPIC:", ActionEvent.USER_DEVICE_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deleteUserDeviceInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_USER_DEVICE_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/delete/device', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.deleteUserDeviceInfoSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("DELETE_USER_DEVICE_INFO USER_EPIC:", ActionEvent.DELETE_USER_DEVICE_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const countNewNotificationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.COUNT_NEW_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/count/new/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("COUNT NEW NOTIFICATION JSO", response)
            }).then((responseJson) => {
                console.log("COUNT NEW NOTIFICATION JSON", responseJson);
                global.badgeCount = responseJson.data
                return userActions.countNewNotificationSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("COUNT_NEW_NOTIFICATION USER_EPIC:", ActionEvent.COUNT_NEW_NOTIFICATION, error);
                    return handleConnectErrors(error)
                })
        )
    );


export const getWalletEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_WALLET),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/wallet', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_WALLET JSON", responseJson);
                return userActions.getWalletSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_WALLET USER_EPIC:", ActionEvent.GET_WALLET, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getBankListEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BANK_LIST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/bank/list', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_BANK_LIST JSON", responseJson);
                return userActions.getBankListSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_BANK_LIST USER_EPIC:", ActionEvent.GET_BANK_LIST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getListWalletHistoryEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_LIST_WALLET_HISTORY),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/wallet/history/list', {
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
                    return userActions.getListWalletHistorySuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("GET_LIST_WALLET_HISTORY USER_EPIC:", ActionEvent.GET_LIST_WALLET_HISTORY, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const searchNotificationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/search/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("SEARCH_NOTIFICATION JSON", responseJson);
                return userActions.searchNotificationSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SEARCH_NOTIFICATION USER_EPIC:", ActionEvent.SEARCH_NOTIFICATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const readAllNotificationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.READ_ALL_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification/seen/all', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("READ_ALL_NOTIFICATION JSON", responseJson);
                return userActions.readAllNotificationSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("READ_ALL_NOTIFICATION USER_EPIC:", ActionEvent.READ_ALL_NOTIFICATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

// export const getOrderHistoryEpic = action$ =>
//     action$.pipe(
//         ofType(ActionEvent.GET_ORDER_HISTORY),
//         switchMap((action) =>
//             fetch(ServerPath.API_URL + 'user/order/history', {
//                 method: 'POST',
//                 headers: ApiUtil.getHeader(),
//                 body: JSON.stringify(action.payload)
//             }).then((response) => {
//                 if (response.ok) {
//                     return response.json();
//                 }
//                 return handleErrors(response)
//             }).then((responseJson) => {
//                 console.log("JSON", responseJson);
//                 return userActions.getOrderHistorySuccess(responseJson);
//             })
//                 .catch((error) => {
//                     consoleLogEpic("GET_ORDER_HISTORY USER_EPIC:", ActionEvent.GET_ORDER_HISTORY, error);
//                     return handleConnectErrors(error)
//                 })
//         )
//     );

export const sendReviewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_REVIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/feedback', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("JSON", responseJson);
                return userActions.sendReviewSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SEND_REVIEW USER_EPIC:", ActionEvent.SEND_REVIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const saveAddressEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SAVE_ADDRESS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/address', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("JSON", responseJson);
                return userActions.saveAddressSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SAVE_ADDRESS USER_EPIC:", ActionEvent.SAVE_ADDRESS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const registerMembershipEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.REGISTER_MEMBERSHIP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/membership/register`, {
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
                return userActions.registerMembershipSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("REGISTER_MEMBERSHIP:", ActionEvent.REGISTER_MEMBERSHIP, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getOrderReplaceableEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_ORDER_REPLACEABLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/order/replaceable`, {
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
                return userActions.getOrderReplaceableSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("REGISTER_MEMBERSHIP:", ActionEvent.GET_ORDER_REPLACEABLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getMemberOfConversationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MEMBER_OF_CONVERSATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/member/conversation`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("GET_MEMBER_OF_CONVERSATION EPIC ", response)
            }).then((responseJson) => {
                console.log("GET_MEMBER_OF_CONVERSATION", responseJson)
                return userActions.getMemberOfConversationSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_MEMBER_OF_CONVERSATION:", ActionEvent.GET_MEMBER_OF_CONVERSATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const createConversationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CREATE_CONVERSATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/conversation/create`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("CREATE_CONVERSATION", response)
            }).then((responseJson) => {
                console.log("CREATE_CONVERSATION", responseJson)
                return userActions.createConversationSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("CREATE_CONVERSATION:", ActionEvent.CREATE_CONVERSATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getProfileAdminEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_PROFILE_ADMIN),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/profile`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getProfileAdminSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_PROFILE_ADMIN USER_EPIC:", ActionEvent.GET_PROFILE_ADMIN, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getListPartnerEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_LIST_PARTNER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/list/partner`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getListPartnerSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_LIST_PARTNER USER_EPIC:", ActionEvent.GET_LIST_PARTNER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const savePartnerEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SAVE_PARTNER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/save/partner`, {
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
                return userActions.savePartnerSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("SAVE_PARTNER:", ActionEvent.SAVE_PARTNER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deleteConversationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_CONVERSATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/conversation/${action.payload.conversationId}/delete`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.deleteConversationSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("DELETE_CONVERSATION USER_EPIC:", ActionEvent.DELETE_CONVERSATION, error);
                return handleConnectErrors(error)
            })
        )
    );

export const searchConversationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_CONVERSATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/conversation/search`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.searchConversationSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("SEARCH_CONVERSATION USER_EPIC:", ActionEvent.SEARCH_CONVERSATION, error);
                return handleConnectErrors(error)
            })
        )
    );

export const checkExistConversationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHECK_EXIST_CONVERSATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/conversation/check`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("CHECK_EXIST_CONVERSATION EPIC ", response)
            }).then((responseJson) => {
                console.log("CHECK_EXIST_CONVERSATION EPIC ", responseJson);
                return userActions.checkExistConversationSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("CHECK_EXIST_CONVERSATION USER_EPIC:", ActionEvent.CHECK_EXIST_CONVERSATION, error);
                return handleConnectErrors(error)
            })
        )
    );

export const checkExistConversationInHomeEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHECK_EXIST_CONVERSATION_IN_HOME),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/conversation/check`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.checkExistConversationInHomeSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("CHECK_EXIST_CONVERSATION_IN_HOME USER_EPIC:", ActionEvent.CHECK_EXIST_CONVERSATION_IN_HOME, error);
                return handleConnectErrors(error)
            })
        )
    );

export const checkConversationActiveEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHECK_CONVERSATION_ACTIVE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/conversation/active/check`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.checkConversationActiveSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("CHECK_CONVERSATION_ACTIVE USER_EPIC:", ActionEvent.CHECK_CONVERSATION_ACTIVE, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getProfileUserChatEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_PROFILE_USER_CHAT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/profile`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("GET_PROFILE_USER_CHAT EPIC ", response)
            }).then((responseJson) => {
                console.log("GET_PROFILE_USER_CHAT", responseJson);
                return userActions.getProfileUserChatSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_PROFILE_USER_CHAT USER_EPIC:", ActionEvent.GET_PROFILE_USER_CHAT, error);
                return handleConnectErrors(error)
            })
        )
    );

export const sendReviewBranchEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_REVIEW_BRANCH),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/review', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.sendReviewBranchSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("SEND_REVIEW_BRANCH USER_EPIC:", ActionEvent.SEND_REVIEW_BRANCH, error);
                return handleConnectErrors(error)
            })
        )
    );

export const sendReviewProductEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_REVIEW_PRODUCT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/review', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.sendReviewProductSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("SEND_REVIEW_PRODUCT USER_EPIC:", ActionEvent.SEND_REVIEW_PRODUCT, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getReviewsOfProductEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_REVIEWS_OF_PRODUCT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/review/product/all', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getReviewsOfProductSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_REVIEWS_OF_PRODUCT USER_EPIC:", ActionEvent.GET_REVIEWS_OF_PRODUCT, error);
                return handleConnectErrors(error)
            })
        )
    );

export const updateCoordinateForEmployeeEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_COORDINATE_FOR_EMPLOYEE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/update/coordinate', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.updateCoordinateForEmployeeSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("UPDATE_COORDINATE_FOR_EMPLOYEE USER_EPIC:", ActionEvent.UPDATE_COORDINATE_FOR_EMPLOYEE, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getAllStaffByBranchEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_ALL_STAFF_BY_BRANCH),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/staff/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getAllStaffByBranchSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_ALL_STAFF_BY_BRANCH USER_EPIC:", ActionEvent.GET_ALL_STAFF_BY_BRANCH, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getMembershipCardEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MEMBERSHIP_CARD),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/membership`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getMembershipCardSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_MEMBERSHIP_CARD USER_EPIC:", ActionEvent.GET_MEMBERSHIP_CARD, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getDetailAppointmentEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_DETAIL_APPOINTMENT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `appointment/${action.payload.id}`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log(responseJson);
                    return userActions.getDetailAppointmentSuccess(responseJson);
                })
                .catch((error) => {
                    consoleLogEpic("GET_DETAIL_APPOINTMENT:", ActionEvent.GET_DETAIL_APPOINTMENT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateMembershipEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_MEMBERSHIP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/membership/upgrade`, {
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
                return userActions.updateMembershipSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_MEMBERSHIP:", ActionEvent.UPDATE_MEMBERSHIP, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const changeInformationStaffEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHANGE_INFORMATION_STAFF),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/information/change`, {
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
                return userActions.changeInformationStaffSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("CHANGE_INFORMATION_STAFF:", ActionEvent.CHANGE_INFORMATION_STAFF, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getUserBySearchStringEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_USER_BY_SEARCH_STRING),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.searchString}/list`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getUserBySearchStringSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_USER_INFO GET_USER_BY_SEARCH_STRING:", ActionEvent.GET_USER_BY_SEARCH_STRING, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const signUpAndInsertMembershipEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SIGN_UP_AND_INSERT_MEMBERSHIP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/signup/membership', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.signUpAndInsertMembershipSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SIGN_UP_AND_INSERT_MEMBERSHIP USER_EPIC:", ActionEvent.SIGN_UP_AND_INSERT_MEMBERSHIP, error);
                    return handleConnectErrors(error)
                })
        )
    );
export const getAllUserEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_ALL_USER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/list', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getAllUserSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_ALL_STAFF_BY_BRANCH USER_EPIC:", ActionEvent.GET_ALL_USER, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getInformationUserEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_INFORMATION_USER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/profile`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getInformationUserSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_PROFILE_ADMIN USER_EPIC:", ActionEvent.GET_INFORMATION_USER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getAmountUserEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_AMOUNT_USER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/amount', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.staffType)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.getAmountUserSuccess(responseJson);
            }).catch((error) => {
                consoleLogEpic("GET_PROFILE_ADMIN GET_AMOUNT_USER:", ActionEvent.GET_AMOUNT_USER, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getVehicleMaintenanceEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_VEHICLE_MAINTENANCE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/maintenance/vehicle/${action.payload.productId}`, {
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
                return userActions.getVehicleMaintenanceSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("GET_VEHICLE_MAINTENANCE EPIC:", ActionEvent.GET_VEHICLE_MAINTENANCE, error);
                return handleConnectErrors(error)
            })
        )
    );

export const sendFeedbackEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_FEEDBACK),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/feedback/message', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.sendFeedbackSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SEND_FEEDBACK USER_EPIC:", ActionEvent.SEND_FEEDBACK, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deleteNotificationsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_NOTIFICATIONS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/delete/notifications', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("DELETE NOTIFICATIONS: ", responseJson)
                return userActions.deleteNotificationsSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("DELETE_NOTIFICATIONS USER_EPIC:", ActionEvent.DELETE_NOTIFICATIONS, error);
                return handleConnectErrors(error)
            })
        )
    );

export const checkExistPasswordEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHECK_EXIST_PASSWORD),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/check/exist/password', {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                return userActions.checkExistPasswordSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("CHECK_EXIST_PASSWORD USER_EPIC:", ActionEvent.CHECK_EXIST_PASSWORD, error);
                return handleConnectErrors(error)
            })
        )
    );

export const requestChangeAmountEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.REQUEST_CHANGE_AMOUNT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/request/changeAmount', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("JSON", responseJson);
                return userActions.requestChangeAmountSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("REQUEST_CHANGE_AMOUNT USER_EPIC:", ActionEvent.REQUEST_CHANGE_AMOUNT, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getShopEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_SHOP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/shop', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                console.log("== RESPONSE == ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("=== GET SHOP API ====")
                console.log(responseJson);
                return userActions.getShopSuccess(responseJson);
            }).catch((error) => {
                console.log("========= ERROR ====== ");
                console.log(error);
                return handleConnectErrors(error)
            })
        )
    );

export const createShopEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CREATE_SHOP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/shop/create', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("== RESPONSE == ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("=== CREATE SHOP API ====")
                console.log(responseJson);
                return userActions.createShopSuccess(responseJson);
            }).catch((error) => {
                console.log("========= ERROR ====== ");
                console.log(error);
                return handleConnectErrors(error)
            })
        )
    );

export const updateShopEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_SHOP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/shop/update', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("== RESPONSE == ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("=== UPDATE SHOP API ====")
                console.log(responseJson);
                return userActions.updateShopSuccess(responseJson);
            }).catch((error) => {
                console.log("========= ERROR ====== ");
                console.log(error);
                return handleConnectErrors(error)
            })
        )
    );

export const getProductUserEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_PRODUCT_USER),
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
                return userActions.getProductUserSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_PRODUCT_USER EPIC:", ActionEvent.GET_PRODUCT_USER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getReviewsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_REVIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("getReviewsEpic");
                console.log(responseJson);
                return userActions.getReviewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_REVIEWS EPIC:", ActionEvent.GET_REVIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const createReviewEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CREATE_REVIEW),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-APITOKEN': global.token
                },
                body: action.payload
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return userActions.createReviewSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("CREATE_REVIEW_SUCCESS EPIC:", ActionEvent.CREATE_REVIEW, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getReviewsFromModalEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_REVIEW_FROM_MODAL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("=== getReviewsFromModalEpic() ===");
                console.log(responseJson);
                return userActions.getReviewFromModalSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_REVIEW_FROM_MODALS EPIC:", ActionEvent.GET_REVIEW_FROM_MODAL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const createReviewsFromModalEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CREATE_REVIEW_FROM_MODAL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-APITOKEN': global.token
                },
                body: action.payload
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return userActions.createReviewFromModalSuccess(responseJson)
            })
                .catch((error) => {
                    console.log("===== ERROR : createReviewFromModal =====")
                    console.log(error);
                    consoleLogEpic("CREATE_REVIEW_FROM_MODAL_ERROR EPIC:", ActionEvent.CREATE_REVIEW_FROM_MODAL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getUserRequestEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_USER_REQUEST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/request/list`, {
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
                return userActions.getUserRequestSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_USER_REQUEST EPIC:", ActionEvent.GET_USER_REQUEST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const confirmSocialAccountEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CONFIRM_SOCIAL_ACCOUNT),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/confirm-social-account', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("CONFIRM SOCIAL :");
                console.log(responseJson);
                return userActions.confirmSocialAccountSuccess(responseJson)
            }).catch((error) => {
                console.log("=== ERROR ==");
                console.log(error);
                consoleLogEpic("CONFIRM_OTP USER_EPIC:", ActionEvent.CONFIRM_SOCIAL_ACCOUNT, error);
                return handleConnectErrors(error)
            })
        )
    );

export const getReviewsFromPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_REVIEW_FROM_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                return userActions.getReviewsFromPostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_REVIEW_FROM_POSTS EPIC:", ActionEvent.GET_REVIEW_FROM_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const createReviewWithImageFromModalEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CREATE_REVIEW_WITH_IMAGE_FROM_MODAL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review/create-with-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-APITOKEN': global.token
                },
                body: action.payload
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return userActions.createReviewWithImageFromModalSuccess(responseJson)
            })
                .catch((error) => {
                    console.log("===== ERROR : createReviewFromModal =====")
                    console.log(error);
                    consoleLogEpic("CREATE_REVIEW_WITH_IMAGE_FROM_MODAL_ERROR EPIC:", ActionEvent.CREATE_REVIEW_WITH_IMAGE_FROM_MODAL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const createReviewWithImageEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CREATE_REVIEW_WITH_IMAGE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/post/review/create-with-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-APITOKEN': global.token
                },
                body: action.payload
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return userActions.createReviewWithImageSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("CREATE_REVIEW_WITH_IMAGE_SUCCESS EPIC:", ActionEvent.CREATE_REVIEW_WITH_IMAGE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const loginGoogleInConfirmEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN_GOOGLE_IN_CONFIRM),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/log-me-in/google', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("=== GOOGLE RESPONSE=== ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log('google: ', responseJson);
                if (responseJson.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH) {
                    // this.showMessage('Tài khoản hoặc mật khẩu không đúng')
                }
                return userActions.loginGoogleInConfirmSuccess(responseJson);
            })
                .catch((error) => {
                    // alert(error);
                    consoleLogEpic("LOGIN_GOOGLE USER_EPIC:", ActionEvent.LOGIN_GOOGLE_IN_CONFIRM, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const loginFacebookInConfirmEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN_FB_IN_CONFIRM),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/log-me-in/facebook', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("=== FACEBOOK RESPONSE=== ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log('facebook: ', responseJson);
                if (responseJson.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH) {
                    // this.showMessage('Tài khoản hoặc mật khẩu không đúng')
                }
                return userActions.loginFacebookInConfirmSuccess(responseJson);
            })
                .catch((error) => {
                    alert(error)
                    consoleLogEpic("LOGIN_FB USER_EPIC:", ActionEvent.LOGIN_FB_IN_CONFIRM, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deleteShopEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_SHOP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/shop/delete', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                console.log("== RESPONSE == ");
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("=== CREATE SHOP API ====")
                console.log(responseJson);
                return userActions.deleteShopSuccess(responseJson);
            }).catch((error) => {
                console.log("========= ERROR ====== ");
                console.log(error);
                return handleConnectErrors(error)
            })
        )
    );

export const seenNotificationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEEN_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/notification/${action.payload.id}/seen`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("SEEN_NOTIFICATION EPIC", responseJson)
                return userActions.seenNotificationSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("SEEN_NOTIFICATION EPIC:", ActionEvent.SEEN_NOTIFICATION, error);
                    return handleConnectErrors(error)
                })
        )
    );


export const getConversationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CONVERSATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/conversation', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("GET_CONVERSATION EPIC", response)
            }).then((responseJson) => {
                console.log("GET_CONVERSATION", responseJson);
                return userActions.getConversationSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CONVERSATION USER_EPIC:", ActionEvent.GET_CONVERSATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const resetPasswordEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.RESET_PASSWORD),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/password/reset', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("RESET_PASSWORD", responseJson);
                return userActions.resetPasswordSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("RESET_PASSWORD USER_EPIC:", ActionEvent.RESET_PASSWORD, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const loginViaSocialEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN_SOCIAL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/login/social', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("LOGIN_SOCIAL", responseJson);
                return userActions.loginViaSocialSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("LOGIN_SOCIAL USER_EPIC:", ActionEvent.LOGIN_SOCIAL, error);
                    return handleConnectErrors(error)
                })
        )
    );