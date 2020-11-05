import React, {Component} from "react";
import {View, Text, TouchableOpacity, Image, RefreshControl, TextInput, Keyboard, Alert, Dimensions, Animated, Platform} from "react-native";
import BaseView from "containers/base/baseView";
import {Container, Header, Content, Root, Title, Col, Spinner} from "native-base";
import FlatListCustom from "components/flatListCustom";
import {Colors} from "values/colors";
import {Constants} from "values/constants";
import commonStyles from "styles/commonStyles";
import {Fonts} from "values/fonts";
import Utils from "utils/utils";
import StorageUtil from "utils/storageUtil";
import DialogCustom from "components/dialogCustom";
import StringUtil from "utils/stringUtil";
import * as actions from 'actions/userActions';
import * as categoryActions from 'actions/categoryActions';
import * as commonActions from 'actions/commonActions';
import {ErrorCode} from "config/errorCode";
import {getActionSuccess, ActionEvent} from "actions/actionEvent";
import {connect} from "react-redux";
import conversationStatus from "enum/conversationStatus";
import {async} from "rxjs/internal/scheduler/async";
import {localizes} from "locales/i18n";
import screenType from "enum/screenType";
import categoryType from "enum/categoryType";
import {thisExpression, isImport} from "@babel/types";
import sortType from "enum/sortType";
import statusType from 'enum/statusType';
import styles from "./styles";
import ItemCategory from "./itemCategory";
import ic_close_blue from 'images/ic_close.png';
import ic_add from 'images/ic_add.png';
import ic_sort_blue from 'images/ic_sort_blue.png';

const screen = Dimensions.get('window');
class CategoryListView extends BaseView {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            orderBy: sortType.DATE_MOST_RECENT,
            subjectId: null,
            stringSearch: null,
            enableLoadMore: false,
            subject: null,
            currentCategory: "Tech",
            currentSortType: sortType.DATE_MOST_RECENT.title
        };
        this.dataTemp = [];
        this.data = [];
        let {stringSearch, item, user, tab, status, navigation} = this.props;
        this.user = user;
        this.status = status;
        this.item = item;
        this.stringSearch = stringSearch
        this.currentStringSearch = stringSearch
        this.filter = {
            nameSearch: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            status: this.status
        };
        this.tab = tab
        this.enableLoadMore = false
        this.enableRefresh = true
    }

    componentWillMount () {}

    componentDidMount () {
        this.handleRequest();
        this.getProfile();
    }

    /**
     * Receive prop from advisory or redux
     */
    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            if (nextProps.stringSearch != this.state.stringSearch) {
                this.filter.stringSearch = nextProps.stringSearch;
                this.state.stringSearch = nextProps.stringSearch;
                this.data = []
                this.filter.paging.page = 0;
                this.getCategory();
                this.props = nextProps;
            } else {
                this.props = nextProps;
                this.handleData();
            }
            if (nextProps.status != this.status) {
                this.status = nextProps.status;
                this.filter.status = nextProps.status;
                this.props = nextProps;
                this.data = []
                this.getCategory();
            }
        }
    };

    /**
     * Handle data when request
     */
    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_CATEGORIES)) {
                    console.log("DATA GET JOBS LIST JOB VIEW: ", data)
                    if (data != null) {
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(element => {
                                if (this.data.find((item) => {
                                    if (item.id == element.id) return item;
                                    else return null;
                                }) == null) {
                                    if (element.status == this.status) {
                                        this.data.push({...element})
                                    }
                                }
                            });
                        } else {
                            this.state.enableLoadMore = false
                            this.showNoData = true;
                        }
                    } else {
                        this.state.enableLoadMore = false
                        this.showNoData = true;
                    }
                } if (this.props.action == getActionSuccess(ActionEvent.ADD_CATEGORY)) {
                    console.log("ADD category", data);
                    if (data) {
                        this.handleRefresh()
                    }
                }
                this.state.refreshing = false;
                this.state.isLoadingMore = false;
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * Get more notification
     */
    getMore = () => {
        if (this.data.length % Constants.PAGE_SIZE == 0 && this.state.enableLoadMore) {
            this.state.isLoadingMore = true;
            this.filter.paging.page = Math.round(this.data.length / Constants.PAGE_SIZE)
            this.getCategory();
        }
    }

    componentWillUnmount () {

    }

    /**
     * Refresh
     */
    handleRefresh = () => {
        this.state.enableLoadMore = false
        this.data = [];
        this.state.refreshing = true
        this.filter.paging.page = 0;
        this.filter.stringSearch = null;
        this.handleRequest();
    };

    /**
     * Get advisories
     */
    getCategory = () => {
        this.props.getCategories(this.filter)
    }

    /**
     * Request
     */
    handleRequest () {
        this.getSourceUrlPath()
        this.getCategory()
    }

    /**
     * Get profile
     * @param {*} user 
     */
    handleGetProfile (user) {
        this.userInfo = user;
    }

	/**
     * Get profile user
     */
    getProfile () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                if (!Utils.isNull(user)) {
                    this.userInfo = user;
                    this.props.getUserProfile(user.id);
                    this.handleGetProfile(user);
                }
            })
            .catch(error => {
                this.saveException(error, "getProfile");
            });
    }

    /**
     * Render advisory list
     */
    render () {
        return (
            <Root style={{backgroundColor: Colors.COLOR_BACKGROUND, }}>
                <FlatListCustom
                    onRef={(ref) => {this.flatListRef = ref}}
                    contentContainerStyle={{
                        // paddingBottom: Constants.PADDING_LARGE,
                    }}
                    ListHeaderComponent={this.renderFilter}
                    style={{
                        backgroundColor: Colors.COLOR_BACKGROUND,
                    }}
                    data={this.data}
                    renderItem={this.renderItem.bind(this)}
                    enableLoadMore={this.state.enableLoadMore}
                    enableRefresh={this.enableRefresh}
                    keyExtractor={item => item.code}
                    onLoadMore={() => {
                        this.getMore()
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                    isShowEmpty={this.showNoData}
                    isShowImageEmpty={false}
                    textForEmpty={"Không có dữ liệu"}
                    styleEmpty={{
                    }}
                />

                {/* {this.renderBtnAddCategory()} */}
                {this.state.refreshing || this.state.isLoadingMore ? null : this.showLoadingBar(this.props.isLoading)}
            </Root>
        );
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

    /**
     * Render filter
     */
    renderFilter = () => {
        return (
            <View style={{flexDirection: 'row', paddingHorizontal: Constants.PADDING_LARGE}}>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={[commonStyles.textSmall]}>{this.state.currentCategory}</Text>
                    <Image source={ic_sort_blue} style={{width: 18, height: 18}} />
                </TouchableOpacity>
                <Text style={{marginHorizontal: Constants.MARGIN_X_LARGE}}>|</Text>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={[commonStyles.textSmall]}>{this.state.currentSortType}</Text>
                    <Image source={ic_sort_blue} style={{width: 18, height: 18}} />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Render loading bar
     * @param {} isShow 
     */
    showLoadingBar (isShow) {
        return isShow ? < Spinner style={{
            position: 'absolute',
            top: screen.height / 2 - 141,
            left: 0,
            right: 0,
            justifyContent: 'center',
            bottom: 0
        }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItem (item, index, parentIndex, indexInParent) {
        return (
            <ItemCategory
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={this.onPressItemCategory}
            //TODO: on long press
            />
        );
    }

    onPressItemCategory = (item) => {
        //TODO : goto job detail
        this.props.navigation.navigate("CategoryDetail", {id: item.id})
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
    ...commonActions,
    ...categoryActions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryListView);
