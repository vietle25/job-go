import { ActionEvent, getActionSuccess } from './actionEvent'


export const login = data => ({ type: ActionEvent.LOGIN, payload: data })

export const loginSuccess = data => ({
    type: getActionSuccess(ActionEvent.LOGIN),
    payload: { data }
});

export const reloadLoginSuccess = () => ({
    type: getActionSuccess(ActionEvent.RELOAD_LOGIN_SUCCESS)
});

export const changePass = (oldPass, newPass, phone, forgotPassword) => ({
    type: ActionEvent.CHANGE_PASS, payload: { oldPass, newPass, phone, forgotPassword }
})

export const changePassSuccess = data => (
    {
        type: getActionSuccess(ActionEvent.CHANGE_PASS),
        payload: { data }
    }
)

export const forgetPass = (filter) => (
    {
        type: ActionEvent.FORGET_PASS,
        payload: { ...filter }
    }
)

export const forgetPassSuccess = data => ({
    type: getActionSuccess(ActionEvent.FORGET_PASS),
    payload: { data }
})

export const getUserProfile = userId => ({ type: ActionEvent.GET_USER_INFO, payload: { userId } })

export const getUserProfileSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_USER_INFO),
    payload: { data }
});

export const getSomeOneProfile = userId => ({ type: ActionEvent.GET_SOME_ONE_INFO, payload: { userId } })

export const getSomeOneProfileSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_SOME_ONE_INFO),
    payload: { data }
});

export const editProfile = userModel => ({
    type: ActionEvent.EDIT_PROFILE,
    payload: { ...userModel }
})

export const editProfileSuccess = data => ({ type: getActionSuccess(ActionEvent.EDIT_PROFILE), payload: { data } })

export const signUp = data => ({ type: ActionEvent.SIGN_UP, payload: { ...data } })

export const signUpSuccess = data => ({ type: getActionSuccess(ActionEvent.SIGN_UP), payload: { data } })

export const getCountry = () => ({ type: ActionEvent.GET_COUNTRY })

export const getCountrySuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_COUNTRY),
    payload: { data }
})

export const addCredit = (accountName, accountNumber, accountMonth, accountYear, bankCode) => ({
    type: ActionEvent.ADD_CREDIT,
    payload: { accountName, accountNumber, accountMonth, accountYear, bankCode }
})

export const addCreditSuccess = (data) => ({
    type: getActionSuccess(ActionEvent.ADD_CREDIT),
    payload: { data }
})

export const postReview = content => ({
    type: ActionEvent.POST_REVIEW,
    payload: { content }
})

export const postReviewSuccess = data => ({
    type: gActionSuccess(ActionEvent.POST_REVIEW),
    payload: { data }
})

export const getNotificationsRequest = (filter) => ({
    type: ActionEvent.GET_NOTIFICATIONS,
    filter
})

export const getNotificationsSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_NOTIFICATIONS),
    payload: { data }
})

export const getMainNotificationsRequest = (filter) => ({
    type: ActionEvent.GET_MAIN_NOTIFICATIONS,
    filter
})

export const getMainNotificationsSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MAIN_NOTIFICATIONS),
    payload: { data }
})

export const buyPackageRequest = data => ({
    type: ActionEvent.BUY_PACKAGE,
    data
})

export const buyPackageSuccess = data => ({
    type: getActionSuccess(ActionEvent.BUY_PACKAGE),
    payload: { data }
})

export const getAffiliate = filter => ({
    type: ActionEvent.GET_AFFILIATE,
    payload: { filter }
})

export const getAffiliateSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_AFFILIATE),
    payload: { data }
})

export const resetData = () => ({
    type: ActionEvent.RESET_DATA
})

export const postNotificationsView = (filterView) => ({
    type: ActionEvent.GET_NOTIFICATIONS_VIEW,
    payload: { ...filterView }
})

export const postNotificationsViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_NOTIFICATIONS_VIEW),
    payload: { data }
})

