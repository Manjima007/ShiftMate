"""Fix encoding issues in main.py"""
import sys

# Read with UTF-8 encoding
with open('main.py', 'r', encoding='utf-8-sig', errors='ignore') as f:
    content = f.read()

# Replace fancy quotes with regular quotes
replacements = {
    '\u201c': '"',  # Left double quote
    '\u201d': '"',  # Right double quote
    '\u2018': "'",  # Left single quote
    '\u2019': "'",  # Right single quote
    '\u2013': '-',  # En dash
    '\u2014': '--', # Em dash
    '\u2026': '...', # Ellipsis
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Save as clean ASCII/UTF-8 without BOM
with open('main_fixed.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed file saved as main_fixed.py")
print(f"Total lines: {content.count(chr(10))}")
