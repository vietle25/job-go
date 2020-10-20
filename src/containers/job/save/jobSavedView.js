import React, { Component } from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler, Linking,
    TextInput, ImageBackground,
    Keyboard, Animated
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
import * as jobAction from 'actions/jobActions';
import { ErrorCode } from "config/errorCode";
import Utils from "utils/utils";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from "utils/storageUtil";
import statusType from "enum/statusType";
import StringUtil from "utils/stringUtil";
import HeaderGradient from "containers/common/headerGradient";
import ItemJob from "../list/itemJob";
import screenType from "enum/screenType";

export class JobSavedView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            enableLoadMore: false,
            enableRefresh: true,
        };
        this.data = [];
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
        }
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        this.getProfile()
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
                if (this.props.action == getActionSuccess(ActionEvent.GET_JOB_SAVE)) {
                    if (data != null) {
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(element => {
                                this.data.push({ ...element.object })
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
            this.getJobSaved();
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
    }

    handleRefresh = () => {
        this.state.enableLoadMore = false
        this.data = [];
        this.state.refreshing = true
        this.filter.paging.page = 0;
        this.filter.stringSearch = null;
        this.getJobSaved();
    };

    getJobSaved = () => {
        this.props.getJobSave(this.filter)
    }

    handleGetProfile(user) {
        this.userInfo = user;
    }

    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                if (!Utils.isNull(user)) {
                    this.userInfo = user;
                    this.props.getUserProfile(user.id);
                    this.getJobSaved();
                }
            })
            .catch(error => {
                this.saveException(error, "getProfile");
            });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={true}
                        title={"Việc làm đã lưu"}
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
                        : !this.props.isLoading ?
                            <Text style={{ flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>Đăng nhập hoặc đăng kí để lưu lại những việc làm yêu thích nhé</Text> : null}
                    {this.state.refreshing || this.state.isLoadingMore ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>

            </Container>
        )
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
                user={this.userInfo}
                onPress={this.onPressItem}
                onPressSave={this.onPressSave}
                screenType={screenType.SAVE_JOB_VIEW}
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
            setTimeout(() => {
                this.data.splice(index, 1)
                this.setState({
                    ok: true
                })
            }, 200)
        }
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("JobDetail", { id: item.id, callBack: this.handleRefresh })
    }

}

const mapStateToProps = (state) => ({
    data: state.job.data,
    isLoading: state.job.isLoading,
    errorCode: state.job.errorCode,
    action: state.job.action
})

const mapDispatchToProps = {
    ...actions,
    ...jobAction
}

export default connect(mapStateToProps, mapDispatchToProps)(JobSavedView)
