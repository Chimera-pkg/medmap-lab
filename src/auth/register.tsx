import React from "react";
import { AuthPage } from "@refinedev/antd";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";

const Register: React.FC = () => {
  return (
    <AuthPage
      type="register"
      providers={[
        {
          name: "google",
          label: "Sign in with Google",
          icon: (
            <GoogleOutlined
              style={{
                fontSize: 24,
                lineHeight: 0,
              }}
            />
          ),
        },
        {
          name: "github",
          label: "Sign in with GitHub",
          icon: (
            <GithubOutlined
              style={{
                fontSize: 24,
                lineHeight: 0,
              }}
            />
          ),
        },
      ]}
    />
  );
};

export default Register;