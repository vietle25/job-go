import React, { Component } from "react";
import {
    BackHandler, ImageBackground, View, StatusBar, DeviceEventManager, Image, ActivityIndicator,
    TouchableOpacity, Dimensions, Platform, Alert, Linking, DeviceEventEmitter, Keyboard,
    PermissionsAndroid, NativeModules, ToastAndroid
} from "react-native";
import {
    Root, Form, Textarea, Container, Header, Title, Left, Icon, Right,
    Button, Body, Content, Text, Card, CardItem,
    Fab, Footer, Input, Item, ActionSheet, Spinner, Tabs, ScrollableTab, Tab,
} from "native-base";
import { CommonActions } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import { Constants } from "values/constants";
import HeaderView from "containers/common/headerView";
import commonStyles from 'styles/commonStyles';
import { Colors } from "values/colors";
import { ErrorCode } from "config/errorCode";
import { localizes } from "locales/i18n";
import StorageUtil from "utils/storageUtil";
import auth from '@react-native-firebase/auth';
import messing from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import DateUtil from "utils/dateUtil";
import Utils from 'utils/utils'
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import statusType from "enum/statusType";
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import StringUtil from "utils/stringUtil";
import { async } from "rxjs/internal/scheduler/async";
import { Fonts } from "values/fonts";
import imageRatio from "enum/imageRatio";
import userType from 'enum/userType';
import MapCustomView from "containers/map/mapCustomView";
import appType from "enum/appType";
import staffType from "enum/staffType";
import { configConstants } from "values/configConstants";
import LinearGradient from "react-native-linear-gradient";
import notificationType from "enum/notificationType";
import roleType from "enum/roleType";
import screenType from "enum/screenType";

const screen = Dimensions.get("window");

const resetAction = CommonActions.reset({
    index: 0,
    routes: [{ name: "Main" }]
});

const resetActionLogin = CommonActions.reset({
    index: 0,
    routes: [{ name: 'Login', params: { logOuted: true } }],
});

const CHANNEL_ID = 'aaChannelId'
const CHANNEL_NAME = 'Thông báo chung'

/**
 * Base view class
 */
class BaseView extends Component {

    constructor(props) {
        super(props);
        this.className = this.constructor.name;
        this.onBack = this.onBack.bind(this);
        this.isShowMessageBack = true;
        this.resourceUrlPath = {};
        this.resourceUrlPathResize = {};
        this.videos = {};
        this.hotline = {};
        this.isShowCardMember = false;
        this.baseView = this;
        this.userAdmin = null;
        this.maxFileSizeUpload = null;
        this.quantityCart = 0;
        this.uploadCommonImageRestriction = {};
        this.uploadCommonVideoRestriction = {};
        this.uploadReviewImageRestriction = {};
        this.userHasBeenSuspended = false;
        this.userHasBeenDeleted = false;
    }

    goto() {

    }

    render() {
        return (
            <View></View>
        );
    }

