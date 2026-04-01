type NavbarProps = {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
};

const Navbar = ({ leftContent, rightContent }: NavbarProps) => {
  if (!leftContent && !rightContent) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between glass rounded-2xl px-6 py-4 transition-all duration-300">
      {/* LEFT */}
      <div className="flex items-center gap-4">{leftContent}</div>
      {/* RIGHT */}
      <div className="flex items-center gap-4 md:gap-8">{rightContent}</div>
    </div>
  );
};

export default Navbar;
