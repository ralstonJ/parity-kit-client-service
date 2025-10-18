import { useEffect, useState } from "react";
import "./App.css";
import {
  eventStore,
  sendBatchedEvents,
  getDeviceType,
  getBrowserInfo,
  createHash,
} from "./store";

const handleBannerImpression = async () => {
  eventStore.addEvent({
    eventName: "banner_impression",
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    visitorHash: eventStore.hash[0],
    deviceType: eventStore.deviceType[0],
    browser: eventStore.browserType[0],
  });
};
interface TierData {
  country: string;
  country_flag: string;
  app_id: string;
  country_codes: string[];
  country_name: string;
  discount_type: string;
  discount_value: string;
  discount_code: string;
  content: string;
  style: string;
  active: boolean;
  message: string;
}

// Mock data for development
const mockTierData: TierData = {
  country: "BR",
  country_flag: "🇧🇷",
  app_id: "mock-app-id",
  country_codes: ["BR"],
  country_name: "Brazil",
  discount_type: "percentage",
  discount_value: "20",
  discount_code: "BRAZIL20",
  content: JSON.stringify({
    bannerText:
      "Special <strong>{discount_value}% off</strong> for {country_name} 🇧🇷! Use code {discount_code}",
    subtitleText:
      "{discount_value}% off for {country_name} - Code: {discount_code}",
    buttonText: "Get Discount",
    buttonUrl: "https://example.com/checkout",
  }),
  style: JSON.stringify({
    pppBanner: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      height: "48px",
      background: "linear-gradient(to right, #3dee3a, #3b82f6)",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "500",
      zIndex: "1000",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transform: "translateY(-100%)",
      transition: "transform 0.5s ease-in-out",
    },
    pppBannerContent: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: "1",
    },
    pppBannerIcon: {
      width: "20px",
      height: "20px",
      marginRight: "8px",
    },
    pppBannerMainText: {
      fontWeight: "600",
      margin: "0",
    },
    pppBannerSubtitle: {
      fontSize: "calc(16px * 0.875)",
      opacity: "0.9",
      margin: "0",
      alignItems: "center",
      gap: "4px",
      lineHeight: "1.2",
    },
    pppBannerCta: {
      backgroundColor: "#7c3aed",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      textDecoration: "none",
      display: "inline-block",
      opacity: "0.9",
    },
    pppBannerDismiss: {
      background: "none",
      border: "none",
      color: "inherit",
      fontSize: "18px",
      cursor: "pointer",
      padding: "4px",
      opacity: "1",
      transition: "opacity 0.2s ease-in-out",
    },
    copyIcon: {
      cursor: "pointer",
      padding: "2px",
      borderRadius: "4px",
      transition: "all 0.2s ease-in-out",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      verticalAlign: "middle",
      marginLeft: "4px",
    },
  }),
  active: true,
  message: "Mock data loaded successfully",
};

// Default fallback styles
const defaultBannerStyles = {
  pppBanner: {
    position: "fixed" as const,
    top: "0",
    left: "0",
    right: "0",
    height: "48px",
    background: "linear-gradient(to right, #3dee3a, #3b82f6)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    zIndex: "1000",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transform: "translateY(-100%)",
    transition: "transform 0.5s ease-in-out",
  },
  pppBannerContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: "1",
  },
  pppBannerIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
  },
  pppBannerMainText: {
    fontWeight: "600",
    margin: "0",
  },
  pppBannerSubtitle: {
    fontSize: "calc(16px * 0.875)",
    opacity: "0.9",
    margin: "0",
    alignItems: "center",
    gap: "4px",
    lineHeight: "1.2",
  },
  pppBannerCta: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    textDecoration: "none",
    display: "inline-block",
    opacity: "0.9",
  },
  pppBannerDismiss: {
    background: "none",
    border: "none",
    color: "inherit",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    opacity: "1",
    transition: "opacity 0.2s ease-in-out",
  },
  copyIcon: {
    cursor: "pointer",
    padding: "2px",
    borderRadius: "4px",
    transition: "all 0.2s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    marginLeft: "4px",
  },
};

