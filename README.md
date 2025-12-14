# AS25_Glacier_Express  

***Add section guide here

### Team Members  

| Team member | Email |
|---|---|
| Ruben Ballesteros | ruben.ballesteros@students.fhnw.ch |
| Blanca Moreno | blancamorenoperez04@gmail.com |
| Kurt Kuser | kurt.kuser@students.fhnw.ch |
| Nemanja Arsenijevic | nemanja.arsenijevic@students.fhnw.ch |
| Houssem Bouchemal | houssemeddine.bouchemal@students.fhnw.ch |

### Login information
- Google calendar
- Camunda
- Make?

## Usage

** Need to add usage instructions here (e.g., start server, link to chatbot frontend page, camunda)

## Techonologies
- Voiceflow
- OCR.space
- Camunda
- Supabase
- Make (Groq, SendGrid)
- Google Calendar (FreeBusy API, Calendar API)
- FastAPI

## Overview
### Digital Pharmacy

Community pharmacies often experience high customer traffic, especially during peak hours. Patients may visit the pharmacy for a wide range of reasons, such as filling prescriptions, purchasing over-the-counter medications, booking services like vaccinations, or asking for general advice. Handling these requests in person can be time-consuming for both customers and pharmacy staff, leading to long waiting times and inefficient workflows.

This project is motivated by the idea that a large portion of the pharmacy experience can be streamlined through digitalization. By allowing patients to complete certain steps in advance—such as describing symptoms, uploading prescriptions, selecting medications, or booking appointments—many in-pharmacy processes can be prepared or partially completed before the customer even arrives.

The goal is to reduce unnecessary waiting time, improve service efficiency, and better allocate pharmacists’ time to tasks that require professional judgment. Through the use of a chatbot and integrated workflow automation, this project explores how digital tools can support pharmacies in managing common customer interactions more effectively while uploading safety requirements. 

## AS-IS Process

![as-is process](images/as-isV2.png)

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

## To-Be Process
End-to-End Process View:

![to-be process end-to-end](images/documentation_process_model.png)

**** Explain that bpmn process model above is not the executable workflow model implemented in Camunda. It is for visual purposes to highlight the entire process which spans multiple systems (not all of which are require connection to Camunda). Maybe add short description for each of the sequence flows.

### Camunda Workflow

![to-be process](images/symptom_eval_process_simplified_v2.png)

The Camunda workflow starts when the Pharmacy Digital System (Camunda) receives the request from the patient from the chatbot. Based on the request type, the process continues with one of three flows: Prescription medication ordering, OTC order, or appointment scheduling.

#### Prescription medication ordering   
A prescription uploaded by the patient via the chatbot is validated by the pharmacist. If the prescription is rejected, the patient is notified by the Pharmacy Digital System and the process ends. If it is approved, the pharmacy technician prepares the medication. Once preparation is complete, the patient is notified that the medication is ready for pickup. The pharmacist then provides patient counselling. After payment is collected or insurance information is confirmed, the medication is dispensed and the process ends.

#### OTC order  
The patient requests over-the-counter (OTC) medication via the chatbot. The pharmacy technician confirms the OTC order and prepares the medication. When preparation is complete, the patient is notified that the medication is ready for pickup. The pharmacist provides patient counselling. After payment is collected or insurance information is confirmed, the medication is dispensed and the process ends.

#### Appointment scheduling  
The patient requests an appointment via the chatbot. The pharmacy technician confirms the appointment and the service is performed. Afterwards, payment is collected or insurance information is confirmed, and the process ends.

### ChatBot

![Chatbot process](images/chatbot_process2.png)

#### Conversation Start 

The process starts when a patient initiates a chatbot interaction. The chatbot then routes the conversation based on the request type into one of three flows: prescription order, symptom evaluation, or appointment scheduling.  

#### Prescription order

The chatbot requests the prescription and then verifies the prescription details. Next, the system checks inventory (via DeepNote Python API and a Supabase database). If the inventory is below the minimum level, the system submits a purchase order to the supplier (via DeepNote Python API, Make Webhook, Groq, SendGrid). If the inventory is not below the minimum level, the process continues without submitting a supplier order. In both cases, the chatbot then requests additional patient data. Once the required data is collected, the system sends a POST request to Camunda.  

#### Symptom evaluation

The chatbot asks the patient for a symptom description and then assesses treatment options. If the assessment concludes that a doctor visit is necessary, the conversation ends (the chatbot recommends seeking medical care). Otherwise, the symptoms are assessed to be treatable by self-care and the chatbot offers OTC options. After the OTC options are presented, the chatbot asks whether the patient wants to purchase the medication. If not, the process ends, otherwise the chatbot continues with checking the inventory (via DeepNote Python API + Supabase). If the inventory is below minimum, the chatbot submits a purchase order to the supplier (via DeepNote Python API, Make Webhook, Groq, SendGrid). Either way, the chatbot then requests additional patient data and finally sends a POST request to Camunda.  