export const makeSuggestions = (postData) => ({
    type: ActionEvent.MAKE_SUGGESTIONS,
    payload: { ...postData }
})

export const makeSuggestionsSuccess = data => ({
    type: getActionSuccess(ActionEvent.MAKE_SUGGESTIONS),
    payload: { data }
})

export const logout = () => ({
    type: ActionEvent.LOGOUT
})

export const notifyLoginSuccess = () => ({
    type: ActionEvent.NOTIFY_LOGIN_SUCCESS
})

export const buyPracticalWriting = (postData) => ({
    type: ActionEvent.BUY_PRACTICAL_WRITING,
    payload: { postData }
})

export const buyPracticalWritingSuccess = data => ({
    type: getActionSuccess(ActionEvent.BUY_PRACTICAL_WRITING),
    payload: { data }
})

export const loginGoogle = data => ({
    type: ActionEvent.LOGIN_GOOGLE,
    payload: data
})
export const loginGoogleSuccess = data => ({
    type: getActionSuccess(ActionEvent.LOGIN_GOOGLE),
    payload: { data }
})

export const loginFacebook = data => ({
    type: ActionEvent.LOGIN_FB,
    payload: data
})
export const loginFacebookSuccess = data => ({
    type: getActionSuccess(ActionEvent.LOGIN_FB),
    payload: { data }
})

export const regitrationStudying = () => ({
    type: ActionEvent.STUDYING,
})
export const getStudyingSuccess = data => ({
    type: getActionSuccess(ActionEvent.STUDYING),
    payload: { data }
})

export const getConfig = () => ({
    type: ActionEvent.GET_CONFIG,
})

export const getConfigSuccess = (data) => ({
    type: getActionSuccess(ActionEvent.GET_CONFIG),
    payload: { data }
})

export const changeTargetPoint = (filter) => ({
    type: ActionEvent.CHANGE_TARGET_POINT,
    payload: filter
})

export const changeTargetPointSuccess = (data) => ({
    type: getActionSuccess(ActionEvent.CHANGE_TARGET_POINT),
    payload: { data }
})

export const getUpdateVersion = () => ({
    type: ActionEvent.GET_UPDATE_VERSION
})

export const getUpdateVersionSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_UPDATE_VERSION),
    payload: { data }
})

export const getSpeakingScheduleNearest = () => ({
    type: ActionEvent.GET_EXAM_SPEAKING_SCHEDULE_NEAREST
})

export const getSpeakingScheduleNearestSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_EXAM_SPEAKING_SCHEDULE_NEAREST),
    payload: { data }
})

export const getBlogPost = (filter) => ({
    type: ActionEvent.GET_BLOG_POST,
    filter
})

export const getBlogPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BLOG_POST),
    payload: { data }
})

export const sendOTP = filter => ({
    type: ActionEvent.SEND_OTP,
    payload: { ...filter }
})

export const sendOTPSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_OTP),
    payload: { data }
})

export const confirmOTP = (filter) => ({
    type: ActionEvent.CONFIRM_OTP,
    payload: { ...filter }
})

export const confirmOTPSuccess = data => ({
    type: getActionSuccess(ActionEvent.CONFIRM_OTP),
    payload: { data }
})

export const postUserDeviceInfo = (filter) => ({
    type: ActionEvent.USER_DEVICE_INFO,
    payload: { ...filter }
})

export const postUserDeviceInfoSuccess = data => ({
    type: getActionSuccess(ActionEvent.USER_DEVICE_INFO),
    payload: { data }
})

export const deleteUserDeviceInfo = (filter) => ({
    type: ActionEvent.DELETE_USER_DEVICE_INFO,
    payload: { ...filter }
})

export const deleteUserDeviceInfoSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_USER_DEVICE_INFO),
    payload: { data }
})

export const countNewNotification = () => ({
    type: ActionEvent.COUNT_NEW_NOTIFICATION
})

export const countNewNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.COUNT_NEW_NOTIFICATION),
    payload: { data }
})

export const getWallet = () => ({
    type: ActionEvent.GET_WALLET
})

