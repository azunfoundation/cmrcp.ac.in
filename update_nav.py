import os
import glob
import re

html_files = glob.glob('c:\\cmrcp.ac.in\\*.html')

new_items = """            <li><a href="extra-curricular.html">Extra Curricular & Co-Curricular Activities</a></li>
          </ul>
        </li>
        <li class="nav-item"><a href="contact.html" class="nav-link">Contact Us</a></li>
        <li class="nav-item"><a href="feedback.html" class="nav-link">Student Feedback</a></li>
        <li class="nav-item"><a href="NSS.html" class="nav-link">NSS</a></li>
      </ul>"""

count = 0
for file_path in html_files:
    if "feedback.html" in file_path or "NSS.html" in file_path:
        continue
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='utf-16') as f:
                content = f.read()
        except UnicodeDecodeError:
             print(f"Failed to read {file_path}")
             continue

    # Skip if already updated
    if '<li class="nav-item"><a href="contact.html" class="nav-link">Contact Us</a></li>' in content:
        print(f"Already updated: {os.path.basename(file_path)}")
        continue
        
    # Find the closing part of Activities & Gallery (using flexible match for the label)
    pattern = re.compile(r'<li><a href="extra-curricular\.html">.*?</a></li>\s*</ul>\s*</li>\s*</ul>', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(new_items, content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f"Updated: {os.path.basename(file_path)}")
    else:
        print(f"Pattern NOT found in: {os.path.basename(file_path)}")

print(f"\nTotal files updated: {count}")
