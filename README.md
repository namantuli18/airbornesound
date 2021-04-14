# Anomaly Detection Using Airborne Sound 

## Description <h2> 
  Acoustic condition monitoring via airborne sound analysis in conjunction with advanced signal processing and machine learning methods has proved to be a powerful tool 
  for early detection of machinery breakdown. It allows timely detection of anomalies, which results in more efficient and cost-effective maintenance. It also
  provides a simple and effective method to retrofit to existing plants and environments where this could otherwise be costly.
  We plan to implement a federated approach to build a robust algorithm that detects anomalous sounds using 
  Airborne Sound Analysis and incorporates ensembling based techniques to further improve upon the performance & efficiency of a solo model and ensures better scalability.
  <h2>
    
 ## Problems Faced <h2> 
   * Maintenance in various industries consuming unnecessary resources, increase operational costs and cripple daily operations. 
   * Defects going undetected and unaddressed leading to major industrial plant failures. 
   * Predictive Maintenance could be helpful but installing various sensors on individual machines in older plants can be costly. 
   * A new approach could be to use the airborne sound by placing various acoustic sensors strategically around the facility. 
  
  ## Ideation Strategies <h2> 
  We have implemented a Supervised Learning technique that encapsulates the following features into a robust algorithm for Anomaly Detection-
   * CNNs for primary Sound Classification.
   * Individual models for each volume level. 
   * Multi volume ensembling for more stable results.
   * Separate model for classifying the equipment.
   * Real time audio visualizations.
   * Optimal mic-array placing algorithm.

   ## Flow of Control for building the model [CNNs for Sound Classification ]<h2>
   * Loading the wave files.
   * Use an image spectrogram and convert the image to data points.
   * Convert labels to categorical data.
   * Build a CNN Model.
   * Train the model.
   * Pickled the model for further use.
   
   **Note:** The same procedure is followed to build an anomaly detection for each instrument belonging to each volume level.




  

  
  
  


    
