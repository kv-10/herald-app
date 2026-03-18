#!/usr/bin/env python3
"""
build_catalog.py
Parses catalog.csv (exported from Pet Valu portal) into catalog.json
for use by the Project: Herald PWA.

Usage:
  python3 build_catalog.py                  # reads catalog.csv, writes catalog.json
  python3 build_catalog.py input.csv        # custom input path
  python3 build_catalog.py input.csv out.json  # custom input + output paths

Column mapping (CSV → JSON):
  Item No            → key (uppercase)
  Item Description   → desc
  Brand              → brand
  Order Multiple     → multiple (int)
  Retail Price       → retail (float)
  Wholesale Price    → wholesale (float)
  Life Cycle Status  → status
  Substituted Item   → sub (omitted if empty)
  (generated)        → search (lowercase brand + desc, for fuzzy search)
"""

import csv
import json
import sys
import os

def build_catalog(input_path='catalog.csv', output_path='catalog.json'):
    if not os.path.exists(input_path):
        print(f'ERROR: {input_path} not found')
        sys.exit(1)

    catalog = {}
    skipped = 0

    with open(input_path, encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            item_no = row.get('Item No', '').strip().upper()
            if not item_no:
                skipped += 1
                continue

            desc      = row.get('Item Description', '').strip()
            brand     = row.get('Brand', '').strip()
            status    = row.get('Life Cycle Status', '').strip()
            sub       = row.get('Substituted Item', '').strip()

            try:
                multiple = int(row.get('Order Multiple', '1').strip() or '1')
            except ValueError:
                multiple = 1

            try:
                retail = float(row.get('Retail Price', '0').strip() or '0')
            except ValueError:
                retail = 0.0

            try:
                wholesale = float(row.get('Wholesale Price', '0').strip() or '0')
            except ValueError:
                wholesale = 0.0

            entry = {
                'desc':      desc,
                'brand':     brand,
                'multiple':  multiple,
                'search':    f'{brand} {desc}'.lower(),
                'retail':    retail,
                'wholesale': wholesale,
                'status':    status,
            }
            if sub:
                entry['sub'] = sub

            catalog[item_no] = entry

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, separators=(',', ':'))

    print(f'Done: {len(catalog)} items written to {output_path}')
    if skipped:
        print(f'Skipped: {skipped} rows with no Item No')

if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) == 0:
        build_catalog()
    elif len(args) == 1:
        build_catalog(args[0])
    else:
        build_catalog(args[0], args[1])
