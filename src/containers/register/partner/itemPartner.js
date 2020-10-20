import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Constants} from 'values/constants';
import ic_check_white from "images/ic_cancel_blue.png";
import {Colors} from 'values/colors';
import commonStyles from 'styles/commonStyles';
import LinearGradient from "react-native-linear-gradient";

class ItemPartner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const {data, item, index, onItemSelected, selected} = this.props
        let marginBottom = Constants.MARGIN
        if (index == data.length - 1) {
            marginBottom = Constants.MARGIN
        }
        return (
            <TouchableOpacity
                key={index}
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => onItemSelected(item, index)}>
                {index == selected ?
                    <LinearGradient colors={['#139e8d', '#34e77f']}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        style={[commonStyles.shadowOffset, {
                            //backgroundColor: index == selected ? Colors.COLOR_PRIMARY : Colors.COLOR_WHITE,
                            padding: Constants.PADDING_X_LARGE,
                            paddingHorizontal: Constants.MARGIN_X_LARGE,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                            marginBottom: Constants.MARGIN_X_LARGE
                        }]} >
                        <Text style={[styles.text, {
                            color: Colors.COLOR_WHITE
                        }]}>{item.name}</Text>
                        <Image source={ic_check_white} />
                    </LinearGradient>
                    :
                    <View style={[commonStyles.shadowOffset, {
                        backgroundColor: index == selected ? Colors.COLOR_PRIMARY : Colors.COLOR_WHITE,
                        padding: Constants.PADDING_X_LARGE,
                        paddingHorizontal: Constants.MARGIN_X_LARGE,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: Constants.MARGIN_X_LARGE,
                        marginBottom: Constants.MARGIN_X_LARGE
                    }]}>
                        <Text style={[styles.text, {
                            color: Colors.COLOR_TEXT
                        }]}>{item.name}</Text>
                    </View>
                }
            </TouchableOpacity>
        );
    }
}

export default ItemPartner;
