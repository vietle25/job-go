import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import DateUtil from 'utils/dateUtil';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import Hr from 'components/hr';
import { Colors } from 'values/colors';
import styles from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

class ItemNotification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSeen: this.props.item.seen
        };
    }

    render () {
        const { item, index, lenght, onPress } = this.props;
        let { isSeen } = this.state;
        return (
            <TouchableOpacity
                onPress={() => {
                    onPress(item);
                    this.setState({
                        isSeen: true
                    })
                }}
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{ marginVertical: Constants.MARGIN_LARGE, paddingHorizontal: Constants.PADDING_X_LARGE }}>
                <Text style={[isSeen ? commonStyles.text400 : commonStyles.text700, { color: '#F25F5C' }]}>{item.title}</Text>
                <Text style={[{
                    fontWeight: !isSeen ? 'bold' : 'normal',
                }, styles.textContent]}>{
                        item.content.split("\\\\").map((str, index) => {
                            if (str != "" && str.indexOf('%%') != -1) {
                                return (
                                    <Text style={[{ fontWeight: !isSeen ? 'bold' : 'normal', color: Colors.COLOR_BLUE_SEA }]}>{
                                        str.split("%%").map((txt, index) => {
                                            if (txt != "")
                                                return txt
                                        })
                                    }</Text>
                                )
                            } else {
                                return (
                                    <Text>{str}</Text>
                                )
                            }
                        }
                        )
                    }</Text>
                <Text style={{
                    fontWeight: !isSeen ? 'bold' : 'normal', fontSize: Fonts.FONT_SIZE_X_SMALL, marginTop: Constants.MARGIN
                }}>{DateUtil.convertFromFormatToFormat(item.createdAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_TIME_ZONE_A)}</Text>
                <Hr style={{ marginTop: Constants.MARGIN_LARGE }} />
            </TouchableOpacity>
        );
    }
}

export default ItemNotification;
