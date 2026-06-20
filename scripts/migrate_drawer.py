"""Codemod: Chakra v2 Drawer -> v3 Drawer (src/components/ui/drawer snippet).

<Drawer isOpen={A} onClose={B} placement="left" {...rest}> ->
  <DrawerRoot open={A} onOpenChange={(e) => !e.open && (B)()} placement="start"
      {...rest}>
<DrawerOverlay/>        -> removed
<DrawerCloseButton/>    -> <DrawerCloseTrigger/>
</Drawer>               -> </DrawerRoot>
"""

import glob
import re

RENAME = {'DrawerCloseButton': 'DrawerCloseTrigger'}
DRAWER_SPECIFIERS = {
    'Drawer', 'DrawerOverlay', 'DrawerContent', 'DrawerHeader', 'DrawerBody',
    'DrawerFooter', 'DrawerCloseButton', 'DrawerProps',
}
PLACEMENT = {'left': 'start', 'right': 'end'}


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
        elif depth == 0 and c == '>':
            return i
        i += 1
    raise ValueError('tagend')


def convert_root(out):
    while True:
        m = re.search(r'<Drawer\b', out)
        if not m:
            return out
        ts = m.start()
        te = opening_tag_end(out, ts)
        tag = out[ts:te]
        tag = re.sub(r'\bisOpen=', 'open=', tag)
        om = re.search(r'\bonClose=\{', tag)
        if om:
            bo = om.end() - 1
            bc = matching_brace(tag, bo)
            handler = tag[bo + 1:bc - 1].strip()
            tag = (tag[:om.start()]
                   + 'onOpenChange={(e) => !e.open && (' + handler + ')()}'
                   + tag[bc:])
        tag = re.sub(r'placement="(left|right)"',
                     lambda mm: 'placement="' + PLACEMENT[mm.group(1)] + '"', tag)
        tag = '<DrawerRoot' + tag[len('<Drawer'):]
        # mark as processed by replacing only this occurrence
        out = out[:ts] + tag + out[te:]
        if '<Drawer\b':
            pass
        # avoid infinite loop: ensure no bare <Drawer left at ts
        if re.match(r'<Drawer\b', out[ts:]):
            # shouldn't happen; bail
            raise ValueError('loop')
    return out


def transform(out):
    out = re.sub(r'\s*<DrawerOverlay\b[^>]*/>', '', out)
    out = convert_root(out)
    out = out.replace('</Drawer>', '</DrawerRoot>')
    for old, new in RENAME.items():
        out = re.sub(r'\b' + old + r'\b', new, out)
    return out


def strip_chakra(out, remove):
    pat = re.compile(
        r"import\s+(type\s+)?\{([^}]*)\}\s*from\s*['\"]@chakra-ui/react['\"];?",
        re.DOTALL)
    m = pat.search(out)
    if not m:
        return out
    names = [x.strip() for x in m.group(2).split(',') if x.strip()]
    kept = [n for n in names if n not in remove]
    repl = ("import { " + ', '.join(kept) + " } from '@chakra-ui/react';"
            if kept else '')
    return out[:m.start()] + repl + out[m.end():]


def add_import(out, names, module):
    used = sorted({n for n in names if re.search(r'\b' + n + r'\b', out)})
    if not used:
        return out
    line = "import { " + ', '.join(used) + " } from '" + module + "';"
    idx = out.find('\n', out.find('import '))
    return out[:idx + 1] + line + '\n' + out[idx + 1:]


def main():
    total = 0
    for path in glob.glob('src/**/*.tsx', recursive=True):
        s = open(path, encoding='utf-8').read()
        if '<Drawer' not in s:
            continue
        out = strip_chakra(s, DRAWER_SPECIFIERS)
        try:
            out = transform(out)
        except ValueError as e:
            print('SKIP', path, e)
            continue
        out = add_import(out, [
            'DrawerRoot', 'DrawerContent', 'DrawerHeader', 'DrawerBody',
            'DrawerFooter', 'DrawerCloseTrigger', 'DrawerBackdrop',
        ], '@/components/ui/drawer')
        if out != s:
            open(path, 'w', encoding='utf-8').write(out)
            total += 1
    print('files updated:', total)


main()
