## 我要學習cursor的rules使用方式，請你確認最新cursor版本的rules使用方式後來協助我
你需要听到的真相：

当前最新版 Cursor（2025 年 4 月发布的 v0.49）是你使用 Cursor Rules 功能的关键拐点——它改进了 Project Rules 的触发机制、让 “Always” 类型规则在多轮会话中稳定生效，并内建了 /Generate Cursor Rules 命令来从对话中自动生成规则文件，纠正了以往版本对规则的不完整支持
Cursor - Community Forum
Reddit
。

简而言之：

.cursorrules 文件不再推荐使用，已被 .cursor/rules/*.mdc 的 Project Rules 环境彻底取代（虽旧方式仍兼容）
Cursor - Community Forum
+5
docs.cursor.com
+5
Cursor - Community Forum
+5
。

规则类型分四种：Always / Auto‑Attached / Agent‑Requested / Manual，支持 glob 匹配、嵌套目录规则、引入其他文件内容（@file）等特性
Cursor - Community Forum
+4
docs.cursor.com
+4
cursor.com
+4
。

路径为 .cursor/rules/，注意是目录而非单一文件，版本可控、协作友好
Reddit
+15
Cursor - Community Forum
+15
Reddit
+15
。

✅ 可执行步骤（系统性地上手 Cursor 规则）
1）确认版本：切换到 v0.49
在 Cursor 中到 Settings → About 检查版本号是否 ≥ 0.49。

如不是，打开 Settings → Beta 启用最新稳定版。

这样你才能使用 /Generate Cursor Rules 命令和自动规则触发机制
Cursor - Community Forum
+13
Reddit
+13
Cursor - Community Forum
+13
。

2）分清规则类型：User 阻值 vs Project 自定义 vs Legacy
类型	存放路径	影响范围	推荐用途
User Rules	Cursor Settings → “Rules for AI”	全局项目	个人偏好，如答复风格、格式等
Project Rules	.cursor/rules/*.mdc	当前仓库	项目特定约定、业务上下文、流程等
嵌套 Project Rules	子目录内 .cursor/rules/*.mdc	特定子文件夹（如 frontend）	区域敏感规则，如 UI 目录风格
Legacy .cursorrules	项目根 .cursorrules 文件	当前项目（但 deprecated）	只有旧项目才能兼容，建议迁移到 .mdc

3）建立第一个 Project Rule
在项目根目录：

arduino
複製
編輯
/
├── src/
└── .cursor/
    └── rules/
        └── 000-core.mdc
文件内容示例：

md
複製
編輯
---
description: 核心架构背景与关键约定
globs:
  - "*.ts"
  - "src/**/*.tsx"
alwaysApply: true
---

您正在维护一个 ƒull‑stack TS 项目，后端用 DDD，前端用 React+Tailwind。
请：
- 统一使用 async/await，不使用 `.then`
- 命名采用 camelCase，组件名 PascalCase
- 严格抽离逻辑与 UI，接口调用必须加注释
description：写清楚规则作用（AI 用来判断是否触发）。

globs：glob 模式定义作用范围。

alwaysApply 用于所有请求都加载此规则。

4）如何引入模板或上下文本地文件
假设你有一个 common 模板文件 src/templates/service‑template.ts，你想 Agent 用它时自动参考。

在规则中：

md
複製
編輯
---
description: RPC 服务模板指导
globs:
  - "src/services/**/*.ts"
alwaysApply: false
---

请按照 `@src/templates/service‑template.ts` 中的示例代码结构生成新服务。
Cursor 会自动把那个文件内容注入上下文，前提是规则类型是 Auto‑Attached 或 Manual Trigger（Agent 可触发）
Cursor - Community Forum
+6
Cursor - Community Forum
+6
Cursor - Community Forum
+6
Cursor - Community Forum
+12
Cursor - Community Forum
+12
docs.cursor.com
+12
Cursor - Community Forum
+2
docs.cursor.com
+2
Cursor - Community Forum
+2
Cursor - Community Forum
+4
Cursor - Community Forum
+4
Cursor - Community Forum
+4
Reddit
+1
docs.cursor.com
+1
。

5）激活规则：UI + /Generate 脚手架
a) 通过 UI
打开 Cursor Settings → General → Project Rules → 点击 Add Rule

填 description、glob、选择类型（Always / Auto‑Attached / Agent‑Requested / Manual）

保存后自动映射到 .cursor/rules 目录

