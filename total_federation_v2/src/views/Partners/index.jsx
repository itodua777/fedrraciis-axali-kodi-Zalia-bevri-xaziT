import React from 'react';

const PartnershipsDashboard = () => {
  const [Component, setComponent] = React.useState(null);
  React.useEffect(() => {
    fetch('src/components/management/PartnershipManagement.tsx')
      .then(res => {
        if (!res.ok) throw new Error("ფაილის წაკითხვა ვერ მოხერხდა: PartnershipManagement.tsx");
        return res.text();
      })
      .then(code => {
        const compiled = window.Babel.transform(
          code
          .replace(/export\s+default\s+/g, 'window.PartnershipsDashboard = ')
          .replace(/import\s+.*\s+from\s+['"].*['"];?/g, ''),
          {
            presets: ['react', 'typescript'],
            filename: 'PartnershipManagement.tsx',
          }
        ).code;
        const runnable = compiled.replace(/export\s*\{\s*\}?;?/g, '');
        eval(runnable);
        if (window.PartnershipsDashboard) {
          setComponent(() => window.PartnershipsDashboard);
        }
      })
      .catch(err => console.error(err));
  }, []);
  if (!Component) return <div style={{ color: '#fff', padding: '20px' }}>იკვირთება კომპონენტი...</div>;
  return <Component />;
};

export default PartnershipsDashboard;
