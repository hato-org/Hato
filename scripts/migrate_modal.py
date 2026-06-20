"""Codemod: Chakra v2 Modal -> v3 Dialog (using src/components/ui/dialog snippet).

JSX transforms:
  <Modal isOpen={A} onClose={B} isCentered size="xl"> -> <DialogRoot open={A}
      onOpenChange={(e) => !e.open && (B)()} placement="center" size="xl">
  <ModalOverlay />            -> (removed; snippet DialogContent renders backdrop)
  <ModalContent>             -> <DialogContent>
  <ModalHeader|Body|Footer>  -> <DialogHeader|Body|Footer>
  <ModalCloseButton />       -> <DialogCloseTrigger />
  </Modal>                   -> </DialogRoot>

Imports: strip Modal* specifiers from '@chakra-ui/react', add a dialog import.
"""

import glob
import re

RENAME = {
    'ModalContent': 'DialogContent',
    'ModalHeader': 'DialogHeader',
    'ModalBody': 'DialogBody',
    'ModalFooter': 'DialogFooter',
    'ModalCloseButton': 'DialogCloseTrigger',
}
MODAL_SPECIFIERS = {
    'Modal', 'ModalOverlay', 'ModalContent', 'ModalHeader', 'ModalBody',
    'ModalFooter', 'ModalCloseButton', 'ModalProps',
}


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


def convert_modal_root(out):
    """Rewrite each `<Modal ...>` opening tag into `<DialogRoot ...>`."""
    changed = True
    while changed:
        changed = False
        m = re.search(r'<Modal\b', out)
        if not m:
            break
        ts = m.start()
        te = opening_tag_end(out, ts)
        tag = out[ts:te]  # from '<Modal' up to (not incl) '>'
        # isOpen={A} -> open={A}
        tag = re.sub(r'\bisOpen=', 'open=', tag)
        # onClose={B} -> onOpenChange={(e) => !e.open && (B)()}
        om = re.search(r'\bonClose=\{', tag)
        if om:
            bo = om.end() - 1
            bc = matching_brace(tag, bo)
            handler = tag[bo + 1:bc - 1].strip()
            tag = (
                tag[:om.start()]
                + 'onOpenChange={(e) => !e.open && (' + handler + ')()}'
                + tag[bc:]
            )
        tag = re.sub(r'\bisCentered\b', 'placement="center"', tag)
        tag = re.sub(r'\bmotionPreset="[^"]*"', '', tag)
        tag = '<DialogRoot' + tag[len('<Modal'):]
        out = out[:ts] + tag + out[te:]
        changed = True
    return out


def transform(src):
    out = src
    # 1) remove <ModalOverlay ... /> elements
    out = re.sub(r'\s*<ModalOverlay\b[^>]*/>', '', out)
    # 2) convert Modal root opening tags
    out = convert_modal_root(out)
    # 3) closing tags + simple renames
    out = out.replace('</Modal>', '</DialogRoot>')
    for old, new in RENAME.items():
        out = re.sub(r'\b' + old + r'\b', new, out)
    return out


def strip_chakra_specifiers(out, remove_set):
    """Remove given specifiers from the '@chakra-ui/react' import block."""
    pat = re.compile(
        r"import\s+(type\s+)?\{([^}]*)\}\s*from\s*['\"]@chakra-ui/react['\"];?",
        re.DOTALL,
    )
    m = pat.search(out)
    if not m:
        return out
    names = [x.strip() for x in m.group(2).split(',') if x.strip()]
    kept = [n for n in names if n not in remove_set]
    if kept:
        repl = "import { " + ', '.join(kept) + " } from '@chakra-ui/react';"
    else:
        repl = ''  # whole import removed
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
        if '<Modal' not in s:
            continue
        # 1) strip Modal* specifiers from chakra import BEFORE renaming bodies
        out = strip_chakra_specifiers(s, MODAL_SPECIFIERS)
        # 2) transform JSX bodies (overlay removal, root convert, renames)
        try:
            out = transform(out)
        except ValueError as e:
            print('SKIP', path, e)
            continue
        # 3) add dialog snippet import for the names now used
        out = add_import(out, [
            'DialogRoot', 'DialogContent', 'DialogHeader', 'DialogBody',
            'DialogFooter', 'DialogCloseTrigger',
        ], '@/components/ui/dialog')
        if out != s:
            open(path, 'w', encoding='utf-8').write(out)
            total += 1
    print('files updated:', total)


main()
