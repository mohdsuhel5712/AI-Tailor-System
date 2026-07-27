import torch.nn as nn

# tha actunal NEURAL NETWORK (nn) in side thr torch.nn 
#here used for the predciting measurmeents (features= target)
class BodyPrecitor(nn.Module): # body ko predict karne wala model (using measurements)

    def __init__(self):# constructor is compusory

        super().__init__()

        self.network = nn.Sequential(

            nn.Linear(5,128),
            nn.ReLU(),

            nn.Linear(128,256),
            nn.ReLU(),

            nn.Linear(256,128),
            nn.ReLU(),

            nn.Linear(128,7)
        )

    def forward(self,x):

        return self.network(x)