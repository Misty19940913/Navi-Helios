# ERRORS.md - 錯誤記錄

---

## 錯誤 #NEW：誤判斷 Gemini API 問題

**日期**：2026-04-17
**觸發層級**：L1（系統性問題）
**類型**：假設錯誤

**描述**：
誤以為 Gemini API key 失效，實際上是 `gemini-2.0-flash` 模型已被 Google 停用。

**錯誤假設**：
- Gemini API 返回 403 PERMISSION_DENIED
- 直覺反應：key 失效

**實際原因**：
- Google 開始停用 `gemini-2.0-flash`
- `gemini-2.5-flash` 正常運作
- 直接測試不同模型才能確認

**驗證方法**：
```bash
cd ~/.openviking && source venv/bin/activate
python3 -c "
import litellm
response = litellm.completion(
    model='gemini/gemini-2.5-flash',  # 用 2.5，不是 2.0
    messages=[{'role': 'user', 'content': 'Hi'}],
    api_key='YOUR_KEY',
    timeout=30
)
"
```

**鐵則**：
1. API 錯誤時，先確認是 key 問題還是 model 問題
2. 嘗試不同 model 來隔離問題
3. 不要直覺反應是 key 失效

**修正行動**：
- [x] 確認 `gemini-2.5-flash` 可用
- [x] 更新 cron jobs 使用 `gemini/gemini-2.5-flash`

---

## 錯誤 #NEW：OpenViking Server 啟動方式錯誤

**日期**：2026-04-17
**觸發層級**：L1（環境問題）
**類型**：文件閱讀不足

**描述**：
嘗試用 `python3 -m openviking.server` 啟動失敗，不了解 module 結構。

**錯誤嘗試**：
```bash
# 錯誤的方式
python3 -m openviking.server
uvicorn openviking.server.app:app  # 錯誤的 module path
```

**正確方式**：
```bash
# 正確的方式
cd ~/.openviking && source venv/bin/activate
uvicorn "openviking.server.app:create_app" --host 127.0.0.1 --port 1933
```

**原因**：
- `app` 不是直接 export 的對象
- 需要用 `create_app()` factory function

**Python 3.14 相容性問題**：
- openviking 用 Python 3.14 但某些套件（如 Pydantic V1）不相容
- 需要用 `venv/bin/python3` 來執行

**鐵則**：
1. 遇到 module 問題時，先查看 `__init__.py` 和 `app.py`
2. 找 `create_app` 或 factory function
3. 確認 Python 版本相容性

**修正行動**：
- [x] 建立 systemd service 使用正確的啟動方式
- [x] 使用 venv 的 Python 執行

---

## 錯誤 #NEW：Cron Jobs 模型 Timeout

**日期**：2026-04-17
**觸發層級**：L1（效能問題）
**類型**：資源配置不當

**描述**：
cron jobs 一直 Timeout，原因是使用 MiniMax-M2.5 模型處理太慢。

**錯誤訊息**：
```
Request timed out before a response was generated.
Please try again, or increase agents.defaults.timeoutSeconds in your config.
```

**實際原因**：
- cron jobs 使用 `minimax-portal/MiniMax-M2.5`
- MiniMax 模型在這個場景下處理太慢
- Gemini 2.5-flash 在這個場景下表現更好

**解決方案**：
將 cron jobs 改用 `gemini/gemini-2.5-flash`：
```json
{
  "id": "openviking-memory-extract",
  "payload": {
    "model": "gemini/gemini-2.5-flash"  // 改這裡
  }
}
```

**鐵則**：
1. 處理時間敏感的任務，選擇速度更快的模型
2. 定期檢查 cron job 的成功率和執行時間
3. 當一個模型一直 Timeout，考慮更換

**修正行動**：
- [x] 更新 `cron/jobs.json` 使用 `gemini/gemini-2.5-flash`
- [x] 測試確認 Gemini 模型可正常完成任務

---

## 累積統計

| 錯誤類型 | 數量 |
|---------|------|
| 假設錯誤 | 1 |
| 文件閱讀不足 | 1 |
| 資源配置不當 | 1 |

---

*最後更新：2026-04-18*