function App() {
  const [tierData, setTierData] = useState<TierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [bannerStyles, setBannerStyles] = useState(defaultBannerStyles);
  const [isCopied, setIsCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [visitorHash, setVisitorHash] = useState<string>("");
  const [deviceType, setDeviceType] = useState<string>("");
  const [browserType, setBrowserType] = useState<string>("");
  const [hoveredToasts, setHoveredToasts] = useState(false);

  const credibilityClientAppId = document.getElementById(
    "worldwide-fair-payment-client-98765"
  )?.dataset.appId;

  const currentPath = window.location.pathname;
  const isDevelopment = import.meta.env.DEV;
  const apiUrl = isDevelopment
    ? "http://localhost:3012"
    : import.meta.env.VITE_PARITY_SERVER;
  const url = `${apiUrl}/api/tier/${credibilityClientAppId}?path=${currentPath}`;

  // Initialize hash when component mounts
  useEffect(() => {
    const initHash = async () => {
      const hash = await createHash();
      eventStore.hash.push(hash);
      setVisitorHash(hash);

      const deviceType = getDeviceType();
      eventStore.deviceType.push(deviceType);
      setDeviceType(deviceType);

      const browserType = getBrowserInfo();
      eventStore.browserType.push(browserType);
      setBrowserType(browserType);
    };
    initHash();
  }, []);

  // Track page view when component mounts
  useEffect(() => {
    if (visitorHash) {
      eventStore.addEvent({
        eventName: "page_view",
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        deviceType: deviceType,
        browser: browserType,
        visitorHash: visitorHash,
      });
    }
  }, [visitorHash, deviceType, browserType]);

  // Set up event sending interval
  useEffect(() => {
    const intervalId = setInterval(sendBatchedEvents, 15000); // 15 seconds

    return () => {
      clearInterval(intervalId);
      // Send any remaining events before unmounting
      sendBatchedEvents();
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `

      .banner-main-text {
        display: none;
      }

      .banner-subtitle-text {
        display: block; 
      }
      
      .banner {
        padding-left: 16px !important;
      }

      .banner-cta {
        margin-right: 10px !important;
      }

      .banner.show {
        transform: translateY(0) !important;
      }

      @media (min-width: 768px) {
       .banner {
          padding-left: 40px !important;
        }

        .banner-cta {
          margin-right: 30px !important;
        }

        .banner-main-text {
          display: block;
        }

        .banner-subtitle-text {
          display: none !important;
        }
      }

      .copy-discount-btn:hover {
        background-color: rgba(255, 255, 255, 0.25) !important;
        transform: scale(1.05) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup if component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (isDevelopment) {
      setTierData(mockTierData);
      setLoading(false);
      setError(null);

      // Parse and set banner styles from mock data.style
      if (mockTierData.style) {
        try {
          const parsedStyles = JSON.parse(mockTierData.style);
          // Ensure the banner starts hidden with transform
          parsedStyles.pppBanner = {
            ...parsedStyles.pppBanner,
            transform: "translateY(-100%)",
            transition: "transform 0.5s ease-in-out",
          };
          setBannerStyles(parsedStyles);
        } catch (parseError) {
          console.warn(
            "Failed to parse mockTierData.style, using default styles:",
            parseError
          );
          setBannerStyles(defaultBannerStyles);
        }
      } else {
        setBannerStyles(defaultBannerStyles);
      }

      // Show banner after 3 seconds with animation
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    } else {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: TierData) => {
          setTierData(data);

          // Parse and set banner styles from tierData.style
          if (data.style) {
            try {
              const parsedStyles = JSON.parse(data.style);
              // Ensure the banner starts hidden with transform
              parsedStyles.pppBanner = {
                ...parsedStyles.pppBanner,
                transform: "translateY(-100%)",
                transition: "transform 0.5s ease-in-out",
              };
              setBannerStyles(parsedStyles);
            } catch (parseError) {
              console.warn(
                "Failed to parse tierData.style, using default styles:",
                parseError
              );
              setBannerStyles(defaultBannerStyles);
            }
          } else {
            setBannerStyles(defaultBannerStyles);
          }

          setLoading(false);

          // Show banner after 3 seconds with animation
          setTimeout(() => {
            setShowBanner(true);
            handleBannerImpression();
          }, 3000);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [url, isDevelopment]);

  const handleClose = () => {
    eventStore.addEvent({
      eventName: "banner_dismiss",
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      visitorHash: visitorHash,
      deviceType: deviceType,
      browser: browserType,
    });
    setIsVisible(false);
  };

  const handleCopyCode = () => {
    eventStore.addEvent({
      eventName: "copy_discount_code",
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      visitorHash: visitorHash,
      deviceType: deviceType,
      browser: browserType,
    });
    if (tierData?.discount_code) {
      navigator.clipboard.writeText(tierData.discount_code);
      setIsCopied(true);
      // Reset the icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  // Copy icon SVG
  const CopyIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  // // Check icon SVG
  const CheckIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" fill="#22c55e"></circle>
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2"></path>
    </svg>
  );

  if (loading) {
    return <></>;
  }

  if (error) {
    return <></>;
  }

  if (!isVisible || !tierData?.active) {
    return <></>;
  }

  const bannerText = JSON.parse(tierData.content)?.bannerText;
  const subtitleText = JSON.parse(tierData.content)?.subtitleText;

  function replacePlaceholders(template: string) {
    return Object.entries({
      country_code: tierData?.country,
      country_flag: tierData?.country_flag,
      country_name: tierData?.country_name,
      discount_value: tierData?.discount_value,
    }).reduce((str, [key, value]) => {
      // Replace all occurrences, not just the first one
      const regex = new RegExp(`\\{${key}\\}`, "g");
      return str.replace(regex, value ?? "");
    }, template);
  }

  return (
    <>
      <div
        style={bannerStyles.pppBanner}
        className={`banner ${showBanner ? "show" : ""}`}
        onMouseEnter={() => {
          if (!hoveredToasts) {
            eventStore.addEvent({
              eventName: "banner_hover",
              path: window.location.pathname,
              timestamp: new Date().toISOString(),
              visitorHash: visitorHash,
              deviceType: deviceType,
              browser: browserType,
            });
            setHoveredToasts(true);
          }
        }}
      >
        <div style={bannerStyles.pppBannerContent}>
          <div>
            <div
              style={bannerStyles.pppBannerMainText}
              className="banner-main-text"
            >
              {(() => {
                const text = bannerText || "";
                const discountCodePlaceholder = "{discount_code}";
                const parts = text.split(discountCodePlaceholder);

                if (parts.length === 1) {
                  // No discount code placeholder found, render as single span
                  return (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(text) || "",
                      }}
                    />
                  );
                }

                // Split into 3 parts: before, discount code, after
                return (
                  <>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(parts[0]) || "",
                      }}
                    />
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {tierData.discount_code.replace(
                        "{discount_code}",
                        tierData.discount_code
                      )}
                      <span
                        className="copy-discount-btn"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: isCopied
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(255, 255, 255, 0.15)",
                          border: isCopied
                            ? "1px solid rgba(34, 197, 94, 0.3)"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                          transform: isCopied ? "scale(1.05)" : "scale(1)",
                        }}
                        onClick={handleCopyCode}
                        title={isCopied ? "Copied!" : "Copy discount code"}
                      >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                      </span>
                    </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(parts[1]) || "",
                      }}
                    />
                  </>
                );
              })()}
            </div>
            <div
              style={bannerStyles.pppBannerSubtitle}
              className="banner-subtitle-text"
            >
              {(() => {
                const text = subtitleText || "";
                const discountCodePlaceholder = "{discount_code}";
                const parts = text.split(discountCodePlaceholder);

                if (parts.length === 1) {
                  // No discount code placeholder found, render as single span
                  return (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(text) || "",
                      }}
                    />
                  );
                }

                // Split into 3 parts: before, discount code, after
                return (
                  <>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(parts[0]) || "",
                      }}
                    />
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {tierData.discount_code.replace(
                        "{discount_code}",
                        tierData.discount_code
                      )}
                      <span
                        className="copy-discount-btn"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: isCopied
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(255, 255, 255, 0.15)",
                          border: isCopied
                            ? "1px solid rgba(34, 197, 94, 0.3)"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                          transform: isCopied ? "scale(1.05)" : "scale(1)",
                        }}
                        onClick={handleCopyCode}
                        title={isCopied ? "Copied!" : "Copy discount code"}
                      >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                      </span>
                    </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(parts[1]) || "",
                      }}
                    />
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <a
          // style={bannerStyles.pppBannerCta}
          // onClick={handleCtaClick}
          // onMouseEnter={(e) => {
          //   e.currentTarget.style.transform = "translateY(-1px)";
          // }}
          // onMouseLeave={(e) => {
          //   e.currentTarget.style.transform = "translateY(0)";
          // }}
          style={{ ...bannerStyles.pppBannerCta, marginRight: "10px" }}
          href={JSON.parse(tierData.content)?.buttonUrl || "#"}
          target={JSON.parse(tierData.content)?.buttonUrl ? "_self" : "_self"}
          rel={
            JSON.parse(tierData.content)?.buttonUrl
              ? "noopener noreferrer"
              : undefined
          }
          className="banner-cta"
          onClick={() => {
            eventStore.addEvent({
              eventName: "banner_cta_click",
              path: window.location.pathname,
              timestamp: new Date().toISOString(),
              visitorHash: visitorHash,
              deviceType: deviceType,
              browser: browserType,
            });
          }}
        >
          {JSON.parse(tierData.content)?.buttonText}
        </a>

        <button
          style={bannerStyles.pppBannerDismiss}
          onClick={handleClose}
          aria-label="Close banner"
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}

export default App;
