import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import screenType from 'enum/screenType';
import ic_check_circle_green from 'images/ic_check_circle_green.png';
import ic_close_circle_gray from 'images/ic_close_circle_gray.png';
import ic_chat_round from 'images/ic_chat_round.png';
import ic_phone_round from 'images/ic_phone_round.png';
import { Fonts } from 'values/fonts';
import BaseView from 'containers/base/baseView';
import Hr from 'components/hr';

const screen = Dimensions.get("window");
const WIDTH_IMAGE = Constants.MAX_WIDTH * 0.17;
const HEIGHT_IMAGE = WIDTH_IMAGE * (12 / 8);

export default class ItemRecruitment extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visibleContact: true,

        };
        this.animate = new Animated.Value(0)
        this.opacity = new Animated.Value(0)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
        }
    }

    render() {
        const { length, item, index, onPress } = this.props;
        const contactStyle = {
            top: this.animate.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 16],
                // extrapolate: 'clamp'
            }),
            opacity: this.animate.interpolate({
                inputRange: [0.7, 1],
                outputRange: [0, 1],
                // extrapolate: 'clamp'
            }),
        }
        const heightItem = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [WIDTH_IMAGE + 32 + 50, WIDTH_IMAGE + 32],
            extrapolate: 'clamp'
        })
        console.log("item recruitment:", item);
        let user = item.createdBy;
        return (
            <View style={{
                paddingHorizontal: Constants.PADDING_X_LARGE,
                marginBottom: Constants.MARGIN_LARGE,
                paddingVertical: Constants.PADDING_LARGE,
                marginTop: index == 0 ? Constants.MARGIN_X_LARGE : 0,
                height: !this.state.visibleContact ? WIDTH_IMAGE + 32 + 42 : WIDTH_IMAGE + 16,
            }}>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        // onPress(item)
                        let toValue = this.state.visibleContact ? 1 : 0
                        Animated.spring(this.animate, {
                            toValue: toValue,
                            friction: 5,
                            // duration: 500
                        }).start();
                        this.setState({
                            visibleContact: !this.state.visibleContact
                        })

                    }}>
                    <ImageLoader path={user.avatarPath} style={{
                        width: WIDTH_IMAGE, height: WIDTH_IMAGE, borderRadius: Constants.BORDER_RADIUS
                    }} />
                    <View style={{ alignItems: 'flex-start', marginLeft: Constants.MARGIN_X_LARGE, flex: 1 }}>
                        <Text style={[commonStyles.textBold, { fontSize: Fonts.FONT_SIZE_XX_MEDIUM }]}>{user.name}</Text>
                        <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_MEDIUM, marginTop: Constants.MARGIN }]}>{DateUtil.convertFromFormatToFormat(item.createdAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)}</Text>
                    </View>

                </TouchableOpacity>
                {/* { */}
                {/* this.state.visibleContact ? */}
                <Animated.View style={[{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    // position: 'absolute'
                }, contactStyle]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.openCall(user.phone)
                        }}
                        style={{ alignItems: 'center' }}>
                        <Image source={ic_phone_round} />
                        <Text>Gọi điện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.gotoChat(user)
                        }}
                        style={{ alignItems: 'center' }}>
                        <Image source={ic_chat_round} />
                        <Text>Chat</Text>
                    </TouchableOpacity>
                </Animated.View>
                {/* : null */}
                {/* } */}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
        paddingVertical: Constants.PADDING_LARGE,
        flexDirection: 'row',
    },

    image: {
        borderRadius: Constants.CORNER_RADIUS
    }
});
