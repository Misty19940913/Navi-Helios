## **A Word On Live Preview**

---

在Multi-Column Markdown中已支援即時預覽，然而與其他插件的跨相容性、任何需要互動的功能（例如：按鈕點擊）以及更高級的非原生Markdown、Obsidian功能在此模式下可能不會被支援。

由於自訂即時預覽插件在CodeMirror6中的實作方式以及如何與Obsidian連接，我無法保證所有插件在此時的即時預覽中能正確渲染。那些不立即渲染其內容的插件，例如需要等待數據視圖查詢的插件，無法正確渲染。

此插件最初僅用於閱讀模式，在該模式下，插件對內容的渲染有更多控制權。_大多數_ 插件、互動元素、高級Markdown和視覺樣式在閱讀模式下的渲染效果會更好，並且具有更好的跨相容性。

- !!!col
- 1 # Column 1 Some example text in column 1 - some lists inside as well - more list items - 2 # Column 2 This column is twice as wide because it has the value set to 2 - !!!col - 1 ## Column 2-1 You can even have columns inside columns! - 1 ## Column 2-2 More example text inside this column

# Usage:


您可以通過定義開始、設置、列結束和結束標籤來創建多列區域。例如：
--- start-multi-column:1  
```column-settings  
number of columns: 2  /欄位數量
Col Size:[50%, 50%]  /欄位大小
Border:on  /邊線
Column Location:Center  /欄位位置(用於1個欄)
Column Spacing:5px  /欄與欄之間的空隙 
Overflow:Scroll (Default)  /滾動
Content Alignment:Left (Default)  /內容對齊方式
Auto Layout:on
```

Text displayed in column 1.

--- start-multi-column:2
```column-settings  
number of columns: 2  /欄位數量
Col Size:[50%, 50%]  /欄位大小
Border:on  /邊線
Column Location:Center  /欄位位置(用於1個欄)
Column Spacing:5px  /欄與欄之間的空隙 
Overflow:Scroll (Default)  /滾動
Content Alignment:Left (Default)  /內容對齊方式
Auto Layout:on
```

111
--- end-column ---

Text displayed in column 2.

--- end-multi-column

--- end-column ---

Text displayed in column 2.

--- end-multi-column

---

# Syntax Reference
#### **Start a Multi-Column Region:** start-multi-column: A_unique_region_ID
在定義開始標籤後，您必須為該區域聲明一個ID。該ID用於區分同一文檔中如果有多個區域的不同區域。
每個ID在同一文檔中必須是唯一的，否則可能會發生意外的渲染問題。ID可以在多個文檔中使用，例如，您可以在用於您的定期筆記的模板中使用ID "dailynote"。
通過使用“插入多列區域”命令（詳情見下文），開始ID將預設為隨機生成的4個字符字符串。
您還可以使用“修復缺失ID”命令，該命令將搜索當前打開的文檔並為所有缺少ID的區域附加隨機ID。
#### **End Multi-Column Region:** end-column 
在 columnbreak 後需要空行。

#### **End Multi-Column Region:** end-multi-column  

#### **Number of Columns:**

- **Setting Flags**:
    - Number of Columns:
    - Num of Cols:
    - Col Count:
- **Valid Selections**:
    - Any digit.
  
#### **Column Size:**

- **Setting Flags**:
    - Column Size:
    - Col Size:
    - Column Width:
    - Col Width:
    - Largest Column:
- **Valid Selections**:
    - Single Column layout:
        - Small
        - Medium
        - Large
        - Full
    - For either 2 or 3 column layouts
        - Standard
        - Left
        - First
        - Right
        - Second
    - Only for 3 column layouts
        - Center
        - Third
        - Middle
    - Allows _most_ CSS unit lengths (px, pt, %, etc). [25%, 75%]

_Example:_

> ```column-settings  
> Column Size: standard  
> ( **OR** )  
> Column Size: [25%, 75%]  
> ```

  

#### **Border:**
 _Can define on a per column basis with array syntax: EG: [off, on, off]_
- **Setting Flags**:
    - Border:
- **Valid Selections**:
    - disabled
    - off
    - false

_Example:_

> ```column-settings  
> Border: disabled  
> ( **OR** )  
> Border: [off, on]  
> ```

#### **Shadow:**
On by default, can be removed with:
- **Setting Flags**:
    - Shadow:
- **Valid Selections**:
    - disabled
    - off
    - false

_Example:_

> ```column-settings  
> Shadow: off  
> ```

#### **Column Position or Column Location:**

Only used with the single column option.

- **Setting Flags**:
    - Column Position:
    - Col Position:
    - Column Location:
    - Col Location:
