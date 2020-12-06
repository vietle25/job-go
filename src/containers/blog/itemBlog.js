import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageLoader from 'components/imageLoader';
import { Constants } from 'values/constants';
import DateUtil from 'utils/dateUtil';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import img_gradient from 'images/img_gradient.png';

class ItemBlog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const { item, index, length, onPress } = this.props;
        let image = ""
        if (item.resources != null) {
            image = item.resources[0].pathToResource
        }
        return (
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[styles.container, { marginTop: index == 0 ? Constants.MARGIN_X_LARGE : Constants.MARGIN_LARGE }]}
            >
                <ImageLoader
                    path={image}
                    style={{ width: Constants.MAX_WIDTH, height: (Constants.MAX_WIDTH * 9) / 21 }}
                />
                <Image source={img_gradient} style={{ position: 'absolute', top: 0, left: 0, width: "100%", height: "100%" }} />
                <View style={{ padding: Constants.PADDING_LARGE, position: 'absolute', bottom: 0 }}>
                    <Text style={[commonStyles.textSmall, {
                        color: Colors.COLOR_WHITE_DISABLE
                    }]}>{DateUtil.convertFromFormatToFormat(item.createdAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)}</Text>
                    <Text numberOfLines={2} style={[commonStyles.text700, {
                        fontSize: Fonts.FONT_SIZE_XX_MEDIUM, color: Colors.COLOR_WHITE
                    }]}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // ...commonStyles.shadowOffset,
        backgroundColor: Colors.COLOR_WHITE,
        marginVertical: Constants.MARGIN_LARGE
    }
})

export default ItemBlog;
