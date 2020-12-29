import { ActionEvent, getActionSuccess } from './actionEvent';

export const addJob = (filter) => ({
    type: ActionEvent.ADD_JOB,
    payload: { ...filter }
})

export const addJobSuccess = data => ({
    type: getActionSuccess(ActionEvent.ADD_JOB),
    payload: { data }
})

export const updateJob = (filter) => ({
    type: ActionEvent.UPDATE_JOB,
    payload: { ...filter }
})

export const updateJobSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_JOB),
    payload: { data }
})

export const getJobs = (filter) => ({
    type: ActionEvent.GET_JOBS,
    payload: { ...filter }
})

export const getJobsSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_JOBS),
    payload: { data }
})

export const getJobDetail = (id) => ({
    type: ActionEvent.GET_JOB_DETAIL,
    payload: { id }
})

export const getJobDetailSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_JOB_DETAIL),
    payload: { data }
})

export const getJobHomeView = (filter) => ({
    type: ActionEvent.GET_JOB_HOME_VIEW,
    payload: { ...filter }
})

export const getJobHomeViewSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_JOB_HOME_VIEW),
    payload: { data }
})

export const getMyJobPost = (filter) => ({
    type: ActionEvent.GET_MY_JOB_POST,
    payload: { ...filter }
})

export const getMyJobPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MY_JOB_POST),
    payload: { data }
})

export const getJobRecruitment = (filter) => ({
    type: ActionEvent.GET_JOB_RECRUITMENT,
    payload: { ...filter }
})

export const getJobRecruitmentSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_JOB_RECRUITMENT),
    payload: { data }
})

export const applyJob = (filter) => ({
    type: ActionEvent.APPLY_JOB,
    payload: { ...filter }
})

export const applyJobSuccess = data => ({
    type: getActionSuccess(ActionEvent.APPLY_JOB),
    payload: { data }
})

export const getMyRecruitmentByJob = (filter) => ({
    type: ActionEvent.GET_MY_RECRUITMENT_BY_JOB,
    payload: { ...filter }
})

export const getMyRecruitmentByJobSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MY_RECRUITMENT_BY_JOB),
    payload: { data }
})

export const getUserApplyHistory = (filter) => ({
    type: ActionEvent.GET_USER_APPLY_HISTORY,
    payload: { ...filter }
})

export const getUserApplyHistorySuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_USER_APPLY_HISTORY),
    payload: { data }
})

export const dropApply = (filter) => ({
    type: ActionEvent.DROP_APPLY,
    payload: { ...filter }
})

export const dropApplySuccess = data => ({
    type: getActionSuccess(ActionEvent.DROP_APPLY),
    payload: { data }
})

export const searchJob = (filter) => ({
    type: ActionEvent.SEARCH_JOB,
    payload: { ...filter }
})

export const searchJobSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH_JOB),
    payload: { data }
})

export const saveJob = (filter) => ({
    type: ActionEvent.SAVE_JOB,
    payload: { ...filter }
})

export const saveJobSuccess = data => ({
    type: getActionSuccess(ActionEvent.SAVE_JOB),
    payload: { data }
})

export const getJobSave = (filter) => ({
    type: ActionEvent.GET_JOB_SAVE,
    payload: { ...filter }
})

export const getJobSaveSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_JOB_SAVE),
    payload: { data }
})