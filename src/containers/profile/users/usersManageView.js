import React, { Component } from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler,
    TextInput, ImageBackground
} from "react-native";
import {
    Container, Header, Content, Button, Icon, List, Tabs,
    Tab, TabHeading, ListItem, Text, SwipeRow, Body, Spinner,
    Thumbnail, Root, Left, Title, Right,
} from "native-base";
import { localizes } from 'locales/i18n';
import FlatListCustom from "components/flatListCustom";
import I18n from 'react-native-i18n';
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import styles from "./styles";
import { Constants } from "values/constants";
import BaseView from "containers/base/baseView";
import { Fonts } from "values/fonts";
import { connect } from 'react-redux';
import * as actions from 'actions/userActions';
import { ErrorCode } from "config/errorCode";
import Utils from "utils/utils";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import ItemUser from "./itemUser";
import StorageUtil from "utils/storageUtil";
import statusType from "enum/statusType";
import notificationType from "enum/notificationType";
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_menu_vertical from 'images/ic_menu_vertical.png';
import ic_search_black from 'images/ic_search_blue.png';
import ic_close from 'images/ic_close.png';
import ic_cancel from 'images/ic_cancel_blue.png';
import DialogCustom from "components/dialogCustom";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";
import screenType from "enum/screenType";
import LinearGradient from "react-native-linear-gradient";
import slidingMenuType from "enum/slidingMenuType";
import ic_add from 'images/ic_add.png';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ic_sort_blue from 'images/ic_sort_blue.png';
import sortType from 'enum/sortType';
import listSlidingMenu from 'containers/profile/menu/listSlidingMenu';
import ItemSlidingMenu from "../menu/itemSlidingMenu";
import ImageLoader from "components/imageLoader";

const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;
const screen = Dimensions.get('window')

