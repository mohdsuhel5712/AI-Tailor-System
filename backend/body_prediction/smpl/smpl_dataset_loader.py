"""
PHASE 5B

Load official SMPL dataset.

Replace body_dataset.csv
with real SMPL data.
"""
import pandas as pd 

class SMPLDataSetLoader:
      def __init__(self,csv_path):
            self.csv_pth = "../dataset/smpl_dataset.csv"
            
      def load_dataset(self):
            dataset = pd.read_csv(self.csv_pth)
            