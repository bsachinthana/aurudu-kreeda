echo 'exporting home'
export HOME=$HOME/server
cd ng-app/kamba-adeema
npm install
cd ../../server
npm install
node index.js