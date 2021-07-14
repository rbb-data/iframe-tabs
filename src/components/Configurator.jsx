import React, { useEffect } from "react";
import { useState, useCallback, useRef, useMemo } from "react";
import { AllHtmlEntities as Entities } from "html-entities";
import { v4 as uuidv4 } from "uuid";

import TabbedView from "./TabbedView";
import frameResizerScript from "lib/frameResizer";

import "./Configurator.css";

/**
 * Returns a script that takes care of resizing this particular embed (identified
 * by the uuid) in its parent element.
 */
const makeResizerScript = (uuid) => {
  const script = frameResizerScript
    .toString()
    .replace("%%uuid%%", uuid)
    .replace(/\n/g, "")
    .replace(/ {4}/g, "");
  return `<script type="text/javascript">(${script})();</script>`;
};

const FALLBACK_HEIGHT = 600;
const makeEmbedCode = (uuid, url, title, height) => {
  return `<iframe id="data-tabs-${uuid}" title="${title}" aria-label="Tab-Übersicht: ${title}" src="${url}" scrolling="no" frameborder="0" width="100%" style="border: none; transition: height 0.2s ease-in-out;" height="${
    height || FALLBACK_HEIGHT
  }"></iframe>${!height ? makeResizerScript(uuid) : ""}`;
};

const NAVIGATION = [
  // use tabs to switch datawrapper charts
  { id: 'tabs', label: 'Tabs' },
  // use a slider to switch datawrapper charts
  { id: 'slider', label: 'Slider' },
  // use a range slider to switch datawrapper charts
  { id: 'range-slider', label: 'Range Slider' }
];

/**
 * Given the URL or Embed code of an existing datawrapper-switcher, this
 * function returns the configuration used to create that switcher
 */
