'use strict';
import React, { Component } from 'react';
import {
	View, TextInput, Image, StyleSheet, Text, ImageBackground, TouchableOpacity,
	TouchableHighlight, Keyboard, Dimensions, SafeAreaView, StatusBar, BackHandler
} from 'react-native';
import {
	Container, Form, Content, Item, Input, Button, Right, Icon, Header, Root,
	Left, Body, Title, Toast,
} from 'native-base';
import ButtonComp from 'components/button';
import StringUtil from 'utils/stringUtil';
import styles from './styles';
import { localizes } from 'locales/i18n';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { ErrorCode } from 'config/errorCode';
import Utils from 'utils/utils';
import StorageUtil from 'utils/storageUtil';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from '@react-native-community/google-signin';
import {
	AccessToken,
	LoginManager,
	GraphRequest,
	GraphRequestManager,
	LoginButton,
} from 'react-native-fbsdk';
import GenderType from 'enum/genderType';
import statusType from 'enum/statusType';
import screenType from 'enum/screenType';
import messing from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import bannerType from 'enum/bannerType';
import TextInputCustom from 'components/textInputCustom';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import { configConstants } from 'values/configConstants';
import ic_eye_close from 'images/ic_eye_close.png';
import ic_eye_blue from 'images/ic_eye_blue.png';
import ic_hide from 'images/ic_cancel_blue.png';
import LinearGradient from 'react-native-linear-gradient';
import BaseView from 'containers/base/baseView';
import appType from 'enum/appType';
import otpType from 'enum/otpType';
import ApiUtil from 'utils/apiUtil';
import DialogCustom from 'components/dialogCustom';
import ic_back_blue from 'images/ic_back_blue.png';
import ic_back_white from 'images/ic_back_white.png';
import ic_login_fb from 'images/ic_login_fb.png';
import ic_login_google from 'images/ic_login_google.png';
import login from 'images/login.png';
import LoginType from 'enum/loginType';
import notificationType from 'enum/notificationType';

const screen = Dimensions.get('window');
const FACEBOOK_LOGIN = 1;
const GOOGLE_LOGIN = 2;
const DEFAULT_LOGIN = 0;
GoogleSignin.configure({
	iosClientId: configConstants.KEY_IOS_CLIENT_ID_GOOGLE,
});

class LoginView extends BaseView {
	constructor(props) {
		super(props);
		const { route } = this.props;
		this.state = {
			hidePassword: true,
			password: null,
			phone: null,
			user: null,
			errorSignIn: null,
			remindLogin: true,
			textInputWidth: '100%',
			isAlertExitApp: false
		};
		this.hidePassword = true;
		this.onChangePhone = this.onChangePhone.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.googleData = {};
		this.facebookData = {};
		this.loginType = DEFAULT_LOGIN;
		this.logOuted = true;
		if (!Utils.isNull(route.params)) {
			!route.params.logOuted ? this.logOuted = route.params.logOuted : this.logOuted = true;
		}
	}

	/** 
	 * manage password visibility
	 */
	managePasswordVisibility = () => {		// function used to change password visibility
		let last = this.state.password;
		this.setState({ hidePassword: !this.state.hidePassword, password: '' });
		setTimeout(() => {
			this.setState({ password: last });
		});
	};

	/**
	 * Validate data
	 */
	validateData () {
		const { phone, password } = this.state;
		let res1 = null;
		if (phone != null) {
			res1 = phone.trim().charAt(0);
		}
		if (Utils.isNull(phone) || phone.trim().length == 0) {
			this.showMessage(localizes('login.vali_fill_phone'));
			this.setState({
				phone: ''
			}, () => {
				this.rPhone.focus();
			})

			return false;
		}
		// số điện thoại có khoảng trắng bên trong 
		else if (phone.trim().includes(' ')) {
			this.showMessage(localizes('login.phone_or_password_invalid'));
			this.rPhone.focus();
			return false;
		}

		// số điện thoại có ký tự đặc biệt 
		else if (Utils.validatePhoneContainSpecialCharacter(phone.trim())) {
			this.showMessage(localizes('login.phone_or_password_invalid'));
			this.rPhone.focus();
			return false;
		}
		// số điện thoại có chữ 
		else if (Utils.validatePhoneContainWord(phone.trim())) {
			this.showMessage(localizes('login.phone_or_password_invalid'));
			this.rPhone.focus();
			return false;
		}
		else if (phone.trim().length !== 10) {
			this.showMessage(localizes('login.phone_or_password_invalid'));
			this.rPhone.focus();
			return false;
		}


		else if (res1 != '0') {
			this.showMessage(localizes('login.phone_or_password_invalid'));
			this.rPhone.focus();
			return false;
		} else if (!Utils.validatePhone(phone.trim())) {
			this.showMessage(localizes('login.vali_phone'));
			this.rPhone.focus();
			return false;
		} else if (StringUtil.isNullOrEmpty(password)) {
			// else if (!Utils.validateEmail(phone) && !phone.replace(/[^0-9]/g, "")) {
			//     this.showMessage(localizes("userProfileView.email_notFormat"))
			//     return false
			// }
			this.showMessage(localizes('login.vali_fill_password'));
			this.rPassword.focus();
			return false;
		}
		return true;
	}
	/**
	   * Login
	   */
	login () {
		Keyboard.dismiss();
		console.log(StringUtil.capitalizeFirstLetter('login'));
		if (this.validateData()) {
			let data = {
				// email: Utils.validateEmail(this.state.phone) ? this.state.phone : "",
				phone: this.state.phone.trim(),
				password: this.state.password.trim(),
			};
			this.props.login(data);
		}
	}

