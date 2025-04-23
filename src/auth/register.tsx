import React, { useState } from "react";
import { UserOutlined, LockOutlined, MailOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { API_URL } from "../config";
import { Alert, Button, Form, Input, notification } from "antd";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const handleRegister = async (values: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string; 
  }) => {
    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log("Attempting registration with:", values.email);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: values.name,
          email: values.email, 
          password: values.password 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      notification.success({
        message: "Registration Successful",
        description: "Your account has been created successfully. You can now log in.",
        duration: 3
      });
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="lg:block w-1/2">
        <img
          src="/hospital_image.png"
          alt="Hospital"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6" style={{ maxWidth: "500px" }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign up to access the healthcare portal.
            </p>
          </div>
          
          {error && (
            <Alert
              message="Registration Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
            />
          )}
          
          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            size="large"
            scrollToFirstError
          >
            {/* Full Name */}
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="John Doe" 
                className="rounded-lg"
              />
            </Form.Item>
            
            {/* Email */}
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email address" }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="site-form-item-icon" />} 
                placeholder="you@example.com" 
                className="rounded-lg"
              />
            </Form.Item>
            
            {/* Password */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            
            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The two passwords do not match!"));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            
            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-10 bg-[#A51424] hover:bg-[#86121d] rounded-full"
                style={{ background: "#A51424", borderColor: "#A51424" }}
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </Form.Item>
          </Form>
          
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;