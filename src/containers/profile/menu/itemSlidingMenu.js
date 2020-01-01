import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Constants } from "values/constants";
import Utils from "utils/utils";
import slidingMenuType from "enum/slidingMenuType";
import screenType from "enum/screenType";
import ic_next_grey from "images/ic_cancel_blue.png";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";

class ItemSlidingMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        const {
            data,
            item,
            index,
            navigation,
            userInfo,
            callBack,
            resourceUrlPathResize,
            source,
            onLogout
        } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => {
                    if (!Utils.isNull(item.screen)) {
                        navigation.navigate(item.screen, {
                            screenType: item.screen == "ChangePassword" ?
                                screenType.CHANGE_PASS_VIEW : null, phone: item.screen == "ConfirmPassword" ?
                                    userInfo.phone : null
                        });
                    } else if (index == data.length - 1) {
                        onLogout();
                    }
                }} >
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: Constants.PADDING_X_LARGE,
                    borderBottomWidth: Constants.BORDER_WIDTH / 2,
                    borderColor: Colors.COLOR_GRAY
                }}>
                    <Image source={Utils.isNull(item.icon) ? null : item.icon} />
                    <Text
                        style={[
                            commonStyles.text,
                            {
                                color: 'black',
                                flex: 1,
                                margin: 0, marginLeft: Constants.PADDING_X_LARGE,
                                color: index == data.length - 1 ? 'red' : 'black'
                            } 
                        ]}
                    >
                        {item.name}
                    </Text>
                    {Utils.isNull(item.amountUser) ? null :
                        <Text style={[commonStyles.text, { color: Colors.COLOR_RED }]}>{"(" + item.amountUser + ")"}</Text>
                    }
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-between' }}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => this.props.gotoProductView(productType.VEHICLE_PARTS)}>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default ItemSlidingMenu;
