import os
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import datetime, timedelta

def run_demo():
    sample_csv = os.path.join('data', 'historical.csv')
    if not os.path.exists(sample_csv):
        os.makedirs('data', exist_ok=True)
        start = datetime(2020,1,1)
        dates = [start + timedelta(days=365*i) for i in range(5)]
        values = [10000, 12000, 15000, 21000, 30000]
        df = pd.DataFrame({'date':[d.strftime('%Y-%m-%d') for d in dates], 'value':values})
        df.to_csv(sample_csv, index=False)
        print('Sample file written to', sample_csv)
    df = pd.read_csv(sample_csv, parse_dates=['date'])
    df['x'] = df['date'].map(datetime.toordinal)
    X = df[['x']].values
    y = df['value'].values
    model = LinearRegression()
    model.fit(X,y)
    last_date = df['date'].max()
    future_dates = [last_date + timedelta(days=365*(i+1)) for i in range(5)]
    Xf = np.array([d.toordinal() for d in future_dates]).reshape(-1,1)
    preds = model.predict(Xf)
    out = pd.DataFrame({'date':[d.strftime('%Y-%m-%d') for d in future_dates], 'forecast':preds.astype(int)})
    print('\nForecast result (yearly):\n', out.to_string(index=False))

if __name__ == '__main__':
    run_demo()
