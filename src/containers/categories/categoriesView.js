import React, {Component} from "react";
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
import {localizes} from 'locales/i18n';
import FlatListCustom from "components/flatListCustom";
import I18n from 'react-native-i18n';
import {Colors} from "values/colors";
import commonStyles from "styles/commonStyles";
import styles from "./styles";
import {Constants} from "values/constants";
import BaseView from "containers/base/baseView";
import {Fonts} from "values/fonts";
import {connect} from 'react-redux';
import * as actions from 'actions/actionEvent';
import * as categoryActions from 'actions/categoryActions';
import * as userActions from 'actions/userActions';
import {ErrorCode} from "config/errorCode";
import Utils from "utils/utils";
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import ItemCategory from "./itemCategory";
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
import ModalAddCateory from './modalAddCategory';
import CategoryListView from './categoryListView';


const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;
const screen = Dimensions.get('window')

class CategoriesView extends BaseView {

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            userId: null,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isAlertConfirm: false,
            typing: false,
            typingTimeout: 0,
            isSearch: false,
            txtSearch: null,
            isLoadingMore: false,
            currentCategory: "Tech",
            currentSortType: sortType.DATE_MOST_RECENT.title
        };
        this.filter = {
            nameSearch: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            status: 1
        };
        this.showNoData = false;
        this.categories = []
    }

    componentDidMount () {
        // super.componentDidMount();
        this.props.getCategories(this.filter)
        this.getUserProfile();
    }


    handleRequest = () => {

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
                // setTimeout(() => {this.props.getUserProfile(user.id);}, 1000);
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
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.ADD_CATEGORY)) {
                    console.log("ADD category", data);
                    if (data) {
                        this.showMessage("Thêm danh mục thành công")
                        this.handleRefresh()
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
        // super.componentWillUnmount();
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.filter.paging.page = 0;
        this.filter.stringSearch = null;
        this.props.getUserProfile(this.state.userId);
    }

    /**
     * Get more job
     */
    getMoreJob = () => {
        this.state.isLoadingMore = true;
        if (this.categories.length % Constants.PAGE_SIZE == 0) {
            this.state.isLoadingMore = true;
            this.filter.paging.page = Math.round(this.categories.length / Constants.PAGE_SIZE)
            this.handleRequest()
        }
    }

    /**
     * Render mid menu
     */
    renderMidMenu = () => {
        return !this.state.isSearch && <View style={{flex: 1}} />
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

    render () {
        console.log("render category view", this.categories);
        const {isSearch} = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={false}
                        visibleLogo={true}
                        title={isSearch ? "" : "Quản lý danh mục"}
                        visibleSearchBar={isSearch}
                        iconRightSearch={ic_cancel}
                        onPressRightSearch={() => {
                            this.state.txtSearch = null;
                            this.onToggleSearch();
                            this.handleRefresh();
                        }}
                        placeholder={localizes("search")}
                        onRef={ref => {
                            this.txtSearch = ref
                        }}
                        autoFocus={true}
                        titleStyle={{marginLeft: Constants.MARGIN_X_LARGE * 3, fontSize: Fonts.FONT_SIZE_XX_MEDIUM, color: Colors.COLOR_PRIMARY}}
                        onChangeTextInput={this.onChangeTextInput}
                        onSubmitEditing={this.onSubmitEditing}
                        renderMidMenu={this.renderMidMenu}
                        renderRightMenu={this.renderRightMenu} />
                    <ScrollableTabView
                        tabBarActiveTextColor={Colors.COLOR_PRIMARY}
                        tabBarUnderlineStyle={{backgroundColor: Colors.COLOR_PRIMARY, height: 2}}
                        tabBarInactiveTextColor={Colors.COLOR_BLACK}
                    >
                        <CategoryListView
                            tabLabel="Active"
                            status={statusType.ACTIVE}
                            navigation={this.props.navigation}
                        />
                        <CategoryListView
                            tabLabel="Deleted"
                            status={statusType.DELETE}
                            navigation={this.props.navigation}
                        />
                    </ScrollableTabView>
                    <ModalAddCateory
                        ref={'modalAdd'}
                        parentView={this}
                        onAddCategory={this.onAddCategory}
                        navigation={this.props.navigation} />
                    {this.renderBtnAddCategory()}
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );

    }

    onAddCategory = (name) => {
        let filter = {
            name: name
        }
        this.props.addCategory(filter);
    }



    /**
     * Render filter
     */
    renderFilter = () => {
        return (
            <View style={{flexDirection: 'row', paddingHorizontal: Constants.PADDING_LARGE}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <Text style={[commonStyles.textSmall]}>{this.state.currentCategory}</Text>
                    <Image source={ic_sort_blue} style={{width: 18, height: 18}} />
                </TouchableOpacity>
                <Text style={{marginHorizontal: Constants.MARGIN_X_LARGE}}>|</Text>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <Text style={[commonStyles.textSmall]}>{this.state.currentSortType}</Text>
                    <Image source={ic_sort_blue} style={{width: 18, height: 18}} />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Show loading bar
     * @param {*} isShow 
     */
    showLoadingBar (isShow) {
        return isShow ? <Spinner style={{position: 'absolute', top: (screen.height) / 2, left: 0, right: 0, bottom: 0, zIndex: 1000}} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    }

    /**
     * Floating button add job
     */
    renderBtnAddCategory () {
        return (
            <TouchableOpacity
                onPress={() => {this.refs.modalAdd.showModal()}}
                style={{
                    position: 'absolute',
                    right: Constants.MARGIN_X_LARGE,
                    bottom: Constants.MARGIN_X_LARGE,
                    backgroundColor: Colors.COLOR_PRIMARY,
                    borderRadius: Constants.BORDER_RADIUS,
                    padding: Constants.PADDING_X_LARGE
                }}
            >
                <Image source={ic_add} style={{width: 24, height: 24}} />
            </TouchableOpacity >
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
        this.listFriends = []
        this.handleRequest()
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
            <ItemCategory
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={this.onPressItemCategory}
            //TODO: on long press
            />
        )
    }

    onPressItemCategory = (item) => {
        //TODO : goto job detail
        this.props.navigation.navigate("CategoryDetail", {id: 0, callBack: this.handleRefresh})
    }
}

const mapStateToProps = state => ({
    data: state.category.data,
    isLoading: state.category.isLoading,
    errorCode: state.category.errorCode,
    action: state.category.action
})

const mapDispatchToProps = {
    ...actions,
    ...categoryActions,
    ...userActions
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesView)