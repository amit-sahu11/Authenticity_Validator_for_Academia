/* ---------- Cryptographic and Local Storage Helpers ---------- */

export async function generateHash(data) {
  const canonicalString = `${data.studentName}|${data.rollNumber}|${data.universityName}|${data.degreeType}|${data.completionYear}`.toLowerCase().trim();
  const msgBuffer = new TextEncoder().encode(canonicalString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { hashHex, canonicalString };
}

export const getCertificates = () => JSON.parse(localStorage.getItem('certificates') || '[]');
export const saveCertificates = (certs) => localStorage.setItem('certificates', JSON.stringify(certs));

const LEDGER_VERSION = '2'; // bump this when default certs are updated

export const initMockLedger = () => {
  const storedVersion = localStorage.getItem('ledger_version');
  if (storedVersion === LEDGER_VERSION) return; // already up to date
  const defaultCerts = [
      {
        studentName: 'Arjun Sharma',
        rollNumber: '1NTU18CS123',
        universityName: 'Northern Tech University',
        degreeType: 'Bachelor of Technology (B.Tech)',
        programCourse: 'Computer Science and Engineering',
        completionYear: 2022,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. Rajesh Kumar',
        designation: 'Assistant Registrar',
        remarks: 'All details verified successfully. Certificate is valid.',
        block: 1024,
        timestamp: new Date('2024-05-20').toLocaleString(),
        hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
      },
      {
        studentName: 'Priya Sharma',
        rollNumber: '21CS045',
        universityName: 'IIT Bombay',
        degreeType: 'Bachelor of Technology (B.Tech)',
        programCourse: 'Computer Science',
        completionYear: 2024,
        verificationStatus: 'Verified',
        verifiedBy: 'Prof. S. Chaudhuri',
        designation: 'Dean Academic',
        remarks: 'Degree verification completed via smart contract node.',
        block: 1001,
        timestamp: new Date('2024-06-15').toLocaleString(),
        hash: '0a9d91364c9ecedb13505e01bfb581732faad78224d95db3a21ae597aa068a4d'
      },
      {
        studentName: 'Alice Johnson',
        rollNumber: 'BP-MBA-2023-441',
        universityName: 'BITS Pilani',
        degreeType: 'Master of Business Admin (MBA)',
        programCourse: 'Finance & Analytics',
        completionYear: 2023,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. Sudhirkumar Barai',
        designation: 'Director',
        remarks: 'Ledger fingerprint check verified successfully.',
        block: 1056,
        timestamp: new Date('2024-05-28').toLocaleString(),
        hash: 'dbf4dab474d146309d867a266c8bf6d7a266c8bf6d7a266c8bf6d7a266c8bf6'
      },
      {
        studentName: 'Rahul Sharma',
        rollNumber: 'IITD-2018-CS-022',
        universityName: 'IIT Delhi',
        degreeType: 'Bachelor of Technology (B.Tech)',
        programCourse: 'Computer Science',
        completionYear: 2022,
        verificationStatus: 'Verified',
        verifiedBy: 'Prof. Rangan Banerjee',
        designation: 'Registrar Office',
        remarks: 'Signatures and metadata matched automatically via OCR ledger.',
        block: 982,
        timestamp: new Date('2024-06-01').toLocaleString(),
        hash: 'a9ab6fa42555417a9dcd3fc95aeb66113fc95aeb66113fc95aeb66113fc95ae'
      },
      {
        studentName: 'Rajesh Patel',
        rollNumber: '1NTU19ME044',
        universityName: 'Northern Tech University',
        degreeType: 'Bachelor of Technology (B.Tech)',
        programCourse: 'Mechanical Engineering',
        completionYear: 2023,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. Rajesh Kumar',
        designation: 'Assistant Registrar',
        remarks: 'Credential validated via automated OCR registry pipeline.',
        block: 1102,
        timestamp: new Date('2024-06-18').toLocaleString(),
        hash: 'e4d1e957d65648f1872b33b17b3d0df0872b33b17b3d0df0872b33b17b3d0df'
      },
      {
        studentName: 'Neha Verma',
        rollNumber: 'DU-BCOM-2021-302',
        universityName: 'Delhi University',
        degreeType: 'Bachelor of Commerce (B.Com)',
        programCourse: 'Accounting & Taxation',
        completionYear: 2021,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. Anita Singh',
        designation: 'Head of Commerce Dept.',
        remarks: 'Certificate verified with 100% OCR match accuracy.',
        block: 1143,
        timestamp: new Date('2024-07-05').toLocaleString(),
        hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d906'
      },
      {
        studentName: 'Amit Joshi',
        rollNumber: 'NIT-KKR-EE-2022-089',
        universityName: 'NIT Kurukshetra',
        degreeType: 'Bachelor of Technology (B.Tech)',
        programCourse: 'Electrical Engineering',
        completionYear: 2022,
        verificationStatus: 'Verified',
        verifiedBy: 'Prof. V. Bhatnagar',
        designation: 'Controller of Examination',
        remarks: 'Blockchain record sealed. Credential is tamper-proof.',
        block: 1188,
        timestamp: new Date('2024-07-12').toLocaleString(),
        hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
      },
      {
        studentName: 'Sneha Iyer',
        rollNumber: 'ANNA-BARCH-2020-056',
        universityName: 'Anna University',
        degreeType: 'Bachelor of Architecture (B.Arch)',
        programCourse: 'Urban Design & Architecture',
        completionYear: 2020,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. P. Selvam',
        designation: 'Director of Academics',
        remarks: 'OCR scan and candidate signature validated.',
        block: 1211,
        timestamp: new Date('2024-07-19').toLocaleString(),
        hash: 'aec070645fe53ee3b3763059376134f058cc337247c978add178b4fdfb0af926'
      },
      {
        studentName: 'Mohammed Farouk',
        rollNumber: 'AMU-LLB-2023-011',
        universityName: 'Aligarh Muslim University',
        degreeType: 'Bachelor of Laws (LLB)',
        programCourse: 'Constitutional & Corporate Law',
        completionYear: 2023,
        verificationStatus: 'Verified',
        verifiedBy: 'Prof. Iftikhar Ahmad',
        designation: 'Registrar',
        remarks: 'Legal degree verified and published on distributed ledger.',
        block: 1256,
        timestamp: new Date('2024-07-25').toLocaleString(),
        hash: '3973e022e93220f9212755de42d62c8fb68b7ca3a98694cce84b7f67e06de1a'
      },
      {
        studentName: 'Divya Menon',
        rollNumber: 'CUSAT-MSC-2022-774',
        universityName: 'CUSAT Kerala',
        degreeType: 'Master of Science (M.Sc)',
        programCourse: 'Data Science & AI',
        completionYear: 2022,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. S. Krishnan',
        designation: 'Associate Dean',
        remarks: 'Postgraduate credential verified via automated pipeline.',
        block: 1299,
        timestamp: new Date('2024-08-01').toLocaleString(),
        hash: 'f4c9f5e6a59a34c5e06bae0e56c6b6f4c9f5e6a59a34c5e06bae0e56c6b6f4'
      },
      {
        studentName: 'Rohan Gupta',
        rollNumber: 'VIT-MBA-2021-183',
        universityName: 'VIT University',
        degreeType: 'Master of Business Admin (MBA)',
        programCourse: 'Marketing & Strategy',
        completionYear: 2021,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. G. Viswanathan',
        designation: 'Chancellor Office',
        remarks: 'MBA degree details verified and hash committed to chain.',
        block: 1332,
        timestamp: new Date('2024-08-10').toLocaleString(),
        hash: '1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014'
      },
      {
        studentName: 'Kavita Nair',
        rollNumber: 'KERALA-MBBS-2024-021',
        universityName: 'Kerala Medical College',
        degreeType: 'Bachelor of Medicine (MBBS)',
        programCourse: 'General Medicine',
        completionYear: 2024,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. Thomas Mathew',
        designation: 'Director of Academics',
        remarks: 'Medical degree credential validated and indexed on chain.',
        block: 1378,
        timestamp: new Date('2024-08-20').toLocaleString(),
        hash: '8d9408c5b9a4da3d8fc5e3e7b5e9f8c2a1b3d4e5f6a7b8c9d0e1f2a3b4c5d6'
      },
      {
        studentName: 'Sandeep Rawat',
        rollNumber: 'SRM-BTECH-2023-419',
        universityName: 'SRM University',
        degreeType: 'Bachelor of Technology (B.Tech)',
        programCourse: 'Information Technology',
        completionYear: 2023,
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. R. Bhuvaneswaran',
        designation: 'Vice-Chancellor Office',
        remarks: 'Certificate OCR matched with 98.7% confidence. Accepted.',
        block: 1421,
        timestamp: new Date('2024-09-02').toLocaleString(),
        hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39'
      }
    ];
    saveCertificates(defaultCerts);
    localStorage.setItem('ledger_version', LEDGER_VERSION);
};
