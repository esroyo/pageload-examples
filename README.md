## HTML Page Loading Fundamentals

### **1. DOM Parsing Process**

The browser reads HTML sequentially from top to bottom, building the DOM tree.
This process can be **blocked** by certain resources.

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html) - Shows how
HTML parsing continues while content loads, with gradual rendering

### **2. CSS Loading and Its Critical Impact**

#### **CSS Blocks Rendering (Always)**

- All CSS in `<head>` blocks the first paint/render
- The browser won't display content until CSS is processed
- Creates the CSSOM (CSS Object Model) before rendering

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style) -
Demonstrates how external CSS blocks the first paint

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style-inline) -
Shows immediate rendering with inline CSS

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style-critical) -
Optimal approach with critical CSS inline

#### **🔥 CRITICAL: CSS Blocks JavaScript Execution**

This is the most important blocking behavior that's often overlooked:

- **JavaScript execution is blocked by any pending CSS downloads/processing**
- Even `async` and `defer` scripts wait for CSS to complete before executing
- Inline scripts are also blocked by CSS loading
- This prevents JavaScript from accessing computed styles before CSS is ready

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style-script) -
Key example showing how slow CSS blocks all JavaScript execution

### **3. JavaScript Loading Patterns and CSS Interactions**

#### **Synchronous Scripts (Default)**

```html
<script src="script.js"></script>
```

- **Blocks DOM parsing** until downloaded and executed
- **Blocked by CSS loading** - waits for all pending CSS
- Execute in document order
- Can prevent page display entirely

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-script) -
Shows how regular scripts halt DOM parsing

#### **Async Scripts**

```html
<script async src="script.js"></script>
```

- Download parallel to DOM parsing (non-blocking download)
- **Still blocked by CSS loading** during execution phase
- Execute immediately when both script AND CSS are ready
- Execute in download completion order, not document order

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style-script-async) -
Shows async scripts still waiting for CSS

#### **Deferred Scripts**

```html
<script defer src="script.js"></script>
```

- Download parallel to DOM parsing (non-blocking download)
- **Blocked by CSS loading** until CSS completes
- Execute after DOM parsing completes AND CSS is ready
- Execute in document order
- The examples show deferred scripts maintaining order despite different
  download times

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style-script-defer) -
Demonstrates defer behavior with CSS interaction

#### **Dynamic Scripts (JavaScript-created)**

```javascript
var script = document.createElement("script");
script.src = "script.js";
document.body.append(script);
```

- Behave as **async by default**
- **Still blocked by CSS** when they're ready to execute
- Can be made synchronous with `script.async = false`

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-script-dynamic) -
JavaScript-created scripts and their behavior

[🔗 Example](https://esroyo.github.io/pageload-examples/#basic-html-style-script-inline-async) -
How to bypass CSS blocking for inline scripts

### **4. The CSS-JavaScript Blocking Chain**

The examples demonstrate this critical sequence:

1. **CSS starts loading** (render-blocking)
2. **JavaScript discovers CSS is loading**
3. **JavaScript execution pauses** (even async/defer scripts)
4. **CSS finishes loading and parsing**
5. **JavaScript can now execute**
6. **Rendering can proceed**

### **5. Resource Loading Priority**

Based in the throttled examples:

1. **HTML parsing begins**
2. **CSS discovered and requested** (blocks rendering AND script execution)
3. **Scripts discovered and requested** (download in parallel)
4. **CSS completes** → JavaScript can execute
5. **DOM parsing completes**
6. **Render tree creation** (DOM + CSSOM)
7. **Layout and paint**

### **6. Performance Implications**

- **Slow CSS blocks everything**: the throttled CSS examples show how slow
  stylesheets delay all JavaScript execution
- **JavaScript dependency chain**: Scripts can't run until CSS is ready,
  creating cascading delays
- **Critical path optimization**: CSS should be minimal and fast, as it's the
  bottleneck for both rendering and script execution
- **Loading strategy matters**: Even with async/defer, CSS remains the
  gatekeeper

### **Key Takeaway**

The examples demonstrate that **CSS is the critical bottleneck** in page
loading - it doesn't just block rendering, it blocks JavaScript execution,
making it the most important resource to optimize for page load performance.
