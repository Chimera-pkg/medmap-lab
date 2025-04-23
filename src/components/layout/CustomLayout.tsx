import React, { useMemo } from "react";
import { Grid, Layout as AntdLayout } from "antd";

import { ThemedSiderV2 as DefaultSider } from "./sider";
import { Header as DefaultHeader } from "./header";
import type { RefineThemedLayoutV2Props as BaseRefineThemedLayoutV2Props } from "@refinedev/antd";

export type RefineThemedLayoutV2Props = BaseRefineThemedLayoutV2Props;
import { ThemedLayoutContextProvider } from "@refinedev/antd";

export const CustomLayout: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
  onSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender =  DefaultHeader;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;
  const hasSider = !!SiderToRender({ Title });

  return (
    <ThemedLayoutContextProvider
      initialSiderCollapsed={initialSiderCollapsed}
      onSiderCollapsed={onSiderCollapsed}
    >
      <AntdLayout style={{ minHeight: "100vh" }} hasSider={hasSider}>
        <SiderToRender Title={Title} />
        <AntdLayout>
          <HeaderToRender />
          <AntdLayout.Content>
            <div
              style={{
                minHeight: 360,
                padding: isSmall ? 24 : 12,
              }}
            >
              {children}
            </div>
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};