import React from 'react';

const ManagementDashboard = ({ athletes }) => {
  const [Component, setComponent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const files = [
      { name: 'StaffRegistry', path: 'src/components/management/StaffRegistry.tsx' },
      { name: 'FoundersRegistry', path: 'src/components/management/FoundersRegistry.tsx' },
      { name: 'RegisteredStatusRegistry', path: 'src/components/management/RegisteredStatusRegistry.tsx' },
      { name: 'ManagementHub', path: 'src/components/management/ManagementHub.tsx' }
    ];

    const loadNext = async (index) => {
      if (index >= files.length) {
        if (window.ManagementHub) {
          setComponent(() => window.ManagementHub);
        } else {
          setError("ManagementHub component not registered on window!");
        }
        return;
      }

      const file = files[index];
      try {
        const res = await fetch(file.path + '?t=' + Date.now());
        if (!res.ok) throw new Error("ფაილის წაკითხვა ვერ მოხერხდა: " + file.name);
        let code = await res.text();
        
        // Strip imports and compile typescript React syntax
        code = code.replace(/import\s+.*\s+from\s+['"].*['"];?/g, '');
        
        if (file.name === 'ManagementHub') {
          code = `
            const StaffRegistry = window.StaffRegistry;
            const FoundersRegistry = window.FoundersRegistry;
            const { RegisteredStatusRegistry } = window;
            ${code}
          `;
          code = code.replace(/export\s+const\s+ManagementHub\s*(?::\s*[^=]+)?\s*=/g, 'const ManagementHub = window.ManagementHub =');
        } else if (file.name === 'RegisteredStatusRegistry') {
          code = code.replace(/export\s+const\s+RegisteredStatusRegistry\s*(?::\s*[^=]+)?\s*=/g, 'const RegisteredStatusRegistry = window.RegisteredStatusRegistry =');
        } else if (file.name === 'StaffRegistry') {
          code = code.replace(/export\s+const\s+StaffRegistry\s*(?::\s*[^=]+)?\s*=/g, 'const StaffRegistry = window.StaffRegistry =');
        } else if (file.name === 'FoundersRegistry') {
          code = code.replace(/export\s+const\s+FoundersRegistry\s*(?::\s*[^=]+)?\s*=/g, 'const FoundersRegistry = window.FoundersRegistry =');
        }

        // Clean any remaining export statements for const, let, var, class, function
        code = code.replace(/export\s+(const|let|var|class|function)\s+/g, '$1 ');

        const compiled = window.Babel.transform(code, {
          presets: ['react', 'typescript'],
          filename: file.name + '.tsx'
        }).code;

        const runnable = compiled.replace(/export\s*\{\s*\}?;?/g, '');
        eval(runnable);

        loadNext(index + 1);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    loadNext(0);
  }, []);

  if (error) return <div style={{ color: '#ef4444', padding: '20px' }}>შეცდომა ჩატვირთვისას: {error}</div>;
  if (!Component) return <div style={{ color: '#fff', padding: '20px' }}>იკვირთება კომპონენტი...</div>;
  return <Component athletes={athletes} />;
};

export default ManagementDashboard;
