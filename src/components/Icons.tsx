import type { SVGProps } from "react";
import type { CategoryId } from "@/lib/types";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const make = (paths: React.ReactNode, filled = false) =>
  function Icon({ size = 18, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  };

/* Stroke icons (UI chrome) */
export const SearchIcon = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const HomeIcon = make(<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />);
export const GridIcon = make(<><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>);
export const HeartIcon = make(<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />);
export const HeartFilled = make(<path d="M12 20.5s-8-4.8-8-10.7A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8 3c0 5.9-8 10.7-8 10.7z" />, true);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const CodeIcon = make(<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />);
export const ReplayIcon = make(<><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4h4" /></>);
export const CopyIcon = make(<><rect x="8" y="8" width="12" height="12" rx="3" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>);
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const DownloadIcon = make(<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />);
export const ExternalIcon = make(<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />);
export const CloseIcon = make(<path d="M6 6l12 12M18 6 6 18" />);
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h10" />);
export const ChevronLeft = make(<path d="m15 5-7 7 7 7" />);
export const ChevronRight = make(<path d="m9 5 7 7-7 7" />);
export const ChevronDown = make(<path d="m6 9 6 6 6-6" />);
export const ArrowRight = make(<path d="M5 12h14m-5-5 5 5-5 5" />);
export const FilterIcon = make(<path d="M4 6h16M7 12h10M10 18h4" />);
export const MonitorIcon = make(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M9 20h6M12 16v4" /></>);
export const TabletIcon = make(<><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M11 18h2" /></>);
export const PhoneIcon = make(<><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></>);
export const TerminalIcon = make(<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="m7 9 3 3-3 3M13 15h4" /></>);
export const LayersIcon = make(<path d="m12 4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />);
export const GaugeIcon = make(<><path d="M4.5 16a8 8 0 1 1 15 0" /><path d="m12 13 3.5-3.5" /></>);
export const CalendarIcon = make(<><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M9 3v4M15 3v4" /></>);
export const PlayIcon = make(<path d="M8 5.5v13l10.5-6.5z" />, true);
export const WandIcon = make(<path d="m4 20 11-11m2-5v3m-1.5-1.5h3M19 11v2m-1-1h2M8 4v2M7 5h2" />);
export const SparkIcon = make(<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />);
export const KeyboardIcon = make(<><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" /></>);
export const TrashIcon = make(<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />);
export const BookmarkFilled = make(<path d="M7 3h10a2 2 0 0 1 2 2v16l-7-4.5L5 21V5a2 2 0 0 1 2-2z" />, true);
export const BoltIcon = make(<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />);

/* Filled "3D" glyphs for category tiles */
export const LoaderGlyph = make(<><path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5h-3A6.5 6.5 0 1 1 12 5.5z" /><circle cx="12" cy="12" r="2.6" /></>, true);
export const LogoGlyph = make(<path d="M12 2c.6 4.6 2.2 7.4 8 8.2v1.6c-5.8.8-7.4 3.6-8 8.2h-.1c-.6-4.6-2.2-7.4-8-8.2v-1.6c5.8-.8 7.4-3.6 8-8.2z" />, true);
export const CursorGlyph = make(<path d="M5 3.5 19 10l-6 1.8 3.6 6.2-2.6 1.5-3.6-6.2L6 17.5z" />, true);
export const NavGlyph = make(<><rect x="3" y="4" width="18" height="5" rx="2.5" /><rect x="3" y="11" width="11" height="3" rx="1.5" opacity=".7" /><rect x="3" y="16" width="15" height="3" rx="1.5" opacity=".45" /></>, true);
export const HeroGlyph = make(<><rect x="3" y="4" width="18" height="16" rx="3.5" opacity=".35" /><rect x="6" y="8" width="8" height="3" rx="1.5" /><rect x="6" y="13" width="5" height="3" rx="1.5" /><circle cx="16.5" cy="14" r="2.5" /></>, true);
export const FeatureGlyph = make(<><rect x="3" y="3" width="8" height="10" rx="2.5" /><rect x="13" y="3" width="8" height="6" rx="2.5" opacity=".7" /><rect x="13" y="11" width="8" height="10" rx="2.5" /><rect x="3" y="15" width="8" height="6" rx="2.5" opacity=".7" /></>, true);
export const PriceGlyph = make(<path d="M3 11.2V4.5A1.5 1.5 0 0 1 4.5 3h6.7a2 2 0 0 1 1.4.6l8.2 8.2a2 2 0 0 1 0 2.8l-6.6 6.6a2 2 0 0 1-2.8 0L3.6 12.6a2 2 0 0 1-.6-1.4zM8 9.5A1.5 1.5 0 1 0 8 6.5a1.5 1.5 0 0 0 0 3z" fillRule="evenodd" />, true);
export const QuoteGlyph = make(<path d="M4 18v-5.2C4 8.6 6 6 10 5l.8 1.8C8.7 7.6 7.8 9 7.7 11H11v7zm9 0v-5.2C13 8.6 15 6 19 5l.8 1.8c-2.1.8-3 2.2-3.1 4.2H20v7z" />, true);
export const ChartGlyph = make(<><rect x="4" y="12" width="4" height="8" rx="1.6" /><rect x="10" y="7" width="4" height="13" rx="1.6" /><rect x="16" y="3" width="4" height="17" rx="1.6" /></>, true);
export const CtaGlyph = make(<><rect x="2.5" y="7" width="19" height="10" rx="5" /><path d="M9 12h6m-2.2-2.4L15.2 12l-2.4 2.4" stroke="#1a1a1d" strokeWidth="1.8" fill="none" /></>, true);
export const FaqGlyph = make(<path d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 13.3a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm.2-9.6c-2.2 0-3.8 1.2-4 3.3h2.5c.1-.8.7-1.3 1.5-1.3s1.4.5 1.4 1.2c0 .6-.3.9-1.2 1.5-1 .6-1.6 1.3-1.5 2.6v.4h2.4v-.3c0-.7.3-1 1.2-1.6 1-.6 1.8-1.4 1.8-2.8 0-1.8-1.6-3-4.1-3z" fillRule="evenodd" />, true);
export const MailGlyph = make(<path d="M4.5 5h15A2.5 2.5 0 0 1 22 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5zm.3 2.4 7.2 5.2 7.2-5.2" fillRule="evenodd" />, true);
export const CardGlyph = make(<><rect x="5" y="2.5" width="14" height="19" rx="3.5" opacity=".4" transform="rotate(-10 12 12)" /><rect x="5" y="2.5" width="14" height="19" rx="3.5" /></>, true);
export const FooterGlyph = make(<><rect x="3" y="3" width="18" height="18" rx="3.5" opacity=".3" /><rect x="3" y="13" width="18" height="8" rx="3" /></>, true);
export const PageGlyph = make(<><rect x="4" y="2.5" width="16" height="19" rx="3.5" opacity=".35" /><rect x="7" y="6" width="10" height="5" rx="1.5" /><rect x="7" y="13" width="10" height="2" rx="1" /><rect x="7" y="17" width="6" height="2" rx="1" /></>, true);
export const PromptGlyph = make(<path d="M9.5 2.5c.5 3.4 1.7 4.6 5 5v1c-3.3.4-4.5 1.6-5 5h-1c-.5-3.4-1.7-4.6-5-5v-1c3.3-.4 4.5-1.6 5-5zM17 12.5c.3 2.2 1.1 3 3.5 3.3v.9c-2.4.3-3.2 1.1-3.5 3.3h-.9c-.3-2.2-1.1-3-3.5-3.3v-.9c2.4-.3 3.2-1.1 3.5-3.3z" />, true);
export const FavGlyph = make(<path d="M12 21s-8.5-5.1-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.9 12 21 12 21z" />, true);
export const PlayGlyph = make(<path d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zM10 8v8l6.5-4z" fillRule="evenodd" />, true);
export const TextGlyph = make(<path d="M4 4h16v3.5h-2V6h-4.5v12H16V20H8v-2h2.5V6H6v1.5H4z" fillRule="evenodd" />, true);
export const MarqueeGlyph = make(<><rect x="1.5" y="4" width="7" height="7" rx="2" opacity=".4" /><rect x="8.5" y="4" width="7" height="7" rx="2" /><rect x="15.5" y="4" width="7" height="7" rx="2" opacity=".4" /><rect x="5" y="13" width="7" height="7" rx="2" /><rect x="12" y="13" width="7" height="7" rx="2" opacity=".4" /></>, true);
export const BrandMark = make(<path d="M12 1.8 13.4 9l6.2-3.9-3.9 6.2 7.3 1.4-7.3 1.4 3.9 6.2-6.2-3.9L12 23.7l-1.4-7.3-6.2 3.9 3.9-6.2-7.3-1.4 7.3-1.4-3.9-6.2L10.6 9z" />, true);

export const ButtonGlyph = make(<><rect x="2.5" y="6.5" width="19" height="11" rx="5.5" opacity=".35" /><rect x="6.5" y="10.5" width="11" height="3" rx="1.5" /></>, true);
export const InputGlyph = make(<><rect x="2.5" y="6" width="19" height="12" rx="3.5" opacity=".35" /><rect x="5.5" y="9" width="1.8" height="6" rx=".9" /><rect x="9" y="11" width="8" height="2" rx="1" opacity=".7" /></>, true);
export const ToggleGlyph = make(<><rect x="2" y="7" width="20" height="10" rx="5" opacity=".35" /><circle cx="17" cy="12" r="3.6" /></>, true);
export const CheckboxGlyph = make(<path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm10.3 5.3-5.6 5.6-2.9-2.9-1.4 1.4 4.3 4.3 7-7z" fillRule="evenodd" />, true);
export const RadioGlyph = make(<><path d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 2a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z" fillRule="evenodd" /><circle cx="12" cy="12" r="4" /></>, true);
export const TooltipGlyph = make(<path d="M5.5 3h13A2.5 2.5 0 0 1 21 5.5v8a2.5 2.5 0 0 1-2.5 2.5H14l-2 3-2-3H5.5A2.5 2.5 0 0 1 3 13.5v-8A2.5 2.5 0 0 1 5.5 3z" />, true);
export const PatternGlyph = make(<><rect x="3" y="3" width="5" height="5" rx="1.2" /><rect x="10" y="3" width="5" height="5" rx="1.2" opacity=".45" /><rect x="17" y="3" width="4" height="5" rx="1.2" /><rect x="3" y="10" width="5" height="5" rx="1.2" opacity=".45" /><rect x="10" y="10" width="5" height="5" rx="1.2" /><rect x="17" y="10" width="4" height="5" rx="1.2" opacity=".45" /><rect x="3" y="17" width="5" height="4" rx="1.2" /><rect x="10" y="17" width="5" height="4" rx="1.2" opacity=".45" /><rect x="17" y="17" width="4" height="4" rx="1.2" /></>, true);
export const BellGlyph = make(<path d="M12 2.5a6.5 6.5 0 0 1 6.5 6.5v4.2l1.8 3.3H3.7l1.8-3.3V9A6.5 6.5 0 0 1 12 2.5zM9.5 18.5h5a2.5 2.5 0 0 1-5 0z" />, true);

export const CATEGORY_GLYPHS: Record<CategoryId, (p: IconProps) => React.JSX.Element> = {
  loaders: LoaderGlyph,
  logos: LogoGlyph,
  text: TextGlyph,
  interactions: CursorGlyph,
  buttons: ButtonGlyph,
  inputs: InputGlyph,
  toggles: ToggleGlyph,
  checkboxes: CheckboxGlyph,
  radios: RadioGlyph,
  tooltips: TooltipGlyph,
  marquee: MarqueeGlyph,
  patterns: PatternGlyph,
  notifications: BellGlyph,
  navbars: NavGlyph,
  heroes: HeroGlyph,
  features: FeatureGlyph,
  pricing: PriceGlyph,
  testimonials: QuoteGlyph,
  stats: ChartGlyph,
  cta: CtaGlyph,
  faq: FaqGlyph,
  contact: MailGlyph,
  cards: CardGlyph,
  footers: FooterGlyph,
  pages: PageGlyph,
};
