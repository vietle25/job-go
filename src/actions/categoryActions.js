import { ActionEvent, getActionSuccess } from './actionEvent';

export const addCategory = (filter) => ({
    type: ActionEvent.ADD_CATEGORY,
    payload: { ...filter }
})

export const addCategorySuccess = data => ({
    type: getActionSuccess(ActionEvent.ADD_CATEGORY),
    payload: { data }
})

export const updateCategory = (filter) => ({
    type: ActionEvent.UPDATE_CATEGORY,
    payload: { ...filter }
})

export const updateCategorySuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_CATEGORY),
    payload: { data }
})

export const getCategories = (filter) => ({
    type: ActionEvent.GET_CATEGORIES,
    payload: { ...filter }
})

export const getCategoriesSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_CATEGORIES),
    payload: { data }
})

export const getCategoriesHomeView = (filter) => ({
    type: ActionEvent.GET_CATEGORIES_HOME_VIEW,
    payload: { ...filter }
})

export const getCategoriesHomeViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_CATEGORIES_HOME_VIEW),
    payload: { data }
})

export const getCategoriesAddJobView = (filter) => ({
    type: ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW,
    payload: { ...filter }
})

export const getCategoriesAddJobViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW),
    payload: { data }
})

export const getCategoryDetail = id => ({
    type: ActionEvent.GET_CATEGORY_DETAIL,
    payload: { id }
})

export const getCategoryDetailSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_CATEGORY_DETAIL),
    payload: { data }
})