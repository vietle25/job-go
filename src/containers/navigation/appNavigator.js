import React, { Component } from "react";
import {
    Easing, Animated, View, Text
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LoginView from 'containers/login/loginView';
import SlidingMenuView from 'containers/profile/menu/slidingMenuView';
import HomeView from 'containers/home/homeView';
import RegisterView from 'containers/register/registerView';
import ConfirmRegisterView from 'containers/register/confirmRegisterView';
import SplashView from 'containers/splash/splashView';
import Main from 'containers/main/bottomTabNavigator';
import ForgotPasswordView from 'containers/forgotPassword/forgotPasswordView';
import ConfirmPasswordView from 'containers/forgotPassword/confirmPassword/confirmPasswordView';
import NotificationView from 'containers/notification/notificationList/notificationView';
import NotificationHomeView from 'containers/notification/notificationHomeView';
import QuestionAnswerView from 'containers/faq/questionAnswerView';
import ChangePasswordView from 'containers/changePassword/changePasswordView';
import OTPView from 'containers/otp/otpView';
import ChatView from "containers/chat/chatView";
import ListChatView from "containers/chat/listChatView";
import RegisterPartnerView from "containers/register/partner/registerPartnerView";
import SearchView from 'containers/search/list/searchView';
import EditProfileView from "containers/profile/edit/editProfileView";
import ConfirmSuccessView from "containers/confirm/confirmSuccessView";
import UserProfileView from 'containers/profile/info/userProfileView';
import CameraRollView from "containers/cameraRoll/cameraRollView";
import NewConversationView from "containers/notification/conversationList/newConversationView";
import CategoriesView from "containers/categories/categoriesView";
import UserManageView from 'containers/profile/users/usersManageView';
import CategoryDetailView from 'containers/categories/categoryDetailView';
import EditJobView from 'containers/job/add/editJobView';
import AddJobView from 'containers/job/add/addJobView';
import SelectCategory from 'containers/home/category/selectCategory';
import JobDetailView from 'containers/job/detail/jobDetailView';
import JobListView from 'containers/job/list/jobListView';
import AreaView from 'containers/area/areaView';
import JobPostManageView from 'containers/job/userPost/jobPostManageView';
import RecruitmentListView from 'containers/job/recruitment/recruitmentView';
import ApplyHistoryView from 'containers/job/userWork/applyHistoryView';
import BlogView from 'containers/blog/blogView';
import BlogDetailView from 'containers/blog/detail/blogDetailView';
import JobSavedView from 'containers/job/save/jobSavedView';

import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Main'}
                headerMode={'none'}
                mode={'modal'}
                screenOptions={{
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordView} />
                <Stack.Screen name="Splash" component={SplashView} />
                <Stack.Screen name="Login" component={LoginView} />
                <Stack.Screen name="Register" component={RegisterView} />
                <Stack.Screen name="ConfirmRegister" component={ConfirmRegisterView} />
                <Stack.Screen name="SlidingMenu" component={SlidingMenuView} />
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Notification" component={NotificationView} />
                <Stack.Screen name="NotificationHome" component={NotificationHomeView} />
                <Stack.Screen name="NewConversation" component={NewConversationView} />
                <Stack.Screen name="Home" component={HomeView} />
                <Stack.Screen name="QuestionAnswer" component={QuestionAnswerView} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordView} />
                <Stack.Screen name="ConfirmPassword" component={ConfirmPasswordView} />
                <Stack.Screen name="OTP" component={OTPView} />
                <Stack.Screen name="Chat" component={ChatView} />
                <Stack.Screen name="ListChat" component={ListChatView} />
                <Stack.Screen name="RegisterPartner" component={RegisterPartnerView} />
                <Stack.Screen name="Search" component={SearchView} />
                <Stack.Screen name="EditProfile" component={EditProfileView} />
                <Stack.Screen name="ConfirmSuccess" component={ConfirmSuccessView} />
                <Stack.Screen name="UserProfile" component={UserProfileView} />
                <Stack.Screen name="CameraRoll" component={CameraRollView} />
                <Stack.Screen name="Categories" component={CategoriesView} />
                <Stack.Screen name="UserManage" component={UserManageView} />
                <Stack.Screen name="CategoryDetail" component={CategoryDetailView} />
                <Stack.Screen name="EditJob" component={EditJobView} />
                <Stack.Screen name="SelectCategory" component={SelectCategory} />
                <Stack.Screen name="JobDetail" component={JobDetailView} />
                <Stack.Screen name="JobList" component={JobListView} />
                <Stack.Screen name="Area" component={AreaView} />
                <Stack.Screen name="JobPostManage" component={JobPostManageView} />
                <Stack.Screen name="RecruitmentList" component={RecruitmentListView} />
                <Stack.Screen name="ApplyHistory" component={ApplyHistoryView} />
                <Stack.Screen name="AddJob" component={AddJobView} />
                <Stack.Screen name="Blog" component={BlogView} />
                <Stack.Screen name="BlogDetail" component={BlogDetailView} />
                <Stack.Screen name="JobSaved" component={JobSavedView} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;
