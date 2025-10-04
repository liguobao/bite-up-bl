# 寻味阿婆 · biteup

围绕地方美食内容的素材整理项目，用于汇总 UP 主及其关联的特色产品信息。

## 如何提交素材

请通过 GitHub Issue 提交新素材，推荐包含以下信息：

- B 站视频链接（必填），示例：`https://www.bilibili.com/video/BV1kepfzCEZ4/`
- 视频的原始 JSON（选填）。如已抓取，可将 JSON 粘贴在 Issue 中，或附上可下载的文件。原始 JSON 对应项目中的 `src/data/origin/*.json`。
- 任何可帮助完善详情页的补充信息，例如特色产品标题、简介、外链等。

收到 Issue 后，我们会使用脚本将原始 JSON 转换成详情数据，再补充商品与外链信息。

## 数据结构约定

- `src/data/origin/`：存放从 B 站接口获取的原始 JSON。
- `src/data/details/`：详情页数据，包含 UP 主、特色产品、外链等字段。
- `src/data/list.json`：首页列表使用的精简字段集合。

如需自行转换，可运行 `node scripts/convert-origin.js`（支持 `--dry-run` 与 `--force` 参数）。

## 相关链接

- [B 站视频信息接口](https://api.bilibili.com/x/web-interface/view?aid=115258014372544)
- [BV-AV号互转](https://www.bilitools.top/t/2/)