export const getWalletSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_WALLET),
    payload: { data }
})

export const getBankList = () => ({
    type: ActionEvent.GET_BANK_LIST
})

export const getBankListSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BANK_LIST),
    payload: { data }
})

export const getListWalletHistory = (filter) => ({
    type: ActionEvent.GET_LIST_WALLET_HISTORY,
    payload: { ...filter }
})

export const getListWalletHistorySuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_LIST_WALLET_HISTORY),
    payload: { data }
})

export const searchNotification = (filter) => ({
    type: ActionEvent.SEARCH_NOTIFICATION,
    payload: { ...filter }
})

export const searchNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH_NOTIFICATION),
    payload: { data }
})

export const readAllNotification = () => ({
    type: ActionEvent.READ_ALL_NOTIFICATION,
    // payload: { ...filter }
})

export const readAllNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.READ_ALL_NOTIFICATION),
    payload: { data }
})

export const getNotificationsByType = (filter) => ({
    type: ActionEvent.GET_NOTIFICATIONS_BY_TYPE,
    filter
})

export const getNotificationsByTypeSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_NOTIFICATIONS_BY_TYPE),
    payload: { data }
})

export const getOrderHistory = (filter) => ({
    type: ActionEvent.GET_ORDER_HISTORY,
    payload: { ...filter }
})

export const getOrderHistorySuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_ORDER_HISTORY),
    payload: { data }
})

export const sendReview = (filter) => ({
    type: ActionEvent.SEND_REVIEW,
    payload: { ...filter }
})

export const sendReviewSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_REVIEW),
    payload: { data }
})

export const saveAddress = filter => ({
    type: ActionEvent.SAVE_ADDRESS,
    payload: { ...filter }
})

export const saveAddressSuccess = data => ({
    type: getActionSuccess(ActionEvent.SAVE_ADDRESS),
    payload: { data }
})

export const registerMembership = filter => ({
    type: ActionEvent.REGISTER_MEMBERSHIP,
    payload: { ...filter }
})

export const registerMembershipSuccess = data => ({
    type: getActionSuccess(ActionEvent.REGISTER_MEMBERSHIP),
    payload: { data }
})

export const getMemberOfConversation = filter => ({
    type: ActionEvent.GET_MEMBER_OF_CONVERSATION,
    payload: { ...filter }
})

export const getMemberOfConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MEMBER_OF_CONVERSATION),
    payload: { data }
})

export const createConversation = filter => ({
    type: ActionEvent.CREATE_CONVERSATION,
    payload: { ...filter }
})

export const createConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.CREATE_CONVERSATION),
    payload: { data }
})

export const getProfileAdmin = userId => ({
    type: ActionEvent.GET_PROFILE_ADMIN,
    payload: { userId }
})

export const getProfileAdminSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_PROFILE_ADMIN),
    payload: { data }
});

export const getOrderReplaceable = filter => ({
    type: ActionEvent.GET_ORDER_REPLACEABLE,
    payload: { ...filter }
})

export const getOrderReplaceableSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_ORDER_REPLACEABLE),
    payload: { data }
})

export const getListPartner = () => ({
    type: ActionEvent.GET_LIST_PARTNER
})

export const getListPartnerSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_LIST_PARTNER),
    payload: { data }
})

export const savePartner = filter => ({
    type: ActionEvent.SAVE_PARTNER,
    payload: { ...filter }
})

export const savePartnerSuccess = data => ({
    type: getActionSuccess(ActionEvent.SAVE_PARTNER),
    payload: { data }
})

export const deleteConversation = conversationId => ({
    type: ActionEvent.DELETE_CONVERSATION,
    payload: { conversationId }
})

export const deleteConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_CONVERSATION),
    payload: { data }
})

export const searchConversation = filter => ({
    type: ActionEvent.SEARCH_CONVERSATION,
    payload: { ...filter }
})

export const searchConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH_CONVERSATION),
    payload: { data }
})

