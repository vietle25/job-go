import React, { Component } from "react";
import { Root, Header, Title, Content, Container, Tabs, Tab, TabHeading, List, Col, ScrollableTab } from "native-base";
import {
    Image, ScrollView, Text, TouchableOpacity, View, TextInput, Dimensions, RefreshControl, processColor,
    Item, Input, Modal, TouchableHighlight, ToastAndroid, Picker, SafeAreaView, DeviceEventEmitter, NativeModules,
    ImageBackground, Platform, Animated, BackHandler, Statusbar
} from "react-native";
import ImagePicker from "react-native-image-picker";
import commonStyles from "styles/commonStyles";
import { Constants } from "values/constants"
import { Colors } from "values/colors";
import { localizes } from "locales/i18n";
import BaseView from "containers/base/baseView";
import ic_back_white from "images/ic_back_white.png";
import img_avatar_default from 'images/ic_default_user.png';
import Dialog, { DIALOG_WIDTH } from 'components/dialog'
import FlatListCustom from "components/flatListCustom";
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import { connect } from "react-redux";
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';
import StorageUtil from "utils/storageUtil";
import DateUtil from "utils/dateUtil";
import styles from "./styles";
import moment from 'moment';
import ScreenType from 'enum/screenType'
import { ServerPath } from "config/Server";
import Upload from 'react-native-background-upload'
import ImageLoader from "components/imageLoader"
import { Fonts } from "values/fonts";
import DialogCustom from "components/dialogCustom";
import screenType from "enum/screenType";
import HeaderGradient from 'containers/common/headerGradient.js';
import TabsCustom from 'components/tabsCustom';
import UserDetailView from '../detail/userDetailView';
import CollapsibleTabsCustom from "components/collapsibleTabsCustom";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { CalendarScreen } from "components/calendarScreen";
import { TextInputMask } from 'react-native-masked-text';
import genderType from "enum/genderType";
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import Hr from "components/hr";
import storage from '@react-native-firebase/storage';
import DatePicker from "lib/react-native-date-ranges";

const AVATAR_SIZE = 146;

class UserProfileView extends BaseView {

    constructor(props) {
        super(props);
        const { route, navigation } = this.props;
        this.state = {
            source: "",
            coverSource: "",
            txtAccountName: '',
            enableRefresh: false,
            refreshing: false,
            isLoadingMore: false,
            enableLoadMore: false,
            image: null,
            editImage: false,
            avatar: null,
            heightAppBar: 0,
            isAlertExit: false,
            upLoadAvatar: true,
            user: null,
            isEdit: false,
            name: null,
            phone: null,
            mail: null,
            dayOfBirth: null,
            gender: null,
            isLoading: false
        }
        this.userId = route.params.userId;
        this.callBack = route.params.callBack;
        this.userInfo = null;
        this.storage = storage()
        this.genderMenuOptions = [
            {
                "name": "Nam",
                "value": genderType.MALE
            },
            {
                "name": "Nữ",
                "value": genderType.FEMALE
            },
            {
                "name": "Khác",
                "value": genderType.OTHER
            }
        ]
    }

