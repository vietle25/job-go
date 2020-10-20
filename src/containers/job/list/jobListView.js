import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, RefreshControl, TextInput, Keyboard, Alert, Dimensions, Animated, UIManager, LayoutAnimation, Platform } from "react-native";
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
import ItemJob from "./itemJob";
import ic_close_blue from 'images/ic_close.png';
import ic_add from 'images/ic_add.png';
import ic_sort_blue from 'images/ic_sort_blue.png';
import ic_search_blue from 'images/ic_search_blue.png';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import HeaderGradient from 'containers/common/headerGradient';
import areaType from "enum/areaType";
import ic_add_white from 'images/ic_add_white.png';
import ic_category from 'images/ic_category.png';
import ic_place from 'images/ic_place.png';

const screen = Dimensions.get('window');
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental && Platform.Version > 23
) {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}
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
class JobListView extends BaseView {
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
            currentSortType: sortType.DATE_MOST_RECENT.title,
            area: {
                province: {
                    id: null,
                    name: "Toàn quốc"
                },
                district: {
                    id: null,
                    name: "Tất cả"
                },
            },
            isSearch: false,
            stringSearch: null,
            typing: false,
            typingTimeout: 0,
        };
        this.dataTemp = [];
        this.data = [];
        let { stringSearch, item, user, tab, status, navigation, categoryId } = this.props;
        this.user = user;
        this.status = status;
        this.item = item;
        this.stringSearch = stringSearch
        this.currentStringSearch = stringSearch
        this.filter = {
            searchString: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            categoryId: null,
            status: statusType.ACTIVE,
            orderBy: this.state.orderBy,
            provinceId: this.state.area.province.id,
            districtId: this.state.area.district.id
        }
        this.tab = tab
        this.enableLoadMore = false
        this.enableRefresh = true
    }

    componentWillMount() { }

    componentDidMount() {
        this.handleRequest();
        this.getProfile();
    }

    /**
     * Receive prop from advisory or redux
     */
    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            if (nextProps.route && nextProps.route.params
                && nextProps.route.params.category && nextProps.route.params.category != this.state.category) {
                this.state.category = nextProps.route.params.category
                this.filter.categoryId = nextProps.route.params.category.id
                this.getJobs()
            } else {
                this.handleData();
            }
        }
    };

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_JOBS)) {
                    if (data != null) {
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(element => {
                                this.data.push({ ...element })
                            });
                            this.showNoData = false
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
            this.getJobs();
        }
    }

    componentWillUnmount() {

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
    getJobs = () => {
        console.log("GET JOB FILTER: ", this.filter);
        this.props.getJobs(this.filter)
    }

    /**
     * Request
     */
    handleRequest() {
        this.getJobs()
    }

    /**
     * Get profile
     * @param {*} user 
     */
    handleGetProfile(user) {
        this.userInfo = user;
    }

	/**
     * Get profile user
     */
    getProfile() {
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
    render() {
        return (
            <Container style={styles.container}>
                <Root style={{ backgroundColor: Colors.COLOR_BACKGROUND, }}>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={this.state.isSearch ? false : true}
                        title={'Việc làm'}
                        renderRightMenu={this.renderRightMenu}
                    />
                    <FlatListCustom
                        // onScroll={Animated.event(
                        //     [{
                        //         nativeEvent: { contentOffset: { y: this.scrollY } }
                        //     }],
                        //     {
                        //         listener: (event) => {
                        //             const CustomLayoutLinear = {
                        //                 duration: 200,
                        //                 create: {
                        //                     type: LayoutAnimation.Types.spring,
                        //                     property: LayoutAnimation.Properties.scaleY,
                        //                     springDamping: 0.9
                        //                 },
                        //                 delete: {
                        //                     type: LayoutAnimation.Types.easeInEaseOut,
                        //                     property: LayoutAnimation.Properties.opacity,
                        //                 },
                        //                 update: {
                        //                     type: LayoutAnimation.Types.easeInEaseOut,
                        //                     property: LayoutAnimation.Properties.opacity,
                        //                 },
                        //             }
                        //             const currentOffset = event.nativeEvent.contentOffset.y
                        //             const direction = (currentOffset > 0 && currentOffset > this.listViewOffset)
                        //                 ? 'down'
                        //                 : 'up'
                        //             const isActionButtonVisible = direction === 'up'
                        //             if (isActionButtonVisible !== this.state.flatListScroll) {
                        //                 LayoutAnimation.configureNext(CustomLayoutLinear)
                        //                 this.setState({ flatListScroll: isActionButtonVisible })
                        //             }
                        //             this.listViewOffset = currentOffset
                        //         }
                        //     },
                        //     { useNativeDriver: true }
                        // )}
                        onRef={(ref) => { this.flatListRef = ref }}
                        contentContainerStyle={{
                        }}
                        ListHeaderComponent={this.renderFilter}
                        style={{
                            backgroundColor: Colors.COLOR_WHITE,
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
                            marginTop: -50
                        }}
                    />
                    {this.renderBtnAddJob()}
                    {this.state.refreshing || this.state.isLoadingMore ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
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
    renderBtnAddJob() {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.user != null) {
                        this.props.navigation.navigate("AddJob", { callBack: this.handleRefresh, type: null })
                    } else {
                        this.props.navigation.navigate("Login")
                    }
                }}
                style={styles.floatingButton}
            >
                <Image source={ic_add_white} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
        )
    }

    /**
     * Render filter
     */
    renderFilter = () => {
        return (
            <View style={{
                // ...commonStyles.shadowOffset,
                flexDirection: 'row',
                paddingVertical: Constants.PADDING_LARGE + 2, backgroundColor: Colors.COLOR_WHITE,
                marginBottom: Constants.MARGIN_LARGE
            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("Area", {
                            callBack: this.handleSelectArea, current: this.state.area, screenType: screenType.FROM_JOB_VIEW, type: areaType.PROVINCE
                        })
                    }}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: Constants.MARGIN_X_LARGE }}>
                    <Image source={ic_place} style={{ width: 18, height: 18, marginRight: Constants.MARGIN_LARGE }} />
                    <Text style={[commonStyles.textSmall]}>{this.state.area.district.id != null ? this.state.area.district.name : this.state.area.province.name}</Text>
                    {/* <Image source={ic_sort_blue} style={{ width: 18, height: 18 }} /> */}

                </TouchableOpacity>
                <Text style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}>|</Text>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate("SelectCategory", {
                            callBack: this.handleSelectCategory, current: [this.state.category], screenType: screenType.FROM_HOME_VIEW
                        })
                    }}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: Constants.MARGIN_X_LARGE }}>
                    <Image source={ic_category} style={{ width: 18, height: 18, marginRight: Constants.MARGIN_LARGE }} />
                    <Text style={[commonStyles.textSmall]}>{this.state.category.name}</Text>
                    {/* <Image source={ic_sort_blue} style={{ width: 18, height: 18 }} /> */}

                </TouchableOpacity>
            </View>
        )
    }

    handleSelectArea = (province, district) => {
        console.log("HANDLE SELECT AREA: ", province, "  kjạaâ: ", district);
        this.setState({
            area: {
                province,
                district,
            }
        }, () => {
            this.filter.provinceId = province.id
            this.filter.districtId = district.id
            this.data = []
            this.handleRequest()
        })
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


    /**
     * On search
     * @param {} text 
     */
    onSearch(text) {
        this.filter.searchString = text
        if (!Utils.isNull(text)) {
            this.props.isLoading = true
            this.data = []
            this.handleRequest()
        } else {
            this.handleRefresh()
        }
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
                onPressSave={this.onPressSave}
                user={this.userInfo}
            />
        );
    }

    onPressSave = (item, saved) => {
        if (this.userInfo == null) {
            this.showMessage("Bạn cần đăng nhập để lưu việc làm")
        } else {
            if (this.props.isSaving != true) {
                this.props.saveJob({
                    jobId: item.id,
                    status: saved ? 1 : - 1
                })
            } else {
                setTimeout(() => {
                    this.timeOutRequest(item, saved)
                }, 3000)
            }
        }
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
)(JobListView);