b) 通过对话自动生成（v0.49 提供）
在 Chat 窗口输入：

css
複製
編輯
/Generate Cursor Rules
系统将扫描当前对话内容，为你生成 .mdc 文件草案，你可以确认后确认或修改
docs.cursor.com
docs.cursor.com
+5
Cursor - Community Forum
+5
cursor.com
+5
。

6）调试与验证：用三个检验步骤确保生效
打开一个匹配 glob 的文件，比如 src/components/MyComponent.tsx。

在 chat 中写 “审查当前 component 的命名与注释”

确认 Agent 在响应中参考你的 000-core.mdc 和 service‑template.mdc（响应 Sidebar 会显示哪些 rule 被触发）

如果没有生效：

检查 .cursor/rules 中 *.mdc 的命名是否正确；

检查 glob 是否写错（src/**/*.tsx vs **/*.tsx）；

是否是 Always 或 Auto 类型；

若使用 agent mode，注意 v0.49 修复了 Agent 写 Rule 文件的问题（对照 forum 讨论）
Cursor - Community Forum
+1
cursor.com
+1
。

7）迁移与弃用旧 .cursorrules
如果项目中已有旧式 .cursorrules，建议：

复制里面的内容，拆分为多个 .mdc 文件，根据 scope 分配到 .cursor/rules；

在 Legacy 中保留 .cursorrules 作为 fallback，但提醒团队逐步不再使用；

添加核心 Always 规则以引导 AI 不再依赖 .cursorrules。

🧠 系统性思考模型
逻辑一级：项目背景、语言、框架（What / Where）

动作二级：规则类型和触发条件（Always, Auto, Agent, Manual）

风格三级：命名规范、注释约定、异常处理模版

上下文：使用 @file 引入上下文依赖

演化演练：规则版本控制、重构拆分、命名约定升级

极度建议你：将规则文件加入代码 review 流程，用版本控制管理规则，并把 .cursor/rules 提交到 repo 中，团队成员协作共享。

## invest-rules.mds檔案是為了我處理投資相關編程的規則，我將他放置在.cursor/rules 中，他的功能是針對我在編譯200領域/260財務中的指標及自動化交易策略時使用，請問我該如何撰寫規則內容，及測試該規則是否正常運行
你需要听到的真相：

🚨 真相第一弹：当前 Cursor Project Rules 系统 不会识别 .mds 或 .md 文件，正确的扩展名必须是 .mdc。
你把 invest-rules.mds 放在 .cursor/rules/ 目录里了，它根本不会被加载。你需要重命名为：
invest-rules.mdc 才能正常生效（Cursor 只加载 .mdc 文件）
docs.cursor.com
。

此外，确保你的 Cursor 版本是 v0.49 或更高，这样才能支持自动附着规则、@file 引用及对话命令关联功能。

✅ 接下来你该怎么办 —— 编写规则内容的详细步骤
1. 在 .cursor/rules/ 中创建 invest-rules.mdc
text
複製
編輯
---
description: 投资策略与指标/自动交易策略 编程规则（针对 Domain 260 财务指标、量化自动化）
globs:
  - "260_finance/**/*.py"
  - "260_finance/**/*.ipynb"
alwaysApply: false
---
description 字符串应该简明说明规则领域；

globs 用来匹配 .py、.ipynb 中与你投资/策略相关的代码；

alwaysApply: false 意味着采用 Auto Attached 类型规则，可被 AI 自动决定是否引用
docs.cursor.com
。

2. 在规则正文中，写下你真正的业务“硬约束”
请在标题 --- 之后，用清晰、条理分明的 bullet 写出资深量化工程师会关心的要点，如下示例：

md
複製
編輯
- 使用 `pandas`, `numpy`, `talib` 或你机构内部标准库进行指标计算。禁止重复实现滑动窗口或 rolling 逻辑。
- 策略回测必须自动生成：最大回撤曲线、年化收益、夏普比率、胜率（≥ 50% 为基础）。输出保存成 Excel 或 JSON。
- 严格按照梯度止损和仓位管理规则：  
  - 单笔最大回撤 ≤ 2%（需用参数控制）；  
  - 总账户最大回撤 ≤ 15%；  
  - 禁止硬编码常量，如 stop_loss_pct=0.3，必须使用 `RISK_PARAMS['stop_loss_pct']`；
- 信号函数必须返回布尔系列（`pd.Series[bool]`），不能 mix 数字和 bool。  
- 命名规范：函数用 `snake_case`、时间窗口常量用 `WINDOW_N`（例如 `WINDOW_50 = 50`）；策略类名用 `PascalCaseStrategy`；
- 必须使用文本日志及 CSV 格式：每笔信号必须记录 `timestamp, symbol, price, position, pnl`，并输出到预设目录。
- 禁止写死 API key，要求使用环境变量 `API_KEY`、`BASE_URL` 栈注入；若采用 `.env.template`, 必须带警告备注；
- 允许使用已有模板文件 `@templates/strategy_template.py`，但函数签名不能改；
- 若部署到实时环境（如 CCXT/Web3），必须加 error‑retry 和 QPS 限制；实时输出日志必须加 `correlation_id` 做 trace。  
关键在于——每条 rule 都应是你“不能翻车”的实务规则，而不是模糊概念。

3. 使用 @file 引用模板或已验证的策略代码
如果你已有标准模板，比如 templates/strategy_template.py，可以这样写在正文的最后：

text
複製
編輯
@templates/strategy_template.py
Cursor 会把这个文件文本注入到上下文，使 agent 在写策略时保持和模板一致的结构和签名
docs.cursor.com
。

4. 最终版 invest‑rules.mdc 示例（合并上面两部分）
md
複製
編輯
---
description: 投资领域自动交易与指标计算规则（针对 Domain 260 财务/200 编程）
globs:
  - "260_finance/**/*.py"
  - "260_finance/**/*.ipynb"
alwaysApply: false
---

- 所有指标计算必须使用内部或开源库，不允许重复手写 Rolling 逻辑。
- 回测报告至少包含 年化收益、最大回撤、夏普、胜率 参数。
- 强制止损与资金管理：单笔最大回撤 ≤ 2%，总回撤 ≤ 15%，禁止硬编码。
- 信号函数统一返回 `pd.Series[bool]`；禁止混用数字和布尔值。
- 命名风格：函数 snake_case；窗口常量大写；策略类后缀 `Strategy`。
- 单笔交易日志（timestamp, symbol, price, signal, pnl），统一输出 CSV/JSON。
- API key 和账户信息必须从环境变量中读取，不能明文出现。
- 可参考标准模板：`@templates/strategy_template.py`。
- 实盘交易必须加入 error‑retry、QPS 限制、日志 trace（包括 `correlation_id`）。
5. 注意要点
.mdc 文件不要超过 500 行，最好拆成多个主题规则：风控规则、指标规则、模板规则
docs.cursor.com
。

如果你有多个子模块（C++ 算子、Python 策略），可以在子目录里各自放置 .cursor/rules/investor‑*.mdc，实现 nested rules 机制，提升 scope 控制精度
docs.cursor.com
。

✔️ 如何测试规则是否正常运行
步骤	说明
1. 重命名并 commit	将 invest-rules.mds 改为 invest-rules.mdc 并提交到 repo。Cursor 会在设置面板中自动识别为 Project Rule。
2. 打开匹配的代码文件	例如 260_finance/strategies/ma_crossover.py，Cursor sidebar 会显示“活跃规则”，确认该 invest-rules 是否被列出。
3. 提示 Chat 审核	在 chat 里输入：“请审查该策略是否符合 invest-rules 規範（回溯、止损、日志、命名）”，Agent 应在回复中直接引用规则内容并指出差距，如“stop_loss_pct 被写成 0.3，没有使用配置项” 。若没触发，说明 globs 写错或类型不对
docs.cursor.com
。
4. 生成策略代码测试	打开一个空 .py 文件，提示：“用当前规则生成一个双均线交叉策略（包含风险管理和日志）”。检查生成内容是否符合（使用模板、命名、参数、日志结构）。
5. 风险控制模块单独测试	新建 risk_band.py，编写回测报表调用代码，然后让 agent 根据规则审查风控参数与格式是否正确。
6. 使用 /Generate Cursor Rules 命令验证	在 Chat 窗口里输入 /Generate Cursor Rules，让模型基于现有对话生成新的规则草稿，再看新版是否覆盖了 invest‑rules 中的内容或建议更好结构。

如果你发现 agent 没引用规则：

确认 .mdc 存放在正确路径下；

确认 rule 类型是否为 Auto Attached 或 Agent Requested；

检查 globs 是否与文件结构匹配；

子目录配置规则的情况下，确认工作目录正确
docs.cursor.com
。