import { combineEpics } from 'redux-observable';
import {
    loginEpic,
    registerEpic,
    getUserInfoEpic,
    editProfileEpic,
    changePassEpic,
    signUp,
    forgetPassEpic,
    getNotificationsEpic,
    getNotificationsViewEpic,
    loginGoogleEpic,
    loginFacebookEpic,
    getConfigEpic,
    getBlogPostEpic,
    sendOTPEpic,
    confirmOTPEpic,
    postUserDeviceInfoEpic,
    deleteUserDeviceInfoEpic,
    countNewNotificationEpic,
    readAllNotificationEpic,
    getNotificationsByTypeEpic,
    createConversationEpic,
    getProfileAdminEpic,
    getListPartnerEpic,
    savePartnerEpic,
    deleteConversationEpic,
    searchConversationEpic,
    checkExistConversationEpic,
    checkExistConversationInHomeEpic,
    checkConversationActiveEpic,
    getProfileUserChatEpic,
    updateCoordinateForEmployeeEpic,
    pushMessageNotificationsEpic,
    seenNotificationEpic,
    getConversationEpic,
    resetPasswordEpic,
    loginViaSocialEpic
} from './userEpics';
import {
    getCountryEpic,
    getUpdateVersionEpic,
    getAreaEpic,
    saveExceptionEpic,
    searchEpic,
    pushNotificationEpic
} from './commonEpic';
import { from } from 'rxjs';
import { getBannerEpic } from './bannerEpic';
import {
    getAddressFromPlaceIdEpic,
    getMyLocationByLatLngEpic,
    findEmployeeRescueEpic,
    acceptEmployeeRescueEpic,
} from './locationEpic';
import {
    getBlogsEpic,
    getBlogsHomeEpic,
    getDetailBlogEpic,
} from './blogEpic';

import {
    addCategoryEpic,
    updateCategoryEpic,
    getCategoriesEpic,
    getCategoriesAddJobViewEpic,
    getCategoryDetailEpic,
    getCategoriesHomeViewEpic
} from './categoryEpic'

import {
    addJobEpic,
    getJobDetailEpic,
    getJobsEpic,
    updateJobEpic,
    getJobHomeViewEpic,
    getMyJobPostEpic,
    getJobRecruitmentEpic,
    applyJobEpic,
    getMyRecruitmentByJobEpic,
    getUserApplyHistoryEpic,
    dropApplyEpic,
    searchJobEpic,
    saveJobEpic,
    getJobSaveEpic
} from './jobEpic'

export default combineEpics(
    loginEpic,
    loginGoogleEpic,
    loginFacebookEpic,
    registerEpic,
    changePassEpic,
    getUserInfoEpic,
    editProfileEpic,
    getCountryEpic,
    signUp,
    forgetPassEpic,
    getNotificationsEpic,
    getNotificationsViewEpic,
    getConfigEpic,
    getUpdateVersionEpic,
    getBlogPostEpic,
    sendOTPEpic,
    confirmOTPEpic,
    postUserDeviceInfoEpic,
    deleteUserDeviceInfoEpic,
    countNewNotificationEpic,
    getBannerEpic,
    readAllNotificationEpic,
    getNotificationsByTypeEpic,
    getAreaEpic,
    createConversationEpic,
    getProfileAdminEpic,
    getListPartnerEpic,
    savePartnerEpic,
    deleteConversationEpic,
    searchConversationEpic,
    checkExistConversationEpic,
    checkExistConversationInHomeEpic,
    saveExceptionEpic,
    checkConversationActiveEpic,
    getProfileUserChatEpic,
    getAddressFromPlaceIdEpic,
    getMyLocationByLatLngEpic,
    updateCoordinateForEmployeeEpic,
    findEmployeeRescueEpic,
    acceptEmployeeRescueEpic,
    getBlogsEpic,
    getDetailBlogEpic,
    getCategoriesEpic,
    getBlogsHomeEpic,
    pushMessageNotificationsEpic,
    addCategoryEpic,
    updateCategoryEpic,
    addJobEpic,
    getJobDetailEpic,
    getJobsEpic,
    updateJobEpic,
    getCategoriesAddJobViewEpic,
    getCategoryDetailEpic,
    getJobHomeViewEpic,
    getMyJobPostEpic,
    getJobRecruitmentEpic,
    applyJobEpic,
    getMyRecruitmentByJobEpic,
    getUserApplyHistoryEpic,
    dropApplyEpic,
    searchJobEpic,
    seenNotificationEpic,
    getConversationEpic,
    resetPasswordEpic,
    loginViaSocialEpic,
    pushNotificationEpic,
    saveJobEpic,
    getJobSaveEpic,
    getCategoriesHomeViewEpic
)
