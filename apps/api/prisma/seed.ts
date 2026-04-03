import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const patients = [
  {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    intakeData: {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@example.com',
      chiefComplaint: 'Struggling with weight gain after starting metformin. Gained 12 lbs in 3 months.',
      weightHistory: 'Current: 198 lbs, Height: 5\'6". Previous: 186 lbs 6 months ago.',
      currentMedications: 'Metformin 1000mg twice daily, Lisinopril 10mg',
      allergies: 'Penicillin',
      additionalNotes: 'Type 2 diabetes diagnosed 8 months ago. Sedentary job.',
    },
    aiSummary:
      'Patient presents with significant weight gain (12 lbs over 3 months) since initiating metformin therapy. History of recently diagnosed T2DM with concurrent antihypertensive use. Weight gain pattern suggests possible medication-related metabolic changes requiring lifestyle and pharmacological review.',
    urgencyScore: 4,
    flags: ['Type 2 diabetes', 'Medication-associated weight gain', 'Hypertension', 'Polypharmacy risk'],
  },
  {
    name: 'Marcus Thompson',
    email: 'marcus.thompson@example.com',
    intakeData: {
      name: 'Marcus Thompson',
      email: 'marcus.thompson@example.com',
      chiefComplaint: 'BMI 42, looking to start a weight management program before knee replacement surgery.',
      weightHistory: 'Current: 267 lbs, Height: 5\'10". Max weight: 285 lbs 2 years ago.',
      currentMedications: 'Ibuprofen 400mg as needed for knee pain',
      allergies: 'None',
      additionalNotes: 'Orthopedic surgeon requires BMI below 38 before scheduling surgery. Target: lose 35 lbs.',
    },
    aiSummary:
      'Patient with Class III obesity (BMI 42) requiring surgical weight reduction prior to elective knee replacement. Has shown prior weight loss capacity (18 lbs). Pre-surgical timeline creates strong external motivation for structured intervention.',
    urgencyScore: 5,
    flags: ['BMI > 40', 'Pre-surgical weight requirement', 'Knee osteoarthritis', 'NSAIDs chronic use'],
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@example.com',
    intakeData: {
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@example.com',
      chiefComplaint: 'Post-partum weight retention 14 months after delivery. Struggling to lose 28 lbs gained during pregnancy.',
      weightHistory: 'Pre-pregnancy: 142 lbs, Post-delivery: 178 lbs, Current: 170 lbs. Height: 5\'4".',
      currentMedications: 'Prenatal vitamins',
      allergies: 'Sulfa drugs',
      additionalNotes: 'Breastfeeding stopped 3 months ago. Experiencing fatigue and hair loss.',
    },
    aiSummary:
      'Post-partum patient with persistent weight retention 14 months after delivery. Symptoms of fatigue and hair loss warrant thyroid function evaluation to rule out postpartum thyroiditis as a contributing factor.',
    urgencyScore: 3,
    flags: ['Post-partum weight retention', 'Possible thyroid dysfunction', 'Hair loss', 'Fatigue'],
  },
  {
    name: 'James Okafor',
    email: 'james.okafor@example.com',
    intakeData: {
      name: 'James Okafor',
      email: 'james.okafor@example.com',
      chiefComplaint: 'Diagnosed with metabolic syndrome. Doctor recommended weight management program.',
      weightHistory: 'Current: 221 lbs, Height: 5\'9". Gradual gain of 40 lbs over 5 years.',
      currentMedications: 'Atorvastatin 20mg, Amlodipine 5mg',
      allergies: 'None known',
      additionalNotes: 'Fasting glucose 118, triglycerides 210, HDL 38. Father had MI at 52.',
    },
    aiSummary:
      'Patient with confirmed metabolic syndrome (elevated fasting glucose, hypertriglyceridemia, low HDL, hypertension) and significant cardiovascular family history. Lipid profile and glycemic markers indicate high CVD risk requiring aggressive lifestyle and pharmacological management.',
    urgencyScore: 5,
    flags: ['Metabolic syndrome', 'Pre-diabetes', 'High CVD risk', 'Family history of MI', 'Dyslipidemia'],
  },
  {
    name: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    intakeData: {
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      chiefComplaint: 'Interested in GLP-1 medication (Ozempic/Wegovy) for weight management.',
      weightHistory: 'Current: 174 lbs, Height: 5\'5". BMI 29. Weight stable for 2 years.',
      currentMedications: 'Oral contraceptive',
      allergies: 'None',
      additionalNotes: 'Has tried keto and intermittent fasting without success. Researched GLP-1 options online.',
    },
    aiSummary:
      'Patient with overweight BMI (29) seeking pharmacological intervention. History of failed dietary approaches. GLP-1 candidate evaluation needed; eligibility criteria and cardiovascular screening required before prescribing.',
    urgencyScore: 2,
    flags: ['GLP-1 candidate evaluation', 'Failed prior dietary interventions', 'BMI borderline overweight'],
  },
  {
    name: 'Robert Vasquez',
    email: 'robert.vasquez@example.com',
    intakeData: {
      name: 'Robert Vasquez',
      email: 'robert.vasquez@example.com',
      chiefComplaint: 'Sleep apnea worsening. CPAP pressure increased twice this year. Doctor says weight is the cause.',
      weightHistory: 'Current: 312 lbs, Height: 6\'1". BMI 41. Gained 60 lbs since COVID.',
      currentMedications: 'CPAP therapy, Omeprazole 20mg',
      allergies: 'Aspirin (hives)',
      additionalNotes: 'Severe GERD also worsening. Works night shifts. Extreme fatigue affecting work performance.',
    },
    aiSummary:
      'Patient with Class III obesity (BMI 41) presenting with obesity-related comorbidities including severe OSA and GERD, both worsening in parallel with recent 60-lb COVID-era weight gain. Night shift work pattern likely contributing to metabolic dysregulation.',
    urgencyScore: 5,
    flags: ['BMI > 40', 'Severe OSA', 'GERD', 'Night shift metabolic risk', 'Rapid weight gain'],
  },
  {
    name: 'Amanda Foster',
    email: 'amanda.foster@example.com',
    intakeData: {
      name: 'Amanda Foster',
      email: 'amanda.foster@example.com',
      chiefComplaint: 'Interested in learning healthier eating habits. Not looking for medications.',
      weightHistory: 'Current: 158 lbs, Height: 5\'6". BMI 25.5. Has fluctuated 10-15 lbs for years.',
      currentMedications: 'None',
      allergies: 'Tree nuts',
      additionalNotes: 'Active lifestyle, runs 3x/week. Primary concern is maintaining healthy weight long-term.',
    },
    aiSummary:
      'Healthy-weight patient seeking preventive nutrition guidance. Active with established exercise routine. Focus on sustainable dietary patterns and weight maintenance strategies. No pharmacological intervention indicated.',
    urgencyScore: 1,
    flags: ['Tree nut allergy', 'Preventive care focus'],
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    intakeData: {
      name: 'David Kim',
      email: 'david.kim@example.com',
      chiefComplaint: 'Weight gain of 45 lbs after starting antidepressants 18 months ago. Feeling trapped.',
      weightHistory: 'Pre-medication: 165 lbs, Current: 210 lbs, Height: 5\'11".',
      currentMedications: 'Mirtazapine 30mg, Quetiapine 50mg',
      allergies: 'None',
      additionalNotes: 'Psychiatric medications essential per psychiatrist. Experiencing significant distress about weight.',
    },
    aiSummary:
      'Patient with substantial psychotropic-induced weight gain (45 lbs over 18 months). Both mirtazapine and quetiapine carry high metabolic risk. Collaborative care with psychiatry required before any medication adjustments; bariatric pharmacology review needed.',
    urgencyScore: 4,
    flags: ['Psychotropic-induced obesity', 'Metabolic side effects', 'Psychiatric comorbidity', 'Requires multidisciplinary care'],
  },
  {
    name: 'Patricia Nguyen',
    email: 'patricia.nguyen@example.com',
    intakeData: {
      name: 'Patricia Nguyen',
      email: 'patricia.nguyen@example.com',
      chiefComplaint: 'Menopausal weight redistribution. Gained 20 lbs around abdomen in past 2 years.',
      weightHistory: 'Current: 168 lbs, Height: 5\'5". BMI 28. Pre-menopause: 148 lbs.',
      currentMedications: 'Low-dose estrogen patch',
      allergies: 'Latex',
      additionalNotes: 'Age 52. Menopause onset 2 years ago. Doing HRT. Concerned about visceral fat and heart health.',
    },
    aiSummary:
      'Perimenopausal patient with central adiposity development during menopause transition. Currently on HRT. Visceral fat accumulation warrants cardiovascular risk assessment and targeted metabolic intervention alongside existing hormone therapy.',
    urgencyScore: 3,
    flags: ['Menopausal weight redistribution', 'Central adiposity', 'Cardiovascular risk', 'HRT interaction'],
  },
  {
    name: 'Tyler Brooks',
    email: 'tyler.brooks@example.com',
    intakeData: {
      name: 'Tyler Brooks',
      email: 'tyler.brooks@example.com',
      chiefComplaint: 'Binge eating episodes, especially at night. Gained 55 lbs in one year.',
      weightHistory: 'Current: 245 lbs, Height: 6\'0". BMI 33. One year ago: 190 lbs.',
      currentMedications: 'None',
      allergies: 'None',
      additionalNotes: 'Episodes occur 4-5x/week, usually after work stress. History of depression. No current psychiatric care.',
    },
    aiSummary:
      'Patient presenting with symptoms consistent with binge eating disorder (BED) driving rapid weight gain (55 lbs/year). High stress and depression history are significant risk factors. Psychological evaluation and BED-specific treatment should be prioritized alongside any weight management intervention.',
    urgencyScore: 4,
    flags: ['Probable binge eating disorder', 'Rapid weight gain', 'Depression history', 'Requires psychiatric referral'],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.followUp.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()

  // Create patients
  for (const patientData of patients) {
    const patient = await prisma.patient.create({
      data: {
        name: patientData.name,
        email: patientData.email,
        intakeData: patientData.intakeData,
        aiSummary: patientData.aiSummary,
        urgencyScore: patientData.urgencyScore,
        flags: patientData.flags,
      },
    })

    // Add a scheduled consultation for each patient
    const scheduledAt = new Date()
    scheduledAt.setDate(scheduledAt.getDate() + Math.floor(Math.random() * 7) + 1)

    await prisma.consultation.create({
      data: {
        patientId: patient.id,
        status: 'scheduled',
        scheduledAt,
        notes: null,
      },
    })

    console.log(`  ✓ Created patient: ${patient.name} (urgency: ${patient.urgencyScore})`)
  }

  console.log(`\n✅ Seeded ${patients.length} patients successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
