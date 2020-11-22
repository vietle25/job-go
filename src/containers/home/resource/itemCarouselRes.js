import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Utils from 'utils/utils';
import ImageLoader from 'components/imageLoader';
// import Video from 'lib/react-native-video';
// import ic_play_white from 'images/ic_play_white.png';
import resourceType from 'enum/resourceType';
import { Colors } from 'values/colors';
import styles from './styles';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
// import VideoPlayer from 'components/videoPlayer';
const DEFAULT_WIDTH_OF_VIDEO_THUMBNAIL = 500;
const DEFAULT_HEIGHT_OF_IMAGE = 1000;

class ItemCarouselRes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoPaused: false,
            screen: this.props.screen
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            if (this.props.pauseVideoInItemCarouselRes !== nextProps.pauseVideoInItemCarouselRes &&
                this.state.videoPaused !== nextProps.pauseVideoInItemCarouselRes) {
                this.state.videoPaused = nextProps.pauseVideoInItemCarouselRes;
            }
            this.props = nextProps;
            if (!this.state.videoPaused) {
                this.state.videoPaused = !(this.props.indexRes == this.props.index);
            }
            this.state.window = this.props.window;

            this.state.screen = this.props.screen;
        }
    }

    getWidthAndHeightOfVideo = (response) => {
        if (!Utils.isNull(this.props.callbackGetRealVideoWidthAndHeight)) {
            let width = response.naturalSize.width;
            let height = response.naturalSize.height;
            this.props.callbackGetRealVideoWidthAndHeight({
                width: width,
                height: height
            })
        }
    }

    render() {
        const { item, index, indexRes, isEdit, onOpenImage, onOpenVideo, currentTimeVideo } = this.props;

        const { videoPaused, videoResizeMode, screen } = this.state;
        let path = "";
        let pathVideo = "";
        let hasHttp = false;
        let hasFile = false;
        let thumbnailVideoPath = '';
        if (!Utils.isNull(item.path)) {
            hasHttp = item.path.indexOf('http') != -1;
            hasFile = item.path.indexOf('file') != -1 || item.path.indexOf('ph://') != -1 || item.path.indexOf('assets-library') != -1;
            path = hasHttp || hasFile ? item.path : this.props.urlPathResize + "=" + item.path;
            pathVideo = hasHttp || hasFile ? item.path : this.props.urlPath + "/" + item.path;
            thumbnailVideoPath = item.pathToThumbnailResource ? this.props.urlPathResize + "=" + item.pathToThumbnailResource + '&op=resize&w=' + DEFAULT_WIDTH_OF_VIDEO_THUMBNAIL : '';
        }
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{ width: Constants.MAX_WIDTH,}}
                onPress={() => onOpenImage(index)}>
                {
                    item.type == resourceType.IMAGE &&
                    (hasFile ?
                        <Image
                            style={{
                                width: Constants.MAX_WIDTH, height: screen.height / 3,
                            }}
                            source={{ uri: path }}
                        />
                        :
                        <ImageLoader
                            resizeModeType={'cover'}
                            path={path}
                            resizeAtt={hasHttp ? null : { type: 'resize', height: DEFAULT_HEIGHT_OF_IMAGE }}
                            style={{
                                width: Constants.MAX_WIDTH, height: screen.height / 3,
                            }}

                        />
                    )
                }
                {/* {
                    item.type == resourceType.VIDEO &&
                    <VideoPlayer
                        style={{
                            width:   Constants.MAX_WIDTH,
                            height: screen.height / 3,
                            backgroundColor: Colors.COLOR_BLACK
                        }}
                        poster={thumbnailVideoPath}
                        source={{uri: pathVideo}}
                        resizeMode='contain'
                        posterResizeMode='contain'
                        paused={videoPaused}
                        onLoad={(res) => {
                            console.log(res);
                            this.getWidthAndHeightOfVideo(res)
                        }}
                        onProgress={response => {
                            this.props.onProgressVideo(response)
                        }}
                        onEnd={response => {}}
                        showOnStart={false}
                        onEnterFullscreen={() => {
                            this.setState({videoPaused: true});
                            onOpenVideo(pathVideo);
                        }}
                        currentTime={currentTimeVideo}
                    />
                } */}
            </TouchableOpacity>
        );
    }
}

export default ItemCarouselRes;
