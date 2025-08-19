// Integration test script for Form Builder API
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🚀 Starting Form Builder API Integration Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Get Forms
    console.log('\n2. Testing Get Forms...');
    const formsResponse = await axios.get(`${API_BASE}/forms`);
    console.log('✅ Get forms passed. Found', formsResponse.data.data.length, 'forms');

    // Test 3: Create Form
    console.log('\n3. Testing Create Form...');
    const newForm = {
      title: 'Test Form',
      description: 'This is a test form created by integration test',
      fields: [
        {
          id: 'field_1',
          type: 'text',
          label: 'Name',
          placeholder: 'Enter your name',
          required: true,
          order: 0
        },
        {
          id: 'field_2',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          required: true,
          order: 1
        }
      ],
      settings: {
        allowMultipleSubmissions: true,
        requireAuth: false,
        isPublic: true,
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!'
      },
      status: 'draft'
    };

    const createResponse = await axios.post(`${API_BASE}/forms`, newForm);
    console.log('✅ Create form passed. Form ID:', createResponse.data.data._id);
    const formId = createResponse.data.data._id;

    // Test 4: Get Single Form
    console.log('\n4. Testing Get Single Form...');
    const singleFormResponse = await axios.get(`${API_BASE}/forms/${formId}`);
    console.log('✅ Get single form passed. Title:', singleFormResponse.data.data.title);

    // Test 5: Update Form
    console.log('\n5. Testing Update Form...');
    const updatedForm = {
      ...newForm,
      title: 'Updated Test Form',
      status: 'published'
    };
    const updateResponse = await axios.put(`${API_BASE}/forms/${formId}`, updatedForm);
    console.log('✅ Update form passed. New title:', updateResponse.data.data.title);

    // Test 6: Duplicate Form
    console.log('\n6. Testing Duplicate Form...');
    const duplicateResponse = await axios.post(`${API_BASE}/forms/${formId}/duplicate`);
    console.log('✅ Duplicate form passed. New form ID:', duplicateResponse.data.data._id);

    // Test 7: Get Analytics
    console.log('\n7. Testing Get Analytics...');
    const analyticsResponse = await axios.get(`${API_BASE}/forms/${formId}/analytics`);
    console.log('✅ Get analytics passed. Total submissions:', analyticsResponse.data.data.totalSubmissions);

    console.log('\n🎉 All tests passed! Form Builder API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