export const checkExistConversationInHome = filter => ({
    type: ActionEvent.CHECK_EXIST_CONVERSATION_IN_HOME,
    payload: { ...filter }
})

export const checkExistConversationInHomeSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHECK_EXIST_CONVERSATION_IN_HOME),
    payload: { data }
})

export const checkExistConversation = filter => ({
    type: ActionEvent.CHECK_EXIST_CONVERSATION,
    payload: { ...filter }
})

export const checkExistConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHECK_EXIST_CONVERSATION),
    payload: { data }
})

export const pushMessageNotification = filter => ({
    type: ActionEvent.PUSH_MESSAGE_NOTIFICATION,
    payload: { ...filter }
})

export const pushMessageNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.PUSH_MESSAGE_NOTIFICATION),
    payload: { data }
})

export const checkConversationActive = () => ({
    type: ActionEvent.CHECK_CONVERSATION_ACTIVE,
})

export const checkConversationActiveSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHECK_CONVERSATION_ACTIVE),
    payload: { data }
})

export const getProfileUserChat = userId => ({
    type: ActionEvent.GET_PROFILE_USER_CHAT,
    payload: { userId }
})

export const getProfileUserChatSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_PROFILE_USER_CHAT),
    payload: { data }
});

export const sendReviewProduct = filter => ({
    type: ActionEvent.SEND_REVIEW_PRODUCT,
    payload: { ...filter }
})

export const sendReviewProductSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_REVIEW_PRODUCT),
    payload: { data }
})

export const sendReviewBranch = filter => ({
    type: ActionEvent.SEND_REVIEW_BRANCH,
    payload: { ...filter }
})

export const sendReviewBranchSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_REVIEW_BRANCH),
    payload: { data }
})

export const getReviewsOfProduct = filter => ({
    type: ActionEvent.GET_REVIEWS_OF_PRODUCT,
    payload: { ...filter }
})

export const getReviewsOfProductSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_REVIEWS_OF_PRODUCT),
    payload: { data }
})

export const updateCoordinateForEmployee = filter => ({
    type: ActionEvent.UPDATE_COORDINATE_FOR_EMPLOYEE,
    payload: { ...filter }
})

export const updateCoordinateForEmployeeSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_COORDINATE_FOR_EMPLOYEE),
    payload: { data }
})

export const getAllStaffByBranch = filter => ({
    type: ActionEvent.GET_ALL_STAFF_BY_BRANCH,
    payload: { ...filter }
})

export const getAllStaffByBranchSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_ALL_STAFF_BY_BRANCH),
    payload: { data }
})

export const getMembershipCard = userId => ({
    type: ActionEvent.GET_MEMBERSHIP_CARD,
    payload: { userId }
})

export const getMembershipCardSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MEMBERSHIP_CARD),
    payload: { data }
})

export const updateMembership = filter => ({
    type: ActionEvent.UPDATE_MEMBERSHIP,
    payload: { ...filter }
})

export const updateMembershipSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_MEMBERSHIP),
    payload: { data }
})

export const getDetailAppointment = id => ({
    type: ActionEvent.GET_DETAIL_APPOINTMENT,
    payload: { id }
})

export const getDetailAppointmentSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_DETAIL_APPOINTMENT),
    payload: { data }
})

export const changeInformationStaff = data => ({
    type: ActionEvent.CHANGE_INFORMATION_STAFF,
    payload: data
})

export const changeInformationStaffSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHANGE_INFORMATION_STAFF),
    payload: { data }
})

export const sendContact = filter => ({
    type: ActionEvent.SEND_CONTACT,
    payload: { ...filter }
})

export const sendContactSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_CONTACT),
    payload: { data }
})

export const getUserBySearchString = searchString => ({
    type: ActionEvent.GET_USER_BY_SEARCH_STRING,
    payload: { searchString }
})

export const getUserBySearchStringSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_USER_BY_SEARCH_STRING),
    payload: { data }
})

export const signUpAndInsertMembership = data => ({
    type: ActionEvent.SIGN_UP_AND_INSERT_MEMBERSHIP,
    payload: { ...data }
})