    componentDidMount () {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                console.log(" GET USER PROFILE: ", user)
                this.handleGetProfile(user)
            }
        }).catch((error) => {
            this.saveException(error, 'componentDidMount')
        });
    }

    handleGetProfile = (user) => {
        this.setState({
            user: user,
            name: user.name,
            phone: user.phone,
            mail: user.email,
            gender: user.gender == genderType.MALE ? this.genderMenuOptions[0] : user.gender == genderType.FEMALE ? this.genderMenuOptions[1] : this.genderMenuOptions[2],
            dayOfBirth: user.birthDate
        })
    }

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        console.log(this.className, 'back pressed')
        if (this.props.navigation) {
            if (this.state.editImage) {
                this.setState({
                    editImage: false
                })
                this.showCameraRollView({
                    selectSingleItem: true,
                    callback: this.onChooseImage
                })
                this.getProfileInfo()
            } else {
                this.onBack();
            }
        } else {
            return false
        }
        return true
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    // handle request
    handleRequest = () => {
        let timeout = 1000;
    }

    /**
     * Handle data
     */
    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false;
                if (this.props.action == getActionSuccess(ActionEvent.EDIT_PROFILE)) {
                    if (data != null) {
                        this.showMessage("Chỉnh sửa thành công")
                        this.props.getUserProfile(this.state.user.id)
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    if (data) {
                        this.handleGetProfile(data)
                    }
                }
                this.state.isLoading = false
            } else if (this.props.errorCode == ErrorCode.USER_EXIST_TRY_LOGIN_FAIL) {
                this.showMessage(localizes('register.existMobile'));
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    renderMidMenu = () => {
        return <View style={{ flex: 1 }} />
    }

    /**
     * Render header CropImage
     */
    renderHeaderCropImage = () => {
        const { visibleBack } = this.state;
        return (
            <HeaderGradient
                onBack={
                    this.onPressBackButtonOnHeaderCropImage
                }
                visibleBack={true}
                title="Kéo để điều chỉnh"
                renderRightMenu={this.renderRightHeader}
            />
        );
    }

    onPressBackButtonOnHeaderCropImage = () => {
        this.setState({
            editImage: false
        })
        this.showCameraRollView({
            selectSingleItem: true,
            callback: this.onChooseImage
        })
        this.getProfileInfo()
    }

    /**
     * Render crop image
     */
    renderCropImage = () => {
        const { source, screen } = this.state;
        let hasHttp = !Utils.isNull(source) && source.indexOf('http') != -1;
        let avatar = hasHttp ? source
            : this.resourceUrlPathResize.textValue + "=" + source;
        return (
            <View style={{ flex: 1 }}>
                <CropImageCover
                    ref={input => {
                        this.cropImage = input;
                    }}
                    image={this.state.image}
                    styleCrop={{
                        width: screen.width,
                        height: 200
                    }}
                    onCropImage={this.handleResourceSelected}
                />
                {/* /* AVATAR */}
                <View style={{
                    alignItems: 'center',
                    marginTop: -AVATAR_SIZE / 2
                }}>
                    <View style={{ position: "relative", alignItems: 'center' }}>
                        <ImageLoader
                            style={styles.imageSize}
                            resizeAtt={hasHttp ? null : {
                                type: 'thumbnail', width: screen.width * 0.18, height: screen.width * 0.18
                            }}
                            resizeModeType={"cover"}
                            path={avatar}
                        />
                    </View>
                    {/* /* NAME */}
                    <Text style={[commonStyles.textBold, {
                        textAlign: "center",
                        fontSize: Fonts.FONT_SIZE_LARGE,
                        margin: Constants.MARGIN_X_LARGE
                    }]}>{this.state.txtAccountName}</Text>
                </View>
            </View>
        );
    }

    /**
     * On change tab
     */
    onChangeTab = (event) => {
        this.setState({
            activeTab: event.i,
            height: this.heights[event.i]
        });
    }

    clickChangePass = (oldPass, newPass, confirmPass) => {
        this.props.changePass(
            oldPass,
            newPass,
            confirmPass,
        )
    }

    /**
     * Render right header
     */
    renderRightHeader = () => {
        return (
            <View style={{
                alignItems: 'center',
                position: "absolute",
                right: Constants.PADDING_LARGE
            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.cropImage._crop()
                    }}>
                    
                </TouchableOpacity>
            </View>
        )
    }

    onChooseImage = (images) => {
        this.setState({
            image: images[0],
            editImage: true
        })
    }

    /** 
     * on capture image
     */
    onCaptureImage = (image) => {
        image.uri = image.path;
        this.setState({
            image: image,
            editImage: true
        })
    }

    onChooseImageAvatar = (avatar) => {
        this.setState({
            avatar: avatar[0],
            isEdit: true
        })
        // this.uploadAvatar();
    }

    onCaptureImageAvatar = (avatar) => {
        this.state.avatar = avatar;
        this.uploadAvatar();
    }

    /**
     * Handle resource selected
     */
    handleResourceSelected = (res) => {

        const { screen } = this.state;

        let resourceTemps = null;
        let count = 0;
        let maxSizeUpload = this.maxFileSizeUpload.numericValue;
        resourceTemps = {
            path: res,
            width: "100%",
            height: 200
        }
        this.setState({ resources: resourceTemps });
        this.setState({
            image: res,
            editImage: false
        })
        this.uploadResourcesCover(this.userInfo.id)
    }

    /**
  * Upload image
  */
    uploadImage = (uri) => {
        this.setState({
            isLoading: true
        })
        let fr = storage().ref(`user/${this.state.user.id}/avatar`);
        fr.putFile(uri, { contentType: 'image/jpeg' }).on(
            storage().TaskEvent.STATE_CHANGED,
            snapshot => {
                console.log("snapshot uploaded image to firebase", snapshot);
                if (snapshot.state == "success") {
                    fr.getDownloadURL().then((urls) => {
                        this.setState({
                            avatar: { uri: urls }
                        }, () => {
                            this.onEditData()
                        })
                    })
                }
            }
            ,
            error => {
                setError(error);
            }
        );
    }


    /**
     * Upload avatar
     */
    uploadAvatar () {
        const { avatar } = this.state;
        if (avatar.length === 0) {
            this.setState({
                isUploading: false,
                isAlertSuccess: true
            })
        } else {
            console.log('Resource Path', avatar.path);
            this.setState({
                isUploading: true
            });
            let filePathUrl = avatar.path;
            if (Platform.OS == "android") {
                filePathUrl = avatar.path.replace('file://', '');
            } else {
                filePathUrl = Utils.convertLocalIdentifierIOSToAssetLibrary(avatar.path, true);
            }
            let file = {
                fileType: 'image/*',
                filePath: filePathUrl
            }
            const options = {
                url: ServerPath.API_URL + 'user/upload/avatar',
                path: file.filePath,
                method: 'POST',
                field: 'file',
                type: 'multipart',
                headers: {
                    'Content-Type': 'application/json', // Customize content-type
                    'X-APITOKEN': global.token
                }
            }
            this.processUploadResource(options);
        }
        setTimeout(() => {
            // this.handleRefresh()
        }, 1000)
    }

    /**
     * Process upload resource
     * @param {*} options 
     */
    processUploadResource (options) {
        const { resources } = this.state;
        Upload.startUpload(options).then((uploadId) => {
            console.log('Upload started')
            Upload.addListener('progress', uploadId, (data) => {
                console.log(`Progress: ${data.progress}%`)
                this.setState({
                    progress: data.progress / 100
                })
            })
            Upload.addListener('error', uploadId, (data) => {
                console.log(`Error: ${data.error}%`)
                this.showMessage(localizes('uploadImageError'))
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                console.log(`Cancelled!`)
            })
            Upload.addListener('completed', uploadId, (data) => {
                console.log(`completed!`)
                this.setState({
                    isUploading: false,
                    isAlertSuccess: true
                })
                if (this.state.upLoadAvatar) {
                    this.showMessage("Cập nhật ảnh đại diện thành công");
                } else {
                    this.showMessage("Cập nhật ảnh bìa thành công");
                }
                console.log('Completed upload images!')
                this.handleRequest();
            })
        }).catch((err) => {
            this.saveException(err, 'processUploadResource');
        })
    }

    showCalendarDate = () => {
        this.showCalendar.showDateTimePicker();
    }

    chooseDate = (day) => {
        this.setState({
            dayOfBirth: DateUtil.convertFromFormatToFormat(day, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_TIME_ZONE)
        });
    }

    /**
    * validate
    */
    validate () {
        const { name, mail, phone, dayOfBirth } = this.state;
        let day = DateUtil.convertFromFormatToFormat(dayOfBirth, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)
        let nowDateMili = DateUtil.getTimeStampNow()
        let res1 = null
        if (phone != null) {
            res1 = phone.trim().charAt(0);
        }
        if (Utils.isNull(phone) || phone.trim().length == 0) {
            this.showMessage(localizes('login.vali_fill_phone'));
            this.setState({
                phone: null
            }, () => {
            })
        } else if (StringUtil.containNumber(phone) == null) {
            this.showMessage(localizes('login.vali_phone'));
        } else if (res1 != '0') {
            this.showMessage(localizes('login.errorPhone'));
        } else if (!Utils.validatePhone(phone.trim())) {
            this.showMessage(localizes('login.vali_phone'));
        } else if (Utils.isNull(name)) {
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (StringUtil.validSpecialCharacter(name)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (StringUtil.validSpecialCharacter2(name)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (name.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
        } else if (!Utils.isNull(dayOfBirth) && !Utils.validateDate(day)) {
            this.showMessage(localizes('register.vali_dayOfBirth'))
        } else if (mail != null && mail.trim() != "" && mail != this.state.user.email && !Utils.isNull(mail) && !Utils.validateEmail(mail.trim())) {
            this.showMessage(localizes("userInfo.valiEmail"));
        } else {
            this.setState({
                isEdit: !this.state.isEdit
            })
            if (this.state.avatar != null) {
                this.uploadImage(this.state.avatar.uri)
            } else {
                this.onEditData();
            }
        }
    }

    onEditData = () => {
        const {
            name,
            dayOfBirth,
            gender,
            mail, phone
        } = this.state;
        let editData = {
            avatarPath: this.state.avatar != null ? this.state.avatar.uri : null,
            name: StringUtil.validMultipleSpace(name.trim()),
            birthDate: dayOfBirth,
            gender: gender.value,
            email: StringUtil.validMultipleSpace(mail.trim().toLowerCase()),
            phone: phone
        };
        this.props.editProfile(editData);
    };


    renderUserAvatar () {
        const { user } = this.state;
        if (user == null) return null;
        console.log("URI USER AVÂTRR: ", this.state.avatar);
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={[{ position: "relative", alignItems: 'center', backgroundColor: Colors.COLOR_WHITE }]}>
                    {this.state.avatar != null ?
                        <Image
                            source={{ uri: this.state.avatar.uri }}
                            style={styles.imageSize}
                        />
                        :
                        <ImageLoader
                            style={styles.imageSize}
                            resizeModeType={"cover"}
                            path={user ? user.avatarPath : null}
                        />
                    }
                    <View style={[commonStyles.viewCenter, { position: "absolute", bottom: 0 }]}>
                        <TouchableOpacity
                            style={{
                                overflow: "hidden",
                                backgroundColor: Colors.COLOR_BLACK_OPACITY_30,
                                padding: Constants.PADDING,
                                borderRadius: Constants.PADDING,
                                bottom: Constants.MARGIN_LARGE
                            }}
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={
                                () => {
                                    this.showCameraRollView({
                                        selectSingleItem: true,
                                        callback: this.onChooseImageAvatar,
                                        callbackCaptureImage: this.onCaptureImageAvatar
                                    })
                                    this.setState({ upLoadAvatar: true })
                                }}>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }

    renderName () {
        const { user, isEdit } = this.state;
        if (user == null) return;
        return (
            <View style={{ marginVertical: Constants.MARGIN }}>
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]}>Họ tên</Text>
                <TextInput
                    ref={(name) => { this.name = name }}
                    placeholder={"Nhập tên của bạn..."}
                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                    returnKeyType={'next'}
                    autoCapitalize={'words'}
                    style={[commonStyles.text, {
                        flex: 1,
                        textAlign: 'left',
                        padding: 0,
                        paddingBottom: 8,
                        marginBottom: 2
                    },]}
                    value={this.state.name}
                    onChangeText={(name) => {
                        this.setState({
                            name
                        })
                    }}
                    onSubmitEditing={() => {
                        this.mail.focus()
                    }}
                    underlineColorAndroid={isEdit ? Colors.COLOR_PRIMARY : 'transparent'}
                    blurOnSubmit={false}
                    editable={isEdit}
                />
            </View>
        )
    }

    renderPhone () {
        const { user, isEdit } = this.state;
        if (user == null) return;
        return (
            <View style={{ marginVertical: Constants.MARGIN }}>
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]}>Số điện thoại</Text>
                <TextInput
                    ref={(phone) => { this.phone = phone }}
                    placeholder={"Nhập số điện thoại..."}
                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                    returnKeyType={'next'}
                    autoCapitalize={'words'}
                    style={[commonStyles.text, {
                        flex: 1,
                        textAlign: 'left',
                        padding: 0,
                        paddingBottom: 8,
                        marginBottom: 2
                    },]}
                    value={this.state.phone}
                    onChangeText={(phone) => {
                        this.setState({
                            phone
                        })
                    }}
                    keyboardType="phone-pad"
                    editable={isEdit && user.phone == null}
                    blurOnSubmit={true}
                    underlineColorAndroid={isEdit ? Colors.COLOR_PRIMARY : 'transparent'}
                />
            </View>
        )
    }

    renderMail () {
        const { user, isEdit } = this.state;
        if (user == null) return;
        return (
            <View style={{ marginVertical: Constants.MARGIN }}>
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]}>Email</Text>
                <TextInput
                    ref={(mail) => { this.mail = mail }}
                    placeholder={"Nhập email..."}
                    placeholderTextColor={Colors.COLOR_DRK_GREY}
                    returnKeyType={'next'}
                    autoCapitalize={'words'}
                    style={[commonStyles.text, {
                        flex: 1,
                        paddingBottom: 8,
                        textAlign: 'left',
                        padding: 0,
                        marginBottom: 2
                    },]}
                    value={this.state.mail}
                    onChangeText={(mail) => {
                        this.setState({
                            mail
                        })
                    }}
                    onSubmitEditing={() => {
                        setTimeout(() => {
                            this.dayOfBirth.focus()
                        })
                    }}
                    keyboardType={'normal'}
                    editable={isEdit}
                    blurOnSubmit={true}
                    underlineColorAndroid={isEdit ? Colors.COLOR_PRIMARY : 'transparent'}
                />
            </View>
        )
    }

    renderDayOfBirth () {
        const { user, isEdit } = this.state;
        if (user == null) return;
        return (
            <View style={{ marginVertical: Constants.MARGIN }}>
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]}>Ngày sinh</Text>
                <TextInputMask
                    ref={(dayOfBirth) => { this.dayOfBirth = dayOfBirth }}
                    style={[commonStyles.text, {
                        paddingBottom: 8,
                        flex: 1, textAlign: 'left',
                        padding: 0,
                        marginBottom: 2,
                    },]}
                    placeholder={"Nhập ngày sinh ..."}
                    value={this.state.dayOfBirth ? DateUtil.convertFromFormatToFormat(this.state.dayOfBirth, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) : null}
                    onChangeText={dayOfBirth => this.setState({ dayOfBirth })}
                    keyboardType="phone-pad"
                    returnKeyType={"next"}
                    blurOnSubmit={false}
                    onFocus={() => this.showCalendarDate()}
                    type={'datetime'}
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    editable={this.state.isEdit}
                    onSubmitEditing={() => {
                        this.menuOption.open()
                    }}
                    underlineColorAndroid={isEdit ? Colors.COLOR_PRIMARY : 'transparent'}
                />
            </View>
        )
    }

    renderGender () {
        const { user } = this.state;
        if (user == null) return;
        return (
            <TouchableOpacity
                disabled={!this.state.isEdit}
                style={{ marginTop: Constants.MARGIN_LARGE }}
                onPress={() => {
                    this.menuOption.open()
                }}>
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]}>Giới tính</Text>
                <Text style={[commonStyles.text]}>{this.state.gender ? this.state.gender.name : 'Chọn giới tính'}</Text>
                {this.state.isEdit ? <Hr color={Colors.COLOR_PRIMARY} width={1.2} style={{ marginHorizontal: 4 }} /> : null}
                {this.renderMenuOption()}
            </TouchableOpacity >
        )
    }

    renderMenuOption = () => {
        return (
            <Menu ref={ref => (this.menuOption = ref)}>
                <MenuTrigger text="" />
                <MenuOptions>
                    {this.genderMenuOptions.map(item => {
                        return (
                            <MenuOption
                                onSelect={() => {
                                    this.setState({ gender: item })
                                }}
                            >
                                <View
                                    style={[
                                        commonStyles.viewHorizontal,
                                        {
                                            alignItems: "center",
                                            padding: Constants.PADDING_LARGE,
                                            marginLeft: Constants.MARGIN_X_LARGE
                                        }
                                    ]}>
                                    <Text style={[commonStyles.text]}>{item.name}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    };

    renderInfo () {
        return (
            <View>
                <Text style={[commonStyles.textBold, { marginBottom: Constants.MARGIN_X_LARGE }]}></Text>
                {this.renderName()}
                {this.renderPhone()}
                {this.renderMail()}
                {this.renderDayOfBirth()}
                {this.renderGender()}
            </View>
        )
    }

    renderButton () {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => {
                    if (this.state.isEdit) {
                        this.validate()
                    } else {
                        setTimeout(() => {
                            this.name.focus()
                        })

                        this.setState({
                            isEdit: true
                        })
                    }
                }}
                style={{
                    padding: Constants.PADDING_LARGE + 2,
                    alignItems: 'center',
                    marginBottom: Constants.MARGIN_X_LARGE, backgroundColor: Colors.COLOR_PRIMARY,
                    marginHorizontal: Constants.MARGIN_X_LARGE, borderRadius: Constants.CORNER_RADIUS
                }}>
                <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]}>{this.state.isEdit ? "Hoàn tất" : "Chỉnh sửa"}</Text>
            </TouchableOpacity>
        )
    }


    /**
     * Render View
     */
    render () {
        const { user, isEdit } = this.state;
        return (
            <Container style={[styles.container, { backgroundColor: Colors.COLOR_WHITE }]}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={true}
                        title={isEdit ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
                    />
                    <Content contentContainerStyle={[{ flexGrow: 1, backgroundColor: Colors.COLOR_WHITE, padding: Constants.PADDING_X_LARGE }]}>
                        {this.renderUserAvatar()}
                        {this.renderInfo()}
                    </Content>
                    {this.renderButton()}
                    <CalendarScreen
                        maximumDate={new Date(new Date().setDate(DateUtil.now().getDate() - 1))}
                        dateCurrent={
                            !Utils.isNull(this.state.user && this.state.user.birthDate)
                                ? DateUtil.convertFromFormatToFormat(
                                    this.state.user.birthDate,
                                    DateUtil.FORMAT_DATE_TIME_ZONE,
                                    DateUtil.FORMAT_DATE_TIME_ZONE_T
                                ) : DateUtil.now()
                        }
                        chooseDate={this.chooseDate}
                        ref={ref => (this.showCalendar = ref)}
                    />
                    {this.state.refreshing ? null : this.showLoadingBar(this.state.isLoading)}
                </Root>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    data: state.userProfile.data,
    action: state.userProfile.action,
    isLoading: state.userProfile.isLoading,
    error: state.userProfile.error,
    errorCode: state.userProfile.errorCode
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);
