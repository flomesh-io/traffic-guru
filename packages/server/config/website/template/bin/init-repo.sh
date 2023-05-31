#!/bin/bash
sleep 1

curl -X POST http://localhost:6060/api/v1/repo/website

curl -X POST http://localhost:6060/api/v1/repo-files/website/main.js --data-binary "@../pjs/main.js"
curl -X POST http://localhost:6060/api/v1/repo-files/website/config.js --data-binary "@../pjs/config.js"
curl -X POST http://localhost:6060/api/v1/repo-files/website/config.json --data-binary "@../pjs/config.json"
curl -X POST http://localhost:6060/api/v1/repo-files/website/plugins/balancer.js --data-binary "@../pjs/plugins/balancer.js"
curl -X POST http://localhost:6060/api/v1/repo-files/website/plugins/default.js --data-binary "@../pjs/plugins/default.js"
curl -X POST http://localhost:6060/api/v1/repo-files/website/plugins/router.js --data-binary "@../pjs/plugins/router.js"
curl -X POST http://localhost:6060/api/v1/repo-files/website/plugins/serve-files.js --data-binary "@../pjs/plugins/serve-files.js"
curl -X PATCH http://localhost:6060/api/v1/repo/website --data-raw '{"version":"1"}' 

function getdir(){
    for element in `ls $1`
    do 
        dir_or_file=$1"/"$element
        if [ -d $dir_or_file ]
        then
            getdir $dir_or_file
        else
			file=${dir_or_file/../}
            echo added $file
			curl -X POST "http://localhost:6060/api/v1/repo-files/website"$file --data-binary "@"$dir_or_file
        fi 
    done
}
root_dir="../www"
getdir $root_dir

curl -X PATCH http://localhost:6060/api/v1/repo/website --data-raw '{"version":"2"}' 