class UsersManageView extends BaseView {

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            userId: null,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isAlertConfirm: false,
            user: null,
            isAlert: false
        };
        this.filter = {
            stringSearch: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };
        this.listSlidingMenu = listSlidingMenu.USER
    }

    componentDidMount() {
        super.componentDidMount();
        this.handleRequest()
    }

    handleRequest = () => {
        this.getUserProfile()
    }
    /**
     * Get information user profile
     */
    getUserProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.setState({
                    userId: user.id,
                    user: user
                })
                if (!user.passwordNull) {
                    this.listSlidingMenu = listSlidingMenu.USER
                } else {
                    this.listSlidingMenu = listSlidingMenu.USER_SOCIAL
                }
                setTimeout(() => { this.props.getUserProfile(user.id); }, 1000);
            }
        }).catch((error) => {
            this.saveException(error, "getUserProfile");
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    if (data != null) {
                        this.state.user = data
                        this.state.userId = data.id
                        if (!data.passwordNull) {
                            this.listSlidingMenu = listSlidingMenu.USER
                        } else {
                            this.listSlidingMenu = listSlidingMenu.USER_SOCIAL
                        }
                    }
                } if (this.props.action == getActionSuccess(ActionEvent.RESET_PASSWORD)) {
                    if (data) {
                        this.handleRequest()
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.showNoData = true
            }
            this.state.refreshing = false;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    //onRefreshing
    handleRefresh = () => {
        this.props.getUserProfile(this.state.userId);
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
     * render menu
     */
    renderSlidingMenu() {
        return (
            <View style={{ marginHorizontal: Constants.PADDING_X_LARGE }}>
                <FlatListCustom
                    style={{
                        backgroundColor: Colors.COLOR_WHITE
                    }}
                    horizontal={false}
                    data={this.listSlidingMenu}
                    itemPerRow={1}
                    renderItem={this.renderItemSlide.bind(this)}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }


    /**
     * renderItem flat list
     */
    renderItemSlide(item, index, parentIndex, indexInParent) {
        return (
            <View>
                <ItemSlidingMenu
                    data={this.listSlidingMenu}
                    item={item}
                    index={index}
                    navigation={this.props.navigation}
                    userInfo={this.state.user}
                    callBack={() => { }}
                    resourceUrlPathResize={this.resourceUrlPathResize}
                    source={this.state.source}
                    onLogout={() => this.setState({ isAlert: true })}
                    style={global.appAdminType}

                />
                {index !=
                    this.listSlidingMenu.length - 1
                    ?
                    <View></View> : null}
            </View>
        );
    }


    /**
     * show dialog logout
     */
    logoutDialog = () => (
        <DialogCustom
            visible={this.state.isAlert}
            isVisibleTitle={true}
            isVisibleContentText={true}
            isVisibleTwoButton={true}
            contentTitle={"Xác nhận"}
            textBtnOne={"Hủy"}
            textBtnTwo={"Đăng xuất"}
            contentText={localizes('slidingMenu.want_out')}
            onTouchOutside={() => { this.setState({ isAlert: false }) }}
            onPressX={() => { this.setState({ isAlert: false }) }}
            onPressBtnPositive={() => {
                StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
                    if (token != undefined) {
                        // const deviceId = DeviceInfo.getDeviceId();
                        let filter = {
                            deviceId: "",
                            deviceToken: token
                        }
                        this.props.deleteUserDeviceInfo(filter) // delete device info
                    } else {
                        console.log('token null')
                    }
                }).catch((error) => {
                    //this callback is executed when your Promise is rejected
                    this.saveException(error, 'logoutDialog')
                });
                StorageUtil.deleteItem(StorageUtil.USER_PROFILE).then(user => {
                    console.log("user setting", user);
                    if (user == null) {
                        global.logout = true
                        this.showMessage(localizes('setting.logoutSuccess'))
                        this.setState({ isAlert: false })
                        this.onLogout()
                    } else {
                        this.showMessage(localizes('setting.logoutFail'))
                    }
                })
                    .catch(error => {
                        this.saveException(error, 'logoutDialog')
                    });
                this.signOutFB(this.state.userFB);
                this.signOutGG(this.state.userGG);

            }}
        />
    )

    onLogout = async () => {
        await this.logout()
        setTimeout(async () => {
            await this.goHomeScreen()
        }, 2000)
    }

    renderUser() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.user != null) {
                            this.props.navigation.navigate("UserProfile", { userId: this.state.userId })
                        } else {
                            this.props.navigation.navigate("Login")
                        }
                    }}
                    style={{
                        paddingHorizontal: Constants.PADDING_X_LARGE,
                        marginVertical: Constants.MARGIN_X_LARGE,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <ImageLoader
                        path={this.state.user ? this.state.user.avatarPath : null}
                        style={{ borderRadius: Constants.BORDER_RADIUS, width: 48, height: 48 }}
                    />
                    <Text style={{ flex: 1, marginLeft: Constants.MARGIN_X_LARGE }}>{this.state.user ? "Xin chào, " + this.state.user.name : "Đămg nhập / đăng kí"}</Text>
                </TouchableOpacity>
                <View>

                </View>
            </View>
        )
    }

    renderNotLogin = () => {
        return (
            <View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: Fonts.FONT_SIZE_X_LARGE,
                    }}>Xin chào</Text>
                    <Text style={[commonStyles.text400, {
                        textAlign: 'center',
                        paddingHorizontal: Constants.PADDING_X_LARGE,
                        marginTop: Constants.MARGIN_X_LARGE
                    }]}>Đăng nhập để đăng việc, quản lí việc làm và khám phá nhiều hơn nữa</Text>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate("Login") }}
                        style={{
                            backgroundColor: Colors.COLOR_PRIMARY,
                            paddingHorizontal: Constants.PADDING_XX_LARGE,
                            paddingVertical: Constants.PADDING_LARGE,
                            borderRadius: Constants.CORNER_RADIUS,
                            marginHorizontal: Constants.MARGIN_XX_LARGE,
                            marginTop: Constants.MARGIN_X_LARGE
                        }}
                    >
                        <Text style={{
                            color: Colors.COLOR_WHITE,
                            fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                        }}>Đăng nhập / Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        let { user } = this.state;
        if (user == null) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.COLOR_WHITE }}>
                    {this.renderNotLogin()}
                </View>
            )
        }
        return (
            <Container style={styles.container}>
                <Root>
                    <Content
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                    >
                        {this.renderUser()}
                        {this.renderSlidingMenu()}
                    </Content>
                    {this.logoutDialog()}
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    data: state.user.data,
    isLoading: state.user.isLoading,
    errorCode: state.user.errorCode,
    action: state.user.action
})

const mapDispatchToProps = {
    ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersManageView)