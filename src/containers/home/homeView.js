import React, { Component } from "react";
import {
    ImageBackground, View, Image, TouchableOpacity,
    BackHandler, Alert, Linking, ScrollView, NativeEventEmitter,
    DeviceEventEmitter, Platform, RefreshControl, Dimensions,
    SafeAreaView, NativeModules, StatusBar
} from "react-native";
import {
    Container, Title, Left, Icon, Right, Button, Body,
    Content, Text, Card, CardItem, Root, Header, Spinner
} from "native-base";
import styles from "./styles";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import ic_google_map from 'images/ic_google_map.png';
import { Constants } from "values/constants";
import Utils from 'utils/utils';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import * as jobActions from 'actions/jobActions';
import * as bannerActions from 'actions/bannerActions';
import * as categoryAction from 'actions/categoryActions';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import { localizes } from "locales/i18n";
import messing from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import RNRestart from 'react-native-restart';
import { Fonts } from "values/fonts";
import statusType from "enum/statusType";
import bannerType from "enum/bannerType";
import ModalBanner from "./modal/modalBanner";
import SliderBanner from "./slider/sliderBanner";
import DialogCustom from "components/dialogCustom";
import userType from "enum/userType";
import onClickType from "enum/onClickType";
import { configConstants } from "values/configConstants";
import img_gradient from 'images/img_gradient.png';
import FlatListCustom from "components/flatListCustom";
import ic_logo from "images/ic_logo.png";
import listType from "enum/listType";
import DateUtil from "utils/dateUtil";
import VersionNumber from 'react-native-version-number';
import screenType from "enum/screenType";
import ic_chat_white from 'images/ic_chat_white.png';
import LinearGradient from 'react-native-linear-gradient';
import ImageLoader from "components/imageLoader";
import sortType from "enum/sortType";
import categoryType from "enum/categoryType";
import HeaderGradient from "containers/common/headerGradient";
import ic_search_blue from 'images/ic_search_blue.png';
import StringUtil from 'utils/stringUtil';
import ic_cancel from 'images/ic_cancel_blue.png';
import { colors } from "react-native-elements";
import ItemJob from 'containers/job/list/itemJob';
import ic_add from 'images/ic_add.png';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ic_sort_blue from 'images/ic_sort_blue.png';
import { Action } from "rxjs/internal/scheduler/Action";
import JobList from './jobList'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import ic_find_job_large from 'images/ic_find_job_large.png';
import ic_manage_large from 'images/ic_manage_large.png';
import ic_star_blue from 'images/ic_star_blue.png';
import ic_post_blue from 'images/ic_post_blue.png';
import notificationType from "enum/notificationType";
import SplashScreen from 'react-native-splash-screen';

console.disableYellowBox = true;
const screen = Dimensions.get("window");
const LIST_MENU = [
    {
        label: sortType.DATE_MOST_RECENT.title,
        name: sortType.DATE_MOST_RECENT.title,
        value: sortType.DATE_MOST_RECENT.value
    },
    {
        label: sortType.DATE_MOST_OLD.title,
        name: sortType.DATE_MOST_OLD.title,
        value: sortType.DATE_MOST_OLD.value
    }
]

