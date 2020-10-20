import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import {Constants} from 'values/constants';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import {Colors} from 'values/colors';
import screenType from 'enum/screenType';
import ic_check_circle_green from 'images/ic_check_circle_green.png';
import ic_close_circle_gray from 'images/ic_close_circle_gray.png';
import {Fonts} from 'values/fonts';
import BaseView from 'containers/base/baseView';
import Hr from 'components/hr';

const screen = Dimensions.get("window");
const WIDTH_IMAGE = 48;
const HEIGHT_IMAGE = WIDTH_IMAGE * (12 / 8);

export default class ItemCategory extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            requesting: !Utils.isNull(this.props.item.requesting) ? this.props.item.requesting : false
        };
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
        }
    }

    render () {
        const {data, item, index, resourceUrlPathResize, onPress, type, onAcceptFriend, userId} = this.props;
        let image = !Utils.isNull(item.avatar) ? item.avatar.indexOf('http') != -1 ?
            item.avatar : !Utils.isNull(resourceUrlPathResize) ? resourceUrlPathResize.textValue + "=" + item.avatar : '' : '';
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => {onPress(item)}}>
                <View style={[styles.container]}>
                    <View style={{
                        flex: 2,
                        flexDirection: 'column',

                    }}>
                        <Text numberOfLines={2} style={[commonStyles.textBold, {
                            margin: 0, padding: 0, marginBottom: Constants.MARGIN_LARGE
                        }]}>{item.name}</Text>
                        <Text numberOfLines={1} style={[commonStyles.textBold, {
                            color: Colors.COLOR_ERA,
                            margin: 0, padding: 0, fontSize: Fonts.FONT_SIZE_XX_SMALL
                        }]}>{"Quantity: " + item.numberJobs}</Text>
                    </View>
                    <View style={{
                        flex: 1.5,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        marginLeft: Constants.MARGIN_X_LARGE,
                    }}>
                        <Text numberOfLines={1} style={[commonStyles.text, {
                            marginBottom: Constants.MARGIN_LARGE,
                            fontSize: Fonts.FONT_SIZE_X_SMALL
                        }]}> {DateUtil.convertFromFormatToFormat(item.createdAt,
                            DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)}</Text>
                        <Text numberOfLines={1} style={[commonStyles.text, {
                            fontSize: Fonts.FONT_SIZE_XX_SMALL
                        }]}>{item.createdBy.name}</Text>
                    </View>
                </View>
                <Hr style={{paddingHorizontal: Constants.PADDING_X_LARGE, marginBottom: Constants.MARGIN_LARGE}}></Hr>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
        paddingHorizontal: Constants.PADDING_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    image: {
        borderRadius: Constants.BORDER_RADIUS
    }
});
