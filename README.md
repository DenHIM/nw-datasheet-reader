# 📄 nw-datasheet-reader 📄

# Windows 10 Install (updated 4/13/22)
1. Install Node.js (https://nodejs.org/en/download/)
2. Open Developer Command Prompt
3. `d: && cd D:\Repos\GitHub-DenHIM\nw-datasheet-reader\`
4. `npm install`
5. `npm install recursive-readdir`
6. `npm install globby`

# Execution Instructions
1. Open Developer Command Prompt
2. `d: && cd D:\Repos\GitHub-DenHIM\nw-datasheet-reader\`
3. `rmdir /S /Q "out"`
4. `node nw-datasheet-reader.mjs "json" "C:\Program Files (x86)\Steam\steamapps\common\New World\assets"`

Syntax: `node nw-datasheet-reader.mjs OUTPUT_FORMAT "PATH_TO_ASSETS"` (currently supported output formats: csv, json)

4. `d: && cd D:\Repos\GitHub-DenHIM\NWAssets`
5. `for /f %F in ('dir /b /a-d ^| findstr /vilb "."') do del "%F"`
6. `for /f %F in ('dir /b /ad ^| findstr /vilb "."') do rmdir /S /Q "%F"`
7. `xcopy D:\Repos\GitHub-DenHIM\nw-datasheet-reader\out\ . /E`

# Original Notes (obsolete)
1. You'll need to have a [Python installation](https://www.python.org/downloads/) since I use [ffi-napi](https://www.npmjs.com/package/ffi-napi) (which uses [node-gyp](https://github.com/nodejs/node-gyp)) to automatically create bindings to the Oodle compression DLL.
