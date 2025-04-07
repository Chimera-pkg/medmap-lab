import {
  GitHubBanner,
  Refine,
  type AuthProvider,
  Authenticated,
} from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
  AuthPage,
  RefineThemes,
} from "@refinedev/antd";
import {
  GoogleOutlined,
  GithubOutlined,
  DashboardOutlined,
  UserOutlined,
  ScheduleFilled,
  FileAddFilled,
  MessageFilled,
  DiffOutlined,
  TableOutlined,
  ScheduleOutlined,
  FileAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { App as AntdApp, ConfigProvider } from "antd";

import "@refinedev/antd/dist/reset.css";

import { PostList, PostEdit, PostShow, PostCreate } from "./pages/labTest";
import { DashboardPage } from "../src/pages/dashboard";
import PdfViewer from "./pages/viewers/pdf-viewer";
import Hl7Viewer from "./pages/viewers/hl7-viewer";

const API_URL = "http://localhost:3333/v1";


/**
 *  mock auth credentials to simulate authentication
 */
const authCredentials = {
  email: "demo@refine.dev",
  password: "demodemo",
};

const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
      try {
        // Make a POST request to the login endpoint
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error("Login failed");
        }
  
        const { token } = await response.json();
  
        // Store the token in localStorage
        localStorage.setItem("authToken", token);
  
        return {
          success: true,
          redirectTo: "/",
        };
      } catch (error) {
        return {
          success: false,
          error: {
            message: "Login failed",
            name: "Invalid email or password",
          },
        };
      }
    },
    logout: async () => {
      // Remove the token from localStorage
      localStorage.removeItem("authToken");
      return {
        success: true,
        redirectTo: "/auth/login",
      };
    },
    check: async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        return {
          authenticated: true,
        };
      }
      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/auth/login",
      };
    },
    getIdentity: async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Optionally, decode the token or fetch user details
        return {
          id: 1,
          name: "Jane Doe",
          avatar:
            "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
        };
      }
      return null;
    },
    getPermissions: async () => null,
    onError: async (error) => {
      console.error("AuthProvider Error:", error);
      return Promise.resolve({
        success: false,
        error: {
          message: "An error occurred",
          name: "AuthProviderError",
        },
      });
    },
  };

  return (
    <BrowserRouter>
      <GitHubBanner />
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider(API_URL)}
            routerProvider={routerProvider}
            resources={[
              {
                name: "Overview",
                list: "/",
                meta: {
                  label: "Overview",
                  icon: <TableOutlined />,
                },
              },
              // {
              //   name: "cases",
              //   list: "/posts",
              //   show: "/posts/show/:id",
              //   edit: "/posts/edit/:id",
              //   icon: <DiffOutlined />,

              // },
              // {
              //   name: "patient",
              //   list: "/posts",
              //   show: "/posts/show/:id",
              //   edit: "/posts/edit/:id",
              //   icon: <UserOutlined />,

              // },
              // {
              //   name: "schedule",
              //   list: "/posts",
              //   show: "/posts/show/:id",
              //   edit: "/posts/edit/:id",
              //   icon: <ScheduleOutlined />,

              // },
              // {
              //   name: "reports",
              //   list: "/posts",
              //   show: "/posts/show/:id",
              //   edit: "/posts/edit/:id",
              //   icon: <FileAddOutlined />,

              // },
              // {
              //   name: "messages",
              //   list: "/posts",
              //   show: "/posts/show/:id",
              //   edit: "/posts/edit/:id",
              //   icon: <MessageOutlined />,
              // },
              {
                name: "lab-tests",
                list: "/lab-tests",
                show: "/lab-tests/show/:id",
                edit: "/lab-tests/edit/:id",
                create: "/lab-tests/create",
                icon: <FileAddOutlined />,
              },
              
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="/pdf-viewer" element={<PdfViewer />} />
                <Route path="/hl7-viewer" element={<Hl7Viewer />} />

                <Route path="/lab-tests">
                  <Route index element={<PostList />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                  <Route path="create" element={<PostCreate />} />
                  
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
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
                  }
                />
                <Route
                  path="/register"
                  element={
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
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
