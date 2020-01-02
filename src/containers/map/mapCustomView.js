import React, {Component} from "react";
import PropTypes from 'prop-types';
import {
    ImageBackground, Dimensions, View, StatusBar, StyleSheet,
    TextInput, ScrollView, TouchableOpacity, Image, Keyboard,
    Platform
} from "react-native";
import {
    Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body,
    Content, Text, Card, CardItem, Fab, Footer, Input, Item
} from "native-base";
import {Constants} from 'values/constants'
import {Colors} from "values/colors";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import {Fonts} from "values/fonts";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import StringUtil from "utils/stringUtil";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import DialogCustom from "components/dialogCustom";
import RNSettings from 'react-native-settings'
import ic_call_blue from 'images/ic_call_blue.png'
import ic_my_location_black from 'images/ic_my_location_black.png'
import ic_user_location_blue from 'images/ic_user_location_blue.png'
import MapDirections from "./directions/mapDirections";
import {Spinner} from "native-base";

import InputAutocomplete from "containers/map/autocomplete/inputAutocomplete";
import styles from './styles';
import FlatListCustom from "components/flatListCustom";
import screenType from "enum/screenType";

const screen = Dimensions.get("window");

class MapCustomView extends Component {

    static propTypes = {
        visibleMakerMyLocation: PropTypes.bool,
        visibleMaker: PropTypes.bool,
        visibleDirections: PropTypes.bool,
        visibleLoadingBar: PropTypes.bool,
        visibleButtonLocation: PropTypes.bool,
        visibleAutocomplete: PropTypes.bool,
        region: PropTypes.object,
    }

    static defaultProps = {
        visibleMakerMyLocation: false,
        visibleMaker: false,
        visibleDirections: false,
        visibleLoadingBar: false,
        visibleButtonLocation: false,
        visibleAutocomplete: false,
        region: null
    }

    constructor(props) {
        super(props)
        this.state = {
            turnOnGPS: true,
            isAlertGPS: false,
            firstLoadCoordinate: false
        };
        this.region = null;
        this.coordinate = null;
        this.initialRegion = {
            latitude: 10.56711109577269,
            latitudeDelta: 2.2360251163742255,
            longitude: 106.72833563759923,
            longitudeDelta: 1.3763229176402092
        };
    }

    componentDidMount () {

    }

