from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://test:testpw@storyboard.hhmks.mongodb.net/?retryWrites=true&w=majority&appName=StoryBoard")  # Update with your connection string
db = client["web2"]  # Replace with your database name
collection = db["users"]  # Replace with your collection name

# Fetch all documents
documents = collection.find()

# Update each document
for doc in documents:
    email = doc.get("publicKey")  # Use publicKey as email
    if email:
        updated_fields = {
            "email": email,
            "password": "",  # Initialize password as empty string
        }
        # Remove the publicKey field and update email and password
        collection.update_one(
            {"_id": doc["_id"]},
            {
                "$set": updated_fields,
                "$unset": {"publicKey": ""}  # Remove the publicKey field
            }
        )

print("Migration completed.")
