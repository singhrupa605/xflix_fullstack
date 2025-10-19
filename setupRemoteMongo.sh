MONGO_URL="mongodb+srv://rupa123:rupasingh@xflix.dpayzem.mongodb.net/"

mongoimport --uri "$MONGO_URL" --drop --collection videos --file data/xflix_data.json