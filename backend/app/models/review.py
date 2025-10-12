from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.api.database import Base

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    rating = Column(Float)
    comment = Column(String)