export const signUpAndInsertMembershipSuccess = data => ({
    type: getActionSuccess(ActionEvent.SIGN_UP_AND_INSERT_MEMBERSHIP),
    payload: { data }
})

export const getAllUser = filter => ({
    type: ActionEvent.GET_ALL_USER,
    payload: { ...filter }
})

export const getAllUserSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_ALL_USER),
    payload: { data }
})

export const getInformationUser = userId => ({
    type: ActionEvent.GET_INFORMATION_USER,
    payload: { userId }
})

export const getInformationUserSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_INFORMATION_USER),
    payload: { data }
});

export const getHistoryPoint = (filter) => ({
    type: ActionEvent.GET_HISTORY_POINT,
    payload: { ...filter }
})

export const getHistoryPointSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_HISTORY_POINT),
    payload: { data }
})

export const getAmountUser = staffType => ({
    type: ActionEvent.GET_AMOUNT_USER,
    staffType
})

export const getAmountUserSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_AMOUNT_USER),
    payload: { data }
});

export const checkContactProduct = (filter) => ({
    type: ActionEvent.CHECK_CONTACT_PRODUCT,
    payload: { ...filter }
})

export const checkContactProductSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHECK_CONTACT_PRODUCT),
    payload: { data }
})

export const getVehicleMaintenance = productId => ({
    type: ActionEvent.GET_VEHICLE_MAINTENANCE,
    payload: { productId }
})

export const getVehicleMaintenanceSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_VEHICLE_MAINTENANCE),
    payload: { data }
});

export const sendFeedback = filter => ({
    type: ActionEvent.SEND_FEEDBACK,
    payload: { ...filter }
})

export const sendFeedbackSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_FEEDBACK),
    payload: { data }
})

export const deleteNotifications = filter => ({
    type: ActionEvent.DELETE_NOTIFICATIONS,
    payload: { ...filter }
})

export const deleteNotificationsSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_NOTIFICATIONS),
    payload: { data }
})

export const checkExistPassword = () => ({
    type: ActionEvent.CHECK_EXIST_PASSWORD
})

export const checkExistPasswordSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHECK_EXIST_PASSWORD),
    payload: { data }
})

export const requestChangeAmount = (filter) => ({
    type: ActionEvent.REQUEST_CHANGE_AMOUNT,
    payload: { ...filter }
})

export const requestChangeAmountSuccess = data => ({
    type: getActionSuccess(ActionEvent.REQUEST_CHANGE_AMOUNT),
    payload: { data }
})
export const getShop = data => ({ type: ActionEvent.GET_SHOP, payload: data })

export const getShopSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_SHOP),
    payload: { data }
});

export const createShop = data => ({ type: ActionEvent.CREATE_SHOP, payload: data })

export const createShopSuccess = data => ({
    type: getActionSuccess(ActionEvent.CREATE_SHOP),
    payload: { data }
});

export const updateShop = data => ({ type: ActionEvent.UPDATE_SHOP, payload: data })

export const updateShopSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_SHOP),
    payload: { data }
});

export const getProductUser = filter => ({
    type: ActionEvent.GET_PRODUCT_USER,
    payload: { ...filter }
})

export const getProductUserSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_PRODUCT_USER),
    payload: { data }
})

export const getReview = reviewFilter => ({
    type: ActionEvent.GET_REVIEW,
    payload: reviewFilter
})

export const getReviewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_REVIEW),
    payload: { data }
});

export const createReview = reviewFilter => ({
    type: ActionEvent.CREATE_REVIEW,
    payload: reviewFilter
})

export const createReviewSuccess = data => ({
    type: getActionSuccess(ActionEvent.CREATE_REVIEW),
    payload: { data }
});

export const getReviewFromModal = reviewFilter => ({
    type: ActionEvent.GET_REVIEW_FROM_MODAL,
    payload: reviewFilter
})

export const getReviewFromModalSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_REVIEW_FROM_MODAL),
    payload: { data }
});

