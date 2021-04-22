echo 'exporting home'
export HOME=$HOME/server
cd ng-app/kamba-adeema
npm install
cd ../../server
npm install
echo 'running server'
node index.js -p $PORT