- **Valid Selections**:
    - Left
    - Right
    - Center
    - Middle

_Example:_

> ```column-settings  
> Number of Columns: 1  
> Column Position: Left  
> ```

  

#### **Column Spacing:**

Used to set the distance between all of the columns.  
  
_Can define on a per column basis with array syntax: EG: [5px, 10px]_

- **Setting Flags**:
    - Column Spacing:
- **Valid Selections**:
    - Allows _most_ CSS unit lengths (px, pt, %, etc).
    - A number alone without a defined unit type defaults to pt unit.

_Example:_

> ```column-settings  
> Column Spacing: 5px  
> ( **OR** )  
> Column Spacing: [5px, 10px]  
> ```

  

#### **Content Overflow:**

應該讓列剪切超出列邊界的內容，還是應該讓其可滾動。
  
_Can define on a per column basis with array syntax: EG: [Scroll, Hidden]_

- **Setting Flags**:
    - Overflow:
    - Content Overflow:
- **Valid Selections**:
    - Scroll (Default)
    - Hidden

_Example:_

> ```column-settings  
> Overflow: Hidden  
> ( **OR** )  
> Overflow: [Scroll, Hidden]  
> ```

  

#### **Alignment:**

Choose the alignment of the content in the columns.  
  
_Can define on a per column basis with array syntax: EG: [Left, Center]_

- **Setting Flags**:
    - Alignment:
    - Content Alignment:
    - Content align:
    - Text Align:
- **Valid Selections**:
    - Left (Default)
    - Center
    - Right

_Example:_

> ```column-settings  
> Alignment: Center  
> ( **OR** )  
> Alignment: [Left, Center]  
> ```

  

#### **Align Tables to Text Alignment:**

Define whether to align tables to the alignment of the text content, see above.  
  
_This setting overrides the plugin level alignment definition._

- **Setting Flags**:
    - Align Tables to Text Alignment:
- **Valid Selections**:
    - true
    - on
    - enabled
    - disabled
    - off
    - false

_Example:_

> ```column-settings  
> Align Tables to Text Alignment: true  
> ( **OR** )  
> Align Tables to Text Alignment: off  
> ```

  

#### **Auto Layout**

- **Setting Flags**:
    - Auto Layout:
    - Fluid Columns:
    - Fluid Cols:
- **Valid Selections**:
    - true
    - on

_Example:_

> ```column-settings  
> Auto Layout: on  
> ```

##   

Auto layout regions do not use defined column breaks. Instead these type of multi-column regions will attempt to balance all content equally between the columns. Headings are also attempted to be preserved so that a heading block will not end a column but will instead be moved to the top of the next column with it's corresponding content.

To use this feature set "Auto Layout: true" within the region settings.

  

---

## Full Document Multi-Column Reflow

---

Documents can be set to fully reflow into multiple columns while in Reading mode.

#### **Syntax**

To enable document reflow use Obsdian's frontmatter to provide the metadata for the file with the following syntax:

EG:

```
---
Multi-Column Markdown:
  - Number of columns: 3
  - Alignment: [Left, Center, Left]
  - Border: off
---

First line of document.
```

All settings must be a list underneath the Multi-Column Markdown tag. If obsidian does not parse a valid syntax it will not render. You can use the "Setup Multi-Column Reflow" command to ensure proper syntax.

**Features:**

- Reflow automatically detects your document view size and sets the column heights to match, reducing the number of times you need to scroll through the document.
    - Auto column height is overridable by defining the col-height in frontmatter settings using standard MCM syntax.
    - Changes to the view size currently require a document reload to update layout.
- User definable column breaks using default Multi-Column Markdown column break syntax.

**Additional Notes:**

- Just as with core MCM, the default Obsidian theme, all basic markdown syntax and rendered elements should be fully supported. However cross compatibility with other plugins, embeds, and themes are not guarenteed.
- All manually set multi-column regions are overridden by the document reflow.

**Known Issues:**

- Changes to the document may require a file reload to properly update.
- Export to PDF is currently not supported.
- Long paragraphs of text will not be split across columns, as they are rendered as a single chunks of content by Obsidian.

---

## Plugin Cross Compatibility.

---

