import "./globals.css";
import Nav from "./components/Nav";
import SmoothScroll from "./components/SmoothScroll";
import ConnectFooter from "./components/ConnectFooter";

export const metadata = {
  title: "Sumedh Kamble",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Bebas+Neue&family=Caveat:wght@700&family=DM+Serif+Display:ital@1&family=DotGothic16&family=Fraunces:ital,opsz,wght@1,9..144,500&family=Inter:wght@400;500;600;700&family=League+Spartan:wght@300;400;500&family=Major+Mono+Display&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Poppins:wght@400;500;600;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@800&family=Tiro+Devanagari+Hindi&family=Unbounded:wght@800&family=Yeseva+One&family=Zilla+Slab:ital,wght@1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          paddingTop: 64,
          background: "#ffffff",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <Nav />
        <SmoothScroll />
        {children}
        <ConnectFooter />
      </body>
    </html>
  );
}
