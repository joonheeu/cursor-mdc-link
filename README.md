# Cursor MDC Link

A powerful Cursor IDE extension that provides universal MDC link support across all file types with configurable file extensions.

![MDC Link Demo](images/demo.gif)

## Features

### Core Features
- **Universal File Support**: Works in any file type (`.ts`, `.js`, `.md`, `.py`, `.java`, etc.)
- **MDC Link Recognition**: Detects `[text](mdc:filename)` link patterns
- **Cmd+Click Navigation**: Click on MDC links to navigate to target files
- **Go to Definition**: F12 support for MDC links
- **Configurable Extensions**: Customize which file extensions are allowed
- **Smart File Resolution**: Automatically searches current directory and workspace root
- **Auto Extension Detection**: Automatically appends appropriate extensions when missing
- **Global Toggle**: Enable/disable MDC links globally

### Advanced Features
- **Link Validation**: Real-time validation of MDC links with broken link warnings
- **Search Scope Control**: Configure specific directories to search in
- **Performance Optimization**: File caching and exclusion patterns for better performance
- **Advanced Link Support**: 
  - Relative paths (`../docs/file.md`)
  - Line number navigation (`file.ts:25`)
  - Anchor links (`file.md#section`)
- **Visual Enhancements**: 
  - Customizable link styling and colors
  - File type icons in tooltips
  - Hover previews
- **Auto-completion**: Intelligent file suggestions when typing MDC links
- **Recent Files**: Quick access to recently used files
- **Debugging Tools**: Comprehensive logging and cache management

## Usage

### Basic Usage

1. In any file, create MDC links using the format:
   ```markdown
   [Backend Documentation](mdc:backend.mdc)
   [Frontend Code](mdc:frontend)
   [TypeScript Example](mdc:example.ts)
   [Configuration File](mdc:config)
   ```

2. Use Cmd+Click (or Ctrl+Click) or F12 to navigate to the linked files

### Supported Link Formats

- `[text](mdc:filename.ext)` - Direct file reference
- `[text](mdc:filename)` - Auto-extension detection
- `[text](mdc:path/to/file)` - Relative path support
- `[text](mdc:../docs/file.md)` - Relative path navigation
- `[text](mdc:file.ts:25)` - Line number navigation
- `[text](mdc:file.md#section)` - Anchor link support

## Configuration

The extension provides comprehensive configuration options for fine-tuning behavior:

### Basic Settings

Access via `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)":

```json
{
  "mdcLink.enableForAllFiles": true,
  "mdcLink.allowedExtensions": [
    ".mdc", ".md", ".ts", ".js", ".json", 
    ".html", ".css", ".scss", ".vue", 
    ".jsx", ".tsx", ".py", ".java", 
    ".cpp", ".c", ".h", ".hpp", ".cs", 
    ".php", ".rb", ".go", ".rs", ".swift", 
    ".kt", ".scala", ".sh", ".bat", ".ps1", 
    ".yml", ".yaml", ".xml", ".sql", ".txt"
  ]
}
```

### Advanced Configuration Options

#### Link Validation
- **`mdcLink.validateLinks`** (boolean, default: `true`)
  - Enable real-time link validation
- **`mdcLink.showBrokenLinkWarnings`** (boolean, default: `true`)
  - Show warnings for broken links

#### Search Control
- **`mdcLink.searchPaths`** (array, default: `[]`)
  - Specific directories to search in (empty = search entire workspace)
- **`mdcLink.includeSubdirectories`** (boolean, default: `true`)
  - Include subdirectories in search
- **`mdcLink.maxSearchDepth`** (number, default: `5`)
  - Maximum search depth (0 = unlimited)

#### Performance
- **`mdcLink.cacheEnabled`** (boolean, default: `true`)
  - Enable file search result caching
- **`mdcLink.cacheTimeout`** (number, default: `300000`)
  - Cache timeout in milliseconds (5 minutes)
- **`mdcLink.excludePatterns`** (array, default: comprehensive list)
  - File/folder patterns to exclude from search

#### Advanced Link Features
- **`mdcLink.supportRelativePaths`** (boolean, default: `true`)
  - Support relative path navigation (`../docs/file.md`)
- **`mdcLink.supportAnchorLinks`** (boolean, default: `true`)
  - Support anchor links (`file.md#section`)
- **`mdcLink.supportLineNumbers`** (boolean, default: `true`)
  - Support line number navigation (`file.ts:25`)

#### Visual Customization
- **`mdcLink.linkDecoration`** (string, default: `"underline"`)
  - Link decoration style: `"underline"`, `"dotted"`, `"wavy"`, `"none"`
