import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import { Constants } from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import screenType from 'enum/screenType';
import ic_check_circle_green from 'images/ic_check_circle_green.png';
import ic_close_circle_gray from 'images/ic_close_circle_gray.png';
import { Fonts } from 'values/fonts';
import BaseView from 'containers/base/baseView';

const screen = Dimensions.get("window");
const WIDTH_IMAGE = 56;
const HEIGHT_IMAGE = WIDTH_IMAGE * (12 / 8);

export default class ItemShop extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { data, item, index, onPress, userId } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={onPress}
                style={[styles.container]}>
                <ImageLoader
                    resizeModeType={'cover'}
                    path={item.avatar}
                    style={[styles.image, {
                        width: WIDTH_IMAGE,
                        height: WIDTH_IMAGE
                    }]}
                />
                <View style={{
                    flex: 1,
                    flexDirection: 'column', justifyContent: 'center',
                    marginHorizontal: Constants.MARGIN_X_LARGE,

                }}>
                    <Text numberOfLines={1} style={[commonStyles.textBold, {
                        margin: 0, padding: 0
                    }]}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: screen.width,
        backgroundColor: Colors.COLOR_WHITE,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    image: {
        borderRadius: Constants.BORDER_RADIUS
    }
});
