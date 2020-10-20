import React, { Component } from 'react';
import { Alert, View, TouchableHighlight, Modal, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import DateRange from './DateRange';
import moment from 'moment';
import normalize from './normalizeText';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import DateUtil from "utils/dateUtil";
import Utils from 'utils/utils';

const styles = {
  placeholderText: {
    color: Colors.COLOR_RED,
    fontSize: normalize(18),
    marginLeft: Constants.MARGIN,
    marginRight: Constants.MARGIN,
  },
  contentInput: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentText: {
    fontSize: normalize(18),
    marginLeft: Constants.MARGIN,
    marginRight: Constants.MARGIN,
  },
  stylish: {
    height: 48,
  }
};
export default class ComposePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      allowPointerEvents: true,
      showContent: false,
      selected: '',
      startDate: null,
      endDate: null,
      date: new Date(),
      focus: 'startDate',
      currentDate: moment()
    };
  }
  isDateBlocked = date => {
    if (this.props.blockBefore) {
      return date.isBefore(moment(), 'day');
    } else if (this.props.blockAfter) {
      return date.isAfter(moment(), 'day');
    }
    return false;
  };
  onDatesChange = event => {
    const { startDate, endDate, focusedInput, currentDate } = event;
    if (currentDate) {
      this.setState({ currentDate });
      return;
    }
    this.setState({ ...this.state, focus: Utils.isNull(focusedInput)?this.state.focus:focusedInput }, () => {
      this.setState({ ...this.state, startDate, endDate });
    });
  };
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };
  onConfirm = () => {
    const returnFormat = this.props.returnFormat || 'DD/MM/YYYY';
    const outFormat = this.props.outFormat || 'LL';
    if (!this.props.mode || this.props.mode === 'single') {
      this.setState({
        showContent: true,
        selected: this.state.currentDate.format(outFormat)
      });
      this.setModalVisible(false);
      if (typeof this.props.onConfirm === 'function') {
        this.props.onConfirm({
          currentDate: this.state.currentDate.format(returnFormat)
        });
      }
      return;
    }

    if (this.state.startDate && this.state.endDate) {
      const start = this.state.startDate.format(outFormat);
      const end = this.state.endDate.format(outFormat);
      this.setState({
        showContent: true,
        selected: `${start}${this.props.dateSplitter}${end}`
      });
      this.setModalVisible(false);

      if (typeof this.props.onConfirm === 'function') {
        this.props.onConfirm({
          startDate: this.state.startDate.format(returnFormat),
          endDate: this.state.endDate.format(returnFormat)
        });
      }
    } else if (!this.state.startDate) {
      Alert.alert(
        //title
        'Thông báo',
        //body
        'Vui lòng chọn ngày bắt đầu',
        [
          {
            text: 'Đồng ý',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    } else if (!this.state.endDate) {
      Alert.alert(
        //title
        'Thông báo',
        //body
        'Vui lòng chọn ngày kết thúc',
        [
          {
            text: 'Đồng ý',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    }
  }
  getTitleElement() {
    const { placeholder, customStyles = {}, allowFontScaling } = this.props;
    const showContent = this.state.showContent;
    if (!showContent && placeholder) {
      return (
        <Text
          allowFontScaling={allowFontScaling}
          style={[styles.placeholderText, customStyles.placeholderText]}
          numberOfLines={1}
        >
          {placeholder}
        </Text>
      );
    }
    return (
      <Text
        allowFontScaling={allowFontScaling}
        style={[styles.contentText, customStyles.contentText]}
        numberOfLines={1}
      >
        {this.state.selected}
      </Text>
    );
  }

  renderButton = () => {
    const { customButton } = this.props;

    if (customButton) {
      return customButton(this.onConfirm);
    }
    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={this.onConfirm}
        style={[
          {
            width: '80%',
            marginHorizontal: '3%',
            borderWidth: 1,
            borderColor: Colors.COLOR_GRAY,
            borderRadius: 10,
            backgroundColor: Colors.COLOR_RED,
            alignItems: 'center',
            paddingBottom: Constants.PADDING_LARGE,
            paddingTop: Constants.PADDING_LARGE
          },
          this.props.ButtonStyle
        ]}
      >
        <Text style={[{ fontSize: 20, color: Colors.COLOR_WHITE }, this.props.ButtonTextStyle]}>
          {this.props.ButtonText ? this.props.ButtonText : 'Xác nhận'}
        </Text>
      </TouchableHighlight>
    );
  };

  render() {
    const { customStyles = {}, disabledOpenDateRange = false } = this.props;

    let style = styles.stylish;
    style = this.props.centerAlign ? { ...style } : style;
    style = { ...style, ...this.props.style };

    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        disabled={disabledOpenDateRange}
        onPress={() => {
          this.setModalVisible(true);
        }}
        style={[
          { flex: 0 },
          style
        ]}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {this.getTitleElement()}
          </View>
          <Modal
            animationType="slide"
            onRequestClose={() => this.setModalVisible(false)}
            transparent={false}
            visible={this.state.modalVisible}
          >
            <View stlye={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ height: '90%' }}>
                <DateRange
                  headFormat={this.props.headFormat}
                  customStyles={customStyles}
                  markText={this.props.markText}
                  onDatesChange={this.onDatesChange}
                  isDateBlocked={this.isDateBlocked}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  focusedInput={this.state.focus}
                  selectedBgColor={this.props.selectedBgColor || undefined}
                  selectedTextColor={this.props.selectedTextColor || undefined}
                  mode={this.props.mode || 'single'}
                  currentDate={this.state.currentDate}
                />
              </View>
              <View
                style={{
                  paddingBottom: '5%',
                  width: '100%',
                  height: '10%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {this.renderButton()}
              </View>
            </View>
          </Modal>
        </View>
      </TouchableHighlight>
    );
  }
}

ComposePicker.propTypes = {
  dateSplitter: PropTypes.string
};

ComposePicker.defaultProps = { dateSplitter: '-' };
