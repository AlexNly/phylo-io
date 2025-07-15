# Phylo.io Integration Guide

This guide explains how to integrate the improved phylo.io library into your bioinformatics tools and workflows, particularly for generating interactive tree comparison reports.

## Overview

The enhanced phylo.io build provides:
- **Single-file distribution** - Only need to include one JavaScript file
- **File:// protocol support** - Works directly from local HTML files without HTTP server
- **Simplified integration** - No separate worker files to manage
- **Modern browser compatibility** - Works with Webpack 5 and latest browsers

## Quick Integration

### Basic Setup

1. **Download the built library:**
   ```bash
   wget https://raw.githubusercontent.com/AlexNly/phylo-io/fix-webpack5-worker-issues/dist/phylo.js
   ```

2. **Create a minimal HTML template:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Tree Comparison Report</title>
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
       <script src="phylo.js"></script>
   </head>
   <body>
       <div id="tree1" style="width: 45%; height: 600px; display: inline-block;"></div>
       <div id="tree2" style="width: 45%; height: 600px; display: inline-block;"></div>
       
       <script>
           // Your tree data and initialization code here
       </script>
   </body>
   </html>
   ```

### Integration Examples

## 1. Tool Output Reports

Perfect for generating interactive reports from phylogenetic analysis tools:

```javascript
// Example: Generate comparison report
function generateTreeReport(newick1, newick2, outputFile) {
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Phylogenetic Tree Comparison</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <script src="phylo.js"></script>
</head>
<body>
    <h1>Tree Comparison Results</h1>
    <p><strong>Instructions:</strong> Press 't' to toggle topology-difference coloring</p>
    
    <div id="container1" style="width: 45%; height: 600px; display: inline-block; margin: 10px;"></div>
    <div id="container2" style="width: 45%; height: 600px; display: inline-block; margin: 10px;"></div>
    
    <script>
        const tree1 = "${newick1}";
        const tree2 = "${newick2}";
        
        const phylo = PhyloIO.init();
        const c1 = phylo.create_container("container1");
        const c2 = phylo.create_container("container2");
        
        c1.add_tree(tree1, {'use_branch_length': true});
        c2.add_tree(tree2, {'use_branch_length': true});
        
        phylo.settings.compareMode = true;
        phylo.bound_container = [c1, c2];
        phylo.start();
    </script>
</body>
</html>`;
    
    fs.writeFileSync(outputFile, htmlTemplate);
    console.log(`Interactive report saved to: ${outputFile}`);
}
```

## 2. Batch Processing

For processing multiple tree comparisons:

```bash
#!/bin/bash
# Example: Generate reports for multiple tree pairs

PHYLO_JS_PATH="./phylo.js"
OUTPUT_DIR="./reports"

mkdir -p "$OUTPUT_DIR"

for tree_pair in tree_pairs/*.txt; do
    base_name=$(basename "$tree_pair" .txt)
    tree1=$(sed -n '1p' "$tree_pair")
    tree2=$(sed -n '2p' "$tree_pair")
    
    cat > "$OUTPUT_DIR/${base_name}.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Comparison: ${base_name}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <script src="../phylo.js"></script>
</head>
<body>
    <h1>Tree Comparison: ${base_name}</h1>
    <div id="container1" style="width: 45%; height: 600px; display: inline-block;"></div>
    <div id="container2" style="width: 45%; height: 600px; display: inline-block;"></div>
    
    <script>
        const phylo = PhyloIO.init();
        const c1 = phylo.create_container("container1");
        const c2 = phylo.create_container("container2");
        
        c1.add_tree("${tree1}");
        c2.add_tree("${tree2}");
        
        phylo.settings.compareMode = true;
        phylo.bound_container = [c1, c2];
        phylo.start();
    </script>
</body>
</html>
EOF
done
```

## 3. Python Integration

For Python-based phylogenetic tools:

```python
import os
from jinja2 import Template

class PhyloReportGenerator:
    def __init__(self, phylo_js_path="phylo.js"):
        self.phylo_js_path = phylo_js_path
        
    def generate_comparison_report(self, tree1_newick, tree2_newick, output_path, 
                                 title="Tree Comparison", metadata=None):
        """Generate an interactive tree comparison report"""
        
        template = Template("""
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <script src="{{ phylo_js_path }}"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { width: 45%; height: 600px; display: inline-block; margin: 10px; }
        .metadata { background: #f5f5f5; padding: 10px; margin: 10px 0; }
        .instructions { background: #e3f2fd; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>{{ title }}</h1>
    
    {% if metadata %}
    <div class="metadata">
        <h3>Analysis Metadata</h3>
        {% for key, value in metadata.items() %}
        <p><strong>{{ key }}:</strong> {{ value }}</p>
        {% endfor %}
    </div>
    {% endif %}
    
    <div class="instructions">
        <strong>Instructions:</strong> Press 't' to toggle topology-difference coloring. 
        Use mouse wheel to zoom, drag to pan.
    </div>
    
    <div id="container1" class="container"></div>
    <div id="container2" class="container"></div>
    
    <script>
        const phylo = PhyloIO.init();
        const c1 = phylo.create_container("container1");
        const c2 = phylo.create_container("container2");
        
        c1.add_tree(`{{ tree1_newick }}`, {'use_branch_length': true});
        c2.add_tree(`{{ tree2_newick }}`, {'use_branch_length': true});
        
        phylo.settings.compareMode = true;
        phylo.bound_container = [c1, c2];
        phylo.start();
    </script>
</body>
</html>
        """)
        
        html_content = template.render(
            title=title,
            phylo_js_path=self.phylo_js_path,
            tree1_newick=tree1_newick,
            tree2_newick=tree2_newick,
            metadata=metadata
        )
        
        with open(output_path, 'w') as f:
            f.write(html_content)
        
        print(f"Interactive report generated: {output_path}")

# Example usage
generator = PhyloReportGenerator("./phylo.js")
generator.generate_comparison_report(
    tree1_newick="((A,B),C);",
    tree2_newick="(A,(B,C));",
    output_path="comparison_report.html",
    title="Bootstrap vs ML Tree Comparison",
    metadata={
        "Analysis Date": "2024-01-15",
        "Software": "RAxML-NG 1.2.0",
        "Dataset": "16S rRNA sequences",
        "Bootstrap Replicates": "1000"
    }
)
```

## 4. R Integration

For R-based phylogenetic workflows:

```r
# R function to generate phylo.io reports
library(glue)

generate_phylo_report <- function(tree1_newick, tree2_newick, output_file, 
                                title = "Tree Comparison", phylo_js_path = "phylo.js") {
  
  html_template <- glue('
<!DOCTYPE html>
<html>
<head>
    <title>{title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <script src="{phylo_js_path}"></script>
</head>
<body>
    <h1>{title}</h1>
    <p><strong>Instructions:</strong> Press "t" to toggle topology-difference coloring</p>
    
    <div id="container1" style="width: 45%; height: 600px; display: inline-block;"></div>
    <div id="container2" style="width: 45%; height: 600px; display: inline-block;"></div>
    
    <script>
        const phylo = PhyloIO.init();
        const c1 = phylo.create_container("container1");
        const c2 = phylo.create_container("container2");
        
        c1.add_tree("{tree1_newick}");
        c2.add_tree("{tree2_newick}");
        
        phylo.settings.compareMode = true;
        phylo.bound_container = [c1, c2];
        phylo.start();
    </script>
</body>
</html>
  ')
  
  writeLines(html_template, output_file)
  message("Report generated: ", output_file)
}

# Example usage
library(ape)
tree1 <- rtree(10)
tree2 <- rtree(10)

generate_phylo_report(
  tree1_newick = write.tree(tree1),
  tree2_newick = write.tree(tree2),
  output_file = "tree_comparison.html",
  title = "Random Tree Comparison"
)
```

## Key Features for Tool Integration

### 1. No Server Required
- Generated HTML files work directly when opened in browser
- Perfect for offline analysis and report sharing
- No complex deployment needed

### 2. Self-Contained
- Single JavaScript file contains everything needed
- No external dependencies beyond Bootstrap icons
- Easy to bundle with your tool's output

### 3. Interactive Features
- **Zoom and Pan**: Mouse wheel and drag interactions
- **Topology Comparison**: Press 't' to highlight differences
- **Branch Length Visualization**: Configurable branch length display
- **Responsive Design**: Works on different screen sizes

### 4. Error Handling
- Graceful handling of invalid tree formats
- No console spam from browser extensions
- Robust worker communication

## Best Practices

1. **Always validate Newick format** before passing to phylo.io
2. **Include usage instructions** in your generated reports
3. **Test with different browsers** to ensure compatibility
4. **Consider file size** - the phylo.js file is ~8.8MB
5. **Use relative paths** for phylo.js if bundling with your tool

## Troubleshooting

- **Trees not displaying**: Check Newick format validity
- **Console errors**: Ensure phylo.js is loaded before initialization
- **Performance issues**: Large trees (>1000 taxa) may be slow
- **Browser compatibility**: Requires modern browsers with ES6 support

## Example Output

The generated reports provide:
- Side-by-side tree visualization
- Interactive topology difference highlighting
- Zoom and pan capabilities
- Professional-looking output suitable for publications

This integration approach makes phylo.io perfect for:
- Phylogenetic software output reports
- Comparative analysis workflows
- Educational materials
- Research publications with interactive supplements

---

*Note: This integration guide assumes you're using the enhanced phylo.io build with inline worker support. For the original version, additional worker files are required.*