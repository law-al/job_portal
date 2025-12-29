export const Grid3Columns = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>;
};

export const Grid2Columns = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
};

export const Grid1Column = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-1 gap-6">{children}</div>;
};
