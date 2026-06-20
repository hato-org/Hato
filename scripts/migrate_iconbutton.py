"""One-off codemod: convert Chakra v2 `<IconButton icon={...} />` to v3
children form `<IconButton ...>{...}</IconButton>`.

Correct, bounded algorithm:
1. For each `<IconButton` occurrence, scan forward tracking `{}` depth to find
   the end of the OPENING tag (`/>` for self-closing or `>` otherwise) at brace
   depth 0. Nested `/>` inside `icon={<Icon/>}` lives at depth>0 and is skipped.
2. Within that bounded opening tag, locate `icon={...}` (brace-balanced) and
   extract the expression.
3. Rebuild: drop the icon prop, turn the tag into a children form.
Positions are recomputed each pass to stay valid after mutation.
"""

import glob
import re


def matching_brace(s: str, open_idx: int) -> int:
    depth = 0
    for i in range(open_idx, len(s)):
        if s[i] == '{':
            depth += 1
        elif s[i] == '}':
            depth -= 1
            if depth == 0:
                return i + 1
    raise ValueError('unbalanced braces')


def find_tag_end(s: str, start: int):
    """From the '<IconButton' start, return (idx, self_closing) of opening-tag end."""
    i = start
    depth = 0
    while i < len(s):
        c = s[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        elif depth == 0:
            if c == '/' and i + 1 < len(s) and s[i + 1] == '>':
                return i, True
            if c == '>':
                return i, False
        i += 1
    raise ValueError('no tag end')


def transform_once(out: str):
    for m in re.finditer(r'<IconButton\b', out):
        tag_start = m.start()
        tag_end, self_closing = find_tag_end(out, tag_start)
        tag_text = out[tag_start:tag_end]
        im = re.search(r'\bicon=\{', tag_text)
        if not im:
            continue  # this IconButton already has no icon prop
        brace_open = tag_start + im.end() - 1
        brace_close = matching_brace(out, brace_open)
        expr = out[brace_open:brace_close]  # includes { }
        # Remove the icon prop span, tidy whitespace.
        prop_start = tag_start + im.start()
        head = re.sub(r'[ \t]*$', '', out[:prop_start])
        tail = re.sub(r'^[ \t]*\n?', '', out[brace_close:], count=1)
        rebuilt = head + tail
        # Recompute tag end on rebuilt string (icon prop removed).
        new_tag_end, new_self = find_tag_end(rebuilt, tag_start)
        if new_self:
            # replace '/>' with '>{expr}</IconButton>'
            result = (
                rebuilt[:new_tag_end]
                + '>'
                + expr
                + '</IconButton>'
                + rebuilt[new_tag_end + 2:]
            )
        else:
            # already has children: insert expr right after '>'
            result = (
                rebuilt[:new_tag_end + 1] + expr + rebuilt[new_tag_end + 1:]
            )
        return result, True
    return out, False


def transform(src: str) -> str:
    out = src
    while True:
        out, changed = transform_once(out)
        if not changed:
            return out


def main():
    total = 0
    for path in glob.glob('src/**/*.tsx', recursive=True):
        s = open(path, encoding='utf-8').read()
        if 'icon={' not in s or '<IconButton' not in s:
            continue
        try:
            new = transform(s)
        except ValueError as e:
            print('SKIP', path, e)
            continue
        if new != s:
            open(path, 'w', encoding='utf-8').write(new)
            total += 1
    print('files updated:', total)


main()
