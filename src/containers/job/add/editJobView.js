import React, { Component } from 'react';
import {
    View,
    Text,
    BackHandler,
    RefreshControl,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    NativeModules,
    Platform, Keyboard
} from 'react-native';
import BaseView from 'containers/base/baseView';
import * as commonActions from 'actions/commonActions';
import * as jobActions from 'actions/jobActions';
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import styles from './styles';
import { Container, Root, Content, Spinner } from 'native-base';
import HeaderGradient from 'containers/common/headerGradient';
import { localizes } from 'locales/i18n';
import Hr from 'components/hr';
import { Colors } from 'values/colors';
import img_image from 'images/img_image.png';
import commonStyles from 'styles/commonStyles';
import { Constants } from 'values/constants';
import StorageUtil from 'utils/storageUtil';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import TextInputCustom from 'components/textInputCustom';
import FlatListCustom from 'components/flatListCustom';
import jobType from 'enum/jobType';
import DialogCustom from 'components/dialogCustom';
import Upload from 'react-native-background-upload';
import ServerPath from 'config/Server';
import screenType from 'enum/screenType';
import SlideResource from 'containers/home/resource/slideResource';
import StringUtil from 'utils/stringUtil';
import resourceType from 'enum/resourceType';
import resourceOrientationType from 'enum/resourceOrientationType';
import roleType from 'enum/roleType';
import ModalImageViewer from 'containers/common/modalImageViewer';
import ModalVideoViewer from 'containers/common/modalVideoViewer';
import CameraRoll from "@react-native-community/cameraroll";
import RNFetchBlob from 'rn-fetch-blob';
import DateUtil from 'utils/dateUtil';
import storage from '@react-native-firebase/storage';
import { TextInputMask } from "react-native-masked-text";
import { CheckBox } from "react-native-elements";
import { CalendarScreen } from 'components/calendarScreen';
import moment, { locales } from 'moment';
// const { RNTrimmerManager: TrimmerManager } = NativeModules;
import ic_close_blue from 'images/ic_close.png';
import ic_add from 'images/ic_add.png';
import ModalPopup from 'components/modalPopup';
import areaType from 'enum/areaType';
import { Fonts } from "values/fonts";
import statusType from 'enum/statusType';
var RNFS = require('react-native-fs');


const window = Dimensions.get("window");
const AVATAR_SIZE = 36;
const AVATAR_BORDER = AVATAR_SIZE / 2;
const VIDEO_COMPRESS = {
    width: 720,
    height: 480,
    bitrateMultiplier: 4, //reduce video
    minimumBitrate: 240000, // bitrate
    removeAudio: false, //remove audio
};

class EditJobView extends BaseView {

    constructor(props) {
        super(props);
        const { route, navigation } = this.props;
        this.state = {
            enableRefresh: true,
            refreshing: false,
            avatar: null,
            title: null,
            description: null,
            salary: null,
            position: null,
            requirement: null,
            benefit: null,
            address: null,
            type: 1,
            validTo: null,
            companyId: null,
            categoryId: [],
            resources: [],
            province: null,
            district: {
                name: 'Tất cả',
                id: null
            },
            progress: 0,
            visibleProgressUpload: false,
            hideProgressUpload: true,
            uploading: false,
            isAlertSuccess: false,
            titleHeader: "Đăng bài viết",
            idResourceDeletes: [],
            keyboardHeight: 0,
            isCompressingVideo: false,
            isDisableButton: true,
            isLoading: false,
            phoneContactPrimary: null,
            phoneContactSecondary: null,
            emailContact: null
        };
        this.user = null;
        this.callBack = route.params.callBack;
        this.screenType = route.params.screenType ? route.params.screenType : screenType.POST_VIEW;
        this.id = route.params.id ? route.params.id : null;
        this.postMethods = [
            {
                "id": jobType.FULL_TIME,
                "name": "Toàn thời gian - full time"
            },
            {
                "id": jobType.PART_TIME,
                "name": "Bán thời gian - part time"
            },
            {
                "id": jobType.COLLABORATORS,
                "name": "Cộng tác viên"
            }
        ];
        this.indexUpload = 0;
        this.uploadId = null;
        this.postTemp = null;
        this.screenFocused = false;
        this.optionsForVideoThumbnail = null;
        this.uploadHasVideo = false;
        this.localNotification = null;
        this.interval = null;
        this.currentTimeVideo = 0;
        this.videoWidth = -1;
        this.videoHeight = -1;
        this.listCategory = []
        this.images = []
        this.job = null
        this.jobResource = []
    }

    /**
     * Handle show keyboard 
     * @param {*} e 
     */
    keyboardWillShow (e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }

