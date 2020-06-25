import React, { useState, useMemo } from "react";
import classNames from "classnames";
import DWChart from "react-datawrapper-chart";
import TabBar from "components/_shared/TabBar/TabBar";

import "./TabbedView.css";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Frame = ({ tab, isFixedHeight, ...props }) => {
  if (isFixedHeight) {
    return (
      <iframe
        src={tab.url}
        title={tab.frameTitle}
        aria-label={tab.ariaLabel}
        frameBorder="0"
        scrolling="no"
        {...props}
      />
    );
  } else {
    return (
      <DWChart
        src={tab.url}
        title={tab.frameTitle}
        aria-label={tab.ariaLabel}
        frameBorder="0"
        scrolling="no"
        {...props}
      />
    );
  }
};

function TabbedView({ uuid, tabs, height = "auto", background = "#fdfdfc" }) {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const [appHeight, setAppHeight] = useState();
  const appRef = useRef();

  const isFixedHeight = useMemo(() => height !== "auto", [height]);

  useLayoutEffect(() => {
    if (!uuid || isFixedHeight) {
      return;
    }

    const handle = setInterval(async () => {
      if (!appRef.current) return;
      const app = appRef.current;
      setAppHeight(app.clientHeight);
    }, 100);
    return () => {
      clearInterval(handle);
    };
  }, [isFixedHeight, uuid]);

  useEffect(() => {
    if (!appHeight || !uuid) return;

    const command = {
      "set-height": {
        value: `${appHeight}`,
      },
    };
    window.parent.postMessage({ "data-tabs-command": command, "data-tabs-target": uuid }, "*");
  }, [uuid, appHeight]);

  const enumaredTabs = useMemo(() => tabs.map((tab, idx) => ({ ...tab, idx })), [tabs]);
  const selectedTab = enumaredTabs[currentTabIdx];

  if (!selectedTab) return null;

  return (
    <div
      className={classNames("app", isFixedHeight && "app-fixed")}
      ref={appRef}
      style={{ background }}
    >
      <TabBar
        id="datawrapper-switcher"
        tabs={enumaredTabs}
        format={(tab) => tab.title}
        selectedTab={selectedTab}
        onChange={(tab) => {
          setCurrentTabIdx(tab.idx);
        }}
      />

      {enumaredTabs.map((tab) => (
        <Frame
          key={tab.idx}
          tab={tab}
          isFixedHeight={isFixedHeight}
          className={classNames(
            "frame",
            isFixedHeight && "frame-fixed",
            currentTabIdx === tab.idx && "is-selected"
          )}
        />
      ))}
    </div>
  );
}

export default TabbedView;
