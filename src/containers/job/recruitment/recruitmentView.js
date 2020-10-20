import React, { Component } from "react";
import {
    View, Text, TouchableOpacity, Image, RefreshControl,
    TextInput, Keyboard, Alert, Dimensions,
    Animated, UIManager, LayoutAnimation, Platform,
    Linking
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
import ItemRecruitment from "./itemRecruitment";

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
class RecruitmentListView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            subjectId: null,
            stringSearch: null,
            enableLoadMore: false,
            isSearch: false,
            enableRefresh: true,
            typing: false,
            typingTimeout: 0,
        };
        const { jobId } = this.props.route.params;
        this.data = [];
        this.user = null;
        this.jobId = jobId;
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            jobId: jobId
        }
    }

    componentDidMount() {
        this.getProfile()
        this.handleRequest();
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.handleData();
        }
    };

    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_JOB_RECRUITMENT)) {
                    console.log("DATA GET_JOB_RECRUITMENT VIEW: ", data)
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
            this.getRecruitment();
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
    getRecruitment = () => {
        this.props.getJobRecruitment(this.filter)
    }

    /**
     * Request
     */
    handleRequest() {
        this.getRecruitment()
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
                        title={'Danh sách ứng tuyển'}
                    />
                    <FlatListCustom
                        onRef={(ref) => { this.flatListRef = ref }}
                        contentContainerStyle={{
                        }}
                        style={{
                            backgroundColor: Colors.COLOR_WHITE,
                        }}
                        data={this.data}
                        renderItem={this.renderItem}
                        enableLoadMore={this.state.enableLoadMore}
                        enableRefresh={this.state.enableRefresh}
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
            </Container>
        );
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
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItem = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemRecruitment
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={this.onPressItem}
                openCall={this.openCall}
                gotoChat={this.gotoChat}
            />
        );
    }

    gotoChat = (item) => {
        this.props.navigation.navigate("Chat", {
            me: this.userInfo.id,
            userMember: {
                id: item.id,
                name: item.name,
                avatarPath: item.avatarPath
            },
            conversationId: null
        });
    }

    onPressItem = (item) => {
    }

    openCall = (phone) => {
        if (phone == null) return "Người này chưa đăng kí số điện thoại";
        let url = `tel:${phone}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
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
)(RecruitmentListView);