    /**
     * Go to setting gps
     */
    gotoSettingGPS () {
        RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).
            then((result) => {
                if (result === RNSettings.ENABLED) {
                    console.log('location is enabled')
                }
            })
        this.setState({isAlertGPS: false})
    }

    onRegionChange (region) {
        this.region = region
    }

    onMapReady = () => {
    }

    onUserLocationChange (event) {
        const {isGetRegion} = this.props
        const {firstLoadCoordinate} = this.state
        if (isGetRegion) {
            const {coordinate} = event.nativeEvent
            let newCoordinate = {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0,
                longitudeDelta: 0,
            }
            if (!firstLoadCoordinate) {
                this.setState({firstLoadCoordinate: true})
            }
            this.coordinate = new MapView.AnimatedRegion(newCoordinate)
            if (Platform.OS === "android") {
                if (this.markerMyLocation) {
                    this.markerMyLocation._component.animateMarkerToCoordinate(
                        newCoordinate,
                        500
                    );
                }
            } else {
                this.coordinate.timing(newCoordinate).start();
            }
        }
    }

    animateTo (region) {
        setTimeout(() => {
            !Utils.isNull(this.map) && !Utils.isNull(region) ? this.map.animateToRegion(region, 1000) : null
        }, 1000)
    }

    fitTo (latLongs) {
        setTimeout(() => {
            !Utils.isNull(this.map) && !Utils.isNull(latLongs) && latLongs.length > 0 ?
                this.map.fitToCoordinates(latLongs, {
                    edgePadding: {
                        top: 300,
                        right: Constants.MARGIN_X_LARGE,
                        bottom: 400,
                        left: Constants.MARGIN_X_LARGE
                    },
                    animated: false
                }) : null
        }, 1000)
    }

    componentWillReceiveProps (nextProps) {
        if (!Utils.isNull(nextProps.latLongs)) {
            this.fitTo(nextProps.latLongs)
        } else {
            if (Utils.isNull(this.region)) {
                this.region = nextProps.region
            }
            if (!nextProps.isGetRegion) {
                this.animateTo(nextProps.region)
                if (!Utils.isNull(nextProps.coordinate)) {
                    this.coordinate = nextProps.coordinate
                }
            }
        }
    }

    render () {
        const {onPressMap, styleViewBottom = {}} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <MapView
                        ref={ref => (this.map = ref)}
                        mapType={"standard"}
                        style={styles.map}
                        onMapReady={this.onMapReady}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={this.initialRegion}
                        region={this.region}
                        onRegionChange={this.onRegionChange.bind(this)}
                        showsMyLocationButton={false}
                        showsUserLocation={true}
                        onUserLocationChange={this.onUserLocationChange.bind(this)}
                        onPress={(event) => onPressMap ? onPressMap(event) : null}
                        moveOnMarkerPress={true}
                    >
                        {/* Render marker my location */}
                        {this.props.visibleMakerMyLocation ? this.addMarkerMyLocation() : null}
                        {/* Render marker */}
                        {this.props.visibleMaker ? this.addMarker() : null}
                        {/* Render directions */}
                        {this.props.visibleDirections ? this.renderDirections() : null}
                    </MapView>
                    <View style={[styles.viewBottom, styleViewBottom]}>
                        <View style={styles.myLocation}>
                            {/* Render loading bar */}
                            {/* {this.props.visibleLoadingBar ? this.renderLoadingBar() : null} */}
                            {/* Render button location */}
                            {/* {this.props.visibleButtonLocation ? this.renderButtonLocation() : null} */}
                        </View>
                        {this.props.renderBottomMap && this.props.renderBottomMap()}
                    </View>
                    <View style={{position: 'absolute', top: 0, right: 0, left: 0}}>
                        {/* Render search box */}
                        {this.props.visibleAutocomplete ? this.renderAutocomplete() : null}
                        {this.props.renderSearch && this.props.renderSearch()}
                    </View>
                    {this.props.fromScreen == screenType.FROM_REGISTER_APPOINTMENT
                        || this.props.fromScreen == screenType.FROM_CART
                        ? <View style={{flex: 1, justifyContent: "flex-end", bottom: Constants.PADDING_X_LARGE}}>
                            <TouchableOpacity
                                onPress={() => this.props.onPressAccept()}
                                style={{
                                    paddingVertical: Constants.MARGIN_LARGE + 2,
                                    width: screen.width - Constants.PADDING_XX_LARGE,
                                    backgroundColor: Colors.COLOR_GOOGLE,
                                    borderRadius: Constants.CORNER_RADIUS
                                }}
                            >
                                <Text style={[commonStyles.text, {color: Colors.COLOR_WHITE, textAlign: "center"}]} >Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </View>
                {this.renderAlertNotificationGPS()}
            </View>
        );
    }

    /**
     * Back to my location
     */
    backToMyLocation () {
        this.props.onGetGeoLocation();
    }

    /**
     * Render Search Box
     */
    renderAutocomplete () {
        const {address, onSetAddressInput} = this.props;
        return (
            <InputAutocomplete address={address} onSetAddressInput={onSetAddressInput} />
        );
    };

    /**
     * Render Button Location
     */
    renderButtonLocation () {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => this.backToMyLocation()}>
                <View style={[styles.myLocationButton]}>
                    <Image source={ic_my_location_black} />
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Render Loading Bar
     */
    renderLoadingBar () {
        const {turnOnGPS} = this.state;
        return (
            <View>
                {turnOnGPS ?
                    Utils.isNull(this.region)
                        ? <View style={[styles.loadingBar]}>
                            <Spinner color={Colors.COLOR_PRIMARY} />
                            <Text style={commonStyles.text}>Đang lấy vị trí của bạn!</Text>
                        </View>
                        : null
                    : Utils.isNull(this.region)
                        ? <TouchableOpacity
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => this.gotoSettingGPS()}  >
                            <View style={[styles.loadingBar]}>
                                <Text style={commonStyles.text}>Bật GPS và thử lại!</Text>
                            </View>
                        </TouchableOpacity>
                        : null
                }
            </View>

        )
    }

    /**
     * Render directions
     */
    renderDirections () {
        const {origin, destination} = this.props
        if (Utils.isNull(origin) || Utils.isNull(destination)) {
            return null
        }
        return (
            <MapDirections
                origin={origin}
                destination={destination}
                onReady={result => !Utils.isNull(this.map) ? setTimeout(() => {
                    this.map.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                            right: Constants.MARGIN_X_LARGE,
                            left: Constants.MARGIN_X_LARGE,
                            top: Constants.MARGIN_X_LARGE,
                            bottom: Constants.MARGIN_X_LARGE
                        },
                        animated: false
                    })
                }, 1000) : null}
            />
        )
    }

    /**
     * Add markers
     */
    addMarker () {
        const {markers = [], iconMarker} = this.props;
        if (Utils.isNull(markers)) {
            return null
        }
        return (
            markers.map((marker) => {
                return (
                    !Utils.isNull(marker.latitude || !Utils.isNull(marker.longitude)) ?
                        <MapView.Marker
                            key={marker.id}
                            ref={ref => (this.marker = ref)}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                            anchor={{x: 0.5, y: 1}}
                            onPress={() => this.props.onPressMarker(marker)}
                        >
                            {!Utils.isNull(iconMarker) ?
                                <View style={{backgroundColor: Colors.COLOR_TRANSPARENT, borderRadius: Constants.CORNER_RADIUS}}>
                                    <Image source={iconMarker} />
                                </View>
                                : null
                            }
                            {this.props.fromScreen == screenType.FROM_REGISTER_APPOINTMENT
                                || this.props.fromScreen == screenType.FROM_CART
                                ? <MapView.Callout
                                    tooltip={true}>
                                    <View style={[styles.callOut, {backgroundColor: Colors.COLOR_PRIMARY}]}>
                                        <Text style={[styles.titleCallout, {color: Colors.COLOR_WHITE}]} numberOfLines={2}>{marker.name}</Text>
                                        <Text style={[styles.desCallout, {color: Colors.COLOR_WHITE}]} numberOfLines={3}>Địa chỉ: {marker.address}</Text>
                                    </View>
                                </MapView.Callout>
                                : null
                            }
                        </MapView.Marker> : null
                )
            })
        )
    }

    /**
     * Add marker default with lat long
     */
    addMarkerMyLocation () {
        if (Utils.isNull(this.coordinate)) {
            return null
        }
        return (
            <MapView.Marker.Animated
                ref={ref => (this.markerMyLocation = ref)}
                coordinate={this.coordinate}
            >
                <Image source={ic_user_location_blue}
                    style={{
                        marginVertical: Constants.MARGIN_LARGE
                    }}>
                </Image>
            </MapView.Marker.Animated>
        )
    }

    /**
     * Render alert notification GPS
     */
    renderAlertNotificationGPS () {
        return (
            <DialogCustom
                visible={this.state.isAlertGPS}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={"Thông báo"}
                textBtnOne={"Không, cảm ơn"}
                textBtnTwo={"Bật"}
                contentText={"Bật GPS để định vị chính xác hơn!"}
                onTouchOutside={() => {this.setState({isAlertGPS: false})}}
                onPressX={() => {
                    this.setState({isAlertGPS: false})
                }}
                onPressBtnPositive={() => {
                    this.gotoSettingGPS()
                }}
            />
        )
    }
}
export default MapCustomView;