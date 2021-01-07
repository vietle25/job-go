import React, { Component } from 'react';
import { BackHandler, Text, View, Image, Alert, Dimensions } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

// Import screens
import SlidingMenuView from 'containers/profile/menu/slidingMenuView';
import HomeView from 'containers/home/homeView';
import ListChatView from 'containers/chat/listChatView';
import CategoriesView from 'containers/categories/categoriesView';
import UserManageView from 'containers/profile/users/usersManageView';

// import icons
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import commonStyles from 'styles/commonStyles';
import { Constants } from 'values/constants';
import { connect } from 'react-redux';

import BottomTabCustom from 'components/bottomTabCustom';

// icon
import ic_job_black from "images/ic_jobs_black.png";
import ic_job_blue from "images/ic_job_blue.png";
import ic_category_blue from "images/ic_category_blue.png";
import ic_category_black from "images/ic_category_black.png";
import ic_review_black from "images/ic_review_black.png";
import ic_review_blue from "images/ic_review_blue.png";
import ic_user_black from "images/ic_user_black.png";
import ic_user_blue from "images/ic_user_blue.png";
import ic_home_blue from "images/ic_home_blue.png";
import ic_home_black from "images/ic_home_black.png";
import ic_blog_blue from "images/ic_blog_blue.png";
import ic_blog_black from "images/ic_blog_black.png";
import * as actions from 'actions/userActions';
import Utils from 'utils/utils';
import JobListView from 'containers/job/list/jobListView';
import BlogView from 'containers/blog/blogView';

const BottomTabNavigator = ({ badgeCount }) => {
	return (
		<Tab.Navigator
			initialRouteName="TabHome"
			activeColor={Colors.COLOR_PRIMARY}
			inactiveColor={Colors.COLOR_TEXT}
			backBehavior={"initialRoute"}
		>
			<Tab.Screen
				name="TabHome"
				component={HomeView}
				options={{
					title: "Việc làm",
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? ic_home_blue : ic_home_black} />
					),
					tabBarColor: Colors.COLOR_WHITE
				}}
			/>
			<Tab.Screen
				name="ListChat"
				component={ListChatView}
				options={{
					title: "Tin nhắn",
					tabBarIcon: ({ focused, color, size }) => (
						<View>
							<Image source={focused ? ic_review_blue : ic_review_black} />
							{global.unseenConversation && global.unseenConversation > 0 ?
								<View style={{
									backgroundColor: Colors.COLOR_BACKGROUND_COUNT_NOTIFY,
									borderRadius: Constants.CORNER_RADIUS * 3,
									paddingHorizontal: 4,
									alignItems: 'center',
									justifyContent: 'center',
									position: 'absolute',
									top: - 8, right: -6
								}}>
									<Text style={{
										color: Colors.COLOR_WHITE,
										fontSize: Fonts.FONT_SIZE_X_SMALL,
										textAlign: "center"
									}}>{global.unseenConversation}</Text>
								</View>
								: null
							}
						</View>
					),
					tabBarColor: Colors.COLOR_WHITE,
					tabBarBadge: badgeCount > 0 ? badgeCount : false
				}}
			/>
			<Tab.Screen
				name="JobList"
				component={JobListView}
				options={{
					title: "Việc làm",
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? ic_job_blue : ic_job_black} />
					),
					tabBarColor: Colors.COLOR_WHITE
				}}
			/>
			{/* <Tab.Screen
				name="Blog"
				component={BlogView}
				options={{
					title: "Blog",
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? ic_blog_blue : ic_blog_black} />
					),
					tabBarColor: Colors.COLOR_WHITE
				}}
			/>*/}
			<Tab.Screen
				name="UserManage"
				component={UserManageView}
				options={{
					title: "User",
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? ic_user_blue : ic_user_black} />
					),
					tabBarColor: Colors.COLOR_WHITE
				}}
			/>
		</Tab.Navigator>
	);
}

const mapStateToProps = state => ({
	badgeCount: state.bottomTabNavigator.data,
	isLoading: state.bottomTabNavigator.isLoading,
	errorCode: state.bottomTabNavigator.errorCode,
	action: state.bottomTabNavigator.action
})

const mapDispatchToProps = {
	...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);