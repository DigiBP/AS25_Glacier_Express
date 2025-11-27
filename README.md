# AS25_Glacier_Express

## Overview
### Digital Pharmacy  
The swiss pharmacy and drug system is similar to systems in other countries, however, there are
some differences. In Switzerland, drugs defined as products having medicinal promise (e.g. «helps
against headache»), can exclusively be purchased in pharmacies, rarely in «Drogerien». In Switzer-
land, drugs are classified in several categories. The classification determines whether a product is
available over-the-counter (OTC) or if a prescription is needed: most drugs against minor illnesses
or aches, for example, headaches or cough, can be purchased without a prescription. Several drugs
such as antibiotics, drugs against cancer or high dosage pain relievers can only be purchased with
a prescription from a medical doctor.  

The goal of this project is to identify processes that would benefit from digitalization and devise more efficient workflows for providing pharmaceutical services.

## AS-IS Process
### Patient Arrival

The process begins when the patient arrives at the pharmacy. The pharmacy technician receives the patient and initiates the service interaction.

### Assessment of Patient Needs

The pharmacy technician assesses the purpose of the patient’s visit. Based on the patient’s needs, the process follows one of the following paths:

- Prescription or refill
- Over-the-counter (OTC) medication request
- Symptom assessment
- Vaccination service
- Health screening

#### Prescription or Refill

The technician checks the prescription, which is considered a knowledge-intensive task requiring human evaluation. If issues are found, the pharmacy contacts the prescribing physician to resolve them. Should the issues persist, the order is canceled and the process ends. Should the issues be resolved, the process continues and the stock gets checked. If no issues are found, the technician proceeds directly to check the stock.

If the medication is available, the technician prepares the medication. Otherwise, the stock gets checked for alternative options and if the patient accepts the alternative, the medication is prepared. After the patient provides payment or insurance details, the pharmacy technician proceeds with the counseling and hands the medication over to the patient. With this, the process ends. If the alternative is rejected or no suitable alternative exists, the original medication is ordered and the process ends after ordering.

#### OTC Medication or Symptom Assessment

The pharmacy technician assesses the patient’s symptoms to recommend suitable OTC products or advice. Based on symptom evaluation, the technician offers guidance or product recommendations. If the recommended medication is suitable, the process ends. Otherwise, the patient is referred to a doctor for further examination.

#### Vaccination Service

The technician administers the vaccination. Once the vaccination is provided, the process ends.

#### Health Screening
The technician performs the requested screening service. After the completion of the screening, the process ends.   
  

![as-is process](images/as-isV2.png)

