import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, RefreshControl, TextInput, Keyboard, Alert, Dimensions, Animated, UIManager, Platform } from "react-native";
import BaseView from "containers/base/baseView";
import { Container, Header, Content, Root, Title, Col, Spinner } from "native-base";
import FlatListCustom from "components/flatListCustom";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
import Utils from "utils/utils";
import StorageUtil from "utils/storageUtil";
import DialogCustom from "components/dialogCustom";
import StringUtil from "utils/stringUtil";
import * as actions from 'actions/userActions';
import * as jobActions from 'actions/jobActions';
import * as commonActions from 'actions/commonActions';
import { ErrorCode } from "config/errorCode";
import { getActionSuccess, ActionEvent } from "actions/actionEvent";
import { connect } from "react-redux";
import conversationStatus from "enum/conversationStatus";
import { async } from "rxjs/internal/scheduler/async";
import { localizes } from "locales/i18n";
import screenType from "enum/screenType";
import categoryType from "enum/categoryType";
import { thisExpression, isImport } from "@babel/types";
import sortType from "enum/sortType";
import statusType from 'enum/statusType';
import styles from "./styles";
import ItemJob from "../list/itemJob";
import ic_close_blue from 'images/ic_close.png';
import ic_add from 'images/ic_add.png';
import ic_sort_blue from 'images/ic_sort_blue.png';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import DateUtil from "utils/dateUtil";
const screen = Dimensions.get('window');
// if (
//     Platform.OS === 'android' &&
//     UIManager.setLayoutAnimationEnabledExperimental && Platform.Version > 23
// ) {
//     UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
// }
const LIST_MENU = [
    {
        label: sortType.DATE_MOST_RECENT.title,
        value: sortType.DATE_MOST_RECENT.value
    },
    {
        label: sortType.DATE_MOST_OLD.title,
        value: sortType.DATE_MOST_OLD.value
    }
]
class UserApplyHistoryListView extends BaseView {
    constructor(props) {
        super(props);
        this.itemAll = {
            id: null,
            name: "Tất cả"
        }
        this.state = {
            refreshing: false,
            orderBy: sortType.DATE_MOST_RECENT.value,
            subjectId: null,
            stringSearch: null,
            enableLoadMore: false,
            flatListScroll: true,
            subject: null,
            currentCategory: "Tech",
            category: this.itemAll,
            currentSortType: sortType.DATE_MOST_RECENT.title
        };
        this.dataTemp = [];
        this.data = [];
        let { stringSearch, item, user, tab, status, navigation, userId } = this.props;
        this.user = user;
        this.status = status;
        this.item = item;
        this.stringSearch = stringSearch
        this.currentStringSearch = stringSearch
        this.userId = userId
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            status: this.status,
            now: DateUtil.convertFromFormatToFormat(DateUtil.now(), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_TIME_ZONE)
        }
        this.tab = tab
        this.enableLoadMore = false
        this.enableRefresh = true
    }

    componentWillMount () { }

    componentDidMount () {
        this.getApplyHistory();
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
                this.getJobs();
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
                this.getJobs();
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
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_APPLY_HISTORY)) {
                    if (data != null) {
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(element => {
                                if (this.data.find((item) => {
                                    if (item.id == element.id) return item;
                                    else return null;
                                }) == null) {
                                    if (this.status != null) {
                                        if (element.status == this.status) {
                                            this.data.push({ ...element })
                                        }
                                    } else {
                                        this.data.push({ ...element })
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
            this.getApplyHistory()
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
        this.getApplyHistory();
    };

    getApplyHistory = () => {
        this.props.getUserApplyHistory(this.filter)
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
            <Root style={{ backgroundColor: Colors.COLOR_WHITE }}>
                <FlatListCustom
                    onRef={(ref) => { this.flatListRef = ref }}
                    // ListHeaderComponent={this.renderFilter}
                    style={{
                        backgroundColor: Colors.COLOR_WHITE
                    }}
                    data={this.data}
                    renderItem={this.renderItem}
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
                {this.state.refreshing || this.state.isLoadingMore ? null : this.showLoadingBar(this.props.isLoading)}
            </Root>
        );
    }

    renderFilterMenu = () => {
        return (
            <Menu
                style={{
                    position: "absolute",
                    right: 0,
                    top: Constants.MARGIN_XX_LARGE,
                }}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {LIST_MENU.map((item, index) => {
                        return (
                            <MenuOption
                                onSelect={() => {
                                    this.setState({
                                        currentSortType: item.label
                                    }, () => {
                                        this.data = []
                                        this.filter.orderBy = item.value
                                        this.getJobs();
                                    })
                                }}
                            >
                                <View
                                    style={[
                                        commonStyles.viewHorizontal,
                                        {
                                            alignItems: "flex-end",
                                            padding: Constants.MARGIN
                                        }
                                    ]}
                                >
                                    <Text>{item.label}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    }

    /**
    * Floating button add job
    */
    renderBtnAddJob () {
        return (
            <TouchableOpacity
                onPress={() => { this.props.navigation.navigate("AddJob", { callBack: this.handleRefresh, type: null }) }}
                style={styles.floatingButton}
            >
                <Image source={ic_add} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
        )
    }

    /**
     * Render filter
     */
    renderFilter = () => {
        return (
            <View style={{
                ...commonStyles.shadowOffset,
                flexDirection: 'row', paddingVertical: Constants.PADDING_LARGE + 2,
                backgroundColor: Colors.COLOR_WHITE, marginBottom: Constants.MARGIN_LARGE
            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("SelectCategory", {
                            callBack: this.handleSelectCategory, current: [this.state.category], screenType: screenType.FROM_HOME_VIEW
                        })
                    }}
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: Constants.MARGIN_X_LARGE }}>
                    <Text style={[commonStyles.textSmall]}>{this.state.category.name}</Text>
                    <Image source={ic_sort_blue} style={{ width: 18, height: 18 }} />

                </TouchableOpacity>
                <Text style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}>|</Text>
                <TouchableOpacity
                    onPress={() => { this.menuOption.open() }}
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: Constants.MARGIN_X_LARGE }}>
                    <Text style={[commonStyles.textSmall]}>{this.state.currentSortType}</Text>
                    <Image source={ic_sort_blue} style={{ width: 18, height: 18 }} />
                    {this.renderFilterMenu()}
                </TouchableOpacity>
            </View>
        )
    }

    handleSelectCategory = (item) => {
        this.setState({
            category: item
        }, () => {
            this.data = []
            this.filter.categoryId = item.id
            this.getJobs()
        })
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
    renderItem = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemJob
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={this.onPressItem}
            />
        );
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("JobDetail", { id: item.id, callBack: this.handleRefresh })
    }

}

const mapStateToProps = state => ({
    data: state.job.data,
    isLoading: state.job.isLoading,
    errorCode: state.job.errorCode,
    action: state.job.action
})

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...jobActions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserApplyHistoryListView);
