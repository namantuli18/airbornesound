import pickle        
import base64
import csv
import os
import pandas as pd
import json
import numpy
from collections import Counter
data={}
with open(os.path.join("slider",'Y.pb'),"rb") as f:
	arr=pickle.load(f)
print(Counter(arr))