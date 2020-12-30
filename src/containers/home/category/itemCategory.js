import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import commonStyles from 'styles/commonStyles';
import { elementAt } from 'rxjs/operators';
import Hr from 'components/hr';
import ic_check_blue from 'images/ic_check_blue.png';

class ItemCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const { data, item, index, onItemSelected, current } = this.props
        let marginBottom = -Constants.MARGIN
        if (index == data.length - 1) {
            marginBottom = Constants.MARGIN
        }
        let currentItem = null;
        if (current) {
            currentItem = current.find((element) => {
                if (item.id == element.id) return element;
            })
        }
        return (
            <View>
                <TouchableOpacity
                    key={index}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={[{
                        marginTop: index == 0 ? Constants.MARGIN_LARGE : 0,
                        marginBottom: index != 0 ? Constants.MARGIN_LARGE : 0,
                        backgroundColor: Colors.COLOR_WHITE,
                        paddingHorizontal: Constants.PADDING_X_LARGE
                    }]}
                    onPress={() => {
                        onItemSelected(item, index, currentItem ? false : true);
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[commonStyles.text, {
                            textAlignVertical: 'center',
                            color: currentItem ? Colors.COLOR_TEXT_PRIMARY : Colors.COLOR_TEXT,
                            marginTop: Constants.MARGIN_LARGE, flex: 1
                        }]}>{item.name}</Text>
                        {currentItem && <Image style={{ marginLeft: Constants.MARGIN_X_LARGE }} source={ic_check_blue} />}
                    </View>
                    <Hr style={{ marginVertical: Constants.MARGIN_LARGE }}></Hr>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        paddingVertical: Constants.PADDING_LARGE + Constants.MARGIN,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        justifyContent: 'center',
        // alignItems: 'center'
    }
})
export default ItemCategory;
