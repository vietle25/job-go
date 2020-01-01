import { combineReducers } from 'redux';
import userReducer from 'reducers/userReducer';
import loginReducer from 'reducers/loginReducer';
import signUpReducer from 'reducers/signUpReducer';
import homeReducer from 'reducers/homeReducer';
import { ErrorCode } from 'config/errorCode';
import forgetPassReducer from 'reducers/forgetPassReducer';
import changePassReducer from 'reducers/changePassReducer';
import userProfileReducer from 'reducers/userProfileReducer';
import notificationsReducer from 'reducers/notificationsReducer';
import mainReducer from 'reducers/mainReducer';
import serviceReducer from 'reducers/serviceReducer';
import introduceReducer from './introduceReducer';
import otpReducer from './otpReducer';
import addressReducer from './addressReducer';
import listChatReducer from './listChatReducer';
import chatReducer from './chatReducer';
import searchReducer from './searchReducer';
import splashReducer from './splashReducer';
import blogListReducer from './blogListReducer';
import blogDetailReducer from './blogDetailReducer';
import blogReducer from './blogReducer';
import categorySelectReducer from './categorySelectReducer';
import listUserReducer from './listUserReducer';
import slidingMenuReducer from './slidingMenuReducer';
import bottomTabNavigatorReducer from './bottomTabNavigatorReducer';
import categoryReducer from './categoryReducer';
import jobReducer from './jobReducer';
import areaReducer from './areaReducer';

export const initialState = {
    data: null,
    isLoading: false,
    error: null,
    errorCode: ErrorCode.ERROR_INIT,
    action: null
}

export default combineReducers({
    user: userReducer,
    login: loginReducer,
    home: homeReducer,
    signUp: signUpReducer,
    forgetPass: forgetPassReducer,
    changePass: changePassReducer,
    changePass: changePassReducer,
    userProfile: userProfileReducer,
    notifications: notificationsReducer,
    main: mainReducer,
    service: serviceReducer,
    introduce: introduceReducer,
    otp: otpReducer,
    address: addressReducer,
    listChat: listChatReducer,
    chat: chatReducer,
    search: searchReducer,
    splash: splashReducer,
    blogList: blogListReducer,
    blogDetail: blogDetailReducer,
    blog: blogReducer,
    categorySelect: categorySelectReducer,
    listUser: listUserReducer,
    slidingMenu: slidingMenuReducer,
    bottomTabNavigator: bottomTabNavigatorReducer,
    category: categoryReducer,
    job: jobReducer,
    area: areaReducer
});

