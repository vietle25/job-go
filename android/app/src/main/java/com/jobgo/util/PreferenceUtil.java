package com.jobgo.util;

import android.content.Context;
import android.preference.PreferenceManager;

public class PreferenceUtil {

    public static String KEY_LANGUAGE = "KEY_LANGUAGE";

    /**
     * Save config
     * @param context
     * @param key
     * @param value
     */
    public static void saveConfig(Context context, String key, String value) {
        PreferenceManager.getDefaultSharedPreferences(context).edit().putString(key,
                value).apply();
    }

    /**
     * Get config
     * @param context
     * @param key
     */
    public static String getConfig(Context context, String key) {
       return PreferenceManager.getDefaultSharedPreferences(context).getString(key,
                null);
    }

}
