import './globals.css';

export const metadata = {
  title: '1-Group SEM Optimizer',
  description: 'Multi-agent Google Ads analysis and Singapore-policy-aware optimisation co-pilot for 1-Group Singapore.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#faf7f2]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter+Tight:wght@300;400;500;600&display=swap"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23c9a961'/%3E%3Ctext x='16' y='22' font-family='serif' font-size='18' text-anchor='middle' fill='%230a0a0a'%3E1%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body className="bg-[#faf7f2] text-[#1a1814]" style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
