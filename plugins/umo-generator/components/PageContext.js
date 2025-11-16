import { createContext, useContext, useState } from 'react';

export const PageContext_ = createContext({data:{}});
const MyErrorContext = createContext(null);

export const PageContext = ({children, data}) =>
{
    const [errors, setErrors] = useState([]);
    const reportError = ({ componentName, message }) => {
        setErrors(prev => {
            // Vérifie si le même message existe déjà pour ce composant
            const exists = prev.some(err => err.componentName === componentName && err.message === message);
            if (exists) return prev;
            return [...prev, { componentName, message }];
        });
    };

    // Regroupement par message pour montrer tous les composants concernés
    const groupedErrors = errors.reduce((acc, err) => {
        if (!acc[err.message]) acc[err.message] = [];
        acc[err.message].push(err.componentName);
        return acc;
    }, {});

  return (<>
    <MyErrorContext.Provider value={reportError}>
        <PageContext_.Provider value={data}>
        {/* Affichage des erreurs */}
        {errors.length > 0 && (
          <div style={{ backgroundColor: '#fee', color: '#900', padding: '1em', marginBottom: '1em', border: '1px solid #900' }}>
            <strong>Erreurs de contexte :</strong>
            <ul>
              {errors.map((err, i) => (
                <li key={i}>
                  <strong>{err.componentName}:</strong> {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        {children}
        </PageContext_.Provider>
    </MyErrorContext.Provider>
  </>);
}

export function getPageData() {
  return useContext(PageContext_);
}

export function useReportError() {
  const reportError = useContext(MyErrorContext);
  if (!reportError) {
    throw new Error('useReportError doit être utilisé à l’intérieur de PageContext');
  }

  return (message) => {
    // Stack trace pour récupérer le nom du composant
    const stack = new Error().stack;
    let componentName = 'Inconnu';

    if (stack) {
      const lines = stack.split('\n');
      if (lines[2]) {
        const match = lines[2].match(/at.*\(.*\/([^\/]*)\)/);
        if (match && match[1]) componentName = match[1];
      }
    }

    reportError({ componentName, message });
  };
}