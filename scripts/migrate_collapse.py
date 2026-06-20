"""Codemod: Chakra v2 <Collapse in={X} ...>CHILDREN</Collapse>
       -> v3 <Collapsible.Root open={X}><Collapsible.Content>CHILDREN
             </Collapsible.Content></Collapsible.Root>

Drops Collapse-only props (animateOpacity, unmountOnExit, startingHeight...).
Also rewrites the `Collapse` import specifier to `Collapsible`.
"""

import glob
import re


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
            if c == '>':
                return i
        i += 1
    raise ValueError('tagend')


def matching_close(s, after):
    depth = 1
    open_re = re.compile(r'<Collapse\b')
    close = '</Collapse>'
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
            depth += 1
            i = m.end()
            continue
        i += 1
    raise ValueError('close')


def transform_once(out):
    for m in re.finditer(r'<Collapse\b', out):
        ts = m.start()
        te = opening_tag_end(out, ts)
        tag_text = out[ts:te]
        im = re.search(r'\bin=\{', tag_text)
        if not im:
            continue
        bo = ts + im.end() - 1
        bc = matching_brace(out, bo)
        expr = out[bo:bc]  # {X}
        close_idx = matching_close(out, te + 1)
        children = out[te + 1:close_idx]
        rebuilt = (
            out[:ts]
            + '<Collapsible.Root open=' + expr + '>'
            + '<Collapsible.Content>'
            + children
            + '</Collapsible.Content></Collapsible.Root>'
            + out[close_idx + len('</Collapse>'):]
        )
        return rebuilt, True
    return out, False


def transform(src):
    out = src
    while True:
        out, changed = transform_once(out)
        if not changed:
            break
    # fix import specifier
    out = re.sub(r'(?<![A-Za-z])Collapse(?![A-Za-z.])', 'Collapsible', out) \
        if False else out
    return out


def main():
    total = 0
    for path in glob.glob('src/**/*.tsx', recursive=True):
        s = open(path, encoding='utf-8').read()
        if '<Collapse' not in s:
            continue
        try:
            new = transform(s)
        except ValueError as e:
            print('SKIP', path, e)
            continue
        # rewrite the import specifier `Collapse` -> `Collapsible`
        new = re.sub(r'\bCollapse\b(?!\.)', 'Collapsible', new)
        if new != s:
            open(path, 'w', encoding='utf-8').write(new)
            total += 1
    print('files updated:', total)


main()
