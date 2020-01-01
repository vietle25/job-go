import React, {Component} from 'react';
import {
    View,
    Text,
    BackHandler,
    Keyboard,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    Image,
    Icon,
    Platform,
    TouchableHighlight,
} from 'react-native';
import {
    Container,
    Root,
    Header,
    Content,
    Form,
    Item,
} from 'native-base';
import BaseView from 'containers/base/baseView';
import {Constants} from 'values/constants';
import {Fonts} from 'values/fonts';
import TextInputCustom from 'components/textInputCustom';
import {localizes} from 'locales/i18n';
import {CalendarScreen} from 'components/calendarScreen';
import ic_camera_black from 'images/ic_camera_black.png';
import ic_calendar_black from 'images/ic_calendar_black.png';
import DateUtil from 'utils/dateUtil';
import {Colors} from 'values/colors';
import styles from './styles';
import commonStyles from 'styles/commonStyles';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import {connect} from 'react-redux';
import {ErrorCode} from 'config/errorCode';
import {ActionEvent, getActionSuccess} from 'actions/actionEvent';
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';
import moment, {locales} from 'moment';
import ImageLoader from 'components/imageLoader';
import DialogCustom from 'components/dialogCustom';
import ImagePicker from 'react-native-image-picker';
import ServerPath from 'config/Server';
import Upload from 'react-native-background-upload';
import FlatListCustom from 'components/flatListCustom';
import GenderType from 'enum/genderType';
import screenType from 'enum/screenType';
import ImageResizer from 'react-native-image-resizer';
import ic_menu_vertical from 'images/ic_menu_vertical.png';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import StorageUtil from 'utils/storageUtil';
import {thisExpression} from '@babel/types';
import appType from 'enum/appType';
import userType from 'enum/userType';
import staffType from 'enum/staffType';
import {configConstants} from 'values/configConstants';
import HeaderGradient from 'containers/common/headerGradient';
import ic_dropdown_black from 'images/ic_drop_down_black.png';


