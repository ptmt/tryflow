npm install forever -g
# https://github.com/facebook/flow/issues/210
apt-get install -y libelf-dev
export USER=u20848
npm install flow-bin -g
forever start app/server.compiled/index.js
