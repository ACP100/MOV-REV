from pydantic import BaseModel

class ReviewCreate(BaseModel):
    movie_id: int
    title: str
    rating: float
    comment: str

class ReviewOut(BaseModel):
    id: int
    movie_id: int
    user_id: int
    title: str
    rating: float
    comment: str
    username: str

    class Config:
        orm_mode = True