Not all plugins will be cross compatable within a multi-column region. Depending on the implementation or use case, some plugins will either entierly not render, render incorrectly, or render but be uninteractable. For the most part, due to how Obsidian plugins work, there is little that can be done at this stage to guarentee cross compatibility. And this is even more the case when using Live Preview. You can check the [Cross Compatibility](app://obsidian.md/documentation/CrossCompatibility.md) sheet for plugins known to work within columns. Anything not on that list has not been tested.

---

## Obsidian Theming

---

Just as with cross compatibilty above, multi-column regions may be effected by the Obsidian Theme you are running. There is very little non-layout dependent CSS within MCM but some themes may add or remove elements neccessary to properly render the columns. If regions do not render properly in a specific theme, feel free to open an issue and make sure to include what Obsidian theme you are running when describing the problem.

  

# **Full Mutli-Column Examples:**

[Here](app://obsidian.md/documentation/FullExamples.md)

  
  

# **Plugin Commands:**

You can access the command pallet with ctrl/command - P.

#### **Insert Multi-Column Region**

Will create a two column region where the cursor is located with a randomly generated ID and a default settings block created. Anything currently selected will be moved outside the end of the inserted region as to not overwrite any data.

  

#### **Fix Missing IDs For Multi-Column Regions**

Will search the current document for any region start tags that are missing IDs and randomly generate new IDs for each region.

  

#### **Toggle Mobile Rendering - Multi-Column Markdown**

Enables or disables column rendering on mobile devices only.

  

#### **Setup Multi-Column Reflow**

Adds the default multi-column reflow tags and settings to the document frontmatter. Will not overwrite if already defined.

  
  

# Installation

## From Obsidian Community Plugins

You can install this plugin from the Obsidian Community Plugins menu by following these steps:

- Open Settings within Obsidian
- Click Community plugins and ensure Safe mode is disabled
- Browse community plugins and find "Multi-Column Markdown"
- Click Install
- After installation is finished, click Enable

## From GitHub Repository

Download main.js, manifest.json, styles.css from the latest release and add a new directory: [Obsidian-vault]/.obsidian/plugins/multi-column-markdown and add the files to that directory.

If this is your first Obsidian plugin close and reopen Obsidian and then open the settings menu, click the Community plugins tab to the left, ensure Safe mode is disabled, and then enable "Multi-Column Markdown" in the installed plugins list.

  
  

# Known Issues

#### **Live Preview**

- Any file interaction causes embeds to reload.
    
    - All issues of this kind are due to Obsidian redrawing the entire editor on every file interaction (click, keystroke, etc). The redraw causes all embeds to be re-loaded which makes them appear to flash on screen. There is currently no solution to this problem.
    - An attempt to aliviate this has been added in 0.9.0 using the LivePreview Render Cache, however the feature is still experimental and you must enable it within the settings window.
- Some cross compatibility with other plugins is not supported and will not render.
    
    - Most plugins that do not render are more advanced plugins that load their content over time rather than immediatly at render time.

#### **Minor Render Issues**

- Any general render issues within columns:
    - If columns render their content in an unexpected way try swapping to a new file and back, this will usually fix the issue.

  

- When entering data into a multi-column region the data can sometimes be rendered a line above or below the intended location in the preview window. When the line is near the start or end of a column or region it may be rendered in the wrong column or outside of the region entirely.
- Copy and pasting text into a new location within a region may not update in preview view properly.
- When swapping between auto layout or single column, regions may sometimes become stuck rendering an old layout.
- Auto layout regions sometimes get stuck in a non-equal state.
    - Workaround:
        - Swapping to a different file and back, or closing and reopeing the file will force a reload of the data and fix the render issue.

### Other

- Exporting a document with pandoc columns that contains other embedded fenced divs will not export properly.
- Changes to a document may require a file reload to properly update Multi-Column Reflow.
- Long paragraphs of text will not be split across columns in Multi-Column Reflow, as they are rendered as a single chunks of content by Obsidian.  
      
      
    
- The Obsidian API and this plugin are both still works in progress and both are subject to change.

  
  

# Depricated

These syntax options are currently still supported but are being depricated for the newer syntax above.

#### **Code-Block Start Tags**

> ```start-multi-column  
> ```

and

> ```multi-column-start  
> ```

This syntax has been entierly depricated due to many compounding issues caused by MCM conflicting with Obsidian syntax. Notes will display an error on each column region until the syntax is updated. You can use the global syntax update featuer within the settings window, or the note specific command "Fix Multi-Column Syntax in File" within the Command Pallete

#### **Start Multi-Column Region:**

- === start-multi-column: A_unique_region_ID_2
- === multi-column-start: A_unique_region_ID_3

#### **Settings Regions**:

```settings```  
```column-settings```  
```multi-column-settings```

#### **End a Column:**

- === column-end ===
- === end-column ===
- === column-break ===
- === break-column ===

#### **End Multi-Column Region:**

- === end-multi-column
- === multi-column-end