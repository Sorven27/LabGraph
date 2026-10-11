param(
    [Parameter(Mandatory = $true)]
    [string]$Root,
    [int]$Port = 8765
)

$ErrorActionPreference = 'Stop'
$rootPath = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$token = [Guid]::NewGuid().ToString('N')
$listener = $null

function Send-Response {
    param(
        [IO.Stream]$Stream,
        [int]$Status,
        [string]$ContentType,
        [byte[]]$Body,
        [string]$Method = 'GET'
    )
    $reason = if ($Status -eq 200) { 'OK' } elseif ($Status -eq 403) { 'Forbidden' } elseif ($Status -eq 404) { 'Not Found' } else { 'Bad Request' }
    $header = "HTTP/1.1 $Status $reason`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
    $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if ($Method -ne 'HEAD' -and $Body.Length -gt 0) { $Stream.Write($Body, 0, $Body.Length) }
    $Stream.Flush()
}

function Text-Bytes([string]$Text) { return [Text.Encoding]::UTF8.GetBytes($Text) }

try {
    while ($Port -le 8790) {
        try {
            $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
            $listener.Start()
            break
        } catch {
            if ($listener) { $listener.Stop(); $listener = $null }
            $Port++
        }
    }
    if (-not $listener) { throw 'No available port in the 8765–8790 range.' }

    $url = "http://127.0.0.1:$Port/"
    Write-Host ''
    Write-Host '  LabGraph is running' -ForegroundColor Green
    Write-Host "  $url"
    Write-Host '  To stop it, click Quit in the browser' -ForegroundColor DarkGray
    Write-Host '  or close this window.' -ForegroundColor DarkGray
    Write-Host ''
    Start-Process $url

    $running = $true
    $lastRequest = Get-Date
    while ($running) {
        if (-not $listener.Pending()) {
            if (((Get-Date) - $lastRequest).TotalMinutes -ge 5) {
                Write-Host '  No active browser window: the server stopped automatically.' -ForegroundColor DarkGray
                break
            }
            Start-Sleep -Milliseconds 200
            continue
        }
        $client = $listener.AcceptTcpClient()
        $lastRequest = Get-Date
        try {
            $stream = $client.GetStream()
            $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }
            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) { Send-Response $stream 400 'text/plain; charset=utf-8' (Text-Bytes 'Bad request'); continue }
            $method = $parts[0].ToUpperInvariant()
            $requestPath = $parts[1].Split('?')[0]
            $headers = @{}
            while ($true) {
                $line = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($line)) { break }
                $separator = $line.IndexOf(':')
                if ($separator -gt 0) { $headers[$line.Substring(0, $separator).Trim().ToLowerInvariant()] = $line.Substring($separator + 1).Trim() }
            }

            if ($requestPath -eq '/__labgraph/status' -and $method -eq 'GET') {
                $json = "{`"app`":`"LabGraph`",`"version`":2,`"platform`":`"Windows`",`"shutdown`":true,`"token`":`"$token`"}"
                Send-Response $stream 200 'application/json; charset=utf-8' (Text-Bytes $json) $method
                continue
            }
            if ($requestPath -eq '/__labgraph/shutdown' -and $method -eq 'POST') {
                if ($headers['x-labgraph-token'] -ne $token) { Send-Response $stream 403 'text/plain; charset=utf-8' (Text-Bytes 'Forbidden') $method; continue }
                Send-Response $stream 200 'application/json; charset=utf-8' (Text-Bytes '{"ok":true}') $method
                $running = $false
                continue
            }
            if ($method -ne 'GET' -and $method -ne 'HEAD') { Send-Response $stream 400 'text/plain; charset=utf-8' (Text-Bytes 'Method not allowed') $method; continue }

            $relative = [Uri]::UnescapeDataString($requestPath).TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
            if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
            $filePath = [IO.Path]::GetFullPath([IO.Path]::Combine($rootPath, $relative))
            if (-not $filePath.StartsWith($rootPath, [StringComparison]::OrdinalIgnoreCase) -or -not [IO.File]::Exists($filePath)) {
                Send-Response $stream 404 'text/plain; charset=utf-8' (Text-Bytes 'Not found') $method
                continue
            }
            $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $mime = switch ($extension) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.svg'  { 'image/svg+xml' }
                '.png'  { 'image/png' }
                '.ico'  { 'image/x-icon' }
                default { 'application/octet-stream' }
            }
            Send-Response $stream 200 $mime ([IO.File]::ReadAllBytes($filePath)) $method
        } catch {
            Write-Host "  Request error: $($_.Exception.Message)" -ForegroundColor Yellow
        } finally {
            if ($client) { $client.Close() }
        }
    }
    Write-Host '  LabGraph has stopped.' -ForegroundColor Green
} finally {
    if ($listener) { $listener.Stop() }
}