    /**
     * Has permission
     */
    hasPermission = async (permissions) => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            permissions
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            permissions
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            console.log("Permission denied by user.");
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log("Permission revoked by user.");
        }

        return false;
    }

    /**
     * Show toast message
     * @param {*} message 
     * @param {*} duration 
     * @param {*} type 
     */
    showMessage(message, duration = 30000, type = 'warning') {
        try {
            if (Platform.OS === 'ios') {
                if (!global.isShowMessageError) {
                    global.isShowMessageError = true;
                    Toast.show(message, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                    });
                }
            } else {
                ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
            }
            setTimeout(() => {
                global.isShowMessageError = false
            }, 5000);
        } catch (e) {
            global.isShowMessageError = false
            console.log(e);
        }
    }

    //Show login view
    showLoginView(route) {
        if (!Utils.isNull(route)) {
            this.props.navigation.push('Login', {
                router: {
                    name: route.routeName,
                    params: route.params
                }
            })
        } else {
            this.props.navigation.navigate('Login')
        }
    }

    /**
     * Open camera roll view
     */
    showCameraRollView = async (params) => {
        const hasPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (hasPermission) this.props.navigation.navigate("CameraRoll", params);
    }

    /**
    * Handle date post
    */
    handleDatePost(posts) {
        this.nextIndex = 0;
        this.nextElement = null;
        for (let index = 0; index < posts.length; index++) {
            const element = posts[index]
            if (index + 1 > posts.length - 1) {
                break;
            } else {
                this.nextIndex = index + 1
            }
            this.nextElement = posts[this.nextIndex];
            if (
                new Date(Number(this.getTimestamp(element.createdAt))).getMonth() + 1 === new Date(Number(this.getTimestamp(this.nextElement.createdAt))).getMonth() + 1
                && new Date(Number(this.getTimestamp(element.createdAt))).getDate() === new Date(Number(this.getTimestamp(this.nextElement.createdAt))).getDate()
                && new Date(Number(this.getTimestamp(element.createdAt))).getFullYear() === new Date(Number(this.getTimestamp(this.nextElement.createdAt))).getFullYear()
            ) {
                this.nextElement.isShowDate = false;
            }
        }
    }

    //Save exception
    saveException(error, func) {
        let filter = {
            className: this.props.route ? this.props.route.name : this.className,
            exception: error.message + " in " + func,
            osVersion: DeviceInfo.getSystemVersion(),
            appVersion: VersionNumber.appVersion
        }
        // console.log(filter)
        this.props.saveException(filter)
    }

    componentWillMount() {
        // console.log("I am Base View", this.props);
        Dimensions.addEventListener('change', this.onChangedOrientation);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onChangedOrientation)
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
        if (this.messageListener != undefined) {
            this.messageListener();
        }
        if (this.notificationListener != undefined) {
            this.notificationListener();
        }
        if (this.notificationOpenedListener != undefined) {
            this.notificationOpenedListener();
        }
        if (this.notificationDisplayedListener != undefined) {
            this.notificationDisplayedListener();
        }
    }

    onChangedOrientation = (e) => {

    }

    /**
     * Sign out GG
     */
    signOutGG = async (data) => {
        try {
            if (!Utils.isNull(data)) {
                await GoogleSignin.signOut();
            }
        } catch (error) {
            this.saveException(error, "signOutGG")
        }
    };

    /**
     * Sign out FB
     */
    signOutFB = async (data) => {
        if (!Utils.isNull(data)) {
            LoginManager.logOut()
        }
    };

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        console.log(this.className, 'back pressed')
        if (this.props.navigation) {
            this.onBack()
            return true
        } else {
            return false
        }
        return true
    }

    /**
     * Back pressed
     * True: not able go back
     * False: go back
     */
    onBackPressed() {
        return false
    }

    /**
    * On back
    */
    onBack() {
        if (this.props.navigation.goBack) {
            setTimeout(() => {
                this.props.navigation.goBack()
            })
        }
    }

    /**
     * Go to home screen
     */
    goHomeScreen() {
        this.props.navigation.dispatch(resetAction)
    }

    /**
     * Go to login screen
     */
    goLoginScreen() {
        this.props.navigation.dispatch(resetActionLogin)
    }

    /**
     * Show cart
     */
    showCart = () => {
        this.props.navigation.navigate("Cart")
    }

    /**
     * go to Notification
     */
    gotoNotification = () => {
        this.props.navigation.navigate("NotificationHome")
    }

    /**
     * Go home
     */
    goHome = () => {
        this.props.navigation.navigate("Main")
    }

    /**
     * Render header view
     * default: visibleBack = true
     * onBack, stageSize, initialIndex
     *
     * @param {*} props 
     */
    renderHeaderView(props = {}) {
        const defaultProps = {
            visibleBack: true,
            onBack: this.onBack,
            shadowOffset: { height: 6, width: 3 },
            shadowOpacity: 0.25,
            elevation: Constants.SHADOW,
        }
        const newProps = { ...defaultProps, ...props }
        return <HeaderView {...newProps} />
    }

    /**
     * Render map view
     *
     * @param {*} props 
     */
    renderMapView(props = {}) {
        const defaultProps = {
            visibleMakerMyLocation: true,
            visibleLoadingBar: true,
            visibleButtonLocation: true
        }
        const newProps = { ...defaultProps, ...props }
        return <MapCustomView onRef={(ref) => { this.map = ref }} {...newProps} />
    }

    /**
 * Common button have 100% width with opacity when clicked
 * @param {} title 
 * @param {} titleStyle 
 * @param {} buttonStyle
 */
    renderCommonButton(title = '', titleStyle = {}, buttonStyle = {}, onPress = null, backgroundColors = [], disableButton, icon, viewStyle = {}) {
        let onPressItem = onPress ? onPress : this.onPressCommonButton.bind(this)
        return (
            <LinearGradient
                colors={!Utils.isNull(backgroundColors) ? backgroundColors : [Colors.COLOR_PRIMARY, Colors.COLOR_PRIMARY]}
                style={[commonStyles.buttonStyle, buttonStyle]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <TouchableOpacity
                    style={commonStyles.viewCenter}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    disabled={disableButton}
                    onPress={onPress}>
                    <View style={[commonStyles.viewHorizontal, { flex: 0 }]}>
                        {!Utils.isNull(icon) ? <Image source={icon} style={{}} /> : null}
                        <Text style={[commonStyles.text, {
                            marginHorizontal: Constants.MARGIN_X_LARGE
                        }, titleStyle]}>
                            {title}
                        </Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        )
    }

    onPressCommonButton() {
    }

    /**
     * Go next screen
     * @param {*} className 
     * @param {*} params 
     * @param {*} isNavigate 
     */
    goNextScreen(className, params = this.props.route.params, isNavigate = true) {
        if (isNavigate)
            this.props.navigation.navigate(className, params)
        else
            this.props.navigation.push(className, params)
    }


    /**
     * get new notification
     */
    countNewNotification = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (this.props.countNewNotification && !Utils.isNull(user) && user.status == statusType.ACTIVE) {
                this.props.countNewNotification()
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    /**
     * Logout
     */
    logout = async () => {
        console.log("ON LOGOUT IN BASE VIEW");
        await StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
        await StorageUtil.storeItem(StorageUtil.USER_PROFILE, null)
        await StorageUtil.deleteItem(StorageUtil.USER_TOKEN)
        await StorageUtil.storeItem(StorageUtil.USER_TOKEN, null)
        await StorageUtil.deleteItem(StorageUtil.FIREBASE_TOKEN)
        await StorageUtil.deleteItem(StorageUtil.FCM_TOKEN)
        await StorageUtil.storeItem(StorageUtil.FIREBASE_TOKEN, null)
        await StorageUtil.storeItem(StorageUtil.FCM_TOKEN, null)
        await StorageUtil.deleteItem(StorageUtil.LIST_CHAT)
        await StorageUtil.storeItem(StorageUtil.LIST_CHAT, null)
        global.token = ""
        global.firebaseToken = ""
        global.badgeCount = 0
        this.signOutFB();
        this.signOutGG();
    }

    /**
     * Authentication firebase
     */
    signInWithCustomToken = async (userId) => {
        let firebaseToken = await StorageUtil.retrieveItem(StorageUtil.FIREBASE_TOKEN);
        console.log("FIREBASE TOKEN: ", firebaseToken)
        if (!Utils.isNull(firebaseToken) & !Utils.isNull(userId)) {
            if (Platform.OS === "android") {
                auth().signInWithCustomToken(firebaseToken).catch(function (error) {
                    console.warn("Error auth: " + error.code + " - " + error.message);
                });
            } else {
                var view = NativeModules.AppDelegate
                view.loginAuthenFirebase(firebaseToken)
            }
        }
    }

    /**
     * put info of user to firebase
     * @param {*} userId 
     * @param {*} userName 
     * @param {*} avatarPath 
     */
    putUserInfoToFirebase(userId, userName, avatarPath) {
        database().ref(`/users`)
        .child(userId)
        .set({
            name: userName,
            avatar: avatarPath,
            isOnline: true
        });
    }

    /**
     * Handle error
     * @param {} errorCode 
     */
    handleError(errorCode, error, action = null) {
        switch (errorCode) {
            case ErrorCode.ERROR_COMMON:
                this.showMessage(action == null ? localizes("error_in_process") : action + "  " + localizes("error_in_process"))
                break
            case ErrorCode.NO_CONNECTION:
                NetInfo.isConnected.fetch().done(
                    (isConnected) => {
                        if (isConnected) {
                            this.showMessage(localizes("error_connect_to_server"))
                        } else {
                            this.showMessage(localizes("error_network"))
                        }
                    })
                break
            case ErrorCode.UN_AUTHORIZE:
            case ErrorCode.USER_HAS_BEEN_DELETED:
                if (!this.userHasBeenDeleted) {
                    this.userHasBeenDeleted = true;
                    this.showMessage(localizes("userHasBeenDeleted"));
                    this.logout();
                    this.props.navigation.navigate('Login');
                    let timeOut2;
                    timeOut2 = setTimeout(() => {
                        this.userHasBeenDeleted = false;
                        clearTimeout(timeOut2);
                    }, 3000);
                }
                break;
            case ErrorCode.USER_HAS_BEEN_SUSPENDED:
                if (!this.userHasBeenSuspended) {
                    this.userHasBeenSuspended = true;
                    this.showMessage(localizes("userHasBeenSuspended"));
                    this.logout();
                    this.props.navigation.navigate('Login');
                    console.log(`====== SUSPENDED ====`);
                    let timeOut;
                    timeOut = setTimeout(() => {
                        this.userHasBeenSuspended = false;
                        clearTimeout(timeOut);
                    }, 3000);
                }
                break;
            case ErrorCode.AUTHENTICATE_REQUIRED:
                if (this.userHasBeenSuspended || this.userHasBeenDeleted) break;
                this.logout();
                if (!global.isShowMessageError) {
                    global.isShowMessageError = true;
                    Alert.alert(
                        localizes('notification'),
                        localizes('baseView.authenticateRequired'),
                        [
                            {
                                text: 'OK', onPress: () => {
                                    global.isShowMessageError = false;
                                    this.props.navigation.navigate('Login');
                                }
                            }
                        ],
                        { cancelable: false },
                    );
                }
                break

            default:
        }
    }

    /**
     * Handle connection change
     */
    handleConnectionChange = (isConnected) => {
        console.log(`is connected: ${isConnected}`)
    }

    /**
     * Open screen call
     * @param {*} phone 
     */
    renderCall(phone) {
        let url = `tel:${phone}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err =>
            this.saveException(err, "renderCall")
        );
    }

    /**
     * Show loading bar
     * @param {*} isShow 
     */
    showLoadingBar(isShow) {
        return isShow ? <Spinner style={{ position: 'absolute', top: (screen.height - 100) / 2, left: 0, right: 0, zIndex: 1000 }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    }

    /**
     * Get source url path
     */
    getSourceUrlPath = () => {
        StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG).then((faq) => {
            if (!Utils.isNull(faq)) {
                // console.log('faq', faq)
                this.resourceUrlPath = faq.find(x => x.name == 'resource_url_path') || {}
                // console.log('resource_url_path', this.resourceUrlPath)
                this.resourceUrlPathResize = faq.find(x => x.name == 'resource_url_path_resize') || {}
                // console.log('resource_url_path_resize', this.resourceUrlPathResize)
                this.hotline = faq.find(x => x.name == 'hotline') || {}
                // console.log('hotline', this.hotline)
                this.userAdmin = faq.find(x => x.name == 'user_admin_id') || {}
                // console.log('userAdmin', this.userAdmin)
                this.maxFileSizeUpload = faq.find(x => x.name == 'max_file_size_upload') || {}
                // console.log('maxFileSizeUpload', this.maxFileSizeUpload)
                this.faq = faq.find(x => x.name == 'wallet.fqa') || {}
                // console.log('FAQ', this.faq)
            }
        }).catch((error) => {
            this.saveException(error, "getSourceUrlPath")
        });
    }


    /**
     * Get upload restriction
     */
    getUploadRestriction = () => {
        StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG).then((faq) => {
            if (!Utils.isNull(faq)) {
                // console.log('faq', faq)
                this.uploadCommonImageRestriction = faq.find(x => x.name == 'upload.common.image.restriction')
                // console.log('upload.common.image.restriction', this.uploadCommonImageRestriction)
                this.uploadCommonVideoRestriction = faq.find(x => x.name == 'upload.common.video.restriction')
                // console.log('upload.common.video.restriction', this.uploadCommonVideoRestriction)
                this.uploadReviewImageRestriction = faq.find(x => x.name == 'upload.review.image.restriction')
                // console.log('upload.review.image.restriction', this.uploadReviewImageRestriction)
            }
        }).catch((error) => {
            this.saveException(error, "getUploadRestriction")
        });
    }

    /**
     * Get cart
     */
    getCart() {
        StorageUtil.retrieveItem(StorageUtil.CART).then((carts) => {
            if (!Utils.isNull(carts)) {
                this.quantityCart = carts.products.reduce(this.totalQuantity, 0);
                this.props.getAllCart({
                    products: carts.products,
                    quantity: this.quantityCart
                });
            } else {
                this.quantityCart = 0;
                this.props.getAllCart({
                    products: [],
                    quantity: 0
                });
            }
        }).catch((error) => {
            this.saveException(error, 'getCart');
        })
    }

    /** 
     * count friend request
     */
    countFriendRequest = () => {
        this.props.countFriendRequests();
    }

    /**
     * size banner
     * @param {*} ratio 
     */
    sizeBanner(ratio) {
        let ratioNumber = 1
        if (ratio == imageRatio.RATIO_16_9) {
            ratioNumber = 9 / 16
        } else if (ratio == imageRatio.RATIO_4_3) {
            ratioNumber = 3 / 4
        } else if (ratio == imageRatio.RATIO_3_2) {
            ratioNumber = 2 / 3
        } else if (ratio == imageRatio.RATIO_9_16) {
            ratioNumber = 16 / 9
        } else if (ratio == imageRatio.RATIO_3_4) {
            ratioNumber = 4 / 3
        } else if (ratio == imageRatio.RATIO_2_3) {
            ratioNumber = 3 / 2
        }
        return ratioNumber
    }

    /**
     * Total quantity
     * @param {*} accumulator 
     * @param {*} item 
     */
    totalQuantity(accumulator, item) {
        return accumulator + item.quantity
    }

    /**
     * Total price
     * @param {*} accumulator 
     * @param {*} item 
     */
    totalPrice(accumulator, item) {
        return accumulator + (item.price * item.quantity)
    }

    async componentDidMount() {
        this.checkPermission();
        this.getSourceUrlPath();
        this.getUserToken()
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }


    getUserToken = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_TOKEN).then((token) => {
            global.token = token;
            console.log("USER TOKEN IN BASE VIEW: ", token);
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
            this.props.getConfig();
        })
    }

    /**
     * check permission
     */
    async checkPermission() {
        const enabled = await messing().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    /**
     * request permission
     */
    async requestPermission() {
        try {
            await messing().requestPermission();
            this.getToken();
        } catch (error) {
        }
    }

    /** 
     * get token
     */
    async getToken() {
        let fcmToken = await StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN);
        console.log("GET TOKEN IN BASE VIEW: ", fcmToken);
        if (!Utils.isNull(fcmToken)) {
            let fcmTokenNew = await messing().getToken();
            if (!Utils.isNull(fcmTokenNew) && fcmToken !== fcmTokenNew) {
                await StorageUtil.storeItem(StorageUtil.FCM_TOKEN, fcmTokenNew);
                this.refreshToken();
            } else if (!global.isSendTokenDevice) {
                this.refreshToken();
            }
        } else {
            fcmToken = await messing().getToken();
            if (fcmToken) {
                StorageUtil.storeItem(StorageUtil.FCM_TOKEN, fcmToken);
                this.refreshToken();
            }
        }
        messing().onTokenRefresh((token) => {
            StorageUtil.storeItem(StorageUtil.FCM_TOKEN, token);
            this.refreshToken()
        });
    }

    /**
     * Refresh token
     */
    refreshToken = () => {
        StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
            console.log('refresh token in base view:1 ', token)
            if (this.props.postUserDeviceInfo && !Utils.isNull(token)) {
                console.log('refresh token in base view: 2', token)
                StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
                    console.log('refresh token in base view: 3', user)
                    if (!Utils.isNull(user) && user.status == statusType.ACTIVE) {
                        // const deviceId = DeviceInfo.getDeviceId();
                        let filter = {
                            deviceId: DeviceInfo.getUniqueId(),
                            deviceToken: token
                        }
                        this.props.postUserDeviceInfo(filter)
                        if (global.registerSuccess) {
                            global.registerSuccess = false
                            // setTimeout(() => {
                            //     this.props.pushNotification({
                            //         title: "Đăng ký tài khoản thành công",
                            //         content: "Đăng ký tài khoản thành công, bắt đầu tìm việc hoặc đăng tin tuyển dụng ngay nhé",
                            //         type: notificationType.COMMON_NOTIFICATION,
                            //         meta: null,
                            //         token: token,
                            //         userId: user.id
                            //     })
                            // }, 3000)
                        }
                    }
                }).catch((error) => {
                    //this callback is executed when your Promise is rejected
                    console.log('Promise is rejected with error roles: ' + error);
                });
            } else {
                console.log('token null')
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
        });
    }

    // 3.
    /**
     * Go to notification
     * @param {*} className 
     * @param {*} params 
     * @param {*} isNavigate 
     */
    goToScreen(data) {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user) && user.status == statusType.ACTIVE) {
                this.filterNotificationIsSeen = {
                    notificationIds: []
                };
                if (this.props.navigation) {
                    let type = parseInt(StringUtil.getNumberInString(data.type));
                    if (!Utils.isNull(data.data)) {
                        var obj = JSON.parse(Utils.cloneObject(data.data));
                        if (obj.notificationId != null) {
                            var notificationId = obj.notificationId;
                        }
                    }
                }
            }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error roles: ' + error);
        });
    }

    // 1.
    /**
     * Create notification listener
     */
    createNotificationListeners = async () => {
        this.messageListener = messing().subscribeToTopic("all");
        this.messageListener = messing().onMessage((message) => {
            console.log('Notification message ' + JSON.stringify(message));
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true
            })
                .setNotificationId(notification._notificationId)
                .setTitle(notification._title)
                .setSubtitle(notification._subtitle)
                .setBody(notification._body)
                .setData(notification._data)
                .android.setPriority(firebase.notifications.Android.Priority.High)
                .android.setBigText(notification._body)
            if (Platform.OS === 'android' && localNotification.android.channelId == null) {
                const channel = new firebase.notifications.Android.Channel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    firebase.notifications.Android.Importance.Max
                ).setDescription('In stock channel');
                // Create the channel
                firebase.notifications().android.createChannel(channel);
                localNotification.android.setChannelId(channel.channelId);
            }
            // try {
            //     await firebase.notifications().displayNotification(localNotification);
            //     notification.android.setAutoCancel(true)
            //     if (!global.logout) {
            //         this.countNewNotification()
            //     }
            // } catch (e) {
            //     console.log('catch', e)
            // }
        });
        messing().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage.notification);
            // messing().removeAllDeliveredNotifications()
            if (!global.logout) {
                this.countNewNotification()
            }
            // this.goToScreen(notificationOpen.notification._data);
        });
        messing()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:', remoteMessage.notification,);
                    // setInitialRoute(remoteMessage.data.type); 
                }
            });

    }

    /**
     * Custom item product cart
     * @param {*} product 
     */
    customItemProductCart(product, numOfProduct = 1) {
        let id = product.id;
        let name = product.title;
        let price = !Utils.isNull(product.price) ? product.price : 0;
        let quantity = numOfProduct;
        let resourcePaths = product.resources;
        let poster = product.poster;
        let isShowPoster = true;
        let length = 1;
        let isCheck = true;
        return { id, name, price, quantity, resourcePaths, poster, isShowPoster, length, isCheck };
    }

    /**
     * Register keyboard event
     */
    registerKeyboardEvent() {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
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
     * Validate name
     */
    validateName = (name = '') => {
        let result = false;
        if (Utils.isNull(name) || name.length == 0) {
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (StringUtil.validSpecialCharacter(name) ||
            StringUtil.validEmojiIcon(name)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (StringUtil.validSpecialCharacter2(name)) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (name.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
        } else {
            result = true;
        }
        return result;
    }

    /**
     * Validate phone
     */
    validatePhone = (phone = '') => {
        let result = false;
        const res = phone.charAt(0);
        if (Utils.isNull(phone)) {
            this.showMessage(localizes('register.vali_fill_phone'));
        }

        // ======= PHONE ======= 
        // không ký tự đặc biệt 
        else if (phone.includes(" ") && phone.trim() == '') {
            this.showMessage(localizes('register.vali_fill_phone'));
        }
        else if (Utils.validatePhoneContainSpecialCharacter(phone.trim()) ||
            Utils.validatePhoneContainWord(phone.trim())) {
            this.showMessage(localizes('register.errorPhone'));
        } else if (phone.trim().includes(" ")) {
            this.showMessage(localizes('register.errorPhone'));
        }

        else if (phone.length != 10 || res != '0') {
            this.showMessage(localizes('register.errorPhone'));
        }
        else if (!Utils.validatePhone(phone)) {
            this.showMessage(localizes('register.vali_phone'));
        } else {
            result = true;
        }
        return result;
    }

    /**
     * Validate address
     */
    validateAddress = (address = '') => {
        let result = false;
        if (Utils.isNull(address)) {
            this.showMessage(localizes('register.vali_fill_address'));
        } else if (address.length > 250) {
            this.showMessage(localizes('createStoreView.vali_address_length'));
        } else {
            result = true;
        }
        return result;
    }
}

export default BaseView;
