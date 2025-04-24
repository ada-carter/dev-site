const projectsData = [
  {
    title: "AdaVisionUnit",
    image: "projectcards/adavisionunitcard.png",
    description: "A simple Ada library built for testing computer vision pipelines at the data structure level. Verifies bounding box overlap, parses YOLO annotation files, and checks label accuracy in export batches.",
    tags: ["Computer Vision", "Quality Assurance", "Embedded Systems"],
    link: "https://github.com/ada-carter/ada-vision"
  },
  {
    title: "OceanCV.org",
    image: "projectcards/oceancvcard.png",
    description: "Open-source computer vision textbook for deep-sea imagery analysis, providing students and professionals with modern CV skills for research and the workforce.",
    tags: ["Computer Vision", "Machine Learning", "Education"],
    link: "https://oceancv.org/index.html"
  },
  {
    title: "EchinoML",
    image: "projectcards/echinomlcard.png",
    description: "Specialized AI system for identifying and classifying deep-sea echinoderm species, using ML for FASTA sequence analysis and taxonomy classification.",
    tags: ["Machine Learning", "Taxonomy", "Biodiversity"],
    link: "https://github.com/AI-Ecology-Lab/EchinoML"
  },
  {
    title: "OOI Data Dashboard",
    image: "projectcards/ooidatadashboardcard.png",
    description: "Interactive visualization platform for Ocean Observatories Initiative data, enabling CV based monitoring of deep-sea environmental parameters and long-term trend analysis across benthic ecosystems.",
    tags: ["Computer Vision", "Data Visualization", "Time Series"],
    link: "https://github.com/ada-carter/ooi-rca-cv-dashboard"
  },
  {
    title: "VenoSense",
    image: "projectcards/venosensecard.png",
    description: "Miniaturized computer vision system for real-time monitoring of venous obstruction, specializing in DVT detection.",
    tags: ["Computer Vision", "Biotechnology", "Medical Research"],
    link: "https://venosense.org/"
  },
  {
    title: "NOAA MML Modeling",
    image: "projectcards/noaammlcard.png",
    description: "Collaborative research with NOAA's Marine Mammal Laboratory developing prediction models for seal populations in the Arctic, focusing on species distribution and habitat use.",
    tags: ["Computer Vision", "Climate Science", "Conservation"],
    link: "https://huggingface.co/atticus-carter/NOAA_AFSC_MML_Iceseals_31K"
  },
  {
    title: "C-FASTA",
    image: "projectcards/cfastacard.png",
    description: "A C++ based package for FASTA sequence analysis, designed to improve the efficiency and accuracy of genomic data processing in bioinformatics.",
    tags: ["Bioinformatics", "C++", "Genomics"],
    link: "https://github.com/AI-Ecology-Lab/C_FASTA"
  },
  {
    title: "Vanuatu Ed Dashboard",
    image: "projectcards/vanuatueddashboardcard.png",
    description: "Educational platform visualizing education systems around Vanuatu'sisland chain, integrating data from various sources to enhance understanding of local education challenges and opportunities.",
    tags: ["Education", "Data Visualization", "Community Science"],
    link: "https://vanuatueducation.streamlit.app/"
  },
  {
    title: "IBIS Abstract Writer",
    image: "projectcards/ibisabstractwritercard.png",
    description: "A Website built to help students write abstracts for scientific papers, using a pedagogical approach to guide users through the process of writing a structured abstract.",
    tags: ["Education", "Scientific Writing", "Web Development"],
    link: "https://ada-carter.github.io/abstract/"
  },
  {
    title: "OceanCV Bench",
    image: "projectcards/oceancvbenchcard.png",
    description: "A Python package for benchmarking computer vision algorithms on deep-sea imagery, providing a standardized framework for evaluating performance and accuracy.",
    tags: ["Computer Vision", "Benchmarking", "Machine Learning"],
    link: "https://github.com/ada-carter/oceancvbench"
  },
  {
    title: "K-Means Segmentation",
    image: "projectcards/kmeanssegmentationcard.png",
    description: "A streamlit app that allows users to visualize and interact with K-means clustering algorithms, providing insights into the segmentation of images and data points.",
    tags: ["Computer Vision", "Data Visualization", "Streamlit"],
    link: "https://github.com/AI-Ecology-Lab/K-Means-Segmentation"
  },
  {
    title: "ONC MOTHRA Project",
    image: "projectcards/oceansnetworkscanadamothracard.png",
    description: "Collaborative research with Ocean Networks Canada studying the MOTHRA hydrothermal vent field, focusing on the ecology of a fixed camera site using a YOLOV11 algorithm.",
    tags: ["Computer Vision", "Time Series", "Ecology"],
    link: "https://huggingface.co/atticus-carter/YOLOV11_ONC_Mothra"
  },
  {
    title: "SfM Vents 3D Modeling",
    image: "projectcards/sfmventscard.png",
    description: "Using Structure from Motion (SfM) photogrammetry to create high-resolution 3D models of hydrothermal vent structures for temporal change analysis and ecosystem monitoring.",
    tags: ["3D Modeling", "Photogrammetry", "Time Series"],
    link: ""
  },
  {
    title: "Soil Pollution What-If Lab",
    image: "projectcards/soilpollutioncard.png",
    description: "A streamlit app that allows students to see the underlying predictive power and feature importance in a health outcomes soil health interaction model.",
    tags: ["Machine Learning", "Streamlit", "Education"],
    link: "https://github.com/ada-carter/Soil-Pollution-What-If-Lab"
  },
  {
    title: "Julia AutoDash",
    image: "projectcards/juliaautodashcard.png",
    description: "An automated marine time series analysis pipeline built entirely in Julia, designed to process environmental sensor and species count data from deep sea deployments.",
    tags: ["Computer Vision", "Julia", "Dashboard"],
    link: "#"
  },
  {
    title: "3D Cephalopod Shell Viewer",
    image: "projectcards/3DShellViewercard.png",
    description: "A Python PyQt5/PyQtGraph application that generates and interactively visualizes 3D cephalopod shell meshes using Raup’s logarithmic spiral and Okamoto’s differential‐geometry parametric models, with support for septa fitting, siphuncle modeling, and taphonomic distortion/restoration.",
    tags: ["PyQt", "Python", "Paleontology"],
    link: "https://github.com/ada-carter/-3D-Cephalopod-Shell-Simulator"
  },
  {
    title: "Disability Frameworks",
    image: "projectcards/HumanVariationcard.png",
    description: "A web‑based interactive tool that demonstrates how fixed cutoffs on continuous human traits produce binary “meets criteria” vs. “needs support” classifications. The simulator exposes the limitations and biases of one‑size‑fits‑all assessment models and encourages more inclusive, universal-design approaches.",
    tags: ["Education", "Web Development", "Ed Policy"],
    link: "https://ada-carter.github.io/Human-Variation/"
  },
  {
    title: "Fish Market Regression",
    image: "projectcards/fishmarketregressioncard.png",
    description: "Implemented multiple linear regression models to predict fish weight using standardized measurements (length, height, width) and species categorical variables. The analysis progressed from a baseline model to one incorporating species effects and further to an interaction model, boosting the model R² from 87.8% to 96.5%. This technical approach validates the necessity for species-specific adjustments in weight estimation and supports scalable, computer vision–enabled deployment in ecological monitoring systems.",
    tags: ["Regression", "Machine Learning", "Ecology", "Computer Vision"],
    link: "#"
  }
];
