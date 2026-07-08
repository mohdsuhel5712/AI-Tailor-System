import os
import random
import pandas as pd

rows = 50000

dataset = []

for _ in range(rows):

    gender = random.randint(0,1)

    age = random.randint(18,65)

    height = random.randint(150,195)

    weight = random.randint(45,120)

    body_shape = random.randint(0,3)

    arm_length = int(height*0.35 + random.randint(-4,4))

    leg_length = int(height*0.52 + random.randint(-5,5))

    neck = int(weight*0.18 + random.randint(20,30))

    chest = int(
        (height*0.35)
        +(weight*0.45)
        +(body_shape*2)
        +random.randint(-5,5)
    )

    waist = int(
        (weight*0.65)
        +(body_shape*3)
        +random.randint(-5,5)
    )

    hip = int(
        waist
        + random.randint(5,15)
    )

    shoulder = int(
        (height*0.22)
        + random.randint(-3,3)
    )

    dataset.append([
        height,
        weight,
        age,
        gender,
        body_shape,
        arm_length,
        leg_length,
        neck,
        chest,
        waist,
        hip,
        shoulder
    ])

columns = [
    "height",
    "weight",
    "age",
    "gender",
    "body_shape",
    "arm_length",
    "leg_length",
    "neck",
    "chest",
    "waist",
    "hip",
    "shoulder"
]

df = pd.DataFrame(
    dataset,
    columns=columns
)

os.makedirs(
    "backend/dataset",
    exist_ok=True
)

df.to_csv(
    "../dataset/body_dataset.csv",
    index=False
)

print(df.head())
print(df.shape)