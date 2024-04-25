from pydantic import BaseModel

class Meal(BaseModel):
    meal_id: int
    meal_name: str
    date_served: str
    calories: float
    carbohydrates: float
    fat: float
    protein: float
    allergens: object
    dining_hall: str
    meal_type: str


class Metadata(BaseModel):
    gender: str
    height: str
    weight: str
