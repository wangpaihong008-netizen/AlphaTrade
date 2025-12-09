# 一键上传代码到 GitHub - Windows PowerShell 脚本

Write-Host "=========================================="
Write-Host "上传代码到 GitHub"
Write-Host "=========================================="

# 进入项目目录
$ProjectPath = "$env:USERPROFILE\Desktop\AlphaTrade"
if (-not (Test-Path $ProjectPath)) {
    Write-Host "❌ 找不到项目目录: $ProjectPath"
    exit 1
}

Set-Location $ProjectPath
Write-Host "📍 项目目录: $ProjectPath"

# 检查 Git 状态
Write-Host ""
Write-Host "📋 检查更改..."
git status

# 添加所有更改
Write-Host ""
Write-Host "📦 添加所有更改..."
git add .

# 检查是否有更改需要提交
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  没有需要提交的更改"
} else {
    # 提交更改
    Write-Host ""
    Write-Host "💾 提交更改..."
    $commitMessage = Read-Host "请输入提交说明 (直接回车使用默认消息)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "更新代码: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    git commit -m $commitMessage
    
    # 推送到远程仓库
    Write-Host ""
    Write-Host "🚀 推送到 GitHub..."
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ 上传成功！"
        Write-Host "查看: https://github.com/wangpaihong008-netizen/AlphaTrade"
    } else {
        Write-Host ""
        Write-Host "❌ 推送失败，尝试先拉取..."
        git pull origin main --rebase
        git push origin main
    }
}

Write-Host ""
Write-Host "完成！"

