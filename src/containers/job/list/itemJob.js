import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import screenType from 'enum/screenType';
import { Fonts } from 'values/fonts';
import BaseView from 'containers/base/baseView';
import Hr from 'components/hr';
import statusType from 'enum/statusType';
import img_expired from 'images/img_expired.png';
import ic_love_red from 'images/ic_love_red.png';
import ic_love_white from 'images/ic_love_white.png';
import ScreenType from 'enum/screenType';
import styles from './styles';

const WIDTH_IMAGE = Constants.MAX_WIDTH * 0.17;
const HEIGHT_IMAGE = WIDTH_IMAGE * (12 / 8);

export default class ItemJob extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            requesting: !Utils.isNull(this.props.item.requesting) ? this.props.item.requesting : false,
            saved: this.props.item.saved
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            if (!Utils.isNull(this.props.item.requesting)) {
                this.state.requesting = this.props.item.requesting;
            }
        }
    }

    render() {
        const { data, item, index, resourceUrlPathResize, onPress, type, onAcceptFriend, user, onPressSave, screenType } = this.props;
        let { saved } = this.state;
        let day = this.calculateDayLeft(item.validTo)
        let expired = false
        if (day < 0) {
            expired = true
        }
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    paddingHorizontal: Constants.PADDING_X_LARGE,
                }}
                onPress={() => onPress(item)}>
                <View style={styles.containerItem}>
                    {this.renderImage(item, expired)}
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2} style={styles.address}>{item.province != null ? item.district != null ?
                            item.province.name + " - " + item.district.name
                            : item.province.name : "Toàn quốc"}</Text>
                        <Text numberOfLines={2} style={styles.titleItem}>{item.title}</Text>
                        <Text numberOfLines={2} style={styles.salary}>{item.salary}</Text>
                    </View>
                    {/* <Pressable
                        android_ripple={{
                            color: Colors.COLOR_WHITE_DISABLE,
                            borderless: false,
                        }}
                        onPress={() => {
                            if (screenType == ScreenType.SAVE_JOB_VIEW) {
                                onPressSave(item, this.state.saved, index)
                            } else {
                                if (user != null) {
                                    this.setState({
                                        saved: !this.state.saved
                                    }, () => {
                                        onPressSave(item, this.state.saved, index)
                                    })
                                } else {
                                    onPressSave(item, saved, index)
                                }
                            }
                        }}
                        style={{
                            padding: 4,
                            alignItem: 'center', justifyContent: 'center'
                        }}>
                        <Image source={saved ? ic_love_red : ic_love_white} />
                    </Pressable> */}
                </View>
                <View style={styles.btnSave}>
                    {item.status != statusType.ACTIVE ? this.renderStateJob(item) : this.renderDayLeft(item)}
                    <View style={styles.viewUser}>
                        <Text numberOfLines={1} style={[commonStyles.text, {
                            fontSize: Fonts.FONT_SIZE_MEDIUM
                        }]}>{item.createdBy ? item.createdBy.name : "Người dùng"}</Text>
                    </View>
                </View>
                <Hr style={{ marginBottom: Constants.MARGIN_LARGE }}></Hr>
            </TouchableOpacity>
        );
    }

    renderStateJob(item) {
        if (item.status == statusType.DRAFT) {
            return (
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_ERA }]}>Chờ duyệt</Text>
            )
        }
    }

    renderImage = (item, expired) => {
        let image = !Utils.isNull(item.resources) ? item.resources[0] != null ? item.resources[0].pathToResource : "" : "";
        return (
            <View>
                <ImageLoader
                    resizeModeType={'cover'}
                    path={image}
                    style={[styles.image, {
                        backgroundColor: expired ? Colors.COLOR_BACKGROUND_GRAY_INPUT : undefined,
                        opacity: expired ? 0.5 : 1,
                        width: WIDTH_IMAGE,
                        height: WIDTH_IMAGE
                    }]}
                />
                {expired ?
                    <Image source={img_expired}
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            width: WIDTH_IMAGE, height: WIDTH_IMAGE,
                            resizeMode: 'contain',
                            transform: [
                                { rotateZ: '20deg' },

                            ],
                        }} /> : null
                }
            </View>
        )
    }

    renderDayLeft(item) {
        if (item.validTo != null) {
            let day = this.calculateDayLeft(item.validTo)
            if (day > 0) {
                return (
                    <Text style={[commonStyles.textSmall, { color: Colors.COLOR_TEXT_PRIMARY }]}>Còn {day} ngày</Text>
                )
            } else if (day == 0) {
                return (
                    <Text style={[commonStyles.textSmall, { color: Colors.COLOR_TEXT_PRIMARY }]}>Ngày cuối</Text>
                )
            } else {
                return (
                    <Text style={[commonStyles.textSmall, { color: Colors.COLOR_ERA }]}>Hết hạn</Text>
                )
            }
        } else {
            return (
                <Text style={[commonStyles.textSmall, { color: Colors.COLOR_TEXT_PRIMARY }]}>Đang tuyển</Text>
            )
        }
    }

    calculateDayLeft = (time) => {
        let calculated = DateUtil.diffDayToNow(time);
        return Math.floor(calculated)
    }
}

