polymer build --entrypoint index.html
cp ./index.php ./build/es5-bundled/
cp ./style.css ./build/es5-bundled/
cd ./build && zip -r es5-bundled.zip ./es5-bundled
ssh franko@97.107.133.7 'rm ~/es5-bundled.zip'
ssh franko@97.107.133.7 'rm -rf ~/es5-bundled'
cd ../ && scp ./build/es5-bundled.zip franko@97.107.133.7:~/ 
ssh franko@97.107.133.7 './refresh-bundled.sh'
