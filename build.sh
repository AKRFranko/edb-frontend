polymer build --entrypoint index.html
cp ./index.php ./build/unbundled/
cp ./style.css ./build/unbundled/
cd ./build && zip -r unbundled.zip ./unbundled
cd ../ && scp ./build/unbundled.zip franko@97.107.133.7:~/ 
ssh franko@97.107.133.7 './refresh-admin.sh'
