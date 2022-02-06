---
title: 'SAIL: Single Access Point-Based Indoor Localization'
authors: 
- mariakakis
- Souvik Sen
- Jeongkeun Lee
- Kyu-Han Kim
venue: $MOBISYS$
date: 2014-06-18
pdf: /pdfs/sail.pdf
image: /images/pubs/sail.jpg
thumbnail: /images/pubs/sail_thumb.jpg
caption: A method for localization that only uses a single access point
abstract: |
    This paper presents SAIL, a Single Access Point Based Indoor Localization system. Although there have been advances in WiFi-based positioning techniques, we find that existing solutions either require a dense deployment of access points (APs), manual fingerprinting, energy hungry WiFi scanning, or sophisticated AP hardware. We design SAIL using a single commodity WiFi AP to avoid these restrictions. SAIL computes the distance between the client and an AP using the propagation delay of the signal traversing between the two, combines the distance with smartphone dead-reckoning techniques, and employs geometric methods to ultimately yield the client's location using a single AP. SAIL combines physical layer (PHY) information and human motion to compute the propagation delay of the direct path by itself, eliminating the adverse effect of multipath and yielding sub-meter distance estimation accuracy. Furthermore, SAIL systematically addresses some of the common challenges towards dead-reckoning using smartphone sensors and achieves 2-5x accuracy improvements over existing techniques. We have implemented SAIL on commodity wireless APs and smartphones. Evaluation in a large-scale enterprise environment with 10 mobile users demonstrates that SAIL can capture the user's location with a mean error of 2.3m using just a single AP.
citation: |
    Alex T. Mariakakis, Souvik Sen, Jeongkeun Lee, and Kyu-Han Kim. 2014. SAIL: single access point-based indoor localization. In Proceedings of the 12th annual international conference on Mobile systems, applications, and services (MobiSys '14). ACM, New York, NY, USA, 315-328. DOI=http://dx.doi.org/10.1145/2594368.2594393
bibtex: |
    @inproceedings{Mariakakis:2014:SSA:2594368.2594393,
    author = {Mariakakis, Alex T. and Sen, Souvik and Lee, Jeongkeun and Kim, Kyu-Han},
    title = {SAIL: Single Access Point-based Indoor Localization},
    booktitle = {Proceedings of the 12th Annual International Conference on Mobile Systems, Applications, and Services},
    series = {MobiSys '14},
    year = {2014},
    isbn = {978-1-4503-2793-0},
    location = {Bretton Woods, New Hampshire, USA},
    pages = {315--328},
    numpages = {14},
    url = {http://doi.acm.org/10.1145/2594368.2594393},
    doi = {10.1145/2594368.2594393},
    acmid = {2594393},
    publisher = {ACM},
    address = {New York, NY, USA},
    keywords = {dead-reckoning, indoor location, sensing, smartphones, time-of-flight},
    }
---
