$files = Get-ChildItem -Path 'c:\cmrcp.ac.in' -Filter '*.html' -File

$newItems = '
        <li class="nav-item"><a href="contact.html" class="nav-link">Contact Us</a></li>
        <li class="nav-item"><a href="feedback.html" class="nav-link">Student Feedback</a></li>
        <li class="nav-item"><a href="NSS.html" class="nav-link">NSS</a></li>
      </ul>'

$count = 0
foreach ($file in $files) {
    if ($file.Name -eq 'feedback.html' -or $file.Name -eq 'NSS.html') { continue }

    # Read content, let PowerShell figure out the current encoding (likely UTF16LE)
    $content = Get-Content $file.FullName -Raw

    if ($content -match '<li class="nav-item"><a href="contact\.html" class="nav-link">Contact Us</a></li>') {
        Write-Host "Already has Contact Us in nav: $($file.Name)"
        # Still convert it back to UTF8 to be safe!
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        continue
    }

    $pattern = '(?s)(<li><a href="extra-curricular\.html">Extra Curricular &amp; Co-Curricular Activities</a></li>\s*</ul>\s*</li>)\s*</ul>'
    
    if ($content -match $pattern) {
        $replacement = "`$1$newItems"
        $content = $content -replace $pattern, $replacement
        # Write back as UTF8 explicitly to avoid BOM/UTF-16 issues
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        $count++
        Write-Host "Updated: $($file.Name)"
    } else {
        Write-Host "Pattern NOT found: $($file.Name)"
    }
}
Write-Host ""
Write-Host "Total files updated: $count"