const screen = Dimensions.get('window');
const CANCEL_INDEX = 2;
const FILE_SELECTOR = [
    localizes('camera'),
    localizes('image'),
    localizes('cancel'),
];
const optionsCamera = {
    title: 'Select avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 0 : 44;
var HEIGHT_IMAGES = width * 0.4;
var isEdit = false;
class EditProfileView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            enableRefresh: false,
            refreshing: false,
            isAlert: false,
            isAlertSuccess: false,
            visibleDialog: false,
            phone: ' ',
            fullName: ' ',
            dayOfBirth: ' ',
            address: ' ',
            email: ' ',
            description: ' ',
            source: null,
            avatarPath: null,
            avatarPathUpload: null,
            avatarFilePath: {fileType: '', filePath: ''},
            editable: true,
            gender: 1,
            chassis: null,
            heightt: "100%",
            ggidCheck: false,
        };
        this.today = DateUtil.now();
        this.userInfo = null;
        this.validate = this.validate.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);

        this.genderMenuOptions = [
            {
                "name": "Nam",
                "value": 1
            },
            {
                "name": "Nữ",
                "value": 2
            }
        ]
    }

    componentDidMount () {
        this.setState({
            heightt: "99%"
        })


        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.getSourceUrlPath();
        if (this.state.editable) {
            this.getProfile();
        }
    }

    /**
       * Get profile user
       */
    getProfile () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                //this callback is executed when your Promise is resolved
                if (!Utils.isNull(user)) {
                    this.userInfo = user;
                    this.props.getUserProfile(user.id);
                    this.handleGetProfile(user);
                }

                //this callback ggid to set editable email input
                if (Utils.isNull(user.ggId)) {
                    this.setState({ggidCheck: false})
                } else {
                    this.setState({ggidCheck: true})
                }
            })
            .catch(error => {
                //this callback is executed when your Promise is rejected
                this.saveException(error, 'getProfile');
            });
    }

    // handle get profile
    handleGetProfile (user) {
        console.log('dddd', user);
        this.userInfo = user;
        this.setState({
            fullName: user.name,
            dayOfBirth: !Utils.isNull(user.birthDate)
                ? DateUtil.convertFromFormatToFormat(
                    DateUtil.convertFromFormatToFormat(user.birthDate, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_TIME_ZONE),
                    DateUtil.FORMAT_DATE_TIME_ZONE,
                    DateUtil.FORMAT_DATE
                )
                : null,
            phone: user.phone,
            address: user.address,
            chassis: !Utils.isNull(user.membershipCard)
                ? user.membershipCard.vehicleChassisNumber
                : null,
            typeAccount: 'abc',
            email: user.email,
            description: user.description,
            gender: Utils.isNull(user.gender) ? 1 : user.gender
        });
    }

    /**
       * Show calendar date
       */
    showCalendarDate () {
        console.log("hahaha")
        this.showCalendar.showDateTimePicker();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    setStateEdit = () => {
        isEdit = false;
        this.setState({editable: false});
    };

    /**
       * Handle data
       */
    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false;
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    if (!Utils.isNull(data)) {
                        this.handleGetProfile(data);
                        this.state.source = data.avatarPath;
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.EDIT_PROFILE)) {
                    console.log('CHÂT CON MẸ NÓ RỒI ', !Utils.isNull(data.avatarPath));
                    if (!Utils.isNull(this.state.avatarPathUpload)) {
                        this.uploadAvatar(this.state.avatarPathUpload);
                    }
                    // this.setState({ isAlertSuccess: true });
                    this.showMessage("Chính sửa thông tin cá nhân thành công")
                    this.getProfile();
                    this.onBack();
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    render () {
        const {source, editable, vehicleChassisNumber} = this.state;
        let hasHttp = !Utils.isNull(source) && source.indexOf("http") != -1;
        let avatar = hasHttp ? source
            : this.resourceUrlPathResize.textValue + "=" + source;
        return (
            <Container style={[styles.container, {backgroundColor: Colors.COLOR_WHITE}]}>
                <Root>

                    {/* /* HEADER */}
                    <View style={{borderBottomWidth: 1, borderColor: '#00000014'}}>
                        <HeaderGradient
                            onBack={this.onBack}
                            visibleBack={true}
                            title={"Chỉnh sửa thông tin"}
                            colors={[Colors.COLOR_TRANSPARENT, Colors.COLOR_TRANSPARENT]}
                            titleStyle={{color: Colors.COLOR_BLACK}}
                        />
                    </View>
                    <Content
                        contentContainerStyle={{flexGrow: 1}}
                        style={{flex: 1}}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }>
                        <View style={{
                            flex: 1,
                            marginTop: Constants.PADDING_LARGE,
                            backgroundColor: Colors.COLOR_WHITE
                        }}>

                            <View>
                                <Text style={[commonStyles.textBold, {marginTop: Constants.PADDING_LARGE, marginLeft: Constants.PADDING_X_LARGE, color: Colors.COLOR_BLACK}]}>Thông tin</Text>
                            </View>

                            {/* /* FULL NAME */}
                            <TextInputCustom
                                inputNormalStyle={{height: this.state.heightt}}
                                backgroundColor={Colors.COLOR_TRANSPARENT}
                                styleInputGroup={styles.inputGroup}
                                titleStyles={styles.titleInput}
                                refInput={input => (this.fullName = input)}
                                isInputNormal={true}
                                placeholder={'Họ và tên'}
                                value={this.state.fullName}
                                onChangeText={fullName => this.setState({fullName})}
                                onSubmitEditing={() => {
                                    this.email.focus();
                                }}
                                returnKeyType={"next"}
                                editable={true}
                            />

                            {/* /* PHONE NUMBER*/}
                            <TextInputCustom
                                backgroundColor={Colors.COLOR_TRANSPARENT}
                                styleInputGroup={styles.inputGroup}
                                titleStyles={styles.titleInput}
                                refInput={input => {
                                    this.phone = input;
                                }}
                                isInputNormal={true}
                                placeholder={"Phone"}
                                value={this.state.phone}
                                onChangeText={phone =>
                                    this.setState({
                                        phone: phone
                                    })
                                }
                                onSubmitEditing={() => {
                                    this.email.focus();
                                }}
                                keyboardType="phone-pad"
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                numberOfLines={1}
                                editable={false}
                            />

                            {/* /* EMAIL*/}
                            <TextInputCustom
                                backgroundColor={Colors.COLOR_TRANSPARENT}
                                styleInputGroup={styles.inputGroup}
                                titleStyles={styles.titleInput}
                                refInput={input => {
                                    this.email = input;
                                }}
                                isInputNormal={true}
                                placeholder={'Email'}
                                value={this.state.email}
                                onChangeText={email =>
                                    this.setState({
                                        email: email
                                    })
                                }
                                onSubmitEditing={() => {
                                    this.dayOfBirth.getElement().focus();
                                }}
                                returnKeyType={"next"}
                                editable={!this.state.ggidCheck}
                            />

                            {/* Day Of Birth */}
                            <View>
                                <TextInputCustom
                                    backgroundColor={Colors.COLOR_TRANSPARENT}
                                    styleInputGroup={styles.inputGroup}
                                    titleStyles={styles.titleInput}
                                    refInput={input => {
                                        this.dayOfBirth = input;
                                    }}
                                    placeholder={'Ngày sinh'}
                                    isInputMask={true}
                                    placeholder={"--/--/----"}
                                    onChangeText={dayOfBirth =>
                                        this.setState({
                                            dayOfBirth: dayOfBirth
                                        })
                                    }
                                    value={this.state.dayOfBirth}
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
                                    contentRight={ic_calendar_black}
                                    onPressRight={() => this.showCalendarDate()}
                                />
                            </View>

                            {/* /* GENDER */}
                            <TextInputCustom
                                backgroundColor={Colors.COLOR_TRANSPARENT}
                                touchSpecialStyle={styles.inputGroup}
                                titleStyles={styles.titleInput}
                                isInputAction={true}
                                placeholder={'Giới tính'}
                                value={this.state.gender == 1 ? "Nam" : "Nữ"}
                                onChangeText={gender =>
                                    this.setState({
                                        gender: gender
                                    })
                                }
                                returnKeyType={"next"}
                                editable={true}
                                onPress={() => {
                                    this.menuOption.open()
                                }}
                                imgRight={ic_dropdown_black}
                            />
                            {this.renderMenuOption()}

                            {/* /* ADDRESS */}
                            <TextInputCustom
                                inputNormalStyle={{
                                    flex: 1,
                                    height: 100,
                                    marginHorizontal: Constants.MARGIN_LARGE,
                                    paddingHorizontal: Constants.PADDING_LARGE
                                }}
                                styleInputGroup={styles.inputGroup}
                                refInput={input => (this.address = input)}
                                titleStyles={styles.titleInput}
                                value={this.state.address}
                                errorDescription={this.state.errorDescription}
                                onChangeText={address => {
                                    this.setState({address});
                                }}
                                isMultiLines={true}
                                placeholder={'Nhập địa chỉ'}
                                keyboardType="default"
                                editable={true}
                                numberOfLines={2}
                                returnKeyType={'done'}
                                multiline={true}
                            />
                            {/* /* BUTTON CONFIRM */}
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                {this.renderCommonButton(
                                    'Cập nhật',
                                    {color: Colors.COLOR_WHITE},
                                    {
                                        marginVertical: Constants.MARGIN_X_LARGE,
                                        backgroundColor: Colors.COLOR_GOOGLE,
                                        marginHorizontal: Constants.MARGIN_X_LARGE,
                                        borderRadius: Constants.PADDING,
                                    },
                                    () => this.validate()
                                )}
                            </View>

                            {/* /* BUTTON CANCEL */}

                            <View style={{marginTop: -Constants.MARGIN_X_LARGE}}>
                                {this.renderCommonButton(
                                    'Huỷ bỏ',
                                    {color: Colors.COLOR_PRIMARY},
                                    {
                                        borderRadius: Constants.PADDING, borderColor: Colors.COLOR_GREY_LIGHT, borderWidth: 0.5
                                    },
                                    () => this.onBack(),
                                    [Colors.COLOR_WHITE, Colors.COLOR_WHITE]
                                )}
                            </View>
                        </View>
                    </Content>
                    {this.renderFileSelectionDialog()}
                    {this.renderAlertSuccess()}
                    {this.logoutDialog()}
                    <CalendarScreen
                        maximumDate={new Date(new Date().setDate(DateUtil.now().getDate()))}
                        dateCurrent={DateUtil.now()}
                        chooseDate={this.chooseDate.bind(this)}
                        ref={ref => (this.showCalendar = ref)}
                    />
                    {this.state.refreshing
                        ? null
                        : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    /**
       * show dialog logout
       */
    logoutDialog = () => (
        <DialogCustom
            visible={this.state.isAlert}
            isVisibleTitle={true}
            isVisibleContentText={true}
            isVisibleTwoButton={true}
            contentTitle={'Xác nhận'}
            textBtnOne={'Hủy'}
            textBtnTwo={'Đăng xuất'}
            contentText={localizes('slidingMenu.want_out')}
            onTouchOutside={() => {
                this.setState({isAlert: false});
            }}
            onPressX={() => {
                this.setState({isAlert: false});
            }}
            onPressBtnPositive={() => {
                StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN)
                    .then(token => {
                        if (token != undefined) {
                            let filter = {
                                deviceId: '',
                                deviceToken: token,
                            };
                            this.props.deleteUserDeviceInfo(filter); // delete device info
                        } else {
                            console.log('token null');
                        }
                    })
                    .catch(error => {
                        //this callback is executed when your Promise is rejected
                        this.saveException(error, 'logoutDialog');
                    });
                StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
                    .then(user => {
                        console.log('user setting', user);
                        if (Utils.isNull(user)) {
                            this.showMessage(localizes('setting.logoutSuccess'));
                            this.setState({isAlert: false});
                            this.logout();
                            this.goHomeScreen();
                        } else {
                            this.showMessage(localizes('setting.logoutFail'));
                        }
                    })
                    .catch(error => {
                        this.saveException(error, 'logoutDialog');
                    });
                // this.signOutFB(this.state.userFB);
                // this.signOutGG(this.state.userGG);
            }}
        />
    );

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.props.getUserProfile(this.userInfo.id);
    };

    /**
       * Attach file
       */
    attachFile = () => {
        this.showDialog();
    };

    /**
       * Show dialog
       */
    showDialog () {
        this.setState({
            visibleDialog: true,
        });
    }

    /**
       * hide dialog
       */
    hideDialog () {
        this.setState({
            visibleDialog: false,
        });
    }

    /**
       * Called when selected type
* @param {*} index
        */
    onSelectedType (index) {
        if (index !== CANCEL_INDEX) {
            if (index === 0) {
                this.takePhoto();
            } else if (index === 1) {
                this.showDocumentPicker();
            }
        } else {
            this.hideDialog();
        }
    }

    /**
     * Show document picker
     */
    showDocumentPicker = fileType => {
        ImagePicker.launchImageLibrary(optionsCamera, response => {
            const {error, uri, originalRotation, didCancel} = response;
            console.log('image', response);
            this.hideDialog();
            if (uri && !error) {
                let rotation = 0;
                ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80, rotation)
                    .then(({uri}) => {
                        let uriReplace = uri;
                        if (Platform.OS == 'android') {
                            uriReplace = uri.replace('file://', '');
                        }
                        let file = {
                            fileType: 'image/*',
                            filePath: uriReplace,
                        };
                        this.setState({
                            avatarPath: uri,
                            avatarPathUpload: uriReplace,
                        });
                        console.log('URI: ', file.filePath);
                        console.log('URI: ', uri);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else if (error) {
                console.log(
                    'The photo picker errored. Check ImagePicker.launchCamera func'
                );
                console.log(error);
            }
        });
    };

    /**
       * Take a photo
       */
    takePhoto = () => {
        ImagePicker.launchCamera(optionsCamera, response => {
            const {error, uri, originalRotation, didCancel} = response;
            console.log('image', response);
            this.hideDialog();
            console.log('CHỤP XONG RỒI');
            if (uri && !error) {
                let rotation = this.rotateImage(originalRotation);
                console.log('CHỤP XONG RỒI VÀO ĐÂY + URI: ', uri);
                ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80, rotation)
                    .then(({uri}) => {
                        let uriReplace = uri;
                        if (Platform.OS == 'android') {
                            uriReplace = uri.replace('file://', '');
                        }
                        let file = {
                            fileType: 'image/*',
                            filePath: uriReplace,
                        };
                        this.setState({
                            avatarPath: uri,
                            avatarPathUpload: uriReplace,
                        });
                        console.log('URI: ', file.filePath);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else if (error) {
                console.log(
                    'The photo picker errored. Check ImagePicker.launchCamera func'
                );
                console.log(error);
            }
        });
    };

    /**
       *
* @param {filePath} orientation
        */
    uploadAvatar (filePath) {
        const options = {
            url: ServerPath.API_URL + 'user/upload/avatar',
            path: filePath,
            method: 'POST',
            field: 'file',
            type: 'multipart',
            headers: {
                'Content-Type': 'application/json', // Customize content-type
                'X-APITOKEN': global.token,
            },
        };
        try {
            console.log('Ready Upload');
            Upload.startUpload(options)
                .then(uploadId => {
                    console.log('Upload started');
                    Upload.addListener('progress', uploadId, data => {
                        console.log(`Progress: ${data.progress}%`);
                    });
                    Upload.addListener('error', uploadId, data => {
                        console.log(`Error: ${data.error}%`);
                    });
                    Upload.addListener('cancelled', uploadId, data => {
                        console.log(`Cancelled!`);
                    });
                    Upload.addListener('completed', uploadId, data => {
                        // data includes responseCode: number and responseBody: Object
                        console.log('Completed!');
                        if (!Utils.isNull(data.responseBody)) {
                            let result = JSON.parse(data.responseBody);
                            console.log(
                                'Hello!' +
                                this.resourceUrlPathResize.textValue +
                                '=' +
                                result.data
                            );
                            if (!Utils.isNull(result.data)) {
                                this.setState({
                                    source: this.resourceUrlPathResize.textValue +
                                        '=' +
                                        result.data,
                                    avatarPath: null,
                                });
                            }
                        }
                    });
                })
                .catch(error => {
                    this.saveException(error, 'showDocumentPicker');
                    this.showMessage('Upload error, please try again');
                });
        } catch (e) {
            console.log('Erro when upload images', e.message);
            this.showMessage('Upload error, please try again');
        }
    }

    /**
       * Rotate image
       */
    rotateImage (orientation) {
        let degRotation;
        switch (orientation) {
            case 90:
                degRotation = 90;
                break;
            case 270:
                degRotation = -90;
                break;
            case 180:
                degRotation = 180;
                break;
            default:
                degRotation = 0;
        }
        return degRotation;
    }

    /**
       * Date press
       */
    chooseDate (day) {
        this.setState({
            dayOfBirth: DateUtil.convertFromFormatToFormat(
                day,
                DateUtil.FORMAT_DATE_TIME_ZONE_T,
                DateUtil.FORMAT_DATE
            ),
        });
    }

    /**
       * edit data & validation
       */
    onEditData = () => {
        const {
            fullName,
            dayOfBirth,
            address,
            gender,
            description,
            email,
        } = this.state;
        if (Utils.isNull(fullName.trim())) {
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (!Utils.validateEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
        } else {
            let editData = {
                name: StringUtil.validMultipleSpace(fullName.trim()),
                birthDate: Utils.isNull(dayOfBirth)
                    ? null
                    : DateUtil.convertFromFormatToFormat(
                        moment(dayOfBirth, 'DD-MM-YYYY').add(1, 'days'),
                        DateUtil.FORMAT_DATE,
                        DateUtil.FORMAT_DATE_TIME_ZONE
                    ),
                address: address,
                gender: gender,
                description: description,
                email: StringUtil.validMultipleSpace(email.trim().toLowerCase()),
            };
            this.props.editProfile(editData);
            console.log('DATA EDIT NE CAC BAN: ', editData);
        }
    };

    /**
     * Render file selection dialog
     */
    renderFileSelectionDialog () {
        return (
            <DialogCustom
                visible={this.state.visibleDialog}
                isVisibleTitle={true}
                isVisibleContentForChooseImg={true}
                contentTitle={localizes('userInfoView.chooseImages')}
                onTouchOutside={() => {
                    this.setState({visibleDialog: false});
                }}
                onPressX={() => {
                    this.setState({visibleDialog: false});
                }}
                onPressCamera={() => {
                    this.onSelectedType(0);
                }}
                onPressGallery={() => {
                    this.onSelectedType(1);
                }}
            />
        );
    }

    /**
       * Render alert add address success
       */
    renderAlertSuccess () {
        return (
            <DialogCustom
                visible={this.state.isAlertSuccess}
                isVisibleTitle={true}
                isVisibleOneButton={true}
                isVisibleContentText={true}
                contentTitle={localizes('notification')}
                textBtn={localizes('yes')}
                contentText={'Cập nhật thông tin thành công'}
                onPressBtn={() => {
                    this.setState({isAlertSuccess: false, editable: false});
                    this.editable = false;
                    this.onBack();
                    // this.callBack();
                    this.props.getUserProfile(this.userInfo.id);
                }}
                onTouchOutside={() => {
                    this.setState({isAlertSuccess: false, editable: false});
                    this.editable = false;
                    //this.onBack();
                    //this.callBack();
                    this.props.getUserProfile(this.userInfo.id);
                }}
            />
        );
    }

    /**
       * validate
       */

    validate () {
        const {fullName, email, phone, address, dayOfBirth} = this.state;

        let nowDateMili = DateUtil.getTimeStampNow()
        let dayOfBirthFormatTimeZone = DateUtil.convertFromFormatToFormat(dayOfBirth, DateUtil.FORMAT_DATE, DateUtil.FORMAT_DATE_TIME_ZONE_T)
        let dayOfBirthMili = DateUtil.getTimestamp(dayOfBirthFormatTimeZone) * 1000

        const res = phone.trim().charAt(0);
        if (Utils.isNull(fullName)) {
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (StringUtil.validSpecialCharacter(fullName)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (StringUtil.validSpecialCharacter2(fullName)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (StringUtil.validEmojiIcon(fullName)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (fullName.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
        } else if (!Utils.isNull(dayOfBirth) && !Utils.validateDate(dayOfBirth)) {
            this.showMessage(localizes('register.vali_dayOfBirth'))
        } else if (!Utils.isNull(dayOfBirth) && nowDateMili <= dayOfBirthMili) {
            this.showMessage(localizes('register.vali_dayOfBirth'))
        } else {
            this.onEditData();
        }
    }

    /**
     * Render menu option, gender select
     */
    renderMenuOption = () => {
        return (
            <Menu
                style={{
                    marginLeft: Constants.MARGIN_X_LARGE
                }}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {this.genderMenuOptions.map(item => {
                        return (
                            <MenuOption
                                onSelect={() => {
                                    console.log('item: ', item.value)
                                    this.setState({gender: item.value})
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
                                    <Text style={[styles.textMenu]}>{item.name}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    };
}

const mapStateToProps = state => ({
    data: state.userProfile.data,
    action: state.userProfile.action,
    isLoading: state.userProfile.isLoading,
    error: state.userProfile.error,
    errorCode: state.userProfile.errorCode,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileView);
