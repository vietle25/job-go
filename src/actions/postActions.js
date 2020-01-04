import { ActionEvent, getActionSuccess } from './actionEvent';

export const getPosts = filter => ({
    type: ActionEvent.GET_POSTS,
    payload: { ...filter }
})

export const getPostsSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_POSTS),
    payload: { data }
})

export const getPostVideos = filter => ({
    type: ActionEvent.GET_POST_VIDEOS,
    payload: { ...filter }
})

export const getPostVideosSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_POST_VIDEOS),
    payload: { data }
})

export const getPostDetail = filter => ({
    type: ActionEvent.GET_POST_DETAIL,
    payload: { ...filter }
})

export const getPostDetailSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_POST_DETAIL),
    payload: { data }
})

export const postNews = filter => ({
    type: ActionEvent.POST_NEWS,
    payload: { ...filter }
})

export const postNewsSuccess = data => ({
    type: getActionSuccess(ActionEvent.POST_NEWS),
    payload: { data }
})

export const updatePostNews = filter => ({
    type: ActionEvent.UPDATE_POST_NEWS,
    payload: { ...filter }
})

export const updatePostNewsSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_POST_NEWS),
    payload: { data }
})

export const getPostsGroup = filter => ({
    type: ActionEvent.GET_POSTS_GROUP,
    payload: { ...filter }
})

export const getPostsGroupSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_POSTS_GROUP),
    payload: { data }
})

export const getPostsOfUser = filter => ({
    type: ActionEvent.GET_POSTS_OF_USER,
    payload: { ...filter }
})

export const getPostsOfUserSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_POSTS_OF_USER),
    payload: { data }
})

export const addToCart = data => ({
    type: ActionEvent.ADD_TO_CART,
    payload: data
})

export const updateCart = data => ({
    type: ActionEvent.UPDATE_CART,
    payload: data
})

export const getAllCart = data => ({
    type: ActionEvent.GET_ALL_CART,
    payload: data
})

export const updateGroupPost = filter => ({
    type: ActionEvent.UPDATE_GROUP_POST,
    payload: { ...filter }
})

export const updateGroupPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_GROUP_POST),
    payload: { data }
})

export const updateGroupPostInPostDetail = filter => ({
    type: ActionEvent.UPDATE_GROUP_POST_IN_POST_DETAIL,
    payload: { ...filter }
})

export const updateGroupPostInPostDetailSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_GROUP_POST_IN_POST_DETAIL),
    payload: { data }
})


export const hidePostForUser = (postId) => ({
    type: ActionEvent.HIDE_POST_FOR_USER,
    payload: { postId }
})

export const hidePostForUserSuccess = data => ({
    type: getActionSuccess(ActionEvent.HIDE_POST_FOR_USER),
    payload: { data }
})

export const deletePost = (postId) => ({
    type: ActionEvent.DELETE_POST,
    payload: { postId }
})

export const deletePostSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_POST),
    payload: { data }
})

export const editPost = (postId) => ({
    type: ActionEvent.EDIT_POST,
    payload: { postId }
})

export const editPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.EDIT_POST),
    payload: { data }
})

export const checkRemainQuantityPost = (filter) => ({
    type: ActionEvent.CHECK_REMAIN_QUANTITY_POST,
    payload: { ...filter }
})

export const checkRemainQuantityPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.CHECK_REMAIN_QUANTITY_POST),
    payload: { data }
})

export const getGroupPostInGroupView = filter => ({
    type: ActionEvent.GET_GROUP_POSTS_IN_GROUP_VIEW,
    payload: { ...filter }
})

export const getGroupPostInGroupViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_GROUP_POSTS_IN_GROUP_VIEW),
    payload: { data }
})

export const deletePostInGroupView = (postId) => ({
    type: ActionEvent.DELETE_POST_IN_GROUP_VIEW,
    payload: { postId }
})

export const deletePostInGroupViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_POST_IN_GROUP_VIEW),
    payload: { data }
})

export const deletePostInApprovedPostView = (postId) => ({
    type: ActionEvent.DELETE_POST_IN_APPROVED_POST_VIEW,
    payload: { postId }
})

export const deletePostInApprovedPostViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_POST_IN_APPROVED_POST_VIEW),
    payload: { data }
})

export const getGroupPostsInPostView = filter => ({
    type: ActionEvent.GET_GROUP_POSTS_IN_POST_VIEW,
    payload: { ...filter }
})

export const getGroupPostsInPostViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_GROUP_POSTS_IN_POST_VIEW),
    payload: { data }
})

export const userSeenPost = (postId) => ({
    type: ActionEvent.USER_SEEN_POST,
    payload: { postId }
})

export const userSeenPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.USER_SEEN_POST),
    payload: { data }
})

export const pushNotificationForNewPost = postId => ({
    type: ActionEvent.PUSH_NOTIFICATION_WHEN_UPLOAD_NEW_POST_SUCCESS_IN_GROUP,
    payload: { postId }
})

export const pushNotificationForNewPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.PUSH_NOTIFICATION_WHEN_UPLOAD_NEW_POST_SUCCESS_IN_GROUP),
    payload: { data }
})