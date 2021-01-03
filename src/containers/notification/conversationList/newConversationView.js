import React, {Component} from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler,
    TextInput, ImageBackground, StatusBar
} from "react-native";
import {
    Container, Header, Content, Button, Icon, List, Tabs,
    Tab, TabHeading, ListItem, Text, SwipeRow, Body,
    Thumbnail, Root, Left, Title, Right,
} from "native-base";
import {localizes} from 'locales/i18n';
import FlatListCustom from "components/flatListCustom";
import I18n from 'react-native-i18n';
import {Colors} from "values/colors";
import commonStyles from "styles/commonStyles";
import styles from "../styles";
import {Constants} from "values/constants";
import BaseView from "containers/base/baseView";
import {Fonts} from "values/fonts";
import {connect} from 'react-redux';
import * as actions from 'actions/userActions';
import {ErrorCode} from "config/errorCode";
import Utils from "utils/utils";
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import StorageUtil from "utils/storageUtil";
import statusType from "enum/statusType";
import notificationType from "enum/notificationType";
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_close from 'images/ic_close.png';
import DialogCustom from "components/dialogCustom";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";
import screenType from "enum/screenType";
import slidingMenuType from "enum/slidingMenuType";
import ic_search_black from 'images/ic_search_blue.png';
import ic_back_black from 'images/ic_back_white.png';
import LinearGradient from "react-native-linear-gradient";

const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;

