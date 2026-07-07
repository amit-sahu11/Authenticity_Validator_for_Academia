// utils/matching.js
const calculateMatchScore = (queryData, certificateData) => {
  let totalScore = 0;
  let weightedFields = 0;

  // Weights for different fields
  const weights = {
    studentName: 0.25,
    enrollmentNumber: 0.25,
    degreeType: 0.15,
    universityName: 0.15,
    collegeName: 0.1,
    completionYear: 0.1,
  };

  // Name matching (fuzzy)
  if (queryData.studentName && certificateData.studentName) {
    const nameMatch = fuzzyMatch(
      queryData.studentName.toLowerCase(),
      certificateData.studentName.toLowerCase()
    );
    totalScore += nameMatch * weights.studentName;
    weightedFields += weights.studentName;
  }

  // Enrollment number (exact)
  if (queryData.enrollmentNumber && certificateData.enrollmentNumber) {
    const exact =
      queryData.enrollmentNumber === certificateData.enrollmentNumber ? 100 : 0;
    totalScore += exact * weights.enrollmentNumber;
    weightedFields += weights.enrollmentNumber;
  }

  // Degree type (exact)
  if (queryData.degreeType && certificateData.degreeType) {
    const exact = queryData.degreeType === certificateData.degreeType ? 100 : 0;
    totalScore += exact * weights.degreeType;
    weightedFields += weights.degreeType;
  }

  // University (partial match)
  if (queryData.universityName && certificateData.universityName) {
    const match = partialMatch(
      queryData.universityName.toLowerCase(),
      certificateData.universityName.toLowerCase()
    );
    totalScore += match * weights.universityName;
    weightedFields += weights.universityName;
  }

  // College (partial match)
  if (queryData.collegeName && certificateData.collegeName) {
    const match = partialMatch(
      queryData.collegeName.toLowerCase(),
      certificateData.collegeName.toLowerCase()
    );
    totalScore += match * weights.collegeName;
    weightedFields += weights.collegeName;
  }

  // Year (exact)
  if (queryData.completionYear && certificateData.completionYear) {
    const exact =
      parseInt(queryData.completionYear) === certificateData.completionYear ? 100 : 0;
    totalScore += exact * weights.completionYear;
    weightedFields += weights.completionYear;
  }

  return weightedFields > 0 ? Math.round((totalScore / weightedFields) * 100) : 0;
};

const fuzzyMatch = (str1, str2) => {
  // Levenshtein distance based matching
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  return maxLen > 0 ? Math.round(((maxLen - distance) / maxLen) * 100) : 0;
};

const partialMatch = (str1, str2) => {
  if (str1.includes(str2) || str2.includes(str1)) return 100;
  if (
    str1.split(' ').some((word) => str2.includes(word)) ||
    str2.split(' ').some((word) => str1.includes(word))
  ) {
    return 80;
  }
  return fuzzyMatch(str1, str2);
};

const levenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

module.exports = { calculateMatchScore, fuzzyMatch, partialMatch };
