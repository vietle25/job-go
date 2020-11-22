import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar, Image, TouchableOpacity,
    Alert, WebView, Linking, StyleSheet, RefreshControl,
    TextInput, Dimensions, ScrollView, Keyboard, Platform, ActivityIndicator,
    FlatList, NetInfo, BackHandler, Modal, PanResponder,
    PermissionsAndroid
} from "react-native";
import {
    Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text,
    Card, CardItem, Item, Input, Toast, Root, Col, Form, Spinner
} from "native-base";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import Utils from 'utils/utils';
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import DateUtil from "utils/dateUtil";
import styles from "./styles";
import I18n, { localizes } from "locales/i18n";
import { Fonts } from "values/fonts";
import FlatListCustom from 'components/flatListCustom';
import StringUtil from "utils/stringUtil";
import { filter } from "rxjs/operators";
import moment from 'moment';
import ic_camera_grey from 'images/ic_camera_grey.png';
import ic_back_black from 'images/ic_back_white.png';
import ic_animated_sticker_black from 'images/ic_cancel_blue.png';
import StorageUtil from 'utils/storageUtil';
import { CalendarScreen } from "components/calendarScreen";
import statusType from "enum/statusType";
import ItemChat from "./ItemChat";
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import ServerPath from "config/Server";
import Upload from 'react-native-background-upload'
import conversationStatus from "enum/conversationStatus";
import ModalImageViewer from 'containers/common/modalImageViewer';
import messageType from "enum/messageType";
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_close_circle_gray from 'images/ic_close_circle_gray.png';
import FastImage from "react-native-fast-image";
import RNFetchBlob from "rn-fetch-blob";
import ImageSize from 'react-native-image-size'
import ic_send_blue from 'images/ic_send_blue.png';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const MAX_IMAGE = 10;

const STICKER_IMAGE_WIDTH = 100;
const STICKER_IMAGE_HEIGHT = 100;
const STICKER_MODAL_WIDTH = 150;
const STICKER_MODAL_HEIGHT = 150;
class ChatView extends BaseView {

    constructor(props) {
        super(props)
        const { route, navigation } = this.props;
        this.state = {
            messageText: null,
            messages: [],
            images: [],
            isShowLoading: true,
            userId: null,
            onEndReachedCalledDuringMomentum: true,
            keyboardHeight: 0,
            isLoadImage: false,
            typeMessage: messageType.NORMAL_MESSAGE,
            enableLoadMore: false,
            isShowEmoji: false,
            isShowSticker: false,
            isShowGifPicker: false,
            isShowModalSticker: false,
            selectedStickerSource: null, // use for long press => show modal sticker ,
            isExpandTextInput: false,
            nodata: false
        }
        this.callback = route.params.callback;
        this.onceQuery = Constants.PAGE_SIZE;
        this.isScrollEnd = true;
        this.isSending = false;
        this.isLoadingMore = false;
        this.userMember = route.params.userMember;
        this.conversationId = route.params.conversationId;
        this.userMemberId = !Utils.isNull(this.userMember) ? this.userMember.id : "";
        this.userMemberName = !Utils.isNull(this.userMember) ? this.userMember.name : "";
        this.avatar = !Utils.isNull(this.userMember) ? this.userMember.avatarPath : "";
        this.userId = route.params.me;
        this.imagesMessage = [];
        this.indexImagesMessage = 0;
        this.objectImages = '';
        this.actionValue = {
            WAITING_FOR_USER_ACTION: 0,
            ACCEPTED: 1,
            DENIED: 2
        };
        this.onceScrollToEnd = true;
        this.otherUserIdsInConversation = [];
        this.deleted = false;
        this.messageDraft = {
            fromUserId: "",
            message: "",
            timestamp: "",
            isShowDate: "",
            messageType: "",
            receiverResourceAction: 0
        };
        this.firebaseRef = firebase.database();
        this.listSendImages = [];
        this.isDisableBtn = false;
        this.firstMessageType = messageType.NORMAL_MESSAGE;
        this.modalSticker_X = width / 2 - STICKER_MODAL_WIDTH / 2;
        this.modalSticker_Y = height / 2 - STICKER_MODAL_HEIGHT / 2;
        this.uploadStickerSource = null;
        this.increasedUnseen = false;
    }

