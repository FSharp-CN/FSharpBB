docker volume create portainer_data
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
docker run -d -p 8529:8529 -e ARANGO_ROOT_PASSWORD=dragon arangodb/arangodb:3.2.4 --server.storage-engine rocksdb --database.directory /var/lib/arangodb3/rocksdb

docker run --name tidb-server -d -p 127.0.0.1:4000:4000 pingcap/tidb:latest

cd /opt/
gcl1 git@github.com:yinqiwen/ardb.git
cd ./ardb
make

