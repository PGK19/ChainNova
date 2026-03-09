import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Fake training dataset
data = {
    "distance":[50,100,200,150,300,120],
    "traffic":[20,80,60,90,40,70],
    "weather":[0,1,0,1,0,1],
    "delay":[0,1,1,1,0,1]
}

df = pd.DataFrame(data)

X = df[["distance","traffic","weather"]]
y = df["delay"]

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2)

model = RandomForestClassifier()
model.fit(X_train,y_train)

pickle.dump(model,open("delay_prediction.pkl","wb"))

print("Model trained and saved!")