- **`mdcLink.linkColor`** (string, default: `"#007ACC"`)
  - Link color (hex color code)
- **`mdcLink.hoverPreview`** (boolean, default: `true`)
  - Show file preview on hover
- **`mdcLink.showFileIcons`** (boolean, default: `true`)
  - Show file type icons in tooltips

#### Auto-completion
- **`mdcLink.autoComplete`** (boolean, default: `true`)
  - Enable auto-completion for MDC links
- **`mdcLink.suggestRecentFiles`** (boolean, default: `true`)
  - Suggest recently used files in auto-completion

#### Debugging
- **`mdcLink.debugMode`** (boolean, default: `false`)
  - Enable debug mode for detailed logging
- **`mdcLink.logLevel`** (string, default: `"info"`)
  - Log level: `"error"`, `"warn"`, `"info"`, `"debug"`

## Commands

The extension provides several commands accessible via `Ctrl+Shift+P`:

- **`MDC: Open MDC Link`** - Open a specific MDC link
- **`MDC: Clear Cache`** - Clear the file search cache
- **`MDC: Show Link Statistics`** - Display cache and usage statistics

## File Resolution Logic

The extension searches for files in the following order:

1. **Exact filename match** in current directory
2. **Auto-extension detection** in current directory (if no extension provided)
3. **Exact filename match** in workspace root
4. **Auto-extension detection** in workspace root (if no extension provided)
5. **Search in configured paths** (if `searchPaths` is set)
6. **Recursive search** in subdirectories (if enabled)

## Development

### Building

```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm run compile

# Watch mode for development
pnpm run watch

# Package extension
vsce package
```

### Installation

1. Build the extension:
   ```bash
   pnpm install
   pnpm run compile
   ```

2. Install in Cursor IDE:
   ```bash
   code --install-extension cursor-mdc-link-0.1.0.vsix
   ```

## Use Cases

- **Documentation**: Link to related documentation files from code
- **Cross-References**: Create references between different file types
- **Project Navigation**: Quick navigation between related files
- **Code Examples**: Link to example files from documentation
- **Configuration**: Reference config files from any source file

## Examples

### Basic Usage

#### In TypeScript Files
```typescript
// See the implementation details in [UserService](mdc:user-service.ts)
// Check the [API documentation](mdc:api-docs.md)
// Review the [configuration](mdc:config.json)
```

#### In Markdown Files
```markdown
## Implementation
- [Backend Service](mdc:backend-service.ts)
- [Database Schema](mdc:schema.sql)
- [API Tests](mdc:api-tests.js)
```

#### In Python Files
```python
# See [Data Models](mdc:models.py)
# Check [Configuration](mdc:settings)
# Review [Tests](mdc:test_models.py)
```

### Advanced Usage

#### Line Number Navigation
```typescript
// Jump to specific line in [UserService](mdc:user-service.ts:45)
// Check error handling at [line 120](mdc:error-handler.ts:120)
```

#### Relative Path Navigation
```markdown
## Documentation
- [API Reference](../docs/api-reference.md)
- [Configuration Guide](./config-guide.md)
- [Examples](../../examples/README.md)
```

#### Auto-completion
When typing `mdc:` in any file, the extension will suggest:
- Recent files you've accessed
- Files in the current directory
- Files matching your search patterns

#### Hover Previews
Hover over any MDC link to see:
- File path
- File type icon
- Line number (if specified)

### Performance Optimization Examples

#### Large Project Configuration
```json
{
  "mdcLink.searchPaths": ["./src", "./docs", "./examples"],
  "mdcLink.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**",
    "**/coverage/**"
  ],
  "mdcLink.maxSearchDepth": 3,
  "mdcLink.cacheEnabled": true,
  "mdcLink.cacheTimeout": 600000
}
```

#### Development vs Production Settings
```json
{
  "mdcLink.debugMode": true,
  "mdcLink.logLevel": "debug",
  "mdcLink.showBrokenLinkWarnings": true,
  "mdcLink.validateLinks": true
}
```

## Troubleshooting

### Links Not Working

1. Check if the extension is enabled: `mdcLink.enableForAllFiles` should be `true`
2. Verify the target file extension is in `mdcLink.allowedExtensions`
3. Check the Developer Console for error messages
4. Ensure the target file exists in the expected location

### Debugging

Enable developer tools to see extension logs:
1. `Ctrl+Shift+P` → "Developer: Toggle Developer Tools"
2. Check the Console tab for MDC Link Extension messages

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.