@echo off
rem -----------------------------------------------------------------------------
rem Startup Script for MapStore
rem -----------------------------------------------------------------------------

cls
echo Welcome to MapStore!
echo.
set error=0

rem JAVA_HOME not defined
if "%JAVA_HOME%" == "" goto noJava

rem JAVA_HOME defined incorrectly
if not exist "%JAVA_HOME%\bin\java.exe" goto badJava

echo JAVA_HOME: %JAVA_HOME%
echo.

goto run

:noJava
  echo The JAVA_HOME environment variable is not defined.
goto JavaFail

:badJava
  echo The JAVA_HOME environment variable is not defined correctly.
goto JavaFail

:JavaFail
  echo This environment variable is needed to run this program.
  echo.
  echo Set this environment variable via the following command:
  echo    set JAVA_HOME=[path to Java]
  echo Example:
  echo    set JAVA_HOME=C:\Program Files\Java\jdk6
  echo.
  set error=1
goto end


:run
  if "%JAVA_OPTS%" == "" (set JAVA_OPTS="-XX:MaxPermSize=128m -Dgeostore-ovr=file:config/geostore-datasource-ovr.properties -Dservicebox-ovr=file:config/servicebox-ovr.properties")
  set RUN_JAVA=%JAVA_HOME%\bin\java
  echo Please wait while loading MapStore...
  echo.
  "%RUN_JAVA%" "%JAVA_OPTS%" -Djava.awt.headless=true -DSTOP.PORT=8079 -DSTOP.KEY=mapstore -jar start.jar  
goto end


:end
  if %error% == 1 echo Startup of MapStore was unsuccessful. 
  echo.
  pause
