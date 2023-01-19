from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import spacy
from fastapi.responses import JSONResponse
nlp = spacy.load('en_core_web_sm')




app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# class GraphList(BaseModel):
#     data: List[str]

@app.post("/dummypath")
async def get_body(data: List[str]):

    entitylist=[]
    for var in data:
        doc = nlp(var)
        for ent in doc.ents:
            print(ent)
            entitylist.append(ent.text)

    return entitylist





@app.get("/")
async def main():
    return {"message": "Hello World"}