on run
    set appPath to POSIX path of (path to me)
    if appPath ends with "/" then set appPath to text 1 thru -2 of appPath
    set resourcesPath to appPath & "/Contents/Resources"
    set launcherPath to resourcesPath & "/launch.sh"
    set sitePath to resourcesPath & "/site"
    set serverPath to appPath & "/Contents/MacOS/labgraph-server"
    do shell script quoted form of launcherPath & space & quoted form of sitePath & space & quoted form of serverPath
end run