    /** 
     * request permission write file 
     */
    requestPermission = () => {
        let granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Yêu cầu quyền truy cập Camera',
                message:
                    'Work fast cần quyền truy cập Camera ' +
                    'để có thể thực hiện đọc file và truyền file qua Chat',
                // buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Huỷ',
                buttonPositive: 'Đồng Ý',
            },
        );
    }

    /**
    * Handle unseen
    */
    handleUnseen = () => {
        let countUnseen = 0;
        if (!Utils.isNull(this.conversationId)) {
            this.firebaseRef.ref(`members/c${this.conversationId}/u${this.state.userId}/number_of_unseen_messages`)
                .transaction(function (value) {
                    countUnseen = value;
                    return 0;
                });
            this.firebaseRef.ref(`chats_by_user/u${this.state.userId}/number_of_unseen_messages`)
                .transaction(function (value) {
                    return value - countUnseen;
                });
        }
    }

    /**
     * Follow status deleted conversation
     */
    watchDeletedConversation() {
        if (!Utils.isNull(this.conversationId)) {
            this.deletedConversation = this.firebaseRef.ref(`conversation/c${this.conversationId}/deleted`)
            this.deletedConversation.on('value', (memberSnap) => {
                return this.deleted = memberSnap.val()
            })
        }
        return this.deleted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentDidMount = async () => {
        // let requestPermission = setTimeout(() => {
        //     this.requestPermission();
        //     clearTimeout(requestPermission);
        // }, 500);
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        global.atMessageScreen = true;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        if (this.conversationId != null) {
            this.readFirebaseDatabase(false)
            this.readMessage()
        } else {
            this.props.checkExistConversation({
                userMemberChatId: this.userMemberId
            })
        }
    }

    /**
     * handle back button
     */
    handlerBackButton = () => {
        if (this.props.navigation) {
            if (this.state.isShowEmoji || this.state.isShowSticker || this.state.isShowGifPicker) {
                this.setState({
                    isShowEmoji: false,
                    isShowSticker: false,
                    isShowGifPicker: false
                })
            }
            global.atMessageScreen = false;
            this.onBack()
        } else {
            return false
        }
        return true
    }

    /**
     * Get all member in this conversation current
     */
    getOtherUserIdsInConversation() {
        this.firebaseRef.ref(`conversation/c${this.conversationId}`).once('value', (snapshot) => {
            if (!Utils.isNull(snapshot.val())) {
                this.otherUserIdsInConversation = []
                snapshot.forEach(element => {
                    if (parseInt(StringUtil.getNumberInString(element.key)) != this.userInfo.id) {
                        this.otherUserIdsInConversation.push(parseInt(StringUtil.getNumberInString(element.key)))
                    }
                });
            }
        })
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
     * Keyboard did show
     */
    keyboardDidShow() {
        this.isScrollEnd = true;
        this.scrollToEnd();
    }

    /**
     * scroll to end flatlist
     */
    scrollToEnd() {
        if (this.isScrollEnd) {
            !Utils.isNull(this.flatListRef) ? this.flatListRef.scrollToOffset({
                offset: 0,
                animated: true
            }) : null;
            // this.handleUnseen();
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        this.readMessage()
        if (!Utils.isNull(this.realTimeMessages)) {
            this.realTimeMessages.off()
        }
        this.keyboardDidShowListener.remove();
    }

    readMessage = () => {
        this.firebaseRef.ref(`chats_by_user/u${this.userId}/_conversation/c${this.conversationId}/number_unseen`).transaction(function (value) {
            return 0;
        });
    }

    /**
     * Get all messages
     * @param {*} isLoadMore ~ true: load more is active
     */
    readFirebaseDatabase = async (isLoadMore) => {
        if (isLoadMore) {
            this.isLoadingMore = true
            this.onceQuery += this.onceQuery
            this.isScrollEnd = false
        }
        try {
            this.firebaseRef.ref(`messages_by_conversation/c${this.conversationId}`)
                .limitToLast(this.onceQuery)
                .on('value', (messageSnap) => {
                    let messages = [];
                    console.log("messagesSnap: ", messageSnap.val());
                    if (!Utils.isNull(messageSnap.val())) {
                        let lengthMessage = messageSnap._childKeys.length;
                        this.state.enableLoadMore = lengthMessage > this.state.messages.length && lengthMessage >= Constants.PAGE_SIZE && lengthMessage % Constants.PAGE_SIZE == 0;
                        messageSnap.forEach(itemMessage => {
                            let item = {
                                "conversationId": this.conversationId,
                                "key": itemMessage.key,
                                "fromUserId": itemMessage.toJSON().from_user_id,
                                "message": itemMessage.toJSON().content,
                                "receiverSeen": itemMessage.toJSON().receiver_seen,
                                "timestamp": itemMessage.toJSON().timestamp,
                                "isShowAvatar": true,
                                "isShowDate": true,
                                "avatar": this.avatar,
                                "messageType": itemMessage.toJSON().message_type,
                                "receiverResourceAction": itemMessage.toJSON().receiver_resource_action
                            }
                            messages.push(item)
                        });
                    }
                    this.nextIndex = 0
                    this.nextElement = null
                    for (let index = 0; index < messages.length; index++) {
                        const element = messages[index]
                        if (index + 1 > messages.length - 1) {
                            break
                        } else {
                            this.nextIndex = index + 1
                        }
                        this.nextElement = messages[this.nextIndex]
                        if (element.fromUserId !== this.userId) {
                            if (element.fromUserId === this.nextElement.fromUserId) {
                                !Utils.isNull(element.isShowAvatar) ? element.isShowAvatar = false : null
                            }
                        }
                        if (
                            new Date(Number(element.timestamp)).getMonth() + 1 === new Date(Number(this.nextElement.timestamp)).getMonth() + 1
                            && new Date(Number(element.timestamp)).getDate() === new Date(Number(this.nextElement.timestamp)).getDate()
                        ) {
                            this.nextElement.isShowDate = false
                        }
                    }
                    this.setState({
                        messages: messages.reverse(),
                        isShowLoading: false,
                    }, () => {
                        this.scrollToEnd()
                    });
                });
        } catch (error) {
            this.saveException(error, 'readFirebaseDatabase')
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data
        this.readMessage()
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.CREATE_CONVERSATION)) {
                    console.log("DATA CREATE CONVERSATION", data)
                    if (!Utils.isNull(data)) {
                        if (!Utils.isNull(data.conversationId)) {
                            this.conversationId = data.conversationId;
                            this.otherUserIdsInConversation = [this.state.userId, this.userMemberId];
                            let filter = {
                                conversationId: this.conversationId,
                                content: this.state.messageText,
                                typeMessage: this.state.typeMessage,
                                userMemberChatId: this.state.userId
                            }
                            this.setState({ messageText: null });
                            // if (this.firstMessageType == messageType.IMAGE_MESSAGE) {
                            //     if (!Utils.isNull(this.uploadStickerSource))
                            //         this.uploadImageStepByStep(true);
                            //     else this.uploadImageStepByStep(false);
                            // } else {
                            //     this.props.pushMessageNotification(filter);
                            // }
                            this.readFirebaseDatabase();
                            this.state.nodata = false
                        }
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.CHECK_EXIST_CONVERSATION)) {
                    if (data != null) {
                        this.conversationId = data;
                        this.readFirebaseDatabase();
                        // this.handleUnseen();
                    } else {
                        this.state.isShowLoading = false
                        this.state.nodata = true
                    }
                }
                this.state.isShowLoading = false
            } else {
                this.handleError(this.props.errorCode, this.props.error, this.props.action)
            }
        }
    }

    /**
     * Render item
     * @param {*} item 
     * @param {*} index 
     * @param {*} parentIndex 
     * @param {*} indexInParent 
     */
    renderItemChat(item, index, parentIndex, indexInParent) {
        let resourceUrlPath = !Utils.isNull(this.resourceUrlPathResize) ? this.resourceUrlPathResize.textValue : null
        let resource = !Utils.isNull(this.resourceUrlPath) ? this.resourceUrlPath.textValue : null
        return (
            <ItemChat
                key={index.toString()}
                data={item}
                index={index}
                userId={this.userId}
                roomId={this.roomId}
                userAdminId={1}
                onPressSendAction={(actionValue, conversationId, keyMessage) => {
                    this.firebaseRef.ref().update({
                        [`messages_by_conversation/c${conversationId}/${keyMessage}/receiver_resource_action`]: this.receiverResourceAction(actionValue)
                    }).then(() => {
                        this.isScrollEnd = false
                        this.readFirebaseDatabase();
                    });
                }}
                resource={resource}
                resourceUrlPath={resourceUrlPath}
                onPressImage={this.onPressImage}
            />
        )
    }

    /** 
     * handle text for custom emoji 
     * @param text 
     */
    handleTextForCustomEmoji = text => {
        text = text.replace(':)', ':smiley:');
        text = text.replace(':(', ' :disappointed:');
        return text;
    }

    /**
     * On press image
     */
    onPressImage = (images, index) => {
        this.refs.modalImageViewer.showModal(images, index)
    }

    /**
     * Receiver resource action
     * @param {*} actionValue 
     */
    receiverResourceAction(actionValue) {
        if (actionValue == this.actionValue.DENIED) { // DENIED
            return this.actionValue.DENIED
        } else if (actionValue == this.actionValue.ACCEPTED) {
            return this.actionValue.ACCEPTED
        }
    }

    /** 
     * on press send
     * @param isUploadStickerOrGif  
     */
    onPressSend = (isUploadStickerOrGif = false) => {
        if (this.listSendImages.length > 0 || isUploadStickerOrGif) {
            this.isDisableBtn = true;
            if (this.conversationId != null) {
                this.uploadImageStepByStep(isUploadStickerOrGif);
            } else {
                this.firstMessageType = messageType.IMAGE_MESSAGE;
                this.props.createConversation({
                    userMemberChatId: this.userMemberId,
                    typeMessage: 2,
                    content: null
                })
            }
        } else {
            !this.props.isLoading
                && !Utils.isNull(this.state.messageText)
                && this.state.messageText.trim() !== ""
                ? this.onPressSendMessages() : this.setState({ messageText: null })
        }
    }

    /**
     * Send message
     * @param {*} contentMessages 
     * @param {*} contentImages // when send image. contentImages = 'path 1, path 2, ...'
     */
    onPressSendMessages = async (contentMessages, contentImages) => {
        let timestamp = DateUtil.getTimestamp();
        let typeMessage = messageType.NORMAL_MESSAGE;
        if (!Utils.isNull(contentMessages) || !Utils.isNull(this.state.messageText) || !Utils.isNull(contentImages)) {
            let content = ""
            if (!Utils.isNull(contentMessages)) {
                content = contentMessages
            } else if (!Utils.isNull(this.state.messageText)) {
                content = this.state.messageText.trim();

            } else {
                content = contentImages;
                typeMessage = messageType.IMAGE_MESSAGE;
                this.setState({ typeMessage: typeMessage });
            }

            this.messageDraft = {
                conversationId: this.conversationId,
                fromUserId: this.state.userId,
                message: content,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                isShowAvatar: false,
                isShowDate: false,
                messageType: typeMessage,
                receiverResourceAction: 0,
                sending: 0
            }
            var joined = [...this.state.messages, this.messageDraft];
            this.setState({ messages: joined })
            if (!Utils.isNull(this.conversationId)) {
                if (this.deleted) {
                    this.readFirebaseDatabase();
                } else {
                    try {
                        let member = [this.userId, this.userMemberId];
                        member.forEach(userId => {
                            let updateData = {
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/deleted`]: false,
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/last_updated_at`]: firebase.database.ServerValue.TIMESTAMP,
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/deleted__last_updated_at`]: `1_${timestamp}`,
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/last_messages`]: {
                                    content: content,
                                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                                    message_type: typeMessage
                                },
                                [`chats_by_user/u${userId}/_conversation/c${this.conversationId}/number_unseen`]: userId == this.userId ? 0 : 1
                                // [`chats_by_user/u${userId}/_all_conversation`]: {
                                //     conversation_id: this.conversationId,
                                //     from_user_id: this.state.userId,
                                //     last_updated_at: firebase.database.ServerValue.TIMESTAMP,
                                //     last_messages: {
                                //         content: content,
                                //         timestamp: firebase.database.ServerValue.TIMESTAMP,
                                //         message_type: typeMessage
                                //     }
                                // }
                            };
                            this.firebaseRef.ref().update(updateData);
                        })
                        // this.firebaseRef.ref(`conversation/c${this.conversationId}/u${this.userMemberId}/numberUnseen`).transaction(function (value) {
                        //     return 1;
                        // });
                        // if (!this.increasedUnseen) {
                        //     this.firebaseRef.ref(`chats_by_user/u${this.userMemberId}/number_unseen_conversation`).transaction(function (value) {
                        //         return value + 1;
                        //     });
                        //     this.increasedUnseen = true
                        // }
                        this.firebaseRef.ref().update({
                            [`conversation/c${this.conversationId}/last_messages`]: {
                                content: content,
                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                message_type: typeMessage
                            }
                        })
                        // push new message:
                        let newMessageKey = this.firebaseRef.ref(`messages_by_conversation/c${this.conversationId}`).push().key;
                        this.firebaseRef.ref().update({
                            [`messages_by_conversation/c${this.conversationId}/${newMessageKey}`]: {
                                from_user_id: this.userId,
                                content: content.trim(),
                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                message_type: typeMessage,
                                receiver_seen: true,
                                receiver_resource_action: 0
                            }
                        });
                        let filter = {
                            conversationId: this.conversationId,
                            content: content.trim(),
                            typeMessage: typeMessage,
                            userMemberChatId: this.state.userId
                        };
                        // this.props.pushMessageNotification(filter);
                        // if (!isUploadStickerOrGif) {
                        // this.setState({ messageText: null });
                        // this.listSendImages = [];
                        // } else {
                        // this.uploadStickerSource = null;
                        // }
                        this.isScrollEnd = true;
                        this.setState({
                            messageText: null
                        })
                    } catch (error) {
                        this.saveException(error, 'onPressSendMessages');
                    }
                }
            } else {
                this.props.createConversation({
                    userMemberChatId: this.userMemberId,
                    typeMessage: typeMessage,
                    content: content
                })
            }
        }
        this.isDisableBtn = false;
    }

    /**
     * Format bytes
     * @param {*} bytes 
     * @param {*} decimals 
     */
    formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return console.log(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i])
    }

    /**
     * Handle list image selected
     */
    handleImageSelected = (images) => {
        let count = 0
        let maxSizeUpload = 10240
        this.objectImages = ''
        this.indexImagesMessage = 0
        images.forEach(element => {
            this.formatBytes(element.size);
            if (element.size / this.oneMB > maxSizeUpload) {
                count++
            } else {
                this.listSendImages.push(element.path)
                this.setState({
                    isLoadImage: true
                })
            }
        });
        if (count > 0) {
            this.showMessage("Có " + count + " ảnh lớn hơn " + maxSizeUpload + " MB")
        }
        count = 0
    }

    /**
     * Choose image car
     */
    onChooseImage = () => {
        console.log("Nero Debug: ", this.listSendImages.length);
        if (this.listSendImages.length < MAX_IMAGE) {
            this.showCameraRollView({
                assetType: this.assetType,
                callback: this.handleImageSelected,
                maximum: MAX_IMAGE - this.listSendImages.length
            });
        } else {
            this.showMessage("Số lượng hình ảnh tối đa 10 hình");
        }
    }

    /**
     * on choose emoji
     */
    onChooseEmoji = () => {
        Keyboard.dismiss();
        setTimeout(() => {
            this.setState({
                isShowEmoji: true,
                isShowSticker: false,
                isShowGifPicker: false
            })
        }, 50);
    }

    /**
    * on choose stcker
    */
    onChooseSticker = () => {
        Keyboard.dismiss();
        setTimeout(() => {
            this.setState({
                isShowSticker: true,
                isShowEmoji: false,
                isShowGifPicker: false
            })
        }, 50);
    }

    /**
    * on choose gif
    */
    onChooseGif = () => {
        Keyboard.dismiss();
        setTimeout(() => {
            this.setState({
                isShowSticker: false,
                isShowEmoji: false,
                isShowGifPicker: true
            })
        }, 50);
    }

    /** 
     * on expand text input 
     */
    onExpandTextInput = () => {
        this.setState({
            isExpandTextInput: false
        })
    }

    /**
     * on selected emoji 
     * @param emoji
     */
    onSelectedEmoji = emoji => {
        this.setState({ messageText: this.state.messageText == null ? emoji : this.state.messageText + emoji });
    }

    /**
     * on selected sticker => save sticker from ASSETS folder to STORAGE ( ANDROID )
     * handle with IOS in the future  
     * @param sticker
     */
    onSelectSticker = sticker => {
        let path = sticker.path;
        // ADNDORID 
        if (Platform.OS === 'android') {
            // split to Assets path 
            let fileName = path.split('animatedStickers')[1];
            let filePathUrl = RNFetchBlob.fs.asset(path.replace('/', ''));
            console.log(`File path: ${filePathUrl}`);
            console.log(`File Name: ${fileName}`);
            RNFetchBlob.fs.readFile(filePathUrl, 'base64')
                .then((base64Image) => {
                    var Base64Code = base64Image.split("data:image/png;base64,"); //base64Image is my image base64 string
                    const dirs = RNFetchBlob.fs.dirs;
                    var path2 = dirs.DCIMDir + fileName;
                    RNFetchBlob.fs.writeFile(path2, Base64Code[0], 'base64')
                        .then((res) => {
                            // HANDLE image 
                            console.log("STICKER Path : ", path2);
                            // let count = 0
                            // let maxSizeUpload = 10240
                            // this.objectImages = ''
                            // this.indexImagesMessage = 0
                            // this.listSendImages.push(path2)
                            // // this.setState({
                            // //     isLoadImage: true
                            // // })
                            // count = 0

                            this.uploadStickerSource = path2;
                            this.onPressSend(true);
                        }).catch(e => {
                            console.log(e);
                        });
                })
        }
        // IOS 
        else {

        }

    }

    /** 
     * on selected gif => save .GIF from ASSETS folder to STORAGE ( ANDROID )
     * handle with IOS in the future
     */
    onSelectGif = gif => {
        let path = gif.path;
        // ADNDORID 
        if (Platform.OS === 'android') {
            // split to Assets path 
            console.log(`Path : ${path}`);
            let fileName = path.replace('/gif/', '/');
            console.log(`File Name: ${fileName}`);

            let filePathUrl = RNFetchBlob.fs.asset(path.replace('/', ''));
            console.log(`File path: ${filePathUrl}`);
            RNFetchBlob.fs.readFile(filePathUrl, 'base64')
                .then((base64Image) => {
                    var Base64Code = base64Image.split("data:image/png;base64,"); //base64Image is my image base64 string
                    const dirs = RNFetchBlob.fs.dirs;
                    var path2 = dirs.DCIMDir + fileName;
                    RNFetchBlob.fs.writeFile(path2, Base64Code[0], 'base64')
                        .then((res) => {
                            // HANDLE image 
                            console.log("GIF Path : ", path2);
                            this.uploadStickerSource = path2;
                            this.onPressSend(true);
                        }).catch(e => {
                            console.log(e);
                        });
                })
        }
        // IOS 
        else {

        }
    }

    /**
   * on long press sticker => show modal gif sticker
   * @param sticker
   */
    onLongPressSticker = sticker => {
        this.setState({
            selectedStickerSource: sticker.source,
            isShowModalSticker: true
        })
    }

    /** 
     * on press out sticker => hide modal sticker 
     */
    onPressOutSticker = sticker => {
        if (this.state.isShowModalSticker)
            this.setState({
                selectedStickerSource: null,
                isShowModalSticker: false
            })
    }

    /**
     * on focus text input ( messages ) => hide emoji => show keyboard 
     */
    onFocusTextInput = () => {
        this.setState({
            isShowEmoji: false,
            isShowGifPicker: false,
            isShowSticker: false,
            isExpandTextInput: true
        })
    }

    /**
     * Upload image to server and get return path
     * @param isUploadSticker 
     */
    uploadImageStepByStep(isUploadSticker = false) {
        this.setState({
            isShowLoading: true
        });
        let filePathUrl = '';
        if (isUploadSticker) {
            filePathUrl += this.uploadStickerSource;
        } else {
            filePathUrl = this.listSendImages[this.indexImagesMessage];
            if (Platform.OS == "android") {
                filePathUrl = filePathUrl.replace('file://', '');
            } else {
                filePathUrl = Utils.convertLocalIdentifierIOSToAssetLibrary(filePathUrl, true);
            }
        }

        const options = {
            url: ServerPath.API_URL + `user/conversation/${this.conversationId}/media/upload`,
            path: filePathUrl,
            method: 'POST',
            field: 'file',
            type: 'multipart',
            headers: {
                'Content-Type': 'application/json', // Customize content-type
                'X-APITOKEN': global.token
            }
        }
        this.processUploadImage(options, isUploadSticker);
    }

    /**
     * Process Upload Image
     * @param options 
     */
    processUploadImage(options, isUploadSticker = false) {
        Upload.startUpload(options).then((uploadId) => {
            console.log('Upload started')
            Upload.addListener('progress', uploadId, (data) => {
                console.log(`Progress: ${data.progress}%`)
            })
            Upload.addListener('error', uploadId, (data) => {
                console.log(`Error: ${data.error} %`)
                this.showMessage(localizes('uploadImageError'))
                this.setState({
                    isShowLoading: false
                })
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                console.log(`Cancelled!`)
            })
            Upload.addListener('completed', uploadId, (data) => {
                console.log('Completed!: ', this.indexImagesMessage, " - ", data)
                if (!Utils.isNull(data.responseBody)) {
                    let result = JSON.parse(data.responseBody)
                    let pathImage = result.data
                    if (isUploadSticker) {
                        this.onPressSendMessages('', pathImage)
                        return;
                    } else {
                        this.objectImages += pathImage + (this.indexImagesMessage == this.listSendImages.length - 1 ? '' : ',')
                    }
                }
                if (this.indexImagesMessage < this.listSendImages.length - 1) {
                    this.indexImagesMessage++
                    const timeOut = setTimeout(() => {
                        this.uploadImageStepByStep()
                    }, 200);
                } else {
                    // upload images done!
                    this.listSendImages = []
                    if (!Utils.isNull(this.state.messageText)) {
                        let messageTemp = this.state.messageText;
                        this.setState({
                            messageText: null,
                        }, () => { this.onPressSendMessages("", this.objectImages) });

                        setTimeout(() => { this.onPressSendMessages(messageTemp); }, 1000);
                    } else {
                        this.onPressSendMessages("", this.objectImages)
                    }
                }
            })
        }).catch((err) => {
            this.saveException(err, 'processUploadImage')
        })
    }

    /**
     * Delete image
     */
    deleteImage = (index) => {
        this.listSendImages.splice(index, 1);
        this.setState({
            isLoadImage: true
        })
    }

    /**
     * Render item send image
     */
    renderItemSendImages(item, index, parentIndex, indexInParent) {
        // handle for Animated Sticker in Project file 
        // if (item.toString().includes('/storage')) {
        //     item = `file://${item}`;
        // }
        return (
            <View style={styles.itemImageContainer}>
                <Image
                    key={index}
                    style={{ width: 120, height: 180, borderRadius: Constants.CORNER_RADIUS / 2 }}
                    source={{ uri: item.toString().includes('/storage') ? `file://${item}` : item }}
                />
                <TouchableOpacity
                    disabled={this.isDisableBtn}
                    onPress={() => { this.deleteImage(index) }}
                    style={[styles.btnDeleteImage, { backgroundColor: Colors.COLOR_WHITE }]}>
                    <Image source={ic_close_circle_gray} />
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * render Modal Sticker 
     */
    renderModalSticker = (isShowModalSticker, selectedStickerSource) => {
        if (!isShowModalSticker)
            return null;
        return (
            <View style={{
                position: 'absolute', top: 0, left: 0,
                backgroundColor: "black",
                opacity: 1.0,
                opacity: 0.9,
                width: width,
                height: height
            }}
                pointerEvents="none"
            >
                <View style={{
                    position: 'absolute',
                    left: this.modalSticker_X,
                    top: this.modalSticker_Y,
                    alignItems: 'center',
                    justifyContent: "center",
                    backgroundColor: "white",
                    zIndex: 100,
                    width: STICKER_MODAL_WIDTH,
                    height: STICKER_MODAL_HEIGHT,
                    borderRadius: 10
                }}
                >

                    <FastImage
                        style={{
                            width: STICKER_IMAGE_WIDTH,
                            height: STICKER_IMAGE_HEIGHT
                        }}
                        source={selectedStickerSource}
                    />
                </View >
            </View>
        )
    }

    render() {
        const { isShowEmoji, isShowSticker, isShowModalSticker, selectedStickerSource, isShowGifPicker } = this.state;
        return (
            <Container style={[styles.container, { backgroundColor: Colors.COLOR_WHITE }]}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={true}
                        title={this.userMemberName}
                        renderRightMenu={this.renderRightMenu}
                    />
                    {this.state.nodata ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: Constants.MARGIN_XX_LARGE }}>
                            <Text style={{ ...commonStyles.text, textAlign: 'center', marginHorizontal: Constants.MARGIN_XX_LARGE }}>Nói lời chào là cách đơn giản để bắt đầu cuộc trò chuyện :)</Text>
                        </View>
                        :
                        <FlatListCustom
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={this.renderShowLoadOldMessages}
                            onScroll={(event) => {
                                // const offsetY = event.nativeEvent.contentOffset.y
                                // if (offsetY == 0) {
                                //     let isLoadMore = true
                                //     this.readFirebaseDatabase(isLoadMore)
                                // }
                            }}
                            enableLoadMore={this.state.enableLoadMore}
                            onLoadMore={() => {
                                this.readFirebaseDatabase(true)
                            }}
                            inverted={true}
                            onContentSizeChange={() => {
                                this.scrollToEnd()
                            }}
                            keyExtractor={item => item.id}
                            onRef={(ref) => { this.flatListRef = ref; }}
                            style={{ flexGrow: 1, flex: 1, paddingHorizontal: Constants.PADDING_LARGE, backgroundColor: Colors.COLOR_WHITE }}
                            horizontal={false}
                            data={this.state.messages}
                            renderItem={this.renderItemChat.bind(this)}
                        />}
                    <View style={[styles.dockSendMess]}>
                        {/* {this.listSendImages.length != 0 ?
                            <FlatListCustom
                                style={[styles.flatListSendImages]}
                                horizontal={true}
                                keyExtractor={item => item.id}
                                data={this.listSendImages}
                                itemPerCol={1}
                                renderItem={this.renderItemSendImages.bind(this)}
                                showsVerticalScrollIndicator={true}
                            /> : null} */}
                        <View style={[commonStyles.viewHorizontal, commonStyles.shadowOffset, {
                            backgroundColor: Colors.COLOR_WHITE,
                            paddingHorizontal: Constants.PADDING_LARGE,
                            borderRadius: Constants.BORDER_RADIUS,
                            marginTop: Constants.MARGIN_LARGE,
                            flex: 0,
                            justifyContent: 'center',
                            marginBottom: this.state.keyboardHeight + 16,
                            paddingRight: Constants.PADDING_X_LARGE,
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                            paddingVertical: 4,
                            borderTopWidth: Constants.DIVIDE_HEIGHT_SMALL, borderTopColor: Colors.COLOR_GREY,
                        }]}>
                            <TextInput
                                onTouchStart={this.onFocusTextInput}
                                editable={!this.state.isShowLoading}
                                selectTextOnFocus={!this.state.isShowLoading}
                                placeholder={"Viết tin nhắn..."}
                                placeholderTextColor={Colors.COLOR_DRK_GREY}
                                ref={r => (this.messageInput = r)}
                                value={this.state.messageText}
                                onChangeText={(text) => {
                                    this.setState({ messageText: text });
                                    this.scrollToEnd();
                                }}
                                onSubmitEditing={() => {
                                    // Keyboard.dismiss()
                                    // this.onPressSendMessages()
                                }}
                                // onFocus={this.onFocusTextInput}
                                style={{
                                    flex: 1,
                                    maxHeight: Constants.PADDING_LARGE_TITLE_ONE_BTN * 2,
                                    marginHorizontal: Constants.MARGIN_LARGE,
                                    // paddingHorizontal: Constants.PADDING_LARGE
                                }}
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                                returnKeyType={"send"}
                                multiline={true}
                                selectTextOnFocus={false}
                            />
                            {/* {
                                this.state.isExpandTextInput &&
                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    style={{ marginHorizontal: Constants.MARGIN_LARGE }}
                                    onPress={this.onExpandTextInput}>
                                    <Image
                                        source={ic_back_black}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>
                            }
                            {
                                !this.state.isExpandTextInput &&
                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    style={{ marginHorizontal: Constants.MARGIN_LARGE }}
                                    onPress={this.onChooseSticker}>
                                    <Image
                                        source={ic_animated_sticker_black}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>
                            }
                            {
                                !this.state.isExpandTextInput &&
                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    style={{ marginHorizontal: Constants.MARGIN_LARGE }}
                                    onPress={this.onChooseGif}>
                                    <Image
                                        source={ic_gif_black}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>
                            } */}
                            {/* <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                style={{ marginLeft: Constants.MARGIN_LARGE }}
                                onPress={this.onChooseEmoji}>
                                <Image
                                    source={ic_emoji_black}
                                    resizeMode={'cover'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}
                                onPress={() => this.onChooseImage()}>
                                <Image
                                    source={ic_camera_grey}
                                    resizeMode={'cover'}
                                />
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                style={{
                                    paddingLeft: Constants.PADDING,
                                }}
                                onPress={() => this.onPressSend()} >
                                <Image source={ic_send_blue} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* {
                        isShowEmoji &&
                        <EmojiSelector
                            onEmojiSelected={this.onSelectedEmoji}
                            showSearchBar={false}
                            showHistory={false}
                        />
                    }
                    {
                        isShowSticker &&
                        <AnimatedStickerSelector
                            onStickerSelected={this.onSelectSticker}
                            onLongPressSticker={this.onLongPressSticker}
                            onPressOutSticker={this.onPressOutSticker}
                        />
                    }
                    {
                        isShowGifPicker &&
                        <GifPicker
                            onPressGifItem={this.onSelectGif}
                        />
                    } */}
                    {/* <ModalImageViewer
                        ref={'modalImageViewer'}
                        parentView={this}
                    /> */}
                    {/* {this.renderModalSticker(isShowModalSticker, selectedStickerSource)} */}
                    {this.showLoadingBar(this.state.isShowLoading)}
                </Root>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    data: state.chat.data,
    isLoading: state.chat.isLoading,
    error: state.chat.error,
    errorCode: state.chat.errorCode,
    action: state.chat.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);