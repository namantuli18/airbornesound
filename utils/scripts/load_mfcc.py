import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np



def plotter(path)
	dat1, sampling_rate1 = librosa.load(path)


	plt.figure(figsize=(20, 10))
	D = librosa.amplitude_to_db(np.abs(librosa.stft(dat1)), ref=np.max)
	plt.subplot(4, 2, 1)
	librosa.display.specshow(D, y_axis='linear')
	plt.colorbar(format='%+2.0f dB')
	plt.title('Linear-frequency power spectrogram')
	plt.savefig(OUTPUT_PATH)

