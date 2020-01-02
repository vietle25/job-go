import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
import {Constants} from 'values/constants';
import ImageLoader from 'components/imageLoader';
import {Colors} from 'values/colors';
// import Video from 'lib/react-native-video';
import screenType from 'enum/screenType';
import resourceType from 'enum/resourceType';
import styles from './styles';
import ic_close from 'images/ic_close.png';
import commonStyles from 'styles/commonStyles';
const screen = Dimensions.get("window");

class ItemResThumbnail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const {item, index, onPress, urlPathResize, urlPath, isEdit, onDeleteRes, imageRestriction, videoRestriction} = this.props;
        const {indexChoose} = this.props;
        let hasHttp = item.path.indexOf('http') != -1;
        let hasFile = item.path.indexOf('file') != -1 || item.path.indexOf('ph://') != -1 || item.path.indexOf('assets-library') != -1;
        let path = hasHttp || hasFile ? item.path : urlPathResize + "=" + item.path;
        let pathVideo = hasHttp || hasFile ? item.path : urlPath + "/" + item.path;
        return (
            <View style={[styles.containerItem, {
                borderColor: indexChoose == index ? Colors.COLOR_GRAY : Colors.COLOR_TRANSPARENT
            }]}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={{}}
                    onPress={() => onPress(item, index)}>
                    {
                        item.type == resourceType.IMAGE &&
                        (
                            hasFile ?
                                <Image
                                    style={styles.resource}
                                    source={{uri: path}}
                                />
                                : <ImageLoader
                                    resizeModeType={'cover'}
                                    path={path}
                                    resizeAtt={hasHttp ? null : {type: 'resize', height: 56}}
                                    style={styles.resource}
                                />
                        )
                    }
                    {
                        item.type == resourceType.VIDEO &&
                        <View style={{backgroundColor: Colors.COLOR_BLACK}}>
                            {/* <Video
                                style={styles.resource}
                                source={{uri: pathVideo}}
                                // resizeMode='cover'
                                paused={true}
                            /> */}
                            <View style={[styles.playVideo, {backgroundColor: Colors.COLOR_TRANSPARENT}]}>
                                {/* <Image source={ic_play_white} /> */}
                            </View>
                        </View>
                    }
                    {
                        isEdit &&
                        (item.type == resourceType.VIDEO && item.size > videoRestriction
                            || item.type == resourceType.IMAGE && item.size > imageRestriction) &&
                        <View style={styles.warning}>
                            <Text style={[commonStyles.textSmall, {
                                textAlign: "center",
                                color: Colors.COLOR_WHITE
                            }]}>Vượt giới hạn</Text>
                        </View>
                    }
                </TouchableOpacity>
                {isEdit &&
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => onDeleteRes(item, index)}
                        style={styles.btnDeleteThumb}>
                        <Image
                            source={ic_close}
                            style={{width: 10, height: 10}}
                        />
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

export default ItemResThumbnail;
