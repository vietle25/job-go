import { ActionEvent, getActionSuccess } from './actionEvent'

export const getBlogs = (filter) => ({
    type: ActionEvent.GET_BLOGS,
    payload: { ...filter }
})

export const getBlogsSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BLOGS),
    payload: { data }
})

export const getBlogsHome = (filter) => ({
    type: ActionEvent.GET_BLOGS_HOME,
    payload: { ...filter }
})

export const getBlogsHomeSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_BLOGS_HOME),
    payload: { data }
})

export const getRelateBlog = (filter) => ({
    type: ActionEvent.GET_RELATE_BLOG,
    payload: { ...filter }
})

export const getRelateBlogSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_RELATE_BLOG),
    payload: { data }
})

export const getDetailBlog = id => ({
    type: ActionEvent.GET_DETAIL_BLOG,
    payload: { id }
})

export const getDetailBlogSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_DETAIL_BLOG),
    payload: { data }
})