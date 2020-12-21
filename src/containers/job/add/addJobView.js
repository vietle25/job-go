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
import firebase from 'react-native-firebase';
import { TextInputMask } from "react-native-masked-text";
import { CheckBox } from "react-native-elements";
import { CalendarScreen } from 'components/calendarScreen';
import moment, { locales } from 'moment';
import ic_close_blue from 'images/ic_close.png';
import ic_add from 'images/ic_add.png';
import ModalPopup from 'components/modalPopup';
import areaType from 'enum/areaType';
import { Fonts } from "values/fonts";
import statusType from 'enum/statusType';
import ic_back_blue from 'images/ic_back_blue.png'
import ic_phone from 'images/ic_phone.png';
import ic_email from 'images/ic_email.png';
import ic_social from 'images/ic_social.png';

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

class AddJobView extends BaseView {

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
            next: false,
            error: '',
            indexButton: 0,
            validate: false,
            errorSalary: '',
            errorPosition: '',
            phonePrimary: null,
            phoneSecondary: null,
            emailContact: null,
            errorRequirement: ''
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
    keyboardWillShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }

    /**
     * Handle hide keyboard
     * @param {*} e 
     */
    keyboardWillHide(e) {
        this.setState({ keyboardHeight: 0 });
    }

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        const { resources, description, nameProduct, priceProduct, quantityProduct, uploading } = this.state;
        if (this.props.navigation) {
            // this.onBack();
            this.openModalExit()
        } else {
            return false
        }
        return true
    }

    getJobDetail = () => {
        this.props.getJobDetail(this.id);
    }

    componentDidMount() {
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
        this.localNotification.android.setProgress(100, 100, false);
        this.localNotification.setBody("Video xử lí hoàn tất");
        firebase.notifications().displayNotification(this.localNotification);

        setTimeout(() => {
            firebase.notifications().removeDeliveredNotification('aaChannelId');
        }, 2 * 1000);
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
    getProfile() {
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

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
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
                        if (data.status == statusType.ACTIVE) {
                            this.showMessage("Phê duyệt thành công")
                            if (this.callBack) this.callBack()
                        } else if (data.status == statusType.DELETE) {
                            this.showMessage("Xóa thành công")
                            if (this.callBack) this.callBack()
                        } else if (data.status == statusType.DRAFT) {
                            this.showMessage("Chỉnh sửa thành công")
                            if (this.callBack) this.callBack(true)
                            this.onBack()
                        }
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
        this.state.jobType = data.type
        this.state.validTo = data.validTo
        let category = []
        data.categoryModels.forEach((item) => {
            category.push({ id: item.id, name: item.name })
        })
        this.listCategory = category
    }

    componentWillUnmount() {
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

    /**
     * Using validate some string is empty, contain special character or over limit
     */
    validateString = (string, limit, errorTitle, validSpecial, requirement = false) => {
        if (Utils.isNull(string.trim())) {
            if (requirement) {
                this.setState({
                    errorRequirement: errorTitle + " là bắt buộc"
                })
            } else {
                this.setState({
                    error: errorTitle + " là bắt buộc"
                })
            }
        } else if (validSpecial && StringUtil.validSpecialCharacterForTitle(string)) {
            if (requirement) {
                this.setState({
                    errorRequirement: errorTitle + " không được chứa kí tự đặc biệt"
                })
            } else {
                this.setState({
                    error: errorTitle + " không được chứa kí tự đặc biệt"
                })
            }
        } else if (validSpecial && StringUtil.validEmojiIcon(string)) {
            if (requirement) {
                this.setState({
                    errorRequirement: errorTitle + " không được chứa kí tự đặc biệt"
                })
            } else {
                this.setState({
                    error: errorTitle + " không được chứa kí tự đặc biệt"
                })
            }
        } else if (limit != null && string.length > limit) {
            if (requirement) {
                this.setState({
                    errorRequirement: errorTitle + " không được dài quá " + limit + " kí tự"
                })
            } else {
                this.setState({
                    error: errorTitle + " không được dài quá " + limit + " kí tự"
                })
            }
        } else {
            // this.se
        }
    }


    render() {
        const { refreshing, enableRefresh, resources, titleHeader,
            title, salary, position, description, requirement, benefit,
            address, type, categoryId, province, indexButton } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <Content
                        ref={r => (this._container = r)}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: Constants.PADDING_X_LARGE,
                            paddingHorizontal: Constants.PADDING_LARGE,
                            backgroundColor: Colors.COLOR_BACKGROUND
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='handled'>
                        <View style={commonStyles.circleBg} />
                        <TouchableOpacity
                            onPress={() => { this.handlerBackButton() }}
                            style={{ paddingVertical: Constants.PADDING_X_LARGE, paddingHorizontal: Constants.PADDING_LARGE }}>
                            <Image source={ic_back_blue} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Đăng việc mới</Text>
                        <View style={{ paddingHorizontal: Constants.PADDING_LARGE }}>
                            {indexButton == 0 && this.renderInputTitle()}
                            {indexButton == 1 && this.renderResource()}
                            {indexButton == 2 && this.renderInputSalary()}
                            {indexButton == 2 && this.renderInputPosition()}
                            {indexButton == 2 && this.renderTypeJob()}
                            {indexButton == 3 && this.renderInputDes()}
                            {indexButton == 3 && this.renderInputRequirement()}
                            {indexButton == 3 && this.renderInputBenefit()}
                            {indexButton == 4 && this.renderInputAddress()}
                            {indexButton == 5 && this.renderContactMethod()}
                            {indexButton == 6 && this.renderInputValidTo()}
                            {indexButton == 6 && this.renderInputCategory()}
                        </View>
                        {this.renderButton()}
                    </Content>
                    <ModalImageViewer
                        ref={'modalImageViewer'}
                        parenView={this}
                    />
                    <CalendarScreen
                        minimumDate={new Date(new Date().setDate(DateUtil.now().getDate() + 1))}
                        dateCurrent={DateUtil.now()}
                        chooseDate={this.chooseDate.bind(this)}
                        ref={ref => (this.showCalendar = ref)}
                    />
                    {/* {this.renderProgressUpload()} */}
                    {/* {this.renderUploadSuccess()} */}
                    {/* {this.renderUploadCancel()} */}
                    {this.renderModalSuccess()}
                    {this.renderModalExit()}
                    {this.renderModalCheckUpdate()}
                    {this.showLoadingBar(this.state.isLoading)}
                </Root>
            </Container>
        );
    }

    renderButton = () => {
        let { indexButton, error, errorPosition, errorSalary, resources, errorRequirement } = this.state;
        if (this.state.indexButton == 3) {
            console.log("errorRequirement: ", errorRequirement)
            console.log("error: ", error)
        }
        let opacity = this.state.indexButton == 1 ?
            resources.length > 0 ? 1 : 0.5 :
            this.state.indexButton == 2 ?
                errorPosition == null && errorSalary == null ?
                    1 : 0.5 : this.state.indexButton == 3 ?
                    (errorRequirement == null && error == null) ?
                        1 : 0.5 : this.state.indexButton == 6 || this.state.indexButton == 5 ?
                        1 : error == null ? 1 : 0.5;
        console.log("opacity : ", opacity)
        return (
            <View style={styles.buttonContainer}>
                {this.state.indexButton != 0 && <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => {
                        this.setState({
                            indexButton: this.state.indexButton - 1,
                            error: null,
                        })
                    }}
                    style={styles.buttonPrev}>
                    <Text style={{ color: Colors.COLOR_WHITE }} >Trước đó</Text>
                </TouchableOpacity>}
                {this.state.indexButton == 6 ?
                    <TouchableOpacity
                        disabled={this.listCategory.length == 0}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => {
                            this.setState({
                                isLoading: true,
                            }, () => {
                                this.onSendData()
                            })
                        }}
                        style={[styles.buttonNext, { opacity: this.listCategory.length == 0 ? 0.5 : 1, backgroundColor: Colors.COLOR_TEXT_PRIMARY }]}>
                        <Text style={{ color: Colors.COLOR_WHITE }} >Hoàn tất & đăng bài</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        disabled={opacity == 0.5}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => {
                            this.setState({
                                indexButton: this.state.indexButton + 1,
                                error: ''
                            })
                        }}
                        style={[styles.buttonNext, { opacity: opacity }]}>
                        <Text style={{ color: Colors.COLOR_WHITE }} >Tiếp theo</Text>
                    </TouchableOpacity>}
            </View>
        )
    }

    renderResource = () => {
        let { resources, error } = this.state
        if (Utils.isNull(resources)) {
            return (
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={this.openCameraRoll}
                    style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                    <Image source={img_image} style={{ width: window.width / 3 }} resizeMode={'contain'} />
                    <Text style={[commonStyles.text, { opacity: 0.6, marginVertical: Constants.MARGIN_X_LARGE, textAlign: 'center' }]}>
                        Chọn ít nhất 1 ảnh về công việc hoặc công ty của bạn
                                </Text>

                    <Text style={[commonStyles.text700, {
                        marginLeft: Constants.MARGIN_LARGE,
                        marginTop: Constants.MARGIN_X_LARGE,
                        fontSize: Fonts.FONT_SIZE_MEDIUM,
                        color: Colors.COLOR_ERA
                    }]}>{error ? error : null}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View style={{ marginTop: 50, marginLeft: -16 }}>
                    <SlideResource
                        data={resources}
                        indexRes={0}
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
                </View>
            )
        }
    }

    showLoadingBar(isShow) {
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
     * Render input title
     */
    renderInputTitle = () => {
        const { title, error } = this.state;
        return (
            <View style={{ marginTop: Constants.MAX_WIDTH * 0.3 }}>
                <Text style={styles.titleInput}>Tên công việc *</Text>
                <TextInputCustom
                    refInput={input => {
                        this.title = input;
                    }}
                    value={title}
                    onChangeText={title => {
                        this.setState({ title, error: null })
                        this.validateString(title, 60, "Tên công việc", true)
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Nhập tên công việc"}
                    editable={true}
                    returnKeyType={"next"}
                    multiline={true}
                    visibleHr={true}
                    autoCapitalize={'sentences'}
                    onSubmitEditing={() => {
                        this.setState({
                            indexButton: this.state.indexButton + 1
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.title.focus() }}
                />
                <Text style={[commonStyles.text700, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_X_LARGE,
                    fontSize: Fonts.FONT_SIZE_MEDIUM,
                    color: Colors.COLOR_ERA
                }]}>{error ? error : null}</Text>
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputSalary = () => {
        const { salary, errorSalary } = this.state;
        return (
            <View style={{ marginTop: 50 }}>
                <Text style={styles.titleInput}>Lương</Text>
                <TextInputCustom
                    refInput={input => {
                        this.salary = input;
                    }}
                    value={salary}
                    onChangeText={salary => {
                        if (salary != null && salary.length > 32) {

                        } else if (salary.length < 32) {
                            this.setState({ salary })
                            if (salary == null || salary == '') {
                                this.setState({
                                    errorSalary: "Lương là bắt buộc nhập"
                                })
                            } else {
                                this.setState({
                                    errorSalary: null
                                })
                            }
                        }
                    }}
                    editable={true}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Mức lương"}
                    keyboardType="default"
                    returnKeyType={"next"}
                    visibleHr={true}
                    textBackground={Colors.COLOR_WHITE}
                    onSubmitEditing={() => {
                        if (salary == null || salary.trim() == '') {
                            setTimeout(() => {
                                this.salary.focus()
                            })
                            this.setState({
                                errorSalary: "Lương là bắt buộc nhập"
                            })
                        } else
                            setTimeout(() => {
                                this.position.focus()
                            })
                    }}
                    onPressPlaceHolder={() => { this.salary.focus() }}
                />
                <Text style={[commonStyles.text700, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_LARGE,
                    fontSize: Fonts.FONT_SIZE_MEDIUM,
                    color: Colors.COLOR_ERA
                }]}>{errorSalary ? errorSalary : null}</Text>
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputPosition = () => {
        const { position, errorPosition } = this.state;
        return (
            <View style={{}}>
                <Text style={styles.titleInput}>Chức vụ</Text>
                <TextInputCustom
                    refInput={input => {
                        this.position = input;
                    }}
                    value={position}
                    onChangeText={position => {
                        if (position != null && position.length > 60) {

                        } else if (position.length < 60) {
                            this.setState({ position })
                            if (position == null || position == '') {
                                this.setState({
                                    errorPosition: "Chức vụ là bắt buộc nhập"
                                })
                            } else {
                                this.setState({
                                    errorPosition: null
                                })
                            }
                        }
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    isInputNormal={true}
                    placeholder={"Vị trí tuyển"}
                    keyboardType="default"
                    editable={true}
                    returnKeyType={"next"}
                    visibleHr={true}
                    textBackground={Colors.COLOR_WHITE}
                    onSubmitEditing={() => {
                        if (position == null || position.trim() == '') {
                            setTimeout(() => {
                                this.position.focus()
                            })
                            this.setState({
                                errorPosition: "Chức vụ là bắt buộc nhập"
                            })
                        } else
                            setTimeout(() => {
                                this.description.focus()
                            })
                    }}
                    onPressPlaceHolder={() => { this.position.focus() }}
                />
                <Text style={[commonStyles.text700, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_LARGE,
                    fontSize: Fonts.FONT_SIZE_MEDIUM,
                    color: Colors.COLOR_ERA
                }]}>{errorPosition ? errorPosition : null}</Text>
            </View>
        )
    }

    /**
     * Render check post
     */
    renderTypeJob = () => {
        return (
            <View style={{}}>
                <Text style={styles.titleInput}>Loại hình công việc</Text>
                <FlatListCustom
                    style={{
                        paddingHorizontal: Constants.PADDING_LARGE,
                        paddingVertical: Constants.PADDING_LARGE
                    }}
                    keyExtractor={(item) => item.id}
                    horizontal={false}
                    data={this.postMethods}
                    renderItem={this.renderItem.bind(this)}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItem(item, index, parentIndex, indexInParent) {
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
     * Render input des
     */
    renderInputDes = () => {
        const { description, error } = this.state;
        return (
            <View style={{ marginTop: 100 }}>
                <Text style={styles.titleInput}>Mô tả</Text>
                <TextInputCustom
                    refInput={input => {
                        this.description = input;
                    }}
                    value={description}
                    onChangeText={description => {
                        this.setState({ description, error: null })
                        this.validateString(description, null, "Mô tả công việc", false)
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    returnKeyType={"next"}
                    multiline={true}
                    isMultiLines={true}
                    placeholder={"Mô tả công việc"}
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
                <Text style={[commonStyles.text700, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_X_LARGE,
                    fontSize: Fonts.FONT_SIZE_MEDIUM,
                    color: Colors.COLOR_ERA
                }]}>{error ? error : null}</Text>
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputRequirement = () => {
        const { requirement, errorRequirement } = this.state;
        return (
            <View style={{}}>
                <Text style={styles.titleInput}>Yêu cầu công việc</Text>
                <TextInputCustom
                    refInput={input => {
                        this.requirement = input;
                    }}
                    value={requirement}
                    onChangeText={requirement => {
                        this.setState({ requirement, errorRequirement: null })
                        this.validateString(requirement, null, "Yêu cầu công việc", false, true)
                    }
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    placeholder={"Các yêu cầu và kĩ năng"}
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
                <Text style={[commonStyles.text700, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_LARGE,
                    fontSize: Fonts.FONT_SIZE_MEDIUM,
                    color: Colors.COLOR_ERA
                }]}>{errorRequirement ? errorRequirement : null}</Text>
            </View>
        )
    }

    /**
     * Render input title
     */
    renderInputBenefit = () => {
        const { benefit } = this.state;
        return (
            <View style={{}}>
                <Text style={styles.titleInput}>Phúc lợi</Text>
                <TextInputCustom
                    refInput={input => {
                        this.benefit = input;
                    }}
                    value={benefit}
                    onChangeText={benefit =>
                        this.setState({ benefit })
                    }
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    placeholder={"Quyền lợi, phúc lợi nhân viên"}
                    keyboardType="default"
                    editable={true}
                    multiline={true}
                    visibleHr={true}
                    returnKeyType={"next"}
                    isMultiLines={true}
                    onSubmitEditing={() => {
                        this.setState({
                            indexButton: this.state.indexButton + 1
                        })
                    }}
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
            <View style={{ marginTop: 50 }}>
                <Text style={styles.titleInput}>Nơi làm việc</Text>
                <Text style={[commonStyles.textBold, {
                    marginLeft: Constants.MARGIN_LARGE,
                    marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE
                }]}>Chọn tỉnh thành</Text>
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
                    placeholder={"Nhấp để chọn tỉnh thành"}
                    keyboardType="default"
                    editable={true}
                    imgRight={null}
                    multiline={true}
                    visibleHr={true}
                />
                <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }]}>Chọn quận huyện</Text>
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
                    placeholder={"Nhấp để chọn quận huyện"}
                    keyboardType="default"
                    editable={true}
                    imgRight={null}
                    multiline={true}
                    visibleHr={true}
                />
                <Text style={[commonStyles.textBold, { marginLeft: Constants.MARGIN_LARGE, marginTop: Constants.MARGIN_X_LARGE, marginBottom: Constants.MARGIN_X_LARGE }]}>Địa chỉ chi tiết</Text>
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
        )
    }

    renderContactMethod = () => {
        const { phonePrimary, phoneSecondary, emailContact, error } = this.state;
        return (
            <View style={{ marginTop: 100 }}>
                <Text style={[styles.titleInput, { marginBottom: 30 }]}>Thông tin liên hệ</Text>

                <TextInputCustom
                    refInput={input => {
                        this.phonePrimary = input;
                    }}
                    value={phonePrimary}
                    onChangeText={phonePrimary => {
                        this.setState({ phonePrimary, error: null })
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    returnKeyType={"next"}
                    isInputNormal={true}
                    placeholder={"Số điện thoại liên lạc"}
                    keyboardType="phone-pad"
                    editable={true}
                    visibleHr={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.phoneSecondary.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    styleTextInput={{ marginBottom: Constants.MARGIN_LARGE }}
                    onPressPlaceHolder={() => { this.phonePrimary.focus() }}
                />
                <TextInputCustom
                    refInput={input => {
                        this.phoneSecondary = input;
                    }}
                    value={phoneSecondary}
                    onChangeText={phoneSecondary => {
                        this.setState({ phoneSecondary, error: null })
                    }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    returnKeyType={"next"}
                    isInputNormal={true}
                    placeholder={"Số điện thoại liên lạc khác"}
                    keyboardType="phone-pad"
                    editable={true}
                    visibleHr={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.emailContact.focus()
                        })
                    }}
                    styleTextInput={{ marginVertical: Constants.MARGIN_LARGE }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { this.phoneSecondary.focus() }}
                />
                <TextInputCustom
                    refInput={input => {
                        this.emailContact = input;
                    }}
                    value={emailContact}
                    onChangeText={emailContact => {
                        this.setState({ emailContact, error: null })
                    }}
                    styleTextInput={{ marginVertical: Constants.MARGIN_LARGE }}
                    inputNormalStyle={{ marginHorizontal: Constants.MARGIN_LARGE - 2 }}
                    returnKeyType={"next"}
                    isInputNormal={true}
                    placeholder={"Email liên lạc"}
                    keyboardType="default"
                    editable={true}
                    visibleHr={true}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.emailContact.focus()
                        })
                    }}
                    textBackground={Colors.COLOR_WHITE}
                    onPressPlaceHolder={() => { Keyboard.dismiss() }}
                />
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 50,
                }}>
                    <Image source={ic_phone} style={{ marginHorizontal: Constants.MARGIN_LARGE }} />
                    <Image source={ic_social} style={{ marginHorizontal: Constants.MARGIN_LARGE }} />
                    <Image source={ic_email} style={{ marginHorizontal: Constants.MARGIN_LARGE }} />
                </View>
                <Text style={{
                    ...commonStyles.text400,
                    marginTop: Constants.MARGIN_X_LARGE,
                    marginHorizontal: Constants.MARGIN_XX_LARGE,
                    fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                    textAlign: 'center'
                }}>Bằng cách thêm cách thức liên hệ, ứng viên có thể nhanh chóng liên lạc trực tiếp với bạn</Text>
            </View>
        )
    }

    handleSelectProvince = (item) => {
        this.setState({
            province: item,
            error: null
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
            <View style={{ marginTop: 100 }}>
                <Text style={styles.titleInput}>Thời gian hết hạn tuyển</Text>
                <TextInputCustom
                    backgroundColor={Colors.COLOR_TRANSPARENT}
                    styleInputGroup={styles.inputGroup}
                    titleStyles={styles.titleInput}
                    refInput={input => {
                        this.validTo = input;
                    }}
                    placeholder={'Thời hạn tuyển, ex: 20/5/2022'}
                    isInputMask={true}
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
                    onPressPlaceHolder={() => this.showCalendarDate()}
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
                <Text style={styles.titleInput}>Chọn danh mục</Text>
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
                    textForEmpty={""}
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
                paddingVertical: Constants.PADDING,
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
                {this.listCategory.length == 0 ?
                    <Text style={[commonStyles.text, { marginHorizontal: Constants.MARGIN_LARGE }]} >Chọn ít nhất 1 danh mục</Text> : null}
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

    renderButton() {
        return (
            <TouchableOpacity
                disabled={this.screenType == screenType.EDIT_POST_VIEW ? false : this.state.isDisableButton}
                onPress={() => {
                    this.onSendData()
                }}
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    backgroundColor: this.screenType == screenType.EDIT_POST_VIEW ? Colors.COLOR_PRIMARY : this.state.isDisableButton ? Colors.COLOR_BACKGROUND : Colors.COLOR_PRIMARY,
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
        if (this.state.title != null && this.state.description != null && this.state.address
            && this.state.requirement != null && this.state.position != null && this.state.salary != null && this.listCategory.length > 0 && this.state.province != null) {
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
            if (this.isNewContent() == true) {
                this.newContent = true
                this.openModalCheckUpdate()
            } else {
                this.updatePost()
            }
        } else {
            for (let i = 0; i < this.state.resources.length; i++) {
                let path = this.state.resources[i].path
                this.uploadImage(path, i)
            }
        }
    }

    openModalSuccess = () => {
        this.refs.modalSuccess.showModal()
    }

    hideModalSuccess = () => {
        this.refs.modalSuccess.hideModal()
    }

    renderModalSuccess() {
        return (
            <ModalPopup
                ref={'modalSuccess'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Bài đăng của bạn sẽ được duyệt trong thời gian sớm nhất</Text>
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

    openModalExit = () => {
        this.refs.modalExit.showModal()
    }

    hideModalExit = () => {
        this.refs.modalExit.hideModal()
    }

    renderModalExit() {
        return (
            <ModalPopup
                ref={'modalExit'}
                content={() => {
                    return (
                        <Text style={commonStyles.text}>Hủy đăng bài?</Text>
                    )
                }}
                onPressYes={() => {
                    if (this.callBack)
                        this.callBack()
                    this.onBack()
                }}
            />
        )
    }

    /**
       * Show calendar date
       */
    showCalendarDate() {
        this.showCalendar.showDateTimePicker();
    }


    /**
       * Date press
       */
    chooseDate(day) {
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
     * On delete resource
     */
    onDeleteRes = (item, index) => {
        let state = this.state;
        state.resources.splice(index, 1);
        if (!Utils.isNull(item.id)) {
            state.idResourceDeletes.push(item.id);
        }
        if (state.resources.length == 0) {
            state.error = "Bạn cần chọn ít nhất 1 ảnh"
        }
        this.setState(state);
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

                    </View>
                </View>
            </Modal>
        )
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
                this.setState({ resources: temp });
                // this.validateData()
                this.setState({
                    error: null
                })
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
        let fr = firebase.storage().ref(`job/${folder}/job${url}`);
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

    renderModalCheckUpdate() {
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
        }
        this.props.updateJob(filter);
    }

    uploadPost = () => {
        let categories = []
        this.listCategory.forEach((item) => {
            categories.push(item.id);
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
            phoneContactPrimary: this.state.phonePrimary,
            phoneContactSecondary: this.state.phoneSecondary,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddJobView);