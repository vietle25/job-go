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
import Hr from 'components/hr';

const screen = Dimensions.get("window");
const WIDTH_IMAGE = Constants.MAX_WIDTH * 0.17;
const HEIGHT_IMAGE = WIDTH_IMAGE * (12 / 8);

export default class ItemArea extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
        }
    }

    render () {
        const { length, item, index, onPress } = this.props;
        console.log("item area:", item);
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{ paddingHorizontal: Constants.PADDING_X_LARGE, marginBottom: Constants.MARGIN_LARGE, paddingVertical: Constants.PADDING_LARGE, marginTop: index == 0 ? Constants.MARGIN_X_LARGE : 0 }}
                onPress={() => { onPress(item) }}>
                <Text style={[commonStyles.text, { flex: 1, marginBottom: Constants.MARGIN_LARGE }]}>{item.name}</Text>
                <Hr style={{ marginBottom: Constants.MARGIN_LARGE }}></Hr>
            </TouchableOpacity>
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
