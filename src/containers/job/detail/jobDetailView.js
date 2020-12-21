import React, { Component } from "react";
import {
    ListView, View, Alert, Image, RefreshControl, Dimensions,
    FlatList, ScrollView, TouchableOpacity, BackHandler, Linking,
    TextInput, ImageBackground,
    Keyboard, Animated, StatusBar
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
import notificationType from "enum/notificationType";
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_back_blue from 'images/ic_back_blue.png';
import ic_position_blue from 'images/ic_position_blue.png';
import ic_dollar_blue from 'images/ic_dollar_blue.png';
import ic_chart_blue from 'images/ic_chart_blue.png';
import ic_clock_blue from 'images/ic_clock_blue.png';
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
import SliderBanner from "../slider/sliderBanner";
import ImageLoader from "components/imageLoader";
import Hr from "components/hr";
import jobType from "enum/jobType";
import img_expired from 'images/img_expired.png';
import StringUtil from "utils/stringUtil";

const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;
const screen = Dimensions.get('window')
const HEADER_EXPANDED_HEIGHT = screen.width * (9 / 16);
const HEADER_COLLAPSED_HEIGHT = Platform.OS === "ios" ? 72 : 78;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class JobDetailView extends BaseView {

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
            isEdit: false,
            scrollY: new Animated.Value(0),
            descriptionShow: false,
            requirementsShow: false,
            benefitShow: false,
            visibleApply: false
        };

        const { id, callBack } = this.props.route.params;
        this.id = id;
        this.callBack = callBack;
        this.showNoData = false;
        this.job = null
        this.jobResource = []
    }

    componentDidMount = () => {
        super.componentDidMount();
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        this.handleRequest();
        this.getUserProfile();
        this.setState({
            visibleApply: true
        })
    }


    handleRequest = () => {
        this.props.getJobDetail(this.id);
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
                let filter = {
                    jobId: this.id
                }
                this.props.getMyRecruitmentByJob(filter)
                setTimeout(() => { this.props.getUserProfile(user.id); }, 1000);
            }
        }).catch((error) => {
            this.saveException(error, "getUserProfile");
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_JOB_DETAIL)) {
                    console.log("DATA GET GET_JOB_DETAIL: ", data);
                    if (data != null) {
                        this.job = data
                        if (data.resources.length != 0) {
                            data.resources.forEach(element => {
                                this.jobResource.push(element.pathToResource)
                            });
                            console.log("jOB RESOURCE : ", this.jobResource);
                        }
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.UPDATE_JOB)) {
                    if (data != null) {
                        if (data.status == statusType.ACTIVE) {
                            this.showMessage("Phê duyệt thành công")
                            if (this.callBack) this.callBack()
                        } else if (data.status == statusType.DELETE) {
                            this.showMessage("Xóa thành công")
                            if (this.callBack) this.callBack()
                            this.onBack()
                        }
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.APPLY_JOB)) {
                    if (data != null) {
                        this.state.visibleApply = false
                        this.showMessage("Ứng tuyển thành công, nhà tuyển dụng sẽ liên hệ với bạn trong thời gian ngắn nhất")
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.DROP_APPLY)) {
                    if (data != null) {
                        this.state.visibleApply = true
                        if (this.callBack)
                            this.callBack()
                        // this.showMessage("Ứng tuyển thành công, nhà tuyển dụng sẽ liên hệ với bạn trong thời gian ngắn nhất")
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_MY_RECRUITMENT_BY_JOB)) {
                    if (data != null) {
                        this.recruitmentId = data.id
                        this.setState({
                            visibleApply: false
                        })
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.showNoData = true
            }
            this.state.refreshing = false;
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
    }

    //onRefreshing
    handleRefresh = (isUpdate = false) => {
        this.state.refreshing = true;
        this.state.enableLoadMore = false;
        this.props.getUserProfile(this.state.userId);
        this.handleRequest()
    }

    calculateDayLeft = (time) => {
        let calculated = DateUtil.diffDayToNow(time);
        return Math.floor(calculated)
    }

    refreshAfterLogin = (userId) => {
        this.props.getUserProfile(userId);
        setTimeout(() => {
            this.handleRequest()
        }, 500)
        this.setState({
            userId: userId
        })
    }

    /**
     * Render mid menu
     */
    renderMidMenu = () => {
        return !this.state.isSearch && <View style={{ flex: 1 }} />
    }


    render() {
        const { isSearch, enableRefresh, refreshing } = this.state;
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
            extrapolate: 'clamp'
        });
        const headerTitleOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        const heroTitleOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        const headerTitle = this.job != null ? this.job.title : ""

        return (
            <Container>
                <Root>
                    <Animated.View
                        collapsable={false}
                        style={[{
                            ...commonStyles.shadowOffset,
                            backgroundColor: 'white',
                            position: 'absolute',
                            width: screen.width,
                            top: 0,
                            left: 0,
                            // zIndex: -1000,
                            height: headerHeight
                        }]}>
                        <Animated.Text collapsable={false} numberOfLines={1} style={{
                            paddingHorizontal: Constants.MARGIN_X_LARGE * 3,
                            textAlign: 'center', fontSize: 18, color: 'black',
                            marginTop: 44, opacity: headerTitleOpacity
                        }}>{headerTitle}</Animated.Text>
                        <Animated.View collapsable={false} style={{ position: "absolute", bottom: 0, opacity: heroTitleOpacity }}>
                            {this.jobResource.length > 0 ?
                                <SliderBanner
                                    navigation={this.props.navigation} data={this.jobResource}
                                    resourceUrlPath={!Utils.isNull(this.resourceUrlPathResize) ?
                                        this.resourceUrlPathResize.textValue : null}
                                />
                                : null}
                        </Animated.View>
                        {/* <Animated.Text style={{textAlign: 'center', fontSize: 32, color: 'white', position: 'absolute', bottom: 16, left: 16, opacity: heroTitleOpacity}}>{headerTitle}
                        </Animated.Text> */}
                    </Animated.View>
                    <ScrollView
                        contentContainerStyle={{
                            paddingHorizontal: Constants.MARGIN_X_LARGE,
                            paddingTop: HEADER_EXPANDED_HEIGHT,
                            paddingBottom: 48,
                            // flex: 1
                            // height: Constants.MAX_HEIGHT
                        }}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: {
                                    contentOffset: {
                                        y: this.state.scrollY
                                    }
                                }
                            }])
                        }
                        scrollEventThrottle={16}
                        enableRefresh={enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[commonStyles.textBold, { fontSize: Fonts.FONT_SIZE_X_LARGE + 2, marginTop: Constants.MARGIN_LARGE }]}>{headerTitle}</Text>
                        {this.job && this.job.validTo && this.calculateDayLeft(this.job.validTo) < 0 ?
                            <Image source={img_expired}
                                style={{
                                    position: 'absolute',
                                    right: 50, top: 50,
                                    width: Constants.MAX_WIDTH * 0.4,
                                    resizeMode: 'contain',
                                    transform: [
                                        { rotateZ: '20deg' },
                                    ],
                                }} /> : null
                        }
                        {this.renderCreatedUser()}
                        {this.renderJobInfo()}
                        {this.renderJobDetail()}
                        {this.renderContact()}
                        {this.renderCategories()}
                    </ScrollView>
                </Root>
                {this.renderModalDelete()}
                {this.renderButton()}
                {this.renderModalApply()}
                {this.renderModalDropApply()}
                <TouchableOpacity
                    style={{ padding: 8, position: 'absolute', top: 36, left: 16, elevation: 16 }}
                    onPress={() => {
                        this.onBack()
                    }} >
                    <Image source={ic_back_blue}></Image>
                </TouchableOpacity>
                {this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                <StatusBar translucent backgroundColor='transparent' />
            </Container>
        );
    }

    /**
    * Render Slider Banner
    */
    renderSliderImage() {
        const { navigation } = this.props
        if (this.jobResource.length > 0) {
            return (
                <SliderBanner
                    navigation={navigation} data={this.jobResource}
                    resourceUrlPath={!Utils.isNull(this.resourceUrlPathResize) ?
                        this.resourceUrlPathResize.textValue : null}
                />
            )
        }
    }

    renderCreatedUser() {
        return (
            <View>
                <View style={{ flexDirection: 'row', marginVertical: Constants.MARGIN_X_LARGE, alignItems: 'center' }}>
                    <ImageLoader
                        resizeModeType={'contain'}
                        style={{ borderRadius: 500, width: 42, height: 42 }}
                        path={this.job ? this.job.company ? this.job.company.imagePath : this.job.createdBy.avatarPath ? this.job.createdBy.avatarPath : "" : ""}
                    />
                    <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_X_LARGE }]}>{this.job ? this.job.company ? this.job.company.name : this.job.createdBy.name : ""}</Text>
                </View>
                <Hr width={0.7} color={Colors.COLOR_DRK_GREY} />
            </View>
        )
    }

    renderJobInfo() {
        if (this.job == null) return null;
        return (
            <View>
                <View style={{ flexDirection: 'row', marginTop: Constants.MARGIN_LARGE + Constants.MARGIN, alignItems: 'center' }}>
                    <Image source={ic_position_blue} />
                    <Text style={[commonStyles.text, { marginLeft: Constants.MARGIN_LARGE }]}>Vị trí: </Text>
                    <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE }]}>{this.job.position}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: Constants.MARGIN + Constants.MARGIN, alignItems: 'center' }}>
                    <Image source={ic_dollar_blue} />
                    <Text style={[commonStyles.text, { marginLeft: Constants.MARGIN_LARGE }]}>Lương: </Text>
                    <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE }]}>{this.job.salary}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: Constants.MARGIN + Constants.MARGIN, alignItems: 'center' }}>
                    <Image source={ic_chart_blue} />
                    <Text style={[commonStyles.text, { marginLeft: Constants.MARGIN_LARGE }]}>Hình thức: </Text>
                    <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE }]}>{this.renderJobType(this.job.type)}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: Constants.MARGIN + Constants.MARGIN, alignItems: 'center' }}>
                    <Image source={ic_clock_blue} />
                    <Text style={[commonStyles.text, { marginLeft: Constants.MARGIN_LARGE }]}>Thời gian tuyển: </Text>
                    <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE }]}>{this.job.validTo ? DateUtil.convertFromFormatToFormat(this.job.createdAt,
                        DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) + " - " +
                        DateUtil.convertFromFormatToFormat(this.job.validTo,
                            DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)
                        : "Không giới hạn"
                    }</Text>
                </View>
                <Hr width={0.7} color={Colors.COLOR_DRK_GREY} style={{ marginTop: Constants.MARGIN_LARGE }} />
            </View>
        )
    }

    renderJobType = (type) => {
        if (type == jobType.FULL_TIME) {
            return "Toàn thời gian";
        } else if (type == jobType.PART_TIME) {
            return "Bán thời gian";
        } else if (type == jobType.COLLABORATORS) {
            return "Cộng tác viên";
        } else {
            return "-"
        }
    }

    renderJobDetail() {
        if (this.job == null) return null;
        return (
            <View>
                <View style={{ flexDirection: 'column', marginTop: Constants.MARGIN_LARGE }}>
                    <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_X_LARGE, marginVertical: Constants.MARGIN_LARGE }]}>Mô tả</Text>
                    <Text numberOfLines={this.state.descriptionShow ? undefined : 3} style={[commonStyles.text, { flex: 1 }]}>{this.job.description}</Text>
                    <Text onPress={() => {
                        this.setState({
                            descriptionShow: !this.state.descriptionShow
                        })
                    }} style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_XX_MEDIUM, marginVertical: Constants.MARGIN_LARGE, color: Colors.COLOR_PRIMARY, textAlign: 'center' }]} >
                        {this.state.descriptionShow ? "Thu gọn" : "Xem thêm"}
                    </Text>
                </View>
                <View style={{ flexDirection: 'column', marginTop: Constants.MARGIN_LARGE }}>
                    <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_X_LARGE, marginVertical: Constants.MARGIN_LARGE }]}>Yêu cầu công việc </Text>
                    <Text numberOfLines={this.state.requirementsShow ? undefined : 3} style={[commonStyles.text, { flex: 1 }]}>{this.job.requirements}</Text>
                    <Text onPress={() => {
                        this.setState({
                            requirementsShow: !this.state.requirementsShow
                        })
                    }} style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_XX_MEDIUM, marginVertical: Constants.MARGIN_LARGE, color: Colors.COLOR_PRIMARY, textAlign: 'center' }]} >
                        {this.state.requirementsShow ? "Thu gọn" : "Xem thêm"}
                    </Text>
                </View>
                {this.job.benefit != null ?
                    <View style={{ flexDirection: 'column', marginTop: Constants.MARGIN_LARGE }}>
                        <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_X_LARGE, marginVertical: Constants.MARGIN_LARGE }]}>Phúc lợi</Text>
                        <Text numberOfLines={this.state.benefitShow ? undefined : 3} style={[commonStyles.text, { flex: 1 }]}>{this.job.benefit}</Text>
                        <Text onPress={() => {
                            this.setState({
                                benefitShow: !this.state.benefitShow
                            })
                        }} style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_XX_MEDIUM, marginVertical: Constants.MARGIN_LARGE, color: Colors.COLOR_PRIMARY, textAlign: 'center' }]} >
                            {this.state.benefitShow ? "Thu gọn" : "Xem thêm"}
                        </Text>
                    </View>
                    : null}
                <View style={{ flexDirection: 'column', marginTop: Constants.MARGIN_LARGE }}>
                    <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_X_LARGE, marginVertical: Constants.MARGIN_LARGE }]}>Địa chỉ </Text>
                    <Text style={[commonStyles.text, { flex: 1 }]}>{this.job.district ? this.job.district.name : ""}{this.job.district && this.job.province ? ", " : ""}{this.job.province ? this.job.province.name : ""}</Text>
                    <Text style={[commonStyles.text, { flex: 1 }]}>{this.job.address}</Text>
                </View>
            </View>
        )
    }

    renderCategories() {
        if (this.job == null) return null;
        return (
            <View>
                <View style={{ flexDirection: 'row', marginTop: Constants.MARGIN_LARGE, alignItems: 'center' }}>
                    <Text style={[commonStyles.textBold,]}>Danh mục: </Text>
                    {
                        this.job.categoryModels.map((item, index) => {
                            return (
                                <Text key={index} style={[commonStyles.text]}>#{item.name}  </Text>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    renderButton() {
        if (this.job == null) return null;
        if (this.state.userId == null) {
            return (
                <TouchableOpacity
                    style={{ backgroundColor: Colors.COLOR_BACKGROUND, alignItems: 'center', paddingVertical: Constants.PADDING_X_LARGE }}
                    onPress={() => {
                        this.showLoginView({
                            routeName: 'JobDetail',
                            params: { screenType: screenType.JOB_DETAIL_VIEW, callBack: this.refreshAfterLogin }
                        })
                    }}>
                    <Text numberOfLines={2} style={[commonStyles.textBold, { color: Colors.COLOR_TEXT, fontSize: Fonts.FONT_SIZE_MEDIUM }]}>Đăng nhập để ứng tuyển</Text>
                </TouchableOpacity>
            )
        }
        if (this.job.createdBy && this.job.createdBy.id == this.state.userId) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    {this.job.status == statusType.ACTIVE ?
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: Colors.COLOR_ERA, alignItems: 'center', paddingVertical: Constants.PADDING_X_LARGE }}
                            onPress={() => {
                                this.openModalDelete()
                            }}>
                            <Text numberOfLines={2} style={[commonStyles.text, { color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_MEDIUM }]}>Xóa</Text>
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: this.job.status == statusType.ACTIVE ? Colors.COLOR_BLUE_SEA : Colors.COLOR_PRIMARY, alignItems: 'center', paddingVertical: Constants.PADDING_X_LARGE }}
                        onPress={() => {
                            this.props.navigation.navigate("EditJob", { id: this.job.id, callBack: this.handleRefresh, screenType: screenType.EDIT_POST_VIEW })
                        }}>
                        <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_MEDIUM }]}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: this.job.status == statusType.DRAFT ? Colors.COLOR_ERA : Colors.COLOR_PRIMARY, alignItems: 'center', paddingVertical: Constants.PADDING_X_LARGE }}
                        onPress={() => {
                            if (this.job.status == statusType.DRAFT) {
                                this.openModalDelete()
                            } else {
                                this.props.navigation.navigate("RecruitmentList", { jobId: this.id, callBack: this.handleRefresh })
                            }
                        }}>
                        <Text numberOfLines={2} style={[commonStyles.text, { color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_MEDIUM }]}>{this.job.status == statusType.DRAFT ? "Xóa" : "Danh sách ứng viên"}</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.job && this.job.validTo && this.calculateDayLeft(this.job.validTo) < 0) {
            return null;
        } else {
            if (!this.state.visibleApply)
                return (
                    <TouchableOpacity
                        style={{ backgroundColor: Colors.COLOR_ERA, alignItems: 'center', paddingVertical: Constants.PADDING_X_LARGE }}
                        onPress={() => {
                            this.openModalDropApply()
                        }}>
                        <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_XX_MEDIUM }]}>Bỏ ứng tuyển</Text>
                    </TouchableOpacity>
                );
            return (
                <TouchableOpacity
                    style={{ backgroundColor: Colors.COLOR_PRIMARY, alignItems: 'center', paddingVertical: Constants.PADDING_X_LARGE }}
                    onPress={() => {
                        this.openModalApply()
                    }}>
                    <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_XX_MEDIUM }]}>Ứng tuyển</Text>
                </TouchableOpacity>
            )
        }
    }

    renderOwnerButton() {
    }

    renderContact() {
        if (this.job == null) return null;
        // if (this.job.phoneContactPrimary == null && this.job.emailContact == null) return null;
        let justEmail = this.job.phoneContactPrimary == null && this.job.phoneContactSecondary == null && this.job.emailContact != null;
        let phonePrimary = this.job.phoneContactPrimary != null && this.job.phoneContactPrimary.split(" ").find((item) => { if (StringUtil.containNumber) return item });
        let phoneSecondary = this.job.phoneContactSecondary != null && this.job.phoneContactSecondary.split(" ").find((item) => { if (StringUtil.containNumber) return item });
        this.job.phoneContactPrimary = null
        return (
            <View>
                <View style={{ flexDirection: 'column', marginTop: Constants.MARGIN_LARGE, alignItems: 'flex-start' }}>
                    {!justEmail && this.job.phoneContactPrimary != null && <Text style={[commonStyles.textBold, { flex: 1 }]}>Liên hệ:
                        {this.job.phoneContactPrimary.split(" ").map((txt) => {
                        if (!StringUtil.containNumber(txt)) {
                            return (
                                <Text style={{ color: Colors.COLOR_BLACK }}>
                                    {" " + txt + " "}
                                </Text>
                            )
                        } else {
                            return (
                                <Text onPress={() => { Linking.openURL(`tel:${phonePrimary}`) }} style={{ color: Colors.COLOR_BLUE_SEA }}>{" " + txt + " "}</Text>
                            )
                        }
                    })}
                    </Text>}
                    <Text style={[{ flex: 1, marginTop: 4 }]}>{this.state.phoneContactPrimary == null ? <Text style={[commonStyles.textBold,]}>Liên hệ: </Text> : "               "}
                        {!justEmail && this.job.phoneContactSecondary != null && this.job.phoneContactSecondary.split(" ").map((txt) => {
                            if (!StringUtil.containNumber(txt)) {
                                return (
                                    <Text style={{ color: Colors.COLOR_BLACK }}>
                                        {" " + txt + " "}
                                    </Text>
                                )
                            } else {
                                return (
                                    <Text onPress={() => { Linking.openURL(`tel:${phoneSecondary}`) }} style={{ color: Colors.COLOR_BLUE_SEA }}>{" " + txt + " "}</Text>
                                )
                            }
                        })}
                    </Text>
                    <Text style={[{ flex: 1, marginTop: 4 }]}>{justEmail ? <Text style={[commonStyles.textBold,]}>Liên hệ: </Text> : "               "}
                        <Text style={[commonStyles.text]}>
                            {this.job.emailContact}
                        </Text>
                    </Text>
                </View>
                <Hr width={0.7} color={Colors.COLOR_DRK_GREY} style={{ marginTop: Constants.MARGIN_LARGE }} />
            </View>
        )
    }

    openModalApply = () => {
        this.refs.modalApply.showModal()
    }

    hideModalApply = () => {
        this.refs.modalApply.hideModal()
    }

    renderModalApply() {
        return (
            <ModalPopup
                ref={'modalApply'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Bạn muốn ứng tuyển công việc này ? Hãy chắc rằng bạn đã đọc kĩ mô tả và yêu cầu công việc</Text>
                    )
                }}
                onPressYes={() => {
                    let filter = {
                        jobId: this.id,
                    }
                    this.props.applyJob(filter)
                }}
            />
        )
    }


    openModalDropApply = () => {
        this.refs.modalDropApply.showModal()
    }

    hideModalDropApply = () => {
        this.refs.modalDropApply.hideModal()
    }

    renderModalDropApply() {
        return (
            <ModalPopup
                ref={'modalDropApply'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Hủy ứng tuyển công việc này ?</Text>
                    )
                }}
                onPressYes={() => {
                    let filter = {
                        id: this.recruitmentId,
                        jobId: this.id,
                    }
                    this.props.dropApply(filter)
                }}
            />
        )
    }

    openModalDelete = () => {
        this.refs.modalDelete.showModal()
    }

    hideModalDelete = () => {
        this.refs.modalDelete.hideModal()
    }

    renderModalDelete() {
        return (
            <ModalPopup
                ref={'modalDelete'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Bạn có chắc chắn xóa tin đăng này ?</Text>
                    )
                }}
                onPressYes={() => {
                    let filter = {
                        id: this.id,
                        status: statusType.DELETE
                    }
                    this.props.updateJob(filter)
                }}
            />
        )
    }

    /**
     * Show loading bar
     * @param {*} isShow 
     */
    showLoadingBar(isShow) {
        return isShow ? <Spinner style={{ position: 'absolute', top: (screen.height) / 2, left: 0, right: 0, bottom: 0, zIndex: 1000 }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
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
    ...jobAction
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailView)