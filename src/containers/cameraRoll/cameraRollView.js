import React, {Component} from "react";
import PropTypes from "prop-types";
import {
    ImageBackground,
    Dimensions,
    View,
    StatusBar,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    Keyboard,
    BackHandler,
    PermissionsAndroid
} from "react-native";
import {
    Form, Textarea, Container, Header, Title, Left,
    Icon, Right, Button, Body, Content, Text, Card,
    CardItem, Fab, Footer, Input, Item, Picker
} from "native-base";
import {Constants} from "values/constants";
import {Colors} from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import {Fonts} from "values/fonts";
import Utils from "utils/utils";
import HeaderGradient from 'containers/common/headerGradient.js';
import ic_camera_black from 'images/ic_camera_black.png';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRollPicker from "./cameraRollPicker";
import ic_check_blue from 'images/ic_check_blue.png';

const AVATAR_SIZE = 32;
const AVATAR_BORDER = AVATAR_SIZE / 2
const OPTION_IMAGE_PICKER = {
    width: 800,
    height: 600,
    multiple: true,
    waitAnimationEnd: false,
    includeExif: true,
    forceJpg: true,
    compressImageQuality: 0.8
};

class CameraRollView extends BaseView {

    constructor(props) {
        super(props);
        const {route, navigation} = this.props;
        this.state = {
            disableCamera: false,
            selected: [],
            screen: Dimensions.get("screen")
        };
        this.isTakePhoto = false;
        this.resources = []
        this.selectSingleItem = route.params.selectSingleItem;
        this.callback = route.params.callback;
        this.callbackCaptureImage = route.params.callbackCaptureImage;
        this.assetType = route.params.assetType;
        this.maximum = route.params.maximum;
        this.numVideoSelected = route.params.numVideoSelected;
        if (this.assetType == 'Photos')
            this.isVideo = false;
        else
            this.isVideo = true;
    }

    componentDidMount () {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
            Dimensions.addEventListener('change', this.onChangeDimensions);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
            Dimensions.removeEventListener('change', this.onChangeDimensions);
        });
    }

    onChangeDimensions = (e) => {
        const screen = e.screen;
        this.setState({
            screen
        });
    }

    render () {
        const {screen} = this.state;
        return (
            <View style={{flex: 1}}>
                <HeaderGradient
                    onBack={this.onBack}
                    visibleBack={true}
                    title={"Thư viện"}
                    renderRightMenu={this.renderRightMenu} />
                <CameraRollPicker
                    groupTypes='SavedPhotos'
                    maximum={this.maximum}
                    selected={this.state.selected}
                    selectSingleItem={this.selectSingleItem}
                    assetType={this.assetType}
                    imagesPerRow={3}
                    imageMargin={Constants.MARGIN}
                    callback={this.handleImagePicker}
                    loader={this.showLoadingBar(true)}
                    // mimeTypes={['video/mp4']}
                    emptyText={'Không có dữ liệu'}
                    emptyTextStyle={{marginTop: Constants.MARGIN_XX_LARGE * 5}}
                    numVideoSelected={this.numVideoSelected}
                    showMessage={(message) => this.showMessage(message)}
                    containerWidth={screen.width}
                />
            </View>
        );
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        const {disableCamera} = this.state;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    position: "absolute",
                    right: 0,
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => {
                    if (disableCamera) {
                        this.onBack();
                        this.callback(this.resources, this.assetType);
                    } else {
                        this.takePhoto();
                    }
                }}
            >
                <Image source={!disableCamera ? ic_camera_black : ic_check_blue} />
            </TouchableOpacity>
        )
    }

    /**
     * Take a photo
     */
    takePhoto = () => {
        console.log(`take photo`);
        this.isTakePhoto = true;
        const mediaType = this.assetType == 'Videos' ? 'video' : "any";
        ImagePicker.openCamera({
            ...OPTION_IMAGE_PICKER,
            // mediaType: "any",
            mediaType: mediaType,
        }).then((images) => {
            let path = images.path;
            // video 
            if (path.includes('.mp4')) {
                this.onBack();
                let newArr = [];
                newArr.push(images);
                this.callback(newArr, this.assetType);
            }
            // image 
            else {
                this.handleImagePicker(res);
            }
        }).catch(e => console.log(e));
    };

    /**
     * Handle image picker
     */
    handleImagePicker = (res) => {
        // alert(JSON.stringify(res));
        console.log(`=== handleImagePicker()`, res);

        if (res.length > 0) {
            this.setState({
                disableCamera: true
            })
        }
        else {
            this.setState({
                disableCamera: false
            })
            // return;
        }
        if (!Utils.isNull(res)) {
            if (!res.exif) {
                res.forEach(element => {
                    element.path = Utils.isNull(element.uri) ? element.path : element.uri;
                });
                this.resources = res;
            }
            else {
                this.resources.path = res.path;
                this.resources.width = res.width;
                this.resources.height = res.height;
                this.onBack();
                this.callbackCaptureImage(res);
            }
        }
    }
}

export default CameraRollView;
