export const Button = ({ children, variant }: { children: React.ReactNode, variant: string }) => {
  return <div className={variant}>{children}</div>;
};
