package com.gatepay.catcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Drain antrian saat device boot. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Sender.drain(context.getApplicationContext());
    }
}
