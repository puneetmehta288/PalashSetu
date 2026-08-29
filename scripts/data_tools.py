import json
import re
import random
from typing import List, Dict, Any

def clean_text(text: str) -> str:
    """Normalize Unicode, remove extra whitespace."""
    if not text:
        return text
    # Basic normalization and whitespace removal
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def deduplicate(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Remove duplicate entries based on hindi_text."""
    seen = set()
    unique_records = []
    for r in records:
        txt = r.get("hindi_text", "")
        if txt not in seen:
            seen.add(txt)
            unique_records.append(r)
    return unique_records

def split_dataset(records: List[Dict[str, Any]], train_ratio=0.8, val_ratio=0.1, test_ratio=0.1):
    """Split dataset into train, val, test."""
    assert train_ratio + val_ratio + test_ratio == 1.0, "Ratios must sum to 1.0"
    random.shuffle(records)
    n = len(records)
    train_end = int(n * train_ratio)
    val_end = train_end + int(n * val_ratio)
    
    train = records[:train_end]
    val = records[train_end:val_end]
    test = records[val_end:]
    return train, val, test

def validate_schema(record: Dict[str, Any], schema: Dict[str, Any]) -> bool:
    """Validate a record against the schema (simplified validation)."""
    required = schema.get("required", [])
    for req in required:
        if req not in record:
            return False
    # Check types and enums if needed
    if "validation_status" in record:
        props = schema.get("properties", {})
        val_status_prop = props.get("validation_status", {})
        if "enum" in val_status_prop and record["validation_status"] not in val_status_prop["enum"]:
            return False
    return True

def load_jsonl(filepath: str) -> List[Dict[str, Any]]:
    """Load JSONL data."""
    records = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))
    return records

def save_jsonl(records: List[Dict[str, Any]], filepath: str):
    """Save JSONL data."""
    with open(filepath, 'w', encoding='utf-8') as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')

def compute_stats(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute dataset statistics."""
    stats = {
        "total_records": len(records),
        "validation_status_counts": {}
    }
    for r in records:
        status = r.get("validation_status", "unknown")
        stats["validation_status_counts"][status] = stats["validation_status_counts"].get(status, 0) + 1
    return stats
