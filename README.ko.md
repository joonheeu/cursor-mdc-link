# Cursor MDC Link

모든 파일 타입에서 설정 가능한 파일 확장자와 함께 범용 MDC 링크 지원을 제공하는 강력한 Cursor IDE 확장 프로그램입니다.

![MDC 링크 데모](https://i.imgur.com/PAltHPf.gif)

## 기능

### 핵심 기능
- **범용 파일 지원**: 모든 파일 타입에서 동작 (`.ts`,`.js`,`.md`,`.py`,`.java` 등)
- **MDC 링크 인식**:`[텍스트](mdc:파일명)` 링크 패턴 감지
- **Cmd+클릭 탐색**: MDC 링크를 클릭하여 대상 파일로 이동
- **정의로 이동**: MDC 링크에 대한 F12 지원
- **설정 가능한 확장자**: 허용할 파일 확장자 사용자 정의
- **스마트 파일 해결**: 현재 디렉토리와 워크스페이스 루트에서 자동 검색
- **자동 확장자 감지**: 확장자가 없을 때 적절한 확장자 자동 추가
- **전역 토글**: MDC 링크 전역 활성화/비활성화

### 고급 기능
- **링크 검증**: 실시간 MDC 링크 검증 및 깨진 링크 경고
- **검색 범위 제어**: 특정 디렉토리 검색 설정
- **성능 최적화**: 파일 캐싱 및 제외 패턴으로 성능 향상
- **고급 링크 지원**: 
  - 상대 경로 (`../docs/file.md`)
  - 라인 번호 탐색 (`file.ts:25`)
  - 앵커 링크 (`file.md#section`)
- **시각적 향상**: 
  - 커스터마이징 가능한 링크 스타일링 및 색상
  - 툴팁의 파일 타입 아이콘
  - 호버 미리보기
- **자동완성**: MDC 링크 입력 시 지능형 파일 제안
- **최근 파일**: 최근 사용한 파일에 대한 빠른 접근
- **디버깅 도구**: 포괄적인 로깅 및 캐시 관리

## 사용법

### 기본 사용법

1. 모든 파일에서 MDC 링크를 다음 형식으로 생성:

   ```markdown
   [백엔드 문서](mdc:backend.mdc)
   [프론트엔드 코드](mdc:frontend)
   [TypeScript 예시](mdc:example.ts)
   [설정 파일](mdc:config)
   ```
2. Cmd+클릭 (또는 Ctrl+클릭) 또는 F12를 사용하여 링크된 파일로 이동

### 지원되는 링크 형식

- `[텍스트](mdc:파일명.확장자)` - 직접 파일 참조
- `[텍스트](mdc:파일명)` - 자동 확장자 감지
- `[텍스트](mdc:경로/파일명)` - 상대 경로 지원
- `[텍스트](mdc:../docs/file.md)` - 상대 경로 탐색
- `[텍스트](mdc:file.ts:25)` - 라인 번호 탐색
- `[텍스트](mdc:file.md#section)` - 앵커 링크 지원

## 설정

확장 프로그램은 동작을 세밀하게 조정할 수 있는 포괄적인 설정 옵션을 제공합니다:

### 기본 설정

`Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"에서 접근:

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

### 고급 설정 옵션

#### 링크 검증
- **`mdcLink.validateLinks`** (boolean, 기본값: `true`)
  - 실시간 링크 검증 활성화
- **`mdcLink.showBrokenLinkWarnings`** (boolean, 기본값: `true`)
  - 깨진 링크에 대한 경고 표시

#### 검색 제어
- **`mdcLink.searchPaths`** (array, 기본값: `[]`)
  - 검색할 특정 디렉토리 (빈 배열 = 전체 워크스페이스 검색)
- **`mdcLink.includeSubdirectories`** (boolean, 기본값: `true`)
  - 하위 디렉토리 포함 검색
- **`mdcLink.maxSearchDepth`** (number, 기본값: `5`)
  - 최대 검색 깊이 (0 = 무제한)

#### 성능
- **`mdcLink.cacheEnabled`** (boolean, 기본값: `true`)
  - 파일 검색 결과 캐싱 활성화
- **`mdcLink.cacheTimeout`** (number, 기본값: `300000`)
  - 캐시 타임아웃 (밀리초, 5분)
- **`mdcLink.excludePatterns`** (array, 기본값: 포괄적 목록)
  - 검색에서 제외할 파일/폴더 패턴

#### 고급 링크 기능
- **`mdcLink.supportRelativePaths`** (boolean, 기본값: `true`)
  - 상대 경로 탐색 지원 (`../docs/file.md`)
- **`mdcLink.supportAnchorLinks`** (boolean, 기본값: `true`)
  - 앵커 링크 지원 (`file.md#section`)
- **`mdcLink.supportLineNumbers`** (boolean, 기본값: `true`)
  - 라인 번호 탐색 지원 (`file.ts:25`)

#### 시각적 커스터마이징
- **`mdcLink.linkDecoration`** (string, 기본값: `"underline"`)
  - 링크 장식 스타일: `"underline"`, `"dotted"`, `"wavy"`, `"none"`
- **`mdcLink.linkColor`** (string, 기본값: `"#007ACC"`)
  - 링크 색상 (16진수 색상 코드)
- **`mdcLink.hoverPreview`** (boolean, 기본값: `true`)
  - 호버 시 파일 미리보기 표시
- **`mdcLink.showFileIcons`** (boolean, 기본값: `true`)
  - 툴팁에 파일 타입 아이콘 표시

#### 자동완성
- **`mdcLink.autoComplete`** (boolean, 기본값: `true`)
  - MDC 링크 자동완성 활성화
- **`mdcLink.suggestRecentFiles`** (boolean, 기본값: `true`)
  - 자동완성에서 최근 사용한 파일 제안

#### 디버깅
- **`mdcLink.debugMode`** (boolean, 기본값: `false`)
  - 상세한 로깅을 위한 디버그 모드 활성화
- **`mdcLink.logLevel`** (string, 기본값: `"info"`)
  - 로그 레벨: `"error"`, `"warn"`, `"info"`, `"debug"`

## 명령어

확장 프로그램은 `Ctrl+Shift+P`를 통해 접근할 수 있는 여러 명령어를 제공합니다:

- **`MDC: Open MDC Link`** - 특정 MDC 링크 열기
- **`MDC: Clear Cache`** - 파일 검색 캐시 클리어
- **`MDC: Show Link Statistics`** - 캐시 및 사용 통계 표시

## 파일 해결 로직

확장 프로그램은 다음 순서로 파일을 검색합니다:

1. **정확한 파일명 일치** (현재 디렉토리)
2. **자동 확장자 감지** (현재 디렉토리, 확장자가 없는 경우)
3. **정확한 파일명 일치** (워크스페이스 루트)
4. **자동 확장자 감지** (워크스페이스 루트, 확장자가 없는 경우)
5. **설정된 경로에서 검색** (`searchPaths`가 설정된 경우)
6. **하위 디렉토리 재귀 검색** (활성화된 경우)

## 개발

### 빌드

```bash
# 의존성 설치
pnpm install

# TypeScript 컴파일
pnpm run compile

# 개발용 감시 모드
pnpm run watch

# 확장 프로그램 패키징
vsce package
```

### 설치

1. 확장 프로그램 빌드:

   ```bash
   pnpm install
   pnpm run compile
   ```
2. Cursor IDE에 설치:

   ```bash
   code --install-extension cursor-mdc-link-0.1.0.vsix
   ```

## 사용 사례

- **문서화**: 코드에서 관련 문서 파일로 링크
- **상호 참조**: 다른 파일 타입 간 참조 생성
- **프로젝트 탐색**: 관련 파일 간 빠른 탐색
- **코드 예시**: 문서에서 예시 파일로 링크
- **설정**: 모든 소스 파일에서 설정 파일 참조

## 예시

### 기본 사용법

#### TypeScript 파일에서
```typescript
// 구현 세부사항은 [UserService](mdc:user-service.ts)를 참조하세요
// [API 문서](mdc:api-docs.md)를 확인하세요
// [설정](mdc:config.json)을 검토하세요
```

#### Markdown 파일에서
```markdown
## 구현
- [백엔드 서비스](mdc:backend-service.ts)
- [데이터베이스 스키마](mdc:schema.sql)
- [API 테스트](mdc:api-tests.js)
```

#### Python 파일에서
```python
# [데이터 모델](mdc:models.py)을 참조하세요
# [설정](mdc:settings)을 확인하세요
# [테스트](mdc:test_models.py)를 검토하세요
```

### 고급 사용법

#### 라인 번호 탐색
```typescript
// [UserService](mdc:user-service.ts:45)의 특정 라인으로 이동
// [line 120](mdc:error-handler.ts:120)에서 오류 처리 확인
```

#### 상대 경로 탐색
```markdown
## 문서
- [API 참조](../docs/api-reference.md)
- [설정 가이드](./config-guide.md)
- [예시](../../examples/README.md)
```

#### 자동완성
모든 파일에서 `mdc:`를 입력하면 확장 프로그램이 다음을 제안합니다:
- 최근 접근한 파일
- 현재 디렉토리의 파일
- 검색 패턴과 일치하는 파일

#### 호버 미리보기
모든 MDC 링크에 마우스를 올리면 다음을 볼 수 있습니다:
- 파일 경로
- 파일 타입 아이콘
- 라인 번호 (지정된 경우)

### 성능 최적화 예시

#### 대규모 프로젝트 설정
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

#### 개발 vs 프로덕션 설정
```json
{
  "mdcLink.debugMode": true,
  "mdcLink.logLevel": "debug",
  "mdcLink.showBrokenLinkWarnings": true,
  "mdcLink.validateLinks": true
}
```

## 문제 해결

### 링크가 작동하지 않는 경우

1. 확장 프로그램이 활성화되어 있는지 확인: `mdcLink.enableForAllFiles`가 `true`여야 함
2. 대상 파일 확장자가 `mdcLink.allowedExtensions`에 있는지 확인
3. 개발자 콘솔에서 오류 메시지 확인
4. 대상 파일이 예상 위치에 존재하는지 확인
5. `mdcLink.searchPaths` 설정이 올바른지 확인
6. `mdcLink.excludePatterns`에서 파일이 제외되지 않았는지 확인

### 디버깅

확장 프로그램 로그를 보려면 개발자 도구 활성화:

1. `Ctrl+Shift+P` → "Developer: Toggle Developer Tools"
2. Console 탭에서 MDC Link Extension 메시지 확인
3. `mdcLink.debugMode`를 `true`로 설정하여 상세한 로그 활성화
4. `mdcLink.logLevel`을 `"debug"`로 설정하여 모든 로그 메시지 확인

### 성능 문제

대규모 프로젝트에서 성능 문제가 있는 경우:

1. `mdcLink.cacheEnabled`를 `true`로 설정
2. `mdcLink.searchPaths`로 검색 범위 제한
3. `mdcLink.excludePatterns`에 불필요한 디렉토리 추가
4. `mdcLink.maxSearchDepth`로 검색 깊이 제한
5. `mdcLink.cacheTimeout`을 적절히 조정

## 라이선스

MIT License

## 기여

기여를 환영합니다! 이슈와 풀 리퀘스트를 자유롭게 제출해 주세요.
