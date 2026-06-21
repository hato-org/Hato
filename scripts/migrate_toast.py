"""Codemod: Chakra v2 useToast -> v3 toaster (snippet).

Per file:
  - replace `const toast = useToast({ position, duration: N })` (single or multi-line)
    with a thin wrapper that preserves the file's default duration and maps status->type.
  - status: 'X' -> type: 'X' at call sites (5 known statuses).
  - drop useToast from the @chakra-ui/react import; add toaster import.
"""

import re
import sys

FILES = [
    "src/components/calendar/AddEventDrawer.tsx",
    "src/components/classmatch/MetaReporter.tsx",
    "src/components/timetable/DivisionEditor.tsx",
    "src/components/timetable/editor/UserScheduleImportModal.tsx",
    "src/components/timetable/Notes.tsx",
    "src/components/timetable/editor/UserSubjectEditor.tsx",
    "src/components/timetable/editor/UserScheduleEditor.tsx",
    "src/components/timetable/AddNoteDrawer.tsx",
    "src/modules/auth/index.ts",
    "src/pages/settings/account/Username.tsx",
    "src/pages/EventDetail.tsx",
    "src/pages/settings/account/ApiKey.tsx",
    "src/services/classmatch/index.ts",
    "src/pages/settings/Notification.tsx",
    "src/services/user/index.ts",
    "src/services/status/index.ts",
]

STATUSES = ["success", "error", "warning", "info", "loading"]

DECL_RE = re.compile(r"const\s+toast\s*=\s*useToast\(\s*\{(?P<body>[^{}]*?)\}\s*\)\s*;")


def wrapper_for(body: str) -> str:
    m = re.search(r"duration\s*:\s*([^,\n}]+)", body)
    if m:
        dur = m.group(1).strip()
        return (
            "const toast = (options: Parameters<typeof toaster.create>[0]) =>\n"
            f"    toaster.create({{ duration: {dur}, ...options }});"
        )
    return (
        "const toast = (options: Parameters<typeof toaster.create>[0]) =>\n"
        "    toaster.create(options);"
    )


def fix_import(src: str) -> str:
    # Remove the useToast specifier from the @chakra-ui/react import block.
    def repl(match):
        block = match.group(0)
        # remove ", useToast" / "useToast, " / lone "useToast"
        block = re.sub(r",\s*useToast\b", "", block)
        block = re.sub(r"\buseToast\s*,\s*", "", block)
        block = re.sub(r"\buseToast\b", "", block)
        # collapse stray blank import lines
        block = re.sub(r"\n\s*\n", "\n", block)
        return block

    src = re.sub(
        r"import\s*\{[^}]*\buseToast\b[^}]*\}\s*from\s*'@chakra-ui/react';",
        repl,
        src,
    )
    # Add toaster import right after the (now cleaned) chakra import, once.
    if "@/components/ui/toaster" not in src:
        src = re.sub(
            r"(import\s*\{[^}]*\}\s*from\s*'@chakra-ui/react';\n)",
            r"\1import { toaster } from '@/components/ui/toaster';\n",
            src,
            count=1,
        )
    return src


def main():
    for path in FILES:
        with open(path, encoding="utf-8") as f:
            src = f.read()
        orig = src

        m = DECL_RE.search(src)
        if not m:
            print(f"WARN: no toast decl found in {path}", file=sys.stderr)
        else:
            src = src[: m.start()] + wrapper_for(m.group("body")) + src[m.end():]

        for s in STATUSES:
            src = src.replace(f"status: '{s}'", f"type: '{s}'")

        src = fix_import(src)

        if src != orig:
            with open(path, "w", encoding="utf-8") as f:
                f.write(src)
            print(f"OK {path}")
        else:
            print(f"-- no change {path}")


if __name__ == "__main__":
    main()