	/**
	   * ForgotPassword
	   */
	forgotPasswordView () {
		this.props.navigation.navigate('ForgotPassword', {
			fromScreen: screenType.FROM_FORGET_PASSWORD,
			dataUser: null,
		});
	}

	/**
	   * Login via Google
	   */
	loginGoogle = async () => {
		Keyboard.dismiss();
		try {
			await this.signOutGG('Google');
			await GoogleSignin.hasPlayServices();
			await GoogleSignin.configure({ webClientId: "238596347640-uli8d0ibccfab008j335eb502r3q798p.apps.googleusercontent.com", offlineAccess: true });
			const userInfo = await GoogleSignin.signIn();
			console.log('==== User GOOGLE: ====', userInfo);
			let user = userInfo.user;
			let newName = user.givenName + " " + user.familyName;
			let data = {
				email: user.email,
				avatarPath: user.photo,
				socialId: user.id,
				name: newName,
				loginType: LoginType.GOOGLE
			};

			console.log('==== User GOOGLE: ====', data);
			this.props.loginViaSocial(data);
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// user cancelled the login flow
				console.log("user cancelled the login flow");
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log("operation (e.g. sign in) is in progress already");
				// operation (e.g. sign in) is in progress already
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log("play services not available or outdated");
				// play services not available or outdated
			} else {
				// some other error happened
				console.log(error);
			}
		}
	};

	/**
	   * Login via Facebook
	   */
	loginFacebook = async () => {
		console.log('Login facebook');
		Keyboard.dismiss();
		try {
			await this.signOutFB('Facebook');
			LoginManager.logInWithPermissions([
				'public_profile',
				'email',
			]).then(result => {
				if (result.isCancelled) {
					return;
				}
				AccessToken.getCurrentAccessToken().then(data => {
					console.log(data);
					const responseInfoCallback = (error, profile) => {
						if (error) {
							console.log(error);
						} else {
							console.log('Data FACEBOOK: ', profile);
							let data = {
								email: profile.email,
								avatarPath: 'https://graph.facebook.com/' +
									profile.id +
									'/picture?type=normal',
								socialId: profile.id,
								name: profile.name,
								loginType: LoginType.FACEBOOK
							};
							this.facebookData = data;
							this.props.loginViaSocial(data)
						}
					};
					const accessToken = data.accessToken;
					const infoRequest = new GraphRequest(
						'/me',
						{
							accessToken,
							parameters: {
								fields: {
									string: 'name,gender,email',
								},
							},
						},
						responseInfoCallback
					);
					new GraphRequestManager().addRequest(infoRequest).start();
				});
			});
		} catch (e) {
			console.log(e);
		}
	};

	componentDidMount () {
		BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
		GoogleSignin.hasPlayServices({ autoResolve: true });
	}

	componentWillReceiveProps (nextProps) {
		if (this.props !== nextProps) {
			this.props = nextProps;
			this.handleData();
		}
	}

	componentWillUnmount = () => {
		BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
	}

	/** 
	 * on press forgot password 
	 */
	onPressForgotPassword = () => {
		this.props.navigation.navigate('ForgotPassword', {
			'fromScreen': screenType.FROM_FORGET_PASSWORD,
			'dataUser': null
		})
	};

	/** 
	 * on press register 
	 */
	onPressRegister = () => {
		this.props.navigation.navigate('Register');
	};

	/**
	   * Handle data when request
	   */
	handleData () {
		if (this.props.errorCode != ErrorCode.ERROR_INIT) {
			if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
				if (
					this.props.action == getActionSuccess(ActionEvent.LOGIN) ||
					this.props.action == getActionSuccess(ActionEvent.LOGIN_SOCIAL)
				) {
					let data = this.props.data;
					if (data.status == statusType.ACTIVE) {
						StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
						//Save token login
						StorageUtil.storeItem(StorageUtil.USER_TOKEN, data.token);
						StorageUtil.storeItem(
							StorageUtil.FIREBASE_TOKEN,
							data.firebaseToken
						);
						global.token = data.token;
						console.log("USER TOKEN ", global.token);
						global.firebaseToken = data.firebaseToken;
						this.props.getUserProfile(data.id);
						this.props.notifyLoginSuccess();
						// this.props.getNotificationsRequest({
						// 	userId: data.id,
						// 	paging: {
						// 		pageSize: Constants.PAGE_SIZE,
						// 		page: 0,
						// 	},
						// });
						if (this.props.route.params) {
							const { router } = this.props.route.params;
							if (!Utils.isNull(router)) {
								if (router.params && router.params.screenType == screenType.JOB_DETAIL_VIEW) {
									if (router.params.callBack) {
										router.params.callBack(data.id);
									}
									setTimeout(() => {
										this.onBack()
									}, 1000)
								} else {
									this.props.navigation.navigate(router.name, router.params);
								}
							}
						} else {
							this.goHomeScreen();
						}
						this.signInWithCustomToken(data.id)
						setTimeout(() => {
							this.refreshToken();
						}, 1000)

						global.logout = false
					}
				}
			} else if (
				this.props.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH
			) {
				this.showMessage(localizes('login.phone_or_password_invalid'));
				this.rPassword.focus();
			} else if (this.props.errorCode == ErrorCode.USER_MUST_CONFIRM_INFORMATION) {
				let socialType = this.props.action == getActionSuccess(ActionEvent.LOGIN_FB) ? 'facebook' : 'google';
				let dataUser = socialType == 'facebook' ? this.facebookData : this.googleData;
				this.props.navigation.navigate('ConfirmRegister', {
					fromScreen: screenType.FROM_LOGIN_SOCIAL,
					phone: dataUser,
					sendType: otpType.REGISTER_BY_SOCIAL,
					// dataUser: data,
					socialType: socialType,
					dataUser: dataUser
				});
			}
			else if (this.props.errorCode == ErrorCode.INVALID_ACCOUNT) {
				this.showMessage(localizes('login.phone_or_password_invalid'));
				this.rPhone.focus();
			} else if (this.props.errorCode == ErrorCode.USER_HAS_BEEN_DELETED) {
				this.showMessage(localizes('login.userHasBeenDeleted'));
				this.rPhone.focus();
			} else if (this.props.errorCode == ErrorCode.USER_EMAIL_ALREADY_TAKEN) {
				// this.showMessage(localizes('error_email_already_exist'));
				if (this.loginType == FACEBOOK_LOGIN) {
					this.props.navigation.navigate('ConfirmRegister', {
						fromScreen: screenType.FROM_LOGIN_SOCIAL,
						phone: this.facebookData,
						sendType: otpType.REGISTER_BY_SOCIAL,
						// dataUser: data,
						socialType: 'facebook',
						dataUser: this.facebookData
					});
				} else if (this.loginType == GOOGLE_LOGIN) {
					this.showMessage("Email liên kết với tài khoản này đã tồn tại , vui lòng đăng nhập bằng tài khoản khác!");
				}
			} else {
				this.handleError(this.props.errorCode, this.props.error);
			}
		}
	}

	renderTextBottom = () => {
		return (
			<View style={{ alignItems: 'center' }}>
				<TouchableOpacity
					activeOpacity={Constants.ACTIVE_OPACITY}
					onPress={() => this.onPressForgotPassword()}
				>
					<Text style={[commonStyles.text, {
						color: Colors.COLOR_TEXT,
						textDecorationLine: 'underline', marginBottom: 8
					}]}>
						{localizes('login.forgot_password')}
					</Text>
				</TouchableOpacity>
				<Text
					style={[commonStyles.text, {
						color: Colors.COLOR_TEXT,
					}]}
				>
					{localizes('login.notAccountYet')}
					<Text onPress={() => this.onPressRegister()} style={[commonStyles.textBold, styles.textRegister]}>
						{" " + localizes('login.register')}
					</Text>
				</Text>
			</View>
		)
	}

	renderButtonLoginSocial = () => {
		return (
			<View style={styles.buttonSocial}>
				<TouchableOpacity
					onPress={this.loginFacebook}
					activeOpacity={Constants.ACTIVE_OPACITY}
					style={{ marginHorizontal: Constants.MARGIN_LARGE }}>
					<Image style={{ width: 36, height: 36 }}
						source={ic_login_fb} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={this.loginGoogle}
					activeOpacity={Constants.ACTIVE_OPACITY}
					style={{ marginHorizontal: Constants.MARGIN_LARGE }}>
					<Image style={{ width: 36, height: 36 }}
						source={ic_login_google} />
				</TouchableOpacity>
			</View>
		)
	}

	render () {
		const { user, signInError, remindLogin } = this.state;
		StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true);
		return (
			<Container style={[styles.container]}>
				<Root>
					<View style={{
						position: 'absolute',
						top: 0, left: 0, justifyContent: 'center'
					}}>
						<Image source={login} style={{
							width: Constants.MAX_WIDTH,
							height: Constants.MAX_WIDTH / 1.8,
						}} />
					</View>

					<Content
						keyboardShouldPersistTaps='handled'
						contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'stretch' }}
						style={[{ flex: 1 }]}
					>

						<View style={{ flex: 1, justifyContent: 'center' }}>
							<Text style={[commonStyles.titleInputForm, {
								textAlign: 'center',
								marginBottom: Constants.MARGIN_XX_LARGE,
								color: Colors.COLOR_TEXT,
							}]}>Đăng nhập</Text>
							<View style={{ marginVertical: Constants.MARGIN_X_LARGE }}>
								<TextInputCustom
									backgroundColor={Colors.COLOR_TRANSPARENT}
									placeholder={localizes('login.input_phone')}
									styleTextInput={{ marginHorizontal: Constants.MARGIN_X_LARGE }}
									refInput={r => (this.rPhone = r)}
									isInputNormal={true}
									value={this.state.phone}
									onChangeText={this.onChangePhone}
									inputNormalStyle={styles.inputNormal}
									onSubmitEditing={() => {
										this.rPassword.focus();
									}}
									returnKeyType={'next'}
									keyboardType="phone-pad"
									titleTop={-24}
									inputNormalStyle={{ color: Colors.COLOR_TEXT }}
									onPressPlaceHolder={() => { this.rPhone.focus() }}
								/>
							</View>
							<View
								style={{
									justifyContent: 'center',
									position: 'relative',
									marginVertical: Constants.MARGIN_X_LARGE
								}}
							>
								<TextInputCustom
									inputNormalStyle={{ color: Colors.COLOR_TEXT }}
									backgroundColor={Colors.COLOR_TRANSPARENT}
									styleTextInput={{ marginHorizontal: Constants.MARGIN_X_LARGE }}
									refInput={ref => (this.rPassword = ref)}
									isInputNormal={true}
									placeholder={localizes('login.password')}
									value={this.state.password}
									secureTextEntry={this.state.hidePassword}
									inputNormalStyle={styles.inputNormal}
									onChangeText={this.onChangePassword}
									onSelectionChange={({ nativeEvent: { selection } }) => {
										console.log(this.className, selection);
									}}
									onSubmitEditing={() => {
										this.login();
									}}
									returnKeyType={'done'}
									visibleHr={true}
									titleTop={-24}
									onPressPlaceHolder={() => { this.rPassword.focus() }}
								/>
								<TouchableHighlight
									onPress={() => this.managePasswordVisibility()}
									style={[commonStyles.shadowOffset, {
										position: 'absolute', padding: Constants.PADDING_LARGE,
										right: Constants.PADDING_X_LARGE + Constants.PADDING,
									}]}
									underlayColor='transparent'
								>
									<Image style={{ resizeMode: 'contain', width: 18, height: 18 }}
										source={(this.state.hidePassword) ? ic_eye_blue : ic_eye_close} />
								</TouchableHighlight>
							</View>
							<TouchableOpacity
								activeOpacity={Constants.ACTIVE_OPACITY}
								onPress={() => this.login()}
								style={styles.buttonLogin}>
								<Text style={[commonStyles.text, {
									color: Colors.COLOR_WHITE,
									fontSize: Fonts.FONT_SIZE_XX_MEDIUM
								}]}>Đăng nhập</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.containerRegister_1}>
							{this.renderButtonLoginSocial()}
							{this.renderTextBottom()}
						</View>
					</Content>
					{this.showLoadingBar(this.props.isLoading)}
				</Root>
				<TouchableOpacity
					onPress={() => { this.onBack(); }}
					style={{
						padding: Constants.PADDING_X_LARGE,
						position: 'absolute',
						top: 0, left: 0
					}}>
					<Image source={ic_back_white} />
				</TouchableOpacity>
			</Container>
		);
	}



	/**
	 * toggle remind login 
	 */
	toggleRemindLogin () {
		this.setState({ remindLogin: !this.state.remindLogin });
	}

	/**
	 * on change password
	 * @param {*} password 
	 */
	onChangePassword (password) {
		this.setState({
			password,
		});
	}

	/**
	 * on change phone
	 * @param {*} phone 
	 */
	onChangePhone (phone) {
		this.setState({
			phone,
		});
	}
}

const mapStateToProps = state => ({
	data: state.login.data,
	isLoading: state.login.isLoading,
	error: state.login.error,
	errorCode: state.login.errorCode,
	action: state.login.action,
});

const mapDispatchToProps = {
	...actions,
	...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
