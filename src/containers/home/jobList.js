import React, { Component } from "react";
import {
    View, Text, TouchableOpacity, Image,
    RefreshControl, TextInput, Keyboard, Alert, Dimensions,
    Pressable
} from "react-native";
import BaseView from "containers/base/baseView";
import { Container, Header, Content, Root, Spinner } from "native-base";
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
import ItemJob from 'containers/job/list/itemJob';
import ic_close_blue from 'images/ic_close.png';
import ic_add from 'images/ic_add.png';
import ic_sort_blue from 'images/ic_sort_blue.png';
import HeaderGradient from 'containers/common/headerGradient';

class JobList extends BaseView {
    constructor(props) {
        super(props);

        this.state = {

        };
        let { joblist, navigation, user } = this.props;
        this.data = joblist != null && joblist.length > 0 ? joblist : []
        this.user = user;
        this.enableLoadMore = false
        this.enableRefresh = true
    }

    render() {
        let data = this.props.joblist != null ? this.props.joblist : [];
        if (data.length == 0) return null;
        return (
            <View style={{ backgroundColor: Colors.COLOR_WHITE }}>
                <FlatListCustom
                    onRef={(ref) => { this.flatListRef = ref }}
                    style={{
                        backgroundColor: Colors.COLOR_WHITE,
                    }}
                    data={data}
                    renderItem={this.renderItem}
                    enableLoadMore={this.state.enableLoadMore}
                    enableRefresh={this.enableRefresh}
                    keyExtractor={({ item }) => item.id}
                    showsVerticalScrollIndicator={false}
                    isShowEmpty={this.showNoData}
                    isShowImageEmpty={false}
                    textForEmpty={"Không có dữ liệu"}
                    styleEmpty={{
                    }}
                />
                {this.renderButtonViewMore()}
            </View>
        );
    }

    renderButtonViewMore() {
        return (
            <Pressable onPress={() => { this.props.navigation.navigate("JobList") }}>
                <Text style={{ textAlign: 'center', fontSize: Fonts.FONT_SIZE_XX_MEDIUM, color: Colors.COLOR_TEXT_PRIMARY }}>Xem thêm</Text>
            </Pressable>
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
                onPress={this.onPressItem}
                onPressSave={this.onPressSave}
                user={this.props.user}
            />
        );
    }

    onPressSave = (item, saved) => {
        if (this.props.user == null) {
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

    timeOutRequest = (item, saved) => {
        setTimeout(() => {
            console.log("Call on press save")
            this.onPressSave(item, saved)
        }, 5000)
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("JobDetail", { id: item.id, callBack: this.props.onRefresh })
    }

}

const mapStateToProps = state => ({
    data: state.job.data,
    isLoading: state.job.isLoading,
    errorCode: state.job.errorCode,
    action: state.job.action,
    isSaving: state.job.isSaving
})

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...jobActions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobList);