export const createReviewFromModal = reviewFilter => ({
    type: ActionEvent.CREATE_REVIEW_FROM_MODAL,
    payload: reviewFilter
})

export const createReviewFromModalSuccess = data => ({
    type: getActionSuccess(ActionEvent.CREATE_REVIEW_FROM_MODAL),
    payload: { data }
});

export const getUserRequest = filter => ({
    type: ActionEvent.GET_USER_REQUEST,
    payload: { ...filter }
})

export const getUserRequestSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_USER_REQUEST),
    payload: { data }
})

export const confirmSocialAccount = confirmSocialAccountFilter => ({
    type: ActionEvent.CONFIRM_SOCIAL_ACCOUNT,
    payload: confirmSocialAccountFilter
})

export const confirmSocialAccountSuccess = data => ({
    type: getActionSuccess(ActionEvent.CONFIRM_SOCIAL_ACCOUNT),
    payload: { data }
})

export const getReviewsFromPost = reviewFilter => ({
    type: ActionEvent.GET_REVIEW_FROM_POST,
    payload: reviewFilter
})

export const getReviewsFromPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_REVIEW_FROM_POST),
    payload: { data }
});

export const createReviewWithImageFromModal = reviewFilter => ({
    type: ActionEvent.CREATE_REVIEW_WITH_IMAGE_FROM_MODAL,
    payload: reviewFilter
})

export const createReviewWithImageFromModalSuccess = data => ({
    type: getActionSuccess(ActionEvent.CREATE_REVIEW_WITH_IMAGE_FROM_MODAL),
    payload: { data }
});

export const createReviewWithImage = reviewFilter => ({
    type: ActionEvent.CREATE_REVIEW_WITH_IMAGE,
    payload: reviewFilter
})

export const createReviewWithImageSuccess = data => ({
    type: getActionSuccess(ActionEvent.CREATE_REVIEW_WITH_IMAGE),
    payload: { data }
});

export const loginGoogleInConfirm = data => ({
    type: ActionEvent.LOGIN_GOOGLE_IN_CONFIRM,
    payload: data
})
export const loginGoogleInConfirmSuccess = data => ({
    type: getActionSuccess(ActionEvent.LOGIN_GOOGLE_IN_CONFIRM),
    payload: { data }
})

export const loginFacebookInConfirm = data => ({
    type: ActionEvent.LOGIN_FB_IN_CONFIRM,
    payload: data
})
export const loginFacebookInConfirmSuccess = data => ({
    type: getActionSuccess(ActionEvent.LOGIN_FB_IN_CONFIRM),
    payload: { data }
})

export const deleteShop = data => ({ type: ActionEvent.DELETE_SHOP, payload: data })

export const deleteShopSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_SHOP),
    payload: { data }
});


export const seenNotification = id => ({
    type: ActionEvent.SEEN_NOTIFICATION,
    payload: { id }
})

export const seenNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEEN_NOTIFICATION),
    payload: { data }
});

export const getConversation = filter => ({
    type: ActionEvent.GET_CONVERSATION,
    payload: { ...filter }
})

export const getConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_CONVERSATION),
    payload: { data }
});

export const getUnseenConversation = (num) => ({
    type: ActionEvent.COUNT_UNSEEN_CONVERSATION,
    payload: num
})

export const getUnseenConversationSuccess = data => ({
    type: getActionSuccess(ActionEvent.COUNT_UNSEEN_CONVERSATION),
    payload: { data }
});

export const resetPassword = filter => ({
    type: ActionEvent.RESET_PASSWORD,
    payload: { ...filter }
})

export const resetPasswordSuccess = data => ({
    type: getActionSuccess(ActionEvent.RESET_PASSWORD),
    payload: { data }
});

export const loginViaSocial = filter => ({
    type: ActionEvent.LOGIN_SOCIAL,
    payload: { ...filter }
})

export const loginViaSocialSuccess = data => ({
    type: getActionSuccess(ActionEvent.LOGIN_SOCIAL),
    payload: { data }
});