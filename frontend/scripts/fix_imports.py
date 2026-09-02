import os, glob, re

files = glob.glob('src/**/*.ts*', recursive=True)
for f in files:
  with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
  new_content = re.sub(r"from '(?:\.\./)+auth'", "from '@/auth'", content)
  if content != new_content:
    with open(f, 'w', encoding='utf-8') as file:
      file.write(new_content)
    print(f"Updated {f}")
