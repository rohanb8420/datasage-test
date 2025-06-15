import pandas as pd
import json

def main():
    df = pd.read_csv('data/spend.csv')
    # TODO: Add forecasting logic using scikit-learn
    forecast = {
        "2023-04": 15000,
        "2023-05": 16000
    }
    print(json.dumps(forecast))

if __name__ == "__main__":
    main()