import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import ic_time_gray from "images/ic_time_gray.png";
import styles from './styles';

const SIZE_IMAGE = 32
const LINE_TITLE = 1

class ItemSearch extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item, index, resource, inputSearch, onPressItem } = this.props
        let image = ""
        if (!Utils.isNull(item.resourcePaths)) {
            image = !Utils.isNull(item.resourcePaths[0]) && item.resourcePaths[0].path.indexOf('http') != -1
                ? item.resourcePaths[0].path : resource + "=" + item.resourcePaths[0].path
        }
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={onPressItem}>
                <View style={styles.item}>
                    {!Utils.isNull(inputSearch)
                        ? !Utils.isNull(item.resourcePaths)
                            ? <ImageLoader
                                resizeModeType={'cover'}
                                path={image}
                                style={{ width: SIZE_IMAGE, height: SIZE_IMAGE, marginRight: Constants.MARGIN_X_LARGE }} />
                            : null
                        : null
                    }
                    <Image source={ic_time_gray} style={{ marginHorizontal: Constants.MARGIN_X_LARGE }} />
                    <Text numberOfLines={LINE_TITLE} ellipsizeMode={"tail"}
                        style={[styles.text, {
                            flex: 1,
                            color: Colors.COLOR_TEXT,
                            marginRight: Constants.MARGIN_X_LARGE
                        }]}>{item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default ItemSearch;
