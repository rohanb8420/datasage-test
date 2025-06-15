from fastapi import FastAPI
app = FastAPI()
@app.get("/sales-forecast")
async def sales_forecast():
    return {"forecast": [100, 200, 300]}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)