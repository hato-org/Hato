"""Codemod: Chakra v2 `leftIcon`/`rightIcon` props on <Button> and <MenuButton>
to v3 children form.

  <Button leftIcon={<A/>} rightIcon={<B/>}>Label</Button>
  -> <Button><A/>Label<B/></Button>

Algorithm per target element name:
  - find each `<Name` opening tag, locate end of opening tag (`>` at brace depth 0)
  - extract leftIcon={...}/rightIcon={...} (brace balanced) from the opening tag
  - find the matching `</Name>` via tag-depth counting
  - rebuild children as: leftExpr + existing children + rightExpr
"""

import glob
import re

NAMES = ['Button', 'MenuButton']


def matching_brace(s, open_idx):
    depth = 0
    for i in range(open_idx, len(s)):
        if s[i] == '{':
            depth += 1
        elif s[i] == '}':
            depth -= 1
            if depth == 0:
                return i + 1
    raise ValueError('brace')


def opening_tag_end(s, start):
    depth = 0
    i = start
    while i < len(s):
        c = s[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        elif depth == 0:
            if c == '/' and s[i + 1] == '>':
                return i, True
            if c == '>':
                return i, False
        i += 1
    raise ValueError('tagend')


def matching_close(s, name, after):
    """Find index of the matching </name> starting search at `after`."""
    depth = 1
    open_re = re.compile(r'<' + name + r'\b')
    close = '</' + name + '>'
    i = after
    while i < len(s):
        if s.startswith(close, i):
            depth -= 1
            if depth == 0:
                return i
            i += len(close)
            continue
        m = open_re.match(s, i)
        if m:
            # ensure it's an element open, not self-closing handled by caller
            depth += 1
            i = m.end()
            continue
        i += 1
    raise ValueError('close')


def extract_prop(tag_text, prop):
    m = re.search(r'\b' + prop + r'=\{', tag_text)
    if not m:
        return None
    return m


def transform_once(out, name):
    for m in re.finditer(r'<' + name + r'\b', out):
        ts = m.start()
        te, self_closing = opening_tag_end(out, ts)
        if self_closing:
            continue
        tag_text = out[ts:te]
        lm = re.search(r'\bleftIcon=\{', tag_text)
        rm = re.search(r'\brightIcon=\{', tag_text)
        if not lm and not rm:
            continue
        # extract expressions (absolute positions)
        spans = []
        left_expr = right_expr = ''
        if lm:
            bo = ts + lm.end() - 1
            bc = matching_brace(out, bo)
            left_expr = out[bo:bc]
            spans.append((ts + lm.start(), bc))
        if rm:
            bo = ts + rm.end() - 1
            bc = matching_brace(out, bo)
            right_expr = out[bo:bc]
            spans.append((ts + rm.start(), bc))
        # remove prop spans from the opening tag (right-to-left)
        new = out
        for s0, s1 in sorted(spans, reverse=True):
            head = re.sub(r'[ \t]*$', '', new[:s0])
            tail = re.sub(r'^[ \t]*\n?', '', new[s1:], count=1)
            new = head + ' ' + tail if not tail.startswith((' ', '\n', '>', '/')) else head + tail
        # recompute opening tag end + children region on `new`
        te2, _ = opening_tag_end(new, ts)
        close_idx = matching_close(new, name, te2 + 1)
        children = new[te2 + 1:close_idx]
        left_jsx = (left_expr + ' ') if left_expr else ''
        right_jsx = (' ' + right_expr) if right_expr else ''
        rebuilt = (
            new[:te2 + 1]
            + left_jsx
            + children
            + right_jsx
            + new[close_idx:]
        )
        return rebuilt, True
    return out, False


def transform(src):
    out = src
    for name in NAMES:
        while True:
            out, changed = transform_once(out, name)
            if not changed:
                break
    return out


def main():
    total = 0
    for path in glob.glob('src/**/*.tsx', recursive=True):
        s = open(path, encoding='utf-8').read()
        if 'leftIcon={' not in s and 'rightIcon={' not in s:
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
