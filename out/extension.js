"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
// 전역 변수
let fileCache = {};
let recentFiles = [];
let decorationType;
function activate(context) {
    log("MDC Link Extension is now active!", "info");
    // 설정 가져오기
    const config = getConfig();
    log(`Configuration loaded: ${JSON.stringify(config, null, 2)}`, "debug");
    // 링크 장식 타입 설정
    setupLinkDecoration(config);
    // MDC 링크 정의 제공자 등록 (모든 파일용)
    const linkProvider = vscode.languages.registerDocumentLinkProvider({ scheme: "file" }, {
        provideDocumentLinks(document, token) {
            log(`MDC Link Provider called for: ${document.fileName}`, "debug");
            // 설정 확인
            if (!config.enableForAllFiles) {
                log("MDC links disabled for all files", "debug");
                return [];
            }
            const links = [];
            const text = document.getText();
            // mdc: 링크 패턴 매칭 (예: [텍스트](mdc:filename.mdc))
            const mdcLinkRegex = /\[([^\]]+)\]\(mdc:([^)]+)\)/g;
            let match;
            match = mdcLinkRegex.exec(text);
            while (match) {
                log(`Found MDC link: ${match[0]}`, "debug");
                const startPos = document.positionAt(match.index + match[0].indexOf("mdc:"));
                const endPos = document.positionAt(match.index + match[0].lastIndexOf(")"));
                const targetFile = match[2];
                const linkResult = resolveMdcFile(document, targetFile, config);
                if (linkResult.uri) {
                    log(`Resolved link to: ${linkResult.uri.fsPath}`, "debug");
                    const link = new vscode.DocumentLink(new vscode.Range(startPos, endPos), linkResult.uri);
                    // 툴팁 설정
                    let tooltip = `Open ${path.basename(targetFile)}`;
                    if (config.showFileIcons) {
                        tooltip = `📄 ${tooltip}`;
                    }
                    if (linkResult.lineNumber) {
                        tooltip += ` (Line ${linkResult.lineNumber})`;
                    }
                    link.tooltip = tooltip;
                    links.push(link);
                }
                else {
                    log(`Could not resolve link for: ${targetFile}`, "warn");
                    if (config.showBrokenLinkWarnings) {
                        showBrokenLinkWarning(document, startPos, targetFile);
                    }
                }
                match = mdcLinkRegex.exec(text);
            }
            log(`Total links found: ${links.length}`, "debug");
            return links;
        },
    });
    // MDC 파일 정의 제공자 등록 (Go to Definition - 모든 파일)
    const definitionProvider = vscode.languages.registerDefinitionProvider({ scheme: "file" }, {
        provideDefinition(document, position, token) {
            // 설정 확인
            if (!config.enableForAllFiles) {
                return undefined;
            }
            const range = document.getWordRangeAtPosition(position, /mdc:[^)]+/);
            if (!range) {
                return undefined;
            }
            const linkText = document.getText(range);
            const targetFile = linkText.replace("mdc:", "");
            const linkResult = resolveMdcFile(document, targetFile, config);
            if (linkResult.uri) {
                const position = linkResult.lineNumber
                    ? new vscode.Position(linkResult.lineNumber - 1, 0)
                    : new vscode.Position(0, 0);
                return new vscode.Location(linkResult.uri, position);
            }
            return undefined;
        },
    });
    // 자동완성 제공자 등록
    const completionProvider = vscode.languages.registerCompletionItemProvider({ scheme: "file" }, {
        provideCompletionItems(document, position, token, context) {
            if (!config.autoComplete) {
                return [];
            }
            const lineText = document.lineAt(position).text;
            const beforeCursor = lineText.substring(0, position.character);
            // mdc: 뒤에 자동완성 제공
            if (beforeCursor.includes("mdc:") && beforeCursor.endsWith("mdc:")) {
                return provideFileCompletions(document, config);
            }
            return [];
        },
    }, ":");
    // 호버 제공자 등록
    const hoverProvider = vscode.languages.registerHoverProvider({ scheme: "file" }, {
        provideHover(document, position, token) {
            if (!config.hoverPreview) {
                return undefined;
            }
            const range = document.getWordRangeAtPosition(position, /mdc:[^)]+/);
            if (!range) {
                return undefined;
            }
            const linkText = document.getText(range);
            const targetFile = linkText.replace("mdc:", "");
            const linkResult = resolveMdcFile(document, targetFile, config);
            if (linkResult.uri) {
                return new vscode.Hover(`📄 **${path.basename(targetFile)}**\n\n${linkResult.uri.fsPath}`);
            }
            return undefined;
        },
    });
    // 명령어 등록
    const openLinkCommand = vscode.commands.registerCommand("mdc.openLink", (uri) => {
        openFile(uri);
    });
    const clearCacheCommand = vscode.commands.registerCommand("mdc.clearCache", () => {
        clearCache();
        vscode.window.showInformationMessage("MDC Link cache cleared");
    });
    const showLinkStatsCommand = vscode.commands.registerCommand("mdc.showLinkStats", () => {
        showLinkStats();
    });
    // 설정 변경 감지
    const configChangeListener = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("mdcLink")) {
            log("Configuration changed, reloading...", "info");
            // 캐시 클리어
            clearCache();
            // 장식 타입 재설정
            if (decorationType) {
                decorationType.dispose();
            }
            setupLinkDecoration(getConfig());
        }
    });
    // 컨텍스트에 등록
    context.subscriptions.push(linkProvider, definitionProvider, completionProvider, hoverProvider, openLinkCommand, clearCacheCommand, showLinkStatsCommand, configChangeListener);
    // 정기적으로 캐시 정리
    setInterval(() => {
        cleanupCache(config);
    }, config.cacheTimeout);
}
exports.activate = activate;
function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
}
exports.deactivate = deactivate;
// 설정 가져오기 함수
function getConfig() {
    const config = vscode.workspace.getConfiguration("mdcLink");
    return {
        enableForAllFiles: config.get("enableForAllFiles", true),
        allowedExtensions: config.get("allowedExtensions", [
            ".mdc",
            ".md",
            ".ts",
            ".js",
            ".json",
            ".html",
            ".css",
            ".scss",
            ".vue",
            ".jsx",
            ".tsx",
            ".py",
            ".java",
            ".cpp",
            ".c",
            ".h",
            ".hpp",
            ".cs",
            ".php",
            ".rb",
            ".go",
            ".rs",
            ".swift",
            ".kt",
            ".scala",
            ".sh",
            ".bat",
            ".ps1",
            ".yml",
            ".yaml",
            ".xml",
            ".sql",
            ".txt",
        ]),
        validateLinks: config.get("validateLinks", true),
        showBrokenLinkWarnings: config.get("showBrokenLinkWarnings", true),
        searchPaths: config.get("searchPaths", []),
        includeSubdirectories: config.get("includeSubdirectories", true),
        maxSearchDepth: config.get("maxSearchDepth", 5),
        cacheEnabled: config.get("cacheEnabled", true),
        cacheTimeout: config.get("cacheTimeout", 300000),
        excludePatterns: config.get("excludePatterns", [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
            "**/build/**",
            "**/.vscode/**",
        ]),
        supportRelativePaths: config.get("supportRelativePaths", true),
        supportAnchorLinks: config.get("supportAnchorLinks", true),
        supportLineNumbers: config.get("supportLineNumbers", true),
        linkDecoration: config.get("linkDecoration", "underline"),
        linkColor: config.get("linkColor", "#007ACC"),
        hoverPreview: config.get("hoverPreview", true),
        showFileIcons: config.get("showFileIcons", true),
        autoComplete: config.get("autoComplete", true),
        suggestRecentFiles: config.get("suggestRecentFiles", true),
        debugMode: config.get("debugMode", false),
        logLevel: config.get("logLevel", "info"),
    };
}
// 로깅 함수
function log(message, level = "info") {
    const config = getConfig();
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = levels[config.logLevel] || 2;
    const messageLevel = levels[level] || 2;
    if (messageLevel <= currentLevel) {
        console.log(`[MDC Link ${level.toUpperCase()}] ${message}`);
    }
}
// 링크 장식 설정
function setupLinkDecoration(config) {
    if (decorationType) {
        decorationType.dispose();
    }
    const decorationOptions = {
        color: config.linkColor,
    };
    switch (config.linkDecoration) {
        case "underline":
            decorationOptions.textDecoration = "underline";
            break;
        case "dotted":
            decorationOptions.textDecoration = "underline dotted";
            break;
        case "wavy":
            decorationOptions.textDecoration = "underline wavy";
            break;
        default:
            // 장식 없음
            break;
    }
    decorationType =
        vscode.window.createTextEditorDecorationType(decorationOptions);
}
// MDC 파일 해결 함수 (향상된 버전)
function resolveMdcFile(document, targetFile, config) {
    log(`Resolving file: ${targetFile}`, "debug");
    // 라인 번호 파싱 (file.ts:25)
    let lineNumber;
    let actualTargetFile = targetFile;
    if (config.supportLineNumbers && targetFile.includes(":")) {
        const parts = targetFile.split(":");
        if (parts.length === 2 && !Number.isNaN(Number(parts[1]))) {
            actualTargetFile = parts[0];
            lineNumber = Number(parts[1]);
        }
    }
    // 앵커 링크 파싱 (file.md#section)
    let anchor;
    if (config.supportAnchorLinks && actualTargetFile.includes("#")) {
        const parts = actualTargetFile.split("#");
        actualTargetFile = parts[0];
        anchor = parts[1];
    }
    // 캐시 확인
    if (config.cacheEnabled) {
        const cacheKey = `${document.uri.fsPath}:${actualTargetFile}`;
        const cached = fileCache[cacheKey];
        if (cached && Date.now() - cached.timestamp < config.cacheTimeout) {
            log(`Cache hit for: ${actualTargetFile}`, "debug");
            return { uri: cached.uri, lineNumber };
        }
    }
    const currentDir = path.dirname(document.uri.fsPath);
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    // 검색 경로 결정
    const searchPaths = config.searchPaths.length > 0
        ? config.searchPaths.map((p) => path.resolve(workspaceFolder?.uri.fsPath || "", p))
        : [currentDir, workspaceFolder?.uri.fsPath].filter(Boolean);
    // 파일 검색
    for (const searchPath of searchPaths) {
        const result = findFileInDirectory(actualTargetFile, searchPath, config, workspaceFolder?.uri.fsPath || "");
        if (result) {
            // 캐시에 저장
            if (config.cacheEnabled) {
                const cacheKey = `${document.uri.fsPath}:${actualTargetFile}`;
                fileCache[cacheKey] = {
                    uri: result,
                    timestamp: Date.now(),
                };
            }
            // 최근 파일에 추가
            addToRecentFiles(result.fsPath);
            return { uri: result, lineNumber };
        }
    }
    log(`Could not find file: ${actualTargetFile}`, "warn");
    return { uri: undefined, lineNumber };
}
// 디렉토리에서 파일 찾기
function findFileInDirectory(targetFile, searchPath, config, workspaceRoot, depth = 0) {
    if (config.maxSearchDepth > 0 && depth > config.maxSearchDepth) {
        return undefined;
    }
    // 제외 패턴 확인
    const relativePath = path.relative(workspaceRoot, searchPath);
    if (config.excludePatterns.some((pattern) => matchesPattern(relativePath, pattern) ||
        matchesPattern(searchPath, pattern))) {
        return undefined;
    }
    if (!fs.existsSync(searchPath) || !fs.statSync(searchPath).isDirectory()) {
        return undefined;
    }
    // 1. 정확한 파일명으로 찾기
    let targetPath = path.join(searchPath, targetFile);
    if (fs.existsSync(targetPath)) {
        return vscode.Uri.file(targetPath);
    }
    // 2. 확장자가 없으면 허용된 확장자들을 시도
    const hasExtension = path.extname(targetFile) !== "";
    if (!hasExtension) {
        for (const ext of config.allowedExtensions) {
            targetPath = path.join(searchPath, `${targetFile}${ext}`);
            if (fs.existsSync(targetPath)) {
                return vscode.Uri.file(targetPath);
            }
        }
    }
    // 3. 하위 디렉토리에서 재귀 검색
    if (config.includeSubdirectories) {
        try {
            const entries = fs.readdirSync(searchPath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const subPath = path.join(searchPath, entry.name);
                    const result = findFileInDirectory(targetFile, subPath, config, workspaceRoot, depth + 1);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        catch (error) {
            log(`Error reading directory ${searchPath}: ${error}`, "warn");
        }
    }
    return undefined;
}
// 파일 자동완성 제공
function provideFileCompletions(document, config) {
    const completions = [];
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
        return completions;
    }
    // 최근 파일 제안
    if (config.suggestRecentFiles && recentFiles.length > 0) {
        for (const recentFile of recentFiles
            .sort((a, b) => b.lastUsed - a.lastUsed)
            .slice(0, 10)) {
            const item = new vscode.CompletionItem(path.basename(recentFile.path), vscode.CompletionItemKind.File);
            item.detail = recentFile.path;
            item.documentation = `Recent file: ${recentFile.path}`;
            completions.push(item);
        }
    }
    // 현재 디렉토리의 파일들 제안
    const currentDir = path.dirname(document.uri.fsPath);
    try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile()) {
                const item = new vscode.CompletionItem(entry.name, vscode.CompletionItemKind.File);
                item.detail = path.join(currentDir, entry.name);
                completions.push(item);
            }
        }
    }
    catch (error) {
        log(`Error reading directory for completions: ${error}`, "warn");
    }
    return completions;
}
// 깨진 링크 경고 표시
function showBrokenLinkWarning(document, position, targetFile) {
    const diagnostic = new vscode.Diagnostic(new vscode.Range(position, position.translate(0, targetFile.length)), `File not found: ${targetFile}`, vscode.DiagnosticSeverity.Warning);
    diagnostic.source = "MDC Link Extension";
    // 진단 컬렉션에 추가 (실제로는 더 복잡한 구현이 필요)
    log(`Broken link warning: ${targetFile}`, "warn");
}
// 파일 열기
function openFile(uri) {
    vscode.window.showTextDocument(uri);
    addToRecentFiles(uri.fsPath);
}
// 최근 파일에 추가
function addToRecentFiles(filePath) {
    recentFiles = recentFiles.filter((f) => f.path !== filePath);
    recentFiles.unshift({
        path: filePath,
        lastUsed: Date.now(),
    });
    // 최대 50개까지만 유지
    if (recentFiles.length > 50) {
        recentFiles = recentFiles.slice(0, 50);
    }
}
// 캐시 클리어
function clearCache() {
    fileCache = {};
    log("Cache cleared", "debug");
}
// 캐시 정리
function cleanupCache(config) {
    if (!config.cacheEnabled) {
        return;
    }
    const now = Date.now();
    const expiredKeys = Object.keys(fileCache).filter((key) => now - fileCache[key].timestamp > config.cacheTimeout);
    for (const key of expiredKeys) {
        delete fileCache[key];
    }
    if (expiredKeys.length > 0) {
        log(`Cleaned up ${expiredKeys.length} expired cache entries`, "debug");
    }
}
// 링크 통계 표시
function showLinkStats() {
    const stats = {
        cachedFiles: Object.keys(fileCache).length,
        recentFiles: recentFiles.length,
        config: getConfig(),
    };
    vscode.window.showInformationMessage(`MDC Link Stats:
• Cached files: ${stats.cachedFiles}
• Recent files: ${stats.recentFiles}
• Enabled: ${stats.config.enableForAllFiles}
• Cache enabled: ${stats.config.cacheEnabled}`);
}
// 간단한 glob 패턴 매칭 함수
function matchesPattern(filePath, pattern) {
    // ** 패턴을 처리
    if (pattern.includes("**")) {
        const parts = pattern.split("**");
        if (parts.length === 2) {
            const prefix = parts[0];
            const suffix = parts[1];
            return filePath.startsWith(prefix) && filePath.endsWith(suffix);
        }
    }
    // * 패턴을 처리
    if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
        return regex.test(filePath);
    }
    // 정확한 매칭
    return filePath === pattern || filePath.includes(pattern);
}
//# sourceMappingURL=extension.js.map