    /**
     * Handle hide keyboard
     * @param {*} e 
     */
    keyboardWillHide (e) {
        this.setState({ keyboardHeight: 0 });
    }

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        const { resources, description, nameProduct, priceProduct, quantityProduct, uploading } = this.state;
        if (this.props.navigation) {
            this.onBack();
        } else {
            return false
        }
        return true
    }

    getJobDetail = () => {
        this.props.getJobDetail(this.id);
    }

    componentDidMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);

        let state = this.state;
        this.getSourceUrlPath();
        this.getUploadRestriction();
        this.getProfile();
        // this.createNotificationCompress()
        this.getTitle()
        if (this.screenType == screenType.EDIT_POST_VIEW) {
            this.getJobDetail()
        }
    }

    getTitle = () => {
        if (this.screenType == screenType.POST_VIEW) {
            this.setState({
                titleHeader: "Đăng việc mới"
            })
        } else if (this.screenType == screenType.EDIT_POST_VIEW) {
            this.setState({
                titleHeader: "Chỉnh sửa việc làm"
            })
        }
    }

    /**
     * Create notification on compress video
     */
    createNotificationCompress = () => {
        // this.localNotification = new firebase.notifications.Notification({
        //     sound: 'default', show_in_foreground: false
        // }).setNotificationId('aaChannelId').setTitle("Video processing").setBody("Video đang được xử lý");
        // if (Platform.OS === 'android' && this.localNotification.android.channelId == null) {
        //     const channel = new firebase.notifications.Android.Channel(
        //         'aaChannelId',
        //         'Thông báo chung',
        //         firebase.notifications.Android.Importance.Max
        //     ).setDescription('In stock channel');
        //     // Create the channel
        //     firebase.notifications().android.createChannel(channel);
        //     this.localNotification.android.setChannelId(channel.channelId);
        //     this.localNotification.android.setAutoCancel(true);
        //     this.localNotification.android.setOnlyAlertOnce(true)
        // }
    }

    /**
     * Set progress notification
     */
    updateProgressNotification = (progress) => {
        this.localNotification.android.setProgress(100, progress, false);
    }

    completeCompressNotification = () => {
        // this.localNotification.android.setProgress(100, 100, false);
        // this.localNotification.setBody("Video xử lí hoàn tất");
        // firebase.notifications().displayNotification(this.localNotification);

        // setTimeout(() => {
        //     firebase.notifications().removeDeliveredNotification('aaChannelId');
        // }, 2 * 1000);
    }

    /**
     * Display notification
     */
    displayNotification = () => {
        try {
            firebase.notifications().displayNotification(this.localNotification);

        } catch (e) {
            console.log('catch', e)
        }
    }

    /**
     * Get profile user
     */
    getProfile () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.user = user;
                this.setState({
                    avatar: !Utils.isNull(user.avatarPath) && user.avatarPath.indexOf('http') != -1
                        ? user.avatarPath
                        : this.resourceUrlPath.textValue + "/" + user.avatarPath
                });
                if (!Utils.isNull(this.resources)) {
                    this.handleResourceSelected(this.resources);
                }
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            this.saveException(error, 'getProfile')
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
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.ADD_JOB)) {
                    if (data != null) {
                        this.openModalSuccess()
                    } else {
                        this.showMessage("Opp !!! có gì đó không đúng, vui lòng thử lại sau")
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_JOB_DETAIL)) {
                    if (data != null) {
                        this.job = data
                        if (data.resources.length != 0) {
                            let jobResource = []
                            data.resources.forEach(element => {
                                jobResource.push({ path: element.pathToResource, type: resourceType.IMAGE })
                            });
                            this.jobResource = data.resources;
                            this.state.resources = jobResource
                        }
                        this.handleGetJob(data)
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.UPDATE_JOB)) {
                    if (data != null) {
                        this.showMessage("Chỉnh sửa thành công")
                        if (this.callBack) this.callBack(true)
                        this.onBack()
                    }
                }
                this.state.isLoading = false
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.setState({ visibleProgressUpload: false });
            }
        }
    }

    handleGetJob = (data) => {
        this.state.title = data.title
        this.state.description = data.description
        this.state.benefit = data.benefit
        this.state.requirement = data.requirements
        this.state.salary = data.salary
        this.state.position = data.position
        this.state.province = {
            id: data.province ? data.province.id : null,
            name: data.province ? data.province.name : null
        }
        this.state.address = data.address
        this.state.type = data.type
        this.state.validTo = data.validTo
        this.state.phoneContactPrimary = data.phoneContactPrimary
        this.state.phoneContactSecondary = data.phoneContactSecondary
        this.state.emailContact = data.emailContact
        let category = []
        data.categoryModels.forEach((item) => {
            category.push({ id: item.id, name: item.name })
        })
        this.listCategory = category
        this.validateData()
    }

    componentWillUnmount () {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
    }

    /**
     * Open camera roll
     */
    openCameraRoll = () => {
        const { resources } = this.state;
        if (resources.length < 10) {
            this.showCameraRollView({
                assetType: 'Photos',
                // assetType: this.assetType,
                callback: this.handleResourceSelected,
                maximum: 10 - resources.length,
                callbackCaptureImage: this.onCaptureImage
            });
        } else {
            this.showMessage("Số lượng hình ảnh tối đa 10 hình");
        }
    }

    /** 
    * On capture image
    */
    onCaptureImage = async (element) => {
        const { resources } = this.state;
        let maxSizeUpload = this.maxFileSizeUpload.numericValue;
        let path = element.path;
        let _1Mb = 1024 * 1024;
        element.mime = 'image/jpeg';
        let type = Utils.getTypeResource(element.mime);
        if (Platform.OS == "android") {
            path = path.replace('file://', '');
        }
        let file = await Upload.getFileInfo(path);
        let sizeRes = file.size / _1Mb;
        resources.push({
            id: null,
            path: type == resourceType.VIDEO && Platform.OS === 'ios' ? Utils.convertLocalIdentifierIOSToAssetLibrary(path, false) : element.path,
            width: element.width,
            height: element.height,
            type: type,
            mimeType: element.mime,
            size: sizeRes
        });
        this.setState({ resources });
    }

    render () {
        const { refreshing, enableRefresh, resources, titleHeader,
            title, salary, position, description, requirement, benefit,
            address, type, categoryId, province } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.handlerBackButton}
                        visibleBack={true}
                        title={titleHeader}
                        renderRightMenu={this.renderRightMenu}
                    />
                    <Content
                        ref={r => (this._container = r)}
                        enableRefresh={enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        contentContainerStyle={[styles.containerEditJob, {
                            marginBottom: this.state.keyboardHeight,
                        }]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='handled'>
                        {this.renderResource()}
                        {this.renderInputTitle()}
                        {this.renderInputSalary()}
                        {this.renderInputPosition()}
                        {this.renderInputDes()}
                        {this.renderInputRequirement()}
                        {this.renderInputBenefit()}
                        {this.renderInputAddress()}
                        {this.renderTypeJob()}
                        {this.renderInputValidTo()}
                        {this.renderPhoneContactPrimary()}
                        {this.renderPhoneContactSecondary()}
                        {this.renderEmailContact()}
                        {this.renderInputCategory()}
                        {this.renderButton()}
                    </Content>
                    <ModalImageViewer
                        ref={'modalImageViewer'}
                        parentView={this}
                    />
                    <CalendarScreen
                        minimumDate={new Date(new Date().setDate(DateUtil.now().getDate() + 1))}
                        dateCurrent={DateUtil.now()}
                        chooseDate={this.chooseDate.bind(this)}
                        ref={ref => (this.showCalendar = ref)}
                    />
                    {this.renderProgressUpload()}
                    {this.renderUploadSuccess()}
                    {this.renderUploadCancel()}
                    {this.renderModalSuccess()}
                    {this.renderModalCheckUpdate()}
                    {this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    renderResource = () => {
        let { resources } = this.state
        if (Utils.isNull(resources)) {
            return (
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={this.openCameraRoll}
                    style={{ justifyContent: 'center', alignItems: 'center', marginTop: Constants.MARGIN_X_LARGE }}>
                    <Image source={img_image} style={{ width: window.width / 3 }} resizeMode={'contain'} />
                    <Text style={[commonStyles.text, { opacity: 0.6, marginVertical: Constants.MARGIN_X_LARGE }]}>
                        Chọn ít nhất 1 ảnh
                                </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <SlideResource
                    data={resources}
                    indexRes={0}
                    urlPathResize={this.resourceUrlPathResize.textValue}
                    urlPath={this.resourceUrlPath.textValue}
                    videoRestriction={this.uploadCommonVideoRestriction.numericValue}
                    imageRestriction={this.uploadCommonImageRestriction.numericValue}
                    urlPath={this.resourceUrlPath.textValue}
                    onOpenCameraRoll={this.openCameraRoll}
                    isEdit={true}
                    onDeleteRes={this.onDeleteRes}
                    onOpenImage={this.onOpenImage}
                    onOpenVideo={this.onOpenVideo}
                    callbackGetRealVideoWidthAndHeight={this.callbackGetRealVideoWidthAndHeight}
                    onProgressVideo={(response) => {
                        this.currentTimeVideo = response.currentTime;
                    }}
                />
            )
        }
    }

    showLoadingBar (isShow) {
        return isShow ?
            <View style={{
                position: 'absolute',
                flex: 1,
                bottom: 0,
                width: Constants.MAX_WIDTH,
                height: "100%",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "transparent"
            }}>
                <View style={{
                    position: 'absolute',
                    flex: 1,
                    width: Constants.MAX_WIDTH,
                    height: "100%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.COLOR_GRAY, opacity: 0.7
                }}>

                </View>
                <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: Constants.CORNER_RADIUS / 2,
                    backgroundColor: Colors.COLOR_WHITE, height: 200, width: Constants.MAX_WIDTH - 100
                }}>
                    <Spinner style={{}} color={Colors.COLOR_PRIMARY} ></Spinner>
                    <Text style={{ fontSize: Fonts.FONT_SIZE_X_MEDIUM }}>Đang xử lý</Text>
                </View>
            </View>
            : null
    }

    /**
     * Render input des
     */
    renderInputDes = () => {
        const { description } = this.state;
        return (
            <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                {/* <Text style={[commonStyles.textBold, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_X_LARGE,
                    marginBottom: - Constants.MARGIN_LARGE
                }]}>Mô tả</Text> */}
                <TextInputCustom
                    refInput={input => {
                        this.description = input;
                    }}
                    value={description}
                    onChangeText={description => {
                        this.setState({ description })
                        this.validateData()
                    }
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    returnKeyType={"next"}
                    multiline={true}
                    isMultiLines={true}
                    placeholder={"Mô tả"}
                    keyboardType="default"
                    editable={true}
                    visibleHr={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.requirement.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.description.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputTitle = () => {
        const { title } = this.state;
        return (
            <View style={{ marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                {/* <Text style={[commonStyles.textBold, {
                    marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE,
                    marginBottom: Constants.MARGIN_X_LARGE
                }]}>Tên công việc</Text> */}
                <TextInputCustom
                    refInput={input => {
                        this.title = input;
                    }}
                    value={title}
                    onChangeText={title => {
                        this.setState({ title })
                        this.validateData()
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Tên công việc"}
                    editable={true}
                    returnKeyType={"next"}
                    multiline={true}
                    visibleHr={true}
                    autoCapitalize={'sentences'}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.salary.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.title.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputSalary = () => {
        const { salary } = this.state;
        return (
            <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Lương</Text> */}
                <TextInputCustom
                    refInput={input => {
                        this.salary = input;
                    }}
                    value={salary}
                    onChangeText={salary => {
                        this.setState({ salary })
                        this.validateData()
                    }
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Mức lương"}
                    keyboardType="default"
                    editable={true}
                    returnKeyType={"next"}
                    visibleHr={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.position.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.salary.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputPosition = () => {
        const { position } = this.state;
        return (
            <View style={{ marginVertical: Constants.MARGIN_X_LARGE }}>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Chức vụ</Text> */}
                <TextInputCustom
                    refInput={input => {
                        this.position = input;
                    }}
                    value={position}
                    onChangeText={position => {
                        this.validateData()
                        this.setState({ position })
                    }
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Vị trí"}
                    keyboardType="default"
                    editable={true}
                    returnKeyType={"next"}
                    visibleHr={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.description.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.position.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputRequirement = () => {
        const { requirement } = this.state;
        return (
            <View style={{ marginVertical: Constants.MARGIN_X_LARGE }}>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Yêu cầu </Text> */}
                <TextInputCustom
                    refInput={input => {
                        this.requirement = input;
                    }}
                    value={requirement}
                    onChangeText={requirement => {
                        this.validateData()
                        this.setState({ requirement })
                    }
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    placeholder={"Yêu cầu"}
                    keyboardType="default"
                    editable={true}
                    multiline={true}
                    visibleHr={true}
                    returnKeyType={"next"}
                    isMultiLines={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.benefit.focus()
                        })
                    }}
                    onPressPlaceHolder={() => { this.requirement.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputBenefit = () => {
        const { benefit } = this.state;
        return (
            <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Phúc lợi (bỏ trống nếu không có)</Text> */}
                <TextInputCustom
                    refInput={input => {
                        this.benefit = input;
                    }}
                    value={benefit}
                    onChangeText={benefit =>
                        this.setState({ benefit })
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    placeholder={"Phúc lợi"}
                    keyboardType="default"
                    editable={true}
                    multiline={true}
                    visibleHr={true}
                    returnKeyType={"next"}
                    isMultiLines={true}
                    onPressPlaceHolder={() => { this.benefit.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputAddress = () => {
        const { address, province, district } = this.state;
        return (
            <View style={{}}>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Chọn tỉnh thành</Text> */}
                <View style={{ marginVertical: Constants.MARGIN_X_LARGE }}>
                    <TextInputCustom
                        refInput={input => {
                            this.addressProvince = input;
                        }}
                        value={province != null ? province.name : null}
                        onPress={() => {
                            this.props.navigation.navigate("Area", { type: areaType.PROVINCE, callBack: this.handleSelectProvince })
                        }}
                        inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                        isInputAction={true}
                        placeholder={"Tỉnh thành"}
                        keyboardType="default"
                        editable={true}
                        imgRight={null}
                        multiline={true}
                        visibleHr={true}
                    />
                </View>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Chọn quận huyện</Text> */}
                <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                    <TextInputCustom
                        refInput={input => {
                            this.addressDistrict = input;
                        }}
                        value={district != null && province != null ? district.name : null}
                        onPress={() => {
                            if (this.state.province != null)
                                this.props.navigation.navigate("Area", { type: areaType.DISTRICT, callBack: this.handleSelectDistrict, parentAreaId: this.state.province.id })
                        }}
                        inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                        isInputAction={true}
                        placeholder={"Quận huyện"}
                        keyboardType="default"
                        editable={true}
                        imgRight={null}
                        multiline={true}
                        visibleHr={true}
                    />
                </View>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Địa chỉ chi tiết</Text> */}
                <View style={{ marginTop: Constants.MARGIN_X_LARGE }}>
                    <TextInputCustom
                        refInput={input => {
                            this.address = input;
                        }}
                        value={address}
                        onChangeText={address => {
                            this.validateData()
                            this.setState({ address })
                        }
                        }
                        inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                        isInputNormal={true}
                        placeholder={"Địa chỉ chi tiết"}
                        keyboardType="default"
                        editable={true}
                        multiline={true}
                        visibleHr={true}
                        textBackground={Colors.COLOR_WHITE}
                        onPressPlaceHolder={() => { this.address.focus() }}
                    />
                </View>
            </View>
        )
    }

    handleSelectProvince = (item) => {
        this.setState({
            province: item
        })
    }

    handleSelectDistrict = (item) => {
        this.setState({
            district: item
        })
    }

    /**
     * Render input title
     */
    renderInputValidTo = () => {
        const { validTo } = this.state;
        return (
            <View style={{}}>
                {/* <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: - Constants.MARGIN_LARGE }]}>Tuyển đến ngày (bỏ trống nếu không cần)</Text> */}
                <TextInputCustom
                    backgroundColor={Colors.COLOR_TRANSPARENT}
                    styleInputGroup={styles.inputGroup}
                    titleStyles={styles.titleInput}
                    refInput={input => {
                        this.validTo = input;
                    }}
                    isInputMask={true}
                    placeholder={"Ngày hết hạn"}
                    onChangeText={validTo =>
                        this.setState({
                            validTo: validTo
                        })
                    }
                    value={this.state.validTo ? DateUtil.convertFromFormatToFormat(this.state.validTo, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) : null}
                    textAlignInput='right'
                    keyboardType="phone-pad"
                    onFocus={() => this.showCalendarDate()}
                    editable={true}
                    typeFormat={'datetime'}
                    options={
                        {
                            format: 'DD/MM/YYYY'
                        }
                    }
                    // contentRight={ic_calendar_grey}
                    visibleHr={true}
                    onPressRight={() => this.showCalendarDate()}
                />
            </View>
        )
    }

    renderPhoneContactPrimary = () => {
        const { phoneContactPrimary } = this.state;
        return (
            <View style={{ marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                <TextInputCustom
                    refInput={input => {
                        this.phoneContactPrimary = input;
                    }}
                    value={phoneContactPrimary}
                    onChangeText={phoneContactPrimary => {
                        this.setState({ phoneContactPrimary })
                        this.validateData()
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Số điện thoại liên hệ"}
                    editable={true}
                    returnKeyType={"next"}
                    multiline={true}
                    visibleHr={true}
                    autoCapitalize={'sentences'}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.phoneContactSecondary.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.phoneContactPrimary.focus() }}
                />
            </View>
        )
    }

    renderPhoneContactSecondary = () => {
        const { phoneContactSecondary } = this.state;
        return (
            <View style={{ marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                <TextInputCustom
                    refInput={input => {
                        this.phoneContactSecondary = input;
                    }}
                    value={phoneContactSecondary}
                    onChangeText={phoneContactSecondary => {
                        this.setState({ phoneContactSecondary })
                        this.validateData()
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Số điện thoại liên lạc khác"}
                    editable={true}
                    returnKeyType={"next"}
                    multiline={true}
                    visibleHr={true}
                    autoCapitalize={'sentences'}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.emailContact.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.phoneContactSecondary.focus() }}
                />
            </View>
        )
    }

    renderEmailContact = () => {
        const { emailContact } = this.state;
        return (
            <View style={{ marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }}>
                <TextInputCustom
                    refInput={input => {
                        this.emailContact = input;
                    }}
                    value={emailContact}
                    onChangeText={emailContact => {
                        this.setState({ emailContact })
                        this.validateData()
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Email liên hệ"}
                    editable={true}
                    returnKeyType={"done"}
                    multiline={true}
                    visibleHr={true}
                    autoCapitalize={'sentences'}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            Keyboard.dismiss()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.emailContact.focus() }}
                />
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputCategory = () => {
        return (
            <View style={{}}>
                <Text style={[styles.titleInputAddJob]}>Chọn danh mục</Text>
                <FlatListCustom
                    style={{
                        marginTop: Constants.MARGIN_X_LARGE,
                        paddingHorizontal: Constants.PADDING_LARGE,
                        paddingVertical: Constants.PADDING_LARGE
                    }}
                    itemPerRow={3}
                    keyExtractor={(item) => item.id}
                    horizontal={false}
                    data={this.listCategory}
                    renderItem={this.renderItemCategory}
                    showsVerticalScrollIndicator={false}
                    isShowEmpty={this.listCategory.length == 0}
                    textForEmpty={"Chọn ít nhất 1 danh mục"}
                    styleEmpty={{ justifyContent: 'flex-start', marginLeft: Constants.MARGIN_X_LARGE }}
                    ListHeaderComponent={this.renderHeaderFlatList}
                />
            </View>
        )
    }

    /**
     * Render item category
     */
    renderItemCategory = (item, index, parentIndex, indexInParent) => {
        let length = this.listCategory.length
        return (
            <View style={{
                marginTop: Constants.MARGIN_X_LARGE, flexDirection: 'row',
                paddingHorizontal: Constants.PADDING_LARGE,
                paddingVertical: Constants.PADDING + 2,
                borderRadius: Constants.CORNER_RADIUS,
                backgroundColor: Colors.COLOR_PRIMARY,
                marginRight: Constants.MARGIN_LARGE
            }}>
                <Text style={[commonStyles.text, { flex: 1, color: Colors.COLOR_WHITE }]} >{item.name}</Text>
                <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={() => {
                        this.listCategory.splice(index, 1)
                        this.setState({
                            ok: true
                        }, () => {
                            this.validateData()
                        })
                    }}
                    activeOpacity={Constants.ACTIVE_OPACITY}>
                    <Image source={ic_close_blue} style={{ width: 16, height: 16, marginLeft: Constants.MARGIN }} />
                </TouchableOpacity>
            </View>
        );
    }

    renderHeaderFlatList = () => {
        return (
            <TouchableOpacity
                style={{
                    justifyContent: 'flex-start',
                    backgroundColor: Colors.COLOR_BACKGROUND,
                    flex: 1, alignItems: 'center',
                    alignSelf: 'flex-start',
                    flexDirection: 'row', padding: 6,
                    borderRadius: Constants.CORNER_RADIUS
                }}
                onPress={() => this.props.navigation.navigate("SelectCategory", {
                    callBack: this.handleSelectCategory, current: this.listCategory
                })}
                activeOpacity={Constants.ACTIVE_OPACITY}>
                <Image style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', }} source={ic_add} style={{ width: 18, height: 18 }} />
            </TouchableOpacity>
        )
    }

    handleSelectCategory = (categories) => {
        this.listCategory = categories
        this.setState({
            ok: true
        }, () => {
            this.validateData()
        })
    }

    renderButton () {
        return (
            <TouchableOpacity
                disabled={this.state.isDisableButton}
                onPress={() => {
                    this.setState({
                        isLoading: true,
                    })
                    this.onSendData()
                }}
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    backgroundColor: this.state.isDisableButton ? Colors.COLOR_BACKGROUND : Colors.COLOR_PRIMARY,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: Constants.CORNER_RADIUS * 2,
                    marginBottom: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_XX_LARGE,
                    marginHorizontal: Constants.MARGIN_XX_LARGE,
                    paddingVertical: Constants.MARGIN_LARGE
                }}
            >
                <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]}>{this.screenType == screenType.EDIT_POST_VIEW ? "Chỉnh sửa" : "Đăng việc mới"}</Text>
            </TouchableOpacity>

        )
    }

    validateData = () => {
        if (this.state.title != null && this.state.description != null
            && this.state.requirement != null && this.state.position != null && this.state.salary != null && this.listCategory.length > 0 && this.state.province != null && this.state.resources.length > 0) {
            this.setState({
                isDisableButton: false
            })
        } else {
            this.setState({
                isDisableButton: true
            })
        }
    }

    onSendData = () => {
        if (this.screenType == screenType.EDIT_POST_VIEW) {
            console.log("CHECK NEW CONTENT: ", this.isNewContent());
            if (this.isNewContent() == true) {
                this.newContent = true
                this.openModalCheckUpdate()
            } else {
                // this.uploadPost()
                this.updatePost()
            }
        } else {
            for (let i = 0; i < this.state.resources.length; i++) {
                let path = this.state.resources[i].path
                // if (path.indexOf('http') == -1) {
                this.uploadImage(path, i)
                // } else {
                // if (this.images.indexOf(path) == -1) {
                // this.images.push(path)
                // if (this.images.length == this.state.resources.length) {
                // if (this.screenType == screenType.EDIT_POST_VIEW) {
                // if (this.isNewContent() == true) {
                // this.openModalCheckUpdate()
                // } else {
                // this.uploadPost()
                // }
                // }
                // }
                // }
                // }
            }
        }
    }

    openModalSuccess = () => {
        this.refs.modalSuccess.showModal()
    }

    hideModalSuccess = () => {
        this.refs.modalSuccess.hideModal()
    }

    renderModalSuccess () {
        return (
            <ModalPopup
                ref={'modalSuccess'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Thêm công việc thành công</Text>
                    )
                }}
                onPressYes={() => {
                    if (this.callBack)
                        this.callBack()
                    this.onBack()
                }}
                isVisibleButtonNo={false}
            />
        )
    }

    /**
       * Show calendar date
       */
    showCalendarDate () {
        this.showCalendar.showDateTimePicker();
    }


    /**
       * Date press
       */
    chooseDate (day) {
        this.setState({
            validTo: DateUtil.convertFromFormatToFormat(
                day,
                DateUtil.FORMAT_DATE_TIME_ZONE_T,
                DateUtil.FORMAT_DATE_TIME_ZONE
            ),
        });
    }

    /**
     * On press video
     */
    onOpenVideo = (pathVideo) => {
        this.refs.modalVideoViewer.showModal(pathVideo, this.currentTimeVideo)
    }

    /**
     * On press image
     */
    onOpenImage = (index) => {
        let indexCount = 0;
        let indexVideo;
        let resources = this.state.resources.filter(item => {
            indexCount++;
            if (item.type === resourceType.VIDEO) {
                indexVideo = indexCount;
            }
            return item.type !== resourceType.VIDEO;
        });
        let indexTemp = index < indexVideo ? index : index - (this.state.resources.length - resources.length);
        this.refs.modalImageViewer.showModal(resources, indexTemp)
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        const { resources, uploading, description } = this.state;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                // onPress={this.onPost}
                // disabled={!Utils.isNull(description) && !uploading && !this.props.isLoading ? false : true}
                style={{}}>

            </TouchableOpacity>
        )
    }

    /**
     * On delete resource
     */
    onDeleteRes = (item, index) => {
        let state = this.state;
        state.resources.splice(index, 1);
        if (!Utils.isNull(item.id)) {
            state.idResourceDeletes.push(item.id);
        }
        this.setState(state, () => {
            this.validateData()
        });
        if (this.screenType == screenType.EDIT_POST_VIEW) {
            if (this.jobResource[index] != null)
                this.jobResource[index].status = -1
        }
    }

    /**
     * Render progress upload
     */
    renderProgressUpload = () => {
        const { visibleProgressUpload } = this.state;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visibleProgressUpload}
                onRequestClose={() => {
                }}>
                <View style={[commonStyles.viewCenter, {
                    flex: 1
                }]}>
                    <View style={[commonStyles.viewCenter, {
                        width: window.width * 0.7,
                        backgroundColor: Colors.COLOR_BACKGROUND,
                        borderRadius: Constants.CORNER_RADIUS
                    }]}>
                        <Text style={[commonStyles.textSmall, { marginTop: Constants.MARGIN_LARGE }]}>
                            {this.state.isCompressingVideo ?
                                "Đang xử lí video..." :
                                localizes('postNewView.uploadingPicture')}
                        </Text>
                        <Progress.Bar
                            style={{}}
                            borderColor={Colors.COLOR_PRIMARY}
                            borderWidth={Constants.BORDER_WIDTH}
                            color={Colors.COLOR_PRIMARY}
                            progress={this.state.progress} />
                        <TouchableOpacity
                            style={{
                                marginVertical: Constants.MARGIN_LARGE,
                                paddingHorizontal: Constants.PADDING_X_LARGE,
                                backgroundColor: Colors.COLOR_PRIMARY,
                                borderRadius: Constants.CORNER_RADIUS
                            }}
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => { this.setState({ visibleProgressUpload: false, hideProgressUpload: true }) }}>
                            <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]}>Ẩn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    /**
     * Render check post
     */
    renderTypeJob = () => {
        return (
            <FlatListCustom
                style={{
                    paddingHorizontal: Constants.PADDING_LARGE,
                    paddingVertical: Constants.PADDING_LARGE, marginVertical: Constants.MARGIN_LARGE
                }}
                keyExtractor={(item) => item.id}
                horizontal={false}
                data={this.postMethods}
                renderItem={this.renderItem.bind(this)}
                showsVerticalScrollIndicator={false}
            />
        )
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
            <TouchableOpacity
                style={{
                    paddingVertical: Constants.PADDING_LARGE
                }}
                onPress={() => {
                    this.setState({ type: item.id })
                    Keyboard.dismiss()
                }}>
                <View style={styles.boxTitle}>
                    <View style={styles.checkBox}>
                        {this.state.type == item.id
                            && <View style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: Colors.COLOR_PRIMARY
                            }} />
                        }
                    </View>
                    <Text style={[this.state.type == item.id ? commonStyles.textBold : commonStyles.text400, { marginVertical: 0, }]}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }


    /**
    * Handle resource selected
    */
    handleResourceSelected = (res) => {
        const { resources } = this.state;
        let maxSizeUpload = 25;
        res.forEach(async (element, index) => {
            let path = element.path;
            let _1Mb = 1024 * 1024;
            let type = Utils.getTypeResource(element.mime);
            if (Platform.OS == "android") {
                path = path.replace('file://', '');
            }
            let file = await Upload.getFileInfo(path);
            console.log('file size: ' + file.size);
            let sizeRes = file.size / _1Mb;
            resources.push({
                id: null,
                path: type == resourceType.VIDEO && Platform.OS === 'ios' ? Utils.convertLocalIdentifierIOSToAssetLibrary(path, false) : element.path,
                width: element.width,
                height: element.height,
                type: type,
                mimeType: element.mime,
                size: sizeRes
            });
            if (index == res.length - 1) {
                let temp = resources
                this.setState({ resources: temp }, () => {
                    this.validateData()
                });

            }
        });
    }

    /**
     * Upload image
     */
    uploadImage = (uri, index) => {
        let uriArray = uri.split("/");
        let url = uriArray[uriArray.length - 1];
        let folder = this.state.title.replace(/ /g, "_");
        let fr = storage().ref(`job/${folder}/job${url}`);
        fr.putFile(uri, { contentType: 'image/jpeg' }).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                console.log("snapshot uploaded image to firebase", snapshot);
                if (snapshot.state == "success") {
                    fr.getDownloadURL().then((urls) => {
                        if (this.images.indexOf(urls) == -1) {
                            this.images.push(urls)
                            if (this.images.length == this.state.resources.length) {
                                if (this.screenType == screenType.EDIT_POST_VIEW) {
                                    // this.openModalCheckUpdate()
                                    this.updatePost()
                                } else {
                                    this.uploadPost()
                                }
                            }
                        }
                    })
                }
            }
            ,
            error => {
                setError(error);
            }
        );
    }

    openModalCheckUpdate = () => {
        this.refs.modalCheckUpdate.showModal()
    }

    hideModalCheckUpdate = () => {
        this.refs.modalCheckUpdate.hideModal()
    }

    renderModalCheckUpdate () {
        return (
            <ModalPopup
                ref={'modalCheckUpdate'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Tin đăng của bạn sẽ được xét duyệt lại, bạn có muốn tiếp tục ?</Text>
                    )
                }}
                onPressYes={() => {
                    // this.updatePost()
                    this.setState({
                        isLoading: true
                    })
                    this.uploadImageEditPost()
                }}
            // onPressNo
            />
        )
    }

    uploadImageEditPost = () => {
        for (let i = 0; i < this.state.resources.length; i++) {
            let path = this.state.resources[i].path
            if (path.indexOf('http') == -1) {
                this.uploadImage(path, i)
            } else {
                if (this.images.indexOf(path) == -1) {
                    this.images.push(path)
                    if (this.images.length == this.state.resources.length) {
                        if (this.screenType == screenType.EDIT_POST_VIEW) {
                            this.updatePost()
                        }
                    }
                }
            }
        }
    }

    /**
     * Check path image exist in job resource
     */
    existInArray = (path, array = []) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].pathToResource == path) {
                return true;
            }
        }
        return false
    }

    updatePost = () => {
        let categories = []
        this.listCategory.forEach((item) => {
            categories.push(item.id);
        })
        let resourceAfterUpdate = []
        this.images.forEach((item, index) => {
            resourceAfterUpdate.push({ path: item })
            if (this.existInArray(item, this.jobResource) == false) {
                this.jobResource.push({ id: null, pathToResource: item, resourceType: null, pathToThumbnail: null, width: null, height: null, status: null });
            }
        })
        this.setState({
            resources: resourceAfterUpdate
        })
        let filter = {
            id: this.job.id,
            type: this.state.type,
            title: this.state.title,
            position: this.state.position,
            description: this.state.description,
            requirements: this.state.requirement,
            benefit: this.state.benefit != null ? this.state.benefit : null,
            salary: this.state.salary,
            address: this.state.address,
            categories: categories,
            validTo: this.state.validTo,
            // images: this.images,
            resourceModel: this.jobResource,
            provinceId: this.state.province.id,
            districtId: this.state.district.id,
            status: this.newContent == true ? statusType.DRAFT : statusType.ACTIVE,
            phoneContactPrimary: this.state.phonePrimary,
            phoneContactSecondary: this.state.phoneSecondary,
            emailContact: this.state.emailContact
        }
        this.props.updateJob(filter);
    }

    uploadPost = () => {
        let categories = []
        this.listCategory.forEach((item) => {
            categories.push(item.id);
        })
        this.setState({
            isLoading: false
        })
        let filter = {
            type: this.state.type,
            title: this.state.title,
            position: this.state.position,
            description: this.state.description,
            requirements: this.state.requirement,
            benefit: this.state.benefit != null ? this.state.benefit : null,
            salary: this.state.salary,
            address: this.state.address,
            categories: categories,
            validTo: this.state.validTo,
            images: this.images,
            provinceId: this.state.province.id,
            districtId: this.state.district.id,
            phoneContactPrimary: this.state.phoneContactPrimary,
            phoneContactSecondary: this.state.phoneContactSecondary,
            emailContact: this.state.emailContact
        }
        this.props.addJob(filter);
    }

    /**
     * Check new content
     */
    isNewContent = () => {
        if (this.state.title.trim() != this.job.title.trim()
            || this.state.position.trim() != this.job.position.trim()
            || this.state.description.trim() != this.job.description.trim()
            || this.state.requirement.trim() != this.job.requirements.trim()
            || this.state.position.trim() != this.job.position.trim()
            || this.state.salary.trim() != this.job.salary.trim()
            || this.state.benefit && this.state.benefit.trim() != this.job.benefit.trim()
        ) {
            return true;
        }

        for (let a = 0; a < this.state.resources.length; a++) {
            if (this.state.resources[a].path.indexOf('http') == -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Upload resource
     */
    uploadResources = async (postId) => {
        const { resources, uploading, hideProgressUpload } = this.state;
        let resUploads = resources.filter(item => {
            return Utils.isNull(item.id)
        });
        if (resUploads.length === 0) {
            this.setState({
                visibleProgressUpload: false,
            });
            if (!Utils.isNull(this.postId)) {
                this.showMessage("Chỉnh sửa thành công.");
            } else {
                this.props.pushNotificationForNewPost(postId);
                this.showMessage("Đăng bài thành công.");
            }
            this.screenFocused && this.onBack();
            this.callback(this.postTemp);
        } else {
            !hideProgressUpload && this.setState({
                visibleProgressUpload: true
            });
            let itemPost = resUploads[this.indexUpload];
            let path = itemPost.path;
            if (Platform.OS == "android") {
                path = itemPost.path.replace('file://', '');
            } else {
                if (itemPost.type != resourceType.VIDEO) {
                    path = Utils.convertLocalIdentifierIOSToAssetLibrary(itemPost.path, true);
                }
            }
            let options = {
                url: ServerPath.API_URL + `post/resource/upload`,
                path: path,
                method: 'POST',
                field: 'file',
                type: 'multipart',
                headers: {
                    'Content-Type': itemPost.mimeType, // Customize content-type
                    'X-APITOKEN': global.token
                },
                parameters: {
                    postId: postId + "",
                    width: itemPost.width + "",
                    height: itemPost.height + "",
                    type: itemPost.type + "",
                },
                notification: {
                    enabled: true,
                    onProgressTitle: "Đang tải lên...",
                    autoClear: true
                }
            }
            this.processUploadResource(options, resUploads, postId)
        }
    }

    showProgressCompressVideo = (progress) => {
        console.warn("progress processing video: ", progress);
        if (progress < 80) {
            let i = progress;
            this.interval = setInterval(() => {
                i += 0.1;
                this.updateProgressNotification(i);
                this.displayNotification();
                this.setState({ progress: i / 100 });
                if (i == 80) {
                    clearInterval(this.interval);
                }
            }, 100)
        } else {
            let i = progress; // 80
            if (this.interval != null) {
                clearInterval(this.interval);
            }
            if (progress == 80 && i == 80) {
                i++;
                this.setState({
                    isCompressingVideo: false,
                    progress: 0
                })
                this.completeCompressNotification();
            }
        }
    }

    /**
     * get thumbnail image from video
     * @param {*} source  // video
     * @param {*} second 
     * @param {*} onSuccess 
     * @param {*} onFailure
     */
    getThumbnailFromVideo (source, second, onSuccess, onFailure) {
        // let validSource = source == 'http://mxhcacanhst.boot.vn/' ? false : true
        let validSource = source.includes('mp4') || source.includes('MOV');
        console.log("SOURCE getThumbnailFromVideo: ", source)
        if (validSource) {
            const maximumSize = { width: 640, height: 1024 }; // default is { width: 1080, height: 1080 } iOS only
            try {

            } catch (err) {
                onFailure(err);
            }
        }
    }

    /** 
     * process compress video 
     * @param path // video uri 
     * @param onSuccess // handle success
     * @param onFailure // handle failure 
     */
    processCompressVideo = (path, onSuccess, onFailure) => {
        let newPath = path;
        if (!path.includes('file://'))
            newPath = `file://${path}`;
        this.setState({
            isCompressingVideo: true,
            visibleProgressUpload: true
        })
        // RNVideoHelper.compress('file:///storage/emulated/0/DCIM/Camera/20200305_154037.mp4', {
        RNVideoHelper.compress(path, {
            quality: 'high', // default low, can be medium or high
            defaultOrientation: 0 // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
        }).progress(value => {
            this.setState({ progress: value })
            console.warn('progress', value); // Int with progress value from 0 to 1
        }).then(compressedUri => {
            onSuccess(compressedUri);
            this.setState({
                isCompressingVideo: false,
                progress: 0
            })
            console.warn('compressedUri', compressedUri); // String with path to temporary compressed video
        }).catch(error => {
            this.setState({
                isCompressingVideo: false,
                visibleProgressUpload: true,
                progress: 0
            })
            onFailure(error)
        });
    }

    /**
     * Process upload resource
     * @param {*} options 
     */
    processUploadResource (options, resUploads, postId) {
        const { progress } = this.state;
        Upload.startUpload(options).then((uploadId) => {
            console.log('Upload started', uploadId)
            Upload.addListener('progress', uploadId, (data) => {
                console.log(`Progress: ${data.progress}%`)
                this.setState({
                    progress: progress + (data.progress / 100) / resUploads.length
                })
            })
            Upload.addListener('error', uploadId, (data) => {
                console.log("Error", data.error);
                this.setState({ visibleProgressUpload: false });
                this.uploadId = null;
                this.showMessage(localizes('uploadImageError'));
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                this.setState({ visibleProgressUpload: false });
                this.uploadId = null;
                console.log(`Cancelled!`);
            })
            Upload.addListener('completed', uploadId, (data) => {
                let response = JSON.parse(data.responseBody);
                let postResourceId = response.data.id;
                if (options.path.includes('mp4') || options.path.includes('MOV')) {
                    // get thumbnail 
                    this.getThumbnailFromVideo(`${this.compressVideo}`, 1,
                        (base64Image) => {
                            var Base64Code = base64Image.split("data:image/png;base64,"); //base64Image is my image base64 string
                            // === get WIDTH + HEIGHT image 
                            // Image.getSize(base64Image, (width, height) => {
                            //     console.log(`WIDTH : ${width} - HEIGHT : ${height}`);
                            const dirs = RNFetchBlob.fs.dirs;
                            // var path2 = dirs.DCIMDir + "/image.png";
                            // path2 = 'file://' + path2;
                            path2 = RNFS.DocumentDirectoryPath + "/image.png";
                            // RNFetchBlob.fs.writeFile(path2, Base64Code[1], 'base64')
                            RNFS.writeFile(path2, Base64Code[1], 'base64')
                                .then((res) => {
                                    console.log("File : ", res)
                                    console.log("File Path : ", path2);
                                    this.optionsForVideoThumbnail = {
                                        url: ServerPath.API_URL + `post/resource/videoThumbnail/upload`,
                                        path: path2,
                                        method: 'POST',
                                        field: 'file',
                                        type: 'multipart',
                                        headers: {
                                            'Content-Type': 'image/png', // Customize content-type
                                            'X-APITOKEN': global.token
                                        },
                                        parameters: {
                                            postResourceId: postResourceId + "",
                                            // width: width + "",
                                            // height: height + "",
                                            width: this.videoWidth + "",
                                            height: this.videoHeight + "",
                                            type: resourceType.IMAGE + "",
                                        },
                                        notification: {
                                            enabled: true,
                                            onProgressTitle: "Đang tải lên...",
                                            autoClear: false
                                        }
                                    }

                                    Upload.startUpload(this.optionsForVideoThumbnail).then((uploadId2) => {
                                        console.log('Upload started');
                                        Upload.addListener('error', uploadId2, (data2) => {
                                            console.log(`Error: ${data2.error}%`)
                                            this.optionsForVideoThumbnail = null;
                                        });
                                        Upload.addListener('cancelled', uploadId2, (data2) => {
                                            console.log(`Cancelled!`)
                                            this.optionsForVideoThumbnail = null;
                                        });
                                        Upload.addListener('completed', uploadId2, (data2) => {
                                            console.log('Completed add video thumbnail!');
                                            this.optionsForVideoThumbnail = null;

                                            this.setState({
                                                visibleProgressUpload: false,
                                                // isAlertSuccess: true
                                            });
                                            if (!Utils.isNull(this.postId)) {
                                                this.showMessage("Chỉnh sửa thành công.");
                                                this.uploadHasVideo = false;
                                            } else {
                                                this.props.pushNotificationForNewPost(this.postTemp.id);
                                                this.showMessage("Đăng bài thành công.");
                                                this.uploadHasVideo = false;
                                            }
                                            let postTemp = this.postTemp;
                                            // postTemp.resources.map(it => {
                                            //     if (it.path.includes('.mp4')) {
                                            //         it.pathToThumbnailResource = JSON.parse(data2.responseBody).data.pathToThumbnailResource;
                                            //     }
                                            // })
                                            this.screenFocused && this.onBack();
                                            this.callback(postTemp);
                                            console.log('Completed upload images!')
                                        });
                                    })
                                        .catch((err2) => {
                                            console.log('Upload error!', err2);
                                            this.optionsForVideoThumbnail = null;
                                        })
                                })
                                .catch(err => {
                                    console.log(`Write base64 Error `, err);

                                });
                            console.log(`== upload video thumbnail ==`);
                            // })

                        },
                        (err) => {
                            console.log(`GET THUMBNAIL VIDEO FAILURE `);
                            console.log(err);
                        });
                }
                if (!Utils.isNull(response) && !Utils.isNull(response.data)) {
                    if (Utils.isNull(this.postTemp.resources)) this.postTemp.resources = [];
                    if (Utils.isNull(this.postTemp.oriented)) {
                        if (response.data.width - response.data.height == 0) {
                            this.postTemp.oriented = resourceOrientationType.SQUARE_ORIENTED;
                        } else if (response.data.width - response.data.height < 0) {
                            this.postTemp.oriented = resourceOrientationType.PORTRAIT_ORIENTED;
                        } else if (response.data.width - response.data.height > 0) {
                            this.postTemp.oriented = resourceOrientationType.LANDSCAPE_ORIENTED;
                        }
                    }
                    this.postTemp.resources.push(response.data);
                }
                this.uploadId = null;
                if (this.indexUpload < resUploads.length - 1) {
                    this.indexUpload++
                    const timeOut = setTimeout(() => {
                        this.uploadResources(postId);
                    }, 200);
                } else {
                    if (!this.uploadHasVideo) {
                        this.setState({
                            visibleProgressUpload: false,
                            // isAlertSuccess: true
                        });
                        if (!Utils.isNull(this.postId)) {
                            this.showMessage("Chỉnh sửa thành công.");
                            this.uploadHasVideo = false;
                        } else {
                            this.props.pushNotificationForNewPost(this.postTemp.id);
                            this.showMessage("Đăng bài thành công.");
                            this.uploadHasVideo = false;
                        }
                        this.screenFocused && this.onBack();
                        this.callback(this.postTemp);
                        console.log('Completed upload images!')
                    }
                }
            })
        }).catch((err) => {
            this.saveException(err, 'processUploadResource');
        })
    }

    /**
     * Layout upload file images success
     */
    renderUploadSuccess = () => {
        return (
            <DialogCustom
                visible={this.state.isAlertSuccess}
                isVisibleOneButton={true}
                isVisibleTitle={true}
                isVisibleContentText={true}
                contentTitle={localizes('notification')}
                textBtn={localizes('yes')}
                contentText={!Utils.isNull(this.postId) ? "Chỉnh sửa thành công" : "Đăng bài thành công"}
                onPressBtn={() => {
                    this.setState({
                        isAlertSuccess: false
                    });
                    this.callback(this.postTemp);
                    this.onBack();
                }}
            />
        )
    }

    /**
     * Layout cancel upload
     */
    renderUploadCancel = () => {
        return (
            <DialogCustom
                visible={this.state.isAlertCancel}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={localizes("notification")}
                textBtnOne={localizes('no')}
                textBtnTwo={localizes('yes')}
                contentText={!Utils.isNull(this.postId) ? "Bạn có muốn hủy chỉnh sửa?" : "Bạn có muốn hủy đăng bài?"}
                onTouchOutside={() => {
                    this.setState({ isAlertCancel: false });
                }}
                onPressX={() => {
                    this.setState({ isAlertCancel: false });
                }}
                onPressBtnPositive={() => {
                    this.setState({ isAlertCancel: false });
                    this.onBack();
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    data: state.job.data,
    isLoading: state.job.isLoading,
    error: state.job.error,
    errorCode: state.job.errorCode,
    action: state.job.action
});

const mapDispatchToProps = {
    ...commonActions,
    ...jobActions
};

export default connect(mapStateToProps, mapDispatchToProps)(EditJobView);