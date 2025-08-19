import React, { useState } from "react";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { API_URL } from "../config";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);
  

  // Updated handleLogin to accept form values directly
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    try {
      console.log("Attempting login with:", values.email);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: values.email, 
          password: values.password 
        }),
      });
      
      if (!response.ok) throw new Error("Login failed");
      
      const { token, user } = await response.json();
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", user.username);
      localStorage.setItem("authToken", token);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setFieldsValue({ email: rememberedEmail });
      setRememberMe(true);
    }
  }, [form]);

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
      
      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6" style={{ maxWidth: "500px" }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Account Login</h2>
            <p className="text-sm text-gray-500 mt-2">
              If you are already a member you can login with your email address and password.
            </p>
          </div>
          
          {error && (
            <Alert
              message="Login Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
            />
          )}
          
          <Form
            form={form}
            name="login"
            initialValues={{ email: "admin@mail.com", password: "admin" }}
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email address"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email address" }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Email" 
                autoComplete="email"
                className="rounded-lg"
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                autoComplete="current-password"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            
            <Form.Item>
              <div className="flex items-center justify-between">
                <Checkbox 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                
                <Link to="/forgot-password" className="text-red-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-10 bg-[#A51424] hover:bg-[#86121d] rounded-full"
                style={{ background: "#A51424", borderColor: "#A51424" }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
          
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-600 hover:underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;