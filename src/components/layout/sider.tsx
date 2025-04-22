import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined, LogoutOutlined } from "@ant-design/icons";
import { useMenu, useLogout, useTranslate } from "@refinedev/core";
import type { RefineThemedLayoutV2SiderProps } from "@refinedev/antd";


export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title,
}) => {
  const { menuItems, selectedKey } = useMenu();
  const { mutate: logout } = useLogout();
  const translate = useTranslate();

  return (
    <Layout.Sider collapsible>
      <div style={{ padding: "16px", textAlign: "center" }}>
        {/* {Title && <Title />} */}
      </div>
      <Menu
        selectedKeys={[selectedKey]}
        mode="inline"
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: translate("dashboard.title", "Dashboard"),
          },
          ...menuItems,
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: translate("buttons.logout", "Logout"),
            onClick: () => logout(),
          },
        ]}
      />
    </Layout.Sider>
  );
};