import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="device-phone">
      <div className="screen">
        <div className="island" />
        <div className="status">
          <span>10:41</span>
          <span>▮▮▮ ◠ 80</span>
        </div>
        <div className="screen-body">{children}</div>
        <div className="home" />
      </div>
    </div>
  );
}

export function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <div className="device-tablet">
      <div className="screen">{children}</div>
    </div>
  );
}

export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="device-browser">
      <div className="browser-bar">
        <i />
        <i />
        <i />
        <span className="url">{url}</span>
      </div>
      <div className="screen">{children}</div>
    </div>
  );
}