#### Appointment scheduling

The chatbot collects the patient/appointment details and then asks for the desired date. The system then checks available appointments (via Make Webhook + Google FreeBusy API). If a suitable appointment is found, the system books the selected appointment slot (via Make Webhook + Google Calendar API) and then sends a POST request to Camunda. If no suitable appointment slot can be found, the patient is asked to enter another date/time for the appointment.

### Knowledge Base (KB)
<p align="center">
  <img src="images/medication_codes.jpg" width="auto%" height="500px"/>
  <img src="images/MedicationKB-1.jpg" width="auto" height="500px"/>
</p>

#### KB Purpose
The medication KB serves as structured reference that enables the chatbot to provide safe, consistent, and context-aware medication guidance. It contains information on a predefined list of medications, including medication names, unique medication codes (for database identification), indications, dosing guidelines, side effects, contraindictions, red flags, and approved alternatives. 

By using the KB, the chatbot can: 
- Recommend appropriate OTC medications when suitable
- Identify situations where medical evaluation is required instead of self-treatment
- Extract and pass standardized medication codes to other systems for inventory checks and process automation

### Booking Appointment

![voiceflow appointment](images/voiceflow_appointment.png)

- Chatbot Agent asks patient for their information: name, email, reason for appointment (can select from Vaccination, Consultation, or Health Screening).
- API request is sent to Make webhook to obtain list of booked appointments
- Javascript code block determines the available appointments based on working hours, appointment intervals (30 min per appointment), and the list of booked appointments. 
- List of available appointments is presented to the customer
- Customer selects a date or asks for a different date
- Selected appiontment slot is saved to Google Calendar with Make Webhook
- Chat ends and appointment details are sent to Camunda via API request

### Symptom Evaluation and OTC order

![symptom evaluation](images/voiceflow_symptom_eval.png)

#### Symptom Evaluation Agent Prompt
Using the available KB and a web search, the agent will either recommend self-treatment using OTC medication or a medical evaluation by a medical professional. The following prompt was used to help the agent make the triage decision: [Symptom Evaluation Prompt (PDF)](supplementarydocs/symptomevalprompt.pdf)

- Agents ask customer to describe symptoms
- Based on description a triage decision is made
- If self=treatment is made, Inventory API is called to check if available and place purchase order in case stock is below minimum level
- Agent provides information about the medication (safety, usage, etc.) and then requests customer information (name, email, dob, etc.) to place the order. Once obtained the order is submitted.
- Post request sent to Camunda with order details
- Chat ends

### Prescription Medication Order

![prescription order](images/voiceflow_prescription.png)

- Chatbot prompts customer to upload prescription using provided tool
- Uploaded document is sent to OCR.space via API Request which extracts the prescription details using Optical Character Recognition
- Information is sent back to Voiceflow and the user confirms it is correct
- API Request is sent to database to check inventory (and place purchase order if necessary)
- Agent block provides relevant information about the medication and asks user to provide their email to process the order
- API Request sends order information to Camunda and process finishes

## Camunda Workflow
Need to insert camunda workflow images for forms, variables received from voiceflow

## Make Webhooks
### Purchase Order
![purchase order webhook](images/purchase_order_webhook.png)

** Ask Houssem for explanation. He implemented this part and I'm not sure exactly what Groq and SendGrid are doing. 

### Appointment Scheduling

![appointment scheduling](images/appointment_webhook.png)
**Voiceflow sends api request to webhook. Routed based on the the required "action" (either get slots or book slot). 

Get Slots Route (when "action" = get slots): 
- Google calendar FreeBusy API is called and returns array with booked appointments
- An Iterator is used to convert the result array into a series of bundles
- JSON Aggregator combines the data bundles from the Iterator Module into a single, structured JSON object with keys "Start" and "End" for eaech bundle
- The webhook response send this JSON array back to Voiceflow

Book Slots (when "action" = book slots):
- Voiceflow passes appointment details to webhook (name, email, type, date/time) and Google Calendar API is called to create the appointment
- If successful a summary is sent back the voiceflow in the webhook response

need to add explanation

### Patient Email Notification

**Insert webhook image and explanation when available. Houssem said he would implement this. Get description from him

## Database

** Take a look at the Supabase Database and describe it a bit. I think the relevant fields for the Inventor table are: medication_name, med_code, quantity_on_hand, retail_price? (ask Houssem), supplier_id. 

There are two other tables "reorder_history" and "suppliers" but I'm not sure what is relevant there as those are used in the API Houssem created.

## API Overview

** Ask Houssem for details about this. It's about his DeepNote API