class NewConversationView extends BaseView {

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            userId: null,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isAlertConfirm: false,
            isLoadingMore: false,
            typing: false,
            typingTimeout: 0,
            isSearch: false,
            txtSearch: null
        };
        this.filter = {
            stringSearch: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };
        this.listFriends = [];
        this.showNoData = false;
    }

    componentDidMount () {
        super.componentDidMount();
        this.getSourceUrlPath();
        this.handleRequest();
        this.getUserProfile();
    }

    handleRequest () {
        this.props.getFriendsChatView(this.filter);
        this.props.countFriendRequests();
    }

    /**
     * Get information user profile
     */
    getUserProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.setState({
                    userId: user.id
                })
                setTimeout(() => {this.props.getUserProfile(user.id);}, 1000);
            }
        }).catch((error) => {
            this.saveException(error, "getUserProfile");
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData () {
        let data = this.props.data;
        console.log("get friend data: ", this.listFriends);
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_FRIENDS_CHAT_VIEW)) {
                    if (data.data.length > 0) {
                        this.state.enableLoadMore = !(data.data.length < 20);
                        data.data.forEach(item => {
                            if (this.listFriends.indexOf(item) == -1) {
                                this.listFriends.push({...item});
                            }
                        })
                    } else {
                        this.showNoData = true
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.COUNT_FRIEND_REQUESTS)) {
                    if (data != null) {
                        global.requestFriend = data
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.showNoData = true
            }
            this.state.refreshing = false;
        }
    }

    componentWillUnmount () {
        super.componentWillUnmount();
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.filter.paging.page = 0;
        this.filter.stringSearch = null;
        this.props.getUserProfile(this.state.userId);
        this.listFriends = [];
        this.handleRequest();
    }

    /**
     * Get more notification
     */
    getMoreFriends = () => {
        this.state.isLoadingMore = true;
        this.filter.paging.page += 1;
        this.requestNotification();
    }

    render () {
        var {data} = this.props;
        const {isSearch} = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        title={isSearch ? "" : localizes("newConversation")}
                        visibleSearchBar={isSearch}
                        iconRightSearch={ic_close}
                        onPressRightSearch={() => {
                            this.state.stringSearch = null;
                            this.onToggleSearch();
                            this.handleRefresh();
                        }}
                        placeholder={localizes("search")}
                        onRef={ref => {
                            this.txtSearch = ref
                        }}
                        autoFocus={true}
                        titleStyle={{marginLeft: Constants.MARGIN_XX_LARGE + Constants.MARGIN_LARGE}}
                        onChangeTextInput={this.onChangeTextInput}
                        onSubmitEditing={this.onSubmitEditing}
                        renderMidMenu={this.renderMidMenu}
                        renderRightMenu={this.renderRightMenu} />
                    <FlatListCustom
                        ListHeaderComponent={this.renderHeaderFlatList}
                        contentContainerStyle={{
                            paddingVertical: Constants.PADDING_LARGE
                        }}
                        style={[{
                            backgroundColor: Colors.COLOR_WHITE
                        }]}
                        keyExtractor={item => item.code}
                        data={this.listFriends}
                        renderItem={this.renderItemRow}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        enableLoadMore={this.state.enableLoadMore}
                        onLoadMore={() => {
                            this.getMoreFriends()
                        }}
                        showsVerticalScrollIndicator={false}
                        isShowEmpty={this.showNoData}
                        textForEmpty={isSearch ? 'Không có kết quả tìm kiếm phù hợp' : 'Không có dữ liệu'}
                    />
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    /**
     * On submit editing
     */
    onSubmitEditing = () => {

    }

    /**
     * Render mid menu
     */
    renderMidMenu = () => {
        return !this.state.isSearch && <View style={{flex: 1}} />
    }

    renderToolbar () {
        return (
            <View style={
                [
                    commonStyles.viewHorizontal,
                    commonStyles.viewCenter, {
                        paddingHorizontal: Constants.PADDING_LARGE
                    }
                ]} >
                {!this.state.isSearch ?
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => this.onBack()}>
                            <Image
                                // opacity={!this.state.isSearch ? 1 : 0}
                                style={{resizeMode: 'contain'}}
                                source={ic_back_black} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => this.onSearch()}>
                            <Image
                                opacity={this.state.isSearch ? 1 : 0}
                                style={{resizeMode: 'contain'}}
                                source={ic_search_black} />
                        </TouchableOpacity>
                    </View>

                }
                <View style={{flex: 1}}>
                    {
                        this.state.isSearch ?
                            <TextInput
                                style={[commonStyles.text, {
                                    color: Colors.COLOR_PRIMARY,
                                    margin: 0,
                                    borderRadius: 0,
                                    paddingHorizontal: Constants.PADDING_X_LARGE
                                }]}
                                placeholder={localizes('search')}
                                placeholderTextColor={Colors.COLOR_PRIMARY}
                                ref={r => (this.txtSearch = r)}
                                value={this.state.txtSearch}
                                onChangeText={this.onChangeTextInput}
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                                returnKeyType={"search"}
                            />
                            :
                            <Text style={[commonStyles.title, {textAlign: "center", margin: 0, padding: 0, color: Colors.COLOR_PRIMARY, fontWeight: 'bold'}]}>{localizes("newConversation")}</Text>
                    }
                </View>
                <View>
                    {
                        this.state.isSearch ?
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                onPress={() => {
                                    this.state.stringSearch = null
                                    this.onToggleSearch()
                                    this.handleRefresh()
                                }}
                            >
                                <Image
                                    style={{resizeMode: 'contain'}}
                                    source={ic_close} />
                            </TouchableOpacity> :
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                onPress={() => this.onToggleSearch()}>
                                <Image
                                    style={{resizeMode: 'contain'}}
                                    source={ic_search_black} />
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
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
                        style={{padding: Constants.PADDING_LARGE}}
                        onPress={() => this.onToggleSearch()}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={ic_search_black} />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    /**
     * Render header flat list
     */
    renderHeaderFlatList = () => {
        return (
            <View></View>
        )
    }

    /**
     * Render item header Flatlist
     */
    renderItemHeaderFlatlist = (item, index, parentIndex, indexInParent) => {
        return (
            <View></View>
        )
    }

    onSearch (text) {
        this.filter = {
            stringSearch: text,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };
        if (!Utils.isNull(text)) {
            this.listFriends = []
            this.props.getFriendsChatView(this.filter);
        } else {
            this.handleRefresh()
        }
    }

    /**
     * on toggle search
     */
    onToggleSearch () {
        if (!this.state.isSearch) {
            this.setState({
                isSearch: !this.state.isSearch
            }, () => {this.txtSearch.focus()});
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
        const self = this;
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout)
        }
        this.setState({
            txtSearch: stringSearch == "" ? null : stringSearch,
            typing: false,
            typingTimeout: setTimeout(() => {
                if (!Utils.isNull(stringSearch)) {
                    this.onSearch(stringSearch)
                } else {
                    this.handleRefresh()
                }
            }, 700)
        });
    }


    /**
     * Render item
     */
    renderItemRow = (item, index, parentIndex, indexInParent) => {
       
    }

    /**
     * On long press item
     */
    onLongPressItem = () => {
        this.setState({enableDelete: true, deleteAll: false})
    }

    /**
     * On check
     */
    onChecked = (itemPress) => {
        this.listNotifications.forEach(item => {
            if (item.id == itemPress.id) {
                item.isCheck = itemPress.isCheck;
                var itemUnCheck = this.listDelete.indexOf(item.id);
                if (itemPress.isCheck) {
                    if (itemUnCheck == -1) {
                        this.listDelete.push(item.id)
                    }
                } else {
                    if (itemUnCheck != -1) {
                        this.listDelete.splice(itemUnCheck, 1);
                    }
                }
            }
        });
        if (this.listDelete.length == this.listNotifications.length) {
            this.setState({deleteAll: true});
        } else {
            this.setState({deleteAll: false});
        }
    }

    /**
     * set title and content for model item 
     * @param {*} title
     * @param {*} content
     */
    onPressedItem (item, index) {
        this.props.navigation.navigate("Chat", {
            userMember: {
                id: item.friendId,
                name: item.friendName,
                avatarPath: item.avatar
            }
        });
    }
}

const mapStateToProps = state => ({
    data: state.listChat.data,
    isLoading: state.listChat.isLoading,
    error: state.listChat.error,
    errorCode: state.listChat.errorCode,
    action: state.listChat.action
})

const mapDispatchToProps = {
    ...actions,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewConversationView)