#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time

class TeamacyAPITester:
    def __init__(self, base_url="https://teamacy-pro.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details="", response_data=None):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test_name": name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_admin_token=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if use_admin_token and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif self.token and not use_admin_token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            response_data = None
            
            try:
                response_data = response.json()
            except:
                response_data = response.text

            if success:
                self.log_test(name, True, f"Status: {response.status_code}", response_data)
                return True, response_data
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {response_data}", response_data)
                return False, response_data

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_api_health(self):
        """Test API health endpoint"""
        print("\n🔍 Testing API Health...")
        return self.run_test("API Health Check", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        test_user_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"testuser_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True, test_user_data
        return False, test_user_data

    def test_user_login(self, user_data):
        """Test user login"""
        print("\n🔍 Testing User Login...")
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        print("\n🔍 Testing Admin Login...")
        admin_data = {
            "email": "teamacyadmin@gmail.com",
            "password": "teamacysdg"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            if response.get('user', {}).get('role') == 'admin':
                self.log_test("Admin Role Verification", True, "Admin role confirmed")
                return True
            else:
                self.log_test("Admin Role Verification", False, "Admin role not found in response")
                return False
        return False

    def test_enquiry_submission(self):
        """Test enquiry form submission"""
        print("\n🔍 Testing Enquiry Submission...")
        enquiry_data = {
            "name": "Test Customer",
            "email": "customer@example.com",
            "subject": "Software Development Inquiry",
            "message": "I'm interested in your software development services. Please visit https://example.com for more details."
        }
        
        success, response = self.run_test(
            "Enquiry Submission",
            "POST",
            "enquiries",
            200,
            data=enquiry_data
        )
        
        if success:
            # Wait a moment for email processing
            time.sleep(2)
            return True, response.get('id')
        return False, None

    def test_feedback_submission(self):
        """Test feedback form submission"""
        print("\n🔍 Testing Feedback Submission...")
        feedback_data = {
            "name": "Happy Client",
            "email": "client@example.com",
            "subject": "Great Service",
            "message": "Your team did an excellent job on our project. Check out our website at https://client-website.com"
        }
        
        success, response = self.run_test(
            "Feedback Submission",
            "POST",
            "feedback",
            200,
            data=feedback_data
        )
        
        if success:
            # Wait a moment for email processing
            time.sleep(2)
            return True, response.get('id')
        return False, None

    def test_admin_enquiries_access(self):
        """Test admin access to enquiries"""
        print("\n🔍 Testing Admin Enquiries Access...")
        return self.run_test(
            "Admin Get Enquiries",
            "GET",
            "enquiries",
            200,
            use_admin_token=True
        )

    def test_admin_feedback_access(self):
        """Test admin access to feedback"""
        print("\n🔍 Testing Admin Feedback Access...")
        return self.run_test(
            "Admin Get Feedback",
            "GET",
            "feedback",
            200,
            use_admin_token=True
        )

    def test_unauthorized_access(self):
        """Test unauthorized access to admin endpoints"""
        print("\n🔍 Testing Unauthorized Access...")
        
        # Test without token
        success1, _ = self.run_test(
            "Enquiries Without Token",
            "GET",
            "enquiries",
            401
        )
        
        # Test with user token (should fail for admin endpoints)
        if self.token:
            success2, _ = self.run_test(
                "Enquiries With User Token",
                "GET",
                "enquiries",
                403,
                headers={'Authorization': f'Bearer {self.token}'}
            )
        else:
            success2 = True  # Skip if no user token
            
        return success1 and success2

    def test_invalid_data(self):
        """Test API with invalid data"""
        print("\n🔍 Testing Invalid Data Handling...")
        
        # Test registration with invalid email
        success1, _ = self.run_test(
            "Registration Invalid Email",
            "POST",
            "auth/register",
            422,
            data={"name": "Test", "email": "invalid-email", "password": "pass"}
        )
        
        # Test login with wrong credentials
        success2, _ = self.run_test(
            "Login Wrong Credentials",
            "POST",
            "auth/login",
            401,
            data={"email": "wrong@email.com", "password": "wrongpass"}
        )
        
        # Test enquiry with missing fields
        success3, _ = self.run_test(
            "Enquiry Missing Fields",
            "POST",
            "enquiries",
            422,
            data={"name": "Test"}
        )
        
        return success1 and success2 and success3

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Teamacy API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)

        # Basic API health
        self.test_api_health()

        # Authentication tests
        user_success, user_data = self.test_user_registration()
        if user_success:
            self.test_user_login(user_data)
        
        admin_success = self.test_admin_login()

        # Form submission tests
        self.test_enquiry_submission()
        self.test_feedback_submission()

        # Admin access tests
        if admin_success:
            self.test_admin_enquiries_access()
            self.test_admin_feedback_access()

        # Security tests
        self.test_unauthorized_access()
        self.test_invalid_data()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

    def get_test_results(self):
        """Get detailed test results"""
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": (self.tests_passed/self.tests_run)*100 if self.tests_run > 0 else 0,
            "test_details": self.test_results
        }

def main():
    tester = TeamacyAPITester()
    exit_code = tester.run_all_tests()
    
    # Save detailed results
    results = tester.get_test_results()
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    return exit_code

if __name__ == "__main__":
    sys.exit(main())