mongosh xflix --eval "db.dropDatabase()"
mongoimport --db xflix --collection videos --file data/xflix_data.json --jsonArray