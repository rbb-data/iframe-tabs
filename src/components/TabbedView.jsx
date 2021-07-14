import React, { useState, useMemo } from "react";
import classNames from "classnames";
import DWChart from "react-datawrapper-chart";
import TabBar from "components/_shared/TabBar/TabBar";
import Slider from "components/_shared/Slider/Slider"
import RangeSlider from "components/_shared/RangeSlider/RangeSlider"

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
        loading="lazy"
        {...props}
      />
    );
  }
};

function Navigation({ tabs, currentTabIdx, setCurrentTabIdx, type = "tabs", className = "nav" }) {
  const selectedTab = tabs[currentTabIdx];
  if (!selectedTab) return null;

  switch (type) {
    case 'tabs':
      return (
        <TabBar
          id="datawrapper-switcher"
          className={className}
          tabs={tabs}
          format={(tab) => tab.title}
          selectedTab={selectedTab}
          onChange={(tab) => {
            setCurrentTabIdx(tab.idx);
          }}
        />
      )
    
    case 'slider':
      const getTab = (idx) => (idx >= 0 && idx < tabs.length) ? tabs[idx] : null;
      const prevTab = getTab(currentTabIdx - 1);
      const nextTab = getTab(currentTabIdx + 1);
          
      // this is what is rendered as tab title
      const tabTitle = (tab) => tab ? <span className="slider--tab-title">{tab.title}</span> : null
      
      return (
        <Slider
          onBackwardNavigation={() => { setCurrentTabIdx(prevTab.idx) }}
          onForwardNavigation={() => { setCurrentTabIdx(nextTab.idx) }}
          className={className}
        >
          {() => tabTitle(prevTab)}
          {() => tabTitle(selectedTab)}
          {() => tabTitle(nextTab)}
        </Slider>
      )

    case 'range-slider':
      return (
        <RangeSlider
          id="datawrapper-switcher"
          className={className}
          items={tabs}
          getValue={(tab) => +tab.title}
          format={(tab) => tab.title}
          selectedItem={selectedTab}
          onChange={(tab) => {
            setCurrentTabIdx(tab.idx);
          }}
        />
      )
    
    default:
      return <></>;
  }
}

function TabbedView({ uuid, tabs, type = "tabs", height = "auto", background = "#fff" }) {
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

  const enumeratedTabs = useMemo(() => tabs.map((tab, idx) => ({ ...tab, idx })), [tabs]);

  return (
    <div
      className={classNames("app", isFixedHeight && "app-fixed")}
      ref={appRef}
      style={{ background }}
    >
      <Navigation
        tabs={enumeratedTabs}
        currentTabIdx={currentTabIdx}
        setCurrentTabIdx={setCurrentTabIdx}
        type={type}
      />

      <div className="panel-container">
        {enumeratedTabs.map((tab) => (
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
    </div>
  );
}

export default TabbedView;