const parseEmbedCode = (embedCode) => {
  // we use a hash for the route so we need to remove it so can be parsed as a URL
  const rawUrl = embedCode.match(/https?:\/\/[^"]*/)[0].replace("/#/view?", "/view?");
  const url = new URL(rawUrl);
  const titles = url.searchParams.getAll("title");
  const urls = url.searchParams.getAll("url");
  const frameTitles = url.searchParams.getAll("frameTitle");
  const ariaLabels = url.searchParams.getAll("ariaLabel");
  const background = url.searchParams.get("background");
  const height = url.searchParams.get("height");
  const type = url.searchParams.get("type") || "tabs";
  const embedTitle = embedCode.match(/title="(.*?)"/) != null ? embedCode.match(/title="(.*?)"/)[1] : 'Tab-Übersicht'
  const tabs = titles.map((title, i) => ({
    title,
    url: urls[i],
    frameTitle: frameTitles[i],
    ariaLabel: ariaLabels[i],
  }));
  return {
    tabs,
    title: embedTitle,
    height: height !== "auto" ? Number(height) : FALLBACK_HEIGHT,
    background,
    type,
  };
};

const parseDatawrapperEmbedCode = (embedCode) => {
  const url = embedCode.match(/<iframe[^>]*src="(.*?)"/)[1];
  const frameTitle = Entities.decode(
    Entities.decode(embedCode.match(/<iframe[^>]*title="(.*?)"/)[1])
  );
  const ariaLabel = Entities.decode(
    Entities.decode(embedCode.match(/<iframe[^>]*aria-label="(.*?)"/)[1])
  );

  return {
    url,
    frameTitle,
    ariaLabel,
  };
};

function Configurator() {
  const [tabs, setTabs] = useState([]);
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedHeight, setEmbedHeight] = useState(null);
  const [embedBackground, setEmbedBackground] = useState(null);
  const [navigationType, setNavigationType] = useState(NAVIGATION[0].id);

  const viewRef = useRef();

  const embedTitleRef = useRef();
  const embedHeightRef = useRef();
  const embedBackgroundRef = useRef();
  const embedRef = useRef();

  const importCallback = useCallback(() => {
    const embedCodeOrURL = window.prompt("Gib deinen existierenden Embed-Code hier ein:")
    if (embedCodeOrURL == null) return // do nothing if the user aborted

    const { tabs, title, height, background, type } = parseEmbedCode(embedCodeOrURL);
    setTabs(tabs);
    embedTitleRef.current.value = title;
    setEmbedTitle(title);
    embedHeightRef.current.value = height;
    setEmbedHeight(height);
    if (background) {
      embedBackgroundRef.current.value = background;
      setEmbedBackground(background);
    }
    setNavigationType(type);
  }, []);

  const newTabCallback = useCallback(() => {
    const title = window.prompt("Titel des Tabs:");
    if (title === null) return;

    const embedCode = window.prompt("Datawrapper Embed-Code:");
    if (embedCode === null) return;

    const newTab = {
      ...parseDatawrapperEmbedCode(embedCode),
      title,
    };
    setTabs(tabs.concat([newTab]));
  }, [tabs]);

  const editTabTitleCallback = useCallback(
    (tab) =>
      setTabs(
        tabs.map((t) =>
          t !== tab
            ? t
            : {
                ...tab,
                title: window.prompt("Neuen Titel eingeben:", tab.title) || tab.title,
              }
        )
      ),
    [tabs]
  );
  const editTabUrlCallback = useCallback(
    (tab) =>
      setTabs(
        tabs.map((t) =>
          t !== tab
            ? t
            : {
                ...tab,
                url: window.prompt("Neue URL eingeben:", tab.url) || tab.url,
              }
        )
      ),
    [tabs]
  );
  const editTabFrameTitleCallback = useCallback(
    (tab) =>
      setTabs(
        tabs.map((t) =>
          t !== tab
            ? t
            : {
                ...tab,
                frameTitle:
                  window.prompt("Neuen iframe-title eingeben:", tab.frameTitle) || tab.frameTitle,
              }
        )
      ),
    [tabs]
  );
  const editTabAriaLabelCallback = useCallback(
    (tab) =>
      setTabs(
        tabs.map((t) =>
          t !== tab
            ? t
            : {
                ...tab,
                ariaLabel:
                  window.prompt("Neues aria-label eingeben:", tab.ariaLabel) || tab.ariaLabel,
              }
        )
      ),
    [tabs]
  );
  const removeTabCallback = useCallback((tab) => setTabs(tabs.filter((t) => t !== tab)), [tabs]);
  const moveTabUp = useCallback(
    (i) => {
      const copy = Array(...tabs);
      copy.splice(i - 1, 0, copy.splice(i, 1)[0]);
      setTabs(copy);
    },
    [tabs]
  );
  const moveTabDown = useCallback(
    (i) => {
      const copy = Array(...tabs);
      copy.splice(i + 1, 0, copy.splice(i, 1)[0]);
      setTabs(copy);
    },
    [tabs]
  );

  const copyViewUrlCallback = useCallback(() => {
    viewRef.current.select();
    document.execCommand("copy");
  }, []);

  const copyEmbedCodeCallback = useCallback(() => {
    embedRef.current.select();
    document.execCommand("copy");
  }, []);

  const uuid = useMemo(uuidv4, [tabs, embedTitle, embedHeight]);

  const viewUrl = useMemo(() => {
    const url = new URL(`${process.env.PUBLIC_URL}/view`, window.location.origin);
    url.searchParams.append("uuid", uuid);
    url.searchParams.append("type", navigationType)
    for (const tab of tabs) {
      url.searchParams.append("title", tab.title);
      url.searchParams.append("url", tab.url);
      url.searchParams.append("frameTitle", tab.frameTitle);
      url.searchParams.append("ariaLabel", tab.ariaLabel);
    }
    if (embedBackground) {
      url.searchParams.append("background", embedBackground);
    }

    url.searchParams.append("height", embedHeight || "auto");

    // since we use the hash router we need to fix the url here.
    // we could also build it differently but for now this change is easier
    return url.toString().replace("/view?", "/#/view?");
  }, [embedBackground, embedHeight, tabs, uuid, navigationType]);

  const embedCode = useMemo(() => makeEmbedCode(uuid, viewUrl, embedTitle, embedHeight), [
    uuid,
    viewUrl,
    embedTitle,
    embedHeight,
  ]);
  useEffect(() => {
    embedRef.current.value = embedCode;
  }, [embedCode]);

  return (
    <div className="new">
      <div className="new_config">
        <div className="new_config_new-tab">
          <button onClick={importCallback}>Importieren</button>
          <button onClick={newTabCallback}>Neuer Tab</button>
        </div>
        <div>
          <h3 className="break">Navigation</h3>
          {NAVIGATION.map((nav) => (
            <label key={nav.id}>
              <input
                type="radio"
                name="select-navigation-type"
                value={nav.id}
                checked={nav.id === navigationType}
                onChange={(e) => setNavigationType(e.target.value)}
              />
              {nav.label}
            </label>
          ))}
        </div>
        <div className="new_config_tabs">
          <h3 className="break">Tabs</h3>
          {tabs.map((tab, i) => (
            <div key={i} className="new_config_tab-item">
              <div className="new_config_tab-item_attr">
                <button onClick={() => editTabTitleCallback(tab)}>✏</button>
                <span>Tab-Titel:</span> <span>{tab.title}</span>
              </div>
              <div className="new_config_tab-item_attr">
                <button onClick={() => editTabUrlCallback(tab)}>✏</button>
                <span>
                  <code>iframe src:</code>
                </span>{" "}
                <span>
                  <a href={tab.url} target="_blank" rel="noopener noreferrer">
                    {tab.url}
                  </a>
                </span>
              </div>
              <div className="new_config_tab-item_attr">
                <button onClick={() => editTabFrameTitleCallback(tab)}>✏</button>
                <span>
                  <code>iframe title:</code>
                </span>{" "}
                <span>{tab.frameTitle}</span>
              </div>
              <div className="new_config_tab-item_attr">
                <button onClick={() => editTabAriaLabelCallback(tab)}>✏</button>
                <span>
                  <code>iframe aria-label:</code>
                </span>{" "}
                <span>{tab.ariaLabel}</span>
              </div>

              <div className="new_config_tab-item_controls">
                <button onClick={() => moveTabUp(i)} disabled={i === 0}>
                  ⬆
                </button>
                <button onClick={() => moveTabDown(i)} disabled={i === tabs.length - 1}>
                  ⬇
                </button>
                <button onClick={() => removeTabCallback(tab)}>
                  <span role="img" aria-label="Löschen">
                    ❌
                  </span>
                </button>
              </div>
            </div>
          ))}
          <div className="new_config_tab-url">
            <h3 className="break">Direkte URL</h3>
            <input
              type="url"
              readOnly
              ref={viewRef}
              className="new_config_tab-url-field"
              value={viewUrl}
            />
            <button onClick={copyViewUrlCallback} title="Kopieren">
              <span role="img" aria-label="Kopieren">
                📝
              </span>
            </button>
          </div>
          <div className="new_config_tab-embed">
            <h3 className="break">Embed-Code</h3>
            <input
              ref={embedTitleRef}
              onChange={(ev) => setEmbedTitle(ev.currentTarget.value)}
              type="text"
              aria-label="Titel"
              placeholder="Titel (für Barrierefreiheit etc.)"
            />
            <div className="break" />
            <input
              ref={embedHeightRef}
              onChange={(ev) => setEmbedHeight(ev.currentTarget.value)}
              type="number"
              aria-label="Höhe (pixel)"
              placeholder="Höhe (pixel)"
            />
            <div className="break" />
            <input
              ref={embedBackgroundRef}
              onChange={(ev) => setEmbedBackground(ev.currentTarget.value)}
              type="text"
              aria-label="Hintergrund"
              placeholder="Hintergrund"
            />
            <div className="break" />
            <textarea ref={embedRef} className="new_config_tab-embed-area"></textarea>
            <button onClick={copyEmbedCodeCallback} title="Kopieren">
              <span role="img" aria-label="Kopieren">
                📝
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="new_preview">
        <div className="preview_overflow">
          <TabbedView
            tabs={tabs}
            height={embedHeight ? embedHeight : undefined}
            background={embedBackground || undefined}
            type={navigationType}
          />
        </div>
      </div>
    </div>
  );
}

export default Configurator;
