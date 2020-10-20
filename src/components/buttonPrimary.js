import React, { Component } from 'react';
import { Button, TouchableOpacity, Text } from 'react-native';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import commonStyles from 'styles/commonStyles'

const ButtonPrimary = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity
            activeOpacity={Constants.ACTIVE_OPACITY}
            onPress={() => { onPress() }}
            style={[{
                width: Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE,
                padding: Constants.PADDING_LARGE + 4,
                marginVertical: Constants.MARGIN_LARGE,
                justifyContent: 'center',
                alignItems: 'center', backgroundColor: Colors.COLOR_PRIMARY,
                borderRadius: Constants.CORNER_RADIUS
            }, style]}>
            <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]}>{title}</Text>
        </TouchableOpacity>
    )
};

export default ButtonPrimary;