package com.bhashasetu.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private TextToSpeech nativeTts;
    private boolean isTtsReady = false;
    private String pendingSpeak = null;

    private void speakNative(String text) {
        if (text == null || text.trim().isEmpty()) return;
        if (nativeTts != null) {
            try {
                android.widget.Toast.makeText(MainActivity.this, "🔊 " + text, android.widget.Toast.LENGTH_SHORT).show();
            } catch (Exception ignored) {}
            nativeTts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PalashSetuTTS_" + System.currentTimeMillis());
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Native Android TextToSpeech Engine
        nativeTts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                isTtsReady = true;
                int result = nativeTts.setLanguage(new Locale("hi", "IN"));
                if (result < 0) {
                    result = nativeTts.setLanguage(new Locale("hi"));
                }
                if (result < 0) {
                    result = nativeTts.setLanguage(new Locale("en", "IN"));
                }
                if (result < 0) {
                    nativeTts.setLanguage(Locale.getDefault());
                }
                nativeTts.setSpeechRate(0.85f);
                if (pendingSpeak != null) {
                    final String toSpeak = pendingSpeak;
                    pendingSpeak = null;
                    runOnUiThread(() -> speakNative(toSpeak));
                }
            }
        });

        // Request runtime RECORD_AUDIO permission if not yet granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS},
                    101);
        }

        // Grant webview audio capture permission & inject helper bridge
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(() -> request.grant(request.getResources()));
                }
            });

            this.bridge.getWebView().addJavascriptInterface(new Object() {
                @android.webkit.JavascriptInterface
                public void speak(String text) {
                    if (text == null || text.trim().isEmpty()) return;
                    runOnUiThread(() -> {
                        if (!isTtsReady) {
                            pendingSpeak = text;
                        } else {
                            speakNative(text);
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void print() {
                    runOnUiThread(() -> {
                        try {
                            if (bridge != null && bridge.getWebView() != null) {
                                android.print.PrintManager printManager = (android.print.PrintManager) getSystemService(android.content.Context.PRINT_SERVICE);
                                if (printManager != null) {
                                    android.print.PrintDocumentAdapter printAdapter = bridge.getWebView().createPrintDocumentAdapter("PalashSetu_Print");
                                    printManager.print("PalashSetu Worksheet", printAdapter, new android.print.PrintAttributes.Builder().build());
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void openVoiceInputSettings() {
                    try {
                        android.content.Intent intent = new android.content.Intent(android.provider.Settings.ACTION_VOICE_INPUT_SETTINGS);
                        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        try {
                            android.content.Intent fallback = new android.content.Intent(android.provider.Settings.ACTION_LOCALE_SETTINGS);
                            fallback.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(fallback);
                        } catch (Exception ignored) {}
                    }
                }

                @android.webkit.JavascriptInterface
                public void installTtsData() {
                    try {
                        android.content.Intent intent = new android.content.Intent(android.speech.tts.TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
                        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        openTtsSettings();
                    }
                }

                @android.webkit.JavascriptInterface
                public void openTtsSettings() {
                    try {
                        android.content.Intent intent = new android.content.Intent("com.android.settings.TTS_SETTINGS");
                        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        try {
                            android.content.Intent fallback = new android.content.Intent(android.provider.Settings.ACTION_SETTINGS);
                            fallback.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(fallback);
                        } catch (Exception ignored) {}
                    }
                }
            }, "AndroidVoiceBridge");
        }
    }

    @Override
    public void onDestroy() {
        if (nativeTts != null) {
            nativeTts.stop();
            nativeTts.shutdown();
        }
        super.onDestroy();
    }
}
