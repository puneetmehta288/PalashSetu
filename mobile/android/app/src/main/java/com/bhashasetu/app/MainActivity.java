package com.bhashasetu.app;

import android.Manifest;
import android.app.AlertDialog;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.content.Intent;
import android.net.Uri;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private TextToSpeech nativeTts;
    private boolean isTtsReady = false;
    private String pendingSpeak = null;
    private ValueCallback<Uri[]> mFilePathCallback;
    private final static int FILE_CHOOSER_REQUEST_CODE = 1001;

    private void speakNative(String text) {
        if (text == null || text.trim().isEmpty()) return;
        if (nativeTts != null) {
            nativeTts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PalashVaniTTS_" + System.currentTimeMillis());
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Enable true immersive fullscreen mode for classroom tablets
        getWindow().setFlags(
            android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN,
            android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
            getWindow().getAttributes().layoutInDisplayCutoutMode =
                android.view.WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }
        applyFullscreen();

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

                @Override
                public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                    if (mFilePathCallback != null) {
                        mFilePathCallback.onReceiveValue(null);
                    }
                    mFilePathCallback = filePathCallback;

                    Intent intent = fileChooserParams.createIntent();
                    try {
                        startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                    } catch (Exception e) {
                        mFilePathCallback = null;
                        return false;
                    }
                    return true;
                }

                @Override
                public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                    new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Palash Vani")
                        .setMessage(message)
                        .setPositiveButton(android.R.string.ok, (dialog, which) -> result.confirm())
                        .setCancelable(false)
                        .create()
                        .show();
                    return true;
                }

                @Override
                public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                    new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Palash Vani")
                        .setMessage(message)
                        .setPositiveButton(android.R.string.ok, (dialog, which) -> result.confirm())
                        .setNegativeButton(android.R.string.cancel, (dialog, which) -> result.cancel())
                        .setCancelable(false)
                        .create()
                        .show();
                    return true;
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
                                    android.print.PrintDocumentAdapter printAdapter = bridge.getWebView().createPrintDocumentAdapter("PalashVani_Print");
                                    printManager.print("Palash Vani Worksheet", printAdapter, new android.print.PrintAttributes.Builder().build());
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
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (mFilePathCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    } else if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    }
                }
                mFilePathCallback.onReceiveValue(results);
                mFilePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    private void applyFullscreen() {
        android.view.View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
            android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
            | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyFullscreen();
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
