const API_BASE_URL = 'http://localhost:5000/api';

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser(name, email, password, role) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || (data.errors ? data.errors[0].msg : 'Registration failed'));
  }
  return data;
}

export async function verifyCertificate(token, formData) {
  const response = await fetch(`${API_BASE_URL}/recruiter/verify-certificate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      studentName: formData.studentName,
      enrollmentNumber: formData.rollNumber,
      degreeType: formData.degreeType,
      universityName: formData.universityName,
      completionYear: formData.completionYear
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Verification failed');
  }
  return data;
}
