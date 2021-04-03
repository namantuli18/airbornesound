import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, Flatten, Dense, MaxPool2D, Dropout
from tensorflow.keras.utils import to_categorical 

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

import os
import librosa
import librosa.display
import glob 
import skimage
from tensorflow import keras

input_dim = (16, 8,1)
dictionary=["pump","fan","valve","slider"]

def model_loader_instrument():
	model = keras.models.load_model('models/6dB/instrument_classifier.h5')
	model_1 = keras.models.load_model('models/6dB/pump.h5')
	model_2 = keras.models.load_model('models/6dB/fan.h5')
	model_3 = keras.models.load_model('models/6dB/valve.h5')
	model_4 = keras.models.load_model('models/6dB/slider.h5')
	return model,model_1,model_2,model_3,model_4

def output(file_name):
	feature=[]
	label=[]
	X, sample_rate = librosa.load(file_name, res_type='kaiser_fast')
	mels = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T,axis=0)
	feature.append(mels)
	label.append("prime")
	temp = [feature,label]
	temp = np.array(temp)
	data = temp.transpose()
	X_ = data[:,0]
	#print(X_.shape)
	Y = data[:, 1]
	X = np.empty([X_.shape[0], 128])
	for i in range(X_.shape[0]):
		X[i] = (X_[i])
	X_test = X.reshape(len(X), 16, 8, 1)
	return (X_test)

model,pump,fan,valve,slider=model_loader_instrument()
<<<<<<< HEAD
print(dictionary[np.argmax(model.predict(output("00000000.wav")))],"with probability",np.max(model.predict(output("00000000.wav"))))
=======


print(dictionary[np.argmax(model.predict(output("00000000.wav")))],"with probability",np.max(model.predict(output("00000000.wav"))))
>>>>>>> 18837aeb5f7814c5cb7ff3a69e5b53b6e16941fa
