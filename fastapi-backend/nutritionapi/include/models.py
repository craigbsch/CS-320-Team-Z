from pydantic import BaseModel
# models for data validation

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


class Metadata(BaseModel): # these are all strings due to how auth0 handles metadata from log-in
    gender: str 
    height: str
    age: str
    weight: str


class Goals(BaseModel): # metadata only created through api call, so more flexible
    calories: int
    carbohydrates: int
    protein: int
    fat: int