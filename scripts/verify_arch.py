import re
import json

with open('public/architecture.html', 'r', encoding='utf-8') as f:
    text = f.read()

svg_match = re.search(r'<svg.*?</svg>', text, re.DOTALL)
node_ids = re.findall(r'data-node-id="([^"]+)"', svg_match.group(0))
print(f"SVG Node IDs ({len(node_ids)}): {node_ids}")

spec_match = re.search(r'var COMPONENT_ARCH_SPEC = \{(.*?)\n      \};', text, re.DOTALL)
spec_keys = re.findall(r'^\s*([a-zA-Z0-9_]+): \{', spec_match.group(1), re.MULTILINE)
print(f"Spec Keys ({len(spec_keys)}): {spec_keys}")

missing = set(node_ids) - set(spec_keys)
print(f"Missing in spec: {missing}")
extra = set(spec_keys) - set(node_ids)
print(f"Extra in spec: {extra}")

edges = re.findall(r'data-edge-key="([^"]+)"', svg_match.group(0))
print(f"Total edge keys: {len(edges)}")
assert len(missing) == 0, f"Missing specs for {missing}"
assert len(extra) == 0, f"Extra specs for {extra}"
print("VERIFICATION SUCCESS: All nodes and specs match 100%!")
