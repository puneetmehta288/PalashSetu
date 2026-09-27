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
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private TextToSpeech nativeTts;
    private boolean isTtsReady = false;
    private String pendingSpeak = null;
    private ValueCallback<Uri[]> mFilePathCallback;
    private final static int FILE_CHOOSER_REQUEST_CODE = 1001;
    private static LocalClassroomServer localServer = null;

    private void startLocalRelayServer() {
        if (localServer == null) {
            try {
                localServer = new LocalClassroomServer(8888);
                localServer.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void speakNative(String text) {
        if (text == null || text.trim().isEmpty()) return;
        if (nativeTts != null) {
            nativeTts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PalashVaniTTS_" + System.currentTimeMillis());
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Start embedded zero-internet local hotspot relay server on port 8888
        startLocalRelayServer();

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

        // Request runtime RECORD_AUDIO and CAMERA permissions if not yet granted
        java.util.List<String> permissionsNeeded = new java.util.ArrayList<>();
        if (androidx.core.content.ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.RECORD_AUDIO);
        }
        if (androidx.core.content.ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.CAMERA);
        }
        if (androidx.core.content.ContextCompat.checkSelfPermission(this, Manifest.permission.MODIFY_AUDIO_SETTINGS)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.MODIFY_AUDIO_SETTINGS);
        }
        if (!permissionsNeeded.isEmpty()) {
            androidx.core.app.ActivityCompat.requestPermissions(this,
                    permissionsNeeded.toArray(new String[0]),
                    101);
        }

        // Grant webview audio/camera capture permission & inject helper bridge
        if (this.bridge != null && this.bridge.getWebView() != null) {
            android.webkit.WebSettings webSettings = this.bridge.getWebView().getSettings();
            webSettings.setMediaPlaybackRequiresUserGesture(false);
            webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
            webSettings.setAllowFileAccess(true);
            webSettings.setAllowContentAccess(true);

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
        if (localServer != null) {
            localServer.stop();
            localServer = null;
        }
        super.onDestroy();
    }

    // ══════════════════════════════════════════════════════════════════
    // OFFLINE HOTSPOT CLASSROOM SERVER (PORT 8888)
    // Zero-internet peer-to-peer relay for teacher hotspot & local WiFi
    // ══════════════════════════════════════════════════════════════════
    private static class RoomData {
        String roomCode;
        String teacherName = "शिक्षिका";
        String schoolName = "उत्क्रमित प्राथमिक विद्यालय";
        String grade = "कक्षा 1";
        long lastActive = System.currentTimeMillis();
        List<JSONObject> events = Collections.synchronizedList(new ArrayList<>());
        Map<String, JSONObject> students = new ConcurrentHashMap<>();
        Map<String, JSONObject> submissions = new ConcurrentHashMap<>();
    }

    private static class LocalClassroomServer {
        private final int port;
        private ServerSocket serverSocket;
        private boolean running = false;
        private final ExecutorService pool = Executors.newCachedThreadPool();
        private static final Map<String, RoomData> rooms = new ConcurrentHashMap<>();

        public LocalClassroomServer(int port) {
            this.port = port;
        }

        public void start() {
            if (running) return;
            running = true;
            pool.execute(() -> {
                try {
                    serverSocket = new ServerSocket(port);
                    while (running && !serverSocket.isClosed()) {
                        try {
                            Socket client = serverSocket.accept();
                            pool.execute(() -> handleClient(client));
                        } catch (Exception e) {
                            if (!running) break;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        public void stop() {
            running = false;
            try {
                if (serverSocket != null) serverSocket.close();
            } catch (Exception ignored) {}
            pool.shutdownNow();
        }

        private void handleClient(Socket socket) {
            try {
                socket.setSoTimeout(5000);
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
                OutputStream out = socket.getOutputStream();

                String line = in.readLine();
                if (line == null) {
                    socket.close();
                    return;
                }

                String[] parts = line.split(" ");
                if (parts.length < 2) {
                    socket.close();
                    return;
                }

                String method = parts[0].toUpperCase();
                String fullPath = parts[1];

                // Read headers
                int contentLength = 0;
                String header;
                while ((header = in.readLine()) != null && !header.isEmpty()) {
                    if (header.toLowerCase().startsWith("content-length:")) {
                        try {
                            contentLength = Integer.parseInt(header.substring(15).trim());
                        } catch (Exception ignored) {}
                    }
                }

                // Handle CORS preflight
                if ("OPTIONS".equals(method)) {
                    sendResponse(out, 200, "OK", "text/plain", "");
                    socket.close();
                    return;
                }

                // Handle /api/classroom
                if (fullPath.startsWith("/api/classroom")) {
                    if ("POST".equals(method)) {
                        char[] buf = new char[contentLength];
                        int read = 0;
                        while (read < contentLength) {
                            int r = in.read(buf, read, contentLength - read);
                            if (r == -1) break;
                            read += r;
                        }
                        String bodyStr = new String(buf, 0, read);
                        JSONObject body = new JSONObject(bodyStr.isEmpty() ? "{}" : bodyStr);
                        JSONObject resp = handlePost(body);
                        sendResponse(out, 200, "OK", "application/json; charset=utf-8", resp.toString());
                    } else if ("GET".equals(method)) {
                        Map<String, String> query = parseQuery(fullPath);
                        String roomCode = query.get("room");
                        long since = 0;
                        try {
                            if (query.containsKey("since")) since = Long.parseLong(query.get("since"));
                        } catch (Exception ignored) {}

                        JSONObject resp = handleGet(roomCode, since);
                        sendResponse(out, 200, "OK", "application/json; charset=utf-8", resp.toString());
                    } else {
                        sendResponse(out, 405, "Method Not Allowed", "text/plain", "Method Not Allowed");
                    }
                } else {
                    sendResponse(out, 404, "Not Found", "text/plain", "Not Found");
                }

                socket.close();
            } catch (Exception e) {
                try { socket.close(); } catch (Exception ignored) {}
            }
        }

        private JSONObject handlePost(JSONObject body) {
            JSONObject res = new JSONObject();
            try {
                String action = body.optString("action", "");
                String room = body.optString("room", "").trim().toUpperCase();
                if (room.isEmpty()) {
                    res.put("error", "Room required");
                    return res;
                }

                RoomData rd = rooms.computeIfAbsent(room, k -> {
                    RoomData r = new RoomData();
                    r.roomCode = k;
                    return r;
                });
                rd.lastActive = System.currentTimeMillis();

                if ("publish".equals(action)) {
                    if (body.has("teacherName")) rd.teacherName = body.optString("teacherName");
                    if (body.has("schoolName")) rd.schoolName = body.optString("schoolName");
                    if (body.has("grade")) rd.grade = body.optString("grade");
                    if (body.has("type") && body.has("data")) {
                        JSONObject ev = new JSONObject();
                        ev.put("id", "ev_" + System.currentTimeMillis() + "_" + Math.random());
                        ev.put("type", body.optString("type"));
                        ev.put("data", body.get("data"));
                        ev.put("timestamp", System.currentTimeMillis());
                        rd.events.add(ev);
                        if (rd.events.size() > 50) rd.events.remove(0);
                    }
                    res.put("success", true);
                } else if ("teacher_ping".equals(action)) {
                    if (body.has("teacherName")) rd.teacherName = body.optString("teacherName");
                    if (body.has("schoolName")) rd.schoolName = body.optString("schoolName");
                    if (body.has("grade")) rd.grade = body.optString("grade");
                    res.put("success", true);
                } else if ("student_ping".equals(action)) {
                    String stdId = body.optString("studentId", "std_" + Math.random());
                    JSONObject std = new JSONObject();
                    std.put("id", stdId);
                    std.put("name", body.optString("studentName", "विद्यार्थी"));
                    std.put("grade", body.optString("grade", rd.grade));
                    std.put("avatar", body.optString("avatar", "🎒"));
                    std.put("joinedAt", System.currentTimeMillis());
                    rd.students.put(stdId, std);

                    res.put("success", true);
                    res.put("teacherActive", (System.currentTimeMillis() - rd.lastActive) < 120000);
                    res.put("teacherName", rd.teacherName);
                    res.put("schoolName", rd.schoolName);
                    res.put("grade", rd.grade);
                    res.put("studentCount", rd.students.size());

                    JSONArray recent = new JSONArray();
                    for (int i = Math.max(0, rd.events.size() - 5); i < rd.events.size(); i++) {
                        recent.put(rd.events.get(i));
                    }
                    res.put("recentEvents", recent);
                } else if ("submit_worksheet".equals(action)) {
                    JSONObject sub = body.has("submission") ? body.getJSONObject("submission") : body;
                    String stdId = sub.optString("student_id", sub.optString("studentId", "std_" + Math.random()));
                    String wsId = sub.optString("worksheet_id", sub.optString("worksheetId", "ws_default"));
                    rd.submissions.put(wsId + "_" + stdId, sub);
                    res.put("success", true);
                } else if ("clear_worksheet".equals(action)) {
                    JSONObject ev = new JSONObject();
                    ev.put("id", "ev_" + System.currentTimeMillis());
                    ev.put("type", "clear_worksheet");
                    ev.put("data", new JSONObject());
                    ev.put("timestamp", System.currentTimeMillis());
                    rd.events.add(ev);
                    res.put("success", true);
                } else {
                    res.put("success", true);
                }
            } catch (Exception e) {
                try { res.put("error", e.getMessage()); } catch (Exception ignored) {}
            }
            return res;
        }

        private JSONObject handleGet(String room, long since) {
            JSONObject res = new JSONObject();
            try {
                if (room == null || !rooms.containsKey(room.trim().toUpperCase())) {
                    res.put("exists", false);
                    return res;
                }
                RoomData rd = rooms.get(room.trim().toUpperCase());
                res.put("exists", true);
                res.put("teacherActive", (System.currentTimeMillis() - rd.lastActive) < 120000);
                res.put("teacherName", rd.teacherName);
                res.put("schoolName", rd.schoolName);
                res.put("grade", rd.grade);
                res.put("studentCount", rd.students.size());

                JSONArray evList = new JSONArray();
                synchronized (rd.events) {
                    for (JSONObject ev : rd.events) {
                        if (ev.optLong("timestamp", 0) > since) {
                            evList.put(ev);
                        }
                    }
                }
                res.put("events", evList);

                JSONArray stdList = new JSONArray();
                for (JSONObject st : rd.students.values()) {
                    stdList.put(st);
                }
                res.put("students", stdList);

                JSONArray subList = new JSONArray();
                for (JSONObject sub : rd.submissions.values()) {
                    subList.put(sub);
                }
                res.put("submissions", subList);
            } catch (Exception e) {
                try { res.put("error", e.getMessage()); } catch (Exception ignored) {}
            }
            return res;
        }

        private Map<String, String> parseQuery(String url) {
            Map<String, String> query = new HashMap<>();
            int qIdx = url.indexOf('?');
            if (qIdx != -1 && qIdx < url.length() - 1) {
                String qs = url.substring(qIdx + 1);
                for (String param : qs.split("&")) {
                    String[] pair = param.split("=");
                    if (pair.length == 2) {
                        try {
                            query.put(pair[0], URLDecoder.decode(pair[1], "UTF-8"));
                        } catch (Exception ignored) {}
                    }
                }
            }
            return query;
        }

        private void sendResponse(OutputStream out, int code, String msg, String contentType, String body) throws Exception {
            byte[] bytes = body.getBytes("UTF-8");
            String header = "HTTP/1.1 " + code + " " + msg + "\r\n"
                    + "Content-Type: " + contentType + "\r\n"
                    + "Access-Control-Allow-Origin: *\r\n"
                    + "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                    + "Access-Control-Allow-Headers: *\r\n"
                    + "Content-Length: " + bytes.length + "\r\n"
                    + "Connection: close\r\n\r\n";
            out.write(header.getBytes("UTF-8"));
            out.write(bytes);
            out.flush();
        }
    }
}
