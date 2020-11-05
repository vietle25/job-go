import React, { Component } from "react";
import {
    View, Text, TouchableOpacity, Image, RefreshControl, TextInput, Keyboard, Alert, Dimensions, BackHandler,
    Animated, UIManager, Platform
} from "react-native";
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
import HeaderGradient from 'containers/common/headerGradient.js';

class ApplyHistoryView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            enableLoadMore: false,
            user: null
        };
        this.data = [];
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            now: DateUtil.convertFromFormatToFormat(DateUtil.now(), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_TIME_ZONE)
        }
        this.enableLoadMore = false
        this.enableRefresh = true
        this.userInfo = null
    }

    componentDidMount () {
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        this.getUserProfile();
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.handleData();
        }
    };

    getUserProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                this.noUser = false
                this.getApplyHistory();
                this.handleGetProfile(user)
                this.props.getUserProfile(user.id);
            }
        }).catch((error) => {
            this.saveException(error, "getUserProfile");
        });
    }

    handleGetProfile (user) {
        this.userInfo = user;
    }

    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_APPLY_HISTORY)) {
                    if (data.data.length > 0) {
                        this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                        data.data.forEach(element => {
                            this.data.push({ ...element })
                        });
                    } else {
                        this.state.enableLoadMore = false
                        this.showNoData = true;
                    }
                }
                this.state.refreshing = false;
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    getMore = () => {
        if (this.data.length % Constants.PAGE_SIZE == 0 && this.state.enableLoadMore) {
            this.filter.paging.page = Math.round(this.data.length / Constants.PAGE_SIZE)
            this.getApplyHistory()
        }
    }

    componentWillUnmount () {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
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
     * Render advisory list
     */
    render () {
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.handlerBackButton}
                        visibleBack={true}
                        title={"Việc làm đã ứng tuyển"}
                    />
                    {this.userInfo != null ?
                        <FlatListCustom
                            onRef={(ref) => { this.flatListRef = ref }}
                            style={{
                                backgroundColor: Colors.COLOR_WHITE,
                                paddingTop: Constants.PADDING_LARGE
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
                        : !this.props.isLoading ?
                            <Text style={{ flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>Đăng nhập hoặc đăng kí để ứng tuyển</Text> : null}
                    {this.state.refreshing || this.state.isLoadingMore ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>

            </Container>
        );
    }


    // /**
    //  * Render loading bar
    //  * @param {} isShow 
    //  */
    // showLoadingBar (isShow) {
    //     return isShow ? < Spinner style={{
    //         position: 'absolute',
    //         top: screen.height / 2 - 141,
    //         left: 0,
    //         right: 0,
    //         justifyContent: 'center',
    //         bottom: 0
    //     }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    // }

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
                onPressSave= {this.onPressSave}
            />
        );
    }

    onPressSave = (item, saved, index) => {
        if (this.userInfo == null) {
            this.showMessage("Bạn cần đăng nhập để lưu việc làm")
        } else {
            this.props.saveJob({
                jobId: item.id,
                status: - 1
            })
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
)(ApplyHistoryView);
