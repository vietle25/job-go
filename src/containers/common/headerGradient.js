import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View,
    StatusBar
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Header } from "native-base";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import Utils from "utils/utils";
import { Constants } from "values/constants";

export default class HeaderGradient extends BaseView {

    constructor(props) {
        super(props);
    }

    render () {
        const { start, end, colors, elevation = Constants.ELEVATION, backgroundColor } = this.props;
        return (
            <LinearGradient
                colors={!Utils.isNull(colors) ? colors : [Colors.COLOR_BLACK, Colors.COLOR_WHITE]}
                start={!Utils.isNull(start) ? start : { x: 0, y: 0 }}
                end={!Utils.isNull(end) ? end : { x: 1, y: 0 }}
                style={[commonStyles.shadowOffset]}>
                {/* <View style={{ height: StatusBar.currentHeight, backgroundColor: !Utils.isNull(backgroundColor) ? backgroundColor : Colors.COLOR_WHITE, zIndex: 0 }} /> */}
                <Header style={[commonStyles.header, { elevation: elevation, backgroundColor: !Utils.isNull(backgroundColor) ? backgroundColor : Colors.COLOR_WHITE }]} >
                    {this.renderHeaderView({ ...this.props })}
                </Header>
            </LinearGradient>
        )
    }
}