import React, { Component } from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler,
    TextInput, ImageBackground
} from "react-native";
import {
    Container, Header, Content, Button, Icon, List, Tabs,
    Tab, TabHeading, ListItem, Text, SwipeRow, Body,
    Thumbnail, Root, Left, Title, Right,
} from "native-base";
import { localizes } from 'locales/i18n';
import FlatListCustom from "components/flatListCustom";
import I18n from 'react-native-i18n';
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import styles from "../styles";
import { Constants } from "values/constants";
import BaseView from "containers/base/baseView";
import { Fonts } from "values/fonts";
import { connect } from 'react-redux';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { ErrorCode } from "config/errorCode";
import Utils from "utils/utils";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import ItemNotification from "./itemNotification";
import StorageUtil from "utils/storageUtil";
import statusType from "enum/statusType";
import ModalContent from "./modalContent";
import database from '@react-native-firebase/database';
import notificationType from "enum/notificationType";
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_menu_vertical from 'images/ic_menu_vertical.png';
import DialogCustom from "components/dialogCustom";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";
import screenType from "enum/screenType";
import roleType from "enum/roleType";
import ic_read_all from 'images/ic_read_all.png';
import ModalPopup from "components/modalPopup";

const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;

class NotificationView extends BaseView {

    constructor(props) {
        super(props);
        const { route, navigation, callback } = this.props;
        this.state = {
            userId: null,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            enableDelete: false,
            deleteAll: false,
            isLoadingMore: false,
            isAlertDelete: false,
            isAlertConfirm: false,
            isShowAlertJoiningGroup: false,
            isAlertHasDeleted: false
        };
        this.typeIsSeen = {
            ONE_ITEM: 1,
            ALL_ITEM: 0
        }
        this.filter = {
            userId: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };
        this.callback = callback;
        this.data = []
        this.itemWatching = null;
        this.showNoData = false;
    }

    componentWillMount() {
        super.componentWillMount();
    }

    /**
     * Get information user profile
     */
    getUserProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                this.setState({
                    user: user
                })
                this.props.getUserProfile(user.id);
                this.filter.userId = user.id
                this.requestNotification();
            }
        }).catch((error) => {
            this.saveException(error, "getUserProfile");
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        const { deleteAll } = this.state;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false;
                this.state.isLoadingMore = false;
                if (this.props.action == getActionSuccess(ActionEvent.GET_NOTIFICATIONS)) {
                    if (!Utils.isNull(data)) {
                        this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE);
                        if (data.data.length > 0) {
                            data.data.forEach(item => {
                                this.data.push({ ...item })
                            });
                        } else {
                        }
                    }
                    this.showNoData = true;
                } else if (this.props.action == getActionSuccess(ActionEvent.COUNT_NEW_NOTIFICATION)) {
                    // firebase.notifications().setBadge(data);
                    global.badgeCount = data;
                } else if (this.props.action == getActionSuccess(ActionEvent.SEEN_NOTIFICATION)) {
                    if (data) {
                        // this.data = []
                        // this.requestNotification()
                        this.countNewNotification()
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.READ_ALL_NOTIFICATION)) {
                    if (data) {
                        this.data = []
                        this.showNoData = false
                        this.requestNotification()
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        this.languageDevice = I18n.locale;
        this.getSourceUrlPath();
        this.getUserProfile();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.filter.paging.page = 0;
        this.data = []
        this.showNoData = false
        this.requestNotification();
    }

    /**
     * get notification and update count
     */
    requestNotification() {
        this.props.getNotificationsRequest(this.filter);
        setTimeout(() => {
            this.countNewNotification();
        }, 1000);
    }

    onLoadMore = () => {
        if (this.data.length % Constants.PAGE_SIZE == 0 && this.state.enableLoadMore) {
            this.filter.paging.page = Math.round(this.data.length / Constants.PAGE_SIZE)
            this.requestNotification();
        }
    }

    /**
     * Update number notification seen
     * @param {*} type 
     * @param {*} itemNotificationId  // id of item notification when on click item notification
     */
    updateNumberIsSeen(type, itemNotificationId) {
        if (!Utils.isNull(this.state.user)) {
            this.filterNotificationIsSeen = {
                notificationIds: []
            };
            if (type == this.typeIsSeen.ALL_ITEM) {
                if (this.listNotifications.length > 0) {
                    this.props.readAllNotification();
                }
            } else if (type == this.typeIsSeen.ONE_ITEM) {
                this.filterNotificationIsSeen.notificationIds.push(itemNotificationId);
                this.props.postNotificationsView(this.filterNotificationIsSeen);
            }
        }
    }

    render() {
        var { data } = this.props;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={true}
                        title={"Thông báo"}
                        renderRightMenu={this.renderRightMenu}
                    />
                    {this.state.user != null ?
                        <FlatListCustom
                            contentContainerStyle={{
                                paddingVertical: Constants.PADDING_LARGE
                            }}
                            style={[{
                                backgroundColor: Colors.COLOR_WHITE
                            }]}
                            keyExtractor={item => item.code}
                            data={this.data}
                            renderItem={this.renderItem}
                            enableRefresh={this.state.enableRefresh}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.handleRefresh}
                                />
                            }
                            enableLoadMore={this.state.enableLoadMore}
                            onLoadMore={() => { this.onLoadMore() }}
                            showsVerticalScrollIndicator={false}
                            isShowEmpty={this.showNoData}
                            textForEmpty={'Không có dữ liệu'}
                        />
                        : !this.props.isLoading ? <Text style={{ flex: 1, textAlignVertical: 'center', textAlign: 'center', fontSize: Fonts.FONT_SIZE_MEDIUM }}>Đăng nhập để nhận được thông báo</Text> : null}

                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                    {this.renderModalReadAll()}
                </Root>
            </Container>
        );
    }

    renderModalReadAll = () => {
        return (
            <ModalPopup
                ref={'modalReadAll'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Đánh dấu đã đọc tất cả</Text>
                    )
                }}
                onPressYes={() => {
                    this.props.readAllNotification()
                }}
            />
        )
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    position: "absolute",
                    right: 0,
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => {
                    if (this.state.user != null)
                        this.refs.modalReadAll.showModal()
                }}>
                {this.state.user != null ?
                    <Image source={ic_read_all} />
                    : null}
            </TouchableOpacity>
        )
    }

    /**
     * Render item
     */
    renderItem = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemNotification
                key={index}
                item={item}
                index={index}
                parentIndex={parentIndex}
                indexInParent={indexInParent}
                onPress={this.onPressedItem}
            />
        )
    }

    /**
     * set title and content for model item 
     * @param {*} title
     * @param {*} content
     */
    onPressedItem = (item, index) => {
        console.log("ONPRESS ITEM", item.id);
        this.itemWatching = item;
        if (!item.seen) {
            this.props.seenNotification(item.id)
        }
    }
}

const mapStateToProps = state => ({
    data: state.notifications.data,
    isLoading: state.notifications.isLoading,
    errorCode: state.notifications.errorCode,
    action: state.notifications.action
})

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView)