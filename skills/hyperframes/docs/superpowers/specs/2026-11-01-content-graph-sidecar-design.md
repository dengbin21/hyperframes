# Content-graph 可选侧车设计

**状态：** 已获设计批准，待规格审阅
**日期：** 2026-11-01
**范围：** HyperFrames skill 本地 fork 的故事板规划层

## 目标

为需要表达叙事依赖、顺序偏好和对比关系的视频项目，新增一个可选的、机器可读的
`CONTENT_GRAPH.json` 规划层。它验证关系结构并给出可解释、确定性的建议帧序；不替换
既有 `STORYBOARD.md`，也不接管渲染。

## 已知现状

- `references/storyboard-format.md` 定义了现有 `STORYBOARD.md`，由
  `@hyperframes/core/storyboard` 解析为 `StoryboardManifest`。
- `STORYBOARD.md` 和 `boards/storyboard.html` 是用户审阅的现有主流程。每个 frame 包含
  场景、时长、旁白、`reads`、`sound` 等可供人工理解与审核的信息。
- 当前工作区没有 content-graph 解析器、schema 或命令。
- `nexu-io/html-video` 的 Apache-2.0 `@html-video/content-graph` 提供了可验证的参考机制：
  `entity` / `data` / `text` 节点，`dependency` / `sequence` / `contrast` 边；dependency
  参与拓扑排序，sequence 只用于无硬依赖时的 tie-break，contrast 只传递构图语义。

## 非目标

本轮不做下列事项：

1. 不修改 `STORYBOARD.md` 格式、现有 `StoryboardManifest` parser 或 `boards/storyboard.html`。
2. 不从 graph 自动生成 HTML、故事板 Markdown、时间线、素材库或 MP4。
3. 不引入 html-video 的 TypeScript runtime、其 CLI 或第三方 Python 依赖。
4. 不把 `CONTENT_GRAPH.json` 变成强制开工门禁。没有 graph 的项目按当前流程继续。
5. 不把 sequence 或 contrast 误当成硬约束，避免创作建议意外阻断项目。

## 文件与命令

### 项目输入：`CONTENT_GRAPH.json`

文件位于视频项目根目录，只有复杂叙事需要时才创建。

```json
{
  "schema_version": 1,
  "intent": "comparison",
  "synopsis": "同一事实经不同表述会导致不同选择。",
  "nodes": [
    {
      "id": "framing_claim",
      "kind": "text",
      "label": "两个说法",
      "frame_intent": "quote",
      "duration_s": 3,
      "text": "朝三暮四和朝四暮三，数量相同。"
    },
    {
      "id": "choice_data",
      "kind": "data",
      "label": "同样是七颗橡子",
      "frame_intent": "comparison",
      "duration_s": 4,
      "data": { "morning": 3, "evening": 4, "total": 7 }
    },
    {
      "id": "monkey",
      "kind": "entity",
      "label": "猴子",
      "frame_intent": "character",
      "props": { "role": "viewer surrogate" }
    }
  ],
  "edges": [
    {
      "from": "framing_claim",
      "to": "choice_data",
      "kind": "dependency",
      "reason": "先让观众知道数量相同，再解释选择为何改变。"
    },
    {
      "from": "monkey",
      "to": "choice_data",
      "kind": "sequence",
      "reason": "角色先进入画面，再给出选择。"
    },
    {
      "from": "framing_claim",
      "to": "choice_data",
      "kind": "contrast",
      "reason": "同一总量与不同先后顺序形成对比布局。"
    }
  ]
}
```

### 工具：`scripts/content_graph.py`

工具只读取指定文件，不写入项目内容：

```bash
python3 scripts/content_graph.py validate --file CONTENT_GRAPH.json
python3 scripts/content_graph.py order --file CONTENT_GRAPH.json
```

`validate` 输出全部错误和警告，退出码 `0` 代表没有错误、`1` 代表存在错误。
`order` 先执行相同验证；有效时按每行一个节点输出建议顺序、`id`、`label`、时长及累计时长，
最后输出总时长。无效时输出错误且退出 `1`，不输出部分顺序。

## 数据契约

### 顶层

| 字段 | 类型 | 规则 |
| --- | --- | --- |
| `schema_version` | number | 必填，当前唯一支持值为 `1`。 |
| `intent` | string | 必填，允许 `single-frame`、`explainer`、`data-viz`、`promo`、`comparison`、`other`。 |
| `synopsis` | string | 可选，一句话说明视频主题。 |
| `nodes` | array | 必填且至少一个节点。按数组原顺序作为最后一级稳定 tie-break。 |
| `edges` | array | 必填，可以为空。 |

### 节点

所有节点共用 `id`、`kind`、`label?`、`frame_intent?`、`duration_s?`。

| `kind` | 专有字段 | 规则 |
| --- | --- | --- |
| `entity` | `props` | 必填 object。放 logo、角色、产品或其它可被场景引用的实体资料。 |
| `data` | `data` | 必填，类型可为任意 JSON 值。放待可视化的已核实数据。 |
| `text` | `text` | 必填 string。放标题、引用、旁白或屏幕文字。 |

`id` 必须是非空字符串、在 graph 内唯一。`duration_s` 缺省时按 **3.0 秒**计算；存在时必须为
有限正数。`frame_intent` 是给后续场景作者的自由提示，不参与本轮 template 选择或渲染。

### 边

每条边有 `from`、`to`、`kind` 与可选 `reason`。

| `kind` | 含义 | 对建议帧序的作用 |
| --- | --- | --- |
| `dependency` | `to` 的说明依赖于 `from` 已先出现。 | 硬约束，必须 `from` 在前。 |
| `sequence` | 希望独立节点按该方向叙述。 | 软偏好，只在可选节点同时 ready 时参与 tie-break。 |
| `contrast` | 两节点应以 before/after、正反面或并置方式呈现。 | 不重排，保留 reason 给故事板作者决定构图。 |

同一对节点可同时具有不同 kind 的边。例如一个 `dependency` 确保解释顺序，一个 `contrast`
提示采用并置构图。边不可自指，`from` 和 `to` 都必须引用已知节点。

## 验证与排序语义

### 阻断错误

`validate` 收集下列全部错误，单次返回，方便一次修完：

- 文件不是 JSON object；
- 缺失或不支持的 `schema_version`；
- 缺失或未知的 `intent`；
- 空 `nodes`，或节点不是 object；
- 节点 ID 缺失、空白或重复；
- 节点 kind 未知，或 kind 专有字段缺失/类型不符；
- `duration_s` 不是有限正数；
- `edges` 不是 array，或边不是 object；
- 边 kind 未知、端点未知或 self-edge；
- 仅由 `dependency` 边构成的有向环。

`sequence` 环不是错误，因为它从不构成硬前置条件。`contrast` 环同理。

### 警告

以下不阻断：

- `sequence` 的方向与一条 `dependency` 的必需顺序相反；
- `synopsis` 缺失；
- 节点没有 `label` 或 `frame_intent`；
- 节点未连接任何边。

警告帮助作者检查叙事意图，不会令 `order` 失败。

### 确定性排序

对验证成功的 graph，排序算法按以下规则产出一个节点 ID 序列：

1. 只从 `dependency` 构建入度和邻接表，运行 Kahn 拓扑排序。
2. 当多个节点同时没有未满足的 dependency 时，优先选择不是任何其他 ready 节点的
   `sequence` 目标的节点。也就是有 `A → B` sequence 时，优先 A。
3. 若仍有多个候选，按 `nodes` 数组中的原出现顺序选择。
4. 每个节点的时长为 `duration_s` 或 3.0 秒默认值；总时长是排序后各节点时长之和。

这定义是确定性的。同一输入无论运行次数、平台或 JSON 键排列如何变化，都会得到同一顺序。

## 与现有故事板的协作方式

`CONTENT_GRAPH.json` 的工作位置在故事板之前：

1. 作者用节点和边确认“先理解什么、再看什么、哪些信息应并置”。
2. 运行 `validate` 与 `order`，修复硬关系错误并审阅建议帧序。
3. 仍然人工编写 `STORYBOARD.md`：把每个建议节点或合理合并后的节点写为现有 Frame，补齐
   `scene`、`voiceover`、`reads`、`sound`、`src`、状态和实际转场。
4. 按 `references/storyboard.md` 制作 `boards/storyboard.html` 并取得用户对画面和叙事的批准。
5. 批准后才开始 HyperFrames HTML/时间线实现及现有五门禁流程。

graph 输出是建议，不是生成器输入。它不拥有最终 scene 数、实际动画时长、转场重叠、音频时间或
用户审批状态；这些继续由 `STORYBOARD.md` 与项目文件表达。

## 实现边界

实现采用 Python 标准库（`argparse`、`json`、`math`、`collections`），与工作区现有的
`scripts/*.py` 脚本风格一致。不会引入 PyYAML、NetworkX 或 html-video 包。

建议结构：

- `scripts/content_graph.py`：读取、验证、排序、CLI 与机器可读 JSON 输出选项。
- `scripts/test_content_graph.py`：无外部依赖的可执行边界测试，沿用现有
  `test_audio_check.py`、`test_hook_check.py`、`test_motion_density.py` 的 PASS/FAIL 风格。
- `references/storyboard-format.md`：在现有格式后增加“可选 content graph”一节，链接此
  设计和命令；现有 `STORYBOARD.md` schema 不变。

## 测试与验收

测试先于实现编写，并先确认红灯。最小覆盖集：

1. 有效 graph 的确定性 dependency 拓扑顺序、默认 3.0 秒时长和总时长。
2. 两个 ready 节点之间 `sequence` 的软偏好；输入数组顺序是无偏好时的稳定退路。
3. `contrast` 边不会改变排序。
4. 空图、重复 ID、未知边端点、self-edge、未知 kind、非法时长和 dependency 环均阻断。
5. 反向 sequence/dependency 只产生警告，不阻断，不反转硬顺序。
6. `validate` / `order` 的 CLI 退出码；无效图的 `order` 不得输出部分顺序。
7. 现有 `node --test scripts/gate.test.mjs` 与 `scripts/frame-presets-license.test.mjs` 仍通过，
   确保新脚本不影响 skill 的既有门禁和许可证契约。

验收标准：有效样例的顺序和总时长与手工计算一致；上述非法样例都被正确分类；不含
`CONTENT_GRAPH.json` 的现有项目无需任何改动，也不多一道门禁。

## 许可与来源

本设计吸收的机制来自 `nexu-io/html-video` 的 Apache-2.0 content-graph：节点/边的三类
语义、dependency 硬约束、sequence 软排序偏好、contrast 作为场景语义。实现将使用本地
Python 从零编写，不复制其 TypeScript 源码或运行时。对应上游资料：

- `packages/content-graph/src/index.ts`
- `packages/content-graph/README.md`
- `research/2026-05-26-spec-04-storyboard-workflow.md`

在未来对外再分发本 skill 的本地实现时，应在变更记录保留该 Apache-2.0 来源与本段归属。
