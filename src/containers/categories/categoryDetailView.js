import React, {Component} from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler,
    TextInput, ImageBackground,
    Keyboard
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
import * as actions from 'actions/userActions';
import * as categoryActions from 'actions/categoryActions';
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
import TextInputCustom from 'components/textInputCustom';
import DateUtil from "utils/dateUtil";
import ModalPopup from 'components/modalPopup'

const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;
const screen = Dimensions.get('window')

class CategoryDetailView extends BaseView {

    constructor(props) {
        super(props);
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
            isFocus: false,
            categoryName: "",
            isEdit: false
        };

        const {id, callBack} = this.props.route.params;
        this.id = id;
        this.callBack = callBack;
        this.showNoData = false;
        this.category = null
    }

    componentDidMount = () => {
        // super.componentDidMount();
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        this.handleRequest()
    }


    handleRequest = () => {
        this.props.getCategoryDetail(this.id);
    }

    /**
     * Get information user profile
     */
    getUserProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
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

    UNSAFE_componentWillReceiveProps (nextProps) {
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
                if (this.props.action == getActionSuccess(ActionEvent.GET_CATEGORY_DETAIL)) {
                    console.log("DATA GET CATEGORY: ", data);
                    if (data != null) {
                        this.category = data
                        this.state.categoryName = data.name
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.UPDATE_CATEGORY)) {
                    if (data != null) {
                        if (this.callBack) {
                            this.callBack()
                        }
                        if (data.status == statusType.ACTIVE) {
                            this.showMessage("Cập nhật thành công")
                        } else {
                            this.showMessage("Xóa danh mục thành công")
                        }
                        this.onBack()
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
        // this.props.navigation.addListener('blur', () => {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        // });
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.props.getUserProfile(this.state.userId);
        this.handleRequest()
    }


    /**
     * Render mid menu
     */
    renderMidMenu = () => {
        return !this.state.isSearch && <View style={{flex: 1}} />
    }


    render () {
        const {isSearch, enableRefresh, refreshing} = this.state;
        return (
            <Container>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={true}
                        title={"Chi tiết danh mục"}
                        titleStyle={{marginLeft: Constants.MARGIN_X_LARGE * 3, fontSize: Fonts.FONT_SIZE_XX_MEDIUM, color: Colors.COLOR_PRIMARY}}
                    />
                    <Content
                        contentContainerStyle={{
                            // flexGrow: 1
                        }}
                        style={{
                            flex: 1,
                        }}
                        enableRefresh={enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                    >
                        <TextInputCustom
                            backgroundColor={Colors.COLOR_TRANSPARENT}
                            placeholderTextColor={Colors.COLOR_BLACK}
                            styleInputGroup={{
                                marginLeft: Constants.MARGIN_X_LARGE
                            }}
                            refInput={ref => (this.categoryName = ref)}
                            isInputNormal={true}
                            placeholder={"Nhập tên danh mục"}
                            value={this.state.categoryName}
                            onChangeText={(text) => {
                                this.setState({
                                    categoryName: text
                                })
                            }}
                            visibleHr={this.state.isFocus}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                            returnKeyType={'done'}
                            inputNormalStyle={{marginLeft: Constants.MARGIN_LARGE + 4, fontWeight: 'bold', fontSize: Fonts.FONT_SIZE_X_LARGE}}
                        />
                        <View style={{paddingHorizontal: Constants.MARGIN_X_LARGE - 4}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={[commonStyles.text]}>Người tạo:</Text>
                                <Text style={[commonStyles.textBold]}>{this.category != null ? this.category.createdBy != null ? this.category.createdBy.name : "" : ""}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={[commonStyles.text]}>Ngày tạo:</Text>
                                <Text style={[commonStyles.textBold]}>{this.category != null ?
                                    DateUtil.convertFromFormatToFormat(this.category.createdAt,
                                        DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)
                                    : ""}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={[commonStyles.text]}>Số lượng việc:</Text>
                                <Text style={[commonStyles.textBold]}>2186</Text>
                            </View>
                        </View>
                        {this.renderButton()}
                    </Content>
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
                {this.renderModalDelete()}
            </Container>
        );
    }

    renderButton () {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: Constants.MARGIN_XX_LARGE}}>
                <TouchableOpacity
                    disabled={this.state.isEdit}
                    onPress={() => {
                        this.openModalDelete()
                    }}
                >
                    <Text style={[commonStyles.text, {color: Colors.COLOR_ERA}]}>{this.state.isEdit ? "" : "Xóa danh mục"}</Text>
                </TouchableOpacity>
                {/* <View style={{height: 16, width: 1, backgroundColor: Colors.COLOR_BLACK}}></View> */}
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.isEdit) {
                            if (this.state.categoryName != this.category.name) {
                                let filter = {
                                    id: this.id,
                                    name: this.state.categoryName,
                                    status: statusType.ACTIVE
                                }
                                this.props.updateCategory(filter)
                            }
                        } else {
                            this.categoryName.focus()
                        }
                        this.setState({
                            isEdit: !this.state.isEdit
                        })
                    }}>
                    <Text style={[commonStyles.text, {color: Colors.COLOR_PRIMARY}]}>{this.state.isEdit ? "Đồng ý" : "Chỉnh sửa"}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    openModalDelete = () => {
        this.refs.modalDelete.showModal()
    }

    hideModalDelete = () => {
        this.refs.modalDelete.hideModal()
    }

    renderModalDelete () {
        return (
            <ModalPopup
                ref={'modalDelete'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Xóa danh mục?</Text>
                    )
                }}
                onPressYes={() => {
                    let filter = {
                        id: this.id,
                        name: this.state.categoryName,
                        status: statusType.DELETE
                    }
                    this.props.updateCategory(filter)
                }}
            />
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
     * Render item
     */
    renderItemRow = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemCategory
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={() => {
                    onPressItem
                }}
            //TODO: on long press
            />
        )
    }

    onPressItem = (item) => {
        //TODO : goto job detail
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
    ...categoryActions
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetailView)