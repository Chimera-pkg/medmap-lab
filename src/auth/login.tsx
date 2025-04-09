import React from "react";
import { AuthPage } from "@refinedev/antd";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";

const authCredentials = {
  email: "demo@refine.dev",
  password: "demodemo",
};

const Login: React.FC = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {
          ...authCredentials,
        },
      }}
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

export default Login;