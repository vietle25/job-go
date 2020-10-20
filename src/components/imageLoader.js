import React, { Component } from "react";
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { ServerPath } from 'config/Server';
import ic_default_user from 'images/ic_default_user.png';
import ic_default_group from 'images/ic_cancel_blue.png';
import ic_sign_in from 'images/ic_sign_in.png';
import Utils from "utils/utils";
import BaseView from "containers/base/baseView";
import StorageUtil from "utils/storageUtil";
import imageDefaultType from "enum/imageDefaultType";
import ImageSize from 'react-native-image-size'
export default class ImageLoader extends Component {
    static defaultProps = {
        imageDefaultType: imageDefaultType.USER,
        autoResize: false
    }

    constructor(props) {
        super(props);
        this.state = {
            _path: null,
            errorImage: null,
            loaded: false,

        }
        this.path = require('../images/ic_default_user.png')
        this.newWidth = 0;
        this.newHeight = 0;

    }

    componentDidMount = () => {

    };

    /** 
     * handle resize image 
     */
    handleAutoResizeImage = () => {
        if (this.props.autoResize) {
            ImageSize.getSize(this.state._path).then(item => {
                // console.log(`NEW WIDTH : ${this.newWidth} - NEW HEIGHT : ${this.newHeight}`);
                let rWidth = item.width;
                let rHeight = item.height;
                let ratio = parseInt(rWidth) / parseInt(rHeight);
                let styles = this.props.style;
                let width = styles[styles.length - 1].width;
                // WIDTH <= HEIGHT
                this.newHeight = width / ratio;
                this.newWidth = width;
                this.props.callbackResizeImage(this.newWidth, this.newHeight, this.state._path);
            })
        }
    }


    /**
     * On start load image 
     */
    onLoadStart = () => {
        this.setState({ loaded: false })
    }

    /**
     * On load image finish 
     */
    onLoadEnd = () => {
        this.setState({ loaded: true })
    }

    componentWillMount () {
        this.handlePath()
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handlePath()
        }
    }

    //handle path
    handlePath () {
        const { path, resizeAtt } = this.props;
        if (this.path != path) {
            this.path = path
            this.state._path = path

            if (this.path === "" || this.path === null) {
                this.state._path = this.state.errorImage
            } else {
                var returnPath = this.path.indexOf('http') !== -1 ? this.path : "" + this.path
                this.state._path = returnPath

                // if (returnPath.includes('.gif') || this.props.autoResize) {
                //     // clear resize url 
                //     this.state._path = returnPath.split('&token')[0]
                //         .replace('sr/display?path=', '');
                //     this.handleAutoResizeImage();
                //     return;
                // }
                // if (!Utils.isNull(resizeAtt)) {
                //     if (!Utils.isNull(resizeAtt.type)) {
                //         this.state._path += `&op=${resizeAtt.type}`
                //     }
                //     if (!Utils.isNull(resizeAtt.width) && resizeAtt.width != '100%') {
                //         this.state._path += `&w=${parseInt(resizeAtt.width) + 150}`
                //     }
                //     if (!Utils.isNull(resizeAtt.height) && resizeAtt.height != '100%') {
                //         this.state._path += `&h=${parseInt(resizeAtt.height) + 150}`
                //     }
                // }
            }
        }
    }

    //return resizeMode 
    returnResizeMode = (_id) => {
        var result = FastImage.resizeMode.contain;
        if (_id == null) return FastImage.resizeMode.cover
        var id = _id.replace(/ /g, '');
        if (id === 'contain') {
            result = FastImage.resizeMode.contain
        } else if (id === 'cover') {
            result = FastImage.resizeMode.cover
        } else if (id === 'stretch') {
            result = FastImage.resizeMode.stretch
        } else {
            result = FastImage.resizeMode.center
        }
        return result;
    }

    render = () => {
        var { path, width, resizeModeType, height, style, isShowDefault, autoResize } = this.props;
        return (
            <FastImage
                // style={[style, autoResize ? { width: this.newWidth, height: this.newHeight } : {}]}
                style={style}
                resizeMode={this.returnResizeMode(resizeModeType)}
                source={
                    !Utils.isNull(this.state._path) ?
                        { uri: this.state._path, priority: FastImage.priority.high }
                        : this.props.imageDefaultType == imageDefaultType.USER ? ic_default_user : ic_default_group}
                onError={() => {
                    this.setState({
                        _path: this.state.errorImage
                    })
                }}
                onLoadEnd={this.onLoadEnd}
                onLoadStart={this.onLoadStart}
            />
        )
    }
}