class HomeView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            userType: null,
            avatar: "",
            appVersion: null,
            enableLoadMore: false,
            enableRefresh: true,
            isLoadingMore: false,
            refreshing: false,
            isAlertVersion: false,
            posts: [],
            unseen: 0,
            notificationsNumber: 0,
            typing: false,
            typingTimeout: 0,
            isSearch: false,
            txtSearch: null,
            isLoadingMore: false,
            currentCategory: "Tech",
            currentSortType: sortType.DATE_MOST_RECENT.title,
            listJobs: []
        };
        this.bannerAfterLogin = null;
        this.bannerMainScreen = [];
        this.dataVersion = null;
        this.page = 0;
        this.showNoData = false;
        this.showNoData = false;
        global.openModalBanner = this.openModalBanner.bind(this);
        global.onExitApp = this.onExitApp.bind(this);
        this.listJobs = [];
        this.categories = []
    }

    /**
     * Press back exit app
     */
    onExitApp() {
        this.setState({ isAlertExitApp: true })
    }

    /**
     * Get profile user
     */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (user != null) {
                this.user = user;
                this.props.getUserProfile(user.id);
                this.handleRequest();
                this.signInWithCustomToken(user.id);
            }
        }).catch((error) => {
            this.saveException(error, 'getProfile')
        });
    }

    // handle get profile
    handleGetProfile(user) {
        this.setState({
            user: user,
            avatar: !Utils.isNull(user.avatarPath) && user.avatarPath.indexOf('http') != -1
                ? user.avatarPath
                : this.resourceUrlPath.textValue + "/" + user.avatarPath,
            userType: user.userType
        });
    }

    /**
     * Handle number unseen chat
     */
    handleUnseen() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            if (!Utils.isNull(user)) {
                try {
                    database().ref(`members`).on('value', (memberSnap) => {
                        let unseen = 0
                        if (!Utils.isNull(memberSnap.val())) {
                            let conversationIds = []
                            memberSnap.forEach(item => {
                                const objMember = item.val()
                                Object.keys(objMember).map((key, index) => {
                                    const uIdMember = key // ~ u1, u2, u3 ... (u = user_id)
                                    const valueMember = objMember[key] // ~ {number_of_unseen_messages: 15, deleted_conversation: true or false}
                                    const idMember = StringUtil.getNumberInString(uIdMember) // from u1 => 1...
                                    if (idMember == user.id & !valueMember.deleted_conversation) {
                                        unseen += valueMember.number_of_unseen_messages
                                    }
                                });
                            });
                            global.numberUnseen = unseen
                            // console.log("myGlobal.numberUnseen = unseen: ", global.numberUnseen)
                        }
                        this.setState({ unseen })
                    })
                } catch (error) {
                    console.log("ERROR GET UNSEEN BASEVIEW: ", error)
                }
            }
        }).catch(error => {

        });
    }

    async componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
        StorageUtil.retrieveItem(StorageUtil.VERSION).then((version) => {
            this.setState({
                appVersion: version
            })
        }).catch((error) => {
            this.saveException(error, 'componentDidMount')
        })
        this.handleRequest();
        this.props.getUpdateVersion();
        this.createNotificationListeners(); //add this line
        if (!global.logout) {
            this.getProfile();
            this.countNewNotification();
        }
        setTimeout(() => {
            this.getCategory();
        }, 1000)
    }

    getCategory = () => {
        let filter = {
            nameSearch: null,
            paging: {
                pageSize: Constants.PAGE_SIZE / 2 - 1,
                page: 0
            },
            status: 1
        }
        this.props.getCategoriesHomeView(filter)
    }

    getJob = () => {
        let filter = {
            searchString: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            categoryId: null,
            status: statusType.ACTIVE,
            orderBy: sortType.DATE_MOST_RECENT.value
        }
        this.props.getJobHomeView(filter)
    }


    //onRefreshing
    handleRefresh = () => {
        this.state.listJobs = []
        this.listJobs = []
        this.setState({ refreshing: true });
        this.getJob();
        this.getProfile()
        this.countNewNotification();
    }

    /**
     * Load more
     */
    loadMore = () => {
        if (!this.props.isLoading) {
            this.state.isLoadingMore = true;
            this.filterPost.paging.page += 1;
            this.props.getPosts(this.filterPost);
        }
    }

    // handle request
    handleRequest = () => {
        let timeout = 1000;
        let timeOutRequestOne = setTimeout(() => {
            clearTimeout(timeOutRequestOne)
        }, timeout);
    }

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        console.log(this.className, 'back pressed')
        if (this.props.navigation) {
            this.onExitApp();
        } else {
            return false
        }
        return true
    }

    /**
     * go to Login
     */
    gotoLogin = () => {
        this.props.navigation.navigate('Login')
    }

    /**
     * Go to Chat
     */
    gotoChat = async () => {
        const { user } = this.state;
        if (Utils.isNull(user)) {
            this.showLoginView();
        } else {
            // this.props.checkConversationActive();
            !Utils.isNull(this.userAdmin)
                && this.props.checkExistConversationInHome({ userMemberChatId: this.userAdmin.numericValue })
        }

    }

    /**
     * Go to h2 recently branch
     */
    gotoBranch = () => {
        const { user } = this.state;
        if (!Utils.isNull(user)) {
            this.props.navigation.navigate('Branch', { destination: null })
        } else {
            this.showLoginView({
                routeName: "Branch",
                params: { destination: null }
            })
        }
    }

    /**
     * Open modal Banner
     */
    openModalBanner(banner) {
        this.refs.modalBanner.showModal(banner);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }

    UNSAFE_componentWillUnmount() {
        super.componentWillUnmount();
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    /**
     * Handle data when request 
     */
    handleData() {
        let data = this.props.userInfo;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.isLoadingMore = false;
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    if (!Utils.isNull(data) && data.status == statusType.ACTIVE) {
                        StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                        this.handleGetProfile(data);
                    }
                } else if (this.props.action == ActionEvent.NOTIFY_LOGIN_SUCCESS) {
                    this.getProfile();
                } else if (this.props.action == getActionSuccess(ActionEvent.COUNT_NEW_NOTIFICATION)) {
                    let notifications = 0;
                    if (data != null) {
                        global.badgeCount = data;
                        notifications = global.badgeCount;
                        this.setState({ notificationsNumber: notifications });
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_UPDATE_VERSION)) {
                    this.checkUpdateVersion(data, this.state.appVersion)
                    this.props.getConfig();
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_CONFIG)) {
                    if (data) {
                        this.configList = data;
                        StorageUtil.storeItem(StorageUtil.MOBILE_CONFIG, this.configList);
                        this.configList.find((item) => {
                            if (item.name == "resource_url_path_resize") {
                                this.resourceUrlPathResize = item.textValue
                            }
                        })
                        this.props.getBanner()
                        this.getResource()
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_BANNER)) {
                    // StorageUtil.storeItem(StorageUtil.BANNER, data);
                    this.handleBanner(data);
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_JOB_HOME_VIEW)) {
                    if (data != null) {
                        if (data.data.length > 0) {
                            data.data.forEach(element => {
                                this.listJobs.push({ ...element })
                            });
                            this.state.listJobs = this.listJobs
                        } else {
                            this.state.enableLoadMore = false
                            this.showNoData = true;
                        }
                    } else {
                        this.state.enableLoadMore = false
                        this.showNoData = true;
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_CATEGORIES_HOME_VIEW)) {
                    this.getJob()
                    if (data != null) {
                        if (data.data.length > 0) {
                            this.categories = data.data
                            console.log("data get category", this.categories)
                            this.categories.push({
                                name: 'Xem thêm'
                            })
                            console.log("data get category 33333333333", this.categories)
                        }
                    }
                }
                this.state.refreshing = false
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    /**
     * Handle banner
     * @param {*} data 
     */
    handleBanner(data) {
        this.bannerMainScreen = [];
        if (!Utils.isNull(data)) {
            data.forEach((item) => {
                this.bannerMainScreen.push(item.pathToResource)
            })
            this.setState({
                ok: true
            })
        }
    }

    /**
     * get resource
     */
    getResource = async () => {
        await this.getSourceUrlPath();
    }

    /**
 * on toggle search
 */
    onToggleSearch() {
        if (!this.state.isSearch) {
            this.setState({
                isSearch: !this.state.isSearch
            }, () => { this.txtSearch.focus() });
        } else {
            this.setState({
                txtSearch: null,
                isSearch: !this.state.isSearch
            })
        }
    }

    /**
 * Manager text input search 
 * @param {*} stringSearch 
 */
    onChangeTextInput = (stringSearch) => {
        this.setState({
            enableLoadMore: false
        })
        const self = this;
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout)
        }
        this.setState({
            txtSearch: stringSearch == "" ? null : stringSearch,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.onSearch(stringSearch)
            }, 1000)
        });
    }

    onSubmitEditing = () => {
        this.onSearch(this.state.txtSearch)
    }

    /**
     * Render item
     */
    renderItemRow = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemJob
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={() => {
                    onPressItem
                }}
            //TODO: on long press
            />
        )
    }

    gotoUser = () => {
        this.props.navigation.navigate("UserManage")
    }

    gotoNotification = () => {
        this.props.navigation.navigate("Notification")
    }


    render() {
        StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true);
        const { user, avatar, posts, enableLoadMore, unseen, notificationsNumber, isSearch } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={false}
                        title={''}
                        visibleNotification={true}
                        visibleAccount={true}
                        user={this.state.user}
                        onPressUser={this.state.user ? this.gotoUser : this.gotoLogin}
                        gotoNotification={this.gotoNotification}
                    />
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{}}>
                        <SliderBanner
                            data={this.bannerMainScreen}
                        />
                        <View style={{ paddingVertical: Constants.PADDING_X_LARGE }}>
                            {this.renderViewManage()}
                            {this.renderSearchBar()}
                            {/* {this.renderJobCategory()} */}
                            {this.renderRecommendJob()}
                        </View>
                    </ScrollView>
                </Root>
                {/* Render Alert */}
                {this.renderAlertExitApp()}
                {this.renderAlertVersion()}
                {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
            </Container>
        );
    }

    renderSearchBar() {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.props.navigation.navigate("Search", { callBack: this.handleRefresh }) }}
                style={{
                    padding: Constants.PADDING,
                    ...commonStyles.shadowOffset,
                    backgroundColor: Colors.COLOR_WHITE,
                    paddingHorizontal: Constants.PADDING_LARGE,
                    marginHorizontal: Constants.MARGIN_X_LARGE,
                    borderWidth: 0.2,
                    borderColor: Colors.COLOR_GREY_LIGHT,
                    borderRadius: Constants.BORDER_RADIUS,
                    marginBottom: Constants.MARGIN_X_LARGE,
                    flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center'
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={ic_logo} style={{ width: 36, height: 36, marginRight: Constants.MARGIN_LARGE }} />
                    <Text style={[commonStyles.textPlaceHolder, { fontSize: Fonts.FONT_SIZE_XX_SMALL }]}>Chào {this.state.user != null ? <Text style={[commonStyles.textPlaceHolder, { fontSize: Fonts.FONT_SIZE_XX_SMALL, fontWeight: 'bold' }]}>{this.state.user.name}</Text> : ""}, bạn muốn tìm việc gì ?</Text>
                </View>
                <Image source={ic_search_blue} style={{}} />
            </TouchableOpacity>
        )
    }

    renderViewManage() {
        return (
            <View style={[commonStyles.cardView, {
                marginVertical: Constants.MARGIN_X_LARGE,
                marginTop: - 40,
                marginHorizontal: Constants.MARGIN_X_LARGE,
            }]}>
                {this.renderUserFindJob()}
            </View>
        )
    }

    renderUserFindJob() {
        return (
            <View>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', }]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (this.user != null) {
                                this.props.navigation.navigate("AddJob", { callback: this.handleRefresh })
                            } else {
                                this.gotoLogin()
                            }
                        }}
                        style={{ alignItems: 'center' }}>
                        <Image source={ic_post_blue} />
                        <Text style={commonStyles.textSmall}>Đăng tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { this.props.navigation.navigate("JobList") }}
                        style={{ alignItems: 'center' }}>
                        <Image source={ic_find_job_large} />
                        <Text style={commonStyles.textSmall}>Tìm việc làm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { this.props.navigation.navigate("ApplyHistory") }}
                        style={{ alignItems: 'center' }}>
                        <Image source={ic_manage_large} />
                        <Text style={commonStyles.textSmall}>Quản lý việc làm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { this.props.navigation.navigate("JobSaved") }}
                        style={{ alignItems: 'center' }}>
                        <Image source={ic_star_blue} />
                        <Text style={commonStyles.textSmall}>Yêu thích</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderJobCategory = () => {
        if (this.categories.length == 0) return null;
        return (
            <View style={{ paddingHorizontal: Constants.PADDING_X_LARGE }}>
                <Text style={[commonStyles.textBold]}>Danh mục</Text>
                <FlatListCustom
                    onRef={(ref) => { this.flatListRef = ref }}
                    style={{
                        marginVertical: Constants.MARGIN_X_LARGE,
                        backgroundColor: Colors.COLOR_WHITE,
                    }}
                    data={this.categories}
                    horizontal={false}
                    itemPerRow={3}
                    renderItem={this.renderItemCategory}
                    keyExtractor={({ item }) => item.id}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                />
            </View>
        )
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItemCategory = (item, index, parentIndex, indexInParent) => {
        return (
            <View style={{
                ...commonStyles.shadowOffset,
                backgroundColor: Colors.COLOR_WHITE,
                marginLeft: index == 0 || index == 3 || index == 6 ? 0 : Constants.MARGIN_LARGE,
                marginRight: index == 2 || index == 5 || index == 8 ? 0 : Constants.MARGIN_LARGE,
                marginBottom: Constants.MARGIN_LARGE,
                borderColor: Colors.COLOR_DRK_GREY,
                borderRadius: Constants.CORNER_RADIUS * 2,
                justifyContent: 'center',
                alignItems: 'center'

            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('JobList', {
                            category: {
                                id: item.id,
                                name: item.name
                            }
                        })
                    }}
                    style={{ padding: Constants.PADDING_LARGE }}>
                    <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_XX_SMALL }]}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderUserHireJob() {
        return (
            <View style={[{ marginTop: Constants.MARGIN_X_LARGE }]}>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={[commonStyles.text400, {
                        fontSize: Fonts.FONT_SIZE_X_MEDIUM + 1,
                        flex: 1,
                        color: Colors.COLOR_TEXT_PRIMARY,
                        marginHorizontal: Constants.MARGIN
                    }]}>Bạn đang cần nhân sự, thuê người...? Hãy đăng tin lên <Text style={{ fontWeight: 'bold', fontStyle: 'italic', color: Colors.COLOR_TEXT_PRIMARY }}>Work Fast</Text> ngay </Text>
                    <View style={{ width: 2, backgroundColor: Colors.COLOR_DRK_GREY, height: "60%", marginHorizontal: Constants.MARGIN_X_LARGE }}></View>
                    <TouchableOpacity style={{}}>
                        <Image source={ic_post_blue} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderRecommendJob() {
        return (
            <View style={[{ marginBottom: Constants.MARGIN_X_LARGE, }]}>
                <Text style={[commonStyles.text700, {
                    fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                    marginBottom: Constants.MARGIN_LARGE,
                    marginHorizontal: Constants.MARGIN_X_LARGE,
                }]}>Việc làm mới</Text>
                <JobList joblist={this.state.listJobs} navigation={this.props.navigation} onRefresh={this.handleRefresh} user={this.state.user} />
            </View>
        )
    }

    /**
     * Render loading bar
     * @param {} isShow
     */
    showLoadingBar(isShow) {
        return isShow ? < Spinner style={{
            position: 'absolute',
            top: screen.height / 2,
            left: 0,
            right: 0,
            justifyContent: 'center',
            bottom: 0
        }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    }


    onRemoveItemPost = (postId) => {
        let state = this.state;
        state.posts = state.posts.filter(item => { return postId != item.id });
        this.setState(state);
    }

    /**
     * Render header flat list
     */
    renderHeaderFlatList = () => {
        const { avatar } = this.state;
        return (
            <View>
                <ChoosePost
                    avatar={avatar}
                    onPressPost={this.onPressPost}
                />
                {this.renderCommendFriend()}
            </View>
        )
    }
    /**
     * Render mid menu
     */
    renderMidMenu = () => {
        return !this.state.isSearch && <View style={{ flex: 1 }} />
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        return (
            <View style={{}}>
                {this.state.isSearch ?
                    <View></View> :
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{ padding: Constants.PADDING_LARGE }}
                        onPress={() => this.onToggleSearch()}>
                        <Image
                            style={{ resizeMode: 'contain' }}
                            source={ic_search_black} />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    /**
     * OnPress post
     */
    onPressPost = (type) => {
        switch (type) {
            case choosePostType.NORMAL:
                this.gotoPost();
                break;
            case choosePostType.IMAGE:
                this.showCameraRollView({
                    assetType: "Photos",
                    callback: this.gotoPost,
                    maximum: 10
                })
                break;
            case choosePostType.VIDEO:
                console.log(`=== on press post : VIDEO ====`);
                this.showCameraRollView({
                    assetType: "Videos",
                    selectSingleItem: true,
                    callback: this.gotoPost
                });
                break;
            default:
                break;
        }
    }

    /**
     * Go to post
     */
    gotoPost = (resources = [], assetType = "All") => {
        console.log('gotoPost()');
        console.log(resources);
        console.log(assetType);

        this.props.navigation.navigate("Post", {
            viewPostType: viewPostType.NEWS,
            resources: resources,
            callback: (post) => {
                let state = this.state;
                state.posts.unshift(post);
                this.setState(state);
            },
            assetType: assetType
        });
    }


    /**
     * Render commend friend
     */
    renderCommendFriend() {
        return (
            !Utils.isNull(this.commendFriends) &&
            <View style={{ backgroundColor: Colors.COLOR_WHITE, paddingVertical: Constants.PADDING_LARGE, marginTop: Constants.MARGIN_LARGE }}>
                <CommendFriend
                    navigation={this.props.navigation}
                    gotoFriend={this.gotoFriend}
                    data={this.commendFriends}
                    onSendFriendRequest={this.onSendFriendRequest}
                    onCancelFriend={this.onCancelFriend}
                    onDeleteFriend={this.onDeleteFriend}
                    resourceUrlPathResize={this.resourceUrlPathResize}
                />
            </View>
        )
    }

    /**
     * On delete friend
     */
    onDeleteFriend = (friendId, userID) => {
        if (!this.props.isLoading) {
            this.props.deleteFriendSuggestion({ friendId });
        }
    }

    /**
     * On cancel friend
     */
    onCancelFriend = (friendId) => {
        if (!this.props.isLoading)
            this.props.cancelFriendRequest({ friendId });
    }

    /**
     * On send friend request
     */
    onSendFriendRequest = (friendId) => {
        if (!this.props.isLoading)
            this.props.sendFriendRequest({ friendId });
    }

    /**
     * Render Slider Banner
     */
    renderSliderBanner() {
        const { navigation } = this.props;
        return (
            <View>
                <SliderBanner navigation={navigation} data={this.bannerMainScreen} resourceUrlPath={this.resourceUrlPathResize.textValue} />
            </View>
        )
    }

    /**
     * Chat admin
     */
    chatWithAdmin = () => {
        if (!Utils.isNull(this.user)) {
            if (!Utils.isNull(this.admin)) {
                this.props.checkExistConversationInHome({ userMemberChatId: this.admin.id })
            }
        } else {
            this.showLoginView()
        }
    }

    /**
     * Render alert Exit App
     */
    renderAlertExitApp() {
        return (
            <DialogCustom
                visible={this.state.isAlertExitApp}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={"Thông báo"}
                textBtnOne={"Không, cảm ơn"}
                textBtnTwo={"Thoát"}
                contentText={"Bạn muốn thoát ứng dụng?"}
                onTouchOutside={() => { this.setState({ isAlertExitApp: false }) }}
                onPressX={() => { this.setState({ isAlertExitApp: false }) }}
                onPressBtnPositive={() => {
                    BackHandler.exitApp()
                }}
            />
        )
    }

    /**
     * Render alert Version
     */
    renderAlertVersion() {
        if (!Utils.isNull(this.dataVersion)) {
            return (
                <DialogCustom
                    visible={this.state.isAlertVersion}
                    isVisibleTitle={true}
                    isVisibleContentText={true}
                    isVisibleTwoButton={true}
                    contentTitle={localizes('homeView.updateNewVersion')}
                    textBtnOne={this.dataVersion.force === 0 ? localizes('no') : ""}
                    textBtnTwo={localizes('yes')}
                    contentText={this.dataVersion.description}
                    onTouchOutside={() => { this.setState({ isAlertVersion: false }) }}
                    onPressX={this.dataVersion.force === 0 ? () => {
                        this.setState({ isAlertVersion: false })
                        saveStorage(this.dataVersion)
                    } : null}
                    onPressBtnPositive={() => {
                        renderWebView(this.dataVersion.link)
                        this.setState({ isAlertVersion: false })
                        saveStorage(this.dataVersion)
                    }}
                />
            )
        }
    }

    /**
     * On click card member
     */
    onCardClick() {
        if (!Utils.isNull(this.state.user)) {
            this.onPressSearchVehicle(onClickType.FROM_CARD_MEMBER)
        } else {
            this.showLoginView()
        }
    }

    /**
     * Check update version
     */
    checkUpdateVersion = (data, appVersion) => {
        this.dataVersion = data
        if (data != null) {
            if (data.version.toString() > VersionNumber.appVersion) {
                if (data.force === 0) {
                    if (appVersion != null || appVersion != undefined) {
                        if (appVersion.version !== data.version) {
                            this.setState({ isAlertVersion: true })
                        }
                    } else {
                        this.setState({ isAlertVersion: true })
                    }
                } else {
                    this.setState({ isAlertVersion: true })
                }
            }
        } else {
            StorageUtil.deleteItem(StorageUtil.VERSION);
        }
    }
}

saveStorage = (data) => {
    StorageUtil.storeItem(StorageUtil.VERSION, data)
}

renderWebView = (link) => {
    Linking.openURL(link)
    RNRestart.Restart()
}

const mapStateToProps = state => ({
    userInfo: state.home.data,
    isLoading: state.home.isLoading,
    error: state.home.error,
    errorCode: state.home.errorCode,
    action: state.home.action,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...jobActions,
    ...bannerActions,
    ...categoryAction
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
