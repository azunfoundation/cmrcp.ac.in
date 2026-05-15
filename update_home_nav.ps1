$files = Get-ChildItem -Path 'c:\cmrcp.ac.in' -Filter '*.html' -File

$newNav = @'
        <li class="nav-item">
          <a href="index.html" class="nav-link">Home <span class="chevron">&#9662;</span></a>
          <ul class="dropdown">
            <li><a href="about-college.html">About College</a></li>
            <li><a href="vision-mission.html">Vision &amp; Mission</a></li>
            <li><a href="latest-news.html">Latest News</a></li>
            <li><a href="newsletter.html">College News Letters</a></li>
            <li><a href="college-magazine.html">College Magazine</a></li>
            <li><a href="NSS.html">NSS</a></li>
            <li><a href="http://cmrcp.ac.in/wp-content/uploads/2025/02/nirf.pdf" target="_blank">NIRF</a></li>
            <li><a href="https://cmrcp.ac.in/wp-content/uploads/2025/07/5.-SIF-Report.pdf" target="_blank">SIF</a></li>
            <li><a href="https://cmrcp.ac.in/wp-content/uploads/2025/07/6.-approval.pdf" target="_blank">Approvals</a></li>
            <li><a href="Files/NBA Reports/NBA-report.pdf" target="_blank">NBA Report</a></li>
            <li><a href="https://cmrcp.ac.in/wp-content/uploads/2026/02/e-NBA-SAR-CMRCP.pdf" target="_blank">e-NBA SAR</a></li>
          </ul>
        </li>
'@

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $changed = $false

    # Pattern 1: active Home link (index.html)
    if ($content -match '<li class="nav-item"><a href="index\.html" class="nav-link active">Home</a></li>') {
        $content = $content -replace '<li class="nav-item"><a href="index\.html" class="nav-link active">Home</a></li>', $newNav
        $changed = $true
    }
    # Pattern 2: non-active Home link
    elseif ($content -match '<li class="nav-item"><a href="index\.html" class="nav-link">Home</a></li>') {
        $content = $content -replace '<li class="nav-item"><a href="index\.html" class="nav-link">Home</a></li>', $newNav
        $changed = $true
    }

    if ($changed) {
        Set-Content $file.FullName $content -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Updated: $($file.Name)"
    }
}
Write-Host "Total files updated: $count"
