
import AsyncStorage from '@react-native-community/async-storage';

export default class StorageUtil {

    static USER_PROFILE = "userProfile";
    static USER_TOKEN = "userToken"; //Save user token
    static MOBILE_CONFIG = "mobileConfig";
    static FCM_TOKEN = "fcmToken";
    static VERSION = 'versionApp';
    static OTP_KEY = 'otpKey';
    static BANNER_AFTER_LOGIN = 'bannerAfterLogin';
    static PRODUCT_SEARCH_HISTORY = 'productSearchHistory';
    static RESCUING = 'rescuing';
    static FIREBASE_TOKEN = 'firebaseToken';
    static CART = 'cart';
    static NOTIFICATION_ID = 'notificationId';
    static LOGIN_INFO = 'loginInfo';
    static LIST_CHAT = 'listChat';
    static SEARCH_HISTORY = 'searchHistory';

    /**
     * Store data
     * @param {*} key 
     * @param {*} item 
     */
    static async storeItem (key, item) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Delete item with key
     * @param {*} key 
     */
    static async deleteItem (key) {
        try {
            var deleteItem = await AsyncStorage.removeItem(key);
            return deleteItem;
        } catch (error) {
            console("deleteItem   :", error.message)
        }
    }

    /**
     * Retry data
     * @param {*} key 
     */
    static async retrieveItem (key) {
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {
            console.log(error.message);
        }
        return
    }

    /**
     * Store item type is json
     * @param {*} key 
     * @param {*} item 
     */
    static async storeItemJson (key, item) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, item);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
}
