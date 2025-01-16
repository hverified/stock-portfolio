from fastapi import APIRouter, HTTPException, Depends
from app.models.scanner import ScannerItem
from app.db import db
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from pydantic import BaseModel


class ScannerResponseModel(BaseModel):
    name: str
    url: str
    description: str
    table_id: str
    scanner_id: str


router = APIRouter()

# Ensure the `scanner_id` field in the collection is unique
db.chartlink_scanners.create_index("scanner_id", unique=True)


def generate_scanner_id():
    """Generate a unique scanner_id."""
    return str(ObjectId())


@router.post("/add_scanner", response_model=ScannerResponseModel)
async def add_scanner(item: ScannerItem):
    """Add a scanner to the `chartlink_scanners` collection."""
    try:
        scanner_data = item.dict()
        scanner_data["scanner_id"] = generate_scanner_id()

        # Insert the scanner into the collection
        db.chartlink_scanners.insert_one(scanner_data)

        # Return the inserted item with scanner_id
        return scanner_data
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Scanner with this scanner_id already exists."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/get_scanners", response_model=list[ScannerResponseModel])
async def get_scanners():
    """Fetch all scanners from the `chartlink_scanners` collection."""
    try:
        scanners = list(db.chartlink_scanners.find({}, {"_id": 0}))
        return scanners
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.delete("/delete_scanner/{scanner_id}")
async def delete_scanner(scanner_id: str):
    """Delete a scanner by scanner_id from the `chartlink_scanners` collection."""
    try:
        result = db.chartlink_scanners.delete_one({"scanner_id": scanner_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Scanner not found.")
        return {"message": "Scanner deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.put("/update_scanner/{scanner_id}", response_model=ScannerResponseModel)
async def update_scanner(scanner_id: str, item: ScannerItem):
    """Update a scanner by scanner_id in the `chartlink_scanners` collection."""
    try:
        result = db.chartlink_scanners.update_one(
            {"scanner_id": scanner_id}, {"$set": item.dict()}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Scanner not found.")
        updated_item = item.dict()
        updated_item["scanner_id"] = scanner_id
        return updated_item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
