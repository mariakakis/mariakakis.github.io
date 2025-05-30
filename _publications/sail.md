---
title: 'SAIL: Single Access Point-Based Indoor Localization'
authors: 
- mariakakis
- Souvik Sen
- Jeongkeun Lee
- Kyu-Han Kim
venue: $MOBISYS$
date: 2014-06-18
link: https://dl.acm.org/doi/abs/10.1145/2594368.2594393
thumbnail: /images/pubs/sail.jpg
abstract: |
  This paper presents SAIL, a Single Access Point Based Indoor Localization system. Although there have been advances in WiFi-based positioning techniques, we find that existing solutions either require a dense deployment of access points (APs), manual fingerprinting, energy hungry WiFi scanning, or sophisticated AP hardware. We design SAIL using a single commodity WiFi AP to avoid these restrictions. SAIL computes the distance between the client and an AP using the propagation delay of the signal traversing between the two, combines the distance with smartphone dead-reckoning techniques, and employs geometric methods to ultimately yield the client's location using a single AP. SAIL combines physical layer (PHY) information and human motion to compute the propagation delay of the direct path by itself, eliminating the adverse effect of multipath and yielding sub-meter distance estimation accuracy. Furthermore, SAIL systematically addresses some of the common challenges towards dead-reckoning using smartphone sensors and achieves 2-5x accuracy improvements over existing techniques. We have implemented SAIL on commodity wireless APs and smartphones. Evaluation in a large-scale enterprise environment with 10 mobile users demonstrates that SAIL can capture the user's location with a mean error of 2.3m using just a single AP.
---
