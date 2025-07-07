import {
  GitHubBanner,
  Refine,
  type AuthProvider,
  Authenticated,
  OnErrorResponse,
} from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
  RefineThemes,
} from "@refinedev/antd";
import {
  TableOutlined,
  FileAddOutlined,
  FileTextOutlined,
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

import { PostList, PostEdit, PostShow, PostCreate, BatchUpload } from "./pages/labTest";
import { DashboardPage } from "./pages/dashboard";
import PdfViewer from "./pages/viewers/pdf-viewer";
import Hl7Viewer from "./pages/viewers/hl7-viewer";
import Login from "./auth/login";
import Register from "./auth/register";
import { API_URL } from "./config";
import { CustomLayout } from "./components/layout/Layout";
import { WebApiList } from "./pages/webApi";
import { WebApiDocumentation } from "./pages/webApi/documentation";



const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
      try {
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
      const name = localStorage.getItem("userName");
      if (token) {
        return {
          id: 1,
          name: name || "User",
          avatar: "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
        };
      }
      return null;
    },
    getPermissions: async () => null,
    onError: function (error: any): Promise<OnErrorResponse> {
      throw new Error("Function not implemented.");
    }
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider(API_URL)}
            routerProvider={routerProvider}
            resources={[
           
              {
                name: "lab-tests",
                list: "/lab-tests",
                show: "/lab-tests/show/:id",
                edit: "/lab-tests/edit/:id",
                create: "/lab-tests/create",
                icon: <FileAddOutlined />,
              },
              {
                name: "web-api",
                list: "/web-api",
                show: "/web-api/documentation",
                meta: {
                  label: "Web API", // Pastikan tidak ada spasi tambahan atau karakter yang tidak terlihat
                  icon: <FileTextOutlined />,
                },
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
                    <CustomLayout>
                      <Outlet />
                    </CustomLayout>
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
                  <Route path="batch-upload" element={<BatchUpload />} />
                </Route>
                {/* WEB API PATH */}
                <Route path="/web-api" element={<WebApiList />} />
                  <Route index element={<PostList />} />

              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/web-api/documentation" element={<WebApiDocumentation />} />
              

              <Route
                element={
                  <Authenticated key="catch-all">
                    <CustomLayout>
                      <Outlet />
                    </CustomLayout>
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