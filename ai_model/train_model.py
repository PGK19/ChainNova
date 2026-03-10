import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("supply_chain_dataset.csv")

# Select important features
features = [
    "Base_Lead_Time_Days",
    "Scheduled_Lead_Time_Days",
    "Weather_Severity_Index",
    "Geopolitical_Risk_Index",
    "Order_Weight_Kg",
    "Transportation_Mode",
    "Route_Type"
]

target = "Delivery_Status"

X = df[features]
y = df[target]

# Encode categorical columns
encoder_mode = LabelEncoder()
encoder_route = LabelEncoder()
encoder_status = LabelEncoder()

X["Transportation_Mode"] = encoder_mode.fit_transform(X["Transportation_Mode"])
X["Route_Type"] = encoder_route.fit_transform(X["Route_Type"])

y = encoder_status.fit_transform(y)

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=150,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "delay_prediction.pkl")

print("Model saved as delay_prediction.pkl")